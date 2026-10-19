import { Card, Deck, DeckStats } from '../types';

export function cardReviewCount(card: Card): number {
  return card.okCount + card.notOkCount;
}

export function successRate(okCount: number, notOkCount: number): number | null {
  const total = okCount + notOkCount;
  return total === 0 ? null : (okCount / total) * 100;
}

export function getDeckStats(deck: Deck): DeckStats {
  let okCount = 0;
  let notOkCount = 0;
  for (const card of deck.cards) {
    okCount += card.okCount;
    notOkCount += card.notOkCount;
  }
  return {
    cardCount: deck.cards.length,
    reviewCount: okCount + notOkCount,
    okCount,
    notOkCount,
    successRate: successRate(okCount, notOkCount),
  };
}

export function getGlobalStats(decks: Deck[]): DeckStats & { deckCount: number; sessionCount: number } {
  const totals = decks.reduce(
    (acc, deck) => {
      const stats = getDeckStats(deck);
      return {
        cardCount: acc.cardCount + stats.cardCount,
        okCount: acc.okCount + stats.okCount,
        notOkCount: acc.notOkCount + stats.notOkCount,
        sessionCount: acc.sessionCount + deck.sessionCount,
      };
    },
    { cardCount: 0, okCount: 0, notOkCount: 0, sessionCount: 0 },
  );

  return {
    deckCount: decks.length,
    cardCount: totals.cardCount,
    reviewCount: totals.okCount + totals.notOkCount,
    okCount: totals.okCount,
    notOkCount: totals.notOkCount,
    successRate: successRate(totals.okCount, totals.notOkCount),
    sessionCount: totals.sessionCount,
  };
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

/** Hardest first: lowest success rate, then most reviewed. Unseen cards last. */
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
    const rateA = successRate(a.okCount, a.notOkCount) ?? 100;
    const rateB = successRate(b.okCount, b.notOkCount) ?? 100;
    return rateA === rateB ? reviewsB - reviewsA : rateA - rateB;
  });
}
