import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { router } from '../trpc'

export const appRouter = router({
	// auth: authRouter,
	// client: clientRouter,
	// userSettings: userSettingsRouter,
	// invoice: invoiceRouter,
	// textFragment: textFragmentRouter,
	// taxRate: taxRateRouter,
	// stats: statsRouter,
	// product: productRouter,
})

export type AppRouter = typeof appRouter
export type RouterOutput = inferRouterOutputs<AppRouter>
export type RouterInput = inferRouterInputs<AppRouter>
