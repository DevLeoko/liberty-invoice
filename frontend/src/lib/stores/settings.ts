import { derived, writable } from 'svelte/store'
import { Locale, LOCALES, TRANSLATIONS, type TranslationPaths } from '../translations/translations'
import { translate } from '../../../../shared/invoice-translations/translations'
import { getCurrency as getCurrencyUtil } from '../../../../shared/currencies'

// Get browser language.
function getApplicationLanguage(): Locale {
	// First check localStorage
	const storedLanguage = localStorage.getItem('language')

	if (storedLanguage && LOCALES.includes(storedLanguage)) return storedLanguage as Locale

	const browserLanguage = navigator.language.split('-')[0]
	if (browserLanguage && LOCALES.includes(browserLanguage)) return browserLanguage as Locale

	return Locale.EN
}

export const applicationLanguage = writable(getApplicationLanguage())

applicationLanguage.subscribe((language) => {
	localStorage.setItem('language', language)
})

export const t = derived(
	applicationLanguage,
	($applicationLanguage) =>
		(key: TranslationPaths, vars?: Record<string, { toString(): string }>) =>
			translate(TRANSLATIONS[$applicationLanguage], key, vars),
)

export const formatFloat = derived(
	t,
	($t) => (value: number) =>
		value.toLocaleString($t('langCode'), { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
)

export const formatDate = derived(
	t,
	($t) => (date: Date) =>
		date.toLocaleDateString($t('langCode'), { year: 'numeric', month: '2-digit', day: '2-digit' }),
)

export const getCurrency = derived(
	formatFloat,
	($formatFloat) => (shorthand: string) => getCurrencyUtil(shorthand, $formatFloat),
)
