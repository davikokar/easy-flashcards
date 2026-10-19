import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { Answer, Deck, Session } from '../types';
import { ParsedCard } from '../utils/csv';
import { loadDecks, saveDecks } from '../storage/decksStorage';
import { loadSessions, saveSessions } from '../storage/sessionsStorage';

type State = {
  decks: Deck[];
  sessions: Session[];
  isLoading: boolean;
  error: string | null;
};

type Action =
  | { type: 'loaded'; decks: Deck[]; sessions: Session[] }
  | { type: 'loadFailed'; message: string }
  | { type: 'addDeck'; deck: Deck }
  | { type: 'deleteDeck'; deckId: string }
  | { type: 'renameDeck'; deckId: string; name: string }
  | { type: 'startSession'; session: Session }
  | { type: 'recordAnswer'; sessionId: string; cardId: string; answer: Answer; at: number }
  | { type: 'deleteSession'; sessionId: string }
  | { type: 'resetDeckStats'; deckId: string };

const initialState: State = { decks: [], sessions: [], isLoading: true, error: null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'loaded':
      return { decks: action.decks, sessions: action.sessions, isLoading: false, error: null };
    case 'loadFailed':
      return { ...state, isLoading: false, error: action.message };
    case 'addDeck':
      return { ...state, decks: [action.deck, ...state.decks] };
    case 'deleteDeck':
      return {
        ...state,
        decks: state.decks.filter(deck => deck.id !== action.deckId),
        sessions: state.sessions.filter(session => session.deckId !== action.deckId),
      };
    case 'renameDeck':
      return {
        ...state,
        decks: state.decks.map(deck =>
          deck.id === action.deckId ? { ...deck, name: action.name } : deck,
        ),
        sessions: state.sessions.map(session =>
          session.deckId === action.deckId ? { ...session, deckName: action.name } : session,
        ),
      };
    case 'startSession':
      return { ...state, sessions: [action.session, ...state.sessions] };
    case 'recordAnswer': {
      const session = state.sessions.find(item => item.id === action.sessionId);
      if (!session || session.completedAt !== null) {
        return state;
      }
      const results = [...session.results, { cardId: action.cardId, answer: action.answer }];
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
                    notOkCount: card.notOkCount + (action.answer === 'notOk' ? 1 : 0),
                    lastReviewedAt: action.at,
                  }
                : card,
            ),
          };
        }),
      };
    }
    case 'deleteSession':
      return {
        ...state,
        sessions: state.sessions.filter(session => session.id !== action.sessionId),
      };
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
  getSession: (sessionId: string) => Session | undefined;
  addDeck: (input: { name: string; sourceFileName: string | null; cards: ParsedCard[] }) => Deck;
  deleteDeck: (deckId: string) => void;
  renameDeck: (deckId: string, name: string) => void;
  startSession: (deck: Deck, cardIds?: string[]) => Session;
  recordAnswer: (sessionId: string, cardId: string, answer: Answer) => void;
  deleteSession: (sessionId: string) => void;
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
    Promise.all([loadDecks(), loadSessions()])
      .then(([decks, sessions]) => {
        if (!cancelled) {
          dispatch({ type: 'loaded', decks, sessions });
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
    Promise.all([saveDecks(state.decks), saveSessions(state.sessions)]).catch(() => {
      // Persistence failures must not break the running session.
    });
  }, [state.decks, state.sessions, state.isLoading]);

  const addDeck = useCallback<DecksContextValue['addDeck']>(input => {
    const deck: Deck = {
      id: createId('deck'),
      name: input.name,
      sourceFileName: input.sourceFileName,
      createdAt: Date.now(),
      lastStudiedAt: null,
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

  const startSession = useCallback<DecksContextValue['startSession']>((deck, cardIds) => {
    const now = Date.now();
    const session: Session = {
      id: createId('session'),
      deckId: deck.id,
      deckName: deck.name,
      cardIds: cardIds ?? deck.cards.map(card => card.id),
      results: [],
      startedAt: now,
      updatedAt: now,
      completedAt: null,
    };
    dispatch({ type: 'startSession', session });
    return session;
  }, []);

  const value = useMemo<DecksContextValue>(
    () => ({
      ...state,
      getDeck: deckId => state.decks.find(deck => deck.id === deckId),
      getSession: sessionId => state.sessions.find(session => session.id === sessionId),
      addDeck,
      deleteDeck: deckId => dispatch({ type: 'deleteDeck', deckId }),
      renameDeck: (deckId, name) => dispatch({ type: 'renameDeck', deckId, name }),
      startSession,
      recordAnswer: (sessionId, cardId, answer) =>
        dispatch({ type: 'recordAnswer', sessionId, cardId, answer, at: Date.now() }),
      deleteSession: sessionId => dispatch({ type: 'deleteSession', sessionId }),
      resetDeckStats: deckId => dispatch({ type: 'resetDeckStats', deckId }),
    }),
    [state, addDeck, startSession],
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
