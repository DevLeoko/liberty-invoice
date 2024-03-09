import { createQuery, useQueryClient } from '@tanstack/svelte-query'
import { trpc, type ClientListQuery } from '../trpcClient'
import { TEXT_FRAGMENT_KEYS } from './text-fragment'

export const CLIENT_KEYS = {
	all: ['client'],
	allList: () => [...CLIENT_KEYS.all, 'list'],
	listQuery: (query: ClientListQuery) => [
		...CLIENT_KEYS.allList(),
		{ archived: query.isArchived ?? false },
		{ favorite: query.isFavorite },
		query,
	],
	read: (clientId: string) => [...CLIENT_KEYS.all, 'read', clientId],
}

export function createClientQuery(query: ClientListQuery) {
	return createQuery({
		queryKey: CLIENT_KEYS.listQuery(query),
		queryFn: () => trpc.client.list.query(query),
	})
}

// TODO: need to also invalidate invoice queries - they also include client data
export function createClientUpdateMutation() {
	const queryClient = useQueryClient()

	return async (data: Parameters<typeof trpc.client.update.mutate>[0]) => {
		const res = await trpc.client.update.mutate(data)
		queryClient.invalidateQueries(CLIENT_KEYS.read(data.id))
		queryClient.invalidateQueries(CLIENT_KEYS.allList())

		queryClient.invalidateQueries(TEXT_FRAGMENT_KEYS.allListForClient(data.id))

		return res
	}
}

export function createClientDeleteMutation() {
	const queryClient = useQueryClient()

	return async (data: Parameters<typeof trpc.client.delete.mutate>[0]) => {
		const res = await trpc.client.delete.mutate(data)

		queryClient.invalidateQueries(CLIENT_KEYS.read(data.id))
		queryClient.invalidateQueries(CLIENT_KEYS.allList())

		queryClient.invalidateQueries(TEXT_FRAGMENT_KEYS.allListForClient(data.id))

		return res
	}
}

export function createClientCreateMutation() {
	const queryClient = useQueryClient()

	return async (data: Parameters<typeof trpc.client.create.mutate>[0]) => {
		const res = await trpc.client.create.mutate(data)
		queryClient.invalidateQueries(CLIENT_KEYS.allList())
		queryClient.invalidateQueries(TEXT_FRAGMENT_KEYS.allListForClient(res.id))

		return res
	}
}

export function createClientToggleArchivedMutation() {
	const queryClient = useQueryClient()

	return async (data: Parameters<typeof trpc.client.toggleArchived.mutate>[0]) => {
		const res = await trpc.client.toggleArchived.mutate(data)
		queryClient.invalidateQueries(CLIENT_KEYS.read(data.id))

		// Update archived status
		queryClient.setQueriesData(
			CLIENT_KEYS.allList(),
			(oldData?: { id: string; isArchived?: boolean }[]) => {
				if (!oldData) return oldData

				oldData
					.filter((client) => client.id === data.id)
					.forEach((client) => {
						client.isArchived = data.isArchived
					})
			}
		)

		// Remove from all list where { isArchived: !data.isArchived }
		queryClient.setQueriesData(
			[...CLIENT_KEYS.allList(), { archived: !data.isArchived }],
			(oldData?: { id: string; isArchived?: boolean }[]) => {
				if (!oldData) return oldData

				return oldData.filter((client) => client.id !== data.id)
			}
		)

		// Invalidate queries where { isArchived: data.isArchived }
		queryClient.invalidateQueries([...CLIENT_KEYS.allList(), { archived: data.isArchived }])

		return res
	}
}

export function createClientToggleFavoriteMutation() {
	const queryClient = useQueryClient()

	return async (data: Parameters<typeof trpc.client.toggleFavorite.mutate>[0]) => {
		const res = await trpc.client.toggleFavorite.mutate(data)
		queryClient.invalidateQueries(CLIENT_KEYS.read(data.id))

		// Update favorite status
		queryClient.setQueriesData(
			CLIENT_KEYS.allList(),
			(oldData?: { id: string; isFavorite?: boolean }[]) => {
				if (!oldData) return oldData

				oldData
					.filter((client) => client.id === data.id)
					.forEach((client) => {
						client.isFavorite = data.isFavorite
					})
			}
		)

		// Remove from all list where { favorite: !data.isFavorite }
		queryClient.setQueriesData(
			[...CLIENT_KEYS.allList(), { favorite: !data.isFavorite }],
			(oldData?: { id: string; isFavorite?: boolean }[]) => {
				if (!oldData) return oldData

				return oldData.filter((client) => client.id !== data.id)
			}
		)

		// Invalidate queries where { favorite: data.isFavorite }
		queryClient.invalidateQueries([...CLIENT_KEYS.allList(), { favorite: data.isFavorite }])

		return res
	}
}
