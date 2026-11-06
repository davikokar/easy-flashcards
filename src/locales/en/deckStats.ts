export const deckStats = {
  deckStatsScreen: {
    optionsA11yLabel: 'Options for {deckName} statistics',
    resetStatisticsMenuItem: 'Reset statistics',
    resetAlert: {
      title: 'Reset statistics',
      message: 'Clear all recorded results and sessions for "{deckName}"?',
    },
    notFound: {
      title: 'Deck not found',
      message: 'This deck has been deleted.',
    },
    cardPerformanceTitle: 'Card performance',
    subtitle: {
      one: '{count} card · {sort}',
      other: '{count} cards · {sort}',
    },
    subtitleNarrowed: {
      one: '{shown} of {count} cards · {sort}',
      other: '{shown} of {count} cards · {sort}',
    },
    sortButtonA11yLabel: 'Sort cards: {sort}',
    sortSheetTitle: 'Sort cards',
    noCards: {
      title: 'No cards yet',
      message: 'Add cards to this deck to see how each one performs.',
    },
    statusEmpty: {
      needsReview: {
        title: 'No cards need review',
        message: 'No card is below 40% success.',
      },
      learning: {
        title: 'No cards are learning',
        message: 'No card is between 40% and 70% success.',
      },
      mastered: {
        title: 'No mastered cards yet',
        message: 'A card is mastered at 70% success or more.',
      },
      new: {
        title: 'No new cards',
        message: 'Every card has been reviewed at least once.',
      },
    },
    showAllCardsButton: 'Show all cards',
    noMatches: {
      filteredMessage: 'Nothing matches "{query}" with the {status} filter.',
    },
  },
  deckIdentityRow: {
    categoryA11yLabel: 'Category: {name}',
  },
  deckMasteryCard: {
    successRateA11yLabel: 'Success rate: {rate}',
    successRateNoReviewsA11yLabel: 'Success rate: no reviews yet',
    successRateCaption: 'Success rate',
    answerTile: {
      ok: '{count} ok, {percent}',
      okeish: '{count} okeish, {percent}',
      notOk: '{count} not ok, {percent}',
    },
    answerTileNoReviews: {
      ok: '{count} ok, no reviews yet',
      okeish: '{count} okeish, no reviews yet',
      notOk: '{count} not ok, no reviews yet',
    },
    reviewsFigure: 'Reviews',
    sessionsFigure: 'Sessions',
    lastSessionFigure: 'Last session',
    figureA11yLabel: '{label}: {value}',
    changeChip: {
      none: 'No change since last session',
      up: '+{points} pts since last session',
      down: '-{points} pts since last session',
      noneA11yLabel: 'Success rate unchanged since the last session',
      upA11yLabel: {
        one: 'Success rate up {count} point since the last session',
        other: 'Success rate up {count} points since the last session',
      },
      downA11yLabel: {
        one: 'Success rate down {count} point since the last session',
        other: 'Success rate down {count} points since the last session',
      },
    },
  },
  cardStatsRow: {
    footerNeverReviewed: 'Never reviewed',
    footerReviewed: {
      one: '{count} review · Reviewed {date}',
      other: '{count} reviews · Reviewed {date}',
    },
    neverReviewedA11yLabel: 'Question: {question}. Answer: {answer}. {status}. Never reviewed.',
    reviewedA11yLabel: {
      one: 'Question: {question}. Answer: {answer}. {status}, success rate {rate}. {count} review: {ok} ok, {okeish} okeish, {notOk} not ok.',
      other:
        'Question: {question}. Answer: {answer}. {status}, success rate {rate}. {count} reviews: {ok} ok, {okeish} okeish, {notOk} not ok.',
    },
    reviewedOnA11yLabel: {
      one: 'Question: {question}. Answer: {answer}. {status}, success rate {rate}. {count} review: {ok} ok, {okeish} okeish, {notOk} not ok. Reviewed {date}.',
      other:
        'Question: {question}. Answer: {answer}. {status}, success rate {rate}. {count} reviews: {ok} ok, {okeish} okeish, {notOk} not ok. Reviewed {date}.',
    },
  },
  cardStatusChips: {
    groupA11yLabel: 'Card status',
    allChip: 'All',
    chipLabel: '{label} ({count})',
    chipA11yLabel: {
      one: '{label}, {count} card',
      other: '{label}, {count} cards',
    },
  },
  cardSearchField: {
    searchA11yLabel: 'Search cards',
    searchPlaceholder: 'Search questions and answers',
    clearA11yLabel: 'Clear card search',
  },
  sessionHistoryChart: {
    title: 'Session history',
    subtitleLatest: 'Latest {shown} of {total}',
    empty: {
      title: 'No sessions for this deck',
      message: 'Start one from the Decks tab and its results will show here.',
    },
    unansweredLegend: 'Unanswered',
    legendNote: "% of each session's cards",
    sessionA11yLabel: {
      one: 'Session on {date}: success rate {rate}, {answered} of {count} cards answered — {ok} ok, {okeish} okeish, {notOk} not ok',
      other:
        'Session on {date}: success rate {rate}, {answered} of {count} cards answered — {ok} ok, {okeish} okeish, {notOk} not ok',
    },
    sessionNoAnswersA11yLabel: {
      one: 'Session on {date}: success rate no answers yet, {answered} of {count} cards answered — {ok} ok, {okeish} okeish, {notOk} not ok',
      other:
        'Session on {date}: success rate no answers yet, {answered} of {count} cards answered — {ok} ok, {okeish} okeish, {notOk} not ok',
    },
  },
} as const;
