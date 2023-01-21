import { derived, writable } from 'svelte/store'
import { formatFloat } from './i18n'

export const CURRENCIES = [
	{
		shorthand: 'EUR',
		symbol: '€',
		symbolOnLeft: false
	},
	{
		shorthand: 'USD',
		symbol: '$',
		symbolOnLeft: true
	},
	{
		shorthand: 'PLN',
		symbol: 'zł',
		symbolOnLeft: false
	}
]

// export const currency = writable(CURRENCIES[0])

export interface Currency {
	shorthand: string
	symbol: string
	symbolOnLeft: boolean
}

export function formatCurrencyGeneric(
	value: number,
	formatFloat: (value: number) => string,
	currency: Currency
) {
	const formatted = formatFloat(value)
	if (currency.symbolOnLeft) {
		return `${currency.symbol}${formatted}`
	}
	return `${formatted}${currency.symbol}`
}

export const formatCurrency = derived(
	formatFloat,
	($formatFloat) => (value: number, currency: Currency) =>
		formatCurrencyGeneric(value, $formatFloat, currency)
)
