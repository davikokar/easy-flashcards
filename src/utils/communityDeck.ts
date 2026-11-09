import type { Deck } from '../types';
import { sha256Hex } from './sha256';

// Imported by the Cloudflare Worker as well as the app: keep it free of react and react-native.

export type CommunityCard = { question: string; answer: string };

/** What the app POSTs to the Worker. `author_uuid` is a secret and is never written to GitHub. */
export type CommunityPayload = {
  deck_id: string;
  author_uuid: string;
  title: string;
  description: string;
  /** A built-in category's id or a custom category's name, as in a deck file; null for none. */
  category: string | null;
  cards: CommunityCard[];
};

/** What the Worker writes to `decks/<deck_id>.json`: the payload with the author's hash instead of the secret. */
export type CommunityDeckFile = Omit<CommunityPayload, 'author_uuid'> & { author_hash: string };

export const MAX_COMMUNITY_CARDS = 5000;
export const MAX_COMMUNITY_TITLE_LENGTH = 200;
export const MAX_COMMUNITY_DESCRIPTION_LENGTH = 2000;
export const MAX_COMMUNITY_CATEGORY_LENGTH = 100;
export const MAX_COMMUNITY_CARD_TEXT_LENGTH = 20000;

export type PayloadProblem =
  | 'notAnObject'
  | 'badDeckId'
  | 'badAuthorUuid'
  | 'badTitle'
  | 'badDescription'
  | 'badCategory'
  | 'noCards'
  | 'tooManyCards'
  | 'badCard';

export type PayloadResult =
  | { ok: true; payload: CommunityPayload }
  | { ok: false; problem: PayloadProblem };

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SHA256_HEX_PATTERN = /^[0-9a-f]{64}$/;

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_PATTERN.test(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** The value stored in the public file in place of the secret `author_uuid`. */
export function hashAuthor(authorUuid: string): string {
  return sha256Hex(authorUuid.toLowerCase());
}

/** Cards with a blank side are left out, as the importers do. */
export function buildCommunityPayload(
  deck: Pick<Deck, 'name' | 'description' | 'cards'>,
  deckId: string,
  authorUuid: string,
  categoryReference: string | null,
): CommunityPayload {
  return {
    deck_id: deckId,
    author_uuid: authorUuid,
    title: deck.name.trim(),
    description: deck.description.trim(),
    category: categoryReference,
    cards: deck.cards
      .filter(card => card.question.trim() !== '' && card.answer.trim() !== '')
      .map(card => ({ question: card.question, answer: card.answer })),
  };
}

/** Checks an untrusted POST body; ids come back lower-cased and the title and description trimmed. */
export function validateCommunityPayload(value: unknown): PayloadResult {
  if (!isRecord(value)) {
    return { ok: false, problem: 'notAnObject' };
  }
  const { deck_id, author_uuid, title, description, category, cards } = value;
  if (!isUuid(deck_id)) {
    return { ok: false, problem: 'badDeckId' };
  }
  if (!isUuid(author_uuid)) {
    return { ok: false, problem: 'badAuthorUuid' };
  }
  if (
    typeof title !== 'string' ||
    title.trim() === '' ||
    title.trim().length > MAX_COMMUNITY_TITLE_LENGTH
  ) {
    return { ok: false, problem: 'badTitle' };
  }
  if (
    description !== undefined &&
    (typeof description !== 'string' ||
      description.trim().length > MAX_COMMUNITY_DESCRIPTION_LENGTH)
  ) {
    return { ok: false, problem: 'badDescription' };
  }
  if (
    category !== undefined &&
    category !== null &&
    (typeof category !== 'string' || category.length > MAX_COMMUNITY_CATEGORY_LENGTH)
  ) {
    return { ok: false, problem: 'badCategory' };
  }
  if (!Array.isArray(cards) || cards.length === 0) {
    return { ok: false, problem: 'noCards' };
  }
  if (cards.length > MAX_COMMUNITY_CARDS) {
    return { ok: false, problem: 'tooManyCards' };
  }

  const checked: CommunityCard[] = [];
  for (const card of cards as unknown[]) {
    if (
      !isRecord(card) ||
      typeof card.question !== 'string' ||
      typeof card.answer !== 'string' ||
      card.question.trim() === '' ||
      card.answer.trim() === '' ||
      card.question.length > MAX_COMMUNITY_CARD_TEXT_LENGTH ||
      card.answer.length > MAX_COMMUNITY_CARD_TEXT_LENGTH
    ) {
      return { ok: false, problem: 'badCard' };
    }
    checked.push({ question: card.question, answer: card.answer });
  }

  return {
    ok: true,
    payload: {
      deck_id: deck_id.toLowerCase(),
      author_uuid: author_uuid.toLowerCase(),
      title: title.trim(),
      description: typeof description === 'string' ? description.trim() : '',
      category: typeof category === 'string' && category.trim() !== '' ? category : null,
      cards: checked,
    },
  };
}

export function toCommunityFile(payload: CommunityPayload): CommunityDeckFile {
  return {
    deck_id: payload.deck_id,
    author_hash: hashAuthor(payload.author_uuid),
    title: payload.title,
    description: payload.description,
    category: payload.category,
    cards: payload.cards,
  };
}

/** A stored file, or null when it is not one: used for the Worker's existing file and for each listed file. */
export function parseCommunityFile(value: unknown): CommunityDeckFile | null {
  if (!isRecord(value) || !isUuid(value.deck_id) || typeof value.title !== 'string') {
    return null;
  }
  // The first Worker wrote the author's uuid into the file; it reads as the hash it would have had.
  let authorHash: string | null = null;
  if (typeof value.author_hash === 'string' && SHA256_HEX_PATTERN.test(value.author_hash)) {
    authorHash = value.author_hash;
  } else if (isUuid(value.author_uuid)) {
    authorHash = hashAuthor(value.author_uuid);
  }
  if (authorHash === null) {
    return null;
  }
  if (!Array.isArray(value.cards)) {
    return null;
  }
  const cards: CommunityCard[] = [];
  for (const card of value.cards as unknown[]) {
    if (isRecord(card) && typeof card.question === 'string' && typeof card.answer === 'string') {
      cards.push({ question: card.question, answer: card.answer });
    }
  }
  if (value.title.trim() === '' || cards.length === 0) {
    return null;
  }
  return {
    deck_id: value.deck_id.toLowerCase(),
    author_hash: authorHash,
    title: value.title.trim(),
    description: typeof value.description === 'string' ? value.description.trim() : '',
    category: typeof value.category === 'string' && value.category.trim() !== '' ? value.category : null,
    cards,
  };
}

export function serializeCommunityFile(file: CommunityDeckFile): string {
  return `${JSON.stringify(file, null, 2)}\n`;
}

/** True when `authorUuid` is the secret the file's author hash was made from. */
export function isOwnedBy(file: Pick<CommunityDeckFile, 'author_hash'>, authorUuid: string): boolean {
  return file.author_hash === hashAuthor(authorUuid);
}

/** A new deck may be created by anyone; an existing one only by its author. */
export function mayWrite(existing: CommunityDeckFile | null, authorUuid: string): boolean {
  return existing === null || isOwnedBy(existing, authorUuid);
}

/** The input `addDeck` takes for a downloaded file; `categoryId` is the file's reference, resolved by the reducer. */
export function importOfCommunityFile(file: CommunityDeckFile) {
  return {
    name: file.title,
    description: file.description,
    categoryId: file.category,
    sourceFileName: null,
    cards: file.cards,
  };
}
