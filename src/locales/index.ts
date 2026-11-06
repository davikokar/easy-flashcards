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

export function translatorForTag(tag: string | null | undefined): Translator {
  const code = resolveLanguage(
    tag,
    LANGUAGES.map(language => language.code),
    ENGLISH.code,
  );
  const language = LANGUAGES.find(candidate => candidate.code === code) ?? ENGLISH;
  return language === ENGLISH ? englishT : createTranslator(language, ENGLISH);
}
