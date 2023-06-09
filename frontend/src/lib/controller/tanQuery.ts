import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query'
import { trpc, type UpdateUserSettings } from '../trpcClient'

export const INVOICE_KEYS = {
	all: ['invoice'],
	list: () => [...INVOICE_KEYS.all, 'list'],
	read: (invoiceId: number) => [...INVOICE_KEYS.all, 'read', invoiceId],
}

export const CLIENT_KEYS = {
	all: ['client'],
	list: () => [...CLIENT_KEYS.all, 'list'],
	read: (clientId: number) => [...CLIENT_KEYS.all, 'read', clientId],
}

export const USER_SETTINGS_KEYS = {
	all: ['userSettings'],
	read: () => [...USER_SETTINGS_KEYS.all, 'read'],
}

export function createClientQuery() {
	return createQuery({
		queryKey: CLIENT_KEYS.list(),
		queryFn: () => trpc.client.list.query(),
	})
}

export function createUserSettingsQuery() {
	return createQuery({
		queryKey: USER_SETTINGS_KEYS.read(),
		queryFn: () => trpc.userSettings.read.query(),
	})
}

export function createUserSettingsUpdateMutation() {
	const queryClient = useQueryClient()
	return createMutation({
		mutationFn: async (settings: UpdateUserSettings) => {
			await trpc.userSettings.update.mutate(settings)
		},
		onSuccess: () => {
			queryClient.invalidateQueries(USER_SETTINGS_KEYS.all)
		},
	})
}

export function createInvoiceQuery() {
	return createQuery({
		queryKey: INVOICE_KEYS.list(),
		queryFn: () => trpc.invoice.list.query(),
	})
}

export function queryUserSettings() {
	return useQueryClient().fetchQuery({
		queryKey: USER_SETTINGS_KEYS.read(),
		queryFn: () => trpc.userSettings.read.query(),
	})
}
