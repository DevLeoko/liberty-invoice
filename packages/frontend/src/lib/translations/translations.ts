import {
	translate as basicTranslate,
	type KeyPath,
	type ReplaceConst,
} from '../../../../shared/invoice-translations/translations'
import { TRANSLATIONS_DE } from './de'
import { TRANSLATIONS_EN } from './en'

export enum Locale {
	EN = 'en',
	DE = 'de',
}

export const LOCALES = Object.values(Locale) as string[]

export type TranslationPaths = KeyPath<typeof TRANSLATIONS_EN>
export type TranslationDictionary = ReplaceConst<typeof TRANSLATIONS_EN>

// TODO: make these dynamic imports
export const TRANSLATIONS: Record<Locale, TranslationDictionary> = {
	[Locale.EN]: TRANSLATIONS_EN,
	de: TRANSLATIONS_DE,
}

export function translate(
	language: Locale,
	key: TranslationPaths,
	vars?: Record<string, { toString(): string }>
) {
	return basicTranslate(TRANSLATIONS[language], key, vars)
}
