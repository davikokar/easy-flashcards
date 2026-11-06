export const learn = {
  learnScreen: {
    searchA11yLabel: 'Search sessions',
    searchPlaceholder: 'Search sessions',
  },
  headerToolbar: {
    clearCompletedItem: 'Clear completed sessions',
  },
  emptyState: {
    noSessionsTitle: 'No sessions yet',
    noSessionsMessage:
      'Pick a deck and start a learning session; it will show up here until you finish it.',
    allClearedTitle: 'No sessions to show',
    allClearedMessage:
      'Cleared sessions still count in Statistics. Start a new session from a deck to see it here.',
    goToDecksButton: 'Go to decks',
  },
  deckUnavailableAlert: {
    title: 'Deck unavailable',
    message: 'This deck no longer exists or has no cards.',
  },
  clearCompletedSessionsAlert: {
    title: 'Clear completed sessions',
    nothingToClear: 'No completed sessions to clear.',
    message: {
      one: 'Remove {count} completed session from this list? Their results stay in Statistics.',
      other: 'Remove {count} completed sessions from this list? Their results stay in Statistics.',
    },
  },
  discardSessionAlert: {
    title: 'Discard session',
    message:
      'Discard the unfinished session for "{deckName}"? Its answers are also removed from Statistics.',
  },
  clearSessionAlert: {
    title: 'Clear session',
    message:
      'Remove the completed session for "{deckName}" from this list? Its results stay in Statistics.',
  },
  sessionOptionsMenu: {
    discardItem: 'Discard session',
    clearItem: 'Clear session',
  },
  sessionCard: {
    inProgressStatus: {
      one: 'In progress \u2014 {answered}/{count} card',
      other: 'In progress \u2014 {answered}/{count} cards',
    },
    completedStatus: {
      one: 'Completed \u2014 {count} card',
      other: 'Completed \u2014 {count} cards',
    },
    invertedPill: 'Inverted',
    invertedPillA11yLabel: 'Inverted session',
    optionsA11yLabel: 'Options for the {deckName} session',
    started: 'Started {date}',
    resumeButtonA11yLabel: 'Resume session for {deckName}',
    replayButtonA11yLabel: 'Replay session for {deckName}',
    reviewErrorsButtonA11yLabel: {
      one: 'Review the {count} missed or unsure card for {deckName}',
      other: 'Review the {count} missed or unsure cards for {deckName}',
    },
    reviewErrorsDoneA11yLabel: 'All missed or unsure cards fixed for {deckName}',
  },
  sessionResultsBar: {
    progressA11yLabel:
      'Progress: {answered} of {cardCount} answered \u2014 {ok} ok, {okeish} okeish, {notOk} not ok',
  },
} as const;
