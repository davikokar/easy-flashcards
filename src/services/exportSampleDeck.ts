import { CachesDirectoryPath, writeFile } from '@dr.pogodin/react-native-fs';
import { errorCodes, isErrorWithCode, saveDocuments } from '@react-native-documents/picker';
import { pathToFileUri } from '../utils/fileUri';
import { SAMPLE_DECK_CSV, SAMPLE_DECK_FILE_NAME } from '../utils/sampleDeck';

export class ExportCancelledError extends Error {
  constructor() {
    super('Export cancelled');
    this.name = 'ExportCancelledError';
  }
}

/** Writes the sample deck to the cache, then opens the system "save as" dialog. */
export async function exportSampleDeck(): Promise<string | null> {
  const path = `${CachesDirectoryPath}/${SAMPLE_DECK_FILE_NAME}`;
  await writeFile(path, SAMPLE_DECK_CSV, 'utf8');

  let saved;
  try {
    [saved] = await saveDocuments({
      sourceUris: [pathToFileUri(path)],
      mimeType: 'text/csv',
      fileName: SAMPLE_DECK_FILE_NAME,
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
}
