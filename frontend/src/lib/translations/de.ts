import type { TranslationDictionary } from '../utils/translations';

export const TRANSLATIONS_DE: TranslationDictionary = {
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

		asFreelancer: 'Tätig als Freiberufler',

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

		deliveryDateNotice:
			'<span>Soweit nicht anders angegeben, enspricht</span><br/><span> Lieferdatum dem Rechnungsdatum</span>'
	}
};
