import { TRANSLATIONS_EN as SHARED_TRANSLATION_EN } from '../../../../shared/invoice-translations/en'

export const TRANSLATIONS_EN = {
	menu: {
		dashboard: 'Dashboard',
		invoices: 'Invoices',
		clients: 'Clients',
		products: 'Products',
		settings: 'Settings',
		logout: 'Logout',
	},
	invoiceList: {
		newInvoice: 'New Invoice',
		noneFound: 'No invoices found.',
		paid: 'Paid',
		unpaid: 'Unpaid',
		partiallyPaid: '{{amount}} outstanding',
		dueInDays: '{{amount}} due in {{days}} days',
		dueInTomorrow: '{{amount}} due tomorrow',
		dueToday: '{{amount}} due today',
		dueYesterday: '{{amount}} due yesterday',
		dueInDaysOverdue: '{{amount}} overdue by {{days}} days',
	},
	invoiceEditor: {
		date: 'Date',
		due: 'Due',
		dueIn: 'in {{days}} days',
		toggleSearch: 'toggle search',
		note: 'Note',
		create: 'New',
	},
	clientEditorModal: {
		updated: 'Client updated',
		deleted: 'Client deleted',
		update: 'Update client',
		create: 'Create client',
	},
	clientEditor: {
		noneFound: 'No clients found.',
		newClient: 'New Client',
		companyName: 'Company name',
		additionalLine: 'Additional line',
		shorthand: 'Shorthand',
		firstName: 'First name',
		lastName: 'Last name',
		street: 'Street',
		streetNumber: 'Street number',
		city: 'City',
		zip: 'ZIP',
		country: 'Country',
		email: 'Email',
		phone: 'Phone',
		vatId: 'VAT ID',
		invoiceDefaults: 'Invoice defaults',
		defaultLanguage: 'Default language',
		defaultCurrency: 'Default currency',
		defaultDueDays: 'Default due days',
	},
	settings: {
		accountDetails: 'Your account details',
		companyLogo: 'Company logo',
		bankingDetails: 'Banking details',
		bankName: 'Bank name',
		invoiceNumberFormatting: 'Invoice number formatting',
		format: 'Format',
		nextRunningNumber: 'Next running number',
		uploadNew: 'Upload new',
	},
	general: {
		client: 'Client',
		status: 'Status',
		error: 'Something went wrong.',
		cancel: 'Cancel',
		save: 'Save',
		delete: 'Delete',
		areYouSure: 'Are you sure?',
		yes: 'Yes',
		no: 'No',
	},

	...SHARED_TRANSLATION_EN,
} as const
