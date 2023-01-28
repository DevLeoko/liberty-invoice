import { cloneDeep } from 'lodash'
import { derived, get, writable, type Writable } from 'svelte/store'
import { SAMPLE_ACCOUNT, type AccountDetails } from './Account'
import { SAMPLE_CLIENT, type ClientDetails } from './Client'
import { CURRENCIES, type Currency } from './Currency'
import { parseInvoiceIdFormat, settings } from './Settings'
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

export type InvoiceDue =
	| {
			type: 'days'
			value: number
	  }
	| {
			type: 'date'
			value: Date
	  }

export interface Invoice {
	internalId: number
	id: string
	partialId: number
	idDate: Date
	language: Locale
	date: Date
	due: InvoiceDue
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
	internalId: 0,
	id: '2301.001',
	idDate: new Date(),
	description: '',
	note: '',
	partialId: 1,
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
	currency: cloneDeep(CURRENCIES[0]),
	client: cloneDeep(SAMPLE_CLIENT),
	account: cloneDeep(SAMPLE_ACCOUNT)
}

export const invoices = writable([SAMPLE_INVOICE])
export const activeInvoiceId = writable(get(invoices)[0].internalId)

let activeInvoiceIdLocal = get(activeInvoiceId)
activeInvoiceId.subscribe((value) => (activeInvoiceIdLocal = value))

export const activeInvoice: Writable<Invoice> = {
	...derived([invoices, activeInvoiceId], ([$invoices, $index]) => $invoices[$index]),
	set: (value) => {
		invoices.update((invoices) => {
			const invoiceIndex = invoices.findIndex((inv) => inv.internalId == activeInvoiceIdLocal)
			invoices[invoiceIndex] = value
			return invoices
		})
	},
	update: (fn) => {
		invoices.update((invoices) => {
			const invoiceIndex = invoices.findIndex((inv) => inv.internalId == activeInvoiceIdLocal)
			invoices[invoiceIndex] = fn(invoices[get(activeInvoiceId)])
			return invoices
		})
	}
}

export function creanteNewInvoice() {
	const currInvoices = get(invoices)
	const lastInvoice = currInvoices[currInvoices.length - 1] ?? SAMPLE_INVOICE

	const { id, partialId } = getNextId(currInvoices, get(settings).invoiceIdFormat)
	const internalId = Math.max(...currInvoices.map((invoice) => invoice.internalId)) + 1

	const newInvoice: Invoice = {
		internalId,
		id,
		partialId,
		idDate: new Date(),
		date: new Date(),
		items: cloneDeep(lastInvoice.items),
		modifiers: cloneDeep(lastInvoice.modifiers),
		language: lastInvoice.language,
		currency: cloneDeep(lastInvoice.currency),
		client: cloneDeep(lastInvoice.client),
		account: cloneDeep(lastInvoice.account),
		due: {
			type: 'days',
			value: getDueDays(lastInvoice)
		}
	}

	if (lastInvoice) {
		// copy currency, client, account, language, due days
		newInvoice.client = cloneDeep(lastInvoice.client)
		newInvoice.account = cloneDeep(lastInvoice.account)
		newInvoice.currency = cloneDeep(lastInvoice.currency)
		newInvoice.language = lastInvoice.language

		if (lastInvoice.due.type === 'days') {
			newInvoice.due = {
				type: 'days',
				value: lastInvoice.due.value
			}
		}
	}

	invoices.update((invoices) => [...invoices, newInvoice])
	activeInvoiceId.set(internalId)
}

function getCurrentTimespan(type: 'year' | 'month' | 'day'): { from: Date; to: Date } {
	const now = new Date()
	switch (type) {
		case 'year':
			return {
				from: new Date(now.getFullYear(), 0, 1),
				to: new Date(now.getFullYear() + 1, 0, 1)
			}
		case 'month':
			return {
				from: new Date(now.getFullYear(), now.getMonth(), 1),
				to: new Date(now.getFullYear(), now.getMonth() + 1, 1)
			}
		case 'day':
			return {
				from: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
				to: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
			}
	}
}

function getNextId(invoices: Invoice[], idFormat: string): { id: string; partialId: number } {
	const { discriminatingTimespan, format } = parseInvoiceIdFormat(idFormat)

	const currentTimespan =
		discriminatingTimespan == 'none' ? null : getCurrentTimespan(discriminatingTimespan)

	const maxPartialId = invoices
		.filter((invoice) => {
			if (!currentTimespan) return true
			return invoice.date >= currentTimespan.from && invoice.date < currentTimespan.to
		})
		.map((invoice) => invoice.partialId)
		.reduce((max, curr) => Math.max(max, curr), 0)

	return {
		id: format(maxPartialId + 1),
		partialId: maxPartialId + 1
	}
}
