import { computeTotalExcludingTax, computeTotalWithTax } from '$shared/invoice-computations'
import { Plan } from '$shared/plans'
import { z } from 'zod'
import {
	LIST_INVOICE_DEFAULT_INCLUDES,
	READ_INVOICE_DEFAULT_INCLUDES,
	finalizeInvoice,
	sendInvoiceEmail,
} from '../controller/invoice'
import { claimInvoiceId, getNextAvailablePartialId } from '../controller/invoice-ids'
import { prisma } from '../prisma'
import { protectedProcedure, router } from '../trpc'
import { TError } from '../utils/TError'
import { verifyClientOwnership } from './client'
import type { InvoiceCreateInput } from './invoice-schemas'
import { invoiceCreateSchema, invoiceListSchema } from './invoice-schemas'
import { verifyProductOwnership } from './product'

const INVOICE_MAIL_FREE_RATE_LIMIT = 5
const INVOICE_MAIL_PLUS_RATE_LIMIT = 100
const INVOICE_MAIL_RATE_LIMIT_PERIOD = 7 * 24 * 60 * 60 * 1000

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
	list: protectedProcedure.input(invoiceListSchema).query(async ({ ctx, input }) => {
		const { status, issuedBefore, search, take, skip } = input

		const statusWhereStatements: string[] = []

		if (status && status.length != 3) {
			if (status.includes('draft')) {
				statusWhereStatements.push('`Invoice`.`draft` = 1')
			}
			if (status.includes('outstanding')) {
				statusWhereStatements.push(
					'`Invoice`.`amountPaid` < `Invoice`.`amountWithTax` AND `Invoice`.`draft` = 0'
				)
			}
			if (status.includes('paid')) {
				statusWhereStatements.push('`Invoice`.`amountPaid` >= `Invoice`.`amountWithTax`')
			}
		}

		const invoiceIds = await prisma.$queryRawUnsafe<{ id: string }[]>(
			`
			SELECT \`Invoice\`.\`id\`
			FROM \`Invoice\`
			${search ? 'LEFT JOIN `Client` ON `Invoice`.`clientId` = `Client`.`id`' : ''}
			WHERE \`Invoice\`.\`userId\` = ?
				${statusWhereStatements.length > 0 ? `AND (${statusWhereStatements.join(' OR ')})` : ''}
				${issuedBefore ? 'AND `Invoice`.`date` < ?' : ''}
				${search ? 'AND (CONCAT(`Client`.`name`, " ", `Client`.`firstName`, " ", `Client`.`lastName`, " ", `Client`.`shorthand`) LIKE ? OR `Invoice`.`invoiceNumber` LIKE ?)' : ''}
			ORDER BY \`Invoice\`.\`date\` DESC
			LIMIT ? OFFSET ?
		`,
			ctx.userId,
			...(issuedBefore ? [issuedBefore] : []),
			...(search ? [`%${search}%`, `%${search}%`] : []),
			take + 1,
			skip
		)

		// We could just do all this in one query, but this makes it more typesafe
		const invoices = prisma.invoice.findMany({
			where: {
				id: {
					in: invoiceIds.map((invoice) => invoice.id).slice(0, take),
				},
			},
			orderBy: {
				date: 'desc',
			},
			include: LIST_INVOICE_DEFAULT_INCLUDES,
		})

		return {
			results: await invoices,
			hasMore: invoiceIds.length > take,
		}
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

	finalize: protectedProcedure
		.input(
			z.object({
				id: z.string(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			await verifyInvoiceOwnership(input.id, ctx.userId)

			return await finalizeInvoice(input.id)
		}),

	sendMail: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				email: z.string(),
				cc: z.string().optional(),
				bcc: z.string().optional(),
				content: z.object({ subject: z.string(), body: z.string() }).nullable(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			await verifyInvoiceOwnership(input.id, ctx.userId)

			// Custom content is only available for Plus plan
			if (input.content != null && ctx.plan != Plan.PLUS) {
				throw new TError('error.onlyForPlusPlan')
			}

			// Check Mail Rate Limit
			const user = await prisma.user.findUniqueOrThrow({
				where: { id: ctx.userId },
				select: { invoiceMailCount: true, invoiceMailCountPeriodStart: true },
			})

			const isInCurrentPeriod =
				Date.now() - user.invoiceMailCountPeriodStart.getTime() < INVOICE_MAIL_RATE_LIMIT_PERIOD

			if (isInCurrentPeriod) {
				if (
					user.invoiceMailCount >=
					(ctx.plan === Plan.PLUS ? INVOICE_MAIL_PLUS_RATE_LIMIT : INVOICE_MAIL_FREE_RATE_LIMIT)
				) {
					throw new TError('error.invoiceMailRateLimitExceeded')
				}

				await prisma.user.update({
					where: { id: ctx.userId },
					data: { invoiceMailCount: { increment: 1 } },
				})
			} else {
				await prisma.user.update({
					where: { id: ctx.userId },
					data: { invoiceMailCount: 1, invoiceMailCountPeriodStart: new Date() },
				})
			}

			await sendInvoiceEmail({
				invoiceId: input.id,
				email: input.email,
				cc: input.cc,
				bcc: input.bcc,
				content: input.content,
				sendingUserId: ctx.userId,
			})
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
