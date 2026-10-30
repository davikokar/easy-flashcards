import * as fs from 'fs';
import * as path from 'path';
import { parseFlashcardsCsv } from '../src/utils/csv';
import { SAMPLE_DECK_CSV } from '../src/utils/sampleDeck';

describe('SAMPLE_DECK_CSV', () => {
  it('parses into five cards with nothing skipped', () => {
    const parsed = parseFlashcardsCsv(SAMPLE_DECK_CSV);

    expect(parsed.cards).toHaveLength(5);
    expect(parsed.skippedRows).toBe(0);
  });

  it('matches samples/sample-deck.csv', () => {
    const file = fs.readFileSync(path.join(__dirname, '..', 'samples', 'sample-deck.csv'), 'utf8');

    expect(parseFlashcardsCsv(SAMPLE_DECK_CSV)).toEqual(parseFlashcardsCsv(file));
  });
});
