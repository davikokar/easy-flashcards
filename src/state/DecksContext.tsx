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
import { DeckEdit } from '../utils/deckEdit';
import { loadDecks, saveDecks } from '../storage/decksStorage';
import { loadSessions, saveSessions } from '../storage/sessionsStorage';
import { State, initialState, reducer } from './reducer';

type SessionOptions = { inverted: boolean };

type DecksContextValue = State & {
  getDeck: (deckId: string) => Deck | undefined;
  getSession: (sessionId: string) => Session | undefined;
  addDeck: (input: { name: string; sourceFileName: string | null; cards: ParsedCard[] }) => Deck;
  updateDeck: (deckId: string, edit: DeckEdit) => void;
  deleteDeck: (deckId: string) => void;
  startSession: (deck: Deck, options: SessionOptions, cardIds?: string[]) => Session;
  replaySession: (
    sourceSessionId: string,
    deck: Deck,
    options: SessionOptions,
    cardIds: string[],
  ) => Session;
  recordAnswer: (sessionId: string, cardId: string, answer: Answer) => void;
  recordReviewAnswer: (sessionId: string, cardId: string, answer: Answer) => void;
  deleteSession: (sessionId: string) => void;
  clearCompletedSessions: () => void;
  clearSession: (sessionId: string) => void;
  resetDeckStats: (deckId: string) => void;
};

const DecksContext = createContext<DecksContextValue | null>(null);

function createId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function createSession(
  deck: Deck,
  options: SessionOptions,
  cardIds: string[] | undefined,
): Session {
  const now = Date.now();
  return {
    id: createId('session'),
    deckId: deck.id,
    deckName: deck.name,
    cardIds: cardIds ?? deck.cards.map(card => card.id),
    results: [],
    startedAt: now,
    updatedAt: now,
    completedAt: null,
    clearedAt: null,
    fixedCardIds: [],
    inverted: options.inverted,
  };
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
    // After a failed load the state is empty, so saving it would overwrite what is stored.
    if (state.isLoading || state.error !== null) {
      return;
    }
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      return;
    }
    Promise.all([saveDecks(state.decks), saveSessions(state.sessions)]).catch(() => {
      // Persistence failures must not break the running session.
    });
  }, [state.decks, state.sessions, state.isLoading, state.error]);

  const addDeck = useCallback<DecksContextValue['addDeck']>(input => {
    const deck: Deck = {
      id: createId('deck'),
      name: input.name,
      description: '',
      sourceFileName: input.sourceFileName,
      createdAt: Date.now(),
      lastStudiedAt: null,
      cards: input.cards.map(card => ({
        id: createId('card'),
        question: card.question,
        answer: card.answer,
        okCount: 0,
        okeishCount: 0,
        notOkCount: 0,
        lastReviewedAt: null,
      })),
    };
    dispatch({ type: 'addDeck', deck });
    return deck;
  }, []);

  const updateDeck = useCallback<DecksContextValue['updateDeck']>((deckId, edit) => {
    dispatch({
      type: 'updateDeck',
      deckId,
      name: edit.name,
      description: edit.description,
      cards: edit.cards.map(card => ({ ...card, id: card.id ?? createId('card') })),
      at: Date.now(),
    });
  }, []);

  const startSession = useCallback<DecksContextValue['startSession']>(
    (deck, options, cardIds) => {
      const session = createSession(deck, options, cardIds);
      dispatch({ type: 'startSession', session });
      return session;
    },
    [],
  );

  const replaySession = useCallback<DecksContextValue['replaySession']>(
    (sourceSessionId, deck, options, cardIds) => {
      const session = createSession(deck, options, cardIds);
      dispatch({ type: 'replaySession', session, sourceSessionId, at: session.startedAt });
      return session;
    },
    [],
  );

  const value = useMemo<DecksContextValue>(
    () => ({
      ...state,
      getDeck: deckId => state.decks.find(deck => deck.id === deckId),
      getSession: sessionId => state.sessions.find(session => session.id === sessionId),
      addDeck,
      updateDeck,
      deleteDeck: deckId => dispatch({ type: 'deleteDeck', deckId }),
      startSession,
      replaySession,
      recordAnswer: (sessionId, cardId, answer) =>
        dispatch({ type: 'recordAnswer', sessionId, cardId, answer, at: Date.now() }),
      recordReviewAnswer: (sessionId, cardId, answer) =>
        dispatch({ type: 'recordReviewAnswer', sessionId, cardId, answer }),
      deleteSession: sessionId => dispatch({ type: 'deleteSession', sessionId }),
      clearCompletedSessions: () => dispatch({ type: 'clearCompletedSessions', at: Date.now() }),
      clearSession: sessionId => dispatch({ type: 'clearSession', sessionId, at: Date.now() }),
      resetDeckStats: deckId => dispatch({ type: 'resetDeckStats', deckId }),
    }),
    [state, addDeck, updateDeck, startSession, replaySession],
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
