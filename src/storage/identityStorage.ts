import AsyncStorage from '@react-native-async-storage/async-storage';
import { isUuid } from '../utils/communityDeck';

const IDENTITY_KEY = '@easy-flashcards/identity/v1';

/** Never throws on bad data: a missing, corrupt or wrongly shaped value reads as no identity. */
export async function loadAuthorUuid(): Promise<string | null> {
  const raw = await AsyncStorage.getItem(IDENTITY_KEY);
  if (raw === null) {
    return null;
  }
  try {
    const value = JSON.parse(raw) as Record<string, unknown> | null;
    const authorUuid = value?.authorUuid;
    return isUuid(authorUuid) ? authorUuid : null;
  } catch {
    return null;
  }
}

export async function saveAuthorUuid(authorUuid: string): Promise<void> {
  await AsyncStorage.setItem(IDENTITY_KEY, JSON.stringify({ authorUuid }));
}
