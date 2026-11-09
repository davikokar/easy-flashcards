import {
  MAX_COMMUNITY_CARDS,
  buildCommunityPayload,
  hashAuthor,
  importOfCommunityFile,
  isOwnedBy,
  isUuid,
  mayWrite,
  parseCommunityFile,
  serializeCommunityFile,
  toCommunityFile,
  validateCommunityPayload,
} from '../src/utils/communityDeck';

const DECK_ID = '0b9f6d1c-5a3e-4f7b-8c2d-1e4a6b8c9d0e';
const AUTHOR = '7c1d2e3f-4a5b-4c6d-8e7f-9a0b1c2d3e4f';
const OTHER = '11111111-2222-4333-8444-555555555555';

const validBody = {
  deck_id: DECK_ID,
  author_uuid: AUTHOR,
  title: ' German ',
  description: ' words ',
  category: 'default_languages',
  cards: [{ question: 'Haus', answer: 'house' }],
};

describe('isUuid', () => {
  it('accepts a UUID in either case and rejects anything else', () => {
    expect(isUuid(DECK_ID)).toBe(true);
    expect(isUuid(DECK_ID.toUpperCase())).toBe(true);
    expect(isUuid('../../etc/passwd')).toBe(false);
    expect(isUuid(`${DECK_ID}x`)).toBe(false);
    expect(isUuid(42)).toBe(false);
  });
});

describe('buildCommunityPayload', () => {
  it('trims the text, keeps card text as is and drops blank cards', () => {
    const payload = buildCommunityPayload(
      {
        name: ' Deck ',
        description: ' About ',
        cards: [
          { id: '1', question: ' <b>Q</b> ', answer: 'A', okCount: 1, okeishCount: 0, notOkCount: 0, lastReviewedAt: 5 },
          { id: '2', question: '  ', answer: 'A', okCount: 0, okeishCount: 0, notOkCount: 0, lastReviewedAt: null },
        ],
      },
      DECK_ID,
      AUTHOR,
      'My topic',
    );
    expect(payload).toEqual({
      deck_id: DECK_ID,
      author_uuid: AUTHOR,
      title: 'Deck',
      description: 'About',
      category: 'My topic',
      cards: [{ question: ' <b>Q</b> ', answer: 'A' }],
    });
  });
});

describe('validateCommunityPayload', () => {
  it('accepts a well-formed body and normalises it', () => {
    const result = validateCommunityPayload({
      ...validBody,
      deck_id: DECK_ID.toUpperCase(),
    });
    expect(result).toEqual({
      ok: true,
      payload: { ...validBody, title: 'German', description: 'words' },
    });
  });

  it('defaults a missing description and category', () => {
    const rest: Record<string, unknown> = { ...validBody };
    delete rest.description;
    delete rest.category;
    const result = validateCommunityPayload(rest);
    expect(result.ok && result.payload.description).toBe('');
    expect(result.ok && result.payload.category).toBeNull();
  });

  it.each([
    ['notAnObject', 'text'],
    ['notAnObject', null],
    ['notAnObject', [validBody]],
    ['badDeckId', { ...validBody, deck_id: '../x' }],
    ['badAuthorUuid', { ...validBody, author_uuid: 'abc' }],
    ['badTitle', { ...validBody, title: '   ' }],
    ['badTitle', { ...validBody, title: 'x'.repeat(201) }],
    ['badDescription', { ...validBody, description: 5 }],
    ['badCategory', { ...validBody, category: 5 }],
    ['noCards', { ...validBody, cards: [] }],
    ['noCards', { ...validBody, cards: 'x' }],
    ['badCard', { ...validBody, cards: [{ question: 'Q' }] }],
    ['badCard', { ...validBody, cards: [{ question: 'Q', answer: ' ' }] }],
  ])('rejects with %s', (problem, body) => {
    expect(validateCommunityPayload(body)).toEqual({ ok: false, problem });
  });

  it('rejects too many cards', () => {
    const cards = Array.from({ length: MAX_COMMUNITY_CARDS + 1 }, () => ({ question: 'Q', answer: 'A' }));
    expect(validateCommunityPayload({ ...validBody, cards })).toEqual({
      ok: false,
      problem: 'tooManyCards',
    });
  });
});

describe('the stored file', () => {
  const payload = (() => {
    const result = validateCommunityPayload(validBody);
    if (!result.ok) {
      throw new Error('fixture');
    }
    return result.payload;
  })();

  it('carries the author hash and never the author uuid', () => {
    const file = toCommunityFile(payload);
    expect(file.author_hash).toBe(hashAuthor(AUTHOR));
    expect(JSON.stringify(file)).not.toContain(AUTHOR);
    expect(serializeCommunityFile(file)).not.toContain(AUTHOR);
  });

  it('round-trips through serialisation and parsing', () => {
    const file = toCommunityFile(payload);
    expect(parseCommunityFile(JSON.parse(serializeCommunityFile(file)))).toEqual(file);
  });

  it('hashes the lower-case form of the uuid', () => {
    expect(hashAuthor(AUTHOR.toUpperCase())).toBe(hashAuthor(AUTHOR));
    expect(hashAuthor(AUTHOR)).not.toBe(hashAuthor(OTHER));
  });

  it('parses leniently but refuses what is not a deck', () => {
    const file = toCommunityFile(payload);
    expect(parseCommunityFile({ ...file, cards: [...file.cards, { question: 1 }] })).toEqual(file);
    expect(parseCommunityFile({ ...file, author_hash: 'nope' })).toBeNull();
    expect(parseCommunityFile({ ...file, deck_id: 'x' })).toBeNull();
    expect(parseCommunityFile({ ...file, cards: [] })).toBeNull();
    expect(parseCommunityFile({ ...file, title: ' ' })).toBeNull();
    expect(parseCommunityFile(null)).toBeNull();
  });

  it('reads a file from the first Worker, which stored the author uuid, as its hash', () => {
    const file = toCommunityFile(payload);
    const legacy: Record<string, unknown> = { ...file, author_uuid: AUTHOR };
    delete legacy.author_hash;

    const parsed = parseCommunityFile(legacy);

    expect(parsed).toEqual(file);
    expect(parsed && JSON.stringify(parsed)).not.toContain(AUTHOR);
  });

  it('lets only the author overwrite an existing file', () => {
    const file = toCommunityFile(payload);
    expect(isOwnedBy(file, AUTHOR)).toBe(true);
    expect(isOwnedBy(file, OTHER)).toBe(false);
    expect(mayWrite(null, OTHER)).toBe(true);
    expect(mayWrite(file, AUTHOR)).toBe(true);
    expect(mayWrite(file, OTHER)).toBe(false);
  });

  it('becomes an import whose category is still a reference', () => {
    expect(importOfCommunityFile(toCommunityFile(payload))).toEqual({
      name: 'German',
      description: 'words',
      categoryId: 'default_languages',
      sourceFileName: null,
      cards: [{ question: 'Haus', answer: 'house' }],
    });
  });
});
