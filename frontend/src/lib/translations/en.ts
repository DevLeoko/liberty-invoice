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

		product: {
			products: 'Products:',
			noMatching: 'No matching products found',
			addAsNew: 'Add as new product:',
			unit: 'unit',
			linkedTo: 'Linked to product:',
			remainingUnits: 'Remaining units:',
			unlink: 'Unlink',
			itemDiffers: 'Position differs from the product data:',
			nameDiffers: 'Name differs',
			descriptionDiffers: 'Description differs',
			unitPriceDiffers: 'Unit price differs',
			unitDiffers: 'Unit differs',
			updateProduct: 'Update product',
		},
	},
	clientEditorModal: {
		created: 'Client created',
		updated: 'Client updated',
		deleted: 'Client deleted',
		update: 'Update client',
		create: 'Create client',
	},

	productEditorModal: {
		created: 'Product created',
		updated: 'Product updated',
		deleted: 'Product deleted',
		update: 'Update product',
		create: 'Create product',
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
		defaultTaxRate: 'Default tax rate',

		overrideTextFragments: 'Text fragments',
	},

	productEditor: {
		name: 'Name',
		description: 'Description',
		unitPrice: 'Unit price',
		unit: 'Unit (e.g. pcs, kg, h)',
		currency: 'Currency',

		noneFound: 'No products found.',
		trackStock: 'Track stocked quantity',
		stockedQuantity: 'Stocked quantity',
		trackStockExplain:
			'If you enable this option, the stocked quantity will be decreased by the quantity of each invoice item linked to the product when the invoice is finalized.',
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
		taxRates: 'Tax rates',
		taxRatesText: 'Manage tax rates',

		saved: 'Settings saved',

		companyLogo: 'Company logo',
		bankingDetails: 'Banking details',
		bankName: 'Bank name',
		format: 'Format',
		nextRunningNumber: 'Next running number',
		uploadNew: 'Upload new',

		uploading: 'Uploading...',
		uploaded: 'Upload successful',

		marketingConsent: 'Marketing consent',
		marketingConsentText: 'I agree to receive marketing emails from Liberty Invoice',
	},

	taxRates: {
		name: 'Name',
		displayText: 'Display text',
		rate: 'Rate',
		taxRate: 'Tax rate',

		updated: 'Tax rate updated',
		deleted: 'Tax rate deleted',
		create: 'Create tax rate',
		update: 'Update tax rate',

		newTaxRate: 'New tax rate',

		rateOutOfRange: 'Rate must be between 0 and 100',
		nameAndDisplayTextRequired: 'Name and display text are required',

		manageInSettingsPre: 'Manage tax rates in the ',
		manageInSettingsLink: 'settings',
		manageInSettingsPost: '.',
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
		close: 'Close',
		back: 'Back',
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

	gettingStarted: {
		welcome: 'Welcome to Liberty Invoice!',
		checklist: {
			text: 'To use the full potential of Liberty Invoice you should specify:',
			businessName: 'Your business name',
			address: 'Your address',
			bankingDetails: 'Your banking details',
		},
		getStarted: 'Get started',
		finish: 'Finish',
		saveAndContinue: 'Save and continue',

		stepWelcomeTitle: 'Welcome to Liberty Invoice',
		stepWelcomeText:
			"Let's get you started with Liberty Invoice. All information that you provide here can later be changed in the settings.",

		stepNameTitle: 'Business name and logo',
		stepNameText:
			'Almost all inputs in Liberty Invoice are optional. You are issuing invoices as a private person? No problem, you can just leave the business name empty.',

		stepAddressTitle: 'Business address',
		stepAddressText: 'This address will be displayed on your invoices.',

		stepVatTitle: 'VAT-Id and payment details',
		stepVatText: 'These details will be used on your invoices.',

		stepDefaultTitle: 'Invoice defaults',
		stepDefaultText: 'You can also adjust these for each client and each invoice.',

		allDone: {
			title: 'All done!',
			text: "You're all set up! You can now create your first invoice.",
			cta1: 'Make sure to join our',
			cta2: 'Discord server',
			cta3: 'to get the latest updates and to give feedback.',
		},
	},

	dashboard: {
		revenueThisMonth: 'Revenue this month',
		outstandingInvoices: 'Outstanding invoices',
		overdueInvoices: 'Overdue invoices',
		invoicesThisMonth: 'Invoices this month',
	},

	auth: {
		legalLinks: {
			termsOfService: 'Terms Of Service',
			privacyPolicy: 'Privacy Policy',
			impressum: 'Legal Notice',
		},

		or: '- or -',

		emailVerified: 'Your email address has been verified.',
		passwordResetSuccess: 'Your password has been reset.',
		registrationMailSent: 'Verification mail sent - please check your inbox.',

		agreeTo: 'By signing up, you agree to the ',
		termsOfService: 'Terms of Service',
		and: ' and ',
		privacyPolicy: 'Privacy Policy',

		agreeToTermsRequired: 'Required to sign up',

		agreeToMarketing: 'I want to receive emails about new features and updates',

		register: 'Sign Up',
		login: 'Login',
		resetPassword: 'Reset password',
		email: 'Email',
		password: 'Password',
		passwordRepeat: 'Repeat password',
		newPassword: 'New password',
		newPasswordRepeat: 'Repeat new password',

		emailRequired: 'Email is required',
		passwordRequired: 'Password is required',
		passwordNotSecure:
			'Password has to be at least 8 characters long and contain at least one number and one letter',
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
			'When requesting a password reset, you will be sent an email with a link to reset your password. \n\nYou can choose whether to sign out all signed in devices or not. Signed in devices can still access the account for up to an hour.',
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
