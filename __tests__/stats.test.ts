import { Card, Deck, Session } from '../src/types';
import {
  getDeckStats,
  getGlobalStats,
  getMissedOrUnsureCardIds,
  getSessionStats,
  getSessionTally,
  formatRate,
  sortCardsByDifficulty,
  sortSessions,
  successRate,
  summarizeSessionsByDeck,
} from '../src/utils/stats';

function card(id: string, okCount: number, notOkCount: number, okeishCount = 0): Card {
  return { id, question: id, answer: id, okCount, okeishCount, notOkCount, lastReviewedAt: null };
}

function deck(id: string, cards: Card[]): Deck {
  return {
    id,
    name: id,
    sourceFileName: null,
    createdAt: 0,
    lastStudiedAt: null,
    cards,
  };
}

function session(id: string, deckId: string, startedAt: number, completedAt: number | null): Session {
  return {
    id,
    deckId,
    deckName: deckId,
    cardIds: ['a', 'b'],
    results: [
      { cardId: 'a', answer: 'ok' },
      { cardId: 'b', answer: 'notOk' },
    ],
    startedAt,
    updatedAt: completedAt ?? startedAt,
    completedAt,
  };
}

describe('successRate', () => {
  it('returns null when nothing was reviewed', () => {
    expect(successRate(0, 0, 0)).toBeNull();
  });

  it('computes a percentage', () => {
    expect(successRate(3, 0, 1)).toBe(75);
  });

  it('counts okeish as a review that earns no credit', () => {
    expect(successRate(2, 1, 1)).toBe(50);
    expect(successRate(0, 3, 0)).toBe(0);
  });
});

describe('getDeckStats', () => {
  it('aggregates card counters', () => {
    const stats = getDeckStats(deck('d1', [card('a', 2, 1), card('b', 1, 0)]));

    expect(stats).toEqual({
      cardCount: 2,
      reviewCount: 4,
      okCount: 3,
      okeishCount: 0,
      notOkCount: 1,
      successRate: 75,
    });
  });

  it('includes okeish in the review count and the rate', () => {
    const stats = getDeckStats(deck('d1', [card('a', 2, 1, 1), card('b', 1, 0, 3)]));

    expect(stats).toEqual({
      cardCount: 2,
      reviewCount: 8,
      okCount: 3,
      okeishCount: 4,
      notOkCount: 1,
      successRate: 37.5,
    });
  });

  it('rates a card answered only okeish as 0%, not unreviewed', () => {
    const stats = getDeckStats(deck('d1', [card('a', 0, 0, 2)]));

    expect(stats.successRate).toBe(0);
    expect(formatRate(stats.successRate)).toBe('0%');
  });
});

describe('getGlobalStats', () => {
  it('aggregates every deck', () => {
    const stats = getGlobalStats([deck('d1', [card('a', 1, 1)]), deck('d2', [card('b', 2, 0)])]);

    expect(stats.deckCount).toBe(2);
    expect(stats.cardCount).toBe(2);
    expect(stats.reviewCount).toBe(4);
    expect(formatRate(stats.successRate)).toBe('75%');
  });

  it('aggregates okeish across decks', () => {
    const stats = getGlobalStats([
      deck('d1', [card('a', 1, 0, 1)]),
      deck('d2', [card('b', 1, 1, 0)]),
    ]);

    expect(stats.okeishCount).toBe(1);
    expect(stats.reviewCount).toBe(4);
    expect(stats.successRate).toBe(50);
  });
});

describe('getSessionStats', () => {
  it('reports progress and whether the session is still active', () => {
    const active = session('s1', 'd1', 10, null);
    const stats = getSessionStats(active);

    expect(stats).toEqual({
      cardCount: 2,
      answered: 2,
      okCount: 1,
      okeishCount: 0,
      notOkCount: 1,
      successRate: 50,
      isActive: true,
    });
  });

  it('counts okeish separately from not ok', () => {
    const stats = getSessionStats(mixedSession());

    expect(stats).toMatchObject({
      answered: 4,
      okCount: 1,
      okeishCount: 2,
      notOkCount: 1,
      successRate: 25,
    });
  });
});

function mixedSession(): Session {
  return {
    ...session('mixed', 'd1', 1, 2),
    cardIds: ['a', 'b', 'c', 'd'],
    results: [
      { cardId: 'a', answer: 'ok' },
      { cardId: 'b', answer: 'okeish' },
      { cardId: 'c', answer: 'notOk' },
      { cardId: 'd', answer: 'okeish' },
    ],
  };
}

describe('getSessionTally', () => {
  it('tallies ok, okeish and not ok', () => {
    expect(getSessionTally(mixedSession())).toEqual({ okCount: 1, okeishCount: 2, notOkCount: 1 });
  });

  it('is all zero for a session with no results', () => {
    const empty = { ...mixedSession(), results: [] };

    expect(getSessionTally(empty)).toEqual({ okCount: 0, okeishCount: 0, notOkCount: 0 });
  });
});

describe('getMissedOrUnsureCardIds', () => {
  it('returns not ok and okeish cards in answered order, never ok ones', () => {
    expect(getMissedOrUnsureCardIds(mixedSession())).toEqual(['b', 'c', 'd']);
  });

  it('is empty when every answer was ok', () => {
    const allOk = { ...mixedSession(), results: [{ cardId: 'a', answer: 'ok' as const }] };

    expect(getMissedOrUnsureCardIds(allOk)).toEqual([]);
  });
});

describe('summarizeSessionsByDeck', () => {
  it('counts total and active sessions and keeps the latest start date', () => {
    const byDeck = summarizeSessionsByDeck([
      session('s1', 'd1', 10, 20),
      session('s2', 'd1', 30, null),
      session('s3', 'd2', 5, 6),
    ]);

    expect(byDeck.get('d1')).toEqual({
      total: 2,
      active: 1,
      completed: 1,
      lastSessionAt: 30,
    });
    expect(byDeck.get('d2')?.active).toBe(0);
  });
});

describe('sortSessions', () => {
  it('lists active sessions first, most recent first', () => {
    const sorted = sortSessions([
      session('oldDone', 'd1', 1, 2),
      session('newDone', 'd1', 3, 40),
      session('active', 'd1', 2, null),
    ]);

    expect(sorted.map(s => s.id)).toEqual(['active', 'newDone', 'oldDone']);
  });
});

describe('sortCardsByDifficulty', () => {
  it('puts the lowest success rate first and unseen cards last', () => {
    const sorted = sortCardsByDifficulty([
      card('easy', 5, 0),
      card('unseen', 0, 0),
      card('hard', 1, 4),
    ]);

    expect(sorted.map(c => c.id)).toEqual(['hard', 'easy', 'unseen']);
  });

  it('ranks a card answered only okeish as hard as one answered only not ok', () => {
    const sorted = sortCardsByDifficulty([
      card('mostly', 3, 0, 1),
      card('okeishOnly', 0, 0, 2),
      card('notOkOnly', 0, 2, 0),
    ]);

    expect(sorted.map(c => c.id)).toEqual(['notOkOnly', 'okeishOnly', 'mostly']);
  });

  it('breaks ties by review count, then not ok count, regardless of input order', () => {
    const cards = [
      card('fewReviews', 0, 1),
      card('okeishTie', 0, 0, 2),
      card('notOkTie', 0, 2),
      card('manyReviews', 0, 3),
    ];
    const expected = ['manyReviews', 'notOkTie', 'okeishTie', 'fewReviews'];

    expect(sortCardsByDifficulty(cards).map(c => c.id)).toEqual(expected);
    expect(sortCardsByDifficulty([...cards].reverse()).map(c => c.id)).toEqual(expected);
  });
});
