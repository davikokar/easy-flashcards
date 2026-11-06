export const importExport = {
  defaultDeckName: 'Imported deck',
  // One message per DeckImportErrorCode, saying what that error's English `message` says.
  importErrors: {
    emptyFile: 'The selected file is empty.',
    notADeck: 'This is not an Easy Flashcards deck file. Pick a JSON file exported from the app.',
    newerVersion:
      'This deck file was made by a newer version of Easy Flashcards. Update the app to import it.',
    noCards: 'No usable cards found. Every card needs a question and an answer.',
    noHeader:
      'No header row found. The first line that is not blank or a "#" comment must name a "question" and an "answer" column, separated by a comma, a semicolon, a tab or one other symbol.',
    noUsableRows: 'No usable rows found. Every row needs a question and an answer.',
    unreadable: 'Could not read the selected file.',
  },
  importAlert: {
    successTitle: 'Deck imported',
    successMessage: {
      one: '"{name}" now has {count} card.',
      other: '"{name}" now has {count} cards.',
    },
    skippedRows: {
      one: '{count} incomplete row skipped.',
      other: '{count} incomplete rows skipped.',
    },
    skippedCards: {
      one: '{count} incomplete card skipped.',
      other: '{count} incomplete cards skipped.',
    },
    failedTitle: 'Import failed',
    // `details` is the error's own message, which comes from native code and may be English.
    failedWithDetails: 'The file could not be imported: {details}',
    failedUnknown: 'Unknown error while importing the file.',
  },
  exportAlert: {
    successTitle: 'Deck exported',
    savedAs: 'Saved as {name}.',
    saved: 'The deck was saved.',
    failedTitle: 'Export failed',
    deckGone: 'This deck no longer exists.',
    // Shown when the error has no message of its own; otherwise its message is shown as it is.
    failedFallback: 'Could not export the deck.',
  },
  // The CSV separator presets, with the symbol each one writes.
  separators: {
    comma: 'Comma (,)',
    semicolon: 'Semicolon (;)',
    tab: 'Tab',
  },
  sampleExport: {
    successTitle: 'Sample deck exported',
    partlyTitle: 'Sample deck partly exported',
    failedTitle: 'Export failed',
    savedAsOne: 'Saved as {name}.',
    savedAsTwo: 'Saved as {first} and {second}.',
    // `details` already ends in a full stop; `format` is the file format's own name, CSV or JSON.
    fileFailed: 'The {format} file could not be saved: {details}',
    fileNotSaved: 'The {format} file was not saved.',
    unknownError: 'Unknown error',
  },
} as const;
