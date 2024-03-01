import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query'
import { trpc, type UpdateUserSettings } from '../trpcClient'

export const USER_SETTINGS_KEYS = {
	all: ['userSettings'],
	read: () => [...USER_SETTINGS_KEYS.all, 'read'],
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

export function queryUserSettings() {
	return useQueryClient().fetchQuery({
		queryKey: USER_SETTINGS_KEYS.read(),
		queryFn: () => trpc.userSettings.read.query(),
	})
}
