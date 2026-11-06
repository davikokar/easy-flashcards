import { englishPlural } from '../src/locales/en';
import { englishT } from '../src/locales';
import {
  createTranslator,
  formatMessage,
  formatParts,
  normalizeLocaleTag,
  pseudoLocalize,
  pseudoLocalizeCatalogue,
  resolveLanguage,
  type Catalogue,
  type CatalogueArgs,
  type CatalogueKey,
  type Language,
  type MessageValue,
  type PluralRule,
  type Translator,
} from '../src/utils/i18n';

// A catalogue the tests own, so they can use plurals and placeholders the real one does not have yet.
function catalogue(messages: object): Catalogue {
  return messages as Catalogue;
}

// The test catalogue's keys are not in `MessageKey`, so these helpers call a translator loosely.
function say(t: Translator, key: string, values?: Record<string, MessageValue>): string {
  return (t as unknown as (key: string, values?: Record<string, MessageValue>) => string)(key, values);
}

function sayParts(t: Translator, key: string, values?: Record<string, MessageValue>) {
  const parts = t.parts as unknown as (key: string, values?: Record<string, MessageValue>) => ReturnType<typeof formatParts>;
  return parts(key, values);
}

// Polish-like: 2-4 is `few`, except 12-14.
const fewRule: PluralRule = count => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  if (count === 1) {
    return 'one';
  }
  if (lastDigit >= 2 && lastDigit <= 4 && !(lastTwoDigits >= 12 && lastTwoDigits <= 14)) {
    return 'few';
  }
  return 'other';
};

const english: Language = {
  code: 'en',
  plural: englishPlural,
  messages: catalogue({
    plain: 'Plain',
    greeting: 'Hello {name}',
    repeated: '{name} and {name} again',
    onlyEnglish: 'Only in English',
    group: { inner: 'Inner' },
    cards: { one: '{count} card', other: '{count} cards' },
  }),
};

const testLanguage: Language = {
  code: 'xx',
  plural: fewRule,
  messages: catalogue({
    plain: 'Zwykly',
    greeting: 'Czesc {name}',
    cards: { one: '{count} karta', few: '{count} karty', other: '{count} kart' },
  }),
};

describe('formatMessage', () => {
  it('replaces a placeholder with its value', () => {
    expect(formatMessage('Hello {name}', { name: 'Ada' })).toBe('Hello Ada');
  });

  it('writes a number the way a template literal does', () => {
    expect(formatMessage('{count} cards', { count: 12 })).toBe('12 cards');
    expect(formatMessage('{count} cards', { count: 0 })).toBe('0 cards');
  });

  it('replaces every occurrence of a repeated placeholder', () => {
    expect(formatMessage('{name} and {name}', { name: 'Ada' })).toBe('Ada and Ada');
  });

  it('leaves a placeholder with no value visible', () => {
    expect(formatMessage('{a} and {b}', { a: 'one' })).toBe('one and {b}');
    expect(formatMessage('Hello {name}')).toBe('Hello {name}');
  });

  it('does not treat the inherited members of an object as values', () => {
    expect(formatMessage('{constructor}', {})).toBe('{constructor}');
  });

  it('does not substitute inside an inserted value', () => {
    expect(formatMessage('{a}', { a: '{b}', b: 'x' })).toBe('{b}');
  });

  it('leaves braces that are not placeholders alone', () => {
    expect(formatMessage('{1} { } {a b}', { a: 'x' })).toBe('{1} { } {a b}');
  });
});

describe('formatParts', () => {
  it('splits a message into literal runs and placeholder values in order', () => {
    expect(formatParts('You have {count} cards in {deck}.', { count: 3, deck: 'Verbs' })).toEqual([
      { text: 'You have ', placeholder: null },
      { text: '3', placeholder: 'count' },
      { text: ' cards in ', placeholder: null },
      { text: 'Verbs', placeholder: 'deck' },
      { text: '.', placeholder: null },
    ]);
  });

  it('emits one part per occurrence of a repeated placeholder', () => {
    const parts = formatParts('{name}, {name}', { name: 'Ada' });

    expect(parts.filter(part => part.placeholder === 'name')).toHaveLength(2);
  });

  it('omits empty literal runs', () => {
    expect(formatParts('{a}{b}', { a: '1', b: '2' })).toEqual([
      { text: '1', placeholder: 'a' },
      { text: '2', placeholder: 'b' },
    ]);
  });

  it('returns one literal run for a message with no placeholders', () => {
    expect(formatParts('Plain')).toEqual([{ text: 'Plain', placeholder: null }]);
  });

  it('returns nothing for an empty message', () => {
    expect(formatParts('')).toEqual([]);
  });

  it('joins back to the formatted message, missing values included', () => {
    const template = 'Hello {name}, you have {count} cards';
    const values = { count: 4 };

    const joined = formatParts(template, values)
      .map(part => part.text)
      .join('');

    expect(joined).toBe(formatMessage(template, values));
    expect(joined).toBe('Hello {name}, you have 4 cards');
  });
});

describe('createTranslator', () => {
  const t = createTranslator(english, english);

  it('looks up a message with no placeholders', () => {
    expect(say(t, 'plain')).toBe('Plain');
  });

  it('fills the placeholders of a message', () => {
    expect(say(t, 'greeting', { name: 'Ada' })).toBe('Hello Ada');
    expect(say(t, 'repeated', { name: 'Ada' })).toBe('Ada and Ada again');
  });

  it('leaves a placeholder with no value visible', () => {
    expect(say(t, 'greeting')).toBe('Hello {name}');
  });

  it('picks the English plural form for 0, 1 and 2', () => {
    expect(say(t, 'cards', { count: 0 })).toBe('0 cards');
    expect(say(t, 'cards', { count: 1 })).toBe('1 card');
    expect(say(t, 'cards', { count: 2 })).toBe('2 cards');
  });

  it('picks a plural form through the language rule, `few` included', () => {
    const polish = createTranslator(testLanguage, english);

    expect(say(polish, 'cards', { count: 1 })).toBe('1 karta');
    expect(say(polish, 'cards', { count: 2 })).toBe('2 karty');
    expect(say(polish, 'cards', { count: 22 })).toBe('22 karty');
    expect(say(polish, 'cards', { count: 5 })).toBe('5 kart');
    expect(say(polish, 'cards', { count: 12 })).toBe('12 kart');
  });

  it('uses `other` for a form the message lacks', () => {
    const language: Language = {
      ...testLanguage,
      messages: catalogue({ cards: { one: '{count} karta', other: '{count} kart' } }),
    };

    expect(say(createTranslator(language, english), 'cards', { count: 2 })).toBe('2 kart');
  });

  it('shows the fallback language for a key the language lacks', () => {
    const polish = createTranslator(testLanguage, english);

    expect(say(polish, 'onlyEnglish')).toBe('Only in English');
    expect(say(polish, 'plain')).toBe('Zwykly');
  });

  it('chooses a fallback plural form with the fallback language rule', () => {
    const language: Language = { ...testLanguage, messages: catalogue({}) };
    const fallback: Language = {
      ...english,
      messages: catalogue({ cards: { one: 'ONE', few: 'FEW', other: 'OTHER' } }),
    };

    expect(say(createTranslator(language, fallback), 'cards', { count: 2 })).toBe('OTHER');
  });

  it('shows the key itself when no language has the message', () => {
    expect(say(t, 'nowhere.at.all')).toBe('nowhere.at.all');
  });

  it('does not read a group as a message', () => {
    expect(say(t, 'group')).toBe('group');
  });

  it('exposes the same text as parts', () => {
    const joined = sayParts(t, 'cards', { count: 3 })
      .map(part => part.text)
      .join('');

    expect(joined).toBe(say(t, 'cards', { count: 3 }));
    expect(sayParts(t, 'cards', { count: 3 })[0]).toEqual({ text: '3', placeholder: 'count' });
  });
});

describe('normalizeLocaleTag', () => {
  it('moves the script of a Java tag after the language', () => {
    expect(normalizeLocaleTag('sr_RS_#Latn')).toBe('sr-Latn-RS');
  });

  it('reads a Java tag without a script', () => {
    expect(normalizeLocaleTag('en_US')).toBe('en-US');
  });

  it('keeps a BCP 47 tag and fixes its case', () => {
    expect(normalizeLocaleTag('zh-Hant-TW')).toBe('zh-Hant-TW');
    expect(normalizeLocaleTag('EN-us')).toBe('en-US');
    expect(normalizeLocaleTag('es-419')).toBe('es-419');
  });

  it('drops variants and extensions', () => {
    expect(normalizeLocaleTag('ja_JP_JP_#u-ca-japanese')).toBe('ja-JP');
    expect(normalizeLocaleTag('en-US-u-ca-gregory')).toBe('en-US');
  });

  it('reads a tag with no language as nothing', () => {
    expect(normalizeLocaleTag('')).toBeNull();
    expect(normalizeLocaleTag('   ')).toBeNull();
    expect(normalizeLocaleTag('_US')).toBeNull();
    expect(normalizeLocaleTag('x')).toBeNull();
    expect(normalizeLocaleTag('!!')).toBeNull();
    expect(normalizeLocaleTag(null)).toBeNull();
    expect(normalizeLocaleTag(undefined)).toBeNull();
  });

  it('maps the legacy Java language codes to their current ones', () => {
    expect(normalizeLocaleTag('in_ID')).toBe('id-ID');
    expect(normalizeLocaleTag('in')).toBe('id');
    expect(normalizeLocaleTag('IN-id')).toBe('id-ID');
    expect(normalizeLocaleTag('iw_IL')).toBe('he-IL');
    expect(normalizeLocaleTag('ji')).toBe('yi');
  });

  it('maps a legacy code only as the primary subtag', () => {
    expect(normalizeLocaleTag('en-IN')).toBe('en-IN');
    expect(normalizeLocaleTag('en_IN')).toBe('en-IN');
    expect(normalizeLocaleTag('id')).toBe('id');
    expect(normalizeLocaleTag('he')).toBe('he');
  });
});

describe('resolveLanguage', () => {
  const codes = ['en', 'en-XA', 'de', 'pt-BR', 'zh-Hant', 'sr-Latn', 'sr'];

  it('picks the exact tag first', () => {
    expect(resolveLanguage('pt-BR', codes, 'en')).toBe('pt-BR');
    expect(resolveLanguage('en-XA', codes, 'en')).toBe('en-XA');
  });

  it('falls back from the full tag to the base language', () => {
    expect(resolveLanguage('de-AT', codes, 'en')).toBe('de');
    expect(resolveLanguage('en-US', codes, 'en')).toBe('en');
  });

  it('falls back from language, script and region to the script, then the language', () => {
    expect(resolveLanguage('zh-Hant-TW', codes, 'en')).toBe('zh-Hant');
    expect(resolveLanguage('sr_RS_#Latn', codes, 'en')).toBe('sr-Latn');
    expect(resolveLanguage('sr_RS_#Cyrl', codes, 'en')).toBe('sr');
  });

  it('reads Java tags', () => {
    expect(resolveLanguage('en_XA', codes, 'en')).toBe('en-XA');
    expect(resolveLanguage('de_DE', codes, 'en')).toBe('de');
    expect(resolveLanguage('ja_JP_JP_#u-ca-japanese', ['ja'], 'en')).toBe('ja');
  });

  it('ignores case', () => {
    expect(resolveLanguage('EN-xa', codes, 'en')).toBe('en-XA');
  });

  it('uses the fallback for a language it does not have', () => {
    expect(resolveLanguage('pt-PT', codes, 'en')).toBe('en');
    expect(resolveLanguage('zh-TW', codes, 'en')).toBe('en');
    expect(resolveLanguage('fr', codes, 'de')).toBe('de');
  });

  it('uses the fallback for a tag that is empty, missing or unparseable', () => {
    expect(resolveLanguage('', codes, 'en')).toBe('en');
    expect(resolveLanguage('   ', codes, 'en')).toBe('en');
    expect(resolveLanguage(null, codes, 'en')).toBe('en');
    expect(resolveLanguage(undefined, codes, 'en')).toBe('en');
    expect(resolveLanguage('!!!', codes, 'en')).toBe('en');
    expect(resolveLanguage('und', codes, 'en')).toBe('en');
  });

  it('reads the legacy Java language codes as the current ones', () => {
    expect(resolveLanguage('in_ID', ['en', 'id'], 'en')).toBe('id');
    expect(resolveLanguage('in', ['en', 'id'], 'en')).toBe('id');
    expect(resolveLanguage('iw', ['en', 'he'], 'en')).toBe('he');
    expect(resolveLanguage('in_ID', ['en'], 'en')).toBe('en');
    expect(resolveLanguage('en_IN', ['en', 'id'], 'en')).toBe('en');
  });

  describe('with Simplified Chinese, Arabic and Indonesian registered', () => {
    const registered = ['en', 'zh-CN', 'ar', 'id'];

    it.each(['zh-CN', 'zh-Hans-CN', 'zh_CN'])('resolves %s to zh-CN', tag => {
      expect(resolveLanguage(tag, registered, 'en')).toBe('zh-CN');
    });

    it.each(['zh-TW', 'zh-Hant-TW', 'zh-HK', 'zh-Hant'])('resolves %s to the fallback', tag => {
      expect(resolveLanguage(tag, registered, 'en')).toBe('en');
    });

    it.each(['ar-SA', 'ar_EG', 'ar'])('resolves %s to ar', tag => {
      expect(resolveLanguage(tag, registered, 'en')).toBe('ar');
    });

    it.each(['id-ID', 'in_ID'])('resolves %s to id', tag => {
      expect(resolveLanguage(tag, registered, 'en')).toBe('id');
    });
  });
});

describe('pseudoLocalize', () => {
  it('keeps every placeholder intact', () => {
    const result = pseudoLocalize('Delete {deckName}? {count} cards.');

    expect(result).toContain('{deckName}');
    expect(result).toContain('{count}');
  });

  it('accents the letters around a placeholder', () => {
    expect(pseudoLocalize('Delete {name}')).not.toMatch(/Delete/);
  });

  it('wraps the text in brackets', () => {
    const result = pseudoLocalize('Cancel');

    expect(result.startsWith('[')).toBe(true);
    expect(result.endsWith(']')).toBe(true);
  });

  it('lengthens the text by about a third', () => {
    for (const text of ['OK', 'Start a new session', 'Reset statistics for this deck']) {
      expect(pseudoLocalize(text).length).toBeGreaterThanOrEqual((text.length * 4) / 3);
    }
  });

  it('changes every ASCII letter to one non-ASCII character', () => {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (const letter of letters) {
      const accented = pseudoLocalize(letter).slice(1, 2);
      expect(accented).not.toBe(letter);
      expect(accented.charCodeAt(0)).toBeGreaterThan(127);
      expect(accented.normalize('NFC')).toBe(accented);
    }
  });

  it('leaves digits and punctuation alone', () => {
    expect(pseudoLocalize('1, 2!')).toBe('[1, 2!~~]');
  });

  it('still fills a placeholder afterwards', () => {
    expect(formatMessage(pseudoLocalize('{count} cards'), { count: 3 })).toContain('3');
  });
});

describe('pseudoLocalizeCatalogue', () => {
  it('localizes every message and every plural form, keeping the shape', () => {
    const result = pseudoLocalizeCatalogue(
      catalogue({
        group: { plain: 'Plain', cards: { one: '{count} card', other: '{count} cards' } },
      }),
    ) as unknown as { group: { plain: string; cards: { one: string; other: string } } };

    expect(result.group.plain).toBe(pseudoLocalize('Plain'));
    expect(result.group.cards.one).toBe(pseudoLocalize('{count} card'));
    expect(result.group.cards.other).toBe(pseudoLocalize('{count} cards'));
  });
});

describe('typed keys and values', () => {
  type Sample = {
    plain: 'Plain';
    greeting: 'Hello {name}';
    pair: '{first} and {second}';
    cards: { one: '{count} card'; other: '{count} cards' };
  };
  const sampleT = ((key: string) => key) as unknown as <K extends CatalogueKey<Sample>>(
    key: K,
    ...args: CatalogueArgs<Sample, K>
  ) => string;

  it('accepts a known key with exactly the values it needs', () => {
    expect(sampleT('plain')).toBe('plain');
    expect(sampleT('greeting', { name: 'Ada' })).toBe('greeting');
    expect(sampleT('pair', { first: 'a', second: 'b' })).toBe('pair');
    expect(sampleT('cards', { count: 2 })).toBe('cards');
    expect(englishT('navigation.tabs.decks')).toBe('Decks');
  });

  it('rejects an unknown key', () => {
    // @ts-expect-error not a key of the sample catalogue
    sampleT('nope');
    // @ts-expect-error the forms of a plural message are not keys
    sampleT('cards.one');
    // @ts-expect-error not a key of the English catalogue
    englishT('navigation.tabs.nope');
  });

  it('rejects a missing value', () => {
    // @ts-expect-error `name` is needed
    sampleT('greeting');
    // @ts-expect-error `second` is needed
    sampleT('pair', { first: 'a' });
    // @ts-expect-error a plural message needs `count`
    sampleT('cards', {});
  });

  it('rejects a value for a message that has no such placeholder', () => {
    // @ts-expect-error `plain` has no placeholders
    sampleT('plain', { name: 'Ada' });
    // @ts-expect-error `extra` is not a placeholder of `greeting`
    sampleT('greeting', { name: 'Ada', extra: 1 });
    // @ts-expect-error the English tab titles have no placeholders
    englishT('navigation.tabs.decks', { name: 'Ada' });
  });
});
