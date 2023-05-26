import { createQuery, useQueryClient } from '@tanstack/svelte-query'
import { trpc } from './trpcClient'

export const CLIENTS_KEY = 'clients'
export const INVOICES_KEY = 'invoices'
export const USER_SETTINGS_KEY = 'userSettings'

export function createClientQuery() {
	return createQuery({
		queryKey: [CLIENTS_KEY],
		queryFn: () => trpc.client.list.query(),
	})
}

export function createUserSettingsQuery() {
	return createQuery({
		queryKey: [USER_SETTINGS_KEY],
		queryFn: () => trpc.userSettings.read.query(),
	})
}

export function createInvoiceQuery() {
	return createQuery({
		queryKey: [INVOICES_KEY],
		queryFn: () => trpc.invoice.list.query(),
	})
}

export function queryUserSettings() {
	return useQueryClient().fetchQuery({
		queryKey: [USER_SETTINGS_KEY],
		queryFn: () => trpc.userSettings.read.query(),
	})
}
