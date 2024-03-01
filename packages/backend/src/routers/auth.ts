import { z } from 'zod'
import {
	loginWithGoogle,
	loginWithPassword,
	requestPasswordReset,
	resetPassword,
	signUpWithPassword,
	verifyMailToken,
} from '../controller/auth-flows'
import { prisma } from '../prisma'
import { protectedProcedure, publicProcedure, router } from '../trpc'
import { TError } from '../utils/TError'
import { verifyRecaptcha } from '../utils/recaptcha'

export const authRouter = router({
	loginWithPassword: publicProcedure
		.input(
			z.object({
				email: z.string().email(),
				password: z.string(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { accessToken, refreshToken } = await loginWithPassword(input.email, input.password)

			ctx.res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production',
			})

			ctx.res.cookie('accessToken', accessToken, {
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production',
			})
		}),

	signUpWithPassword: publicProcedure
		.input(
			z.object({
				token: z.string(),
				email: z.string().email(),
				password: z.string(),
				marketingEmails: z.boolean(),
				langCode: z.string(),
			})
		)
		.mutation(async ({ input }) => {
			if (!verifyRecaptcha(input.token)) throw new TError('error.failedCaptcha')

			await signUpWithPassword(input.email, input.password, input.marketingEmails, input.langCode)
		}),

	loginWithGoogle: publicProcedure
		.input(
			z.object({
				token: z.string(),
				createAccountIfNotFound: z.boolean(),
				marketingEmails: z.boolean().optional(),
				langCode: z.string().optional(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { accessToken, refreshToken } = await loginWithGoogle(
				input.token,
				input.createAccountIfNotFound,
				input.marketingEmails,
				input.langCode
			)

			ctx.res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production',
			})

			ctx.res.cookie('accessToken', accessToken, {
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production',
			})
		}),

	verifyEmail: publicProcedure
		.input(
			z.object({
				token: z.string(),
				email: z.string().email(),
			})
		)
		.mutation(async ({ input }) => {
			await verifyMailToken(input.token, input.email)
		}),

	// TODO: add google recaptcha check for public reset requests
	requestPasswordReset: publicProcedure
		.input(
			z.object({
				email: z.string().email(),
				token: z.string(),
			})
		)
		.mutation(async ({ input }) => {
			if (!verifyRecaptcha(input.token)) throw new TError('error.failedCaptcha')

			const user = await prisma.user.findUnique({
				where: { email: input.email },
				select: { email: true },
			})

			if (user) {
				await requestPasswordReset(input.email)
			} // We don't want to leak if a user exists or not
		}),

	requestPasswordResetNoCaptcha: protectedProcedure
		.input(z.object({ signOutAllDevices: z.boolean() }))
		.mutation(async ({ ctx, input }) => {
			const user = await prisma.user.findUnique({
				where: { id: ctx.userId },
				select: { email: true, passwordHash: true },
			})

			if (!user || !user.passwordHash) {
				throw new TError('error.internalServerError')
			}

			if (input.signOutAllDevices) {
				await prisma.user.update({
					where: { id: ctx.userId },
					data: { refreshSession: null },
				})
			}

			await requestPasswordReset(user.email)
		}),

	resetPassword: publicProcedure
		.input(
			z.object({
				token: z.string(),
				email: z.string().email(),
				password: z.string(),
			})
		)
		.mutation(async ({ input }) => {
			await resetPassword(input)
		}),

	me: protectedProcedure.query(async ({ ctx }) => {
		const user = await prisma.user.findUnique({
			where: { id: ctx.userId },
			select: { email: true, passwordHash: true },
		})

		if (!user) {
			throw new TError('error.internalServerError')
		}

		return { email: user.email, isPasswordAccount: !!user.passwordHash }
	}),

	deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
		await prisma.$transaction([
			prisma.invoice.deleteMany({ where: { userId: ctx.userId } }),
			prisma.user.delete({ where: { id: ctx.userId } }),
		])
	}),
})
