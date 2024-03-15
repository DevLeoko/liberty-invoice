import { Plan } from '$shared/plans'
import { z } from 'zod'
import { prisma } from '../prisma'
import { stripe } from '../stripe'
import { protectedProcedure, router } from '../trpc'
import { TError } from '../utils/TError'

export const subscriptionRouter = router({
	readSubscriptionStatus: protectedProcedure.query(async ({ ctx: { userId } }) => {
		const user = await prisma.user.findUniqueOrThrow({
			where: { id: userId },
			select: { activePlan: true, planValidUntil: true, stripeCustomerId: true },
		})

		return user
	}),

	getCheckoutSessionUrl: protectedProcedure
		.input(
			z.object({
				plan: z.enum([Plan.PLUS] as const),
				billingCycle: z.enum(['monthly', 'yearly']),
				currency: z.enum(['usd', 'eur']),
			})
		)
		.query(async ({ ctx: { userId }, input: { billingCycle, currency } }) => {
			const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })

			const checkoutSession = await stripe.checkout.sessions.create({
				customer_email: user.email,
				mode: 'subscription',
				success_url: process.env.SUBSCRIPTION_RETURN_URL,
				cancel_url: process.env.SUBSCRIPTION_RETURN_URL,
				line_items: [
					{
						price:
							billingCycle === 'monthly'
								? process.env.STRIPE_PLUS_SUBSCRIPTION_MONTHLY
								: process.env.STRIPE_PLUS_SUBSCRIPTION_YEARLY,
						quantity: 1,
					},
				],
				subscription_data: {
					metadata: {
						userId: user.id,
					},
				},
				currency,
			})

			return {
				url: checkoutSession.url,
			}
		}),

	getCustomerPortalUrl: protectedProcedure.query(async ({ ctx: { userId } }) => {
		const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })

		if (!user.stripeCustomerId) throw new TError('error.internalServerError')

		const portalSession = await stripe.billingPortal.sessions.create({
			customer: user.stripeCustomerId,
			return_url: process.env.SUBSCRIPTION_RETURN_URL,
		})

		return {
			url: portalSession.url,
		}
	}),
})
