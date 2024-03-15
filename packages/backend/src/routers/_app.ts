import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { router } from '../trpc'
import { authRouter } from './auth'
import { clientRouter } from './client'
import { invoiceRouter } from './invoice'
import { productRouter } from './product'
import { statsRouter } from './stats'
import { subscriptionRouter } from './subscription'
import { taxRateRouter } from './tax-rate'
import { textFragmentRouter } from './text-fragment'
import { userSettingsRouter } from './user-settings'

export const appRouter = router({
	auth: authRouter,
	client: clientRouter,
	userSettings: userSettingsRouter,
	invoice: invoiceRouter,
	textFragment: textFragmentRouter,
	taxRate: taxRateRouter,
	stats: statsRouter,
	product: productRouter,
	planSubscription: subscriptionRouter,
})

export type AppRouter = typeof appRouter
export type RouterOutput = inferRouterOutputs<AppRouter>
export type RouterInput = inferRouterInputs<AppRouter>
