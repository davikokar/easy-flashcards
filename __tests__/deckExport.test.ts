import Papa from 'papaparse';
import { Card, Category, Deck } from '../src/types';
import {
  DECK_FILE_FORMAT,
  DECK_FILE_VERSION,
  EXPORT_MIME_TYPES,
  SEPARATOR_PRESETS,
  exportFileName,
  serializeDeck,
  serializeDeckCsv,
  serializeDeckJson,
  validateCustomSeparator,
} from '../src/utils/deckExport';
import { DEFAULT_CATEGORIES } from '../src/utils/categories';

function card(question: string, answer: string): Card {
  return {
    id: `id-${question}`,
    question,
    answer,
    okCount: 3,
    okeishCount: 2,
    notOkCount: 1,
    lastReviewedAt: 123,
  };
}

function deck(cards: Card[], name = 'German words', description = ''): Deck {
  return {
    id: 'deck-1',
    name,
    description,
    categoryId: null,
    sourceFileName: 'german.csv',
    createdAt: 1,
    lastStudiedAt: 2,
    cards,
  };
}

const languages = DEFAULT_CATEGORIES.find(category => category.id === 'default_languages')!;

const customCategory: Category = {
  id: 'custom_1',
  name: 'My topic',
  color: '#112233',
  icon: 'anchor',
  createdAt: 99,
};

describe('validateCustomSeparator', () => {
  it('accepts a single punctuation character', () => {
    expect(validateCustomSeparator('|')).toEqual({ ok: true, separator: '|' });
  });

  it('accepts a single symbol outside the BMP', () => {
    expect(validateCustomSeparator('\u{1F600}')).toEqual({ ok: true, separator: '\u{1F600}' });
  });

  it('rejects an empty input', () => {
    expect(validateCustomSeparator('')).toEqual({ ok: false, reason: 'empty' });
  });

  it('rejects more than one character, counted by code point', () => {
    expect(validateCustomSeparator('||')).toEqual({ ok: false, reason: 'tooLong' });
    expect(validateCustomSeparator('\u{1F600}\u{1F600}')).toEqual({ ok: false, reason: 'tooLong' });
  });

  it.each(['"', '#', '\r', '\n', '\ufeff'])('rejects the reserved character %j', input => {
    expect(validateCustomSeparator(input)).toEqual({ ok: false, reason: 'reserved' });
  });

  it('rejects whitespace, tab included, rather than trimming it', () => {
    expect(validateCustomSeparator(' ')).toEqual({ ok: false, reason: 'whitespace' });
    expect(validateCustomSeparator('\t')).toEqual({ ok: false, reason: 'whitespace' });
  });

  it('rejects letters and digits in any script', () => {
    expect(validateCustomSeparator('a')).toEqual({ ok: false, reason: 'alphanumeric' });
    expect(validateCustomSeparator('7')).toEqual({ ok: false, reason: 'alphanumeric' });
    expect(validateCustomSeparator('\u00e9')).toEqual({ ok: false, reason: 'alphanumeric' });
    expect(validateCustomSeparator('\u6f22')).toEqual({ ok: false, reason: 'alphanumeric' });
  });
});

describe('SEPARATOR_PRESETS', () => {
  it('lists comma, semicolon and tab by key, with no label', () => {
    expect(SEPARATOR_PRESETS.map(preset => [preset.key, preset.value])).toEqual([
      ['comma', ','],
      ['semicolon', ';'],
      ['tab', '\t'],
    ]);
  });
});

describe('serializeDeckJson', () => {
  it('writes the keys in order, pretty-printed with two spaces', () => {
    const json = serializeDeckJson(deck([card('Q', 'A')], 'Title', 'Desc'), null);

    expect(json).toBe(
      [
        '{',
        '  "format": "easy-flashcards-deck",',
        '  "version": 2,',
        '  "title": "Title",',
        '  "description": "Desc",',
        '  "category": null,',
        '  "cards": [',
        '    {',
        '      "question": "Q",',
        '      "answer": "A"',
        '    }',
        '  ]',
        '}',
      ].join('\n'),
    );
  });

  it('writes a built-in category as its id, not its name', () => {
    const parsed = JSON.parse(serializeDeckJson(deck([]), languages));

    expect(parsed.category).toBe('default_languages');
  });

  it('writes a custom category as its name, not its id', () => {
    const parsed = JSON.parse(serializeDeckJson(deck([]), customCategory));

    expect(parsed.category).toBe('My topic');
  });

  it('writes the format and version from the shared constants', () => {
    const parsed = JSON.parse(serializeDeckJson(deck([]), null));

    expect(parsed.format).toBe(DECK_FILE_FORMAT);
    expect(parsed.version).toBe(DECK_FILE_VERSION);
    expect(DECK_FILE_VERSION).toBe(2);
  });

  it('exports card text exactly as stored and leaves progress out', () => {
    const text = '  What is the capital of <b>France</b>?\n';
    const parsed = JSON.parse(serializeDeckJson(deck([card(text, ' Paris ')]), null));

    expect(parsed.cards).toEqual([{ question: text, answer: ' Paris ' }]);
    expect(Object.keys(parsed)).toEqual([
      'format',
      'version',
      'title',
      'description',
      'category',
      'cards',
    ]);
  });

  it('exports a deck with no cards', () => {
    expect(JSON.parse(serializeDeckJson(deck([]), null)).cards).toEqual([]);
  });
});

describe('serializeDeckCsv', () => {
  it('writes five comment lines, a lower-case header and one row per card, ending in LF', () => {
    const csv = serializeDeckCsv(
      deck([card('What is the capital of <b>France</b>?', 'Paris')], 'German words', 'Words.'),
      languages,
      ';',
    );

    expect(csv).toBe(
      [
        '# format: easy-flashcards-deck',
        '# version: 2',
        '# title: German words',
        '# description: Words.',
        '# category: default_languages',
        'question;answer',
        'What is the capital of <b>France</b>?;Paris',
        '',
      ].join('\n'),
    );
  });

  it('writes a custom category as its name', () => {
    const csv = serializeDeckCsv(deck([card('Q', 'A')]), customCategory, ',');

    expect(csv.split('\n')[4]).toBe('# category: My topic');
  });

  it('writes empty comment values as the key and colon only', () => {
    const csv = serializeDeckCsv(deck([card('Q', 'A')], 'T', ''), null, ',');

    expect(csv.split('\n').slice(2, 5)).toEqual(['# title: T', '# description:', '# category:']);
  });

  it('keeps a comment value on one line, escaping backslash and line feed and dropping CR', () => {
    const csv = serializeDeckCsv(deck([], 'a\\b', 'one\r\ntwo\nthree'), null, ',');

    expect(csv.split('\n').slice(2, 4)).toEqual(['# title: a\\\\b', '# description: one\\ntwo\\nthree']);
  });

  it('does not quote or escape the separator in a comment line', () => {
    const csv = serializeDeckCsv(deck([], 'a;b'), null, ';');

    expect(csv.split('\n')[2]).toBe('# title: a;b');
  });

  it('writes only the comment lines and the header for a deck with no cards', () => {
    const csv = serializeDeckCsv(deck([], 'T'), null, ';');

    expect(csv).toBe(
      '# format: easy-flashcards-deck\n# version: 2\n# title: T\n# description:\n# category:\nquestion;answer\n',
    );
  });

  it('quotes a field that starts with #, and no other field of that row', () => {
    const csv = serializeDeckCsv(deck([card('#1 hit', 'plain')]), null, ';');

    expect(csv.split('\n')[6]).toBe('"#1 hit";plain');
  });

  it('quotes a field with the separator, a quote, a line break or edge spaces', () => {
    const csv = serializeDeckCsv(
      deck([card('a;b', 'say "hi"'), card('one\ntwo', ' padded ')]),
      null,
      ';',
    );

    expect(csv.split('\n').slice(6, 8)).toEqual(['"a;b";"say ""hi"""', '"one']);
    expect(csv.endsWith('two";" padded "\n')).toBe(true);
  });

  it('writes fields that start with =, +, - or @ unchanged', () => {
    const csv = serializeDeckCsv(deck([card('=1+1', '-x'), card('+y', '@z')]), null, ',');

    expect(csv.split('\n').slice(6, 8)).toEqual(['=1+1,-x', '+y,@z']);
  });

  it('writes no BOM and no carriage return', () => {
    const csv = serializeDeckCsv(deck([card('Q', 'A')], 'T', 'a\r\nb'), null, '\t');

    expect(csv.charCodeAt(0)).not.toBe(0xfeff);
    expect(csv).not.toContain('\r');
  });

  it.each([',', ';', '\t', '|', '~', '\u{1F600}'])(
    'round-trips through PapaParse with separator %j',
    separator => {
      const cards = [
        card('plain', 'text'),
        card(`has${separator}separator`, 'say "hi"'),
        card('two\nlines', 'cr\r\nlf'),
        card('#hash first', '#'),
        card(' leading', 'trailing '),
        card('<b>bold</b> &amp; <i>it</i>', '=SUM(A1)'),
        card('ünï', '日本語'),
      ];

      const text = serializeDeckCsv(deck(cards, 'T', 'D'), null, separator);
      const parsed = Papa.parse<string[]>(text, {
        delimiter: separator,
        comments: '#',
        skipEmptyLines: true,
      });

      expect(parsed.errors).toEqual([]);
      expect(parsed.data).toEqual([
        ['question', 'answer'],
        ...cards.map(item => [item.question, item.answer]),
      ]);
    },
  );

  it('rejects a separator that is neither a preset nor valid', () => {
    expect(() => serializeDeckCsv(deck([]), null, '"')).toThrow(/reserved/);
    expect(() => serializeDeckCsv(deck([]), null, 'ab')).toThrow(/tooLong/);
    expect(() => serializeDeckCsv(deck([]), null, '')).toThrow(/empty/);
  });
});

describe('serializeDeck', () => {
  it('serialises JSON or CSV by the chosen format', () => {
    const source = deck([card('Q', 'A')], 'T');

    expect(serializeDeck(source, null, { format: 'json' })).toBe(serializeDeckJson(source, null));
    expect(serializeDeck(source, null, { format: 'csv', separator: ',' })).toBe(
      serializeDeckCsv(source, null, ','),
    );
  });
});

describe('exportFileName', () => {
  it('adds the extension for the format', () => {
    expect(exportFileName('German words', 'csv')).toBe('German words.csv');
    expect(exportFileName('German words', 'json')).toBe('German words.json');
  });

  it('replaces characters a file system rejects, so a title cannot make a path', () => {
    expect(exportFileName('a/b\\c:d*e?f"g<h>i|j', 'csv')).toBe('a_b_c_d_e_f_g_h_i_j.csv');
    expect(exportFileName('../x', 'csv')).toBe('.._x.csv');
    expect(exportFileName('tab\there\n', 'csv')).toBe('tab_here_.csv');
  });

  it('trims the title and falls back to deck when nothing is left', () => {
    expect(exportFileName('  Spaced  ', 'json')).toBe('Spaced.json');
    expect(exportFileName('   ', 'json')).toBe('deck.json');
    expect(exportFileName('', 'csv')).toBe('deck.csv');
  });
});

describe('EXPORT_MIME_TYPES', () => {
  it('maps each format to its MIME type', () => {
    expect(EXPORT_MIME_TYPES).toEqual({ json: 'application/json', csv: 'text/csv' });
  });
});
