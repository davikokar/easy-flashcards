import { deckNameFromFileName, parseFlashcardsCsv } from '../src/utils/csv';
import { DeckImportError, NEWER_VERSION_MESSAGE } from '../src/utils/deckImport';
import { serializeDeckCsv } from '../src/utils/deckExport';
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
      okCount: 0,
      okeishCount: 0,
      notOkCount: 0,
      lastReviewedAt: null,
    })),
  };
}

const CATEGORY: Category = {
  id: 'category_x',
  name: 'Maths, "hard"',
  color: '#ed6e6e',
  icon: 'history',
  createdAt: 1,
};

function errorCodeOf(run: () => unknown): string | null {
  try {
    run();
  } catch (error) {
    return error instanceof DeckImportError ? error.code : null;
  }
  return null;
}

describe('parseFlashcardsCsv', () => {
  it('parses a semicolon separated file', () => {
    const result = parseFlashcardsCsv(
      'Question;Answer\nThis is the question; This is the <b>answer</b>\nSecond;Deux',
    );

    expect(result.delimiter).toBe(';');
    expect(result.cards).toEqual([
      { question: 'This is the question', answer: 'This is the <b>answer</b>' },
      { question: 'Second', answer: 'Deux' },
    ]);
  });

  it('parses a tab separated file with a BOM and CRLF line endings', () => {
    const result = parseFlashcardsCsv('\ufeffQUESTION\tanswer\r\nQ1\tA1\r\n');

    expect(result.delimiter).toBe('\t');
    expect(result.cards).toEqual([{ question: 'Q1', answer: 'A1' }]);
  });

  it('skips rows missing a question or an answer', () => {
    const result = parseFlashcardsCsv('Question;Answer\nQ1;A1\nQ2;\n;A3\n\n');

    expect(result.cards).toHaveLength(1);
    expect(result.skippedRows).toBe(2);
  });

  it('rejects a file whose header row names no question and answer columns', () => {
    expect(() => parseFlashcardsCsv('Front;Back\nQ1;A1')).toThrow(/No header row found/);
    expect(errorCodeOf(() => parseFlashcardsCsv('Front;Back\nQ1;A1'))).toBe('noHeader');
  });

  it('rejects a header row that has only one of the two columns', () => {
    expect(() => parseFlashcardsCsv('Question\nQ1')).toThrow(DeckImportError);
  });

  it('rejects an empty file', () => {
    expect(() => parseFlashcardsCsv('   ')).toThrow(DeckImportError);
    expect(() => parseFlashcardsCsv('')).toThrow(/empty/);
    expect(() => parseFlashcardsCsv('\n \n')).toThrow(/empty/);
    expect(errorCodeOf(() => parseFlashcardsCsv(''))).toBe('emptyFile');
  });

  it('rejects a file with a header and no usable rows', () => {
    expect(() => parseFlashcardsCsv('Question;Answer\n')).toThrow(/No usable rows/);
    expect(() => parseFlashcardsCsv('Question;Answer\nQ1;\n;A2')).toThrow(/No usable rows/);
    expect(errorCodeOf(() => parseFlashcardsCsv('Question;Answer\n'))).toBe('noUsableRows');
  });

  describe('separator detection', () => {
    it('detects a comma', () => {
      const result = parseFlashcardsCsv('Question,Answer\nQ1,A1');

      expect(result.delimiter).toBe(',');
      expect(result.cards).toEqual([{ question: 'Q1', answer: 'A1' }]);
    });

    it('detects a custom separator', () => {
      const result = parseFlashcardsCsv('Question|Answer\nQ1|A1');

      expect(result.delimiter).toBe('|');
      expect(result.cards).toEqual([{ question: 'Q1', answer: 'A1' }]);
    });

    it('keeps commas inside the cards of a semicolon file', () => {
      const result = parseFlashcardsCsv('Question;Answer\nHello, world;Bonjour, le monde');

      expect(result.delimiter).toBe(';');
      expect(result.cards).toEqual([{ question: 'Hello, world', answer: 'Bonjour, le monde' }]);
    });

    it('prefers the semicolon when the header row has other separator characters', () => {
      const result = parseFlashcardsCsv('Question;Answer;"a, b"\nQ1;A1;x');

      expect(result.delimiter).toBe(';');
      expect(result.cards).toEqual([{ question: 'Q1', answer: 'A1' }]);
    });

    it('reads quoted header names', () => {
      const result = parseFlashcardsCsv('"Question";"Answer"\nQ1;A1');

      expect(result.delimiter).toBe(';');
      expect(result.cards).toEqual([{ question: 'Q1', answer: 'A1' }]);
    });

    it('reads upper-case headers and ignores extra columns', () => {
      const result = parseFlashcardsCsv('QUESTION;ANSWER;Notes\nQ1;A1;ignored');

      expect(result.cards).toEqual([{ question: 'Q1', answer: 'A1' }]);
    });

    it('detects the semicolon in `Question ; Answer`', () => {
      const result = parseFlashcardsCsv('Question ; Answer\nQ1;A1');

      expect(result.delimiter).toBe(';');
      expect(result.cards).toEqual([{ question: 'Q1', answer: 'A1' }]);
    });
  });

  describe('comment lines', () => {
    it('skips blank and # lines before the header, including the exported metadata', () => {
      const result = parseFlashcardsCsv(
        '# title: Verbs\n# description: Some\n\n   \n# category: Maths\nQuestion;Answer\nQ1;A1',
      );

      expect(result.cards).toEqual([{ question: 'Q1', answer: 'A1' }]);
    });

    it('skips a comment that contains a quote or the separator', () => {
      const result = parseFlashcardsCsv('# title: say "hi"; or, not\nQuestion;Answer\nQ1;A1');

      expect(result.delimiter).toBe(';');
      expect(result.cards).toEqual([{ question: 'Q1', answer: 'A1' }]);
    });

    it('skips comments after a BOM and with CRLF line endings', () => {
      const result = parseFlashcardsCsv('\ufeff# title: x\r\nQuestion,Answer\r\nQ1,A1\r\n');

      expect(result.cards).toEqual([{ question: 'Q1', answer: 'A1' }]);
    });

    it('rejects a file with nothing but comments and blank lines', () => {
      expect(() => parseFlashcardsCsv('# title: x\n\n# category:\n')).toThrow(/No header row found/);
    });

    it('treats an indented # line as the header row, not a comment', () => {
      expect(() => parseFlashcardsCsv(' # note\nQuestion;Answer\nQ1;A1')).toThrow(
        /No header row found/,
      );
    });

    it('keeps an unquoted # row after the header as a card', () => {
      const result = parseFlashcardsCsv('Question;Answer\n#1 first;A1\n# second;A2');

      expect(result.cards).toEqual([
        { question: '#1 first', answer: 'A1' },
        { question: '# second', answer: 'A2' },
      ]);
    });

    it('keeps a quoted #tag field as a card', () => {
      const result = parseFlashcardsCsv('Question;Answer\n"#tag";A1');

      expect(result.cards).toEqual([{ question: '#tag', answer: 'A1' }]);
    });
  });

  describe('category and version comment lines', () => {
    const body = 'Question;Answer\nQ1;A1';

    it('reads the category reference, trimmed', () => {
      expect(parseFlashcardsCsv(`# category:   default_geography  \n${body}`).categoryRef).toBe(
        'default_geography',
      );
    });

    it('reads a custom name with spaces and punctuation, keeping a later colon', () => {
      expect(parseFlashcardsCsv(`# category: Maths: the "hard" kind\n${body}`).categoryRef).toBe(
        'Maths: the "hard" kind',
      );
    });

    it('reads the key in any case and with spaces around it', () => {
      expect(parseFlashcardsCsv(`#  CATEGORY : Chess\n${body}`).categoryRef).toBe('Chess');
      expect(parseFlashcardsCsv(`#category:Chess\n${body}`).categoryRef).toBe('Chess');
    });

    it('unescapes a backslash and a line feed in the value', () => {
      expect(parseFlashcardsCsv(`# category: a\\\\b\\nc\n${body}`).categoryRef).toBe('a\\b\nc');
    });

    it('lets the first line for a key win', () => {
      expect(parseFlashcardsCsv(`# category: First\n# category: Second\n${body}`).categoryRef).toBe(
        'First',
      );
    });

    it('reads a missing, empty or colon-less category line as null', () => {
      expect(parseFlashcardsCsv(body).categoryRef).toBeNull();
      expect(parseFlashcardsCsv(`# category:\n${body}`).categoryRef).toBeNull();
      expect(parseFlashcardsCsv(`# category:    \n${body}`).categoryRef).toBeNull();
      expect(parseFlashcardsCsv(`# category Chess\n${body}`).categoryRef).toBeNull();
    });

    it('does not read a category line below the header, which is a card row', () => {
      const result = parseFlashcardsCsv('Question;Answer\n# category: Chess;A1');

      expect(result.categoryRef).toBeNull();
      expect(result.cards).toEqual([{ question: '# category: Chess', answer: 'A1' }]);
    });

    it('imports a file of this format at the current version', () => {
      const result = parseFlashcardsCsv(
        `# format: easy-flashcards-deck\n# version: 2\n# title: T\n# description:\n# category: default_law\n${body}`,
      );

      expect(result.categoryRef).toBe('default_law');
      expect(result.cards).toEqual([{ question: 'Q1', answer: 'A1' }]);
    });

    it('refuses this format at a newer version', () => {
      expect(() =>
        parseFlashcardsCsv(`# format: easy-flashcards-deck\n# version: 3\n${body}`),
      ).toThrow(NEWER_VERSION_MESSAGE);
      expect(() =>
        parseFlashcardsCsv(`# version: 10\n# format: easy-flashcards-deck\n${body}`),
      ).toThrow(NEWER_VERSION_MESSAGE);
    });

    it('still imports an older, missing, malformed or foreign format or version', () => {
      const cards = [{ question: 'Q1', answer: 'A1' }];

      expect(parseFlashcardsCsv(`# format: easy-flashcards-deck\n# version: 1\n${body}`).cards).toEqual(cards);
      expect(parseFlashcardsCsv(`# format: easy-flashcards-deck\n${body}`).cards).toEqual(cards);
      expect(parseFlashcardsCsv(`# version: 3\n${body}`).cards).toEqual(cards);
      expect(parseFlashcardsCsv(`# format: other-tool\n# version: 9\n${body}`).cards).toEqual(cards);
      expect(
        parseFlashcardsCsv(`# format: easy-flashcards-deck\n# version: 2.5\n${body}`).cards,
      ).toEqual(cards);
      expect(
        parseFlashcardsCsv(`# format: easy-flashcards-deck\n# version: next\n${body}`).cards,
      ).toEqual(cards);
    });

  });

  describe('title and description comment lines', () => {
    const body = 'Question;Answer\nQ1;A1';

    it('reads the title and the description, trimmed', () => {
      const result = parseFlashcardsCsv(`# title:   German words \n# description:  Work words.  \n${body}`);

      expect(result.title).toBe('German words');
      expect(result.description).toBe('Work words.');
    });

    it('reads a title with a colon, and unescapes both values', () => {
      const result = parseFlashcardsCsv(`# title: Verbs: a\\\\b\n# description: one\\ntwo\n${body}`);

      expect(result.title).toBe('Verbs: a\\b');
      expect(result.description).toBe('one\ntwo');
    });

    it('reads them with a BOM and CRLF line endings', () => {
      const result = parseFlashcardsCsv(`\ufeff# title: T\r\n# description: D\r\n${body}\r\n`);

      expect(result.title).toBe('T');
      expect(result.description).toBe('D');
      expect(result.cards).toEqual([{ question: 'Q1', answer: 'A1' }]);
    });

    it('lets the first line for a key win', () => {
      const result = parseFlashcardsCsv(`# title: First\n# title: Second\n${body}`);

      expect(result.title).toBe('First');
    });

    it('reads a missing, empty, blank or colon-less title as null and the description as empty', () => {
      expect(parseFlashcardsCsv(body)).toMatchObject({ title: null, description: '' });
      expect(parseFlashcardsCsv(`# title:\n# description:\n${body}`)).toMatchObject({
        title: null,
        description: '',
      });
      expect(parseFlashcardsCsv(`# title:    \n# description:    \n${body}`)).toMatchObject({
        title: null,
        description: '',
      });
      expect(parseFlashcardsCsv(`# title T\n# description D\n${body}`)).toMatchObject({
        title: null,
        description: '',
      });
    });

    it('does not read a title line below the header, which is a card row', () => {
      const result = parseFlashcardsCsv('Question;Answer\n# title: T;A1');

      expect(result.title).toBeNull();
      expect(result.cards).toEqual([{ question: '# title: T', answer: 'A1' }]);
    });
  });

  describe('round trip through serializeDeckCsv', () => {
    const cards: Array<[string, string]> = [
      ['plain', 'simple'],
      ['semi; comma, tab\there', 'pipe | and § and 😀'],
      ['say "hi"', 'it\'s "quoted"'],
      ['line one\nline two', '<b>bold</b> &amp; <i>it</i>'],
      ['#hashtag', '=1+1'],
      ['Zażółć gęślą', '日本語 café'],
    ];
    const expected = cards.map(([question, answer]) => ({ question, answer }));
    const separators: Array<[string, string]> = [
      ['comma', ','],
      ['semicolon', ';'],
      ['tab', '\t'],
      ['custom pipe', '|'],
      ['custom section sign', '§'],
      ['custom emoji', '😀'],
    ];

    it.each(separators)('reads back every card of a %s export', (_label, separator) => {
      const csv = serializeDeckCsv(deckOf('Deck', 'About', cards), CATEGORY, separator);

      const result = parseFlashcardsCsv(csv);

      expect(result.delimiter).toBe(separator);
      expect(result.cards).toEqual(expected);
    });

    it('reads back a custom category by name and a built-in one by id', () => {
      const custom = serializeDeckCsv(deckOf('Deck', '', cards), CATEGORY, ';');
      const builtIn = serializeDeckCsv(deckOf('Deck', '', cards), DEFAULT_CATEGORIES[8], ';');
      const none = serializeDeckCsv(deckOf('Deck', '', cards), null, ';');

      expect(parseFlashcardsCsv(custom).categoryRef).toBe('Maths, "hard"');
      expect(parseFlashcardsCsv(builtIn).categoryRef).toBe('default_geography');
      expect(parseFlashcardsCsv(none).categoryRef).toBeNull();
    });

    it('reads back an export whose title and description need escaping', () => {
      const csv = serializeDeckCsv(
        deckOf('A "title"\nover two lines', 'back\\slash\n# not a header', [['Q', 'A']]),
        CATEGORY,
        ';',
      );

      expect(parseFlashcardsCsv(csv).cards).toEqual([{ question: 'Q', answer: 'A' }]);
    });

    it('reads back the title and description', () => {
      const csv = serializeDeckCsv(
        deckOf('A "title"\nover two lines', 'back\\slash\n# not a header', [['Q', 'A']]),
        CATEGORY,
        ';',
      );

      const result = parseFlashcardsCsv(csv);

      expect(result.title).toBe('A "title"\nover two lines');
      expect(result.description).toBe('back\\slash\n# not a header');
    });
    it('trims whitespace around a card side, which the export keeps', () => {
      const csv = serializeDeckCsv(deckOf('Deck', '', [['  padded ', ' x  ']]), null, ';');

      expect(parseFlashcardsCsv(csv).cards).toEqual([{ question: 'padded', answer: 'x' }]);
    });
  });
});

describe('deckNameFromFileName', () => {
  it('drops the extension', () => {
    expect(deckNameFromFileName('Spanish verbs.csv')).toBe('Spanish verbs');
  });

  it('falls back to null when no name is available', () => {
    expect(deckNameFromFileName(null)).toBeNull();
    expect(deckNameFromFileName('')).toBeNull();
    expect(deckNameFromFileName('.csv')).toBeNull();
  });
});
