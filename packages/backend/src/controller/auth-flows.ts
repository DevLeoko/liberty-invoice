import type { AuthPayload } from '$shared/AuthPayload'
import type { Plan } from '$shared/plans'
import type { Prisma } from '@prisma/client'
import type { NextFunction, Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { prisma } from '../prisma'
import { TError } from '../utils/TError'
import { Authenticator } from '../utils/authenticator'
import { sendMailTemplate } from '../utils/mailer'

const googleOAuth = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT_ID)
const authenticator = new Authenticator<AuthPayload>(process.env.JWT_SECRET)

async function checkUserPlan(
	user: Prisma.UserGetPayload<{ select: { activePlan: true; planValidUntil: true; id: true } }>
) {
	if (!user.activePlan) return

	if (user.planValidUntil && user.planValidUntil > new Date()) return

	await prisma.user.update({
		where: {
			id: user.id,
		},
		data: {
			activePlan: null,
		},
	})

	user.activePlan = null
}

async function refreshSessionExtractorAndDataUpdate(data: { userId: string; plan: Plan | null }) {
	const user = await prisma.user.findUnique({
		where: {
			id: data.userId,
		},
	})

	if (!user) return null

	await checkUserPlan(user)
	data.plan = user.activePlan as Plan | null

	return user.refreshSession
}

export async function authExpressMiddleware(req: Request, res: Response, next: NextFunction) {
	const token = req.cookies?.accessToken

	if (!token) return next()

	const verifyResult = authenticator.verifyAccessToken(token)
	if (verifyResult.success) {
		req.auth = verifyResult.data
		return next()
	}

	// Try to refresh token
	const refreshToken = req.cookies.refreshToken
	if (!refreshToken) return next()

	const refreshResults = await authenticator.refreshAccessToken(refreshToken, (data) =>
		refreshSessionExtractorAndDataUpdate(data)
	)

	if (refreshResults.success) {
		const { accessToken, data } = refreshResults.data

		// Update last login (non-blocking)
		prisma.user.update({
			where: {
				id: data.userId,
			},
			data: {
				lastLogin: new Date(),
			},
		})

		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
		})

		res.setHeader(
			'Custom-Refreshed-Auth-Data',
			Buffer.from(JSON.stringify(data)).toString('base64')
		)

		req.auth = data
	}

	next()
}

async function fetchEmailFromGoogleToken(token: string) {
	const res = await googleOAuth
		.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_AUTH_CLIENT_ID,
		})
		.catch(() => {
			throw new TError('error.googleAuthFailed')
		})

	const payload = res.getPayload()
	if (!payload) throw new TError('error.googleAuthFailed')

	const email = payload.email?.toLowerCase()
	if (!email) throw new TError('error.googleAuthFailed')

	return email
}

async function updateUserRefreshSession(userId: string, refreshSession: string) {
	await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			refreshSession,
		},
	})
}

export async function loginWithGoogle(
	token: string,
	createAccountIfNotFound: boolean,
	marketingEmails?: boolean,
	langCode?: string
): Promise<{ accessToken: string; refreshToken: string; authData: AuthPayload }> {
	const email = await fetchEmailFromGoogleToken(token)

	let user = await prisma.user.findUnique({
		where: {
			email,
		},
	})

	if (!user) {
		if (!createAccountIfNotFound) throw new TError('error.noLinkedAccount')

		user = await createUser(email, null, true, marketingEmails ?? false, langCode ?? 'en')
	}

	await checkUserPlan(user)

	const authData = { userId: user.id, plan: user.activePlan as Plan | null, accountMail: email }

	const { accessToken, refreshSession, refreshToken } = authenticator.directLogin(
		authData,
		user.refreshSession ?? undefined
	)

	if (!user.refreshSession) {
		await updateUserRefreshSession(user.id, refreshSession)
	}

	return { accessToken, refreshToken, authData }
}

export async function loginWithPassword(
	email: string,
	password: string
): Promise<{ accessToken: string; refreshToken: string; authData: AuthPayload }> {
	email = email.toLowerCase()

	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	})

	if (!user) throw new TError('error.invalidEmailOrPassword')

	if (!user.isEmailVerified) throw new TError('error.emailNotVerified')

	if (!user.passwordHash) throw new TError('error.notPasswordAccount')

	await checkUserPlan(user)

	const authData = { userId: user.id, plan: user.activePlan as Plan | null, accountMail: email }

	const { success, data } = await authenticator.loginWithPassword(
		user.passwordHash,
		password,
		authData,
		user.refreshSession ?? undefined
	)

	if (!success) throw new TError('error.invalidEmailOrPassword')

	if (!user.refreshSession) {
		await updateUserRefreshSession(user.id, data.refreshSession)
	}

	return { accessToken: data.accessToken, refreshToken: data.refreshToken, authData }
}

export async function signUpWithPassword(
	email: string,
	password: string,
	marketingEmails: boolean,
	langCode: string
) {
	email = email.toLowerCase()

	await createUser(email, password, false, marketingEmails, langCode)

	const mailToken = authenticator.generateMailToken(email)
	const verifyUrl = `${process.env.SIGN_IN_URL}?token=${encodeURIComponent(
		mailToken
	)}&email=${encodeURIComponent(email)}`

	// TODO: localize subject and body
	await sendMailTemplate(email, 'Verify your email', 'verify-email', {
		url: verifyUrl,
	})
}

export async function verifyMailToken(token: string, email: string) {
	email = email.toLowerCase()

	const isValid = authenticator.verifyMailToken(token, email)
	if (!isValid) throw new TError('error.invalidToken')

	await prisma.user.update({
		where: {
			email,
		},
		data: {
			isEmailVerified: true,
		},
	})
}

async function createUser(
	email: string,
	password: string | null,
	isEmailVerified: boolean,
	marketingEmails: boolean,
	langCode: string
) {
	try {
		const user = await prisma.user.create({
			data: {
				email,
				passwordHash: password != null ? await authenticator.hashPassword(password) : null,
				isEmailVerified,
				userSettings: {
					create: {
						...getDefaultUserSettings(langCode),
						marketingEmails,
					},
				},
			},
		})

		try {
			// TODO: refactor code to own file
			const taxRates =
				langCode == 'de'
					? [
							{
								name: 'MwSt. (Standard)',
								rate: 19,
								displayText: 'MwSt.',
							},
							{
								name: 'MwSt. (Ermäßigt)',
								rate: 7,
								displayText: 'MwSt.',
							},
							{
								name: 'Landwirtschaftliche USt',
								rate: 10.7,
								displayText: 'USt.',
							},
						]
					: [
							{
								name: 'VAT (Standard)',
								rate: 20,
								displayText: 'VAT',
							},
							{
								name: 'VAT (Reduced)',
								rate: 5,
								displayText: 'VAT',
							},
						]

			await prisma.$transaction([
				prisma.userSettings.update({
					where: {
						userId: user.id,
					},
					data: {
						defaultTaxRate: {
							create: {
								name: 'taxRate.reverseChargeName',
								rate: 0,
								displayText: 'taxRate.reverseCharge',
								userId: user.id,
							},
						},
					},
				}),
				prisma.taxRate.createMany({
					data: taxRates.map((taxRate) => ({
						...taxRate,
						userId: user.id,
					})),
				}),
			])
		} catch (e) {
			// Ignore
		}

		return user
	} catch (e: any) {
		if (e.code === 'P2002') {
			throw new TError('error.emailAlreadyInUse')
		}

		throw e
	}
}

function getDefaultUserSettings(langCode: string): Prisma.UserSettingsCreateInput {
	// TODO: Vary default settings based on user's country
	return {
		name: '',
		shorthand: '',
		additionalLine: '',
		firstName: '',
		lastName: '',
		contactPhone: '',
		contactEmail: '',
		vatNumber: '',

		street: '',
		streetNumber: '',
		city: '',
		zip: '',
		countryCode: '',

		bankName: '',
		bic: '',
		iban: '',
		logoUrl: '',

		defaultCurrency: langCode === 'de' ? 'EUR' : 'USD',
		defaultLanguage: langCode,
		defaultDueDays: 14,
		enableMultilingual: true,
		enableTaxPerItem: false,
		idFormat: 'YYMM.XXX',
		nextPartialId: 1,
		partialIdDate: new Date(),
	}
}

export async function requestPasswordReset(email: string) {
	email = email.toLowerCase()

	const resetToken = authenticator.generateMailToken(email)
	const resetUrl = `${
		process.env.RESET_PASSWORD_URL
	}?token=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(email)}`

	await sendMailTemplate(email, 'Reset your password', 'reset-password', {
		url: resetUrl,
	})
}

export async function resetPassword({
	token,
	email,
	password,
}: {
	token: string
	email: string
	password: string
}) {
	email = email.toLowerCase()

	const isValid = authenticator.verifyMailToken(token, email)
	if (!isValid) throw new TError('error.invalidToken')

	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	})

	if (!user) throw new TError('error.invalidToken')

	await prisma.user.update({
		where: {
			id: user.id,
		},
		data: {
			passwordHash: await authenticator.hashPassword(password),
		},
	})
}
