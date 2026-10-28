import {
  AnswerShares,
  AnswerTally,
  Card,
  Deck,
  DeckStats,
  Session,
  SessionStats,
  SessionSummary,
} from '../types';

export function cardReviewCount(card: Card): number {
  return card.okCount + card.okeishCount + card.notOkCount;
}

/** Only Ok earns credit; Okeish is a review that counts for nothing. */
export function successRate(
  okCount: number,
  okeishCount: number,
  notOkCount: number,
): number | null {
  const total = okCount + okeishCount + notOkCount;
  return total === 0 ? null : (okCount / total) * 100;
}

/** Each answer's percentage of all reviews (0-100), or null when nothing was reviewed. */
export function answerShares(tally: AnswerTally): AnswerShares | null {
  const total = tally.okCount + tally.okeishCount + tally.notOkCount;
  if (total === 0) {
    return null;
  }
  return {
    ok: (tally.okCount / total) * 100,
    okeish: (tally.okeishCount / total) * 100,
    notOk: (tally.notOkCount / total) * 100,
  };
}

/** Each answer's percentage of the session's cards (0-100); the shares sum to the progress filled. */
export function sessionProgressShares(tally: AnswerTally, cardCount: number): AnswerShares {
  if (cardCount <= 0) {
    return { ok: 0, okeish: 0, notOk: 0 };
  }
  const ok = (tally.okCount / cardCount) * 100;
  const okeish = (tally.okeishCount / cardCount) * 100;
  const notOk = (tally.notOkCount / cardCount) * 100;
  const sum = ok + okeish + notOk;
  // Scale down together so the proportions survive when the tally overshoots the card count.
  const scale = sum > 100 ? 100 / sum : 1;
  return { ok: ok * scale, okeish: okeish * scale, notOk: notOk * scale };
}

/** The ids that still exist in the deck, in the given order. */
export function resolvableCardIds(cardIds: string[], deck: Deck): string[] {
  const existing = new Set(deck.cards.map(card => card.id));
  return cardIds.filter(id => existing.has(id));
}

export function getDeckStats(deck: Deck): DeckStats {
  let okCount = 0;
  let okeishCount = 0;
  let notOkCount = 0;
  for (const card of deck.cards) {
    okCount += card.okCount;
    okeishCount += card.okeishCount;
    notOkCount += card.notOkCount;
  }
  return {
    cardCount: deck.cards.length,
    reviewCount: okCount + okeishCount + notOkCount,
    okCount,
    okeishCount,
    notOkCount,
    successRate: successRate(okCount, okeishCount, notOkCount),
  };
}

export function getGlobalStats(decks: Deck[]): DeckStats & { deckCount: number } {
  const totals = decks.reduce(
    (acc, deck) => {
      const stats = getDeckStats(deck);
      return {
        cardCount: acc.cardCount + stats.cardCount,
        okCount: acc.okCount + stats.okCount,
        okeishCount: acc.okeishCount + stats.okeishCount,
        notOkCount: acc.notOkCount + stats.notOkCount,
      };
    },
    { cardCount: 0, okCount: 0, okeishCount: 0, notOkCount: 0 },
  );

  return {
    deckCount: decks.length,
    cardCount: totals.cardCount,
    reviewCount: totals.okCount + totals.okeishCount + totals.notOkCount,
    okCount: totals.okCount,
    okeishCount: totals.okeishCount,
    notOkCount: totals.notOkCount,
    successRate: successRate(totals.okCount, totals.okeishCount, totals.notOkCount),
  };
}

export function isSessionActive(session: Session): boolean {
  return session.completedAt === null;
}

export function isSessionCleared(session: Session): boolean {
  return session.clearedAt !== null;
}

/** The sessions the Learn screen shows: everything not cleared; an active session is always listed. */
export function listedSessions(sessions: Session[]): Session[] {
  return sessions.filter(session => isSessionActive(session) || !isSessionCleared(session));
}

/** Completed sessions not yet cleared. */
export function clearableSessionCount(sessions: Session[]): number {
  return sessions.filter(session => !isSessionActive(session) && !isSessionCleared(session))
    .length;
}

/** Stamps every completed, uncleared session with `at`; returns the same array when none qualify. */
export function clearCompletedSessionsAt(sessions: Session[], at: number): Session[] {
  return markCleared(sessions, () => true, at);
}

/** Stamps one completed, uncleared session; returns the same array when nothing qualifies. */
export function clearSessionAt(sessions: Session[], sessionId: string, at: number): Session[] {
  return markCleared(sessions, session => session.id === sessionId, at);
}

function markCleared(
  sessions: Session[],
  isTarget: (session: Session) => boolean,
  at: number,
): Session[] {
  let changed = false;
  const next = sessions.map(session => {
    if (isSessionActive(session) || isSessionCleared(session) || !isTarget(session)) {
      return session;
    }
    changed = true;
    return { ...session, clearedAt: at };
  });
  return changed ? next : sessions;
}

export function getSessionTally(session: Session): AnswerTally {
  const tally: AnswerTally = { okCount: 0, okeishCount: 0, notOkCount: 0 };
  for (const result of session.results) {
    if (result.answer === 'ok') {
      tally.okCount += 1;
    } else if (result.answer === 'okeish') {
      tally.okeishCount += 1;
    } else {
      tally.notOkCount += 1;
    }
  }
  return tally;
}

/**
 * Where a swipe right from `viewIndex` lands: one answered card back, and from the oldest answered
 * card (index 0) round to the frontier. Null when nothing has been answered yet.
 */
export function previousReviewIndex(viewIndex: number, frontier: number): number | null {
  if (frontier <= 0) {
    return null;
  }
  return viewIndex > 0 ? viewIndex - 1 : frontier;
}

/** Cards answered Not Ok or Okeish, once each, in the order they were answered. */
export function getMissedOrUnsureCardIds(session: Session): string[] {
  const missed = session.results.filter(result => result.answer !== 'ok');
  return [...new Set(missed.map(result => result.cardId))];
}

export function getSessionStats(session: Session): SessionStats {
  const { okCount, okeishCount, notOkCount } = getSessionTally(session);
  return {
    cardCount: session.cardIds.length,
    answered: session.results.length,
    okCount,
    okeishCount,
    notOkCount,
    successRate: successRate(okCount, okeishCount, notOkCount),
    isActive: isSessionActive(session),
  };
}

export function summarizeSessions(sessions: Session[]): SessionSummary {
  let active = 0;
  let lastSessionAt: number | null = null;
  for (const session of sessions) {
    if (isSessionActive(session)) {
      active += 1;
    }
    if (lastSessionAt === null || session.startedAt > lastSessionAt) {
      lastSessionAt = session.startedAt;
    }
  }
  return {
    total: sessions.length,
    active,
    completed: sessions.length - active,
    lastSessionAt,
  };
}

/** One pass over the sessions so a deck list can render in linear time. */
export function summarizeSessionsByDeck(sessions: Session[]): Map<string, SessionSummary> {
  const byDeck = new Map<string, SessionSummary>();
  for (const session of sessions) {
    const summary = byDeck.get(session.deckId) ?? {
      total: 0,
      active: 0,
      completed: 0,
      lastSessionAt: null,
    };
    summary.total += 1;
    if (isSessionActive(session)) {
      summary.active += 1;
    } else {
      summary.completed += 1;
    }
    if (summary.lastSessionAt === null || session.startedAt > summary.lastSessionAt) {
      summary.lastSessionAt = session.startedAt;
    }
    byDeck.set(session.deckId, summary);
  }
  return byDeck;
}

export const EMPTY_SESSION_SUMMARY: SessionSummary = {
  total: 0,
  active: 0,
  completed: 0,
  lastSessionAt: null,
};

/** Active sessions first, most recently touched first within each group. */
export function sortSessions(sessions: Session[]): Session[] {
  return [...sessions].sort((a, b) => {
    const activeA = isSessionActive(a);
    const activeB = isSessionActive(b);
    if (activeA !== activeB) {
      return activeA ? -1 : 1;
    }
    return b.updatedAt - a.updatedAt;
  });
}

export function formatRate(rate: number | null): string {
  return rate === null ? '--' : `${Math.round(rate)}%`;
}

export function formatDate(timestamp: number | null): string {
  if (!timestamp) {
    return 'Never';
  }
  return new Date(timestamp).toLocaleDateString();
}

/**
 * Hardest first: lowest success rate, then most reviewed, then most Not Ok.
 * Unseen cards last. Remaining ties keep input order (Array.sort is stable).
 */
export function sortCardsByDifficulty(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => {
    const reviewsA = cardReviewCount(a);
    const reviewsB = cardReviewCount(b);
    if (reviewsA === 0 && reviewsB === 0) {
      return 0;
    }
    if (reviewsA === 0) {
      return 1;
    }
    if (reviewsB === 0) {
      return -1;
    }
    const rateA = (a.okCount / reviewsA) * 100;
    const rateB = (b.okCount / reviewsB) * 100;
    if (rateA !== rateB) {
      return rateA - rateB;
    }
    if (reviewsA !== reviewsB) {
      return reviewsB - reviewsA;
    }
    return b.notOkCount - a.notOkCount;
  });
}
