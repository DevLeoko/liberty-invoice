import { createQuery, useQueryClient } from '@tanstack/svelte-query'
import { trpc, type CreateProduct, type ListProduct } from '../trpcClient'

export const PRODUCT_KEYS = {
	all: ['product'],
	list: () => [...PRODUCT_KEYS.all, 'list'],
	read: (id: number) => [...PRODUCT_KEYS.all, 'read', id],
}

export function createProductListQuery() {
	return createQuery(PRODUCT_KEYS.list(), () => trpc.product.list.query())
}

export function createProductReadQuery(id: number) {
	return createQuery(PRODUCT_KEYS.read(id), () => trpc.product.read.query({ id }))
}

export function createProductCreateMutation() {
	const queryClient = useQueryClient()

	return async (product: CreateProduct) => {
		const newProduct = await trpc.product.create.mutate(product)

		queryClient.setQueriesData(PRODUCT_KEYS.list(), (oldData?: ListProduct[]) => {
			if (!oldData) return oldData

			return [...oldData, newProduct]
		})

		return newProduct
	}
}

export function createProductUpdateMutation() {
	const queryClient = useQueryClient()

	return async (data: { id: number; product: CreateProduct }) => {
		const newProduct = await trpc.product.update.mutate(data)

		queryClient.setQueriesData(PRODUCT_KEYS.list(), (oldData?: ListProduct[]) => {
			if (!oldData) return oldData

			return oldData.map((product) => {
				if (product.id === newProduct.id) {
					return newProduct
				}

				return product
			})
		})
		queryClient.invalidateQueries(PRODUCT_KEYS.read(newProduct.id))

		return newProduct
	}
}

export function createProductDeleteMutation() {
	const queryClient = useQueryClient()

	return async (id: number) => {
		await trpc.product.delete.mutate({ id })

		queryClient.setQueriesData(PRODUCT_KEYS.list(), (oldData?: ListProduct[]) => {
			if (!oldData) return oldData

			return oldData.filter((product) => product.id !== id)
		})

		return id
	}
}
