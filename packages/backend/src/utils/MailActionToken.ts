import jwt from 'jsonwebtoken'

export type MailAction = {
	type: 'verify' | 'change-password' | 'disallow-emails' | 'unsubscribe'
	email: string
}

export function generateMailActionToken(action: MailAction): string {
	return jwt.sign(action, process.env.JWT_SECRET, {
		expiresIn: '36h',
	})
}

export function verifyMailActionToken(token: string): null | MailAction {
	try {
		return jwt.verify(token, process.env.JWT_SECRET) as MailAction
	} catch (err) {
		return null
	}
}
