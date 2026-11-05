import {
  DeckImportError,
  NEWER_VERSION_MESSAGE,
  detectDeckFormat,
  parseDeckJson,
} from '../src/utils/deckImport';
import { SEPARATOR_PRESETS, serializeDeckCsv, serializeDeckJson } from '../src/utils/deckExport';
import { DEFAULT_CATEGORIES } from '../src/utils/categories';
import { Category, Deck } from '../src/types';

function deckOf(name: string, description: string, cards: Array<[string, string]>): Deck {
  return {
    id: 'd',
    name,
    description,
    categoryId: null,
    sourceFileName: null,
    createdAt: 0,
    lastStudiedAt: null,
    cards: cards.map(([question, answer], index) => ({
      id: `c${index}`,
      question,
      answer,
      okCount: 3,
      okeishCount: 2,
      notOkCount: 1,
      lastReviewedAt: 9,
    })),
  };
}

function fileOf(overrides: Record<string, unknown>): string {
  return JSON.stringify({
    format: 'easy-flashcards-deck',
    version: 2,
    title: 'Deck',
    description: '',
    category: null,
    cards: [{ question: 'Q', answer: 'A' }],
    ...overrides,
  });
}

const CUSTOM: Category = {
  id: 'category_abc',
  name: 'Mine',
  color: '#ed6e6e',
  icon: 'history',
  createdAt: 1,
};

describe('parseDeckJson', () => {
  describe('round trip through serializeDeckJson', () => {
    const cards: Array<[string, string]> = [
      ['plain', 'simple'],
      ['say "hi"\nnew line', '<b>bold</b> & <i>it</i>'],
      ['#hashtag; with, separators', 'Zażółć 😀 日本語'],
    ];
    const expected = cards.map(([question, answer]) => ({ question, answer }));

    it('reads the title, description, cards and a built-in category id', () => {
      const category = DEFAULT_CATEGORIES[0];

      const result = parseDeckJson(
        serializeDeckJson(deckOf('Verbs', 'Irregular ones', cards), category),
      );

      expect(result).toEqual({
        title: 'Verbs',
        description: 'Irregular ones',
        categoryRef: category.id,
        cards: expected,
        skippedCards: 0,
      });
    });

    it('reads a custom category by its name, without resolving it', () => {
      const result = parseDeckJson(serializeDeckJson(deckOf('Verbs', '', cards), CUSTOM));

      expect(result.categoryRef).toBe('Mine');
    });

    it('reads no category as null', () => {
      const result = parseDeckJson(serializeDeckJson(deckOf('Verbs', '', cards), null));

      expect(result.categoryRef).toBeNull();
    });
  });

  describe('title and description', () => {
    it('trims the title and the description', () => {
      const result = parseDeckJson(fileOf({ title: '  My deck ', description: '\n About it  ' }));

      expect(result.title).toBe('My deck');
      expect(result.description).toBe('About it');
    });

    it('reads a blank or non-string title as no title', () => {
      expect(parseDeckJson(fileOf({ title: '   ' })).title).toBeNull();
      expect(parseDeckJson(fileOf({ title: 5 })).title).toBeNull();
      expect(parseDeckJson(fileOf({ title: undefined })).title).toBeNull();
    });

    it('reads a missing or non-string description as empty', () => {
      expect(parseDeckJson(fileOf({ description: undefined })).description).toBe('');
      expect(parseDeckJson(fileOf({ description: ['x'] })).description).toBe('');
    });
  });

  describe('category', () => {
    it('reads a string as the reference, unresolved', () => {
      expect(parseDeckJson(fileOf({ category: 'default_math' })).categoryRef).toBe('default_math');
      expect(parseDeckJson(fileOf({ category: 'Anything at all' })).categoryRef).toBe(
        'Anything at all',
      );
    });

    it('reads a string in a version 1 file too', () => {
      expect(parseDeckJson(fileOf({ version: 1, category: 'default_geography' })).categoryRef).toBe(
        'default_geography',
      );
    });

    describe('as the object version 1 wrote', () => {
      it('is its id when that is a built-in id', () => {
        const category = { id: 'default_law', name: 'Droit', builtIn: true };

        expect(parseDeckJson(fileOf({ version: 1, category })).categoryRef).toBe('default_law');
      });

      it('is its name when the id is not a built-in id', () => {
        const category = { id: 'category_abc', name: 'Mine', builtIn: false };

        expect(parseDeckJson(fileOf({ version: 1, category })).categoryRef).toBe('Mine');
      });

      it('is its id when there is no usable name', () => {
        expect(parseDeckJson(fileOf({ category: { id: 'category_x' } })).categoryRef).toBe(
          'category_x',
        );
        expect(
          parseDeckJson(fileOf({ category: { id: 'category_x', name: '  ' } })).categoryRef,
        ).toBe('category_x');
      });

      it('is its name when there is no id', () => {
        expect(parseDeckJson(fileOf({ category: { name: 'X' } })).categoryRef).toBe('X');
      });
    });

    it('reads anything else as null', () => {
      expect(parseDeckJson(fileOf({ category: { id: 7 } })).categoryRef).toBeNull();
      expect(parseDeckJson(fileOf({ category: {} })).categoryRef).toBeNull();
      expect(parseDeckJson(fileOf({ category: 7 })).categoryRef).toBeNull();
      expect(parseDeckJson(fileOf({ category: ['default_math'] })).categoryRef).toBeNull();
      expect(parseDeckJson(fileOf({ category: undefined })).categoryRef).toBeNull();
    });
  });

  describe('cards', () => {
    it('trims card text and keeps the order', () => {
      const result = parseDeckJson(
        fileOf({
          cards: [
            { question: ' Q1 ', answer: ' A1\n' },
            { question: 'Q2', answer: 'A2' },
          ],
        }),
      );

      expect(result.cards).toEqual([
        { question: 'Q1', answer: 'A1' },
        { question: 'Q2', answer: 'A2' },
      ]);
    });

    it('skips and counts cards that are not usable', () => {
      const result = parseDeckJson(
        fileOf({
          cards: [
            { question: 'Q1', answer: 'A1' },
            { question: 'Q2' },
            { question: '  ', answer: 'A3' },
            { question: 'Q4', answer: '' },
            { question: 5, answer: 'A5' },
            'text',
            null,
            ['Q', 'A'],
            { question: 'Q6', answer: 'A6' },
          ],
        }),
      );

      expect(result.cards).toEqual([
        { question: 'Q1', answer: 'A1' },
        { question: 'Q6', answer: 'A6' },
      ]);
      expect(result.skippedCards).toBe(7);
    });

    it('ignores unknown keys and any progress on a card or at the top level', () => {
      const result = parseDeckJson(
        fileOf({
          extra: { a: 1 },
          cards: [
            {
              id: 'c1',
              question: 'Q',
              answer: 'A',
              okCount: 4,
              okeishCount: 1,
              notOkCount: 2,
              lastReviewedAt: 99,
            },
          ],
        }),
      );

      expect(result.cards).toEqual([{ question: 'Q', answer: 'A' }]);
    });
  });

  it('reads a file that starts with a BOM', () => {
    const result = parseDeckJson(`\ufeff${fileOf({})}`);

    expect(result.cards).toEqual([{ question: 'Q', answer: 'A' }]);
  });

  it.each([1, 2])('reads version %i', version => {
    const result = parseDeckJson(fileOf({ version }));

    expect(result.cards).toEqual([{ question: 'Q', answer: 'A' }]);
  });

  describe('errors', () => {
    it('rejects an empty file', () => {
      expect(() => parseDeckJson('')).toThrow(DeckImportError);
      expect(() => parseDeckJson(' \n ')).toThrow('The selected file is empty.');
      expect(() => parseDeckJson('\ufeff')).toThrow('The selected file is empty.');
    });

    it('rejects text that is not JSON', () => {
      expect(() => parseDeckJson('Question;Answer\nQ;A')).toThrow(
        'This is not an Easy Flashcards deck file. Pick a JSON file exported from the app.',
      );
    });

    it('rejects a bare array of cards', () => {
      expect(() => parseDeckJson('[{"question":"Q","answer":"A"}]')).toThrow(
        /not an Easy Flashcards deck file/,
      );
    });

    it('rejects JSON that is not an object', () => {
      expect(() => parseDeckJson('"text"')).toThrow(/not an Easy Flashcards deck file/);
      expect(() => parseDeckJson('null')).toThrow(/not an Easy Flashcards deck file/);
    });

    it('rejects a missing or different format', () => {
      expect(() => parseDeckJson(fileOf({ format: undefined }))).toThrow(
        /not an Easy Flashcards deck file/,
      );
      expect(() => parseDeckJson(fileOf({ format: 'other-deck' }))).toThrow(
        /not an Easy Flashcards deck file/,
      );
    });

    it('rejects a missing, non-numeric or lower version', () => {
      expect(() => parseDeckJson(fileOf({ version: undefined }))).toThrow(
        /not an Easy Flashcards deck file/,
      );
      expect(() => parseDeckJson(fileOf({ version: '1' }))).toThrow(
        /not an Easy Flashcards deck file/,
      );
      expect(() => parseDeckJson(fileOf({ version: 0 }))).toThrow(
        /not an Easy Flashcards deck file/,
      );
    });

    it('rejects a newer version with its own message', () => {
      expect(() => parseDeckJson(fileOf({ version: 3 }))).toThrow(NEWER_VERSION_MESSAGE);
      expect(() => parseDeckJson(fileOf({ version: 2.5 }))).toThrow(NEWER_VERSION_MESSAGE);
    });

    it('rejects a version that is not a whole number from 1', () => {
      expect(() => parseDeckJson(fileOf({ version: 1.5 }))).toThrow(
        /not an Easy Flashcards deck file/,
      );
      expect(() => parseDeckJson(fileOf({ version: -1 }))).toThrow(
        /not an Easy Flashcards deck file/,
      );
    });

    it('rejects a file whose cards are not an array', () => {
      expect(() => parseDeckJson(fileOf({ cards: undefined }))).toThrow(
        /not an Easy Flashcards deck file/,
      );
      expect(() => parseDeckJson(fileOf({ cards: { question: 'Q', answer: 'A' } }))).toThrow(
        /not an Easy Flashcards deck file/,
      );
    });

    it('rejects a file with no usable cards', () => {
      const message = 'No usable cards found. Every card needs a question and an answer.';

      expect(() => parseDeckJson(fileOf({ cards: [] }))).toThrow(message);
      expect(() => parseDeckJson(fileOf({ cards: [{ question: 'Q' }, 'x'] }))).toThrow(message);
    });
  });
});

describe('detectDeckFormat', () => {
  const cards: Array<[string, string]> = [
    ['plain', 'simple'],
    ['#hashtag; with, separators', '{"braces"}'],
  ];

  describe('json', () => {
    it('reads a leading brace as JSON', () => {
      expect(detectDeckFormat('{"format":"easy-flashcards-deck"}')).toBe('json');
    });

    it('skips a BOM, spaces and newlines before the brace', () => {
      expect(detectDeckFormat('\ufeff{"a":1}')).toBe('json');
      expect(detectDeckFormat('   {"a":1}')).toBe('json');
      expect(detectDeckFormat('\r\n\n\t{\n"a":1}')).toBe('json');
      expect(detectDeckFormat('\ufeff \n {"a":1}')).toBe('json');
    });

    it('reads a leading bracket as JSON', () => {
      expect(detectDeckFormat('[{"question":"Q","answer":"A"}]')).toBe('json');
      expect(detectDeckFormat('\n [')).toBe('json');
    });

    it('reads what serializeDeckJson writes as JSON', () => {
      const text = serializeDeckJson(deckOf('Verbs', 'Irregular ones', cards), CUSTOM);

      expect(detectDeckFormat(text)).toBe('json');
    });
  });

  describe('csv', () => {
    it('reads a # title: comment first line as CSV', () => {
      expect(detectDeckFormat('# title: Verbs\nquestion;answer\nQ;A')).toBe('csv');
    });

    it('reads a bare header row as CSV', () => {
      expect(detectDeckFormat('question;answer\nQ;A')).toBe('csv');
    });

    it('reads a quoted header row as CSV', () => {
      expect(detectDeckFormat('"question","answer"\n"Q","A"')).toBe('csv');
    });

    it('reads a header row after blank lines as CSV', () => {
      expect(detectDeckFormat('\n\n  \nquestion,answer\nQ,A')).toBe('csv');
    });

    it('reads empty and whitespace-only text as CSV without throwing', () => {
      expect(detectDeckFormat('')).toBe('csv');
      expect(detectDeckFormat('\ufeff')).toBe('csv');
      expect(detectDeckFormat(' \r\n\t ')).toBe('csv');
    });

    it.each(SEPARATOR_PRESETS.map(preset => [preset.label, preset.value]))(
      'reads what serializeDeckCsv writes with a %s separator as CSV',
      (_label, separator) => {
        const text = serializeDeckCsv(deckOf('Verbs', 'Irregular ones', cards), CUSTOM, separator);

        expect(detectDeckFormat(text)).toBe('csv');
      },
    );

    it('reads what serializeDeckCsv writes with a custom separator as CSV', () => {
      const text = serializeDeckCsv(deckOf('Verbs', '', cards), null, '|');

      expect(detectDeckFormat(text)).toBe('csv');
    });
  });
});
