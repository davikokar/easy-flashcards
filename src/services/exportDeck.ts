import { CachesDirectoryPath, unlink, writeFile } from '@dr.pogodin/react-native-fs';
import { errorCodes, isErrorWithCode, saveDocuments } from '@react-native-documents/picker';
import { Category, Deck } from '../types';
import { pathToFileUri } from '../utils/fileUri';
import {
  DeckExportOptions,
  EXPORT_MIME_TYPES,
  exportFileName,
  serializeDeck,
} from '../utils/deckExport';

export class ExportCancelledError extends Error {
  constructor() {
    super('Export cancelled');
    this.name = 'ExportCancelledError';
  }
}

/**
 * Writes the deck to the cache under a fixed name (never the deck's title: user text must not
 * reach a path), opens the system "save as" dialog, and returns the name the file was saved as.
 * Throws ExportCancelledError when the user cancels.
 */
export async function exportDeck(
  deck: Deck,
  category: Category | null,
  options: DeckExportOptions,
): Promise<string | null> {
  const path = `${CachesDirectoryPath}/easy-flashcards-export.${options.format}`;
  await writeFile(path, serializeDeck(deck, category, options), 'utf8');

  try {
    let saved;
    try {
      [saved] = await saveDocuments({
        sourceUris: [pathToFileUri(path)],
        mimeType: EXPORT_MIME_TYPES[options.format],
        fileName: exportFileName(deck.name, options.format),
      });
    } catch (error) {
      if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) {
        throw new ExportCancelledError();
      }
      throw error;
    }

    if (saved.error) {
      throw new Error(saved.error);
    }
    return saved.name;
  } finally {
    // The copy the user chose is already saved; a leftover cache file is harmless.
    await unlink(path).catch(() => undefined);
  }
}
