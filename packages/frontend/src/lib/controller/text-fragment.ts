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

export function parseInvoiceTextFragment(
	text: string,
	langCode: string,
	data: {
		invoiceDate: Date
		dueDate: Date
	}
) {
	const lastMonth = new Date(data.invoiceDate)
	lastMonth.setMonth(lastMonth.getMonth() - 1)

	const invoiceDate = data.invoiceDate.toLocaleDateString(langCode)
	const invoiceMonth = data.invoiceDate.toLocaleDateString(langCode, { month: 'long' })
	const invoiceLastMonth = lastMonth.toLocaleDateString(langCode, { month: 'long' })
	const invoiceYear = data.invoiceDate.getFullYear()
	const invoiceLastMonthYear = lastMonth.getFullYear()
	const invoiceDueDate = data.dueDate.toLocaleDateString(langCode)

	return text
		.replace(/{invoiceDate}/g, invoiceDate)
		.replace(/{invoiceMonth}/g, invoiceMonth)
		.replace(/{invoiceLastMonth}/g, invoiceLastMonth)
		.replace(/{invoiceYear}/g, invoiceYear.toString())
		.replace(/{invoiceLastMonthYear}/g, invoiceLastMonthYear.toString())
		.replace(/{invoiceDueDate}/g, invoiceDueDate)
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
