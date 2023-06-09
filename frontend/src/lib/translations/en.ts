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

	language: {
		en: 'English',
		de: 'German',
		pl: 'Polish',
	},

	invoiceList: {
		newInvoice: 'New Invoice',
		noneFound: 'No invoices found.',
		paid: 'Paid',
		unpaid: 'Unpaid',
		partiallyPaid: '{{amount}} outstanding',
		dueInDays: '{{amount}} due in {{days}} days',
		dueTomorrow: '{{amount}} due tomorrow',
		dueToday: '{{amount}} due today',
		dueYesterday: '{{amount}} due yesterday',
		dueInDaysOverdue: '{{amount}} overdue by {{days}} days',
		deleted: 'Invoice deleted',
		finalized: 'Invoice finalized',
		markedAsPaid: 'Invoice marked as paid',
	},
	invoiceStatus: {
		draft: 'Draft',
		paid: 'Paid',
		dueInDays: 'Due in {{days}} days',
		dueTomorrow: 'Due tomorrow',
		dueToday: 'Due today',
		overdue: 'Overdue',

		finalize: 'Finalize',
		sendAndFinalize: 'Send and finalize',

		markAsPaid: 'Mark as paid',
	},
	invoiceEditor: {
		date: 'Date',
		due: 'Due',
		dueIn: 'in {{days}} days',
		toggleSearch: 'toggle search',
		note: 'Note',
		create: 'New',
		addDescription: 'Add description',
		clientRequired: 'You need to select a client',
		created: 'Invoice created',
	},
	clientEditorModal: {
		created: 'Client created',
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

		overrideTextFragments: 'Text fragments',
	},

	settings: {
		businessDetails: 'Business details',
		businessDetailsText: 'Address, company logo, tax number and banking details',
		invoiceDefaults: 'Invoice defaults',
		invoiceDefaultsText: 'Default values for new invoices',
		textFragments: 'Text fragments',
		textFragmentsText: 'Text fragments for invoices and emails',
		account: 'Your account',
		accountText: 'Email, password and language',
		invoiceNumberFormat: 'Invoice number format',
		invoiceNumberFormatText: 'Invoice number format and next running number',
		members: 'Team members',
		membersText: 'Invite and manage team members',

		saved: 'Settings saved',

		companyLogo: 'Company logo',
		bankingDetails: 'Banking details',
		bankName: 'Bank name',
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
		create: 'Create',
		duplicate: 'Duplicate',
		delete: 'Delete',
		edit: 'Edit',
		download: 'Download',
		send: 'Send',
		actions: 'Actions',
		areYouSure: 'Are you sure?',
		yes: 'Yes',
		no: 'No',
		savedChanges: 'Saved changes',
		languages: 'Languages',
		unsavedChanges: 'Unsaved changes',
	},

	demo: {
		alert: 'This page is only for demonstration purposes. Do not use it for real data.',
	},

	auth: {
		emailVerified: 'Your email address has been verified.',
		passwordResetSuccess: 'Your password has been reset.',
		registrationMailSent: 'Registration mail sent.',

		register: 'Register',
		login: 'Login',
		resetPassword: 'Reset password',
		email: 'Email',
		password: 'Password',
		passwordRepeat: 'Repeat password',
		newPassword: 'New password',
		newPasswordRepeat: 'Repeat new password',

		emailRequired: 'Email is required',
		passwordRequired: 'Password is required',
		passwordsDoNotMatch: 'Passwords do not match',
		newPasswordRequired: 'New password is required',

		noAccount: "Don't have an account?",
		alreadyHaveAnAccount: 'Already have an account?',
		forgotPassword: 'Forgot your password?',
		forgetPasswordTitle: 'Forgot password',
		forgotPasswordInfo:
			'Enter your email address and we will send you a link to reset your password.',
		forgotPasswordButton: 'Send reset link',

		canNotChangeEmail:
			'You can not change your email address - please get in touch if you have any issues.',

		passwordResetRequested: 'We sent you an email with a link to reset your password.',
		passwordResetPotentiallyRequested:
			'If you have an account with us, we sent you an email with a link to reset your password.',
		passwordReset: 'Reset password',
		passwordResetInfo:
			'When requesting a password reset, you will be sent an email with a link to reset your password. You can choose whether to sign out all signed in devices or not. Signed in devices can still access the account for up to an hour.',
		oAuthAccountChip: 'Google account',
		oAuthPasswordInfo:
			'You are using google oauth. You can change your password by changing your google password.',
		signOutAllDevices: 'Sign out all devices',
	},

	textFragments: {
		availableVariables: 'Available variables',
		name: {
			mail: {
				invoiceSubject: 'Invoice email: Subject',
				invoiceText: 'Invoice email: Text',
			},
			invoice: {
				note: 'Invoice: Default invoice note',
				footerNote: 'Invoice: Footer note',
				paymentNote: 'Invoice: Payment note',
			},
		},
	},

	error: {
		sessionExpired: 'Your session expired',
	},

	...SHARED_TRANSLATION_EN,
} as const
