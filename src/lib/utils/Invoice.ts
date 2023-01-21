import type { AccountDetails, ClientDetails } from './Client'
import { CURRENCIES, type Currency } from './Currency'
import { Locale } from './translations'

export interface PriceModifier {
	type: 'percent' | 'amount'
	class: 'discount' | 'surcharge' | 'tax'
	description: string
	value: number
}

export interface InvoiceItem {
	id: number
	name: string
	quantity: number
	unit?: string
	unitPrice: number
}

export interface Invoice {
	id: string
	language: Locale
	date: Date
	due:
		| {
				type: 'days'
				value: number
		  }
		| {
				type: 'date'
				value: Date
		  }
	items: InvoiceItem[]
	modifiers: PriceModifier[]
	currency: Currency
	client: ClientDetails
	account: AccountDetails
	description?: string
	note?: string
}

export function getTotal(invoice: Invoice) {
	const total = invoice.items.reduce((total, item) => total + item.quantity * item.unitPrice, 0)

	const modifiers = invoice.modifiers.reduce(
		(total, modifier) => {
			if (modifier.type === 'amount') {
				total.amount += modifier.value
			} else {
				total.percent += modifier.value
			}
			return total
		},
		{ amount: 0, percent: 0 }
	)

	return total + total * (modifiers.percent / 100) + modifiers.amount
}

export function getSubtotal(invoice: Invoice) {
	return invoice.items.reduce((total, item) => total + item.quantity * item.unitPrice, 0)
}

export function getDueDate(invoice: Invoice) {
	if (invoice.due.type === 'days') {
		const date = new Date(invoice.date)
		date.setDate(date.getDate() + invoice.due.value)
		return date
	}
	return invoice.due.value
}

export function getDueDays(invoice: Invoice) {
	if (invoice.due.type === 'days') {
		return invoice.due.value
	}
	const diff = getDueDate(invoice).getTime() - invoice.date.getTime()
	return Math.round(diff / (1000 * 3600 * 24))
}

export const SAMPLE_INVOICE: Invoice = {
	id: '2301.001',
	language: Locale.DE,
	date: new Date(),
	due: {
		type: 'days',
		value: 14
	},
	items: [
		{
			id: 1,
			name: 'Item 1',
			quantity: 1,
			unitPrice: 10
		},
		{
			id: 2,
			name: 'Item 2',
			quantity: 2,
			unitPrice: 20
		}
	],
	modifiers: [
		{
			type: 'percent',
			class: 'tax',
			description: 'invoice.taxReverseCharge',
			value: 10
		}
	],
	currency: CURRENCIES[0],
	client: {
		name: 'SomeComp Ltd.',
		phone: '+1 234 567 890',
		email: 'info@somecomp.com',
		address: {
			street: 'Anystreet',
			streetNumber: '12',
			city: 'Thiscity',
			zip: '12345',
			countryCode: 'US'
		},
		vatNumber: 'US123456789'
	},
	account: {
		name: 'MyComp Inc.',
		firstName: 'John',
		lastName: 'Doe',
		phone: '+1 234 567 890',
		email: 'contact@mycomp.com',
		address: {
			street: 'Anystreet',
			streetNumber: '12',
			city: 'Thiscity',
			zip: '12345',
			countryCode: 'US'
		},
		vatNumber: 'US123456789',
		bankingDetails: {
			bankName: 'MyBank',
			Iban: 'US12 3456 7891 1234 1846 20',
			Bic: 'US123456789'
		},
		logoUrl: 'example-logo.svg'
	}
}
