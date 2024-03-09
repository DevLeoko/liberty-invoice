import { goto } from '$app/navigation'
import { PUBLIC_BACKEND_URL } from '$env/static/public'
import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client'
import type { AppRouter, RouterInput, RouterOutput } from 'backend/routers/_app'
import SuperJSON from 'superjson'
import { get } from 'svelte/store'
import { setLoggedOut } from './stores/auth'
import { logError } from './stores/settings'
import type { TranslationPaths } from './translations/translations'

export type CreateClient = RouterInput['client']['create']
export type ListDetailedClient = RouterOutput['client']['listDetailed']['results'][0]
export type ClientListQuery = RouterInput['client']['list']

export type ReadUserSettings = RouterOutput['userSettings']['read']
export type UpdateUserSettings = RouterInput['userSettings']['update']

export type CreateInvoice = RouterInput['invoice']['create']['invoice']

export type CreateInvoiceItem = RouterInput['invoice']['create']['invoice']['items'][0]
export type ListInvoice = RouterOutput['invoice']['list'][0]
export type ReadInvoice = RouterOutput['invoice']['read']

export type ReadMe = RouterOutput['auth']['me']

export type ListTextFragment = RouterOutput['textFragment']['listDefaults'][0]
export type UpsertTextFragment = RouterInput['textFragment']['upsert']

export type CreateTaxRate = RouterInput['taxRate']['create']
export type ListTaxRate = RouterOutput['taxRate']['list'][0]
export type UpdateTaxRate = RouterInput['taxRate']['update']

export type ReadAggregationStats = RouterOutput['stats']['aggregations']

export type CreateProduct = RouterInput['product']['create']
export type UpdateProduct = RouterInput['product']['update']['product']
export type ListProduct = RouterOutput['product']['list'][0]
export type ReadProduct = RouterOutput['product']['read']

export const trpc = createTRPCProxyClient<AppRouter>({
	transformer: SuperJSON,
	links: [
		loggerLink({
			logger: (data) => {
				if (data.direction == 'down') {
					if (data.result instanceof Error) {
						if (data.result.message == 'error.notAuthenticated') {
							get(logError)('error.sessionExpired')
							setLoggedOut()
							goto('/')
						} else {
							get(logError)(data.result.message as TranslationPaths)
						}
					}
				}
			},
		}),
		httpBatchLink({
			url: PUBLIC_BACKEND_URL + '/trpc',
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: 'include',
				})
			},
		}),
	],
})

export function nonTrpcFetch(path: string, options?: RequestInit) {
	return fetch(PUBLIC_BACKEND_URL + '/' + path, options).then(async (res) => {
		if (!res.ok) {
			// Is json?
			if (res.headers.get('content-type')?.startsWith('application/json')) {
				throw new Error((await res.json())?.message ?? res.statusText)
			} else {
				throw new Error(await res.text())
			}
		}

		return res
	})
}
