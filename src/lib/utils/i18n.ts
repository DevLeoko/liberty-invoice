// From https://svelte.dev/repl/de39de663ef2445b8fe17b79c500013b?version=3.55.1

import { derived, writable } from 'svelte/store'
import { Locale, LOCALES, TRANSLATIONS, type TranslationPaths } from './translations'

// Get browser language.
let browserLanguage = navigator.language.split('-')[0]
if (!browserLanguage || !LOCALES.includes(browserLanguage)) browserLanguage = 'en'

export const locale = writable(browserLanguage as Locale)

interface Tree {
	[key: string]: string | Tree
}

export function translate(locale: Locale, key: TranslationPaths, vars: Record<string, string>) {
	// Let's throw some errors if we're trying to use keys/locales that don't exist.
	// We could improve this by using Typescript and/or fallback values.
	if (!key) throw new Error('no key provided to $t()')
	if (!locale) throw new Error(`no translation for key "${key}"`)

	// Grab the translation from the translations object.
	let translation: Tree | string = TRANSLATIONS[locale]

	// Split the key into an array of keys.
	const keys = key.split('.')
	// Loop through the keys and grab the translation.
	for (const k of keys) {
		translation = (translation as Tree)[k]
	}

	if (!translation || !translation.length) return null

	let text = translation as string

	// Replace any passed in variables in the translation string.
	Object.keys(vars).map((k) => {
		const regex = new RegExp(`{{${k}}}`, 'g')
		text = text.replace(regex, vars[k])
	})

	return text
}

export const t = derived(
	locale,
	($locale) =>
		(key: TranslationPaths, vars: Record<string, string> = {}) =>
			translate($locale, key, vars)
)

export type TranslationFunction = (
	key: TranslationPaths,
	vars?: Record<string, string>
) => string | null

export function formatFloatGeneric(locale: Locale, value: number, decimals = 2) {
	return value.toLocaleString(locale, {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	})
}

export const formatFloat = derived(
	locale,
	($locale) =>
		(value: number, decimals = 2) =>
			formatFloatGeneric($locale, value, decimals)
)
