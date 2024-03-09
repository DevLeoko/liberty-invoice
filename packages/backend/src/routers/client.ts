import { z } from 'zod'
import { prisma } from '../prisma'
import { protectedProcedure, router } from '../trpc'
import { TError } from '../utils/TError'
import type { ClientListQuery } from './client-schema'
import { clientInputSchema, clientListSchema } from './client-schema'

export const clientRouter = router({
	read: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
		const client = await prisma.client.findUnique({
			where: {
				id: input.id,
			},
			include: {
				user: {
					select: {
						id: true,
					},
				},
				textFragments: {
					select: {
						key: true,
						value: true,
					},
				},
			},
		})

		if (!client || client.user.id !== ctx.userId) throw new TError('error.client.notFound')

		return client
	}),

	readDefaults: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const client = await prisma.client.findUnique({
				where: {
					id: input.id,
				},
				select: {
					defaultCurrency: true,
					defaultDueDays: true,
					defaultLanguage: true,
					defaultTaxRateId: true,
					userId: true,
				},
			})

			if (!client || client.userId !== ctx.userId) throw new TError('error.client.notFound')

			return client
		}),

	list: protectedProcedure.input(clientListSchema).query(async ({ ctx, input }) => {
		return listClients(ctx.userId, input, false)
	}),

	listDetailed: protectedProcedure.input(clientListSchema).query(async ({ ctx, input }) => {
		return listClients(ctx.userId, input, true)
	}),

	create: protectedProcedure.input(clientInputSchema).mutation(async ({ ctx, input }) => {
		return prisma.client.create({
			data: {
				...input,
				textFragments: {
					createMany: {
						data: input.textFragments.map((fragment) => ({
							userId: ctx.userId,
							key: fragment.key,
							value: fragment.value,
							language: null,
						})),
					},
				},
				userId: ctx.userId,
			},
		})
	}),

	toggleFavorite: protectedProcedure
		.input(z.object({ id: z.string(), isFavorite: z.boolean() }))
		.mutation(async ({ ctx, input }) => {
			await prisma.client.updateMany({
				where: {
					id: input.id,
					userId: ctx.userId,
				},
				data: {
					isFavorite: input.isFavorite,
				},
			})
		}),

	toggleArchived: protectedProcedure
		.input(z.object({ id: z.string(), isArchived: z.boolean() }))
		.mutation(async ({ ctx, input }) => {
			await prisma.client.updateMany({
				where: {
					id: input.id,
					userId: ctx.userId,
				},
				data: {
					isArchived: input.isArchived,
				},
			})
		}),

	update: protectedProcedure
		.input(z.object({ id: z.string(), client: clientInputSchema.partial() }))
		.mutation(async ({ ctx, input }) => {
			await prisma.client.updateMany({
				where: {
					id: input.id,
					userId: ctx.userId,
				},
				data: {
					...{ ...input.client, textFragments: undefined },
				},
			})

			if (input.client?.textFragments) {
				await prisma.textFragment.deleteMany({
					where: {
						clientId: input.id,
						userId: ctx.userId,
					},
				})

				await prisma.textFragment.createMany({
					data: input.client.textFragments.map((fragment) => ({
						clientId: input.id,
						key: fragment.key,
						value: fragment.value,
						language: null,
						userId: ctx.userId,
					})),
				})
			}
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await prisma.client.deleteMany({
				where: {
					id: input.id,
					userId: ctx.userId,
				},
			})
		}),
})

async function getDefaultCurrency(userId: string) {
	return (await prisma.userSettings.findUnique({ where: { userId } }))?.defaultCurrency
}

async function listClients<T extends boolean>(
	userId: string,
	query: ClientListQuery,
	includeStats: T
) {
	const { take, skip, isArchived, isFavorite, search } = query

	// Select stats about all invoices and invoices in the last 90 days
	const clients = await prisma.$queryRawUnsafe<
		({
			id: string
			name: string
			firstName: string
			lastName: string
			shorthand: string
			isFavorite: boolean
			isArchived: boolean
			createdAt: Date
		} & (T extends true
			? {
					totalAmount: number | null
					totalAmountLast90Days: number | null
					invoiceCount: number
					invoiceCountLast90Days: number
					lastInvoiceDate: Date | null
				}
			: unknown))[]
	>(
		`SELECT \`Client\`.\`id\`, \`Client\`.\`name\`, \`Client\`.\`firstName\`, \`Client\`.\`lastName\`, \`Client\`.\`shorthand\`, \`Client\`.\`isFavorite\`, \`Client\`.\`isArchived\`, \`Client\`.\`createdAt\`
		${
			includeStats
				? `,
			SUM(\`Invoice\`.\`amountWithTax\` * \`CurrencyExchangeRates\`.rate) AS \`totalAmount\`, 
			SUM(IF(\`Invoice\`.\`date\` > DATE_SUB(NOW(), INTERVAL 90 DAY), \`Invoice\`.\`amountWithTax\` * \`CurrencyExchangeRates\`.rate, 0)) AS \`totalAmountLast90Days\`,
			COUNT(\`Invoice\`.\`id\`) AS \`invoiceCount\` ,
			SUM(IF(\`Invoice\`.\`date\` > DATE_SUB(NOW(), INTERVAL 90 DAY), 1, 0)) AS \`invoiceCountLast90Days\`,
			MAX(\`Invoice\`.\`date\`) AS \`lastInvoiceDate\``
				: ''
		}
		FROM \`Client\`
		${
			includeStats
				? `
		LEFT JOIN \`Invoice\` ON \`Client\`.\`id\` = \`Invoice\`.\`clientId\`
		LEFT JOIN \`CurrencyExchangeRates\` ON \`Invoice\`.currency = \`CurrencyExchangeRates\`.fromCurrency AND \`CurrencyExchangeRates\`.toCurrency = ?
		`
				: ''
		}
		WHERE \`Client\`.\`userId\` = ? 
			${isArchived !== undefined ? 'AND `Client`.`isArchived` = ?' : ''} 
			${isFavorite !== undefined ? 'AND `Client`.`isFavorite` = ?' : ''} 
			${search ? 'AND (CONCAT(`Client`.`name`, " ", `Client`.`firstName`, " ", `Client`.`lastName`, " ", `Client`.`shorthand`) LIKE ?)' : ''}
		GROUP BY \`Client\`.\`id\`
		ORDER BY \`Client\`.\`isFavorite\` DESC, CONCAT(\`Client\`.\`name\`, \`Client\`.\`firstName\`, \`Client\`.\`lastName\`) ASC
		LIMIT ? OFFSET ?`,
		...(includeStats ? [await getDefaultCurrency(userId)!] : []),
		userId,
		...(isArchived !== undefined ? [isArchived] : []),
		...(isFavorite !== undefined ? [isFavorite] : []),
		...(search ? [`%${search}%`] : []),
		take + 1,
		skip
	)

	return {
		results: clients.slice(0, take),
		hasMore: clients.length > take,
	}
}

export async function verifyClientOwnership(clientIds: string[], userId: string) {
	if (clientIds.length === 0) return true

	const clientCount = await prisma.client.count({
		where: {
			id: {
				in: clientIds,
			},
			userId,
		},
	})

	return clientCount === clientIds.length
}
