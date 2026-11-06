import {
  LANGUAGES,
  LANGUAGE_NAMES,
  PSEUDO,
  ENGLISH,
  SELECTABLE_LANGUAGES,
  englishT,
  isSelectableLanguageCode,
  translatorForChoice,
  translatorForTag,
} from '../src/locales';
import { pseudoLocalize, type Language } from '../src/utils/i18n';
import {
  CATEGORY_ICONS,
  DEFAULT_CATEGORIES,
  DEFAULT_CATEGORY_ICONS,
} from '../src/utils/categories';

const RESERVED = ['zero', 'one', 'two', 'few', 'many', 'other'];
const SEGMENT = /^[a-z][A-Za-z0-9_]*$/;

type Leaf = { key: string; plural: boolean; texts: string[] };

function isPluralNode(node: object): boolean {
  return typeof (node as { other?: unknown }).other === 'string';
}

// Collects every message, and every way the catalogue's structure breaks the key rules.
function walk(node: object, prefix: string, leaves: Leaf[], problems: string[]): void {
  for (const [name, child] of Object.entries(node)) {
    const key = prefix === '' ? name : `${prefix}.${name}`;
    if (!SEGMENT.test(name)) {
      problems.push(`${key}: bad segment`);
    }
    if (typeof child === 'string') {
      leaves.push({ key, plural: false, texts: [child] });
    } else if (typeof child === 'object' && child !== null && isPluralNode(child)) {
      const forms = Object.entries(child);
      for (const [form, text] of forms) {
        if (!RESERVED.includes(form) || typeof text !== 'string') {
          problems.push(`${key}.${form}: not a plural form`);
        }
      }
      leaves.push({ key, plural: true, texts: forms.map(([, text]) => String(text)) });
    } else if (typeof child === 'object' && child !== null) {
      for (const member of Object.keys(child)) {
        if (RESERVED.includes(member)) {
          problems.push(`${key}.${member}: reserved name used in a group`);
        }
      }
      walk(child, key, leaves, problems);
    } else {
      problems.push(`${key}: not a message`);
    }
  }
}

function collect(language: Language) {
  const leaves: Leaf[] = [];
  const problems: string[] = [];
  walk(language.messages, '', leaves, problems);
  return { leaves, problems };
}

function placeholdersOf(texts: string[]): string[] {
  const names = new Set<string>();
  for (const text of texts) {
    for (const match of text.matchAll(/\{([A-Za-z][A-Za-z0-9]*)\}/g)) {
      names.add(match[1]);
    }
  }
  return [...names].sort();
}

function formsOf(language: Language, key: string): Record<string, string> {
  let node: unknown = language.messages;
  for (const segment of key.split('.')) {
    node = (node as Record<string, unknown>)[segment];
  }
  return node as Record<string, string>;
}

describe.each(LANGUAGES.map(language => [language.code, language] as const))(
  'language %s',
  (_code, language) => {
    const english = collect(ENGLISH);
    const own = collect(language);

    it('follows the key naming rules', () => {
      expect(own.problems).toEqual([]);
    });

    it('has the same keys as English', () => {
      expect(own.leaves.map(leaf => leaf.key).sort()).toEqual(
        english.leaves.map(leaf => leaf.key).sort(),
      );
    });

    it('has the same placeholders as English in every message', () => {
      const wanted = new Map(english.leaves.map(leaf => [leaf.key, placeholdersOf(leaf.texts)]));

      for (const leaf of own.leaves) {
        expect([leaf.key, placeholdersOf(leaf.texts)]).toEqual([leaf.key, wanted.get(leaf.key)]);
      }
    });

    it('is plural exactly where English is', () => {
      const wanted = new Map(english.leaves.map(leaf => [leaf.key, leaf.plural]));

      for (const leaf of own.leaves) {
        expect([leaf.key, leaf.plural]).toEqual([leaf.key, wanted.get(leaf.key)]);
      }
    });

    it('has `other` and every form its rule returns for 0 to 1000 in each plural message', () => {
      const needed = new Set<string>(['other']);
      for (let count = 0; count <= 1000; count++) {
        needed.add(language.plural(count));
      }

      for (const leaf of own.leaves.filter(candidate => candidate.plural)) {
        const present = Object.keys(formsOf(language, leaf.key));
        const missing = [...needed].filter(form => !present.includes(form));
        expect([leaf.key, missing]).toEqual([leaf.key, []]);
      }
    });

    it('has no empty message', () => {
      const empty = own.leaves.filter(leaf => leaf.texts.some(text => text.trim() === ''));

      expect(empty.map(leaf => leaf.key)).toEqual([]);
    });

    it('labels every category icon and names every built-in category', () => {
      const keys = new Set(own.leaves.map(leaf => leaf.key));
      const wanted = [
        ...DEFAULT_CATEGORIES.map(category => `categoryNames.builtIn.${category.icon}`),
        ...CATEGORY_ICONS.map(icon =>
          (DEFAULT_CATEGORY_ICONS as readonly string[]).includes(icon)
            ? `categoryNames.builtIn.${icon}`
            : `categoryNames.icons.${icon}`,
        ),
      ];

      expect(wanted.filter(key => !keys.has(key))).toEqual([]);
      expect(DEFAULT_CATEGORIES.every(category => category.id === `default_${category.icon}`)).toBe(
        true,
      );
    });
  },
);

describe('translatorForTag', () => {
  it('uses English for an English or unknown device language', () => {
    expect(translatorForTag('en-US')).toBe(englishT);
    expect(translatorForTag('hi-IN')).toBe(englishT);
    expect(translatorForTag('zh-TW')).toBe(englishT);
    expect(translatorForTag('zh-Hant-TW')).toBe(englishT);
    expect(translatorForTag('zh-HK')).toBe(englishT);
    expect(translatorForTag('he-IL')).toBe(englishT);
    expect(translatorForTag(null)).toBe(englishT);
    expect(translatorForTag('')).toBe(englishT);
  });

  it.each([
    ['de-DE', 'Stapel'],
    ['fr-FR', 'Paquets'],
    ['it-IT', 'Mazzi'],
    ['es-ES', 'Mazos'],
    ['pt-BR', 'Baralhos'],
    ['pt_BR', 'Baralhos'],
    ['pt-PT', 'Baralhos'],
    ['pl-PL', 'Talie'],
    ['ro-RO', 'Pachete'],
    ['tr-TR', 'Desteler'],
    ['uk-UA', 'Колоди'],
    ['ar-SA', 'المجموعات'],
    ['ar_EG', 'المجموعات'],
    ['id-ID', 'Dek'],
    ['in_ID', 'Dek'],
    ['vi-VN', 'Bộ thẻ'],
    ['th-TH', 'ชุดการ์ด'],
    ['ja-JP', 'デッキ'],
    ['ko-KR', '덱'],
    ['zh-CN', '卡组'],
    ['zh-Hans-CN', '卡组'],
    ['zh_CN', '卡组'],
  ])('uses the translation for the device language %s', (tag, decks) => {
    expect(translatorForTag(tag)('navigation.tabs.decks')).toBe(decks);
    expect(decks).not.toBe(englishT('navigation.tabs.decks'));
  });

  it('uses the pseudo-language for en-XA only', () => {
    expect(PSEUDO.code).toBe('en-XA');
    expect(translatorForTag('en-XA')('navigation.tabs.decks')).toBe(pseudoLocalize('Decks'));
    expect(translatorForTag('en_XA')('navigation.tabs.decks')).toBe(pseudoLocalize('Decks'));
    expect(translatorForTag('en-XB')('navigation.tabs.decks')).toBe('Decks');
  });
});

describe('plural rules', () => {
  const EXPECTED: Record<string, Record<string, number[]>> = {
    en: { one: [1], other: [0, 2, 5] },
    'en-XA': { one: [1], other: [0, 2, 5] },
    de: { one: [1], other: [0, 2, 5] },
    es: { one: [1], other: [0, 2, 5] },
    it: { one: [1], other: [0, 2, 5] },
    tr: { one: [1], other: [0, 2, 5] },
    fr: { one: [0, 1], other: [2] },
    pt: { one: [0, 1], other: [2] },
    pl: {
      one: [1],
      few: [2, 3, 4, 22, 23, 24, 102],
      many: [0, 5, 11, 12, 13, 14, 21, 25, 111, 112],
    },
    ro: { one: [1], few: [0, 2, 19, 101, 119], other: [20, 21, 100, 120] },
    uk: {
      one: [1, 21, 31, 101],
      few: [2, 3, 4, 22, 24],
      many: [0, 5, 11, 12, 14, 20, 25],
    },
    id: { other: [0, 1, 2, 5, 100, 1000] },
    vi: { other: [0, 1, 2, 5, 100, 1000] },
    th: { other: [0, 1, 2, 5, 100, 1000] },
    ja: { other: [0, 1, 2, 5, 100, 1000] },
    'zh-CN': { other: [0, 1, 2, 5, 100, 1000] },
    ko: { other: [0, 1, 2, 5, 100, 1000] },
    ar: {
      zero: [0],
      one: [1],
      two: [2],
      few: [3, 4, 10, 103, 110, 203],
      many: [11, 12, 50, 99, 111, 199],
      other: [100, 101, 102, 200],
    },
  };

  it('is checked for every registered language', () => {
    expect(LANGUAGES.map(language => language.code).sort()).toEqual(Object.keys(EXPECTED).sort());
  });

  describe.each(LANGUAGES.map(language => [language.code, language] as const))(
    'language %s',
    (code, language) => {
      it('returns the CLDR form for known integers', () => {
        const actual: Record<string, string> = {};
        const wanted: Record<string, string> = {};
        for (const [form, counts] of Object.entries(EXPECTED[code])) {
          for (const count of counts) {
            actual[count] = language.plural(count);
            wanted[count] = form;
          }
        }

        expect(actual).toEqual(wanted);
      });
    },
  );

  it('renders a counted message in the form of the count', () => {
    const counts = [1, 2, 5, 20];
    const render = (tag: string) =>
      counts.map(count => translatorForTag(tag)('common.counts.cards', { count }));

    expect(render('pl')).toEqual(['1 fiszka', '2 fiszki', '5 fiszek', '20 fiszek']);
    expect(render('uk')).toEqual(['1 картка', '2 картки', '5 карток', '20 карток']);
    expect(render('ro')).toEqual(['1 card', '2 carduri', '5 carduri', '20 de carduri']);
  });

  it('renders Arabic counted messages in all six forms', () => {
    const counts = [0, 1, 2, 3, 11, 100];

    expect(counts.map(count => translatorForTag('ar')('common.counts.cards', { count }))).toEqual([
      '0 بطاقات',
      '1 بطاقة',
      '2 بطاقتان',
      '3 بطاقات',
      '11 بطاقة',
      '100 بطاقة',
    ]);
  });

  it.each(['zh-CN', 'ja', 'ko'])('renders every count of %s in its one form', tag => {
    const render = (count: number) => translatorForTag(tag)('common.counts.cards', { count });

    expect(render(1).replace('1', '#')).toBe(render(5).replace('5', '#'));
    expect(render(1)).toContain('1');
    expect(render(5)).toContain('5');
  });
});

describe('ENGLISH', () => {
  it('has the tab and header titles the navigator shows', () => {
    expect(englishT('navigation.tabs.statistics')).toBe('Statistics');
    expect(englishT('navigation.headers.deckStats')).toBe('Deck statistics');
  });

  it('words the shared search and count messages as the screens did before they were shared', () => {
    expect(englishT('common.search.noMatchesTitle')).toBe('No matches');
    expect(englishT('common.search.noMatchesMessage', { query: 'abc' })).toBe(
      'Nothing matches "abc".',
    );
    expect(englishT('common.search.clearSearchButton')).toBe('Clear search');
    expect(englishT('common.counts.cards', { count: 1 })).toBe('1 card');
    expect(englishT('common.counts.sessions', { count: 2 })).toBe('2 sessions');
    expect(englishT('common.counts.reviews', { count: 0 })).toBe('0 reviews');
  });
});

describe('language choice', () => {
  it('names every selectable language and no other', () => {
    expect(Object.keys(LANGUAGE_NAMES).sort()).toEqual(
      SELECTABLE_LANGUAGES.map(language => language.code).sort(),
    );
  });

  it('leaves the pseudo-language out of the choices', () => {
    expect(isSelectableLanguageCode('en-XA')).toBe(false);
    expect(isSelectableLanguageCode('en')).toBe(true);
    expect(isSelectableLanguageCode('zh-CN')).toBe(true);
  });

  it('rejects a code that is not a registered language', () => {
    expect(isSelectableLanguageCode('xx')).toBe(false);
    expect(isSelectableLanguageCode(null)).toBe(false);
    expect(isSelectableLanguageCode(7)).toBe(false);
  });
});

describe('translatorForChoice', () => {
  it('uses the chosen language whatever the device language is', () => {
    expect(translatorForChoice('de', 'fr-FR')('navigation.tabs.decks')).toBe('Stapel');
    expect(translatorForChoice('en', 'de-DE')).toBe(englishT);
  });

  it('follows the device language for null', () => {
    expect(translatorForChoice(null, 'de-DE')('navigation.tabs.decks')).toBe('Stapel');
  });

  it('follows the device language for a code no language registers', () => {
    expect(translatorForChoice('xx', 'de-DE')('navigation.tabs.decks')).toBe('Stapel');
    expect(translatorForChoice('en-XA', 'de-DE')('navigation.tabs.decks')).toBe('Stapel');
  });
});
