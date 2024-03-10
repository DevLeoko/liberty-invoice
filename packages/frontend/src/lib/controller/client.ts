import type { Paged } from '$lib/utils/svelteQueryUtils'
import { createInfiniteQuery, useQueryClient } from '@tanstack/svelte-query'
import { cloneDeep } from 'lodash'
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

type AllListBaseData = {
	results: { id: string; isFavorite?: boolean; isArchived?: boolean }[]
}

export function createClientQuery(query: Omit<ClientListQuery, 'take' | 'skip'>, pageSize: number) {
	return createInfiniteQuery({
		queryKey: CLIENT_KEYS.listQuery({ ...query, take: pageSize }),
		queryFn: ({ pageParam }) => {
			return trpc.client.list
				.query({ ...query, take: pageSize, skip: pageParam })
				.then((res) => ({ ...res }))
		},
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage.hasMore) return undefined
			return allPages.reduce((acc, page) => acc + page.results.length, 0)
		},
	})
}

export function createDetailedClientQuery(
	query: Omit<ClientListQuery, 'take' | 'skip'>,
	pageSize: number
) {
	return createInfiniteQuery({
		queryKey: CLIENT_KEYS.listQuery({ ...query, take: pageSize }),
		queryFn: ({ pageParam }) => {
			return trpc.client.listDetailed
				.query({ ...query, take: pageSize, skip: pageParam })
				.then((res) => ({ ...res }))
		},
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage.hasMore) return undefined
			return allPages.reduce((acc, page) => acc + page.results.length, 0)
		},
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
		queryClient.setQueriesData(CLIENT_KEYS.allList(), (oldData?: Paged<AllListBaseData>) => {
			if (!oldData) return oldData

			const newData = cloneDeep(oldData)

			newData.pages.forEach((page) => {
				page.results
					.filter((client) => client.id === data.id)
					.forEach((client) => {
						client.isArchived = data.isArchived
					})
			})

			return newData
		})

		// Remove from all list where { isArchived: !data.isArchived }
		queryClient.setQueriesData(
			[...CLIENT_KEYS.allList(), { archived: !data.isArchived }],
			(oldData?: Paged<AllListBaseData>) => {
				if (!oldData) return oldData

				const newData = cloneDeep(oldData)

				newData.pages.forEach((page) => {
					page.results = page.results.filter((client) => client.id !== data.id)
				})

				return newData
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
		queryClient.setQueriesData(CLIENT_KEYS.allList(), (oldData?: Paged<AllListBaseData>) => {
			if (!oldData) return oldData

			const newData = cloneDeep(oldData)

			newData.pages.forEach((page) => {
				page.results
					.filter((client) => client.id === data.id)
					.forEach((client) => {
						client.isFavorite = data.isFavorite
					})
			})

			return newData
		})

		// Remove from all list where { favorite: !data.isFavorite }
		queryClient.setQueriesData(
			[...CLIENT_KEYS.allList(), { favorite: !data.isFavorite }],
			(oldData?: Paged<AllListBaseData>) => {
				if (!oldData) return oldData

				const newData = cloneDeep(oldData)

				newData.pages.forEach((page) => {
					page.results = page.results.filter((client) => client.id !== data.id)
				})

				return newData
			}
		)

		// Invalidate queries where { favorite: data.isFavorite }
		queryClient.invalidateQueries([...CLIENT_KEYS.allList(), { favorite: data.isFavorite }])

		return res
	}
}
