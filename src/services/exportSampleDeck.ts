import { exportFileName } from '../utils/deckExport';
import {
  SAMPLE_DECK,
  SAMPLE_DECK_CATEGORY,
  SAMPLE_DECK_EXPORTS,
  SampleDeckExportOutcome,
} from '../utils/sampleDeck';
import { ExportCancelledError, exportDeck } from './exportDeck';

/**
 * Saves the sample deck once per entry of SAMPLE_DECK_EXPORTS. The save dialogs run one at a
 * time (saveDocuments allows one), and a cancelled or failed file does not stop the next.
 */
export async function exportSampleDeck(): Promise<SampleDeckExportOutcome[]> {
  const outcomes: SampleDeckExportOutcome[] = [];

  for (const options of SAMPLE_DECK_EXPORTS) {
    const file = {
      format: options.format,
      suggestedName: exportFileName(SAMPLE_DECK.name, options.format),
    };
    try {
      const savedAs = await exportDeck(SAMPLE_DECK, SAMPLE_DECK_CATEGORY, options);
      outcomes.push({ ...file, status: 'saved', savedAs });
    } catch (error) {
      if (error instanceof ExportCancelledError) {
        outcomes.push({ ...file, status: 'cancelled' });
      } else {
        const message = error instanceof Error ? error.message : 'Unknown error';
        outcomes.push({ ...file, status: 'failed', message });
      }
    }
  }

  return outcomes;
}
