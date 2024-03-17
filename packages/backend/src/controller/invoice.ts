import { formatClientName } from '$shared/client-formatter'
import type { Locale } from '$shared/invoice-translations/translations'
import { translateShared } from '$shared/invoice-translations/translations'
import { getTextFragmentInvoiceVariables, parseTextFragment } from '$shared/text-fragment'
import type { Prisma } from '@prisma/client'
import xss from 'xss'
import { prisma } from '../prisma'
import { getMailActionUrl } from '../utils/MailActionToken'
import { TError } from '../utils/TError'
import { sendMail } from '../utils/mailer'
import { buildInvoicePdf } from '../utils/pdf/invoice-pdf'

// TODO: This seems like an extensive amount of data for a list - check if all is necessary
export const LIST_INVOICE_DEFAULT_INCLUDES = {
	client: {
		select: {
			name: true,
			firstName: true,
			lastName: true,
		},
	},
	items: true,
	taxRates: {
		select: {
			id: true,
		},
	},
} satisfies Prisma.InvoiceInclude

export const READ_INVOICE_DEFAULT_INCLUDES = {
	client: true,
	items: true,
	taxRates: {
		select: {
			id: true,
		},
	},
} satisfies Prisma.InvoiceInclude

async function queryInvoiceStockedProducts(invoiceId: string) {
	return (await prisma.invoiceItem.findMany({
		where: {
			invoiceId: invoiceId,
			product: {
				stockedUnits: {
					not: {
						equals: null,
					},
				},
			},
		},
		select: {
			quantity: true,
			productId: true,
		},
	})) as { quantity: number; productId: string }[]
}

function buildReduceStockedUnitsQueries(products: { quantity: number; productId: string }[]) {
	return products.map((product) =>
		prisma.product.update({
			where: {
				id: product.productId!,
			},
			data: {
				stockedUnits: {
					decrement: product.quantity,
				},
			},
		})
	)
}

export async function finalizeInvoice(invoiceId: string) {
	const products = await queryInvoiceStockedProducts(invoiceId)

	const updateQueries = [
		...buildReduceStockedUnitsQueries(products),
		prisma.invoice.update({
			where: {
				id: invoiceId,
			},
			data: {
				draft: false,
			},
			include: LIST_INVOICE_DEFAULT_INCLUDES,
		}),
	]

	const results = await prisma.$transaction(updateQueries)

	return results[results.length - 1] as Prisma.InvoiceGetPayload<{
		include: typeof LIST_INVOICE_DEFAULT_INCLUDES
	}>
}

export async function isEmailDisallowed(email: string) {
	return prisma.disallowedEmailAddress
		.findUnique({
			where: {
				email,
			},
		})
		.then((result) => !!result)
}

export async function sendInvoiceEmail(options: {
	invoiceId: string
	email: string
	cc?: string
	bcc?: string
	content: {
		subject: string
		body: string
	} | null
	sendingUserId: string
}) {
	if (await isEmailDisallowed(options.email)) {
		throw new TError('error.targetEmailDisallowed')
	}

	const invoice = await prisma.invoice.findUnique({
		where: {
			id: options.invoiceId,
		},
		include: {
			user: {
				include: {
					userSettings: true,
				},
			},
			client: true,
			items: true,
			taxRates: true,
		},
	})

	if (!invoice) {
		throw new Error('Invoice not found')
	}

	const userSettings = invoice!.user.userSettings!

	let subject = options.content?.subject || ''

	// Body is sent as HTML, so it needs to be sanitized
	let body = options.content?.body ? xss(options.content.body) : ''

	// Load default subject and body if none is provided
	if (options.content === null) {
		const defaultSubject = translateShared(
			invoice!.language as Locale,
			'textFragmentDefaults.mail.invoiceSubject'
		)
		const defaultBody = translateShared(
			invoice!.language as Locale,
			'textFragmentDefaults.mail.invoiceText'
		)

		const invoiceVariables = getTextFragmentInvoiceVariables(invoice!, userSettings)

		subject = parseTextFragment(defaultSubject, invoiceVariables)
		body = parseTextFragment(defaultBody, invoiceVariables)
	}

	const unsubscribeUrl = getMailActionUrl({ type: 'disallow-emails', email: options.email })
	const mailDisclaimer = translateShared(
		invoice!.language as Locale,
		'mailTemplate.footerDisclaimer',
		{
			url: unsubscribeUrl,
		}
	)

	const fullMailBody =
		`${body}<br><br><p style="font-size: 11px; color: #666;">${mailDisclaimer}</p>`.replace(
			/\n/g,
			'<br>'
		)

	const invoicePdf = await buildInvoicePdf(invoice)
	const senderName = formatClientName(userSettings)

	await sendMail({
		fromName: senderName,
		subject: subject,
		body: fullMailBody,
		to: options.email,
		cc: options.cc,
		bcc: options.bcc,
		attachments: [
			{
				filename: `${invoice.invoiceNumber}.pdf`,
				buffer: invoicePdf,
			},
		],
		unsubscribeLink: unsubscribeUrl,
	})
}
