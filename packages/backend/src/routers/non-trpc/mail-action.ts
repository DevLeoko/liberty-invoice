import type { Request, Response } from 'express'
import { verifyMailActionToken } from '../../utils/MailActionToken'

export async function mailActionHandler(req: Request, res: Response) {
	const token = req.query.token as string

	if (!token) {
		return res.status(400).send('No token provided')
	}

	const action = verifyMailActionToken(token)

	if (!action) {
		return res.status(400).send('Invalid token')
	}

	switch (action.type) {
		case 'disallow-emails':
			await onDisallowEmails(action.email, res)
			break
		case 'unsubscribe':
			await onUnsubscribe(action.email, res)
			break
		default:
			res.status(400).send('Invalid action type')
	}
}

async function onDisallowEmails(email: string, res: Response) {
	res.status(200).send('Todo - please contact support')
}

async function onUnsubscribe(email: string, res: Response) {
	res.status(200).send('Todo - please contact support')
}
