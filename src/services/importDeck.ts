import { errorCodes, isErrorWithCode, keepLocalCopy, pick } from '@react-native-documents/picker';
import { readFile } from '@dr.pogodin/react-native-fs';
import { CsvImportError, ParsedCsv, deckNameFromFileName, parseFlashcardsCsv } from '../utils/csv';
import { fileUriToPath } from '../utils/fileUri';

const CSV_MIME_TYPES = [
  'text/csv',
  'text/comma-separated-values',
  'text/tab-separated-values',
  'text/plain',
  '*/*',
];

export type ImportedFile = {
  deckName: string;
  fileName: string | null;
  parsed: ParsedCsv;
};

export class ImportCancelledError extends Error {
  constructor() {
    super('Import cancelled');
    this.name = 'ImportCancelledError';
  }
}

/**
 * Opens the system file picker, copies the chosen file into the app cache so it
 * can be read reliably from a `content://` uri, and parses it as a deck.
 */
export async function pickAndParseCsv(): Promise<ImportedFile> {
  let picked;
  try {
    [picked] = await pick({ type: CSV_MIME_TYPES });
  } catch (error) {
    if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) {
      throw new ImportCancelledError();
    }
    throw error;
  }

  const fileName = picked.name ?? 'deck.csv';
  const [copy] = await keepLocalCopy({
    files: [{ uri: picked.uri, fileName }],
    destination: 'cachesDirectory',
  });

  if (copy.status !== 'success') {
    throw new CsvImportError('Could not read the selected file.');
  }

  const raw = await readFile(fileUriToPath(copy.localUri), 'utf8');
  return {
    deckName: deckNameFromFileName(picked.name),
    fileName: picked.name,
    parsed: parseFlashcardsCsv(raw),
  };
}
