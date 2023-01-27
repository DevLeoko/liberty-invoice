import { writable } from 'svelte/store'
import type { TranslationFunction } from './i18n'

export interface ClientDetails {
	name?: string
	shorthand?: string
	additionalLine?: string
	firstName?: string
	lastName?: string
	phone?: string
	email?: string
	address: Address
	vatNumber?: string
}

export interface Address {
	street?: string
	streetNumber?: string
	city?: string
	zip?: string
	countryCode?: string
}

export function getClientDisplayLines(client: ClientDetails, t: TranslationFunction) {
	const lines = []
	if (client.name) {
		lines.push(client.name)
	}
	if (client.additionalLine) {
		lines.push(client.additionalLine)
		lines.push('')
	}
	if (client.firstName || client.lastName) {
		lines.push(`${client.firstName || ''} ${client.lastName || ''}`.trim())
	}
	if (client.address) {
		lines.push(...getAddressDisplayLines(client.address, t))
	}
	if (client.vatNumber || client.phone || client.email) {
		lines.push('')
	}
	if (client.vatNumber) {
		lines.push(`${t('invoice.vatId')}: ${client.vatNumber}`)
	}
	if (client.phone) {
		lines.push(client.phone)
	}
	if (client.email) {
		lines.push(client.email)
	}
	return lines
}

export function getAddressDisplayLines(address: Address, t: TranslationFunction): string[] {
	const lines = []
	if (address.street) {
		lines.push(`${address.street} ${address.streetNumber || ''}`.trim())
	}
	if (address.city || address.zip) {
		lines.push(`${address.zip || ''} ${address.city || ''}`.trim())
	}
	if (address.countryCode) {
		lines.push(t(`countries.${address.countryCode as 'US'}`))
	}
	return lines
}

export const SAMPLE_CLIENT: ClientDetails = {
	name: 'SomeComp Ltd.',
	phone: '+1 234 567 890',
	email: 'info@somecomp.com',
	shorthand: 'SC',
	address: {
		street: 'Anystreet',
		streetNumber: '12',
		city: 'Thiscity',
		zip: '12345',
		countryCode: 'US'
	},
	vatNumber: 'US123456789'
}

export const clients = writable([SAMPLE_CLIENT])
