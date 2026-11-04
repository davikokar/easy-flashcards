import Papa from 'papaparse';
import { validateCustomSeparator } from './deckExport';
import { DeckImportError, EMPTY_FILE_MESSAGE, ParsedCard, stripBom } from './deckImport';

export type ParsedCsv = {
  cards: ParsedCard[];
  delimiter: string;
  skippedRows: number;
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

/**
 * Parses a flashcards CSV. Blank and `#` lines before the header are skipped, the header row
 * must name `Question` and `Answer` (case-insensitive), and its separator is detected from it.
 */
export function parseFlashcardsCsv(raw: string): ParsedCsv {
  const text = stripBom(raw).replace(/\r\n?/g, '\n');
  if (text.trim().length === 0) {
    throw new DeckImportError(EMPTY_FILE_MESSAGE);
  }

  const lines = text.split('\n');
  const headerIndex = lines.findIndex(line => !isCommentOrBlank(line));
  const delimiter = headerIndex < 0 ? null : findSeparator(lines[headerIndex]);
  if (delimiter === null) {
    throw new DeckImportError(NO_HEADER_MESSAGE);
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
    throw new DeckImportError('No usable rows found. Every row needs a question and an answer.');
  }

  return { cards, delimiter, skippedRows };
}

export function deckNameFromFileName(fileName: string | null | undefined): string {
  if (!fileName) {
    return 'Imported deck';
  }
  const withoutExtension = fileName.replace(/\.[^.]+$/, '').trim();
  return withoutExtension.length > 0 ? withoutExtension : 'Imported deck';
}
