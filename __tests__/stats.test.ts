import { Answer, Card, Deck, Session } from '../src/types';
import {
  allocateRingSegments,
  answerShares,
  applyReviewAnswer,
  canRecordAnswer,
  cardReviewCount,
  clearableSessionCount,
  clearCompletedSessionsAt,
  clearSessionAt,
  countSessionsByDeckSince,
  countSessionsSince,
  describeAnswerShares,
  EMPTY_SESSION_SUMMARY,
  formatDate,
  getDeckStats,
  getDeckStatsSince,
  getGlobalStats,
  getGlobalStatsSince,
  getMissedOrUnsureCardIds,
  getOutstandingReviewCardIds,
  getReviewableCardIds,
  getReviewState,
  getSessionTally,
  formatRate,
  isSessionActive,
  isSessionCleared,
  listedSessions,
  normalizeFixedCardIds,
  prependSessionClearing,
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
    description: '',
    categoryId: null,
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
      { cardId: 'a', answer: 'ok', answeredAt: startedAt },
      { cardId: 'b', answer: 'notOk', answeredAt: startedAt },
    ],
    startedAt,
    updatedAt: completedAt ?? startedAt,
    completedAt,
    clearedAt,
    fixedCardIds: [],
    inverted: false,
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

describe('describeAnswerShares', () => {
  it('lists the three rounded percentages in Ok, Okeish, Not ok order', () => {
    const text = describeAnswerShares({ ok: 73.6, okeish: 18.2, notOk: 8.2 });

    expect(text).toBe('74% Ok, 18% Okeish, 8% Not ok');
  });

  it('shows a zero share as 0%, not as missing', () => {
    const text = describeAnswerShares({ ok: 0, okeish: 100, notOk: 0 });

    expect(text).toBe('0% Ok, 100% Okeish, 0% Not ok');
  });

  it('says not reviewed yet when there are no shares', () => {
    expect(describeAnswerShares(null)).toBe('Not reviewed yet');
  });
});

describe('allocateRingSegments', () => {
  it('splits segments in proportion to the shares', () => {
    const segments = allocateRingSegments({ ok: 50, okeish: 25, notOk: 25 }, 8);

    expect(segments).toEqual({ okCount: 4, okeishCount: 2, notOkCount: 2 });
  });

  it('is not thrown off by float noise on an exact split', () => {
    const segments = allocateRingSegments({ ok: 70, okeish: 20, notOk: 10 }, 10);

    expect(segments).toEqual({ okCount: 7, okeishCount: 2, notOkCount: 1 });
  });

  it('always adds up to the count', () => {
    for (let ok = 0; ok <= 5; ok++) {
      for (let okeish = 0; okeish <= 5; okeish++) {
        for (let notOk = 0; notOk <= 5; notOk++) {
          const shares = answerShares({ okCount: ok, okeishCount: okeish, notOkCount: notOk });
          if (shares === null) {
            continue;
          }
          for (let count = 1; count <= 30; count++) {
            const s = allocateRingSegments(shares, count);

            expect(s.okCount + s.okeishCount + s.notOkCount).toBe(count);
          }
        }
      }
    }
  });

  it('gives every non-zero share a segment once the count allows', () => {
    for (let ok = 0; ok <= 4; ok++) {
      for (let okeish = 0; okeish <= 4; okeish++) {
        for (let notOk = 0; notOk <= 4; notOk++) {
          const shares = answerShares({ okCount: ok, okeishCount: okeish, notOkCount: notOk });
          const nonZero = [ok, okeish, notOk].filter(n => n > 0).length;
          for (let count = 3; count <= 30; count++) {
            const s = allocateRingSegments(shares, count);

            expect(s.okCount > 0).toBe(ok > 0);
            expect(s.okeishCount > 0).toBe(okeish > 0);
            expect(s.notOkCount > 0).toBe(notOk > 0);
            expect(nonZero === 0 || s.okCount + s.okeishCount + s.notOkCount === count).toBe(true);
          }
        }
      }
    }
  });

  it('gives the leftover to the largest remainder, not to the largest share', () => {
    // Exact split 1.4 / 1.4 / 4.2: the one leftover goes to a 0.4 remainder, not to Not ok.
    const segments = allocateRingSegments({ ok: 20, okeish: 20, notOk: 60 }, 7);

    expect(segments).toEqual({ okCount: 2, okeishCount: 1, notOkCount: 4 });
  });

  it('breaks a remainder tie in favour of Ok, then Okeish, then Not ok', () => {
    const third = 100 / 3;
    const evenShares = { ok: third, okeish: third, notOk: third };

    expect(allocateRingSegments(evenShares, 10)).toEqual({
      okCount: 4,
      okeishCount: 3,
      notOkCount: 3,
    });
    expect(allocateRingSegments(evenShares, 11)).toEqual({
      okCount: 4,
      okeishCount: 4,
      notOkCount: 3,
    });
    expect(allocateRingSegments({ ok: 50, okeish: 50, notOk: 0 }, 3)).toEqual({
      okCount: 2,
      okeishCount: 1,
      notOkCount: 0,
    });
    expect(allocateRingSegments({ ok: 0, okeish: 50, notOk: 50 }, 3)).toEqual({
      okCount: 0,
      okeishCount: 2,
      notOkCount: 1,
    });
  });

  it('gives a tiny share one segment, taken from the largest', () => {
    const segments = allocateRingSegments({ ok: 98, okeish: 1, notOk: 1 }, 10);

    expect(segments).toEqual({ okCount: 8, okeishCount: 1, notOkCount: 1 });
  });

  it('leaves a zero share at zero segments', () => {
    const segments = allocateRingSegments({ ok: 99.9, okeish: 0.1, notOk: 0 }, 12);

    expect(segments).toEqual({ okCount: 11, okeishCount: 1, notOkCount: 0 });
  });

  it('still adds up to the count when it is smaller than the number of non-zero shares', () => {
    const segments = allocateRingSegments({ ok: 50, okeish: 30, notOk: 20 }, 2);

    expect(segments).toEqual({ okCount: 1, okeishCount: 1, notOkCount: 0 });
  });

  it('gives every segment to a 100% single answer', () => {
    expect(allocateRingSegments({ ok: 100, okeish: 0, notOk: 0 }, 12)).toEqual({
      okCount: 12,
      okeishCount: 0,
      notOkCount: 0,
    });
    expect(allocateRingSegments({ ok: 0, okeish: 100, notOk: 0 }, 12)).toEqual({
      okCount: 0,
      okeishCount: 12,
      notOkCount: 0,
    });
    expect(allocateRingSegments({ ok: 0, okeish: 0, notOk: 100 }, 1)).toEqual({
      okCount: 0,
      okeishCount: 0,
      notOkCount: 1,
    });
  });

  it('returns all zeros for null shares', () => {
    expect(allocateRingSegments(null, 12)).toEqual({
      okCount: 0,
      okeishCount: 0,
      notOkCount: 0,
    });
  });

  it('returns all zeros for a count of zero or less', () => {
    const shares = { ok: 50, okeish: 25, notOk: 25 };
    const zeros = { okCount: 0, okeishCount: 0, notOkCount: 0 };

    expect(allocateRingSegments(shares, 0)).toEqual(zeros);
    expect(allocateRingSegments(shares, -4)).toEqual(zeros);
  });

  it('returns all zeros when every share is zero', () => {
    const segments = allocateRingSegments({ ok: 0, okeish: 0, notOk: 0 }, 12);

    expect(segments).toEqual({ okCount: 0, okeishCount: 0, notOkCount: 0 });
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

function mixedSession(): Session {
  return {
    ...session('mixed', 'd1', 1, 2),
    cardIds: ['a', 'b', 'c', 'd'],
    results: [
      { cardId: 'a', answer: 'ok', answeredAt: 1 },
      { cardId: 'b', answer: 'okeish', answeredAt: 1 },
      { cardId: 'c', answer: 'notOk', answeredAt: 1 },
      { cardId: 'd', answer: 'okeish', answeredAt: 1 },
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
    const allOk = { ...mixedSession(), results: [{ cardId: 'a', answer: 'ok' as const, answeredAt: 1 }] };

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

describe('cardReviewCount', () => {
  it('adds ok, okeish and not ok', () => {
    expect(cardReviewCount(card('a', 2, 3, 4))).toBe(9);
  });

  it('is 0 for an unreviewed card', () => {
    expect(cardReviewCount(card('a', 0, 0))).toBe(0);
  });
});

describe('isSessionActive', () => {
  it('is true only while completedAt is null', () => {
    expect(isSessionActive(session('s', 'd', 1, null))).toBe(true);
    expect(isSessionActive(session('s', 'd', 1, 2))).toBe(false);
  });
});

describe('EMPTY_SESSION_SUMMARY', () => {
  it('matches the summary of no sessions', () => {
    expect(EMPTY_SESSION_SUMMARY).toEqual(summarizeSessions([]));
  });
});

describe('formatDate', () => {
  it('says Never for a null or zero timestamp', () => {
    expect(formatDate(null)).toBe('Never');
    expect(formatDate(0)).toBe('Never');
  });

  it('formats a timestamp with the device locale', () => {
    const timestamp = Date.UTC(2026, 0, 15, 12);

    expect(formatDate(timestamp)).toBe(new Date(timestamp).toLocaleDateString());
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

function answered(cardId: string, answer: Answer, answeredAt = 1) {
  return { cardId, answer, answeredAt };
}

// Completed session over a-d: b missed, c unsure, a and d ok.
function reviewSession(overrides: Partial<Session> = {}): Session {
  return {
    id: 's1',
    deckId: 'd',
    deckName: 'd',
    cardIds: ['a', 'b', 'c', 'd'],
    results: [
      answered('a', 'ok'),
      answered('b', 'notOk'),
      answered('c', 'okeish'),
      answered('d', 'ok'),
    ],
    startedAt: 1,
    updatedAt: 2,
    completedAt: 2,
    clearedAt: null,
    fixedCardIds: [],
    inverted: false,
    ...overrides,
  };
}

const reviewDeck = deck('d', [card('a', 0, 0), card('b', 0, 0), card('c', 0, 0), card('d', 0, 0)]);

describe('getReviewableCardIds / getOutstandingReviewCardIds', () => {
  it('lists missed or unsure cards in session order and excludes Ok', () => {
    expect(getReviewableCardIds(reviewSession(), reviewDeck)).toEqual(['b', 'c']);
  });

  it('dedupes a card answered more than once', () => {
    const s = reviewSession({
      results: [answered('b', 'notOk'), answered('c', 'okeish'), answered('b', 'okeish')],
    });

    expect(getReviewableCardIds(s, reviewDeck)).toEqual(['b', 'c']);
  });

  it('skips cards that no longer exist in the deck', () => {
    const d = deck('d', [card('a', 0, 0), card('c', 0, 0)]);

    expect(getReviewableCardIds(reviewSession(), d)).toEqual(['c']);
  });

  it('is empty when there is no deck', () => {
    expect(getReviewableCardIds(reviewSession(), undefined)).toEqual([]);
    expect(getOutstandingReviewCardIds(reviewSession(), undefined)).toEqual([]);
  });

  it('removes fixed cards from the outstanding list and keeps session order', () => {
    const s = reviewSession({ fixedCardIds: ['b'] });

    expect(getOutstandingReviewCardIds(s, reviewDeck)).toEqual(['c']);
    expect(getOutstandingReviewCardIds(reviewSession(), reviewDeck)).toEqual(['b', 'c']);
  });
});

describe('getReviewState', () => {
  it('is outstanding with a count while cards remain', () => {
    expect(getReviewState(reviewSession(), reviewDeck)).toEqual({ kind: 'outstanding', count: 2 });
    expect(getReviewState(reviewSession({ fixedCardIds: ['b'] }), reviewDeck)).toEqual({
      kind: 'outstanding',
      count: 1,
    });
  });

  it('is done once every reviewable card is fixed', () => {
    const s = reviewSession({ fixedCardIds: ['b', 'c'] });

    expect(getReviewState(s, reviewDeck)).toEqual({ kind: 'done' });
  });

  it('is none for a session with nothing missed', () => {
    const s = reviewSession({ results: [answered('a', 'ok')] });

    expect(getReviewState(s, reviewDeck)).toEqual({ kind: 'none' });
  });

  it('is none when none of the missed cards still exist in the deck', () => {
    const d = deck('d', [card('a', 0, 0), card('d', 0, 0)]);

    expect(getReviewState(reviewSession(), d)).toEqual({ kind: 'none' });
    expect(getReviewState(reviewSession(), undefined)).toEqual({ kind: 'none' });
  });

  it('is done, not none, when the only reviewable card is fixed and the others left the deck', () => {
    const d = deck('d', [card('c', 0, 0)]);

    expect(getReviewState(reviewSession({ fixedCardIds: ['c'] }), d)).toEqual({ kind: 'done' });
  });

  it('is none for an active session', () => {
    const s = reviewSession({ completedAt: null });

    expect(getReviewState(s, reviewDeck)).toEqual({ kind: 'none' });
  });
});

describe('canRecordAnswer', () => {
  const active = { ...session('s1', 'd', 1, null), results: [answered('a', 'ok')] };

  it('accepts the next unanswered card of an active session', () => {
    expect(canRecordAnswer(active, 'b')).toBe(true);
  });

  it('rejects a card that was already answered', () => {
    expect(canRecordAnswer(active, 'a')).toBe(false);
  });

  it('rejects a card that is not next, or not in the session', () => {
    const fresh = { ...active, results: [] };

    expect(canRecordAnswer(fresh, 'b')).toBe(false);
    expect(canRecordAnswer(fresh, 'zzz')).toBe(false);
  });

  it('rejects every answer for a completed session', () => {
    expect(canRecordAnswer(session('s2', 'd', 1, 2), 'a')).toBe(false);
  });
});

describe('applyReviewAnswer', () => {
  it('adds the card id on Ok', () => {
    const sessions = [reviewSession()];

    const next = applyReviewAnswer(sessions, 's1', 'b', 'ok');

    expect(next).not.toBe(sessions);
    expect(next[0].fixedCardIds).toEqual(['b']);
    expect(applyReviewAnswer(next, 's1', 'c', 'ok')[0].fixedCardIds).toEqual(['b', 'c']);
  });

  it('returns the same array for Okeish and Not ok', () => {
    const sessions = [reviewSession()];

    expect(applyReviewAnswer(sessions, 's1', 'b', 'okeish')).toBe(sessions);
    expect(applyReviewAnswer(sessions, 's1', 'b', 'notOk')).toBe(sessions);
  });

  it('returns the same array for an unknown session', () => {
    const sessions = [reviewSession()];

    expect(applyReviewAnswer(sessions, 'missing', 'b', 'ok')).toBe(sessions);
  });

  it('returns the same array for an active session', () => {
    const sessions = [reviewSession({ completedAt: null })];

    expect(applyReviewAnswer(sessions, 's1', 'b', 'ok')).toBe(sessions);
  });

  it('returns the same array for a card already fixed', () => {
    const sessions = [reviewSession({ fixedCardIds: ['b'] })];

    expect(applyReviewAnswer(sessions, 's1', 'b', 'ok')).toBe(sessions);
  });

  it('returns the same array for a card that was not missed', () => {
    const sessions = [reviewSession()];

    expect(applyReviewAnswer(sessions, 's1', 'a', 'ok')).toBe(sessions);
    expect(applyReviewAnswer(sessions, 's1', 'zzz', 'ok')).toBe(sessions);
  });

  it('touches nothing but the target fixedCardIds', () => {
    const target = reviewSession({ clearedAt: 9 });
    const other = reviewSession({ id: 's2' });
    const sessions = [other, target];

    const next = applyReviewAnswer(sessions, 's1', 'b', 'ok');

    expect(next[0]).toBe(other);
    expect(next[1]).toEqual({ ...target, fixedCardIds: ['b'] });
    expect(next[1].results).toBe(target.results);
    expect(sessions[1].fixedCardIds).toEqual([]);
  });
});

describe('normalizeFixedCardIds', () => {
  const results = reviewSession().results;

  it('reads a missing or non-array value as empty', () => {
    expect(normalizeFixedCardIds(undefined, results, 2)).toEqual([]);
    expect(normalizeFixedCardIds('b', results, 2)).toEqual([]);
    expect(normalizeFixedCardIds({ 0: 'b' }, results, 2)).toEqual([]);
  });

  it('drops non-strings', () => {
    expect(normalizeFixedCardIds(['b', 3, null, {}, 'c'], results, 2)).toEqual(['b', 'c']);
  });

  it('drops duplicates, first occurrence wins', () => {
    expect(normalizeFixedCardIds(['c', 'b', 'c', 'b'], results, 2)).toEqual(['c', 'b']);
  });

  it('keeps only ids that were missed or unsure', () => {
    expect(normalizeFixedCardIds(['a', 'b', 'd', 'zzz'], results, 2)).toEqual(['b']);
  });

  it('is empty for an active session whatever was written', () => {
    expect(normalizeFixedCardIds(['b'], results, null)).toEqual([]);
  });

  it('judges ids against the results it is given', () => {
    expect(normalizeFixedCardIds(['b', 'c'], results.slice(0, 2), 2)).toEqual(['b']);
  });
});

describe('prependSessionClearing', () => {
  it('prepends the new session and clears the original', () => {
    const original = reviewSession();
    const other = reviewSession({ id: 's2' });
    const replay = reviewSession({ id: 'new', completedAt: null, results: [] });

    const next = prependSessionClearing([original, other], replay, 's1', 100);

    expect(next.map(s => s.id)).toEqual(['new', 's1', 's2']);
    expect(next[1]).toEqual({ ...original, clearedAt: 100 });
    expect(next[2]).toBe(other);
    expect(next[0]).toBe(replay);
  });

  it('keeps the original fixedCardIds when clearing it', () => {
    const original = reviewSession({ fixedCardIds: ['b'] });
    const replay = reviewSession({ id: 'new', completedAt: null, results: [] });

    expect(prependSessionClearing([original], replay, 's1', 100)[1].fixedCardIds).toEqual(['b']);
  });

  it('leaves an active original as it is but still prepends', () => {
    const original = reviewSession({ completedAt: null });
    const replay = reviewSession({ id: 'new', completedAt: null, results: [] });

    const next = prependSessionClearing([original], replay, 's1', 100);

    expect(next).toEqual([replay, original]);
    expect(next[1]).toBe(original);
  });

  it('leaves an already cleared original as it is', () => {
    const original = reviewSession({ clearedAt: 50 });
    const replay = reviewSession({ id: 'new', completedAt: null, results: [] });

    expect(prependSessionClearing([original], replay, 's1', 100)[1]).toBe(original);
  });

  it('still prepends when the source id is unknown', () => {
    const original = reviewSession();
    const replay = reviewSession({ id: 'new', completedAt: null, results: [] });

    const next = prependSessionClearing([original], replay, 'missing', 100);

    expect(next).toEqual([replay, original]);
  });
});

describe('fixedCardIds and the statistics', () => {
  it('does not change getSessionTally or summaries', () => {
    const plain = reviewSession();
    const fixed = reviewSession({ fixedCardIds: ['b', 'c'] });

    expect(getSessionTally(fixed)).toEqual(getSessionTally(plain));
    expect(getMissedOrUnsureCardIds(fixed)).toEqual(getMissedOrUnsureCardIds(plain));
    expect(summarizeSessions([fixed])).toEqual(summarizeSessions([plain]));
    expect(summarizeSessionsByDeck([fixed])).toEqual(summarizeSessionsByDeck([plain]));
  });
});

// Local-time instants, so the tests hold in any time zone.
const at = (month: number, day: number, hour = 12): number =>
  new Date(2026, month, day, hour).getTime();

function loggedSession(
  id: string,
  deckId: string,
  startedAt: number,
  results: Session['results'],
  completedAt: number | null = null,
): Session {
  return {
    ...session(id, deckId, startedAt, completedAt),
    cardIds: results.map(result => result.cardId),
    results,
  };
}

describe('getDeckStatsSince', () => {
  it('equals getDeckStats for a null start when counters and log agree', () => {
    const decks = [deck('d1', [card('a', 1, 0), card('b', 0, 1, 1)]), deck('d2', [card('x', 1, 0)])];
    const sessions = [
      loggedSession('s1', 'd1', at(9, 1), [answered('a', 'ok', at(9, 1)), answered('b', 'okeish', at(9, 1))]),
      loggedSession('s2', 'd1', at(10, 2), [answered('b', 'notOk', at(10, 2))]),
      loggedSession('s3', 'd2', at(10, 3), [answered('x', 'ok', at(10, 3))]),
    ];

    const stats = getDeckStatsSince(decks, sessions, null);

    expect(stats.get('d1')).toEqual(getDeckStats(decks[0]));
    expect(stats.get('d2')).toEqual(getDeckStats(decks[1]));
  });

  it('splits a session that spans the start by each answer time, the start itself included', () => {
    const decks = [deck('d', [card('a', 0, 0), card('b', 0, 0), card('c', 0, 0)])];
    const since = new Date(2026, 10, 1).getTime();
    const sessions = [
      loggedSession('s', 'd', at(9, 31, 22), [
        answered('a', 'ok', since - 1),
        answered('b', 'notOk', since),
        answered('c', 'okeish', at(10, 5)),
      ]),
    ];

    const stats = getDeckStatsSince(decks, sessions, since).get('d');

    expect(stats).toMatchObject({ reviewCount: 2, okCount: 0, okeishCount: 1, notOkCount: 1 });
    expect(stats?.successRate).toBe(0);
  });

  it('gives a deck with no answers in the window its card count and a null rate', () => {
    const decks = [deck('d', [card('a', 0, 0), card('b', 0, 0)])];
    const sessions = [loggedSession('s', 'd', at(8, 1), [answered('a', 'ok', at(8, 1))])];

    const stats = getDeckStatsSince(decks, sessions, at(10, 1));

    expect(stats.get('d')).toEqual({
      cardCount: 2,
      reviewCount: 0,
      okCount: 0,
      okeishCount: 0,
      notOkCount: 0,
      successRate: null,
    });
  });

  it('leaves out answers for cards that are no longer in the deck', () => {
    const decks = [deck('d', [card('a', 0, 0)])];
    const sessions = [
      loggedSession('s', 'd', at(10, 1), [answered('gone', 'ok', at(10, 1)), answered('a', 'notOk', at(10, 1))]),
    ];

    const stats = getDeckStatsSince(decks, sessions, null).get('d');

    expect(stats).toMatchObject({ reviewCount: 1, okCount: 0, notOkCount: 1 });
  });

  it('ignores sessions of a deck that does not exist', () => {
    const decks = [deck('d', [card('a', 0, 0)])];
    const sessions = [loggedSession('s', 'missing', at(10, 1), [answered('a', 'ok', at(10, 1))])];

    const stats = getDeckStatsSince(decks, sessions, null);

    expect([...stats.keys()]).toEqual(['d']);
    expect(stats.get('d')?.reviewCount).toBe(0);
  });

  it('keeps each deck to its own sessions', () => {
    const decks = [deck('d1', [card('a', 0, 0)]), deck('d2', [card('a', 0, 0)])];
    const sessions = [loggedSession('s', 'd1', at(10, 1), [answered('a', 'ok', at(10, 1))])];

    const stats = getDeckStatsSince(decks, sessions, null);

    expect(stats.get('d1')?.reviewCount).toBe(1);
    expect(stats.get('d2')?.reviewCount).toBe(0);
  });
});

describe('getGlobalStatsSince', () => {
  it('equals getGlobalStats for a null start when counters and log agree', () => {
    const decks = [deck('d1', [card('a', 1, 0, 1)]), deck('d2', [card('x', 1, 1)])];
    const sessions = [
      loggedSession('s1', 'd1', at(10, 1), [answered('a', 'ok', at(10, 1))]),
      loggedSession('s2', 'd1', at(10, 2), [answered('a', 'okeish', at(10, 2))]),
      loggedSession('s3', 'd2', at(10, 3), [answered('x', 'ok', at(10, 3))]),
      loggedSession('s4', 'd2', at(10, 4), [answered('x', 'notOk', at(10, 4))]),
    ];

    expect(getGlobalStatsSince(decks, sessions, null)).toEqual(getGlobalStats(decks));
  });

  it('sums the windowed answers of every deck and keeps deck and card counts whole', () => {
    const decks = [deck('d1', [card('a', 0, 0), card('b', 0, 0)]), deck('d2', [card('x', 0, 0)])];
    const sessions = [
      loggedSession('s1', 'd1', at(8, 1), [answered('a', 'ok', at(8, 1)), answered('b', 'ok', at(10, 3))]),
      loggedSession('s2', 'd2', at(10, 4), [answered('x', 'okeish', at(10, 4))]),
    ];

    const stats = getGlobalStatsSince(decks, sessions, at(10, 1));

    expect(stats).toEqual({
      deckCount: 2,
      cardCount: 3,
      reviewCount: 2,
      okCount: 1,
      okeishCount: 1,
      notOkCount: 0,
      successRate: 50,
    });
  });

  it('leaves out answers of removed cards and missing decks', () => {
    const decks = [deck('d', [card('a', 0, 0)])];
    const sessions = [
      loggedSession('s1', 'd', at(10, 1), [answered('gone', 'ok', at(10, 1))]),
      loggedSession('s2', 'missing', at(10, 1), [answered('a', 'ok', at(10, 1))]),
    ];

    const stats = getGlobalStatsSince(decks, sessions, null);

    expect(stats.reviewCount).toBe(0);
    expect(stats.successRate).toBeNull();
  });
});

describe('countSessionsByDeckSince', () => {
  it('counts a session that started in the window, answered or not', () => {
    const sessions = [loggedSession('s', 'd', at(10, 5), [])];

    const counts = countSessionsByDeckSince(sessions, at(10, 1));

    expect(counts.get('d')).toEqual({ total: 1, active: 1 });
  });

  it('counts a session that started earlier but has an answer in the window', () => {
    const sessions = [loggedSession('s', 'd', at(9, 20), [answered('a', 'ok', at(10, 2))], at(10, 2))];

    const counts = countSessionsByDeckSince(sessions, at(10, 1));

    expect(counts.get('d')).toEqual({ total: 1, active: 0 });
  });

  it('leaves out a session that started and was answered before the window', () => {
    const sessions = [loggedSession('s', 'd', at(9, 20), [answered('a', 'ok', at(9, 21))])];

    const counts = countSessionsByDeckSince(sessions, at(10, 1));

    expect(counts.has('d')).toBe(false);
  });

  it('counts every session of a deck, split by deck, for a null start', () => {
    const sessions = [
      session('s1', 'd1', 10, 20),
      session('s2', 'd1', 30, null),
      session('s3', 'd2', 5, 6),
    ];

    const counts = countSessionsByDeckSince(sessions, null);

    expect(counts.get('d1')).toEqual({ total: 2, active: 1 });
    expect(counts.get('d2')).toEqual({ total: 1, active: 0 });
  });
});

describe('countSessionsSince', () => {
  it('matches summarizeSessions for a null start', () => {
    const sessions = [
      session('s1', 'd1', 10, 20, 50),
      session('s2', 'd1', 30, null),
      session('s3', 'd2', 5, 6),
    ];

    const summary = summarizeSessions(sessions);

    expect(countSessionsSince(sessions, null)).toEqual({
      total: summary.total,
      active: summary.active,
    });
  });

  it('counts sessions started in the window or answered in it, across decks', () => {
    const sessions = [
      loggedSession('new', 'd1', at(10, 5), []),
      loggedSession('carried', 'd2', at(9, 20), [answered('a', 'ok', at(10, 2))]),
      loggedSession('old', 'd2', at(9, 20), [answered('a', 'ok', at(9, 21))], at(9, 21)),
    ];

    expect(countSessionsSince(sessions, at(10, 1))).toEqual({ total: 2, active: 2 });
  });

  it('counts a cleared session like any other', () => {
    const sessions = [{ ...loggedSession('s', 'd', at(10, 5), [], at(10, 6)), clearedAt: at(10, 7) }];

    expect(countSessionsSince(sessions, at(10, 1))).toEqual({ total: 1, active: 0 });
  });
});
