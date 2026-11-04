import { errorCodes, isErrorWithCode, keepLocalCopy, pick } from '@react-native-documents/picker';
import { readFile } from '@dr.pogodin/react-native-fs';
import { deckNameFromFileName, parseFlashcardsCsv } from '../utils/csv';
import { DeckImportError, DeckImportFormat, ParsedCard, parseDeckJson } from '../utils/deckImport';
import { fileUriToPath } from '../utils/fileUri';

const MIME_TYPES: Record<DeckImportFormat, string[]> = {
  csv: [
    'text/csv',
    'text/comma-separated-values',
    'text/tab-separated-values',
    'text/plain',
    '*/*',
  ],
  json: ['application/json', 'text/plain', '*/*'],
};

export type ImportedFile = {
  deckName: string;
  fileName: string | null;
  description: string;
  /** Unresolved; `addDeck` stores null for an id that matches no category. */
  categoryId: string | null;
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
 * can be read reliably from a `content://` uri, and parses it as a deck of the chosen format.
 */
export async function pickAndParseDeck(format: DeckImportFormat): Promise<ImportedFile> {
  let picked;
  try {
    [picked] = await pick({ type: MIME_TYPES[format] });
  } catch (error) {
    if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) {
      throw new ImportCancelledError();
    }
    throw error;
  }

  const fileName = picked.name ?? `deck.${format}`;
  const [copy] = await keepLocalCopy({
    files: [{ uri: picked.uri, fileName }],
    destination: 'cachesDirectory',
  });

  if (copy.status !== 'success') {
    throw new DeckImportError('Could not read the selected file.');
  }

  const raw = await readFile(fileUriToPath(copy.localUri), 'utf8');
  const fileDeckName = deckNameFromFileName(picked.name);
  if (format === 'json') {
    const parsed = parseDeckJson(raw);
    return {
      deckName: parsed.title ?? fileDeckName,
      fileName: picked.name,
      description: parsed.description,
      categoryId: parsed.categoryId,
      cards: parsed.cards,
      skipped: parsed.skippedCards,
    };
  }

  const parsed = parseFlashcardsCsv(raw);
  return {
    deckName: fileDeckName,
    fileName: picked.name,
    description: '',
    categoryId: null,
    cards: parsed.cards,
    skipped: parsed.skippedRows,
  };
}
