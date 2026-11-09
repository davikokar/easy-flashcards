import {
  CommunityDeckFile,
  mayWrite,
  parseCommunityFile,
  serializeCommunityFile,
  toCommunityFile,
  validateCommunityPayload,
} from '../../src/utils/communityDeck';

// Characters, not bytes: the contents API only returns a file's text up to 1 MB.
export const MAX_BODY_CHARS = 400_000;

export type StoredFile = { sha: string; text: string };

/** The deck repository as the publisher needs it; the real one is GitHub's contents API. */
export interface DeckStore {
  read(path: string): Promise<StoredFile | null>;
  /** `sha` is the existing file's, or undefined when creating. */
  write(path: string, text: string, sha: string | undefined, message: string): Promise<'ok' | 'conflict'>;
}

export type PublishResult =
  | { status: 200; body: { ok: true; created: boolean } }
  | { status: 400 | 403 | 409 | 413; body: { error: string } };

function parseExisting(text: string): CommunityDeckFile | null {
  try {
    return parseCommunityFile(JSON.parse(text));
  } catch {
    return null;
  }
}

/** Creates `decks/<deck_id>.json`, or updates it only when the payload's author secret matches its stored hash. */
export async function publishDeck(bodyText: string, store: DeckStore): Promise<PublishResult> {
  if (bodyText.length > MAX_BODY_CHARS) {
    return { status: 413, body: { error: 'too_large' } };
  }
  let json: unknown;
  try {
    json = JSON.parse(bodyText);
  } catch {
    return { status: 400, body: { error: 'invalid_json' } };
  }
  const checked = validateCommunityPayload(json);
  if (!checked.ok) {
    return { status: 400, body: { error: checked.problem } };
  }

  const { payload } = checked;
  const path = `decks/${payload.deck_id}.json`;
  const existing = await store.read(path);
  if (existing !== null) {
    const current = parseExisting(existing.text);
    if (current === null) {
      return { status: 409, body: { error: 'existing_file_unreadable' } };
    }
    if (!mayWrite(current, payload.author_uuid)) {
      return { status: 403, body: { error: 'not_owner' } };
    }
  }

  const outcome = await store.write(
    path,
    serializeCommunityFile(toCommunityFile(payload)),
    existing?.sha,
    existing ? `Update deck ${payload.deck_id}` : `Add deck ${payload.deck_id}`,
  );
  if (outcome === 'conflict') {
    return { status: 409, body: { error: 'conflict' } };
  }
  return { status: 200, body: { ok: true, created: existing === null } };
}
