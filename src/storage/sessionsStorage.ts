import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, SessionResult } from '../types';

const SESSIONS_KEY = '@easy-flashcards/sessions/v1';

function normalizeResult(value: unknown): SessionResult | null {
  const result = value as Record<string, unknown> | null;
  if (!result || typeof result.cardId !== 'string') {
    return null;
  }
  return {
    cardId: result.cardId,
    answer: result.answer === 'notOk' ? 'notOk' : 'ok',
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
    ? session.results.map(normalizeResult).filter((r): r is SessionResult => r !== null)
    : [];

  return {
    id: session.id,
    deckId: session.deckId,
    deckName: typeof session.deckName === 'string' ? session.deckName : 'Deck',
    cardIds,
    results: results.slice(0, cardIds.length),
    startedAt,
    updatedAt: typeof session.updatedAt === 'number' ? session.updatedAt : startedAt,
    completedAt: typeof session.completedAt === 'number' ? session.completedAt : null,
  };
}

export async function loadSessions(): Promise<Session[]> {
  const raw = await AsyncStorage.getItem(SESSIONS_KEY);
  if (!raw) {
    return [];
  }
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    return [];
  }
  return parsed.map(normalizeSession).filter((session): session is Session => session !== null);
}

export async function saveSessions(sessions: Session[]): Promise<void> {
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export async function clearSessions(): Promise<void> {
  await AsyncStorage.removeItem(SESSIONS_KEY);
}
