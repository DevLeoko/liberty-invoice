import { Plan } from '$shared/plans'
import { z } from 'zod'
import { prisma } from '../prisma'
import { stripe } from '../stripe'
import { protectedProcedure, router } from '../trpc'
import { TError } from '../utils/TError'

export const subscriptionRouter = router({
	getCheckoutSessionUrl: protectedProcedure
		.input(
			z.object({
				plan: z.enum([Plan.PLUS]),
				billingCycle: z.enum(['monthly', 'yearly']),
				currency: z.enum(['usd', 'eur']),
			})
		)
		.query(async ({ ctx: { userId }, input: { billingCycle, currency } }) => {
			const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })

			const checkoutSession = await stripe.checkout.sessions.create({
				client_reference_id: userId,
				customer_email: user.email,
				mode: 'subscription',
				line_items: [
					{
						price:
							billingCycle === 'monthly'
								? process.env.STRIPE_PLUS_SUBSCRIPTION_MONTHLY
								: process.env.STRIPE_PLUS_SUBSCRIPTION_YEARLY,
						quantity: 1,
					},
				],
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
			return_url: process.env.STRIPE_PORTAL_RETURN_URL,
		})

		return {
			url: portalSession.url,
		}
	}),
})
