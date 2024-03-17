import type { TranslationDictionary } from './translations'

export const TRANSLATIONS_DE: TranslationDictionary = {
	langCodeShort: 'de',
	langCode: 'de-DE',
	countries: {
		AT: 'Österreich',
		DE: 'Deutschland',
		PL: 'Polen',
		US: 'Vereinigte Staaten',
		CN: 'China',
		IN: 'Indien',
		RU: 'Russland',
		BR: 'Brasilien',
		JP: 'Japan',
		FR: 'Frankreich',
		GB: 'Vereinigtes Königreich',
		CA: 'Kanada',
		AU: 'Australien',
		ZA: 'Südafrika',
		MX: 'Mexiko',
		KR: 'Südkorea',
		IT: 'Italien',
		SA: 'Saudi-Arabien',
		TR: 'Türkei',
		ID: 'Indonesien',
		NG: 'Nigeria',
		AR: 'Argentinien',
		IR: 'Iran',
		EG: 'Ägypten',
		NL: 'Niederlande',
		CH: 'Schweiz',
		ES: 'Spanien',
		SE: 'Schweden',
		BE: 'Belgien',
		PT: 'Portugal',
		DK: 'Dänemark',
		FI: 'Finnland',
		NO: 'Norwegen',
		IL: 'Israel',
		PK: 'Pakistan',
		MY: 'Malaysia',
		PH: 'Philippinen',
		TH: 'Thailand',
		VN: 'Vietnam',
		SG: 'Singapur',
		NZ: 'Neuseeland',
		CO: 'Kolumbien',
		VE: 'Venezuela',
		PE: 'Peru',
		CL: 'Chile',
		GR: 'Griechenland',
		HU: 'Ungarn',
		AE: 'Vereinigte Arabische Emirate',
		KE: 'Kenia',
		ET: 'Äthiopien',
		GH: 'Ghana',
		TZ: 'Tansania',
		UA: 'Ukraine',
		MA: 'Marokko',
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
		total: 'Gesamt',
		page: 'Seite {{page}} von {{pages}}',

		bankingInfo: 'Bankverbindung',
		bank: 'Bank',
		paymentDetails: 'Zahlungsinformationen',
		paymentDetailsLine1: 'Zahlbar innerhalb von {{days}} Tagen',
		paymentDetailsLine3: 'Banküberweisung',
		paymentDetailsLine2: 'Bitte geben Sie die Rechnungsnummer als Verwendungszweck an',

		deliveryDateNotice: 'Soweit nicht anders angegeben, enspricht Lieferdatum dem Rechnungsdatum',

		createdWithLibertyInvoice: 'Erstellt mit LibertyInvoice',
	},

	mailTemplate: {
		footerDisclaimer:
			"Antworten Sie nicht auf diese E-Mail. Diese Rechnung wurde über <a href='https://liberty-invoice.com'>LibertyInvoice</a> versandt.\nKlicken Sie <a href='{{url}}'>hier</a>, um zukünftige E-Mails von LibertyInvoice zu untersagen.",
	},

	textFragmentDefaults: {
		mail: {
			invoiceSubject: 'Rechnung {invoiceNumber}',
			invoiceText:
				'Guten Tag {clientName},\n\nanbei erhalten Sie Ihre Rechnung {invoiceNumber} über {invoiceTotal}.\n\nMit freundlichen Grüßen,\n{accountFullName}\n{accountBusinessName}',
		},
		invoice: {
			note: '',
			footerNote: 'Soweit nicht anders angegeben, enspricht Lieferdatum dem Rechnungsdatum',
			paymentNote: 'Bitte geben Sie die Rechnungsnummer als Verwendungszweck an',
		},
	},

	taxRate: {
		reverseChargeName: 'Reverse Charge',
		reverseCharge: 'Steuerschuldschaft durch Leistungsempfänger (Reverse Charge)',
	},

	error: {
		sessionExpired: 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.',
		internalServerError: 'Etwas ist schief gelaufen. Bitte versuchen Sie es später erneut.',
		notAuthenticated: 'Sie sind nicht angemeldet.',
		googleAuthFailed: 'Google-Anmeldung fehlgeschlagen.',
		noLinkedAccount:
			'Es ist kein Konto mit dieser E-Mail-Adresse verknüpft. Bitte registrieren Sie sich.',
		invalidEmailOrPassword: 'Ungültige E-Mail-Adresse oder Passwort.',
		emailNotVerified: 'Ihre E-Mail-Adresse wurde noch nicht bestätigt.',
		notPasswordAccount: 'Bitte verwenden Sie die Google-Anmeldung für dieses Konto.',
		invalidToken: 'Dieser Link ist abgelaufen oder ungültig.',
		emailAlreadyInUse: 'Diese E-Mail-Adresse wird bereits verwendet.',
		failedCaptcha: 'Captcha fehlgeschlagen.',
		invalidInput: 'Ungültige Eingabe.',
		onlyForPlusPlan: 'Dieses Feature ist nur LiberyInvoice Plus Nutzern zugänglich.',
		invoiceMailRateLimitExceeded:
			'Mit dem Free-Plan können Sie nur bis zu 5 Rechnungen pro Woche versenden.',

		client: {
			notFound: 'Kunde nicht gefunden.',
		},

		invoice: {
			notFound: 'Rechnung nicht gefunden.',
			partialIdAlreadyClaimed: 'Diese Rechnungsnummer ist bereits vergeben.',
		},

		product: {
			notFound: 'Produkt nicht gefunden.',
		},
	},
}
