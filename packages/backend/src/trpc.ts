import { Plan } from '$shared/plans'
import { initTRPC } from '@trpc/server'
import type { Response } from 'express'
import SuperJSON from 'superjson'
import { TError } from './utils/TError'

const t = initTRPC.context<{ userId?: string; plan?: Plan | null; res: Response }>().create({
	transformer: SuperJSON,
})

const isAuthenticated = t.middleware(({ next, ctx }) => {
	if (ctx.userId == undefined) {
		throw new TError('error.notAuthenticated')
	}

	return next({
		ctx: {
			userId: ctx.userId!,
			res: ctx.res,
		},
	})
})

const isPlusPlan = t.middleware(({ next, ctx }) => {
	if (ctx.plan !== Plan.PLUS) {
		throw new TError('error.onlyForPlusPlan')
	}

	return next({
		ctx: {
			userId: ctx.userId!,
			res: ctx.res,
		},
	})
})

export const middleware = t.middleware
export const router = t.router
export const mergeRouters = t.mergeRouters

export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(isAuthenticated)
export const plusPlanProcedure = t.procedure.use(isAuthenticated).use(isPlusPlan)
