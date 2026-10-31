import { Card, Deck, Session } from '../types';
import { isSessionActive } from './stats';

/** A card as the editor holds it; `id` is null until the card is first saved. */
export type CardDraft = { id: string | null; question: string; answer: string };

export type DeckEdit = {
  name: string;
  description: string;
  categoryId: string | null;
  cards: CardDraft[];
};

/** A card as `updateDeck` receives it: every card has an id by then. */
export type SavedCardDraft = { id: string; question: string; answer: string };

export function draftsOf(deck: Deck): CardDraft[] {
  return deck.cards.map(card => ({ id: card.id, question: card.question, answer: card.answer }));
}

/** True when saving the edit would change anything about the deck. */
export function isDeckEditChanged(deck: Deck, edit: DeckEdit): boolean {
  if (
    edit.name !== deck.name ||
    edit.description !== deck.description ||
    edit.categoryId !== deck.categoryId
  ) {
    return true;
  }
  if (edit.cards.length !== deck.cards.length) {
    return true;
  }
  return edit.cards.some((draft, index) => {
    const card = deck.cards[index];
    return draft.id !== card.id || draft.question !== card.question || draft.answer !== card.answer;
  });
}

/** Ids of the deck's cards that the edit no longer lists. */
export function removedCardIds(deck: Deck, cards: { id: string | null }[]): string[] {
  const kept = new Set(cards.map(card => card.id));
  return deck.cards.filter(card => !kept.has(card.id)).map(card => card.id);
}

/** The first card, 1-based, missing its question or its answer; null when every card is complete. */
export function firstIncompleteCard(cards: CardDraft[]): number | null {
  const index = cards.findIndex(card => card.question.trim() === '' || card.answer.trim() === '');
  return index === -1 ? null : index + 1;
}

/** Existing cards keep their counters, new ones start at zero, and the list's order becomes the deck's. */
export function applyDeckEdit(
  deck: Deck,
  name: string,
  description: string,
  categoryId: string | null,
  cards: SavedCardDraft[],
): Deck {
  const existing = new Map(deck.cards.map(card => [card.id, card]));
  return {
    ...deck,
    name,
    description,
    categoryId,
    cards: cards.map((draft): Card => {
      const current = existing.get(draft.id);
      return current
        ? { ...current, question: draft.question, answer: draft.answer }
        : {
            id: draft.id,
            question: draft.question,
            answer: draft.answer,
            okCount: 0,
            okeishCount: 0,
            notOkCount: 0,
            lastReviewedAt: null,
          };
    }),
  };
}

/**
 * A session after its deck was edited: the new name, and for an active session the removed cards
 * dropped from its unanswered part. Null when that leaves it with no cards and no answers.
 */
export function reconcileSession(
  session: Session,
  name: string,
  removedIds: string[],
  at: number,
): Session | null {
  const renamed = session.deckName === name ? session : { ...session, deckName: name };
  if (!isSessionActive(session) || removedIds.length === 0) {
    return renamed;
  }
  const removed = new Set(removedIds);
  const answered = session.results.length;
  const cardIds = [
    ...session.cardIds.slice(0, answered),
    ...session.cardIds.slice(answered).filter(id => !removed.has(id)),
  ];
  if (cardIds.length === session.cardIds.length) {
    return renamed;
  }
  if (cardIds.length === 0) {
    return null;
  }
  return {
    ...renamed,
    cardIds,
    updatedAt: at,
    completedAt: answered >= cardIds.length ? at : null,
  };
}
