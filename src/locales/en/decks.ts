export const decks = {
  decksScreen: {
    searchA11yLabel: 'Search decks',
    searchPlaceholder: 'Search decks',
    // Shown whenever loading the saved decks failed; the raw diagnostic is not displayed.
    loadError: 'Could not read saved decks.',
    addDeckA11yLabel: 'Add a deck',
    emptyTitle: 'No decks yet',
    emptyMessage: 'Use the + button to import a deck file and create your first deck.',
  },
  emptyDeckAlert: {
    title: 'Empty deck',
    message: 'This deck has no cards to learn.',
  },
  deleteDeckAlert: {
    title: 'Delete deck',
    message: 'Delete "{name}", its sessions and all of its statistics?',
  },
  addDeckMenu: {
    title: 'Add a deck',
    importItem: 'Import deck from file',
    manualItem: 'Add deck manually',
  },
  deckOptionsMenu: {
    startWithOptionsItem: 'Start session with options',
    editItem: 'Edit deck',
    exportItem: 'Export to file',
    deleteItem: 'Delete deck',
  },
  exportFormatMenu: {
    title: 'Export deck to file',
  },
  csvSeparatorMenu: {
    title: 'CSV separator',
    customItem: 'Custom…',
  },
  deckCard: {
    optionsA11yLabel: 'Options for {name}',
    activeCount: '{count} active',
    lastSession: 'Last: {date}',
    startA11yLabel: 'Start session for {name}',
  },
  masteryBar: {
    a11yLabel: 'Mastery: {summary}',
  },
  sessionSetupDialog: {
    title: 'Start session',
    invertedLabel: 'Inverted',
    invertedDescription: 'Show the answer first and the question on the back.',
    shuffleLabel: 'Shuffle',
    shuffleDescription: 'Study the cards in random order.',
  },
  customSeparatorDialog: {
    title: 'Custom separator',
    separatorLabel: 'Separator',
    separatorPlaceholder: 'For example |',
    errors: {
      empty: 'Enter one character.',
      tooLong: 'Use a single character.',
      reserved: 'Quotes, # and line breaks cannot be used.',
      whitespace: 'Spaces are not allowed. Use the Tab option for a tab.',
      alphanumeric: 'Letters and digits are not allowed.',
    },
  },
} as const;
