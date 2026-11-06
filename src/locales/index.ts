import {
  createTranslator,
  pseudoLocalizeCatalogue,
  resolveLanguage,
  type Language,
  type Translator,
} from '../utils/i18n';
import { ar } from './ar';
import { de } from './de';
import { en, englishPlural } from './en';
import { es } from './es';
import { fr } from './fr';
import { id } from './id';
import { it } from './it';
import { ja } from './ja';
import { ko } from './ko';
import { pl } from './pl';
import { pt } from './pt';
import { ro } from './ro';
import { th } from './th';
import { tr } from './tr';
import { uk } from './uk';
import { vi } from './vi';
import { zhHans } from './zhHans';

export const ENGLISH: Language = { code: 'en', plural: englishPlural, messages: en };

export const PSEUDO: Language = {
  code: 'en-XA',
  plural: englishPlural,
  messages: pseudoLocalizeCatalogue(en),
};

// Each translation adds its module and one entry here.
export const LANGUAGES: readonly Language[] = [
  ENGLISH,
  PSEUDO,
  de,
  fr,
  it,
  es,
  pt,
  pl,
  ro,
  tr,
  uk,
  ar,
  id,
  vi,
  th,
  ja,
  zhHans,
  ko,
];

export const englishT: Translator = createTranslator(ENGLISH, ENGLISH);

// Every language that can be chosen, each written in itself so the picker reads in any language.
export const LANGUAGE_NAMES: Readonly<Record<string, string>> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  it: 'Italiano',
  es: 'Español',
  pt: 'Português (Brasil)',
  pl: 'Polski',
  ro: 'Română',
  tr: 'Türkçe',
  uk: 'Українська',
  ar: 'العربية',
  id: 'Bahasa Indonesia',
  vi: 'Tiếng Việt',
  th: 'ไทย',
  ja: '日本語',
  'zh-CN': '简体中文',
  ko: '한국어',
};

/** The languages offered to the user; the pseudo-language is a developer aid and is left out. */
export const SELECTABLE_LANGUAGES: readonly Language[] = LANGUAGES.filter(
  language => language !== PSEUDO,
);

export function isSelectableLanguageCode(code: unknown): code is string {
  return SELECTABLE_LANGUAGES.some(language => language.code === code);
}

export function translatorForTag(tag: string | null | undefined): Translator {
  const code = resolveLanguage(
    tag,
    LANGUAGES.map(language => language.code),
    ENGLISH.code,
  );
  const language = LANGUAGES.find(candidate => candidate.code === code) ?? ENGLISH;
  return language === ENGLISH ? englishT : createTranslator(language, ENGLISH);
}

/** A registered language code wins; null, or a code no language registers, follows the device tag. */
export function translatorForChoice(
  choice: string | null | undefined,
  deviceTag: string | null | undefined,
): Translator {
  return translatorForTag(isSelectableLanguageCode(choice) ? choice : deviceTag);
}
