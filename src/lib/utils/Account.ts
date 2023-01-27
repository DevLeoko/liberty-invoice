import { writable } from 'svelte/store'
import type { ClientDetails } from './Client'

export interface BankingDetails {
	bankName?: string
	iban?: string
	bic?: string
}

export interface AccountDetails extends ClientDetails {
	bankingDetails: BankingDetails
	logoUrl?: string
}

export const SAMPLE_ACCOUNT: AccountDetails = {
	name: 'MyComp Inc.',
	firstName: 'John',
	lastName: 'Doe',
	phone: '+1 234 567 890',
	email: 'contact@mycomp.com',
	address: {
		street: 'Anystreet',
		streetNumber: '12',
		city: 'Thiscity',
		zip: '12345',
		countryCode: 'US'
	},
	vatNumber: 'US123456789',
	bankingDetails: {
		bankName: 'MyBank',
		iban: 'US12 3456 7891 1234 1846 20',
		bic: 'US123456789'
	},
	logoUrl: 'example-logo.svg'
}

export const account = writable(SAMPLE_ACCOUNT)
