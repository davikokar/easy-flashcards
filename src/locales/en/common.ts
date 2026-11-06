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
  counts: {
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
