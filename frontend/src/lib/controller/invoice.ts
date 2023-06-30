import { createQuery, useQueryClient } from '@tanstack/svelte-query'
import { trpc } from '../trpcClient'
import { PRODUCT_KEYS } from './product'
import { STATS_KEYS } from './stats'

export const INVOICE_KEYS = {
	all: ['invoice'],
	list: () => [...INVOICE_KEYS.all, 'list'],
	read: (invoiceId: number) => [...INVOICE_KEYS.all, 'read', invoiceId],
}

export function createInvoiceQuery() {
	return createQuery({
		queryKey: INVOICE_KEYS.list(),
		queryFn: () => trpc.invoice.list.query(),
	})
}

export function createInvoiceReadQuery(invoiceId: number) {
	return createQuery({
		queryKey: INVOICE_KEYS.read(invoiceId),
		queryFn: () => trpc.invoice.read.query(invoiceId),
	})
}

export function createInvoiceDeleteMutation() {
	const queryClient = useQueryClient()

	return async (invoiceId: number) => {
		const res = await trpc.invoice.delete.mutate(invoiceId)

		queryClient.setQueriesData(INVOICE_KEYS.list(), (oldData?: { id: number }[]) => {
			if (!oldData) return oldData
			return oldData.filter((invoice) => invoice.id !== invoiceId)
		})
		queryClient.invalidateQueries(INVOICE_KEYS.read(invoiceId))
		queryClient.invalidateQueries(STATS_KEYS.all)

		return res
	}
}

export function createInvoiceUpdateMutation() {
	const queryClient = useQueryClient()

	return async (data: Parameters<typeof trpc.invoice.update.mutate>[0]) => {
		const res = await trpc.invoice.update.mutate(data)
		queryClient.invalidateQueries(INVOICE_KEYS.read(data.id))
		queryClient.invalidateQueries(INVOICE_KEYS.list())
		queryClient.invalidateQueries(STATS_KEYS.all)

		return res
	}
}

export function createInvoiceCreateMutation() {
	const queryClient = useQueryClient()

	return async (data: Parameters<typeof trpc.invoice.create.mutate>[0]) => {
		const res = await trpc.invoice.create.mutate(data)
		queryClient.invalidateQueries(INVOICE_KEYS.list())
		queryClient.invalidateQueries(STATS_KEYS.all)

		return res
	}
}

export function createInvoiceFinalizeMutation() {
	const queryClient = useQueryClient()

	return async (invoiceId: number) => {
		const res = await trpc.invoice.finalize.mutate(invoiceId)
		queryClient.invalidateQueries(INVOICE_KEYS.read(invoiceId))
		queryClient.setQueryData(INVOICE_KEYS.list(), (oldData?: { id: number }[]) => {
			if (!oldData) return oldData
			return oldData.map((i) => (i.id === invoiceId ? res : i))
		})

		const productIds = res.items.map((i) => i.productId).filter((i) => i !== null) as number[]
		if (productIds.length > 0) {
			queryClient.invalidateQueries(PRODUCT_KEYS.list())
			for (const productId of productIds) {
				queryClient.invalidateQueries(PRODUCT_KEYS.read(productId))
			}
		}

		return res
	}
}

export function createInvoiceLogPaymentMutation() {
	const queryClient = useQueryClient()

	return async (data: Parameters<typeof trpc.invoice.logPayment.mutate>[0]) => {
		const res = await trpc.invoice.logPayment.mutate(data)
		queryClient.invalidateQueries(INVOICE_KEYS.read(data.id))
		queryClient.setQueryData(INVOICE_KEYS.list(), (oldData?: { id: number }[]) => {
			if (!oldData) return oldData
			return oldData.map((i) => (i.id === data.id ? res : i))
		})
		queryClient.invalidateQueries(STATS_KEYS.all)

		return res
	}
}
