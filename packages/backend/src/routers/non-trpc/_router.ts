import type { Express, NextFunction, Request, Response } from 'express'
import { raw, urlencoded } from 'express'
import multer from 'multer'
import { invoiceDownloadHandler, invoicePreviewHandler } from './invoice-download'
import { logoUploadHandler, logoViewHandler } from './logo-handler'
import { mailActionHandler } from './mail-action'
import { stripeWebhookHandler } from './stripe-webhooks'

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch((err) => {
			console.error(err)
			res.status(500).send('An error occurred')
		})
	}
}

export async function setupNonTrpcRoutes(app: Express) {
	app.get('/invoices/:invoiceId/download', asyncHandler(invoiceDownloadHandler))

	app.post(
		'/invoices/preview',
		urlencoded({
			extended: true,
		}),
		asyncHandler(invoicePreviewHandler)
	)

	app.post(
		'/logo/upload',
		multer({
			limits: {
				fileSize: 1024 * 1024 * 2,
			},
		}).single('file'),
		asyncHandler(logoUploadHandler)
	)
	app.get('/logo', asyncHandler(logoViewHandler))

	app.post(
		'/stripe/webhooks',
		raw({ type: 'application/json' }),
		asyncHandler(stripeWebhookHandler)
	)

	app.get('/mail-action', asyncHandler(mailActionHandler))
}
