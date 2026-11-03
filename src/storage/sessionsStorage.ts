import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, SessionResult } from '../types';
import { readInverted } from '../utils/cardFaces';
import { normalizeFixedCardIds } from '../utils/stats';
import { parseStoredArray } from '../utils/storedArray';

const SESSIONS_KEY = '@easy-flashcards/sessions/v2';

// A result with no usable time reads as the session's start, never now, so it cannot drift into a window.
function normalizeResult(value: unknown, fallbackAnsweredAt: number): SessionResult | null {
  const result = value as Record<string, unknown> | null;
  if (!result || typeof result.cardId !== 'string') {
    return null;
  }
  return {
    cardId: result.cardId,
    answer: result.answer === 'notOk' || result.answer === 'okeish' ? result.answer : 'ok',
    answeredAt:
      typeof result.answeredAt === 'number' && Number.isFinite(result.answeredAt)
        ? result.answeredAt
        : fallbackAnsweredAt,
  };
}

/** Defensive normalisation: persisted data may come from an older app version. */
function normalizeSession(value: unknown): Session | null {
  const session = value as Record<string, unknown> | null;
  if (
    !session ||
    typeof session.id !== 'string' ||
    typeof session.deckId !== 'string' ||
    !Array.isArray(session.cardIds)
  ) {
    return null;
  }

  const startedAt = typeof session.startedAt === 'number' ? session.startedAt : Date.now();
  const cardIds = session.cardIds.filter((id): id is string => typeof id === 'string');
  const results = Array.isArray(session.results)
    ? session.results
        .map(item => normalizeResult(item, startedAt))
        .filter((r): r is SessionResult => r !== null)
    : [];

  const completedAt = typeof session.completedAt === 'number' ? session.completedAt : null;
  // An active session can never be hidden, whatever was written.
  const clearedAt =
    completedAt !== null && typeof session.clearedAt === 'number' && Number.isFinite(session.clearedAt)
      ? session.clearedAt
      : null;

  const cutResults = results.slice(0, cardIds.length);

  return {
    id: session.id,
    deckId: session.deckId,
    deckName: typeof session.deckName === 'string' ? session.deckName : 'Deck',
    cardIds,
    results: cutResults,
    startedAt,
    updatedAt: typeof session.updatedAt === 'number' ? session.updatedAt : startedAt,
    completedAt,
    clearedAt,
    fixedCardIds: normalizeFixedCardIds(session.fixedCardIds, cutResults, completedAt),
    inverted: readInverted(session.inverted),
  };
}

export async function loadSessions(): Promise<Session[]> {
  const raw = await AsyncStorage.getItem(SESSIONS_KEY);
  return parseStoredArray(raw).map(normalizeSession).filter((session): session is Session => session !== null);
}

export async function saveSessions(sessions: Session[]): Promise<void> {
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}
