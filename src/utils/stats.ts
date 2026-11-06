import {
  AnswerShares,
  AnswerTally,
  Card,
  CardSortOrder,
  CardStatus,
  Answer,
  Deck,
  DeckStats,
  RateBand,
  ReviewState,
  Session,
  SessionCount,
  SessionHistoryEntry,
  SessionResult,
  SessionSummary,
} from '../types';
import type { Translator } from './i18n';

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

/** Spoken form of the shares, e.g. "74% Ok, 18% Okeish, 8% Not ok"; "Not reviewed yet" for null. */
export function describeAnswerShares(shares: AnswerShares | null, t: Translator): string {
  if (!shares) {
    return t('answers.shares.notReviewed');
  }
  return t('answers.shares.summary', {
    ok: formatRate(shares.ok),
    okeish: formatRate(shares.okeish),
    notOk: formatRate(shares.notOk),
  });
}

// Absorbs float noise such as 70 / 100 * 10 = 7.000000000000001 when flooring and comparing.
const SEGMENT_EPSILON = 1e-9;

/**
 * Splits `count` ring segments among Ok, Okeish and Not ok in proportion to `shares`; the three
 * always add up to `count`. Leftovers go by largest remainder, ties to Ok, then Okeish, then Not ok.
 * Every share above 0 then gets at least one segment, taken from the largest, while `count` allows.
 */
export function allocateRingSegments(shares: AnswerShares | null, count: number): AnswerTally {
  const zeros: AnswerTally = { okCount: 0, okeishCount: 0, notOkCount: 0 };
  if (!shares || count <= 0) {
    return zeros;
  }
  // Index order is the tie-break order: Ok, Okeish, Not ok.
  const values = [shares.ok, shares.okeish, shares.notOk];
  const total = values.reduce((sum, value) => sum + value, 0);
  if (!(total > 0)) {
    return zeros;
  }

  const exact = values.map(value => (value / total) * count);
  const segments = exact.map(value => Math.floor(value + SEGMENT_EPSILON));
  const remainders = exact.map((value, index) => value - segments[index]);
  const leftover = count - segments.reduce((sum, value) => sum + value, 0);

  const byRemainder = [0, 1, 2]
    .filter(index => values[index] > 0)
    .sort((a, b) =>
      Math.abs(remainders[a] - remainders[b]) > SEGMENT_EPSILON
        ? remainders[b] - remainders[a]
        : a - b,
    );
  for (let i = 0; i < leftover && i < byRemainder.length; i++) {
    segments[byRemainder[i]] += 1;
  }

  const byShare = [0, 1, 2]
    .filter(index => values[index] > 0)
    .sort((a, b) => (values[a] !== values[b] ? values[b] - values[a] : a - b));
  for (const index of byShare) {
    if (segments[index] > 0) {
      continue;
    }
    let donor = 0;
    for (let i = 1; i < segments.length; i++) {
      if (segments[i] > segments[donor]) {
        donor = i;
      }
    }
    if (segments[donor] <= 1) {
      break;
    }
    segments[donor] -= 1;
    segments[index] += 1;
  }

  return { okCount: segments[0], okeishCount: segments[1], notOkCount: segments[2] };
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

/**
 * Each deck's stats from the answer log: answers at or after `since` (null = all time), counted
 * only while their deck exists and the card is still in it. One pass over the sessions; every deck
 * has an entry. With `since` null it equals `getDeckStats` whenever counters and log agree.
 */
export function getDeckStatsSince(
  decks: Deck[],
  sessions: Session[],
  since: number | null,
): Map<string, DeckStats> {
  const tallies = new Map<string, AnswerTally>();
  const cardIds = new Map<string, Set<string>>();
  for (const deck of decks) {
    tallies.set(deck.id, { okCount: 0, okeishCount: 0, notOkCount: 0 });
    cardIds.set(deck.id, new Set(deck.cards.map(card => card.id)));
  }

  for (const session of sessions) {
    const tally = tallies.get(session.deckId);
    const present = cardIds.get(session.deckId);
    if (!tally || !present) {
      continue;
    }
    for (const result of session.results) {
      if (!present.has(result.cardId) || !isAnsweredSince(result, since)) {
        continue;
      }
      if (result.answer === 'ok') {
        tally.okCount += 1;
      } else if (result.answer === 'okeish') {
        tally.okeishCount += 1;
      } else {
        tally.notOkCount += 1;
      }
    }
  }

  const stats = new Map<string, DeckStats>();
  for (const deck of decks) {
    const { okCount, okeishCount, notOkCount } = tallies.get(deck.id) as AnswerTally;
    stats.set(deck.id, {
      cardCount: deck.cards.length,
      reviewCount: okCount + okeishCount + notOkCount,
      okCount,
      okeishCount,
      notOkCount,
      successRate: successRate(okCount, okeishCount, notOkCount),
    });
  }
  return stats;
}

/** All decks together, from the answer log; `cardCount` and `deckCount` ignore `since`. */
export function getGlobalStatsSince(
  decks: Deck[],
  sessions: Session[],
  since: number | null,
): DeckStats & { deckCount: number } {
  let cardCount = 0;
  let okCount = 0;
  let okeishCount = 0;
  let notOkCount = 0;
  for (const stats of getDeckStatsSince(decks, sessions, since).values()) {
    cardCount += stats.cardCount;
    okCount += stats.okCount;
    okeishCount += stats.okeishCount;
    notOkCount += stats.notOkCount;
  }
  return {
    deckCount: decks.length,
    cardCount,
    reviewCount: okCount + okeishCount + notOkCount,
    okCount,
    okeishCount,
    notOkCount,
    successRate: successRate(okCount, okeishCount, notOkCount),
  };
}

function isAnsweredSince(result: SessionResult, since: number | null): boolean {
  return since === null || result.answeredAt >= since;
}

/** In a timeframe when started at or after `since`, or when any of its answers was. */
function isSessionSince(session: Session, since: number | null): boolean {
  return (
    since === null ||
    session.startedAt >= since ||
    session.results.some(result => isAnsweredSince(result, since))
  );
}

/** Per-deck session counts in a timeframe, in one pass; a deck with no session has no entry. */
export function countSessionsByDeckSince(
  sessions: Session[],
  since: number | null,
): Map<string, SessionCount> {
  const byDeck = new Map<string, SessionCount>();
  for (const session of sessions) {
    if (!isSessionSince(session, since)) {
      continue;
    }
    const count = byDeck.get(session.deckId) ?? { total: 0, active: 0 };
    count.total += 1;
    if (isSessionActive(session)) {
      count.active += 1;
    }
    byDeck.set(session.deckId, count);
  }
  return byDeck;
}

/** Session counts across every deck in a timeframe; with `since` null it matches `summarizeSessions`. */
export function countSessionsSince(sessions: Session[], since: number | null): SessionCount {
  const count: SessionCount = { total: 0, active: 0 };
  for (const session of sessions) {
    if (!isSessionSince(session, since)) {
      continue;
    }
    count.total += 1;
    if (isSessionActive(session)) {
      count.active += 1;
    }
  }
  return count;
}

export function isSessionActive(session: Session): boolean {
  return session.completedAt === null;
}

export function isSessionCleared(session: Session): boolean {
  return session.clearedAt !== null;
}

/** An answer is accepted only for an active session's next unanswered card, so a repeat is a no-op. */
export function canRecordAnswer(session: Session, cardId: string): boolean {
  return isSessionActive(session) && session.cardIds[session.results.length] === cardId;
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

function missedOrUnsureIds(results: SessionResult[]): string[] {
  const missed = results.filter(result => result.answer !== 'ok');
  return [...new Set(missed.map(result => result.cardId))];
}

/** Cards answered Not Ok or Okeish, once each, in the order they were answered. */
export function getMissedOrUnsureCardIds(session: Session): string[] {
  return missedOrUnsureIds(session.results);
}

/** Missed or unsure cards that still exist in the session's deck; [] when the deck is gone. */
export function getReviewableCardIds(session: Session, deck: Deck | undefined): string[] {
  return deck ? resolvableCardIds(getMissedOrUnsureCardIds(session), deck) : [];
}

/** Reviewable cards not yet fixed, in session order. */
export function getOutstandingReviewCardIds(session: Session, deck: Deck | undefined): string[] {
  const fixed = new Set(session.fixedCardIds);
  return getReviewableCardIds(session, deck).filter(id => !fixed.has(id));
}

/** None while active or with nothing reviewable; outstanding while any remain; done once all are fixed. */
export function getReviewState(session: Session, deck: Deck | undefined): ReviewState {
  if (isSessionActive(session)) {
    return { kind: 'none' };
  }
  const reviewable = getReviewableCardIds(session, deck);
  if (reviewable.length === 0) {
    return { kind: 'none' };
  }
  const outstanding = getOutstandingReviewCardIds(session, deck);
  return outstanding.length === 0
    ? { kind: 'done' }
    : { kind: 'outstanding', count: outstanding.length };
}

/**
 * The loader's rule for `fixedCardIds`: strings only, first occurrence wins, only ids missed or
 * unsure in `results`, and always [] for an active session. `results` must already be cut to the
 * session's card count.
 */
export function normalizeFixedCardIds(
  value: unknown,
  results: SessionResult[],
  completedAt: number | null,
): string[] {
  if (completedAt === null || !Array.isArray(value)) {
    return [];
  }
  const missed = new Set(missedOrUnsureIds(results));
  const fixed = value.filter((id): id is string => typeof id === 'string' && missed.has(id));
  return [...new Set(fixed)];
}

/**
 * Applies one review answer. Only Ok on a missed or unsure, not yet fixed card of a completed
 * session changes anything; every other case returns the same array.
 */
export function applyReviewAnswer(
  sessions: Session[],
  sessionId: string,
  cardId: string,
  answer: Answer,
): Session[] {
  if (answer !== 'ok') {
    return sessions;
  }
  const target = sessions.find(session => session.id === sessionId);
  if (
    !target ||
    isSessionActive(target) ||
    target.fixedCardIds.includes(cardId) ||
    !getMissedOrUnsureCardIds(target).includes(cardId)
  ) {
    return sessions;
  }
  return sessions.map(session =>
    session === target ? { ...session, fixedCardIds: [...session.fixedCardIds, cardId] } : session,
  );
}

/** Prepends a replay session and clears its source, with `clearSessionAt` semantics. */
export function prependSessionClearing(
  sessions: Session[],
  newSession: Session,
  sourceSessionId: string,
  at: number,
): Session[] {
  return [newSession, ...clearSessionAt(sessions, sourceSessionId, at)];
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

export function formatDate(timestamp: number | null, t: Translator): string {
  if (!timestamp) {
    return t('answers.dates.never');
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

/** Month and day only, in the device locale; "Never" for a null or zero timestamp like `formatDate`. */
export function formatShortDate(timestamp: number | null, t: Translator): string {
  if (!timestamp) {
    return t('answers.dates.never');
  }
  return new Date(timestamp).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' });
}

/** The colour band of a success rate: >= 70 high, >= 40 mid, else low; none when never reviewed. */
export function rateBand(rate: number | null): RateBand {
  if (rate === null) {
    return 'none';
  }
  return rate >= 70 ? 'high' : rate >= 40 ? 'mid' : 'low';
}

/** New when never answered; else by Ok-only rate, so an all-Okeish card needs review (ADR-0007). */
export function cardStatus(card: Card): CardStatus {
  if (cardReviewCount(card) === 0) {
    return 'new';
  }
  const band = rateBand(successRate(card.okCount, card.okeishCount, card.notOkCount));
  return band === 'high' ? 'mastered' : band === 'mid' ? 'learning' : 'needsReview';
}

export function countCardStatuses(cards: Card[]): Record<CardStatus, number> {
  const counts: Record<CardStatus, number> = { new: 0, needsReview: 0, learning: 0, mastered: 0 };
  for (const card of cards) {
    counts[cardStatus(card)] += 1;
  }
  return counts;
}

/** The latest answer time per card, from this deck's sessions (cleared too), for cards still in it. */
export function lastAnsweredAtByCard(deck: Deck, sessions: Session[]): Map<string, number> {
  const present = new Set(deck.cards.map(card => card.id));
  const latest = new Map<string, number>();
  for (const session of sessions) {
    if (session.deckId !== deck.id) {
      continue;
    }
    for (const result of session.results) {
      const known = latest.get(result.cardId);
      if (present.has(result.cardId) && (known === undefined || result.answeredAt > known)) {
        latest.set(result.cardId, result.answeredAt);
      }
    }
  }
  return latest;
}

/** The newest `limit` sessions of a deck by start time, oldest first; cleared and active included. */
export function getSessionHistory(
  sessions: Session[],
  deckId: string,
  limit: number,
): SessionHistoryEntry[] {
  if (limit <= 0) {
    return [];
  }
  return sessions
    .filter(session => session.deckId === deckId)
    .sort((a, b) => b.startedAt - a.startedAt)
    .slice(0, limit)
    .reverse()
    .map(session => {
      const tally = getSessionTally(session);
      return {
        sessionId: session.id,
        startedAt: session.startedAt,
        cardCount: session.cardIds.length,
        tally,
        shares: sessionProgressShares(tally, session.cardIds.length),
        rate: successRate(tally.okCount, tally.okeishCount, tally.notOkCount),
        active: isSessionActive(session),
      };
    });
}

/** A new array in the requested order; never-answered cards come last under 'recent'. */
export function sortCards(
  cards: Card[],
  order: CardSortOrder,
  lastAnsweredAt: Map<string, number>,
): Card[] {
  if (order === 'hardest') {
    return sortCardsByDifficulty(cards);
  }
  if (order === 'deck') {
    return [...cards];
  }
  return [...cards].sort((a, b) => {
    const timeA = lastAnsweredAt.get(a.id);
    const timeB = lastAnsweredAt.get(b.id);
    if (timeA === undefined || timeB === undefined) {
      return timeA === timeB ? 0 : timeA === undefined ? 1 : -1;
    }
    return timeB - timeA;
  });
}

/**
 * Percentage points the deck's Ok-only rate moved because of the session holding its newest
 * answer: the rate over the whole answer log minus the rate without that session. Only answers
 * on cards still in the deck count. Null unless two or more sessions have such answers.
 */
export function rateChangeSinceLastSession(deck: Deck, sessions: Session[]): number | null {
  const present = new Set(deck.cards.map(card => card.id));
  const deckSessions = sessions.filter(session => session.deckId === deck.id);

  let latest: Session | null = null;
  let latestAt = 0;
  for (const session of deckSessions) {
    for (const result of session.results) {
      if (!present.has(result.cardId)) {
        continue;
      }
      const isNewer =
        latest === null ||
        result.answeredAt > latestAt ||
        (result.answeredAt === latestAt && session.startedAt > latest.startedAt);
      if (isNewer) {
        latest = session;
        latestAt = result.answeredAt;
      }
    }
  }
  if (latest === null) {
    return null;
  }

  const rateOf = (list: Session[]) =>
    getDeckStatsSince([deck], list, null).get(deck.id)?.successRate ?? null;
  const rateWith = rateOf(deckSessions);
  const rateWithout = rateOf(deckSessions.filter(session => session !== latest));
  return rateWith === null || rateWithout === null ? null : rateWith - rateWithout;
}
