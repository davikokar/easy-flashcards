export const stats = {
  statsScreen: {
    searchA11yLabel: 'Search decks',
    searchPlaceholder: 'Search decks',
    aggregatedHeading: 'Aggregated stats',
    decksTile: {
      label: 'Decks',
      caption: 'In your library',
    },
    totalCardsTile: {
      label: 'Total cards',
      caption: 'Across all decks',
    },
    totalReviewsTile: {
      label: 'Total reviews',
      caption: {
        all: 'Answers recorded',
        month: 'Answers this month',
        week: 'Answers in the last 7 days',
      },
    },
    sessionsTile: {
      label: 'Sessions',
      caption: '{count} active',
    },
    tileA11yLabel: '{label}: {value}, {caption}',
    decksBreakdownHeading: 'Decks breakdown',
    deckCount: {
      one: '{count} deck',
      other: '{count} decks',
    },
    emptyState: {
      title: 'No statistics yet',
      message: 'Import a deck and study it; results will show up here.',
    },
  },
  masteryRing: {
    summaryA11yLabel: 'Success rate {rate}. {shares}. Counts: {counts}',
    caption: 'Success rate',
  },
  deckStatsCard: {
    summaryA11yLabel: '{name}: {shares}, {cards}, {sessions}, {reviews}, last {last}',
    openA11yHint: 'Opens per-card details',
    cardsLabel: 'Cards',
    sessionsLabel: 'Sessions',
    reviewsLabel: 'Reviews',
    lastLabel: 'Last',
  },
  timeframeChips: {
    groupA11yLabel: 'Timeframe',
  },
} as const;
