import { CachesDirectoryPath, writeFile } from '@dr.pogodin/react-native-fs';
import { errorCodes, isErrorWithCode, saveDocuments } from '@react-native-documents/picker';
import { pathToFileUri } from '../utils/fileUri';

export const SAMPLE_DECK_FILE_NAME = 'sample-deck.csv';

/** Kept in sync with samples/sample-deck.csv; raw assets are not bundled into the app. */
export const SAMPLE_DECK_CSV = [
  'Question;Answer',
  'What is the capital of <b>France</b>?;Paris',
  'Translate <i>"good morning"</i> to Spanish;Buenos d&iacute;as',
  'What does HTML stand for?;<b>H</b>yper<b>T</b>ext <b>M</b>arkup <b>L</b>anguage',
  'Name the three primary colours;<ul><li>Red</li><li>Green</li><li>Blue</li></ul>',
  'Which planet is known as the Red Planet?;Mars<br />Fourth planet from the Sun',
  '',
].join('\n');

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
