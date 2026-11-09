import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { loadAuthorUuid, saveAuthorUuid } from '../storage/identityStorage';

let pending: Promise<string> | null = null;

/** This device's author secret, created and stored on first use; concurrent calls share one creation. */
export function getOrCreateAuthorUuid(): Promise<string> {
  if (pending === null) {
    pending = (async () => {
      const stored = await loadAuthorUuid();
      if (stored !== null) {
        return stored;
      }
      const created = uuidv4();
      await saveAuthorUuid(created);
      return created;
    })().catch((error: unknown) => {
      pending = null;
      throw error;
    });
  }
  return pending;
}

/** A fresh UUID for a deck's first publication. */
export function newCommunityDeckId(): string {
  return uuidv4();
}
