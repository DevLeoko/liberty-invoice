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

		overrideTextFragments: 'Textbausteine',
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

		companyLogo: 'Firmenlogo',
		bankingDetails: 'Bankverbindung',
		bankName: 'Bankname',
		format: 'Format',
		nextRunningNumber: 'Nächste Laufnummer',
		uploadNew: 'Neues Logo hochladen',

		saved: 'Einstellungen gespeichert',

		uploading: 'Hochladen...',
		uploaded: 'Logo hochgeladen',
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
	},

	demo: {
		alert:
			'Diese Seite ist nur für Demonstrationszwecke. Bitte verwenden Sie sie nicht für echte Daten.',
	},

	auth: {
		emailVerified: 'E-Mail-Adresse bestätigt',
		passwordResetSuccess: 'Passwort erfolgreich zurückgesetzt',
		registrationMailSent: 'Registrierungsmail versendet',

		register: 'Registrieren',
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
			'Wenn Sie ein Passwort zurücksetzen, wird Ihnen eine E-Mail mit einem Link zum Zurücksetzen Ihres Passworts gesendet. Sie können wählen, ob Sie alle angemeldeten Geräte abmelden möchten oder nicht. Angemeldete Geräte können innerhalb einer Stunde weiterhin auf das Konto zugreifen.',
		oAuthAccountChip: 'Google-Konto',
		oAuthPasswordInfo:
			'Sie verwenden Google OAuth. Sie können Ihr Passwort ändern, indem Sie Ihr Google-Passwort ändern.',
		signOutAllDevices: 'Alle Geräte abmelden',
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

	error: {
		sessionExpired: 'Seine Sitzung ist abgelaufen. Bitte melde dich neu an.',
	},

	...SHARED_TRANSLATION_DE,
}
