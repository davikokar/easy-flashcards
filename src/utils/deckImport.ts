import { isDefaultCategoryId } from './categories';
import { DECK_FILE_FORMAT, DECK_FILE_VERSION } from './deckExport';

export type DeckImportFormat = 'csv' | 'json';

export type ParsedCard = { question: string; answer: string };

export type ParsedDeckJson = {
  /** Null when the file has no usable title; the caller then names the deck after the file. */
  title: string | null;
  description: string;
  /** The category reference the file holds, unresolved; the reducer matches it against the categories. */
  categoryRef: string | null;
  cards: ParsedCard[];
  skippedCards: number;
};

export type DeckImportErrorCode =
  | 'emptyFile'
  | 'notADeck'
  | 'newerVersion'
  | 'noCards'
  | 'noHeader'
  | 'noUsableRows'
  | 'unreadable';

/** `message` is English, for diagnostics; the user is shown a catalogue message chosen by `code`. */
export class DeckImportError extends Error {
  readonly code: DeckImportErrorCode;

  constructor(code: DeckImportErrorCode, message: string) {
    super(message);
    this.name = 'DeckImportError';
    this.code = code;
  }
}

// Version 1 wrote `category` as an object; both versions are read.
const OLDEST_VERSION = 1;

export const EMPTY_FILE_MESSAGE = 'The selected file is empty.';
const NOT_A_DECK_MESSAGE =
  'This is not an Easy Flashcards deck file. Pick a JSON file exported from the app.';
export const NEWER_VERSION_MESSAGE =
  'This deck file was made by a newer version of Easy Flashcards. Update the app to import it.';
const NO_CARDS_MESSAGE = 'No usable cards found. Every card needs a question and an answer.';

export function stripBom(input: string): string {
  return input.charCodeAt(0) === 0xfeff ? input.slice(1) : input;
}

/** Chooses the parser from the content alone: file name and MIME type are unreliable on `content://` URIs. */
export function detectDeckFormat(raw: string): DeckImportFormat {
  const first = stripBom(raw).trimStart().charAt(0);
  return first === '{' || first === '[' ? 'json' : 'csv';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** A string is the reference itself; a version 1 object is read as its built-in id, else its name, else its id. */
function categoryRefOf(category: unknown): string | null {
  if (typeof category === 'string') {
    return category;
  }
  if (!isRecord(category)) {
    return null;
  }
  const { id, name } = category;
  if (typeof id === 'string' && isDefaultCategoryId(id)) {
    return id;
  }
  if (typeof name === 'string' && name.trim().length > 0) {
    return name;
  }
  return typeof id === 'string' ? id : null;
}

/** Reads the `easy-flashcards-deck` file, version 1 or 2, that `serializeDeckJson` writes. */
export function parseDeckJson(raw: string): ParsedDeckJson {
  const text = stripBom(raw);
  if (text.trim().length === 0) {
    throw new DeckImportError('emptyFile', EMPTY_FILE_MESSAGE);
  }

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new DeckImportError('notADeck', NOT_A_DECK_MESSAGE);
  }

  if (!isRecord(data) || data.format !== DECK_FILE_FORMAT || typeof data.version !== 'number') {
    throw new DeckImportError('notADeck', NOT_A_DECK_MESSAGE);
  }
  if (data.version > DECK_FILE_VERSION) {
    throw new DeckImportError('newerVersion', NEWER_VERSION_MESSAGE);
  }
  if (
    !Number.isInteger(data.version) ||
    data.version < OLDEST_VERSION ||
    !Array.isArray(data.cards)
  ) {
    throw new DeckImportError('notADeck', NOT_A_DECK_MESSAGE);
  }

  const cards: ParsedCard[] = [];
  let skippedCards = 0;
  for (const item of data.cards as unknown[]) {
    if (!isRecord(item) || typeof item.question !== 'string' || typeof item.answer !== 'string') {
      skippedCards += 1;
      continue;
    }
    const question = item.question.trim();
    const answer = item.answer.trim();
    if (question.length === 0 || answer.length === 0) {
      skippedCards += 1;
      continue;
    }
    cards.push({ question, answer });
  }

  if (cards.length === 0) {
    throw new DeckImportError('noCards', NO_CARDS_MESSAGE);
  }

  const title = typeof data.title === 'string' ? data.title.trim() : '';
  return {
    title: title.length > 0 ? title : null,
    description: typeof data.description === 'string' ? data.description.trim() : '',
    categoryRef: categoryRefOf(data.category),
    cards,
    skippedCards,
  };
}
