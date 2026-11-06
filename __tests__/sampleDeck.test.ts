import * as fs from 'fs';
import * as path from 'path';
import { englishT } from '../src/locales';
import { parseFlashcardsCsv } from '../src/utils/csv';
import { serializeDeck } from '../src/utils/deckExport';
import { detectDeckFormat, parseDeckJson } from '../src/utils/deckImport';
import {
  SAMPLE_DECK,
  SAMPLE_DECK_CATEGORY,
  SAMPLE_DECK_EXPORTS,
  SampleDeckExportOutcome,
  describeSampleDeckExport,
} from '../src/utils/sampleDeck';

function readSample(fileName: string): string {
  return fs.readFileSync(path.join(__dirname, '..', 'samples', fileName), 'utf8');
}

function normaliseLineEndings(text: string): string {
  return text.replace(/\r\n/g, '\n');
}

const csvOptions = SAMPLE_DECK_EXPORTS[0];
const jsonOptions = SAMPLE_DECK_EXPORTS[1];

const csv = (status: 'saved' | 'cancelled' | 'failed'): SampleDeckExportOutcome => {
  const file = { format: 'csv', suggestedName: 'Sample deck.csv' } as const;
  if (status === 'saved') {
    return { ...file, status, savedAs: 'Sample deck.csv' };
  }
  return status === 'failed' ? { ...file, status, message: 'disk full' } : { ...file, status };
};

const json = (status: 'saved' | 'cancelled' | 'failed'): SampleDeckExportOutcome => {
  const file = { format: 'json', suggestedName: 'Sample deck.json' } as const;
  if (status === 'saved') {
    return { ...file, status, savedAs: 'Sample deck.json' };
  }
  return status === 'failed' ? { ...file, status, message: 'no access' } : { ...file, status };
};

describe('the shipped sample files', () => {
  it('has the CSV the export writes for the sample deck', () => {
    const file = normaliseLineEndings(readSample('sample-deck.csv'));

    expect(file).toBe(serializeDeck(SAMPLE_DECK, SAMPLE_DECK_CATEGORY, csvOptions));
  });

  it('has the JSON the export writes for the sample deck', () => {
    const file = normaliseLineEndings(readSample('sample-deck.json'));

    expect(file).toBe(serializeDeck(SAMPLE_DECK, SAMPLE_DECK_CATEGORY, jsonOptions));
  });

  it('imports from the CSV as the title, description, category and five cards, with nothing skipped', () => {
    const parsed = parseFlashcardsCsv(readSample('sample-deck.csv'));

    expect(parsed.skippedRows).toBe(0);
    expect(parsed.title).toBe(SAMPLE_DECK.name);
    expect(parsed.description).toBe(SAMPLE_DECK.description);
    expect(parsed.categoryRef).toBe('default_geography');
    expect(parsed.cards).toEqual(
      SAMPLE_DECK.cards.map(card => ({ question: card.question, answer: card.answer })),
    );
  });

  it('is detected as CSV for the CSV sample and as JSON for the JSON sample', () => {
    expect(detectDeckFormat(readSample('sample-deck.csv'))).toBe('csv');
    expect(detectDeckFormat(readSample('sample-deck.json'))).toBe('json');
  });

  it('imports from the JSON as the title, description, category and five cards', () => {
    const parsed = parseDeckJson(readSample('sample-deck.json'));

    expect(parsed.title).toBe(SAMPLE_DECK.name);
    expect(parsed.description).toBe(SAMPLE_DECK.description);
    expect(parsed.categoryRef).toBe('default_geography');
    expect(parsed.skippedCards).toBe(0);
    expect(parsed.cards).toEqual(
      SAMPLE_DECK.cards.map(card => ({ question: card.question, answer: card.answer })),
    );
  });
});

describe('SAMPLE_DECK_CATEGORY', () => {
  it('resolves to a built-in category', () => {
    expect(SAMPLE_DECK_CATEGORY).not.toBeNull();
  });
});

describe('describeSampleDeckExport', () => {
  it('reports both files when both were saved', () => {
    expect(describeSampleDeckExport([csv('saved'), json('saved')], englishT)).toEqual({
      title: 'Sample deck exported',
      message: 'Saved as Sample deck.csv and Sample deck.json.',
    });
  });

  it('says the JSON file was not saved when only the CSV was saved', () => {
    expect(describeSampleDeckExport([csv('saved'), json('cancelled')], englishT)).toEqual({
      title: 'Sample deck exported',
      message: 'Saved as Sample deck.csv. The JSON file was not saved.',
    });
  });

  it('says the CSV file was not saved when only the JSON was saved', () => {
    expect(describeSampleDeckExport([csv('cancelled'), json('saved')], englishT)).toEqual({
      title: 'Sample deck exported',
      message: 'Saved as Sample deck.json. The CSV file was not saved.',
    });
  });

  it('reports a partial export when the JSON failed after the CSV was saved', () => {
    expect(describeSampleDeckExport([csv('saved'), json('failed')], englishT)).toEqual({
      title: 'Sample deck partly exported',
      message: 'Saved as Sample deck.csv. The JSON file could not be saved: no access.',
    });
  });

  it('reports a partial export when the CSV failed after the JSON was saved', () => {
    expect(describeSampleDeckExport([csv('failed'), json('saved')], englishT)).toEqual({
      title: 'Sample deck partly exported',
      message: 'Saved as Sample deck.json. The CSV file could not be saved: disk full.',
    });
  });

  it('reports one sentence per failed file when none was saved', () => {
    expect(describeSampleDeckExport([csv('failed'), json('failed')], englishT)).toEqual({
      title: 'Export failed',
      message:
        'The CSV file could not be saved: disk full. The JSON file could not be saved: no access.',
    });
  });

  it('reports only the failed file when the other was cancelled', () => {
    expect(describeSampleDeckExport([csv('cancelled'), json('failed')], englishT)).toEqual({
      title: 'Export failed',
      message: 'The JSON file could not be saved: no access.',
    });
  });

  it.each(['.', '!', '?'])('does not add a second stop to a message ending in %s', stop => {
    const failed: SampleDeckExportOutcome = {
      format: 'csv',
      suggestedName: 'Sample deck.csv',
      status: 'failed',
      message: `disk full${stop}`,
    };

    expect(describeSampleDeckExport([failed, json('cancelled')], englishT)?.message).toBe(
      `The CSV file could not be saved: disk full${stop}`,
    );
  });

  it('shows nothing when both files were cancelled', () => {
    expect(describeSampleDeckExport([csv('cancelled'), json('cancelled')], englishT)).toBeNull();
  });

  it('names a saved file by the suggested name when the dialog returned none', () => {
    const unnamed: SampleDeckExportOutcome = {
      format: 'csv',
      suggestedName: 'Sample deck.csv',
      status: 'saved',
      savedAs: null,
    };

    expect(describeSampleDeckExport([unnamed, json('cancelled')], englishT)?.message).toBe(
      'Saved as Sample deck.csv. The JSON file was not saved.',
    );
  });

  it('says Unknown error when a failure carries no message', () => {
    const failed: SampleDeckExportOutcome = {
      format: 'json',
      suggestedName: 'Sample deck.json',
      status: 'failed',
      message: null,
    };

    expect(describeSampleDeckExport([csv('cancelled'), failed], englishT)?.message).toBe(
      'The JSON file could not be saved: Unknown error.',
    );
  });
});
