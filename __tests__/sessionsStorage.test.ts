import { loadSessions } from '../src/storage/sessionsStorage';

const mockGetItem = jest.fn();

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: { getItem: (key: string) => mockGetItem(key), setItem: jest.fn() },
}));

function stored(rows: unknown): void {
  mockGetItem.mockResolvedValue(JSON.stringify(rows));
}

function rawSession(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 's',
    deckId: 'd',
    deckName: 'Deck',
    cardIds: ['a', 'b', 'c'],
    results: [],
    startedAt: 1,
    updatedAt: 2,
    completedAt: null,
    ...overrides,
  };
}

describe('loadSessions', () => {
  it('returns [] when nothing is stored or the value is corrupt', async () => {
    mockGetItem.mockResolvedValue(null);
    expect(await loadSessions()).toEqual([]);

    mockGetItem.mockResolvedValue('{not json');
    expect(await loadSessions()).toEqual([]);

    stored({ id: 's' });
    expect(await loadSessions()).toEqual([]);
  });

  it('drops rows it cannot make sense of', async () => {
    stored([null, 5, { id: 's' }, rawSession({ cardIds: 'a' }), rawSession({ id: 'ok' })]);

    const sessions = await loadSessions();

    expect(sessions.map(s => s.id)).toEqual(['ok']);
  });

  it('keeps okeish, and reads an unknown answer as ok', async () => {
    stored([
      rawSession({
        results: [
          { cardId: 'a', answer: 'okeish' },
          { cardId: 'b', answer: 'notOk' },
          { cardId: 'c', answer: 'nonsense' },
        ],
      }),
    ]);

    const [loaded] = await loadSessions();

    expect(loaded.results.map(r => r.answer)).toEqual(['okeish', 'notOk', 'ok']);
  });

  it('cuts results to the number of cards', async () => {
    stored([
      rawSession({
        cardIds: ['a'],
        results: [
          { cardId: 'a', answer: 'ok' },
          { cardId: 'b', answer: 'ok' },
        ],
      }),
    ]);

    const [loaded] = await loadSessions();

    expect(loaded.results).toEqual([{ cardId: 'a', answer: 'ok' }]);
  });

  it('keeps clearedAt only on a completed session', async () => {
    stored([
      rawSession({ id: 'active', clearedAt: 9 }),
      rawSession({ id: 'done', completedAt: 5, clearedAt: 9 }),
      rawSession({ id: 'bad', completedAt: 5, clearedAt: 'x' }),
    ]);

    const loaded = await loadSessions();

    expect(loaded.map(s => s.clearedAt)).toEqual([null, 9, null]);
  });

  it('reads inverted as true only for an exact true', async () => {
    stored([
      rawSession({ id: 'yes', inverted: true }),
      rawSession({ id: 'string', inverted: 'false' }),
      rawSession({ id: 'missing' }),
    ]);

    const loaded = await loadSessions();

    expect(loaded.map(s => s.inverted)).toEqual([true, false, false]);
  });

  it('normalises fixedCardIds against the cut results of a completed session', async () => {
    stored([
      rawSession({
        id: 'done',
        completedAt: 5,
        cardIds: ['a', 'b'],
        results: [
          { cardId: 'a', answer: 'ok' },
          { cardId: 'b', answer: 'notOk' },
        ],
        fixedCardIds: ['a', 'b', 'b', 7],
      }),
      rawSession({ id: 'active', fixedCardIds: ['a'] }),
    ]);

    const loaded = await loadSessions();

    expect(loaded.map(s => s.fixedCardIds)).toEqual([['b'], []]);
  });

  it('fills defaults for missing fields', async () => {
    stored([{ id: 's', deckId: 'd', cardIds: ['a'], startedAt: 4 }]);

    const [loaded] = await loadSessions();

    expect(loaded).toMatchObject({
      deckName: 'Deck',
      updatedAt: 4,
      completedAt: null,
      clearedAt: null,
      fixedCardIds: [],
      inverted: false,
      results: [],
    });
  });
});
