import localforage from 'localforage'
import type { Unsubscriber, Writable } from 'svelte/store'
import { account } from './Account'
import { clients } from './Client'
import { locale } from './i18n'
import { activeInvoiceId, invoices } from './Invoice'

localforage.config({
	name: 'liberty-invoice',
	description: 'Liberty-Invoice data'
})

function sync<T>(store: Writable<T>, key: string): Promise<Unsubscriber> {
	return localforage.getItem<T>(key).then((stored) => {
		if (stored) store.set(stored)

		return store.subscribe((value) => {
			localforage.setItem(key, value)
		})
	})
}

export function syncAllStores(): Promise<Unsubscriber> {
	return Promise.all([
		sync(account, 'account'),
		sync(clients, 'clients'),
		sync(invoices, 'invoices'),
		sync(activeInvoiceId, 'activeInvoiceId'),
		sync(locale, 'locale')
	]).then((unsubscribers) => () => {
		unsubscribers.forEach((unsubscriber) => unsubscriber())
	})
}
