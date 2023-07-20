import { TRANSLATIONS_DE as SHARED_TRANSLATION_DE } from '../../../../shared/invoice-translations/de'
import type { TranslationDictionary } from './translations'

export const TRANSLATIONS_DE: TranslationDictionary = {
	menu: {
		dashboard: 'Übersicht',
		invoices: 'Rechnungen',
		clients: 'Kunden',
		products: 'Produkte',
		settings: 'Einstellungen',
		logout: 'Abmelden',
	},

	language: {
		en: 'Englisch',
		de: 'Deutsch',
		pl: 'Polnisch',
	},

	invoiceList: {
		newInvoice: 'Neue Rechnung',
		noneFound: 'Keine Rechnungen gefunden.',
		paid: 'Bezahlt',
		unpaid: 'Unbezahlt',
		partiallyPaid: '{{amount}} ausstehend',
		dueInDays: '{{amount}} fällig in {{days}} Tagen',
		dueTomorrow: '{{amount}} fällig morgen',
		dueToday: '{{amount}} fällig heute',
		dueYesterday: '{{amount}} war fällig gestern',
		dueInDaysOverdue: '{{amount}} überfällig seit {{days}} Tagen',
		deleted: 'Rechnung gelöscht',
		finalized: 'Rechnung freigegeben',
		markedAsPaid: 'Rechnung als bezahlt markiert',
	},
	invoiceEditor: {
		date: 'Datum',
		due: 'Fällig',
		dueIn: 'in {{days}} Tagen',
		toggleSearch: 'Zu Suche umschalten',
		note: 'Anmerkung',
		create: 'Anlegen',
		addDescription: 'Beschreibung hinzufügen',
		created: 'Rechnung angelegt',
		clientRequired: 'Sie müssen einen Kunden auswählen',
		previewPdf: 'PDF-Vorschau',
		items: 'Artikel',
		remove: 'Entfernen',

		product: {
			products: 'Produkte:',
			noMatching: 'Keine passenden Produkte gefunden',
			addAsNew: 'Als neues Produkt hinzufügen:',
			unit: 'Einheit',
			linkedTo: 'Verknüpft mit Produkt:',
			remainingUnits: 'Verbleibende Einheiten:',
			unlink: 'Verknüpfung aufheben',
			itemDiffers: 'Position weicht von verknüpftem Produkt ab:',
			nameDiffers: 'Name weicht ab',
			descriptionDiffers: 'Beschreibung weicht ab',
			unitPriceDiffers: 'Preis weicht ab',
			unitDiffers: 'Einheit weicht ab',
			updateProduct: 'Produkt aktualisieren',
		},
	},

	invoiceStatus: {
		draft: 'Entwurf',
		paid: 'Bezahlt',
		dueInDays: 'Fällig in {{days}} Tagen',
		dueTomorrow: 'Fällig morgen',
		dueToday: 'Fällig heute',
		overdue: 'Überfällig',

		finalize: 'Freigeben',
		sendAndFinalize: 'Senden und freigeben',

		markAsPaid: 'Als bezahlt markieren',
	},

	clientEditorModal: {
		created: 'Kunde angelegt',
		updated: 'Kunde gespeichert',
		deleted: 'Kunde gelöscht',
		update: 'Kunden bearbeiten',
		create: 'Kunden anlegen',
	},

	productEditorModal: {
		created: 'Produkt angelegt',
		updated: 'Produkt gespeichert',
		deleted: 'Produkt gelöscht',
		update: 'Produkt bearbeiten',
		create: 'Produkt anlegen',
	},

	clientEditor: {
		noneFound: 'Keine Kunden gefunden.',
		newClient: 'Kunden anlegen',
		companyName: 'Firmenname',
		additionalLine: 'Zusatzzeile',
		shorthand: 'Kürzel',
		firstName: 'Vorname',
		lastName: 'Nachname',
		street: 'Straße',
		streetNumber: 'Hausnummer',
		city: 'Stadt',
		zip: 'PLZ',
		country: 'Land',
		noMatchingCountries: 'Keine passenden Länder gefunden',
		email: 'E-Mail',
		phone: 'Telefon',
		vatId: 'USt-IdNr.',
		invoiceDefaults: 'Rechnungsvoreinstellungen',
		defaultLanguage: 'Sprache',
		defaultCurrency: 'Währung',
		defaultDueDays: 'Zahlungsziel (Tage)',
		defaultTaxRate: 'Steuersatz',

		overrideTextFragments: 'Textbausteine',
	},

	// productEditor: {
	// 	name: 'Name',
	// 	description: 'Description',
	// 	unitPrice: 'Unit price',
	// 	unit: 'Unit (e.g. pcs, kg, h)',
	// 	currency: 'Currency',

	// 	noneFound: 'No products found.',
	// 	trackStock: 'Track stocked quantity',
	// 	stockedQuantity: 'Stocked quantity',
	// 	trackStockExplain:
	// 		'If you enable this option, the stocked quantity will be decreased by the quantity of each invoice item linked to the product when the invoice is finalized.',
	// },

	productEditor: {
		name: 'Name',
		description: 'Beschreibung',
		unitPrice: 'Preis',
		unit: 'Einheit (z.B. Stk, kg, h)',
		currency: 'Währung',

		noneFound: 'Keine Produkte gefunden.',
		trackStock: 'Lagerbestand verwalten',
		stockedQuantity: 'Lagerbestand',
		trackStockExplain:
			'Wenn Sie diese Option aktivieren, wird der Lagerbestand bei jeder Rechnung, die freigegeben wird und die das Produkt enthält, um die Menge des Rechnungsartikels verringert.',
	},

	settings: {
		businessDetails: 'Geschäftsdaten',
		businessDetailsText: 'Anschrift, Firmenlogo, Steuernummer und Bankverbindung',
		invoiceDefaults: 'Rechnungsvoreinstellungen',
		invoiceDefaultsText: 'Standardwerte für neue Rechnungen',
		textFragments: 'Textbausteine',
		textFragmentsText: 'Textbausteine für Rechnungen und E-Mails',
		account: 'Dein Account',
		accountText: 'E-Mail, Passwort und Sprache',
		invoiceNumberFormat: 'Rechnungsnummer Formatierung',
		invoiceNumberFormatText: 'Formatierung der Rechnungsnummer und nächste Laufnummer',
		members: 'Teammitglieder',
		membersText: 'Teammitglieder einladen und verwalten',
		taxRates: 'Steuersätze',
		taxRatesText: 'Steuersätze verwalten',

		companyLogo: 'Firmenlogo',
		bankingDetails: 'Bankverbindung',
		bankName: 'Bankname',
		format: 'Format',
		nextRunningNumber: 'Nächste Laufnummer',
		uploadNew: 'Neues Logo hochladen',

		saved: 'Einstellungen gespeichert',

		uploading: 'Hochladen...',
		uploaded: 'Logo hochgeladen',

		marketingConsent: 'Marketing-Einwilligung',
		marketingConsentText: 'Ich möchte über Neuigkeiten und Updates informiert werden.',

		deleteAccount: 'Account löschen',
		deleteAccountText: 'Dein Account wird unwiderruflich gelöscht.',
		accountDeleted: 'Dein Account wurde gelöscht.',
	},

	taxRates: {
		name: 'Name',
		displayText: 'Anzeigetext',
		rate: 'Prozentsatz',
		taxRate: 'Steuersatz',

		updated: 'Steuersatz aktualisiert',
		deleted: 'Steuersatz gelöscht',
		create: 'Steuersatz erstellen',
		update: 'Steuersatz aktualisieren',

		newTaxRate: 'Neuer Steuersatz',

		rateOutOfRange: 'Prozentsatz muss zwischen 0 und 100 liegen',
		nameAndDisplayTextRequired: 'Name und Anzeigetext sind erforderlich',

		manageInSettingsPre: 'Verwalten Sie die Steuersätze in ',
		manageInSettingsLink: 'den Einstellungen',
		manageInSettingsPost: '.',

		select: 'Steuersatz auswählen',
	},

	general: {
		client: 'Kunde',
		status: 'Status',
		error: 'Etwas ist schief gelaufen.',
		cancel: 'Abbrechen',
		download: 'Herunterladen',
		edit: 'Bearbeiten',
		create: 'Anlegen',
		send: 'Senden',
		duplicate: 'Kopieren',
		save: 'Speichern',
		delete: 'Löschen',
		actions: 'Aktionen',
		areYouSure: 'Sind Sie sicher?',
		yes: 'Ja',
		no: 'Nein',
		savedChanges: 'Änderungen gespeichert',
		languages: 'Sprachen',
		unsavedChanges: 'Ungespeicherte Änderungen',
		back: 'Zurück',
		close: 'Schließen',
		inDevelopment: 'Diese Funktion ist noch in Entwicklung.',
	},

	demo: {
		alert:
			'Diese Seite ist nur für Demonstrationszwecke. Bitte verwenden Sie sie nicht für echte Daten.',
	},

	gettingStarted: {
		welcome: 'Willkommen bei Liberty Invoice!',
		checklist: {
			text: 'Um das volle Potenzial von Liberty Invoice nutzen zu können, sollten Sie folgende Angaben machen:',
			businessName: 'Ihren Firmennamen',
			address: 'Ihre Adresse',
			bankingDetails: 'Ihre Bankverbindung',
		},
		getStarted: 'Los gehts',
		finish: 'Fertig',
		saveAndContinue: 'Speichern und fortfahren',

		stepWelcomeTitle: 'Willkommen bei Liberty Invoice',
		stepWelcomeText:
			'Wir gehen Schritt für Schritt durch die Einrichtung von Liberty Invoice. Alle Angaben, die Sie hier machen, können Sie später in den Einstellungen ändern.',

		stepNameTitle: 'Firmenname und Logo',
		stepNameText:
			'Fast alle Eingaben in Liberty Invoice sind optional. Sie stellen Rechnungen als Privatperson aus? Kein Problem, Sie können den Firmennamen einfach leer lassen.',

		stepAddressTitle: 'Firmenadresse',
		stepAddressText: 'Diese Adresse wird auf Ihren Rechnungen angezeigt.',

		stepVatTitle: 'USt-Id und Zahlungsdetails',
		stepVatText: 'Diese Angaben werden auf Ihren Rechnungen verwendet.',

		stepDefaultTitle: 'Standardwerte für Rechnungen',
		stepDefaultText:
			'Diese Werte können Sie auch für jeden Kunden und jede Rechnung einzeln anpassen.',

		allDone: {
			title: "Das war's auch schon!",
			text: 'Sie können jetzt Ihre erste Rechnung erstellen.',
			cta1: 'Besuchen Sie auch unseren',
			cta2: 'Discord-Server',
			cta3: 'um immer auf dem neuesten Stand zu bleiben und Feedback zu geben.',
		},
	},

	dashboard: {
		revenueThisMonth: 'Umsatz diesen Monat',
		outstandingInvoices: 'Offene Rechnungen',
		overdueInvoices: 'Überfällige Rechnungen',
		invoicesThisMonth: 'Rechnungen diesen Monat',

		revenueChart: {
			title: 'Umsatz - nach Rechnungsdatum',
			thisYear: 'Dieses Jahr',
			lastYear: 'Letztes Jahr',
			thisMonth: 'Dieser Monat',
			lastMonth: 'Letzter Monat',
		},
	},

	auth: {
		or: '- oder -',

		emailVerified: 'E-Mail-Adresse bestätigt',
		passwordResetSuccess: 'Passwort erfolgreich zurückgesetzt',
		registrationMailSent: 'Registrierungsmail versendet',

		agreeTo: 'Durch die Registrierung akzeptieren Sie die ',
		termsOfService: 'Nutzungsbedingungen',
		and: ' und ',
		privacyPolicy: 'Datenschutzbestimmungen',
		agreeToTermsRequired: 'Zur Anmeldung erforderlich',
		agreeToMarketing: 'Ich möchte E-Mails über neue Funktionen und Updates erhalten',

		register: 'Registrieren',
		registerWithMail: 'Mit E-Mail registrieren',
		completeRegistration: 'Registrierung abschließen',
		login: 'Anmelden',
		resetPassword: 'Passwort zurücksetzen',
		email: 'E-Mail',
		password: 'Passwort',
		passwordRepeat: 'Passwort wiederholen',
		newPassword: 'Neues Passwort',
		newPasswordRepeat: 'Neues Passwort wiederholen',

		emailRequired: 'E-Mail-Adresse ist erforderlich',
		newPasswordRequired: 'Neues Passwort ist erforderlich',
		passwordRequired: 'Passwort ist erforderlich',
		passwordNotSecure:
			'Das Passwort muss mindestens 8 Zeichen lang sein und mindestens eine Zahl und einen Buchstaben enthalten',
		passwordsDoNotMatch: 'Passwörter stimmen nicht überein',

		noAccount: 'Sie haben noch keinen Account?',
		alreadyHaveAnAccount: 'Sie haben bereits einen Account?',

		forgotPassword: 'Passwort vergessen?',
		forgetPasswordTitle: 'Passwort vergessen',
		forgotPasswordInfo:
			'Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.',
		forgotPasswordButton: 'Link senden',

		canNotChangeEmail:
			'Sie können Ihre E-Mail-Adresse nicht ändern - bitte kontaktieren Sie uns, wenn Sie Hilfe benötigen.',
		passwordResetRequested:
			'Wir haben Ihnen eine E-Mail mit einem Link zum Zurücksetzen Ihres Passworts gesendet.',
		passwordResetPotentiallyRequested:
			'Wenn Sie ein Konto bei uns haben, haben wir Ihnen eine E-Mail mit einem Link zum Zurücksetzen Ihres Passworts gesendet.',
		passwordReset: 'Passwort zurücksetzen',
		passwordResetInfo:
			'Zum Zurücksetzten Ihres Passwortes, erhalten Sie eine E-Mail, mit einem Link durch den Sie ein neues Passwort festlegen können. \n\nSie können wählen, ob Sie alle angemeldeten Geräte abmelden möchten. Angemeldete Geräte können innerhalb einer Stunde weiterhin auf das Konto zugreifen.',
		oAuthAccountChip: 'Google-Konto',
		oAuthPasswordInfo:
			'Sie verwenden Google OAuth. Sie können Ihr Passwort ändern, indem Sie Ihr Google-Passwort ändern.',
		signOutAllDevices: 'Alle Geräte abmelden',

		legalLinks: {
			termsOfService: 'Nutzungsbedingungen',
			privacyPolicy: 'Datenschutz',
			impressum: 'Impressum',
		},
	},

	textFragments: {
		availableVariables: 'Verfügbare Variablen',
		name: {
			mail: {
				invoiceSubject: 'Rechnung E-Mail: Betreff',
				invoiceText: 'Rechnung E-Mail: Text',
			},
			invoice: {
				note: 'Rechnung: Standard Anmerkung',
				footerNote: 'Rechnung: Fußnotiz',
				paymentNote: 'Rechnung: Zahlungsanmerkung',
			},
		},
	},

	...SHARED_TRANSLATION_DE,
}
