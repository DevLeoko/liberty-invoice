import { browser } from '$app/environment'
import { persisted } from 'svelte-persisted-store'
import { derived } from 'svelte/store'
import { getCurrency as getCurrencyUtil } from '../../../../shared/currencies'
import { LOCALES, Locale, translate, type TranslationPaths } from '../translations/translations'
import { logErrorStatic, logInfoStatic, logSuccessStatic } from './alerts'

export const pwaSource = persisted<'google-play' | 'app-store' | 'microsoft' | 'pwa' | 'web'>(
	'pwa-source',
	'web'
)

export const isInstalledFromStore = derived(
	pwaSource,
	($pwaSource) =>
		$pwaSource === 'google-play' || $pwaSource === 'app-store' || $pwaSource === 'microsoft'
)

// Get browser language.
function getBrowserLanguage(): Locale {
	if (!browser) return Locale.EN

	const browserLanguage = navigator.language.split('-')[0]
	if (browserLanguage && LOCALES.includes(browserLanguage)) return browserLanguage as Locale

	return Locale.EN
}

export const applicationLanguage = persisted<Locale>('app-language', getBrowserLanguage())

export const t = derived(
	applicationLanguage,
	($applicationLanguage) =>
		(key: TranslationPaths, vars?: Record<string, { toString(): string }>) =>
			translate($applicationLanguage, key, vars)
)

export const translateIfFound = derived(t, ($t) => {
	return (string: string, base: string, vars?: Record<string, { toString(): string }>) => {
		if (string.startsWith(`${base}.`)) {
			return $t(string as TranslationPaths, vars)
		} else {
			return string
		}
	}
})

export const logError = derived(
	t,
	($t) =>
		(key: TranslationPaths, vars?: Record<string, { toString(): string }>, timeout?: number) =>
			logErrorStatic($t(key, vars), timeout)
)

export const logInfo = derived(
	t,
	($t) =>
		(key: TranslationPaths, vars?: Record<string, { toString(): string }>, timeout?: number) =>
			logInfoStatic($t(key, vars), timeout)
)

export const logSuccess = derived(
	t,
	($t) =>
		(key: TranslationPaths, vars?: Record<string, { toString(): string }>, timeout?: number) =>
			logSuccessStatic($t(key, vars), timeout)
)

export const formatFloat = derived(
	t,
	($t) => (value: number) =>
		value.toLocaleString($t('langCode'), { minimumFractionDigits: 2, maximumFractionDigits: 2 })
)

export const formatInt = derived(
	t,
	($t) => (value: number) => value.toLocaleString($t('langCode'), { maximumFractionDigits: 0 })
)

export const formatDate = derived(
	t,
	($t) => (date: Date) =>
		date.toLocaleDateString($t('langCode'), { year: 'numeric', month: '2-digit', day: '2-digit' })
)

export const getCurrency = derived(
	[formatFloat, formatInt],
	([$formatFloat, $formatInt]) =>
		(shorthand: string, round = false) =>
			getCurrencyUtil(shorthand, round ? $formatInt : $formatFloat)
)
