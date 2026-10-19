import { Card, Deck, Session } from '../src/types';
import {
  getDeckStats,
  getGlobalStats,
  getSessionStats,
  formatRate,
  sortCardsByDifficulty,
  sortSessions,
  successRate,
  summarizeSessionsByDeck,
} from '../src/utils/stats';

function card(id: string, okCount: number, notOkCount: number): Card {
  return { id, question: id, answer: id, okCount, notOkCount, lastReviewedAt: null };
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
    const stats = getGlobalStats([deck('d1', [card('a', 1, 1)]), deck('d2', [card('b', 2, 0)])]);

    expect(stats.deckCount).toBe(2);
    expect(stats.cardCount).toBe(2);
    expect(stats.reviewCount).toBe(4);
    expect(formatRate(stats.successRate)).toBe('75%');
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
      notOkCount: 1,
      successRate: 50,
      isActive: true,
    });
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
});
