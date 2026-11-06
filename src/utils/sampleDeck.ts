import { Card, Deck } from '../types';
import { findCategory } from './categories';
import { DeckExportFormat, DeckExportOptions } from './deckExport';
import type { Translator } from './i18n';

function sampleCard(n: number, question: string, answer: string): Card {
  return {
    id: `sample-${n}`,
    question,
    answer,
    okCount: 0,
    okeishCount: 0,
    notOkCount: 0,
    lastReviewedAt: null,
  };
}

/** The deck the App menu exports; samples/ holds its two files (a test checks they match). */
export const SAMPLE_DECK: Deck = {
  id: 'sample-deck',
  name: 'Sample deck',
  description: 'Five cards showing how a deck file is laid out.',
  categoryId: 'default_geography',
  sourceFileName: null,
  createdAt: 0,
  lastStudiedAt: null,
  cards: [
    sampleCard(1, 'What is the capital of <b>France</b>?', 'Paris'),
    sampleCard(2, 'Translate <i>"good morning"</i> to Spanish', 'Buenos días'),
    sampleCard(
      3,
      'What does HTML stand for?',
      '<b>H</b>yper<b>T</b>ext <b>M</b>arkup <b>L</b>anguage',
    ),
    sampleCard(
      4,
      'Name the three primary colours',
      '<ul><li>Red</li><li>Green</li><li>Blue</li></ul>',
    ),
    sampleCard(
      5,
      'Which planet is known as the Red Planet?',
      'Mars<br />Fourth planet from the Sun',
    ),
  ],
};

export const SAMPLE_DECK_CATEGORY = findCategory(SAMPLE_DECK.categoryId, []);

/** One file per entry, saved in this order. */
export const SAMPLE_DECK_EXPORTS: readonly DeckExportOptions[] = [
  { format: 'csv', separator: ';' },
  { format: 'json' },
];

export type SampleDeckExportOutcome = { format: DeckExportFormat; suggestedName: string } & (
  | { status: 'saved'; savedAs: string | null }
  | { status: 'cancelled' }
  /** `message` is the error's own text; null when the thrown value had none. */
  | { status: 'failed'; message: string | null }
);

/** The message ending in exactly one full stop, unless it already ends in `.`, `!` or `?`. */
function endWithStop(message: string): string {
  const trimmed = message.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

/** The alert for what the save dialogs returned; null when every file was cancelled. */
export function describeSampleDeckExport(
  outcomes: readonly SampleDeckExportOutcome[],
  t: Translator,
): { title: string; message: string } | null {
  const savedNames: string[] = [];
  const notSaved: string[] = [];
  const failed: string[] = [];

  for (const outcome of outcomes) {
    const format = outcome.format.toUpperCase();
    if (outcome.status === 'saved') {
      savedNames.push(outcome.savedAs ?? outcome.suggestedName);
    } else if (outcome.status === 'failed') {
      const details = endWithStop(outcome.message ?? t('importExport.sampleExport.unknownError'));
      failed.push(t('importExport.sampleExport.fileFailed', { format, details }));
    } else {
      notSaved.push(t('importExport.sampleExport.fileNotSaved', { format }));
    }
  }

  if (savedNames.length === 0) {
    return failed.length === 0
      ? null
      : { title: t('importExport.sampleExport.failedTitle'), message: failed.join(' ') };
  }

  // There is one file per format, so at most two names.
  const saved =
    savedNames.length === 1
      ? t('importExport.sampleExport.savedAsOne', { name: savedNames[0] })
      : t('importExport.sampleExport.savedAsTwo', { first: savedNames[0], second: savedNames[1] });
  return {
    title:
      failed.length === 0
        ? t('importExport.sampleExport.successTitle')
        : t('importExport.sampleExport.partlyTitle'),
    message: [saved, ...failed, ...notSaved].join(' '),
  };
}
