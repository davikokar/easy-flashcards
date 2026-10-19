import Papa from 'papaparse';

export type ParsedCard = { question: string; answer: string };

export type ParsedCsv = {
  cards: ParsedCard[];
  delimiter: ';' | '\t';
  skippedRows: number;
};

export class CsvImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CsvImportError';
  }
}

const SUPPORTED_DELIMITERS: Array<';' | '\t'> = [';', '\t'];

function stripBom(input: string): string {
  return input.charCodeAt(0) === 0xfeff ? input.slice(1) : input;
}

function detectDelimiter(headerLine: string): ';' | '\t' {
  const best = SUPPORTED_DELIMITERS.map(delimiter => ({
    delimiter,
    count: headerLine.split(delimiter).length - 1,
  })).sort((a, b) => b.count - a.count)[0];

  if (!best || best.count === 0) {
    throw new CsvImportError(
      'Unsupported delimiter. The CSV must separate columns with a semicolon (;) or a tab.',
    );
  }
  return best.delimiter;
}

/**
 * Parses a flashcards CSV with `Question` / `Answer` headers (case-insensitive)
 * separated by semicolons or tabs.
 */
export function parseFlashcardsCsv(raw: string): ParsedCsv {
  const content = stripBom(raw).replace(/\r\n?/g, '\n').trim();
  if (content.length === 0) {
    throw new CsvImportError('The selected file is empty.');
  }

  const delimiter = detectDelimiter(content.split('\n', 1)[0]);
  const result = Papa.parse<Record<string, string | undefined>>(content, {
    delimiter,
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: header => header.trim().toLowerCase(),
  });

  const headers = result.meta.fields ?? [];
  if (!headers.includes('question') || !headers.includes('answer')) {
    throw new CsvImportError(
      `Missing required headers. Expected "Question" and "Answer", found: ${
        headers.length > 0 ? headers.join(', ') : '(none)'
      }.`,
    );
  }

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
    throw new CsvImportError('No usable rows found. Every row needs a question and an answer.');
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
