import { Card, Deck } from '../src/types';
import { getDeckStats, getGlobalStats, formatRate, sortCardsByDifficulty, successRate } from '../src/utils/stats';

function card(id: string, okCount: number, notOkCount: number): Card {
  return { id, question: id, answer: id, okCount, notOkCount, lastReviewedAt: null };
}

function deck(id: string, cards: Card[], sessionCount = 1): Deck {
  return {
    id,
    name: id,
    sourceFileName: null,
    createdAt: 0,
    lastStudiedAt: null,
    sessionCount,
    cards,
  };
}

describe('successRate', () => {
  it('returns null when nothing was reviewed', () => {
    expect(successRate(0, 0)).toBeNull();
  });

  it('computes a percentage', () => {
    expect(successRate(3, 1)).toBe(75);
  });
});

describe('getDeckStats', () => {
  it('aggregates card counters', () => {
    const stats = getDeckStats(deck('d1', [card('a', 2, 1), card('b', 1, 0)]));

    expect(stats).toEqual({
      cardCount: 2,
      reviewCount: 4,
      okCount: 3,
      notOkCount: 1,
      successRate: 75,
    });
  });
});

describe('getGlobalStats', () => {
  it('aggregates every deck', () => {
    const stats = getGlobalStats([
      deck('d1', [card('a', 1, 1)]),
      deck('d2', [card('b', 2, 0)], 2),
    ]);

    expect(stats.deckCount).toBe(2);
    expect(stats.cardCount).toBe(2);
    expect(stats.reviewCount).toBe(4);
    expect(stats.sessionCount).toBe(3);
    expect(formatRate(stats.successRate)).toBe('75%');
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
});
