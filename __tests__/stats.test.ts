import { Card, Deck, Session } from '../src/types';
import {
  answerShares,
  clearableSessionCount,
  clearCompletedSessionsAt,
  clearSessionAt,
  getDeckStats,
  getGlobalStats,
  getMissedOrUnsureCardIds,
  getSessionStats,
  getSessionTally,
  formatRate,
  isSessionCleared,
  listedSessions,
  previousReviewIndex,
  resolvableCardIds,
  sessionProgressShares,
  sortCardsByDifficulty,
  sortSessions,
  successRate,
  summarizeSessions,
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

function session(
  id: string,
  deckId: string,
  startedAt: number,
  completedAt: number | null,
  clearedAt: number | null = null,
): Session {
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
    clearedAt,
  };
}

describe('answerShares', () => {
  it('returns null when nothing was reviewed', () => {
    expect(answerShares({ okCount: 0, okeishCount: 0, notOkCount: 0 })).toBeNull();
  });

  it('splits reviews three ways without folding okeish into not ok', () => {
    const shares = answerShares({ okCount: 2, okeishCount: 1, notOkCount: 1 });

    expect(shares).toEqual({ ok: 50, okeish: 25, notOk: 25 });
  });

  it('reports an okeish-only deck as 100% okeish and 0% ok', () => {
    const shares = answerShares({ okCount: 0, okeishCount: 3, notOkCount: 0 });

    expect(shares).toEqual({ ok: 0, okeish: 100, notOk: 0 });
  });
});

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

describe('previousReviewIndex', () => {
  it('steps back one answered card', () => {
    expect(previousReviewIndex(3, 3)).toBe(2);
    expect(previousReviewIndex(1, 3)).toBe(0);
  });

  it('wraps from the oldest answered card to the frontier', () => {
    expect(previousReviewIndex(0, 3)).toBe(3);
  });

  it('wraps a single answered card to the frontier', () => {
    expect(previousReviewIndex(0, 1)).toBe(1);
  });

  it('has nowhere to go when nothing is answered', () => {
    expect(previousReviewIndex(0, 0)).toBeNull();
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

  it('still counts cleared sessions', () => {
    const byDeck = summarizeSessionsByDeck([
      session('s1', 'd1', 10, 20, 50),
      session('s2', 'd1', 30, 40, 50),
    ]);

    expect(byDeck.get('d1')).toEqual({ total: 2, active: 0, completed: 2, lastSessionAt: 30 });
  });
});

describe('summarizeSessions', () => {
  it('still counts cleared sessions and their start dates', () => {
    const summary = summarizeSessions([
      session('s1', 'd1', 10, 20, 50),
      session('s2', 'd1', 30, 40, 50),
      session('s3', 'd1', 5, null),
    ]);

    expect(summary).toEqual({ total: 3, active: 1, completed: 2, lastSessionAt: 30 });
  });
});

describe('isSessionCleared', () => {
  it('is true only when clearedAt is set', () => {
    expect(isSessionCleared(session('a', 'd1', 1, 2, 3))).toBe(true);
    expect(isSessionCleared(session('b', 'd1', 1, 2))).toBe(false);
  });
});

describe('listedSessions', () => {
  it('excludes cleared sessions and keeps completed and active ones', () => {
    const listed = listedSessions([
      session('cleared', 'd1', 1, 2, 9),
      session('done', 'd1', 3, 4),
      session('active', 'd1', 5, null),
    ]);

    expect(listed.map(s => s.id)).toEqual(['done', 'active']);
  });

  it('lists an active session even if it carries a clearedAt', () => {
    const listed = listedSessions([session('active', 'd1', 1, null, 9)]);

    expect(listed.map(s => s.id)).toEqual(['active']);
  });
});

describe('clearableSessionCount', () => {
  it('counts completed sessions that are not yet cleared', () => {
    const count = clearableSessionCount([
      session('cleared', 'd1', 1, 2, 9),
      session('done1', 'd1', 3, 4),
      session('done2', 'd1', 5, 6),
      session('active', 'd1', 7, null),
    ]);

    expect(count).toBe(2);
  });

  it('is zero when there are no sessions', () => {
    expect(clearableSessionCount([])).toBe(0);
  });
});

describe('clearCompletedSessionsAt', () => {
  it('stamps completed sessions with one timestamp and never an active one', () => {
    const result = clearCompletedSessionsAt(
      [session('done1', 'd1', 1, 2), session('done2', 'd2', 3, 4), session('active', 'd1', 5, null)],
      100,
    );

    expect(result.map(s => s.clearedAt)).toEqual([100, 100, null]);
  });

  it('keeps an earlier clearedAt', () => {
    const result = clearCompletedSessionsAt([session('old', 'd1', 1, 2, 50), session('new', 'd1', 3, 4)], 100);

    expect(result.map(s => s.clearedAt)).toEqual([50, 100]);
  });

  it('returns the same array when nothing qualifies', () => {
    const sessions = [session('old', 'd1', 1, 2, 50), session('active', 'd1', 3, null)];

    expect(clearCompletedSessionsAt(sessions, 100)).toBe(sessions);
  });

  it('does not mutate its input', () => {
    const sessions = [session('done', 'd1', 1, 2)];

    clearCompletedSessionsAt(sessions, 100);

    expect(sessions[0].clearedAt).toBeNull();
  });
});

describe('clearSessionAt', () => {
  it('stamps only the named completed session', () => {
    const result = clearSessionAt([session('a', 'd1', 1, 2), session('b', 'd1', 3, 4)], 'b', 100);

    expect(result.map(s => s.clearedAt)).toEqual([null, 100]);
  });

  it('leaves an active session unchanged', () => {
    const sessions = [session('active', 'd1', 1, null)];

    expect(clearSessionAt(sessions, 'active', 100)).toBe(sessions);
  });

  it('keeps an earlier clearedAt', () => {
    const sessions = [session('done', 'd1', 1, 2, 50)];

    expect(clearSessionAt(sessions, 'done', 100)).toBe(sessions);
  });

  it('leaves the sessions unchanged for an unknown id', () => {
    const sessions = [session('done', 'd1', 1, 2)];

    expect(clearSessionAt(sessions, 'missing', 100)).toBe(sessions);
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

describe('sessionProgressShares', () => {
  it('sums to the answered fraction of the session while it is partly done', () => {
    const tally = { okCount: 5, okeishCount: 2, notOkCount: 2 };

    const shares = sessionProgressShares(tally, 56);

    expect(shares.ok + shares.okeish + shares.notOk).toBeCloseTo((9 / 56) * 100, 6);
    expect(shares.ok).toBeCloseTo((5 / 56) * 100, 6);
  });

  it('sums to 100 once every card is answered', () => {
    const tally = { okCount: 2, okeishCount: 1, notOkCount: 1 };

    const shares = sessionProgressShares(tally, 4);

    expect(shares).toEqual({ ok: 50, okeish: 25, notOk: 25 });
    expect(shares.ok + shares.okeish + shares.notOk).toBe(100);
  });

  it('keeps okeish as its own share instead of folding it into not ok', () => {
    const tally = { okCount: 0, okeishCount: 3, notOkCount: 1 };

    const shares = sessionProgressShares(tally, 4);

    expect(shares.okeish).toBe(75);
    expect(shares.notOk).toBe(25);
  });

  it('caps the sum at 100 when the tally exceeds the card count', () => {
    const tally = { okCount: 3, okeishCount: 0, notOkCount: 3 };

    const shares = sessionProgressShares(tally, 4);

    expect(shares.ok + shares.okeish + shares.notOk).toBeCloseTo(100, 6);
    expect(shares.ok).toBeCloseTo(50, 6);
  });

  it('returns zeros, not NaN, for a session with no cards', () => {
    const tally = { okCount: 0, okeishCount: 0, notOkCount: 0 };

    expect(sessionProgressShares(tally, 0)).toEqual({ ok: 0, okeish: 0, notOk: 0 });
  });
});

describe('resolvableCardIds', () => {
  it('keeps the given order rather than the deck order', () => {
    const d = deck('d', [card('a', 0, 0), card('b', 0, 0), card('c', 0, 0)]);

    expect(resolvableCardIds(['c', 'a', 'b'], d)).toEqual(['c', 'a', 'b']);
  });

  it('drops ids that are no longer in the deck', () => {
    const d = deck('d', [card('a', 0, 0), card('c', 0, 0)]);

    expect(resolvableCardIds(['a', 'b', 'c'], d)).toEqual(['a', 'c']);
  });

  it('returns an empty list when nothing resolves', () => {
    const d = deck('d', [card('a', 0, 0)]);

    expect(resolvableCardIds(['x', 'y'], d)).toEqual([]);
  });
});
