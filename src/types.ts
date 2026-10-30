export type Card = {
  id: string;
  question: string;
  answer: string;
  okCount: number;
  okeishCount: number;
  notOkCount: number;
  lastReviewedAt: number | null;
};

export type Deck = {
  id: string;
  name: string;
  sourceFileName: string | null;
  createdAt: number;
  lastStudiedAt: number | null;
  cards: Card[];
};

export type Answer = 'ok' | 'okeish' | 'notOk';

export type SessionResult = {
  cardId: string;
  answer: Answer;
};

/** A learning session: one pass over a snapshot of a deck's cards. */
export type Session = {
  id: string;
  deckId: string;
  deckName: string;
  cardIds: string[];
  results: SessionResult[];
  startedAt: number;
  updatedAt: number;
  completedAt: number | null;
  /** When a completed session was hidden from the Learn list; null while listed. Never set on an active session. */
  clearedAt: number | null;
  /** Missed or unsure cards since answered Ok in a review of this session; always [] while active. */
  fixedCardIds: string[];
  /** Show each card's answer first; fixed when the session is created. */
  inverted: boolean;
};

/** A completed session's error review: hidden, still has cards to go over, or finished. */
export type ReviewState =
  | { kind: 'none' }
  | { kind: 'outstanding'; count: number }
  | { kind: 'done' };

export type DeckStats = {
  cardCount: number;
  reviewCount: number;
  okCount: number;
  okeishCount: number;
  notOkCount: number;
  successRate: number | null;
};

export type SessionSummary = {
  total: number;
  active: number;
  completed: number;
  lastSessionAt: number | null;
};

export type SessionStats = {
  cardCount: number;
  answered: number;
  okCount: number;
  okeishCount: number;
  notOkCount: number;
  successRate: number | null;
  isActive: boolean;
};

/** Per-answer counts for one session's results. */
export type AnswerTally = {
  okCount: number;
  okeishCount: number;
  notOkCount: number;
};

/** Each answer's percentage of all reviews (0-100). */
export type AnswerShares = {
  ok: number;
  okeish: number;
  notOk: number;
};
