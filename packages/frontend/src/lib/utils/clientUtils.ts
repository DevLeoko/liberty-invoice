import type { CreateClient } from '../trpcClient'

export function emptyClient(
	defaultValues: Pick<
		CreateClient,
		'defaultLanguage' | 'defaultCurrency' | 'defaultTaxRateId' | 'defaultDueDays'
	>
): CreateClient {
	return {
		name: '',
		shorthand: '',
		additionalLine: '',
		firstName: '',
		lastName: '',
		contactPhone: '',
		contactEmail: '',
		vatNumber: '',

		street: '',
		streetNumber: '',
		city: '',
		zip: '',
		countryCode: '',

		defaultCurrency: defaultValues.defaultCurrency,
		defaultLanguage: defaultValues.defaultLanguage,
		defaultTaxRateId: defaultValues.defaultTaxRateId,
		defaultDueDays: defaultValues.defaultDueDays,

		textFragments: [],
	}
}
