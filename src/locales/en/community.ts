export const community = {
  title: 'Community decks',
  searchPlaceholder: 'Search community decks',
  retryButton: 'Try again',
  emptyTitle: 'No community decks yet',
  emptyMessage: 'Share one of your decks from its options menu to start the collection.',
  loadFailedTitle: 'Could not load decks',
  yoursBadge: 'Yours',
  downloadA11yLabel: 'Download {name}',
  shareAlert: {
    confirmTitle: 'Share to community',
    confirmMessage:
      'Publish "{name}" so anyone can download it? If you shared this deck before, the shared copy is updated.',
    confirmButton: 'Share',
    noCardsMessage: 'Add at least one card before sharing this deck.',
    successTitle: 'Deck shared',
    successMessage: '"{name}" is now in the community decks.',
    failedTitle: 'Sharing failed',
  },
  errors: {
    network: 'The community could not be reached. Check your internet connection and try again.',
    server: 'The community service had a problem. Try again later.',
    notOwner: 'This deck was shared from another device, so it cannot be updated from this one.',
    invalid: 'This deck cannot be shared. Check that it has a title and complete cards.',
  },
} as const;
