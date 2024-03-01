import type { Request, Response } from 'express'
import SuperJSON from 'superjson'
import { z } from 'zod'
import { prisma } from '../../prisma'
import { buildInvoicePdf } from '../../utils/pdf/invoice-pdf'
import { invoiceCreateSchema } from '../invoice-schemas'

const downloadQuerySchema = z.object({
	invoiceId: z.string(),
	downloadType: z.enum(['inline', 'attachment']).default('inline'),
})

const downloadPreviewQuerySchema = z.object({
	invoice: invoiceCreateSchema,
	downloadType: z.enum(['inline', 'attachment']).default('inline'),
})

export async function invoiceDownloadHandler(req: Request, res: Response) {
	if (!req.userId) {
		res.status(401).send('Unauthorized')
		return
	}

	const query = downloadQuerySchema.parse({
		...req.query,
		invoiceId: req.params.invoiceId,
	})

	const invoice = await prisma.invoice.findUnique({
		where: { id: query.invoiceId },
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

	if (!invoice || invoice.user.id !== req.userId) {
		res.status(404).send('Not found')
		return
	}

	await downloadInvoice(invoice, query.downloadType, res)
}

export async function invoicePreviewHandler(req: Request, res: Response) {
	if (!req.userId) {
		res.status(401).send('Unauthorized')
		return
	}

	const query = downloadPreviewQuerySchema.parse({
		...req.query,
		invoice: SuperJSON.parse(req.body.invoice),
	})

	const [client, taxRates, user] = await Promise.all([
		prisma.client.findFirst({
			where: { userId: req.userId, id: query.invoice.clientId },
		}),
		prisma.taxRate.findMany({
			where: { userId: req.userId, id: { in: query.invoice.taxRateIds } },
		}),
		prisma.user.findUnique({
			where: { id: req.userId },
			include: { userSettings: true },
		}),
	])

	if (!client) {
		res.status(404).send('Client not found')
		return
	}

	const invoice = {
		...query.invoice,
		client,
		userId: req.userId,
		taxRates,
		user: user!,
	}

	await downloadInvoice(invoice, query.downloadType, res)
}

async function downloadInvoice(
	invoice: Parameters<typeof buildInvoicePdf>[0],
	downloadType: 'inline' | 'attachment',
	res: Response
) {
	const pdfBuffer = await buildInvoicePdf(invoice)

	let filename = `${invoice.invoiceNumber}`
	if (invoice.client.shorthand) filename += `-${invoice.client.shorthand}`

	res.setHeader('Content-Type', 'application/pdf')
	res.setHeader('Content-Disposition', `${downloadType}; filename=${filename}.pdf`)

	res.send(pdfBuffer)
}
