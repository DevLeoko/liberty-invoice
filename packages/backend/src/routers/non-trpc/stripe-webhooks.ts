import type { Request, Response } from 'express'
import type Stripe from 'stripe'
import { prisma } from '../../prisma'
import { stripe } from '../../stripe'

const SUBSCRIPTION_TOLERANCE = 1000 * 60 * 60 * 24 * 2.5

export async function stripeWebhookHandler(req: Request, res: Response) {
	const sig = req.headers['stripe-signature'] as string

	let event

	try {
		event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
	} catch (err) {
		res.status(400).send(`Webhook Error: ${(err as any).message}`)
		return
	}

	// Handle the event
	try {
		switch (event.type) {
			case 'checkout.session.completed':
				await onCheckoutSessionCompleted(
					event as Extract<Stripe.Event, { type: 'checkout.session.completed' }>
				)
				break
			case 'invoice.paid':
				await onInvoicePaid(event as Extract<Stripe.Event, { type: 'invoice.paid' }>)
				break

			default:
				console.log(`Unhandled event type ${event.type}`)
		}
	} catch (err) {
		console.error(err)
		res.status(500).send('Error occurred while processing webhook')
		return
	}

	// Return a 200 response to acknowledge receipt of the event
	res.send()
}

async function onCheckoutSessionCompleted(
	event: Extract<Stripe.Event, { type: 'checkout.session.completed' }>
) {
	const customerId = event.data.object.customer!
	const userId = event.data.object.client_reference_id!

	prisma.user.update({
		where: { id: userId },
		data: {
			stripeCustomerId: customerId.toString(),
		},
	})
}

async function onInvoicePaid(event: Extract<Stripe.Event, { type: 'invoice.paid' }>) {
	const customerId = event.data.object.customer!

	const user = await prisma.user.findFirst({
		where: {
			stripeCustomerId: customerId.toString(),
		},
		select: {
			id: true,
		},
	})

	if (!user) {
		throw new Error('User not found')
	}

	const subscription_item = event.data.object.lines.data[0]

	const subscriptionId = subscription_item.subscription as string | undefined
	const plan = subscription_item.price?.metadata?.plan
	const validUntil = subscription_item.period.end

	if (!subscriptionId || !plan || !validUntil) {
		return
	}

	await prisma.user.update({
		where: {
			id: user.id,
		},
		data: {
			activePlan: plan,
			stripeSubscriptionId: subscriptionId,
			planValidUntil: new Date(validUntil * 1000 + SUBSCRIPTION_TOLERANCE),
		},
	})
}
