import { Card, Deck } from '../types';
import { findCategory } from './categories';
import { DeckExportFormat, DeckExportOptions } from './deckExport';

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
  | { status: 'failed'; message: string }
);

/** The message ending in exactly one full stop, unless it already ends in `.`, `!` or `?`. */
function endWithStop(message: string): string {
  const trimmed = message.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

/** The alert for what the save dialogs returned; null when every file was cancelled. */
export function describeSampleDeckExport(
  outcomes: readonly SampleDeckExportOutcome[],
): { title: string; message: string } | null {
  const savedNames: string[] = [];
  const notSaved: string[] = [];
  const failed: string[] = [];

  for (const outcome of outcomes) {
    const label = outcome.format.toUpperCase();
    if (outcome.status === 'saved') {
      savedNames.push(outcome.savedAs ?? outcome.suggestedName);
    } else if (outcome.status === 'failed') {
      failed.push(`The ${label} file could not be saved: ${endWithStop(outcome.message)}`);
    } else {
      notSaved.push(`The ${label} file was not saved.`);
    }
  }

  if (savedNames.length === 0) {
    return failed.length === 0 ? null : { title: 'Export failed', message: failed.join(' ') };
  }

  const saved = `Saved as ${savedNames.join(' and ')}.`;
  return {
    title: failed.length === 0 ? 'Sample deck exported' : 'Sample deck partly exported',
    message: [saved, ...failed, ...notSaved].join(' '),
  };
}
