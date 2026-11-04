import { deckNameFromFileName, parseFlashcardsCsv } from '../src/utils/csv';
import { DeckImportError } from '../src/utils/deckImport';
import { serializeDeckCsv } from '../src/utils/deckExport';
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
  });

  it('rejects a header row that has only one of the two columns', () => {
    expect(() => parseFlashcardsCsv('Question\nQ1')).toThrow(DeckImportError);
  });

  it('rejects an empty file', () => {
    expect(() => parseFlashcardsCsv('   ')).toThrow(DeckImportError);
    expect(() => parseFlashcardsCsv('')).toThrow(/empty/);
    expect(() => parseFlashcardsCsv('\n \n')).toThrow(/empty/);
  });

  it('rejects a file with a header and no usable rows', () => {
    expect(() => parseFlashcardsCsv('Question;Answer\n')).toThrow(/No usable rows/);
    expect(() => parseFlashcardsCsv('Question;Answer\nQ1;\n;A2')).toThrow(/No usable rows/);
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

    it('reads back an export whose title and description need escaping', () => {
      const csv = serializeDeckCsv(
        deckOf('A "title"\nover two lines', 'back\\slash\n# not a header', [['Q', 'A']]),
        CATEGORY,
        ';',
      );

      expect(parseFlashcardsCsv(csv).cards).toEqual([{ question: 'Q', answer: 'A' }]);
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

  it('falls back when no name is available', () => {
    expect(deckNameFromFileName(null)).toBe('Imported deck');
  });
});
