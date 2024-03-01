import { createQuery, useQueryClient } from '@tanstack/svelte-query'
import { trpc } from '../trpcClient'
import { TEXT_FRAGMENT_KEYS } from './text-fragment'

export const CLIENT_KEYS = {
	all: ['client'],
	list: () => [...CLIENT_KEYS.all, 'list'],
	read: (clientId: string) => [...CLIENT_KEYS.all, 'read', clientId],
}

export function createClientQuery() {
	return createQuery({
		queryKey: CLIENT_KEYS.list(),
		queryFn: () => trpc.client.list.query(),
	})
}

// TODO: need to also invalidate invoice queries - they also include client data
export function createClientUpdateMutation() {
	const queryClient = useQueryClient()

	return async (data: Parameters<typeof trpc.client.update.mutate>[0]) => {
		const res = await trpc.client.update.mutate(data)
		queryClient.invalidateQueries(CLIENT_KEYS.read(data.id))
		queryClient.invalidateQueries(CLIENT_KEYS.list())

		queryClient.invalidateQueries(TEXT_FRAGMENT_KEYS.allListForClient(data.id))

		return res
	}
}

export function createClientDeleteMutation() {
	const queryClient = useQueryClient()

	return async (data: Parameters<typeof trpc.client.delete.mutate>[0]) => {
		const res = await trpc.client.delete.mutate(data)

		queryClient.invalidateQueries(CLIENT_KEYS.read(data.id))
		queryClient.invalidateQueries(CLIENT_KEYS.list())

		queryClient.invalidateQueries(TEXT_FRAGMENT_KEYS.allListForClient(data.id))

		return res
	}
}

export function createClientCreateMutation() {
	const queryClient = useQueryClient()

	return async (data: Parameters<typeof trpc.client.create.mutate>[0]) => {
		const res = await trpc.client.create.mutate(data)
		queryClient.invalidateQueries(CLIENT_KEYS.list())
		queryClient.invalidateQueries(TEXT_FRAGMENT_KEYS.allListForClient(res.id))

		return res
	}
}
