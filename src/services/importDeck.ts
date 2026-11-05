import { errorCodes, isErrorWithCode, keepLocalCopy, pick } from '@react-native-documents/picker';
import { readFile } from '@dr.pogodin/react-native-fs';
import { deckNameFromFileName, parseFlashcardsCsv } from '../utils/csv';
import {
  DeckImportError,
  DeckImportFormat,
  ParsedCard,
  detectDeckFormat,
  parseDeckJson,
} from '../utils/deckImport';
import { fileUriToPath } from '../utils/fileUri';

const MIME_TYPES = [
  'text/csv',
  'text/comma-separated-values',
  'text/tab-separated-values',
  'text/plain',
  'application/json',
  '*/*',
];

export type ImportedFile = {
  /** Detected from the file's content. */
  format: DeckImportFormat;
  deckName: string;
  fileName: string | null;
  description: string;
  /** Unresolved; `addDeck` stores null for a reference that matches no category. */
  categoryRef: string | null;
  cards: ParsedCard[];
  skipped: number;
};

export class ImportCancelledError extends Error {
  constructor() {
    super('Import cancelled');
    this.name = 'ImportCancelledError';
  }
}

/**
 * Opens the system file picker, copies the chosen file into the app cache so it
 * can be read reliably from a `content://` uri, and parses it as a deck of the format its content shows.
 */
export async function pickAndParseDeck(): Promise<ImportedFile> {
  let picked;
  try {
    [picked] = await pick({ type: MIME_TYPES });
  } catch (error) {
    if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) {
      throw new ImportCancelledError();
    }
    throw error;
  }

  const fileName = picked.name ?? 'deck';
  const [copy] = await keepLocalCopy({
    files: [{ uri: picked.uri, fileName }],
    destination: 'cachesDirectory',
  });

  if (copy.status !== 'success') {
    throw new DeckImportError('Could not read the selected file.');
  }

  const raw = await readFile(fileUriToPath(copy.localUri), 'utf8');
  const fileDeckName = deckNameFromFileName(picked.name);
  const format = detectDeckFormat(raw);
  if (format === 'json') {
    const parsed = parseDeckJson(raw);
    return {
      format,
      deckName: parsed.title ?? fileDeckName,
      fileName: picked.name,
      description: parsed.description,
      categoryRef: parsed.categoryRef,
      cards: parsed.cards,
      skipped: parsed.skippedCards,
    };
  }

  const parsed = parseFlashcardsCsv(raw);
  return {
    format,
    deckName: parsed.title ?? fileDeckName,
    fileName: picked.name,
    description: parsed.description,
    categoryRef: parsed.categoryRef,
    cards: parsed.cards,
    skipped: parsed.skippedRows,
  };
}
