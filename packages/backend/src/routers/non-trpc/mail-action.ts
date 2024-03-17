import type { Request, Response } from 'express'
import { prisma } from '../../prisma'
import { verifyMailActionToken } from '../../utils/MailActionToken'

export async function mailActionHandler(req: Request, res: Response) {
	const token = req.query.token as string

	if (!token) {
		return res.status(400).send('No token provided')
	}

	const action = verifyMailActionToken(token)

	if (!action) {
		return res.status(400).send('Invalid or expired link')
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
	try {
		await prisma.disallowedEmailAddress.create({
			data: {
				email,
			},
		})
	} catch (err) {
		if ((err as any).code === 'P2002') {
			return res.status(200).send('You have already been removed from our email list.')
		}
		throw err
	}

	res.status(200)
		.send(`You will no longer receive any emails from Liberty Invoice users. We have added ${email} to our disallowed email list.<br>
We apologize for any inconvenience caused by unsolicited emails.<br>
<br>
If you have any questions or performed this action by mistake, please contact us at lets@respark.dev`)
}

async function onUnsubscribe(email: string, res: Response) {
	await prisma.userSettings.updateMany({
		where: {
			user: {
				email,
			},
		},
		data: {
			marketingEmails: false,
		},
	})

	res.status(200).send('You have been unsubscribed from marketing emails.')
}
