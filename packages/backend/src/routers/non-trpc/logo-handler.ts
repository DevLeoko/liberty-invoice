import type { Request, Response } from 'express'
import FileType from 'file-type'
import fs from 'fs/promises'
import { prisma } from '../../prisma'

const LOGO_UPLOAD_PATH = `${process.env.FILE_STORAGE_PATH}/logos`
const VALID_EXTENSIONS = ['png', 'jpg']
const VALID_MIME_TYPES = ['image/png', 'image/jpeg']

// Ensure that the logo upload path exists
fs.mkdir(LOGO_UPLOAD_PATH, { recursive: true })

export async function logoUploadHandler(req: Request, res: Response) {
	if (!req.auth?.userId) {
		res.status(401).send('Unauthorized')
		return
	}

	const file = req.file

	if (!file) {
		res.status(400).send('No file uploaded')
		return
	}

	const fileType = await FileType.fromBuffer(file.buffer)
	const isValidExtension = VALID_EXTENSIONS.includes(fileType?.ext ?? '')
	const isValidMimeType = VALID_MIME_TYPES.includes(fileType?.mime ?? '')
	if (!isValidExtension || !isValidMimeType) {
		res.status(400).send('Invalid file type')
		return
	}

	const filename = `${req.auth?.userId}.${fileType!.ext}`

	await fs.writeFile(`${LOGO_UPLOAD_PATH}/${filename}`, file.buffer)

	await prisma.userSettings.update({
		where: { userId: req.auth?.userId },
		data: { logoUrl: filename },
	})

	res.send({ filename })
}

export async function logoViewHandler(req: Request, res: Response) {
	if (!req.auth?.userId) {
		res.status(401).send('Unauthorized')
		return
	}

	const userSettings = await prisma.userSettings.findUnique({ where: { userId: req.auth?.userId } })

	// Get the filename from the request parameter
	const filename = userSettings!.logoUrl

	const file = await fs.readFile(`${LOGO_UPLOAD_PATH}/${filename}`)

	let mimeType = 'png'
	if (filename.endsWith('.jpg')) mimeType = 'jpeg'

	res.setHeader('Content-Type', `image/${mimeType}`)
	res.send(file)
}
