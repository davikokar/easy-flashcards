export const editDeck = {
  deckNotFound: {
    title: 'Deck not found',
    message: 'This deck no longer exists.',
    backButton: 'Back to decks',
  },
  editDeckScreen: {
    titleLabel: 'Title',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'Optional',
    saveButtonA11yLabel: 'Save deck',
    addCardButton: 'Add card',
  },
  titleNeededAlert: {
    title: 'Title needed',
    message: 'Give the deck a title.',
  },
  cardIncompleteAlert: {
    title: 'Card incomplete',
    message: 'Card {number} needs both a question and an answer.',
  },
  removeCardsAlert: {
    title: 'Remove cards?',
    message: {
      one: '{count} card will be removed from the deck, together with its statistics.',
      other: '{count} cards will be removed from the deck, together with their statistics.',
    },
  },
  discardChangesAlert: {
    title: 'Discard changes?',
    messageEdit: 'Your edits to this deck have not been saved.',
    messageNew: 'This deck has not been saved.',
  },
  cardEditor: {
    title: 'Card {number}',
    removeButtonA11yLabel: 'Remove card {number}',
    questionLabel: 'Question',
    questionA11yLabel: 'Question for card {number}',
    answerLabel: 'Answer',
    answerA11yLabel: 'Answer for card {number}',
  },
  categoryField: {
    label: 'Category',
    a11yLabel: 'Category: {name}',
    a11yLabelNone: 'Category: none',
    a11yHint: 'Opens the category picker',
    noneValue: 'No category',
  },
  categoryPicker: {
    title: 'Category',
    groupA11yLabel: 'Category picker',
    noneTile: 'No category',
  },
} as const;
