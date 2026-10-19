import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { Deck, SessionResult } from '../types';
import { ParsedCard } from '../utils/csv';
import { loadDecks, saveDecks } from '../storage/decksStorage';

type State = {
  decks: Deck[];
  isLoading: boolean;
  error: string | null;
};

type Action =
  | { type: 'loaded'; decks: Deck[] }
  | { type: 'loadFailed'; message: string }
  | { type: 'addDeck'; deck: Deck }
  | { type: 'deleteDeck'; deckId: string }
  | { type: 'renameDeck'; deckId: string; name: string }
  | { type: 'commitSession'; deckId: string; results: SessionResult[]; finishedAt: number }
  | { type: 'resetDeckStats'; deckId: string };

const initialState: State = { decks: [], isLoading: true, error: null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'loaded':
      return { decks: action.decks, isLoading: false, error: null };
    case 'loadFailed':
      return { ...state, isLoading: false, error: action.message };
    case 'addDeck':
      return { ...state, decks: [action.deck, ...state.decks] };
    case 'deleteDeck':
      return { ...state, decks: state.decks.filter(deck => deck.id !== action.deckId) };
    case 'renameDeck':
      return {
        ...state,
        decks: state.decks.map(deck =>
          deck.id === action.deckId ? { ...deck, name: action.name } : deck,
        ),
      };
    case 'commitSession': {
      if (action.results.length === 0) {
        return state;
      }
      return {
        ...state,
        decks: state.decks.map(deck => {
          if (deck.id !== action.deckId) {
            return deck;
          }
          const byCard = new Map<string, { ok: number; notOk: number }>();
          for (const result of action.results) {
            const entry = byCard.get(result.cardId) ?? { ok: 0, notOk: 0 };
            if (result.answer === 'ok') {
              entry.ok += 1;
            } else {
              entry.notOk += 1;
            }
            byCard.set(result.cardId, entry);
          }
          return {
            ...deck,
            sessionCount: deck.sessionCount + 1,
            lastStudiedAt: action.finishedAt,
            cards: deck.cards.map(card => {
              const entry = byCard.get(card.id);
              if (!entry) {
                return card;
              }
              return {
                ...card,
                okCount: card.okCount + entry.ok,
                notOkCount: card.notOkCount + entry.notOk,
                lastReviewedAt: action.finishedAt,
              };
            }),
          };
        }),
      };
    }
    case 'resetDeckStats':
      return {
        ...state,
        decks: state.decks.map(deck =>
          deck.id === action.deckId
            ? {
                ...deck,
                sessionCount: 0,
                lastStudiedAt: null,
                cards: deck.cards.map(card => ({
                  ...card,
                  okCount: 0,
                  notOkCount: 0,
                  lastReviewedAt: null,
                })),
              }
            : deck,
        ),
      };
    default:
      return state;
  }
}

type DecksContextValue = State & {
  getDeck: (deckId: string) => Deck | undefined;
  addDeck: (input: { name: string; sourceFileName: string | null; cards: ParsedCard[] }) => Deck;
  deleteDeck: (deckId: string) => void;
  renameDeck: (deckId: string, name: string) => void;
  commitSession: (deckId: string, results: SessionResult[]) => void;
  resetDeckStats: (deckId: string) => void;
};

const DecksContext = createContext<DecksContextValue | null>(null);

function createId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function DecksProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const hasLoaded = useRef(false);

  useEffect(() => {
    let cancelled = false;
    loadDecks()
      .then(decks => {
        if (!cancelled) {
          dispatch({ type: 'loaded', decks });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          dispatch({
            type: 'loadFailed',
            message: error instanceof Error ? error.message : 'Could not read saved decks.',
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (state.isLoading) {
      return;
    }
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      return;
    }
    saveDecks(state.decks).catch(() => {
      // Persistence failures must not break the running session.
    });
  }, [state.decks, state.isLoading]);

  const addDeck = useCallback<DecksContextValue['addDeck']>(input => {
    const deck: Deck = {
      id: createId('deck'),
      name: input.name,
      sourceFileName: input.sourceFileName,
      createdAt: Date.now(),
      lastStudiedAt: null,
      sessionCount: 0,
      cards: input.cards.map(card => ({
        id: createId('card'),
        question: card.question,
        answer: card.answer,
        okCount: 0,
        notOkCount: 0,
        lastReviewedAt: null,
      })),
    };
    dispatch({ type: 'addDeck', deck });
    return deck;
  }, []);

  const value = useMemo<DecksContextValue>(
    () => ({
      ...state,
      getDeck: deckId => state.decks.find(deck => deck.id === deckId),
      addDeck,
      deleteDeck: deckId => dispatch({ type: 'deleteDeck', deckId }),
      renameDeck: (deckId, name) => dispatch({ type: 'renameDeck', deckId, name }),
      commitSession: (deckId, results) =>
        dispatch({ type: 'commitSession', deckId, results, finishedAt: Date.now() }),
      resetDeckStats: deckId => dispatch({ type: 'resetDeckStats', deckId }),
    }),
    [state, addDeck],
  );

  return <DecksContext.Provider value={value}>{children}</DecksContext.Provider>;
}

export function useDecks(): DecksContextValue {
  const context = useContext(DecksContext);
  if (!context) {
    throw new Error('useDecks must be used inside a DecksProvider');
  }
  return context;
}
