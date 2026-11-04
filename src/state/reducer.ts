import { Answer, AnswerTally, Category, Deck, Session, SessionResult } from '../types';
import { findCategory } from '../utils/categories';
import { SavedCardDraft, applyDeckEdit, reconcileSession, removedCardIds } from '../utils/deckEdit';
import {
  applyReviewAnswer,
  canRecordAnswer,
  clearCompletedSessionsAt,
  clearSessionAt,
  prependSessionClearing,
} from '../utils/stats';

export type State = {
  decks: Deck[];
  sessions: Session[];
  /** Custom categories only; the defaults are constants. */
  categories: Category[];
  isLoading: boolean;
  error: string | null;
};

export type Action =
  | { type: 'loaded'; decks: Deck[]; sessions: Session[]; categories: Category[] }
  | { type: 'loadFailed'; message: string }
  | { type: 'addDeck'; deck: Deck }
  | {
      type: 'updateDeck';
      deckId: string;
      name: string;
      description: string;
      categoryId: string | null;
      cards: SavedCardDraft[];
      at: number;
    }
  | { type: 'deleteDeck'; deckId: string }
  | { type: 'startSession'; session: Session }
  | { type: 'replaySession'; session: Session; sourceSessionId: string; at: number }
  | { type: 'recordAnswer'; sessionId: string; cardId: string; answer: Answer; at: number }
  | { type: 'recordReviewAnswer'; sessionId: string; cardId: string; answer: Answer }
  | { type: 'deleteSession'; sessionId: string }
  | { type: 'clearCompletedSessions'; at: number }
  | { type: 'clearSession'; sessionId: string; at: number }
  | { type: 'resetDeckStats'; deckId: string }
  | { type: 'addCategory'; category: Category }
  | { type: 'deleteCategory'; categoryId: string };

export const initialState: State = {
  decks: [],
  sessions: [],
  categories: [],
  isLoading: true,
  error: null,
};

/** Takes a discarded session's answers back out of the deck's card counters; never below zero. */
function withdrawAnswers(deck: Deck, results: SessionResult[]): Deck {
  const withdrawn = new Map<string, AnswerTally>();
  for (const result of results) {
    const tally = withdrawn.get(result.cardId) ?? { okCount: 0, okeishCount: 0, notOkCount: 0 };
    if (result.answer === 'ok') {
      tally.okCount += 1;
    } else if (result.answer === 'okeish') {
      tally.okeishCount += 1;
    } else {
      tally.notOkCount += 1;
    }
    withdrawn.set(result.cardId, tally);
  }
  return {
    ...deck,
    cards: deck.cards.map(card => {
      const tally = withdrawn.get(card.id);
      return tally
        ? {
            ...card,
            okCount: Math.max(0, card.okCount - tally.okCount),
            okeishCount: Math.max(0, card.okeishCount - tally.okeishCount),
            notOkCount: Math.max(0, card.notOkCount - tally.notOkCount),
          }
        : card;
    }),
  };
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'loaded':
      return {
        decks: action.decks,
        sessions: action.sessions,
        categories: action.categories,
        isLoading: false,
        error: null,
      };
    case 'loadFailed':
      return { ...state, isLoading: false, error: action.message };
    case 'addDeck': {
      const categoryId = findCategory(action.deck.categoryId, state.categories)?.id ?? null;
      return { ...state, decks: [{ ...action.deck, categoryId }, ...state.decks] };
    }
    case 'updateDeck': {
      const deck = state.decks.find(item => item.id === action.deckId);
      if (!deck) {
        return state;
      }
      const removed = removedCardIds(deck, action.cards);
      const categoryId = findCategory(action.categoryId, state.categories)?.id ?? null;
      return {
        ...state,
        decks: state.decks.map(item =>
          item === deck
            ? applyDeckEdit(deck, action.name, action.description, categoryId, action.cards)
            : item,
        ),
        sessions: state.sessions.flatMap(session => {
          if (session.deckId !== deck.id) {
            return [session];
          }
          const next = reconcileSession(session, action.name, removed, action.at);
          return next ? [next] : [];
        }),
      };
    }
    case 'deleteDeck':
      return {
        ...state,
        decks: state.decks.filter(deck => deck.id !== action.deckId),
        sessions: state.sessions.filter(session => session.deckId !== action.deckId),
      };
    case 'startSession':
      return { ...state, sessions: [action.session, ...state.sessions] };
    case 'replaySession':
      return {
        ...state,
        sessions: prependSessionClearing(
          state.sessions,
          action.session,
          action.sourceSessionId,
          action.at,
        ),
      };
    case 'recordReviewAnswer': {
      const sessions = applyReviewAnswer(
        state.sessions,
        action.sessionId,
        action.cardId,
        action.answer,
      );
      return sessions === state.sessions ? state : { ...state, sessions };
    }
    case 'recordAnswer': {
      const session = state.sessions.find(item => item.id === action.sessionId);
      if (!session || !canRecordAnswer(session, action.cardId)) {
        return state;
      }
      const results = [
        ...session.results,
        { cardId: action.cardId, answer: action.answer, answeredAt: action.at },
      ];
      const updatedSession: Session = {
        ...session,
        results,
        updatedAt: action.at,
        completedAt: results.length >= session.cardIds.length ? action.at : null,
      };
      return {
        ...state,
        sessions: state.sessions.map(item => (item.id === session.id ? updatedSession : item)),
        decks: state.decks.map(deck => {
          if (deck.id !== session.deckId) {
            return deck;
          }
          return {
            ...deck,
            lastStudiedAt: action.at,
            cards: deck.cards.map(card =>
              card.id === action.cardId
                ? {
                    ...card,
                    okCount: card.okCount + (action.answer === 'ok' ? 1 : 0),
                    okeishCount: card.okeishCount + (action.answer === 'okeish' ? 1 : 0),
                    notOkCount: card.notOkCount + (action.answer === 'notOk' ? 1 : 0),
                    lastReviewedAt: action.at,
                  }
                : card,
            ),
          };
        }),
      };
    }
    case 'deleteSession': {
      const session = state.sessions.find(item => item.id === action.sessionId);
      if (!session) {
        return state;
      }
      return {
        ...state,
        sessions: state.sessions.filter(item => item !== session),
        decks: state.decks.map(deck =>
          deck.id === session.deckId ? withdrawAnswers(deck, session.results) : deck,
        ),
      };
    }
    case 'clearCompletedSessions': {
      const sessions = clearCompletedSessionsAt(state.sessions, action.at);
      return sessions === state.sessions ? state : { ...state, sessions };
    }
    case 'clearSession': {
      const sessions = clearSessionAt(state.sessions, action.sessionId, action.at);
      return sessions === state.sessions ? state : { ...state, sessions };
    }
    case 'resetDeckStats':
      return {
        ...state,
        sessions: state.sessions.filter(session => session.deckId !== action.deckId),
        decks: state.decks.map(deck =>
          deck.id === action.deckId
            ? {
                ...deck,
                lastStudiedAt: null,
                cards: deck.cards.map(card => ({
                  ...card,
                  okCount: 0,
                  okeishCount: 0,
                  notOkCount: 0,
                  lastReviewedAt: null,
                })),
              }
            : deck,
        ),
      };
    case 'addCategory':
      return { ...state, categories: [...state.categories, action.category] };
    case 'deleteCategory': {
      // Defaults are not in state, so a default id falls through to the same state.
      if (!state.categories.some(category => category.id === action.categoryId)) {
        return state;
      }
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.categoryId),
        decks: state.decks.map(deck =>
          deck.categoryId === action.categoryId ? { ...deck, categoryId: null } : deck,
        ),
      };
    }
    default:
      return state;
  }
}
