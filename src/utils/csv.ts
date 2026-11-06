import Papa from 'papaparse';
import { DECK_FILE_FORMAT, DECK_FILE_VERSION, validateCustomSeparator } from './deckExport';
import {
  DeckImportError,
  EMPTY_FILE_MESSAGE,
  NEWER_VERSION_MESSAGE,
  ParsedCard,
  stripBom,
} from './deckImport';

export type ParsedCsv = {
  cards: ParsedCard[];
  delimiter: string;
  skippedRows: number;
  /** From the `# title:` line; null when absent or blank, and the caller then names the deck after the file. */
  title: string | null;
  /** From the `# description:` line; '' when absent. */
  description: string;
  /** The category reference from the `# category:` line, unresolved; null when absent or empty. */
  categoryRef: string | null;
};

const NO_HEADER_MESSAGE =
  'No header row found. The first line that is not blank or a "#" comment must name a ' +
  '"question" and an "answer" column, separated by a comma, a semicolon, a tab or one other symbol.';

// Order in which qualifying separators win; `;` and tab were the only ones accepted before.
const PRESET_ORDER = [';', '\t', ','];

function isCommentOrBlank(line: string): boolean {
  return line.trim().length === 0 || line.startsWith('#');
}

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase();
}

/** The header row's own characters that the export could have used as a separator. */
function candidateSeparators(headerLine: string): string[] {
  const chars = Array.from(new Set(Array.from(headerLine)));
  const presets = PRESET_ORDER.filter(preset => chars.includes(preset));
  const customs = chars.filter(
    char => !PRESET_ORDER.includes(char) && validateCustomSeparator(char).ok,
  );
  return [...presets, ...customs];
}

function findSeparator(headerLine: string): string | null {
  return (
    candidateSeparators(headerLine).find(separator => {
      const names = Papa.parse<string[]>(headerLine, { delimiter: separator }).data[0] ?? [];
      const normalized = names.map(normalizeHeader);
      return normalized.includes('question') && normalized.includes('answer');
    }) ?? null
  );
}

/** Reads `# key: value` lines; the key is lower-cased, the value trimmed and unescaped, the first line per key wins. */
function readComments(lines: string[]): Map<string, string> {
  const comments = new Map<string, string>();
  for (const line of lines) {
    if (!line.startsWith('#')) {
      continue;
    }
    const colon = line.indexOf(':');
    if (colon < 0) {
      continue;
    }
    const key = line.slice(1, colon).trim().toLowerCase();
    if (!comments.has(key)) {
      const value = line.slice(colon + 1).trim();
      comments.set(key, value.replace(/\\([\\n])/g, (_match, char) => (char === 'n' ? '\n' : '\\')));
    }
  }
  return comments;
}

function assertNotNewerVersion(comments: Map<string, string>): void {
  const version = comments.get('version') ?? '';
  if (comments.get('format') === DECK_FILE_FORMAT && /^\d+$/.test(version)) {
    if (Number(version) > DECK_FILE_VERSION) {
      throw new DeckImportError('newerVersion', NEWER_VERSION_MESSAGE);
    }
  }
}

/**
 * Parses a flashcards CSV. The header row must name `Question` and `Answer` (case-insensitive),
 * and its separator is detected from it. The `# key: value` lines above it are read for the
 * title, description and category, and to refuse a file from a newer version.
 */
export function parseFlashcardsCsv(raw: string): ParsedCsv {
  const text = stripBom(raw).replace(/\r\n?/g, '\n');
  if (text.trim().length === 0) {
    throw new DeckImportError('emptyFile', EMPTY_FILE_MESSAGE);
  }

  const lines = text.split('\n');
  const headerIndex = lines.findIndex(line => !isCommentOrBlank(line));
  const comments = readComments(headerIndex < 0 ? lines : lines.slice(0, headerIndex));
  assertNotNewerVersion(comments);

  const delimiter = headerIndex < 0 ? null : findSeparator(lines[headerIndex]);
  if (delimiter === null) {
    throw new DeckImportError('noHeader', NO_HEADER_MESSAGE);
  }

  const result = Papa.parse<Record<string, string | undefined>>(
    lines.slice(headerIndex).join('\n'),
    {
      delimiter,
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: normalizeHeader,
    },
  );

  const cards: ParsedCard[] = [];
  let skippedRows = 0;

  for (const row of result.data) {
    const question = (row.question ?? '').trim();
    const answer = (row.answer ?? '').trim();
    if (question.length === 0 && answer.length === 0) {
      continue;
    }
    if (question.length === 0 || answer.length === 0) {
      skippedRows += 1;
      continue;
    }
    cards.push({ question, answer });
  }

  if (cards.length === 0) {
    throw new DeckImportError(
      'noUsableRows',
      'No usable rows found. Every row needs a question and an answer.',
    );
  }

  return {
    cards,
    delimiter,
    skippedRows,
    title: comments.get('title') || null,
    description: comments.get('description') ?? '',
    categoryRef: comments.get('category') || null,
  };
}

/** Null when the file name gives nothing usable; the screen then names the deck with its translated default. */
export function deckNameFromFileName(fileName: string | null | undefined): string | null {
  if (!fileName) {
    return null;
  }
  const withoutExtension = fileName.replace(/\.[^.]+$/, '').trim();
  return withoutExtension.length > 0 ? withoutExtension : null;
}
