export enum Locale {
	EN = 'en',
	DE = 'de'
}

export const LOCALES = Object.values(Locale) as string[]

const en = {
	countries: {
		AT: 'Austria',
		DE: 'Germany',
		PL: 'Poland',
		US: 'United States'
	},
	invoice: {
		invoice: 'Invoice',
		invoiceNumber: 'Invoice number',
		invoiceDate: 'Invoice date',
		dueDate: 'Due date',

		billedTo: 'Billed to',
		dueText: '{{amount}} due {{date}}',
		vatId: 'VAT',

		item: 'Item',
		quantity: 'Qty',
		unitPrice: 'Unit price',
		amount: 'Amount',
		subtotal: 'Subtotal',
		tax: 'Tax',
		taxReverseCharge: 'Tax be paid on reverse change basis',
		total: 'Total',
		page: 'Page {{page}} of {{pages}}',

		bankingInfo: 'Banking information',
		paymentDetails: 'Payment details',
		paymentDetailsLine1: 'Payment due within {{days}} days',
		paymentDetailsLine3: 'Bank transfer',
		paymentDetailsLine2: 'Please use the invoice number as reference',
		deliveryDateNotice: 'Delivery date corresponds to invoice date'
	}
} as const

// Type to convert { foo: { bar: string } } to "foo.bar"
type KeyPath<T> = T extends string
	? ''
	: T extends Record<string, Record<string, unknown>>
	? `${string & keyof T}.${KeyPath<T[string & keyof T]>}`
	: T extends Record<string, unknown>
	? `${string & keyof T}`
	: never

export type TranslationPaths = KeyPath<typeof en>

// Type to replace const string types with general string type recursively
type ReplaceConst<T> = T extends string ? string : { [K in keyof T]: ReplaceConst<T[K]> }

export const TRANSLATIONS: Record<Locale, ReplaceConst<typeof en>> = {
	[Locale.EN]: en,
	de: {
		countries: {
			AT: 'Österreich',
			DE: 'Deutschland',
			PL: 'Polen',
			US: 'Vereinigte Staaten'
		},
		invoice: {
			invoice: 'Rechnung',
			invoiceNumber: 'Rechnungsnummer',
			invoiceDate: 'Rechnungsdatum',
			dueDate: 'Fälligkeitsdatum',

			billedTo: 'Rechnungsempfänger',
			dueText: '{{amount}} fällig am {{date}}',
			vatId: 'USt-ID',

			item: 'Artikel',
			quantity: 'Menge',
			unitPrice: 'Preis',
			amount: 'Betrag',
			subtotal: 'Zwischensumme',
			tax: 'Steuer',
			taxReverseCharge:
				'<span>Steuerschuldschaft durch</span><br/> <span>Leistungsempfänger (Reverse Charge)</span>',
			total: 'Gesamt',
			page: 'Seite {{page}} von {{pages}}',

			bankingInfo: 'Bankverbindung',
			paymentDetails: 'Zahlungsinformationen',
			paymentDetailsLine1: 'Zahlbar innerhalb von {{days}} Tagen',
			paymentDetailsLine3: 'Banküberweisung',
			paymentDetailsLine2:
				'<span>Bitte geben Sie die Rechnungsnummer</span><br/><span>als Verwendungszweck an</span>',

			deliveryDateNotice: 'Lieferdatum entspricht Rechnungsdatum'
		}
	}
}
