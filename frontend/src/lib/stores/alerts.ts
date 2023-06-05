import { PUBLIC_IS_DEMO } from '$env/static/public'
import { writable } from 'svelte/store'
import type { TranslationPaths } from '../translations/translations'

export interface Alert {
	type: 'info' | 'error' | 'success'
	message: string
	duration: number
	startTime: number
	attention?: boolean
}

export interface Confirmation {
	title: string
	body?: string
	noLabel: string
	yesLabel: string
	action: () => Promise<any>
}

export const alerts = writable([] as Alert[])

function pushAlert(alertBase: Omit<Alert, 'startTime'>) {
	const alert = {
		startTime: Date.now(),
		...alertBase,
	}

	alerts.update((alerts) => {
		const prevAlert = alerts[alerts.length - 1]
		if (prevAlert && prevAlert.type == alert.type && prevAlert.message == alert.message) {
			alerts.splice(alerts.length - 1, 1)
			if (alert.type == 'error') alert.attention = true
		}

		alerts.push(alert)

		return alerts
	})

	setTimeout(() => {
		alerts.update((alerts) => {
			const errIndex = alerts.indexOf(alert)
			if (errIndex != -1) alerts.splice(errIndex, 1)
			return alerts
		})
	}, alert.duration)
}

export function removeAlert(index: number) {
	alerts.update((alerts) => {
		alerts.splice(index, 1)
		return alerts
	})
}

export function logError(message: TranslationPaths, timeout = 5000) {
	pushAlert({
		message,
		type: 'error',
		duration: timeout,
	})
}

export function logInfo(message: TranslationPaths, timeout = 5000) {
	pushAlert({
		message,
		type: 'info',
		duration: timeout,
	})
}

export function logSuccess(message: TranslationPaths, timeout = 5000) {
	pushAlert({
		message,
		type: 'success',
		duration: timeout,
	})
}

export function showErrors<T>(promise: Promise<T>): Promise<T> {
	return promise.catch((err) => {
		if (err.message?.startsWith('+')) {
			logError(err.message.slice(1))
		} else {
			// TODO
			logError('general.error')
		}
		throw err
	})
}

if (PUBLIC_IS_DEMO) {
	logInfo('demo.alert', 10000)
}
