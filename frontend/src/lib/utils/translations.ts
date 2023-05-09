import { TRANSLATIONS_DE } from '../translations/de';
import { TRANSLATIONS_EN } from '../translations/en';

export enum Locale {
	EN = 'en',
	DE = 'de'
}

export const LOCALES = Object.values(Locale) as string[];

// Type to convert { foo: { bar: string } } to "foo.bar"
type KeyPath<T> = T extends string
	? ''
	: T extends Record<string, Record<string, unknown>>
	? `${string & keyof T}.${KeyPath<T[string & keyof T]>}`
	: T extends Record<string, unknown>
	? `${string & keyof T}`
	: never;

// Type to replace const string types with general string type recursively
type ReplaceConst<T> = T extends string ? string : { [K in keyof T]: ReplaceConst<T[K]> };

export type TranslationPaths = KeyPath<typeof TRANSLATIONS_EN>;
export type TranslationDictionary = ReplaceConst<typeof TRANSLATIONS_EN>;

// TODO: make these dynamic imports
export const TRANSLATIONS: Record<Locale, TranslationDictionary> = {
	[Locale.EN]: TRANSLATIONS_EN,
	de: TRANSLATIONS_DE
};
