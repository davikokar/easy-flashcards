import AsyncStorage from '@react-native-async-storage/async-storage';
import { Deck } from '../types';

const DECKS_KEY = '@easy-flashcards/decks/v1';

function isCardLike(value: unknown): boolean {
  const card = value as Record<string, unknown> | null;
  return (
    !!card && typeof card.id === 'string' && typeof card.question === 'string' && typeof card.answer === 'string'
  );
}

/** Defensive normalisation: persisted data may come from an older app version. */
function normalizeDeck(value: unknown): Deck | null {
  const deck = value as Record<string, unknown> | null;
  if (!deck || typeof deck.id !== 'string' || typeof deck.name !== 'string' || !Array.isArray(deck.cards)) {
    return null;
  }

  return {
    id: deck.id,
    name: deck.name,
    sourceFileName: typeof deck.sourceFileName === 'string' ? deck.sourceFileName : null,
    createdAt: typeof deck.createdAt === 'number' ? deck.createdAt : Date.now(),
    lastStudiedAt: typeof deck.lastStudiedAt === 'number' ? deck.lastStudiedAt : null,
    cards: deck.cards.filter(isCardLike).map(raw => {
      const card = raw as Record<string, unknown>;
      return {
        id: card.id as string,
        question: card.question as string,
        answer: card.answer as string,
        okCount: typeof card.okCount === 'number' ? card.okCount : 0,
        notOkCount: typeof card.notOkCount === 'number' ? card.notOkCount : 0,
        lastReviewedAt: typeof card.lastReviewedAt === 'number' ? card.lastReviewedAt : null,
      };
    }),
  };
}

export async function loadDecks(): Promise<Deck[]> {
  const raw = await AsyncStorage.getItem(DECKS_KEY);
  if (!raw) {
    return [];
  }
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    return [];
  }
  return parsed.map(normalizeDeck).filter((deck): deck is Deck => deck !== null);
}

export async function saveDecks(decks: Deck[]): Promise<void> {
  await AsyncStorage.setItem(DECKS_KEY, JSON.stringify(decks));
}

export async function clearDecks(): Promise<void> {
  await AsyncStorage.removeItem(DECKS_KEY);
}
