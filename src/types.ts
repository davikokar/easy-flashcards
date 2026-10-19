export type Card = {
  id: string;
  question: string;
  answer: string;
  okCount: number;
  notOkCount: number;
  lastReviewedAt: number | null;
};

export type Deck = {
  id: string;
  name: string;
  sourceFileName: string | null;
  createdAt: number;
  lastStudiedAt: number | null;
  sessionCount: number;
  cards: Card[];
};

export type Answer = 'ok' | 'notOk';

export type SessionResult = {
  cardId: string;
  answer: Answer;
};

export type DeckStats = {
  cardCount: number;
  reviewCount: number;
  okCount: number;
  notOkCount: number;
  successRate: number | null;
};
