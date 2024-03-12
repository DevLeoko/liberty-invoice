import { createQuery, useQueryClient } from '@tanstack/svelte-query'
import { derived } from 'svelte/store'
import { t } from '../stores/settings'
import type { TranslationPaths } from '../translations/translations'
import { trpc, type ListTextFragment } from '../trpcClient'

export const TEXT_FRAGMENT_NAMES = [
	'mail.invoiceSubject',
	'mail.invoiceText',
	'invoice.note',
	'invoice.footerNote',
	'invoice.paymentNote',
] as const

export type TextFragmentKey = (typeof TEXT_FRAGMENT_NAMES)[number]

export const TEXT_FRAGMENT_KEYS = {
	all: ['textFragment'],
	allList: () => [...TEXT_FRAGMENT_KEYS.all, 'list'],
	listDefaults: (language: string) => [...TEXT_FRAGMENT_KEYS.allList(), { language }],
	allListForClient: (clientId: string) => [...TEXT_FRAGMENT_KEYS.allList(), 'client', clientId],
	listForClient: (clientId: string, language: string, keys: TextFragmentKey[] | undefined) => [
		...TEXT_FRAGMENT_KEYS.allListForClient(clientId),
		{ language, keys },
	],
}

export function getAvailableVariables(fragmentName: string) {
	if (fragmentName.startsWith('mail.invoice')) {
		return '{clientName}, {businessName}, {invoiceNumber}, {invoiceDate}, {invoiceMonth}, {invoiceLastMonth}, {invoiceYear}, {invoiceLastYear}, {invoiceDueDate}, {invoiceTotal}'
	} else if (fragmentName == 'invoice.note') {
		return '{invoiceDate}, {invoiceMonth}, {invoiceLastMonth}, {invoiceYear}, {invoiceLastMonthYear}, {invoiceDueDate}'
	}

	return ''
}

export function parseTextFragment(text: string, variables: Record<string, string>) {
	return text.replace(/{([^}]+)}/g, (match, group) => {
		return variables[group] ?? match
	})
}

export function getTextFragmentInvoiceDateVariables(
	{ invoiceDate, dueDate }: { invoiceDate: Date; dueDate: Date },
	langCode: string
) {
	const dateVariables = getTextFragmentDateVariables(invoiceDate, langCode)
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

export function getTextFragmentDateVariables(date: Date, langCode: string) {
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

export function createTextFragmentListQuery(
	key: TextFragmentKey,
	language: string,
	clientId: string | null
) {
	if (clientId === null) {
		return createQuery({
			queryKey: TEXT_FRAGMENT_KEYS.listDefaults(language),
			queryFn: () => trpc.textFragment.listDefaults.query({ language }),
			select: (data) => data.find((textFragment) => textFragment.key === key),
		})
	} else {
		return createQuery({
			queryKey: TEXT_FRAGMENT_KEYS.listForClient(clientId, language, undefined),
			queryFn: () => trpc.textFragment.listForClient.query({ clientId, language }),
			select: (data) => data.find((textFragment) => textFragment.key === key),
		})
	}
}

export function createFinalTextFragmentQuery(
	key: TextFragmentKey,
	language: string,
	clientId: string
) {
	const query = createQuery({
		queryKey: TEXT_FRAGMENT_KEYS.listForClient(clientId, language, [key]),
		queryFn: () => trpc.textFragment.listForClient.query({ clientId, language, keys: [key] }),
		select: (data) => data.find((textFragment) => textFragment.key === key),
	})

	return derived([query, t], ([$query, $t]) => {
		return $query?.data?.value ?? $t(`textFragmentDefaults.${key}` as TranslationPaths)
	})
}

export function createTextFragmentUpsertMutation() {
	const queryClient = useQueryClient()

	return async (key: TextFragmentKey, language: string, clientId: string | null, value: string) => {
		const newFragment = await trpc.textFragment.upsert.mutate({
			key,
			language,
			value,
			clientId,
		})

		queryClient.setQueriesData(TEXT_FRAGMENT_KEYS.allList(), (oldData?: ListTextFragment[]) => {
			if (!oldData) return oldData

			const exists = oldData.some(
				(textFragment) =>
					textFragment.key === key &&
					textFragment.language === language &&
					textFragment.clientId === clientId
			)

			if (exists) {
				return oldData.map((textFragment) => {
					if (
						textFragment.key === key &&
						textFragment.language === language &&
						textFragment.clientId === clientId
					) {
						return { ...textFragment, value }
					}

					return textFragment
				})
			} else {
				return [...oldData, newFragment]
			}
		})
	}
}

export function createTextFragmentDeleteMutation() {
	const queryClient = useQueryClient()

	return async (key: TextFragmentKey, language: string, clientId: string | null) => {
		await trpc.textFragment.delete.mutate({ key, language, clientId })

		queryClient.setQueriesData(TEXT_FRAGMENT_KEYS.allList(), (oldData?: ListTextFragment[]) => {
			if (!oldData) return oldData

			return oldData.filter(
				(textFragment) =>
					textFragment.key !== key ||
					textFragment.language !== language ||
					textFragment.clientId !== clientId
			)
		})
	}
}
