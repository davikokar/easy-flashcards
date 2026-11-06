import type { en } from '../locales/en';

export type PluralCategory = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';
export type PluralRule = (count: number) => PluralCategory;
export type PluralMessage = Readonly<Partial<Record<PluralCategory, string>> & { other: string }>;
export type MessageValue = string | number;

type Values = Readonly<Record<string, MessageValue>>;
type PluralShape = { readonly other: string };

type Widen<T> = T extends string
  ? string
  : T extends PluralShape
    ? PluralMessage
    : { readonly [K in keyof T]: Widen<T[K]> };

type PathsOf<T, Prefix extends string> = {
  [K in keyof T & string]: T[K] extends string | PluralShape
    ? `${Prefix}${K}`
    : PathsOf<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

type MessageAt<T, K extends string> = K extends `${infer Head}.${infer Rest}`
  ? Head extends keyof T
    ? MessageAt<T[Head], Rest>
    : never
  : K extends keyof T
    ? T[K]
    : never;

type PlaceholdersIn<S extends string> = S extends `${string}{${infer Name}}${infer Rest}`
  ? Name | PlaceholdersIn<Rest>
  : never;

type PlaceholdersOf<M> = M extends string
  ? PlaceholdersIn<M>
  : M extends PluralShape
    ? PlaceholdersIn<Extract<M[keyof M], string>>
    : never;

type IsPlural<M> = M extends PluralShape ? true : false;
type NamedValues<N extends PropertyKey> = { readonly [P in N]: MessageValue };

/** The same derivations as the Message* types below, over any catalogue; the tests use them on a small one. */
export type CatalogueKey<C> = PathsOf<C, ''>;
export type CatalogueValues<C, K extends string> = [IsPlural<MessageAt<C, K>>] extends [true]
  ? NamedValues<Exclude<PlaceholdersOf<MessageAt<C, K>>, 'count'>> & { readonly count: number }
  : NamedValues<PlaceholdersOf<MessageAt<C, K>>>;
export type CatalogueArgs<C, K extends string> = [keyof CatalogueValues<C, K>] extends [never]
  ? []
  : [values: CatalogueValues<C, K>];

/** The English catalogue's shape, every string widened to string and every plural object to PluralMessage. */
export type Catalogue = Widen<typeof en>;
/** Every dot-path from the catalogue root to a message, e.g. 'decks.deleteDeckAlert.title'. */
export type MessageKey = CatalogueKey<typeof en>;
/** One entry per {placeholder} in the English message (all its forms, for a plural), plus `count: number` for a plural. */
export type MessageValues<K extends MessageKey> = CatalogueValues<typeof en, K>;
/** [] for a message with no placeholders that is not plural; otherwise [values: MessageValues<K>]. */
export type MessageArgs<K extends MessageKey> = CatalogueArgs<typeof en, K>;

export type MessagePart = { readonly text: string; readonly placeholder: string | null };

export interface Translator {
  <K extends MessageKey>(key: K, ...args: MessageArgs<K>): string;
  parts<K extends MessageKey>(key: K, ...args: MessageArgs<K>): MessagePart[];
}

export type Language = {
  readonly code: string;
  readonly plural: PluralRule;
  readonly messages: Catalogue;
};

const newPlaceholderPattern = () => /\{([A-Za-z][A-Za-z0-9]*)\}/g;

function valueText(name: string, whole: string, values: Values): string {
  const value = Object.prototype.hasOwnProperty.call(values, name) ? values[name] : undefined;
  return value === undefined ? whole : String(value);
}

export function formatMessage(template: string, values: Values = {}): string {
  return template.replace(newPlaceholderPattern(), (whole, name: string) =>
    valueText(name, whole, values),
  );
}

export function formatParts(template: string, values: Values = {}): MessagePart[] {
  const parts: MessagePart[] = [];
  const pattern = newPlaceholderPattern();
  let literalStart = 0;
  let match = pattern.exec(template);
  while (match !== null) {
    if (match.index > literalStart) {
      parts.push({ text: template.slice(literalStart, match.index), placeholder: null });
    }
    parts.push({ text: valueText(match[1], match[0], values), placeholder: match[1] });
    literalStart = match.index + match[0].length;
    match = pattern.exec(template);
  }
  if (literalStart < template.length) {
    parts.push({ text: template.slice(literalStart), placeholder: null });
  }
  return parts;
}

function findMessage(messages: unknown, key: string): string | PluralMessage | undefined {
  let node: unknown = messages;
  for (const segment of key.split('.')) {
    if (typeof node !== 'object' || node === null) {
      return undefined;
    }
    node = Object.prototype.hasOwnProperty.call(node, segment)
      ? (node as Record<string, unknown>)[segment]
      : undefined;
  }
  if (typeof node === 'string') {
    return node;
  }
  if (typeof node === 'object' && node !== null && typeof (node as PluralShape).other === 'string') {
    return node as PluralMessage;
  }
  return undefined;
}

// The key itself is the last resort, so a missing message is visible rather than blank.
function selectTemplate(key: string, count: number, language: Language, fallback: Language): string {
  for (const source of [language, fallback]) {
    const message = findMessage(source.messages, key);
    if (message === undefined) {
      continue;
    }
    return typeof message === 'string' ? message : (message[source.plural(count)] ?? message.other);
  }
  return key;
}

export function createTranslator(language: Language, fallback: Language): Translator {
  const template = (key: string, values?: Values) =>
    selectTemplate(key, Number(values?.count), language, fallback);
  const translate = (key: string, values?: Values) => formatMessage(template(key, values), values);
  const parts = (key: string, values?: Values) => formatParts(template(key, values), values);
  return Object.assign(translate, { parts }) as unknown as Translator;
}

const SCRIPT_SUBTAG = /^[A-Za-z]{4}$/;
const REGION_SUBTAG = /^(?:[A-Za-z]{2}|[0-9]{3})$/;

// Java's Locale still reports the pre-1989 ISO 639 codes for these languages.
const LEGACY_LANGUAGES = new Map([
  ['in', 'id'],
  ['iw', 'he'],
  ['ji', 'yi'],
]);

/** Reads a BCP 47 or Java `Locale.toString()` tag as `language[-Script][-Region]`, or null when it has no language. */
export function normalizeLocaleTag(tag: string | null | undefined): string | null {
  if (typeof tag !== 'string') {
    return null;
  }
  const trimmed = tag.trim();
  const hashIndex = trimmed.indexOf('#');
  const head = hashIndex === -1 ? trimmed : trimmed.slice(0, hashIndex);
  const javaScript = hashIndex === -1 ? '' : trimmed.slice(hashIndex + 1).split('-')[0];
  const subtags = head.split(/[-_]/);
  const language = subtags[0];
  if (!/^[A-Za-z]{2,3}$/.test(language)) {
    return null;
  }

  let script = SCRIPT_SUBTAG.test(javaScript) ? javaScript : '';
  let region = '';
  for (const subtag of subtags.slice(1)) {
    if (script === '' && region === '' && SCRIPT_SUBTAG.test(subtag)) {
      script = subtag;
    } else if (region === '' && REGION_SUBTAG.test(subtag)) {
      region = subtag;
    } else {
      break;
    }
  }

  const scriptPart = script === '' ? [] : [script[0].toUpperCase() + script.slice(1).toLowerCase()];
  const regionPart = region === '' ? [] : [region.toUpperCase()];
  const lowerLanguage = language.toLowerCase();
  return [LEGACY_LANGUAGES.get(lowerLanguage) ?? lowerLanguage, ...scriptPart, ...regionPart].join('-');
}

export function resolveLanguage(
  tag: string | null | undefined,
  codes: readonly string[],
  fallback: string,
): string {
  const normalized = normalizeLocaleTag(tag);
  if (normalized === null) {
    return fallback;
  }
  const [language, ...rest] = normalized.split('-');
  const script = rest.find(subtag => SCRIPT_SUBTAG.test(subtag));
  const region = rest.find(subtag => subtag !== script);
  const candidates = [
    normalized,
    ...(script === undefined ? [] : [`${language}-${script}`]),
    ...(region === undefined ? [] : [`${language}-${region}`]),
    language,
  ];
  for (const candidate of candidates) {
    const match = codes.find(code => code.toLowerCase() === candidate.toLowerCase());
    if (match !== undefined) {
      return match;
    }
  }
  return fallback;
}

const PLAIN_LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ACCENTED_LETTERS = 'åɓçðéƒĝĥîĵķļɱñöþǫŕšţûṽŵẋýžÅßÇÐÉƑĜĤÎĴĶĻṀÑÖÞǪŔŠŢÛṼŴẊÝŽ';
const ACCENTED = new Map(Array.from(PLAIN_LETTERS, (letter, index) => [letter, ACCENTED_LETTERS[index]]));

const PLACEHOLDER_SPLIT = /(\{[A-Za-z][A-Za-z0-9]*\})/;

/** Accents every letter, pads the literal text by about a third and wraps it in brackets; `{placeholders}` stay as written. */
export function pseudoLocalize(text: string): string {
  let literalLength = 0;
  const accented = text
    .split(PLACEHOLDER_SPLIT)
    .map((piece, index) => {
      if (index % 2 === 1) {
        return piece;
      }
      literalLength += piece.length;
      return piece.replace(/[A-Za-z]/g, letter => ACCENTED.get(letter) ?? letter);
    })
    .join('');
  return `[${accented}${'~'.repeat(Math.ceil(literalLength / 3))}]`;
}

function pseudoLocalizeNode(node: unknown): unknown {
  if (typeof node === 'string') {
    return pseudoLocalize(node);
  }
  if (typeof node === 'object' && node !== null) {
    return Object.fromEntries(
      Object.entries(node).map(([name, child]) => [name, pseudoLocalizeNode(child)]),
    );
  }
  return node;
}

export function pseudoLocalizeCatalogue(messages: Catalogue): Catalogue {
  return pseudoLocalizeNode(messages) as Catalogue;
}
