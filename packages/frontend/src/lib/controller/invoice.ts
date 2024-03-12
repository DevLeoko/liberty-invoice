import { PUBLIC_BACKEND_URL } from '$env/static/public'
import type { Paged } from '$lib/utils/svelteQueryUtils'
import { createInfiniteQuery, createQuery, useQueryClient } from '@tanstack/svelte-query'
import { cloneDeep } from 'lodash'
import SuperJSON from 'superjson'
import {
	trpc,
	type CreateInvoice,
	type InvoiceListQuery,
	type ListInvoice,
	type ReadInvoice,
} from '../trpcClient'
import { PRODUCT_KEYS } from './product'
import { STATS_KEYS } from './stats'

export const INVOICE_KEYS = {
	all: ['invoice'],
	list: () => [...INVOICE_KEYS.all, 'list'],
	allList: () => [...INVOICE_KEYS.all, 'list'],
	listQuery: (query: InvoiceListQuery) => [
		...INVOICE_KEYS.allList(),
		{ status: query.status ?? false },
		{ issuedBefore: query.issuedBefore },
		query,
	],
	read: (invoiceId: string) => [...INVOICE_KEYS.all, 'read', invoiceId],
}

type AllListBaseData = Paged<{
	results: ListInvoice[]
}>

export function createInvoiceQuery(
	query: Omit<InvoiceListQuery, 'take' | 'skip'>,
	pageSize: number
) {
	return createInfiniteQuery({
		queryKey: INVOICE_KEYS.listQuery({ ...query, take: pageSize }),
		queryFn: ({ pageParam }) => {
			return trpc.invoice.list
				.query({ ...query, take: pageSize, skip: pageParam })
				.then((res) => ({ ...res }))
		},
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage.hasMore) return undefined
			return allPages.reduce((acc, page) => acc + page.results.length, 0)
		},
	})
}

export function createInvoiceReadQuery(invoiceId: string) {
	return createQuery({
		queryKey: INVOICE_KEYS.read(invoiceId),
		queryFn: () => trpc.invoice.read.query(invoiceId),
	})
}

export function queryInvoiceRead(invoiceId: string) {
	return useQueryClient().fetchQuery({
		queryKey: INVOICE_KEYS.read(invoiceId),
		queryFn: () => trpc.invoice.read.query(invoiceId),
	})
}

export function createInvoiceReadFetcher() {
	const queryClient = useQueryClient()

	return (invoiceId: string) => {
		return queryClient.fetchQuery({
			queryKey: INVOICE_KEYS.read(invoiceId),
			queryFn: () => trpc.invoice.read.query(invoiceId),
		})
	}
}

export function createInvoiceDeleteMutation() {
	const queryClient = useQueryClient()

	return async (invoiceId: string) => {
		const res = await trpc.invoice.delete.mutate(invoiceId)

		queryClient.setQueriesData(INVOICE_KEYS.list(), (oldData?: AllListBaseData) => {
			if (!oldData) return oldData

			const newData = cloneDeep(oldData)

			newData.pages.forEach((page) => {
				page.results = page.results.filter((invoice) => invoice.id !== invoiceId)
			})

			return newData
		})
		queryClient.invalidateQueries(INVOICE_KEYS.read(invoiceId))
		queryClient.invalidateQueries(STATS_KEYS.all)

		return res
	}
}

export function createInvoiceUpdateMutation() {
	const queryClient = useQueryClient()

	return async (data: Parameters<typeof trpc.invoice.update.mutate>[0]) => {
		const res: ReadInvoice = await trpc.invoice.update.mutate(data)
		queryClient.setQueryData(INVOICE_KEYS.read(res.id), res)
		queryClient.invalidateQueries(INVOICE_KEYS.list())
		queryClient.invalidateQueries(STATS_KEYS.all)

		return res
	}
}

export function createInvoiceCreateMutation() {
	const queryClient = useQueryClient()

	return async (data: Parameters<typeof trpc.invoice.create.mutate>[0]) => {
		const res: ReadInvoice = await trpc.invoice.create.mutate(data)

		queryClient.setQueryData(INVOICE_KEYS.read(res.id), res)
		queryClient.invalidateQueries(INVOICE_KEYS.list())
		queryClient.invalidateQueries(STATS_KEYS.all)

		return res
	}
}

export function createInvoiceFinalizeMutation() {
	const queryClient = useQueryClient()

	return async (invoiceId: string) => {
		const res = await trpc.invoice.finalize.mutate(invoiceId)
		queryClient.invalidateQueries(INVOICE_KEYS.read(invoiceId))

		queryClient.setQueryData(INVOICE_KEYS.list(), (oldData?: AllListBaseData) => {
			if (!oldData) return oldData
			// return oldData.map((i) => (i.id === invoiceId ? res : i))

			const newData = cloneDeep(oldData)

			newData.pages.forEach((page) => {
				page.results = page.results.map((invoice) => (invoice.id === invoiceId ? res : invoice))
			})

			return newData
		})
		const productIds = res.items.map((i) => i.productId).filter((i) => i !== null) as string[]
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
		queryClient.setQueryData(INVOICE_KEYS.list(), (oldData?: AllListBaseData) => {
			if (!oldData) return oldData

			const newData = cloneDeep(oldData)

			newData.pages.forEach((page) => {
				page.results = page.results.map((invoice) => (invoice.id === data.id ? res : invoice))
			})

			return newData
		})
		queryClient.invalidateQueries(STATS_KEYS.all)

		return res
	}
}

export function previewInvoice(invoice: CreateInvoice) {
	// Make a post request to the server to generate a pdf
	const url = `${PUBLIC_BACKEND_URL}/invoices/preview?action=inline`

	const form = document.createElement('form')
	form.method = 'POST'
	form.action = url
	form.target = '_blank'
	form.style.display = 'none'

	const input = document.createElement('input')
	input.type = 'hidden'
	input.name = 'invoice'
	input.value = SuperJSON.stringify(invoice)

	form.appendChild(input)
	document.body.appendChild(form)
	form.submit()
	document.body.removeChild(form)
}

export function getDownloadUrl(invoiceId: string) {
	return `${PUBLIC_BACKEND_URL}/invoices/${invoiceId}/download`
}

export function emptyInvoiceItem() {
	return { description: '', quantity: 1, name: '', unit: '', unitPrice: 0, productId: null }
}
