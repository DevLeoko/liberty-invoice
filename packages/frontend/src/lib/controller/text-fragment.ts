import { createQuery, useQueryClient } from '@tanstack/svelte-query'
import { derived } from 'svelte/store'
import type { Locale } from '../translations/translations'
import { translate, type TranslationPaths } from '../translations/translations'
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
	listDefaults: (language: Locale) => [...TEXT_FRAGMENT_KEYS.allList(), { language }],
	allListForClient: (clientId: string) => [...TEXT_FRAGMENT_KEYS.allList(), 'client', clientId],
	listForClient: (clientId: string, language: Locale, keys: TextFragmentKey[] | undefined) => [
		...TEXT_FRAGMENT_KEYS.allListForClient(clientId),
		{ language, keys },
	],
}

export function getAvailableVariables(fragmentName: string) {
	if (fragmentName.startsWith('mail.invoice')) {
		return '{clientName}, {accountBusinessName}, {accountFullName}, {invoiceNumber}, {invoiceDate}, {invoiceMonth}, {invoiceLastMonth}, {invoiceYear}, {invoiceLastMonthYear}, {invoiceDueDate}, {invoiceTotal}'
	} else if (fragmentName == 'invoice.note') {
		return '{invoiceDate}, {invoiceMonth}, {invoiceLastMonth}, {invoiceYear}, {invoiceLastMonthYear}, {invoiceDueDate}'
	}

	return ''
}

export function createTextFragmentListQuery(
	key: TextFragmentKey,
	language: Locale,
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
	language: Locale,
	clientId: string
) {
	const query = createQuery({
		queryKey: TEXT_FRAGMENT_KEYS.listForClient(clientId, language, [key]),
		queryFn: () => trpc.textFragment.listForClient.query({ clientId, language, keys: [key] }),
	})

	return derived(query, ($query) => {
		return (
			$query.data?.[0]?.value ??
			translate(language, `textFragmentDefaults.${key}` as TranslationPaths)
		)
	})
}

export function createFinalTextFragmentsQuery<K extends TextFragmentKey>(
	keys: K[],
	language: Locale,
	clientId: string
) {
	const query = createQuery({
		queryKey: TEXT_FRAGMENT_KEYS.listForClient(clientId, language, keys),
		queryFn: () => trpc.textFragment.listForClient.query({ clientId, language, keys }),
	})

	return derived(query, ($query) => {
		if (!$query.data) return null

		const result: { key: string; value: string }[] = []
		for (const key of keys) {
			const value = $query.data.find((textFragment) => textFragment.key === key)?.value
			result.push({
				key,
				value: value ?? translate(language, `textFragmentDefaults.${key}` as TranslationPaths),
			})
		}

		return result
	})
}

export function createTextFragmentUpsertMutation() {
	const queryClient = useQueryClient()

	return async (key: TextFragmentKey, language: Locale, clientId: string | null, value: string) => {
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

	return async (key: TextFragmentKey, language: Locale, clientId: string | null) => {
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
