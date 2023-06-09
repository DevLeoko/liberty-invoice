import { createQuery, useQueryClient } from '@tanstack/svelte-query'
import { trpc, type ListTextFragment } from '../trpcClient'

export const TEXT_FRAGMENT_NAMES = [
	'mail.invoiceSubject',
	'mail.invoiceText',
	'invoice.note',
	'invoice.footerNote',
	'invoice.paymentNote',
]

export const TEXT_FRAGMENT_KEYS = {
	all: ['textFragment'],
	lists: () => [...TEXT_FRAGMENT_KEYS.all, 'list'],
	listDefaults: (language: string) => [...TEXT_FRAGMENT_KEYS.lists(), { language }],
	listForClient: (clientId: number, language: string, keys: string[]) => [
		...TEXT_FRAGMENT_KEYS.lists(),
		{ clientId, language, keys },
	],
}

export function getAvailableVariables(fragmentName: string) {
	if (fragmentName.startsWith('mail.invoice')) {
		return '{clientName}, {businessName}, {invoiceNumber}, {invoiceDate}, {invoiceMonth}, {invoiceLastMonth}, {invoiceYear}, {invoiceLastYear}, {invoiceDueDate}, {invoiceTotal}'
	} else if (fragmentName == 'invoice.note') {
		return '{invoiceDate}, {invoiceMonth}, {invoiceLastMonth}, {invoiceYear}, {invoiceLastYear}, {invoiceDueDate}'
	}

	return ''
}

export function createTextFragmentListQuery(key: string, language: string) {
	return createQuery({
		queryKey: TEXT_FRAGMENT_KEYS.listDefaults(language),
		queryFn: () => trpc.textFragment.listDefaults.query({ language }),
		select: (data) => data.find((textFragment) => textFragment.key === key),
	})
}

export function createTextFragmentUpsertMutation() {
	const queryClient = useQueryClient()

	return async (key: string, language: string, clientId: number | null, value: string) => {
		const newFragment = await trpc.textFragment.upsert.mutate({
			key,
			language,
			value,
			clientId,
		})

		queryClient.setQueriesData(TEXT_FRAGMENT_KEYS.lists(), (oldData?: ListTextFragment[]) => {
			if (!oldData) return oldData

			const exists = oldData.some(
				(textFragment) =>
					textFragment.key === key &&
					textFragment.language === language &&
					textFragment.clientId === clientId,
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

	return async (key: string, language: string, clientId: number | null) => {
		await trpc.textFragment.delete.mutate({ key, language, clientId })

		queryClient.setQueriesData(TEXT_FRAGMENT_KEYS.lists(), (oldData?: ListTextFragment[]) => {
			if (!oldData) return oldData

			return oldData.filter(
				(textFragment) =>
					textFragment.key !== key ||
					textFragment.language !== language ||
					textFragment.clientId !== clientId,
			)
		})
	}
}
