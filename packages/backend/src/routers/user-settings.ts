import { z } from 'zod'
import { prisma } from '../prisma'
import { protectedProcedure, router } from '../trpc'
import { clientInputSchema } from './client-schema'

const userSettingsInputSchema = clientInputSchema.extend({
	logoUrl: z.string(),
	bankName: z.string(),
	iban: z.string(),
	bic: z.string(),

	idFormat: z.string(),
	nextPartialId: z.number(),
	partialIdDate: z.date(),
	enableTaxPerItem: z.boolean(),
	enableMultilingual: z.boolean(),

	marketingEmails: z.boolean(),
})

export const userSettingsRouter = router({
	read: protectedProcedure.query(async ({ ctx }) => {
		return (await prisma.userSettings.findUnique({
			where: {
				userId: ctx.userId,
			},
		}))!
	}),

	update: protectedProcedure
		.input(userSettingsInputSchema.partial())
		.mutation(async ({ ctx, input }) => {
			return prisma.userSettings.updateMany({
				where: {
					userId: ctx.userId,
				},
				data: {
					...input,
				},
			})
		}),
})
