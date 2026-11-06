import Papa from 'papaparse';
import { Category, Deck } from '../types';
import { categoryReference } from './categories';

export const DECK_FILE_FORMAT = 'easy-flashcards-deck';
export const DECK_FILE_VERSION = 2;

export type DeckExportFormat = 'json' | 'csv';

export type DeckExportOptions = { format: 'json' } | { format: 'csv'; separator: string };

// File-format names are not translated (ADR-0020).
export const EXPORT_FORMAT_NAMES: Record<DeckExportFormat, string> = {
  json: 'JSON',
  csv: 'CSV',
};

export const EXPORT_MIME_TYPES: Record<DeckExportFormat, string> = {
  json: 'application/json',
  csv: 'text/csv',
};

export type SeparatorPreset = {
  key: 'comma' | 'semicolon' | 'tab';
  value: string;
};

export const SEPARATOR_PRESETS: readonly SeparatorPreset[] = [
  { key: 'comma', value: ',' },
  { key: 'semicolon', value: ';' },
  { key: 'tab', value: '\t' },
];

export type SeparatorError = 'empty' | 'tooLong' | 'reserved' | 'whitespace' | 'alphanumeric';

export type SeparatorResult = { ok: true; separator: string } | { ok: false; reason: SeparatorError };

const BYTE_ORDER_MARK = '\ufeff';
const RESERVED_SEPARATORS = ['"', '#', '\r', '\n', BYTE_ORDER_MARK];

/** Checks a custom CSV separator; the input is not trimmed, so a space is an error. */
export function validateCustomSeparator(input: string): SeparatorResult {
  if (input === '') {
    return { ok: false, reason: 'empty' };
  }
  if (Array.from(input).length > 1) {
    return { ok: false, reason: 'tooLong' };
  }
  // Before the whitespace check: the BOM counts as whitespace to \s.
  if (RESERVED_SEPARATORS.includes(input)) {
    return { ok: false, reason: 'reserved' };
  }
  if (/\s/.test(input)) {
    return { ok: false, reason: 'whitespace' };
  }
  if (/[\p{L}\p{N}]/u.test(input)) {
    return { ok: false, reason: 'alphanumeric' };
  }
  return { ok: true, separator: input };
}

/** One line per value: drops carriage returns, writes `\` as `\\` and a line feed as `\n`. */
function commentLine(key: string, value: string): string {
  const escaped = value.replace(/\r/g, '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n');
  return escaped === '' ? `# ${key}:` : `# ${key}: ${escaped}`;
}

export function serializeDeckJson(deck: Deck, category: Category | null): string {
  return JSON.stringify(
    {
      format: DECK_FILE_FORMAT,
      version: DECK_FILE_VERSION,
      title: deck.name,
      description: deck.description,
      category: categoryReference(category),
      cards: deck.cards.map(card => ({ question: card.question, answer: card.answer })),
    },
    null,
    2,
  );
}

/** Throws if `separator` is neither a preset nor a valid custom separator. */
export function serializeDeckCsv(deck: Deck, category: Category | null, separator: string): string {
  const isPreset = SEPARATOR_PRESETS.some(preset => preset.value === separator);
  if (!isPreset) {
    const result = validateCustomSeparator(separator);
    if (!result.ok) {
      throw new Error(`Invalid CSV separator: ${result.reason}`);
    }
  }

  const comments = [
    commentLine('format', DECK_FILE_FORMAT),
    commentLine('version', String(DECK_FILE_VERSION)),
    commentLine('title', deck.name),
    commentLine('description', deck.description),
    commentLine('category', categoryReference(category) ?? ''),
  ];
  // The comment convention invites readers to skip `#` lines, so a field starting with # is quoted.
  const table = Papa.unparse(
    {
      fields: ['question', 'answer'],
      data: deck.cards.map(card => [card.question, card.answer]),
    },
    {
      delimiter: separator,
      newline: '\n',
      quotes: (value: unknown) => typeof value === 'string' && value.startsWith('#'),
    },
  );

  // Papa writes no newline after the last row; ADR-0016 ends every line with one.
  const endedTable = table.endsWith('\n') ? table : `${table}\n`;
  return `${comments.join('\n')}\n${endedTable}`;
}

/** The deck title made safe as a file name, plus the extension for the format. */
export function exportFileName(title: string, format: DeckExportFormat): string {
  const safe = title
    // eslint-disable-next-line no-control-regex
    .replace(/[/\\:*?"<>|\u0000-\u001f\u007f]/g, '_')
    .trim();
  return `${safe === '' ? 'deck' : safe}.${format}`;
}

export function serializeDeck(
  deck: Deck,
  category: Category | null,
  options: DeckExportOptions,
): string {
  return options.format === 'json'
    ? serializeDeckJson(deck, category)
    : serializeDeckCsv(deck, category, options.separator);
}
