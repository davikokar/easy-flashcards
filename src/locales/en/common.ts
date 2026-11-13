export const common = {
  actions: {
    back: 'Back',
    cancel: 'Cancel',
    clear: 'Clear',
    close: 'Close',
    delete: 'Delete',
    discard: 'Discard',
    export: 'Export',
    keepEditing: 'Keep editing',
    ok: 'OK',
    reset: 'Reset',
    save: 'Save',
    start: 'Start',
  },
  search: {
    noMatchesTitle: 'No matches',
    noMatchesMessage: 'Nothing matches "{query}".',
    clearSearchButton: 'Clear search',
  },
  // Accessibility actions on the title of a Deck card, Session card and Deck stats card.
  titleToggle: {
    expandA11yLabel: 'Show full title',
    collapseA11yLabel: 'Show shortened title',
  },
  counts: {
    decks: {
      one: '{count} deck',
      other: '{count} decks',
    },
    cards: {
      one: '{count} card',
      other: '{count} cards',
    },
    sessions: {
      one: '{count} session',
      other: '{count} sessions',
    },
    reviews: {
      one: '{count} review',
      other: '{count} reviews',
    },
  },
} as const;
