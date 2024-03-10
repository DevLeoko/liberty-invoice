import { z } from 'zod'

export const invoiceItemCreateSchema = z.object({
	name: z.string(),
	description: z.string(),
	quantity: z.number(),
	unit: z.string(),
	unitPrice: z.number(),

	productId: z.string().nullable(),
})

export const invoiceCreateSchema = z.object({
	clientId: z.string(),
	invoiceNumber: z.string(),
	date: z.date(),
	dueDate: z.date(),
	currency: z.string(),
	language: z.string(),
	taxRateIds: z.array(z.string()),
	note: z.string(),
	items: z.array(invoiceItemCreateSchema),
})

export type InvoiceCreateInput = z.infer<typeof invoiceCreateSchema>
export type InvoiceItemCreateInput = z.infer<typeof invoiceItemCreateSchema>

export const invoiceListSchema = z.object({
	status: z.array(z.enum(['draft', 'outstanding', 'paid'])).optional(),
	issuedBefore: z.date().optional(),
	search: z.string().optional(),
	take: z.number().max(100).default(25),
	skip: z.number().default(0),
})

export type InvoiceListQuery = z.infer<typeof invoiceListSchema>
