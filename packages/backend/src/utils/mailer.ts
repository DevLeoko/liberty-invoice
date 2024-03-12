import fs from 'fs'
import { createTransport } from 'nodemailer'

const mailer = createTransport({
	host: process.env.SMTP_HOST,
	port: Number.parseInt(process.env.SMTP_PORT),
	auth: {
		user: process.env.SMTP_USERNAME,
		pass: process.env.SMTP_PASSWORD,
	},
})

type MailTemplateName = 'verify-email' | 'reset-password'

export async function sendMailTemplate(
	email: string,
	subject: string,
	templateName: MailTemplateName,
	templateVariables: { [key: string]: string }
) {
	const mailTemplate = fs.readFileSync(`src/assets/mail/${templateName}.html`, 'utf8')
	const mailBody = Object.keys(templateVariables).reduce((acc, key) => {
		return acc.replace(new RegExp(`{{${key.toUpperCase()}}}`, 'g'), templateVariables[key])
	}, mailTemplate)

	return new Promise((resolve, reject) => {
		mailer.sendMail(
			{
				from: process.env.SMTP_SENDER,
				to: email,
				subject: subject,
				html: mailBody,
			},
			(err, info) => {
				if (err) {
					reject(err)
				} else {
					resolve(info)
				}
			}
		)
	})
}

export async function sendMail(options: {
	fromName: string
	to: string
	cc?: string
	bcc?: string
	subject: string
	body: string
	attachments?: { filename: string; buffer: Buffer }[]
	unsubscribeLink?: string
}) {
	return new Promise((resolve, reject) => {
		mailer.sendMail(
			{
				from: `${options.fromName} <${process.env.SMTP_SENDER_MAIL}>`,
				to: options.to,
				cc: options.cc,
				bcc: options.bcc,
				subject: options.subject,
				html: options.body,
				attachments: options.attachments
					? options.attachments.map((attachment) => ({
							filename: attachment.filename,
							content: attachment.buffer,
						}))
					: undefined,
				headers: options.unsubscribeLink
					? { 'List-Unsubscribe': options.unsubscribeLink }
					: undefined,
			},
			(err, info) => {
				if (err) {
					reject(err)
				} else {
					resolve(info)
				}
			}
		)
	})
}
