import { writable } from 'svelte/store'
import { CURRENCIES, type Currency } from './Currency'
import type { PriceModifier } from './Invoice'
import { Locale } from './translations'

export interface Settings {
	locale: Locale
	invoiceIdFormat: string
	defaultTax: PriceModifier
	defaultCurrency: Currency
}

const DEFAULT_SETTINGS: Settings = {
	locale: Locale.EN,
	invoiceIdFormat: 'YYMM.XXX',
	defaultTax: {
		type: 'percent',
		class: 'tax',
		description: 'invoice.vat',
		value: 20
	},
	defaultCurrency: CURRENCIES[0]
}

export const settings = writable(DEFAULT_SETTINGS)

export function parseInvoiceIdFormat(format: string): {
	discriminatingTimespan: 'year' | 'month' | 'day' | 'none'
	format: (partialId: number, date?: Date) => string
} {
	// Format example: YYMM.XXX, YYXXXXX, YYMMDD.XX, #XXXXXX YYX.XXX, XXX.XXX

	let discriminatingTimespan: 'year' | 'month' | 'day' | 'none' = 'none'
	if (format.includes('DD')) discriminatingTimespan = 'day'
	else if (format.includes('MM')) discriminatingTimespan = 'month'
	else if (format.includes('YY')) discriminatingTimespan = 'year'

	const positionsOfX = format
		.split('')
		.map((char, index) => (char === 'X' ? index : -1))
		.filter((index) => index !== -1)

	const formatFunction = (partialId: number, date = new Date()) => {
		let formattedId = format
		// Repalce the Xs with the partialId (first X might be replaced with multiple digits)
		const partialIdString = partialId.toString().padStart(positionsOfX.length, '0')
		for (let i = 0; i < positionsOfX.length; i++) {
			let char = partialIdString[i]
			if (i == 0 && partialIdString.length > positionsOfX.length) {
				char = partialIdString.slice(0, partialIdString.length - positionsOfX.length + 1)
			}
			formattedId = formattedId.replace('X', char)
		}

		// Replace the YY, MM, DD with the date
		if (format.includes('YY'))
			formattedId = formattedId.replace('YY', date.getFullYear().toString().slice(-2))

		if (format.includes('MM'))
			formattedId = formattedId.replace('MM', (date.getMonth() + 1).toString().padStart(2, '0'))

		if (format.includes('DD'))
			formattedId = formattedId.replace('DD', date.getDate().toString().padStart(2, '0'))

		return formattedId
	}

	return { discriminatingTimespan, format: formatFunction }
}
