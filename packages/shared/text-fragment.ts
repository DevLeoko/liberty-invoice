import { formatClientName } from './client-formatter'
import { getCurrency } from './currencies'
import type { Locale } from './invoice-translations/translations'
import { translateShared } from './invoice-translations/translations'

export function getTextFragmentDateVariables(date: Date, language: Locale) {
	const langCode = translateShared(language, 'langCode')

	const lastMonthDate = new Date(date)
	lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)

	const dateStr = date.toLocaleDateString(langCode)
	const month = date.toLocaleDateString(langCode, { month: 'long' })
	const lastMonth = lastMonthDate.toLocaleDateString(langCode, { month: 'long' })
	const year = date.getFullYear().toString()
	const lastMonthYear = lastMonthDate.getFullYear().toString()

	return {
		date: dateStr,
		month,
		lastMonth,
		year,
		lastMonthYear,
	}
}

export function getTextFragmentInvoiceDateVariables(
	{ invoiceDate, dueDate }: { invoiceDate: Date; dueDate: Date },
	language: Locale
) {
	const langCode = translateShared(language, 'langCode')

	const dateVariables = getTextFragmentDateVariables(invoiceDate, language)
	const dueDateStr = dueDate.toLocaleDateString(langCode)

	return {
		invoiceDate: dateVariables.date,
		invoiceMonth: dateVariables.month,
		invoiceLastMonth: dateVariables.lastMonth,
		invoiceYear: dateVariables.year,
		invoiceLastMonthYear: dateVariables.lastMonthYear,
		invoiceDueDate: dueDateStr,
	}
}

export function getTextFragmentInvoiceVariables(
	invoice: {
		date: Date
		dueDate: Date
		language: string // This is a Locale, but we don't have the type here
		currency: string
		amountWithTax: number
		invoiceNumber: string
		client: {
			name: string
			firstName: string
			lastName: string
		}
	},
	userSettings: {
		firstName: string
		lastName: string
		name: string
	}
) {
	const dateVariables = getTextFragmentInvoiceDateVariables(
		{
			invoiceDate: invoice.date,
			dueDate: invoice.dueDate,
		},
		invoice.language as Locale
	)

	const langCode = translateShared(invoice.language as Locale, 'langCode')

	const currency = getCurrency(invoice.currency, (val: number) =>
		val.toLocaleString(langCode, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
	)
	const invoiceTotal = currency.format(invoice.amountWithTax)

	const clientName = formatClientName(invoice.client, true)

	const accountFullName = (userSettings.firstName + ' ' + userSettings.lastName).trim()
	const accountBusinessName = userSettings.name

	return {
		clientName,
		accountFullName,
		accountBusinessName,
		invoiceNumber: invoice.invoiceNumber,
		invoiceDate: dateVariables.invoiceDate,
		invoiceMonth: dateVariables.invoiceMonth,
		invoiceLastMonth: dateVariables.invoiceLastMonth,
		invoiceYear: dateVariables.invoiceYear,
		invoiceLastMonthYear: dateVariables.invoiceLastMonthYear,
		invoiceDueDate: dateVariables.invoiceDueDate,
		invoiceTotal,
	}
}

export function parseTextFragment(text: string, variables: Record<string, string>) {
	return text.replace(/{([^}]+)}/g, (match, group) => {
		return variables[group] ?? match
	})
}
