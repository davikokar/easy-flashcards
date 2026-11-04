export type DeckImportFormat = 'csv' | 'json';

export type ParsedCard = { question: string; answer: string };

export type ParsedDeckJson = {
  /** Null when the file has no usable title; the caller then names the deck after the file. */
  title: string | null;
  description: string;
  /** The id the file asks for, unresolved; the reducer matches it against the categories. */
  categoryId: string | null;
  cards: ParsedCard[];
  skippedCards: number;
};

export class DeckImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DeckImportError';
  }
}

const DECK_FORMAT = 'easy-flashcards-deck';
const SUPPORTED_VERSION = 1;

export const EMPTY_FILE_MESSAGE = 'The selected file is empty.';
const NOT_A_DECK_MESSAGE =
  'This is not an Easy Flashcards deck file. Pick a JSON file exported from the app.';
const NEWER_VERSION_MESSAGE =
  'This deck file was made by a newer version of Easy Flashcards. Update the app to import it.';
const NO_CARDS_MESSAGE = 'No usable cards found. Every card needs a question and an answer.';

export function stripBom(input: string): string {
  return input.charCodeAt(0) === 0xfeff ? input.slice(1) : input;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Reads the `easy-flashcards-deck` version 1 file that `serializeDeckJson` writes. */
export function parseDeckJson(raw: string): ParsedDeckJson {
  const text = stripBom(raw);
  if (text.trim().length === 0) {
    throw new DeckImportError(EMPTY_FILE_MESSAGE);
  }

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new DeckImportError(NOT_A_DECK_MESSAGE);
  }

  if (!isRecord(data) || data.format !== DECK_FORMAT || typeof data.version !== 'number') {
    throw new DeckImportError(NOT_A_DECK_MESSAGE);
  }
  if (data.version > SUPPORTED_VERSION) {
    throw new DeckImportError(NEWER_VERSION_MESSAGE);
  }
  if (data.version !== SUPPORTED_VERSION || !Array.isArray(data.cards)) {
    throw new DeckImportError(NOT_A_DECK_MESSAGE);
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
    throw new DeckImportError(NO_CARDS_MESSAGE);
  }

  const title = typeof data.title === 'string' ? data.title.trim() : '';
  return {
    title: title.length > 0 ? title : null,
    description: typeof data.description === 'string' ? data.description.trim() : '',
    categoryId:
      isRecord(data.category) && typeof data.category.id === 'string' ? data.category.id : null,
    cards,
    skippedCards,
  };
}
