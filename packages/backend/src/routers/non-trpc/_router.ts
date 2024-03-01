import { urlencoded } from 'express'
import type { Express, NextFunction, Request, Response } from 'express'
import multer from 'multer'
import { invoiceDownloadHandler, invoicePreviewHandler } from './invoice-download'
import { logoUploadHandler, logoViewHandler } from './logo-handler'

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next)
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
}
