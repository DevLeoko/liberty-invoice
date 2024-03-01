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
	defaultCurrency: z.string(),
	defaultTaxRateId: z.string().nullable(),
	defaultDueDays: z.number(),

	textFragments: z.array(
		z.object({
			key: z.string(),
			value: z.string(),
		})
	),
})
