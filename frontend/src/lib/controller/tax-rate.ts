import { createQuery, useQueryClient } from '@tanstack/svelte-query'
import { trpc, type CreateTaxRate, type ListTaxRate, type UpdateTaxRate } from '../trpcClient'

export const TAX_RATE_KEYS = {
	all: ['taxRate'],
	list: () => [...TAX_RATE_KEYS.all, 'list'],
}

export function createTaxRateListQuery() {
	return createQuery(TAX_RATE_KEYS.list(), () => trpc.taxRate.list.query())
}

export function createTaxRateCreateMutation() {
	const queryClient = useQueryClient()

	return async (taxRate: CreateTaxRate) => {
		const newTaxRate = await trpc.taxRate.create.mutate(taxRate)

		queryClient.setQueriesData(TAX_RATE_KEYS.list(), (oldData?: ListTaxRate[]) => {
			if (!oldData) return oldData

			return [...oldData, newTaxRate]
		})
	}
}

export function createTaxRateUpdateMutation() {
	const queryClient = useQueryClient()

	return async (taxRate: UpdateTaxRate) => {
		const newTaxRate = await trpc.taxRate.update.mutate(taxRate)

		queryClient.setQueriesData(TAX_RATE_KEYS.list(), (oldData?: ListTaxRate[]) => {
			if (!oldData) return oldData

			return oldData.map((taxRate) => {
				if (taxRate.id === newTaxRate.id) {
					return newTaxRate
				}

				return taxRate
			})
		})
	}
}

export function createTaxRateDeleteMutation() {
	const queryClient = useQueryClient()

	return async (id: number) => {
		await trpc.taxRate.delete.mutate({ id })

		queryClient.setQueriesData(TAX_RATE_KEYS.list(), (oldData?: ListTaxRate[]) => {
			if (!oldData) return oldData

			return oldData.filter((taxRate) => taxRate.id !== id)
		})
	}
}
