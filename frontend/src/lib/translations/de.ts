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
	},
	invoiceEditor: {
		date: 'Datum',
		due: 'Fällig',
		dueIn: 'in {{days}} Tagen',
		toggleSearch: 'Zu Suche umschalten',
		note: 'Anmerkung',
		create: 'Anlegen',
		addDescription: 'Beschreibung hinzufügen',
	},

	clientEditorModal: {
		updated: 'Kunde gespeichert',
		deleted: 'Kunde gelöscht',
		update: 'Kunden bearbeiten',
		create: 'Kunden anlegen',
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
		email: 'E-Mail',
		phone: 'Telefon',
		vatId: 'USt-IdNr.',
		invoiceDefaults: 'Rechnungsvoreinstellungen',
		defaultLanguage: 'Sprache',
		defaultCurrency: 'Währung',
		defaultDueDays: 'Zahlungsziel (Tage)',
	},

	settings: {
		accountDetails: 'Ihre Geschäftsdaten',
		companyLogo: 'Firmenlogo',
		bankingDetails: 'Bankverbindung',
		bankName: 'Bankname',
		invoiceNumberFormatting: 'Rechnungsnummer Formatierung',
		format: 'Format',
		nextRunningNumber: 'Nächste Laufnummer',
		uploadNew: 'Neues Logo hochladen',
	},

	general: {
		client: 'Kunde',
		status: 'Status',
		error: 'Etwas ist schief gelaufen.',
		cancel: 'Abbrechen',
		download: 'Herunterladen',
		edit: 'Bearbeiten',
		send: 'Senden',
		duplicate: 'Kopieren',
		save: 'Speichern',
		delete: 'Löschen',
		actions: 'Aktionen',
		areYouSure: 'Sind Sie sicher?',
		yes: 'Ja',
		no: 'Nein',
	},

	...SHARED_TRANSLATION_DE,
}
