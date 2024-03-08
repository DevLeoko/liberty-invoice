import type { Prisma, Product } from '@prisma/client'
import { z } from 'zod'
import { computeTotalExcludingTax, computeTotalWithTax } from '../../../shared/invoice-computations'
import { claimInvoiceId, getNextAvailablePartialId } from '../controller/invoice-ids'
import { prisma } from '../prisma'
import { protectedProcedure, router } from '../trpc'
import { TError } from '../utils/TError'
import { verifyClientOwnership } from './client'
import type { InvoiceCreateInput } from './invoice-schemas'
import { invoiceCreateSchema } from './invoice-schemas'
import { verifyProductOwnership } from './product'

const LIST_INVOICE_DEFAULT_INCLUDES = {
	client: {
		select: {
			name: true,
			firstName: true,
			lastName: true,
		},
	},
	items: true,
	taxRates: {
		select: {
			id: true,
		},
	},
} satisfies Prisma.InvoiceInclude

const READ_INVOICE_DEFAULT_INCLUDES = {
	client: true,
	items: true,
	taxRates: {
		select: {
			id: true,
		},
	},
} satisfies Prisma.InvoiceInclude

async function verifyInvoiceOwnership(invoiceId: string, userId: string) {
	const invoice = await prisma.invoice.findUnique({
		where: {
			id: invoiceId,
		},
		select: {
			userId: true,
		},
	})

	if (invoice?.userId !== userId) {
		throw new TError('error.invoice.notFound')
	}
}

async function verifyInvoiceDataOwnership(invoiceData: InvoiceCreateInput, userId: string) {
	// Check if the client, tax rates and products are owned by the user
	const [taxRates, clientOwnership, productOwnership] = await Promise.all([
		prisma.taxRate.findMany({
			where: { id: { in: invoiceData.taxRateIds }, userId: userId },
		}),
		verifyClientOwnership([invoiceData.clientId], userId),
		verifyProductOwnership(
			invoiceData.items.map((item) => item.productId).filter((id) => id != null) as string[],
			userId
		),
	])

	return {
		hasOwnership:
			clientOwnership && productOwnership && taxRates.length == invoiceData.taxRateIds.length,
		taxRates,
	}
}

export const invoiceRouter = router({
	list: protectedProcedure.query(async ({ ctx }) => {
		return prisma.invoice.findMany({
			where: {
				userId: ctx.userId,
			},
			orderBy: {
				date: 'desc',
			},
			include: LIST_INVOICE_DEFAULT_INCLUDES,
		})
	}),

	create: protectedProcedure
		.input(
			z.object({
				partialId: z.number().optional(),
				invoice: invoiceCreateSchema,
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { partialId, invoice } = input

			if (partialId != undefined) {
				const success = await claimInvoiceId(ctx.userId, partialId)
				if (!success) {
					throw new TError('error.invoice.partialIdAlreadyClaimed')
				}
			}

			const { hasOwnership, taxRates } = await verifyInvoiceDataOwnership(invoice, ctx.userId)
			if (!hasOwnership) throw new TError('error.internalServerError')

			try {
				return prisma.invoice.create({
					data: {
						userId: ctx.userId,
						clientId: invoice.clientId,
						invoiceNumber: invoice.invoiceNumber,
						date: invoice.date,
						dueDate: invoice.dueDate,
						currency: invoice.currency,
						language: invoice.language,
						taxRates: {
							connect: invoice.taxRateIds.map((id) => ({ id })),
						},
						note: invoice.note,
						items: {
							create: invoice.items.map((item) => ({
								...item,

								userId: ctx.userId,
							})),
						},
						amountWithoutTax: computeTotalExcludingTax(invoice),
						amountWithTax: computeTotalWithTax({
							...invoice,
							taxRates,
						}),
						amountPaid: 0,
					},
					include: READ_INVOICE_DEFAULT_INCLUDES,
				})
			} catch (e: any) {
				// Duplicate invoice number
				if (e.code === 'P2002') {
					throw new TError('error.invoice.partialIdAlreadyClaimed')
				}

				throw e
			}
		}),

	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				invoice: invoiceCreateSchema,
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { id, invoice } = input

			const existingInvoice = await prisma.invoice.findUnique({
				where: {
					id,
				},
				select: {
					userId: true,
				},
			})

			if (existingInvoice?.userId !== ctx.userId) {
				throw new TError('error.invoice.notFound')
			}

			const { hasOwnership, taxRates } = await verifyInvoiceDataOwnership(invoice, ctx.userId)
			if (!hasOwnership) throw new TError('error.internalServerError')

			const updatedInvoice = await prisma.invoice.update({
				where: {
					id,
				},
				data: {
					clientId: invoice.clientId,
					invoiceNumber: invoice.invoiceNumber,
					date: invoice.date,
					dueDate: invoice.dueDate,
					currency: invoice.currency,
					language: invoice.language,
					taxRates: {
						set: invoice.taxRateIds.map((id) => ({ id })),
					},
					note: invoice.note,
					items: {
						deleteMany: {},
						create: invoice.items.map((item) => ({
							...item,

							userId: ctx.userId,
						})),
					},
					amountWithoutTax: computeTotalExcludingTax(invoice),
					amountWithTax: computeTotalWithTax({
						...invoice,
						taxRates,
					}),
				},
				include: READ_INVOICE_DEFAULT_INCLUDES,
			})

			return updatedInvoice
		}),

	delete: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
		await verifyInvoiceOwnership(input, ctx.userId)

		await prisma.invoice.delete({
			where: {
				id: input,
			},
		})
	}),

	read: protectedProcedure.input(z.string()).query(async ({ input, ctx }) => {
		const invoice = await prisma.invoice.findUnique({
			where: {
				id: input,
			},
			include: READ_INVOICE_DEFAULT_INCLUDES,
		})

		if (invoice?.userId !== ctx.userId) {
			throw new TError('error.invoice.notFound')
		}

		return invoice
	}),

	finalize: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
		await verifyInvoiceOwnership(input, ctx.userId)

		const products = await prisma.invoiceItem.findMany({
			where: {
				invoiceId: input,
				product: {
					stockedUnits: {
						not: {
							equals: null,
						},
					},
				},
			},
			select: {
				quantity: true,
				productId: true,
			},
		})

		const updateQueries = [
			...products.map((product) =>
				prisma.product.update({
					where: {
						id: product.productId!,
					},
					data: {
						stockedUnits: {
							decrement: product.quantity,
						},
					},
				})
			),
			prisma.invoice.update({
				where: {
					id: input,
				},
				data: {
					draft: false,
				},
				include: LIST_INVOICE_DEFAULT_INCLUDES,
			}),
		]

		const results = await prisma.$transaction(updateQueries)

		// TODO: This should just be `as Prisma.InvoiceGetPayload<{ include: LIST_INVOICE_DEFAULT_INCLUDES }>` but it gives an type error
		return results[results.length - 1] as Exclude<(typeof results)[0], Product>
	}),

	logPayment: protectedProcedure
		.input(z.object({ id: z.string(), amount: z.number() }))
		.mutation(async ({ input, ctx }) => {
			await verifyInvoiceOwnership(input.id, ctx.userId)

			return await prisma.invoice.update({
				where: {
					id: input.id,
				},
				data: {
					amountPaid: {
						increment: input.amount,
					},
				},
				include: LIST_INVOICE_DEFAULT_INCLUDES,
			})
		}),

	// Todo: this only works if invoice date is in the current interval!
	getNextAvailablePartialInvoiceId: protectedProcedure.query(async ({ ctx }) => {
		return await getNextAvailablePartialId(ctx.userId)
	}),
})
