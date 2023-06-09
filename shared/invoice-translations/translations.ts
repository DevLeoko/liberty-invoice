import { TRANSLATIONS_DE } from "./de";
import { TRANSLATIONS_EN } from "./en";

export enum Locale {
  EN = "en",
  DE = "de",
}

export const LOCALES = Object.values(Locale) as string[];

interface Tree {
  [key: string]: string | Tree;
}

// Type to convert { foo: { bar: string } } to "foo.bar"
export type KeyPath<T extends Tree> = {
  [K in keyof T]-?: T[K] extends string
    ? K
    : T[K] extends Tree
    ? `${string & K}.${string & KeyPath<T[K]>}`
    : never;
}[keyof T] &
  string;

// Type to replace const string types with general string type recursively
export type ReplaceConst<T> = T extends string
  ? string
  : { [K in keyof T]: ReplaceConst<T[K]> };

export type TranslationDictionary = ReplaceConst<typeof TRANSLATIONS_EN>;

// TODO: make these dynamic imports
export const TRANSLATIONS: Record<Locale, TranslationDictionary> = {
  [Locale.EN]: TRANSLATIONS_EN,
  de: TRANSLATIONS_DE,
};

export function getTranslationDictionary(locale: Locale) {
  return TRANSLATIONS[locale] || TRANSLATIONS[Locale.EN];
}

export function translate<T extends Tree>(
  dictionary: T,
  key: KeyPath<T>,
  vars: Record<string, { toString(): string }> = {}
) {
  // Grab the translation from the translations object.
  let translation: Tree | string = dictionary;

  // Split the key into an array of keys.
  const keys = key.split(".");
  // Loop through the keys and grab the translation.
  for (const k of keys) {
    if ((translation as Tree)[k] == undefined) {
      console.error(`Translation not found for key: ${key}`);
      return key;
    }

    translation = (translation as Tree)[k];
  }

  let text = translation as string;

  // Replace any passed in variables in the translation string.
  Object.keys(vars).map((k) => {
    const regex = new RegExp(`{{${k}}}`, "g");
    text = text.replace(regex, vars[k].toString());
  });

  return text;
}
