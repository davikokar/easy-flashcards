import { loadDecks } from '../src/storage/decksStorage';

const mockGetItem = jest.fn();

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: { getItem: (key: string) => mockGetItem(key), setItem: jest.fn() },
}));

function stored(rows: unknown): void {
  mockGetItem.mockResolvedValue(JSON.stringify(rows));
}

describe('loadDecks', () => {
  it('returns [] when nothing is stored or the value is corrupt', async () => {
    mockGetItem.mockResolvedValue(null);
    expect(await loadDecks()).toEqual([]);

    mockGetItem.mockResolvedValue('[{');
    expect(await loadDecks()).toEqual([]);
  });

  it('drops decks without an id, a name or a card list', async () => {
    stored([null, { id: 'a', name: 'A' }, { name: 'B', cards: [] }, { id: 'c', name: 'C', cards: [] }]);

    const decks = await loadDecks();

    expect(decks.map(d => d.id)).toEqual(['c']);
  });

  it('drops malformed cards and defaults missing counters to 0', async () => {
    stored([
      {
        id: 'd',
        name: 'D',
        cards: [
          { id: 'a', question: 'q', answer: 'a', okCount: 3, notOkCount: 1 },
          { id: 'b', question: 'q' },
          { question: 'q', answer: 'a' },
        ],
      },
    ]);

    const [deck] = await loadDecks();

    expect(deck.cards).toEqual([
      {
        id: 'a',
        question: 'q',
        answer: 'a',
        okCount: 3,
        okeishCount: 0,
        notOkCount: 1,
        lastReviewedAt: null,
      },
    ]);
    expect(deck.lastStudiedAt).toBeNull();
    expect(deck.sourceFileName).toBeNull();
  });

  it('reads a missing or non-string description as an empty string', async () => {
    stored([
      { id: 'a', name: 'A', cards: [] },
      { id: 'b', name: 'B', description: 3, cards: [] },
      { id: 'c', name: 'C', description: 'About C', cards: [] },
    ]);

    const decks = await loadDecks();

    expect(decks.map(d => d.description)).toEqual(['', '', 'About C']);
  });
});
