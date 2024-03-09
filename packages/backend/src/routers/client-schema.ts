import { z } from 'zod'

export const clientInputSchema = z.object({
	name: z.string(),
	shorthand: z.string(),
	additionalLine: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	contactPhone: z.string(),
	contactEmail: z.string(),
	vatNumber: z.string(),

	street: z.string(),
	streetNumber: z.string(),
	city: z.string(),
	zip: z.string(),
	countryCode: z.string(),

	defaultLanguage: z.string(),
	defaultCurrency: z.string().min(1).max(6),
	defaultTaxRateId: z.string().nullable(),
	defaultDueDays: z.number(),

	isFavorite: z.boolean().optional(),

	textFragments: z.array(
		z.object({
			key: z.string(),
			value: z.string(),
		})
	),
})

export const clientListSchema = z.object({
	isFavorite: z.boolean().optional(),
	isArchived: z.boolean().default(false),
	search: z.string().optional(),

	take: z.number().max(50).default(10),
	skip: z.number().default(0),
})

export type ClientListQuery = z.infer<typeof clientListSchema>
