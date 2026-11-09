import { CommunityDeckFile, CommunityPayload, parseCommunityFile } from '../utils/communityDeck';

export const COMMUNITY_WORKER_URL = 'https://autumn-dew-fc59.davide-seddio.workers.dev';
const LISTING_URL = 'https://api.github.com/repos/davikokar/community-decks/contents/decks';

const REQUEST_TIMEOUT_MS = 20000;
// The listing makes one request per deck, so the catalogue is capped until an index file exists (ADR-0022).
const MAX_LISTED_DECKS = 100;
const FETCH_CONCURRENCY = 6;

export type CommunityErrorCode = 'network' | 'server' | 'notOwner' | 'invalid';

/** `message` is English, for diagnostics; the user is shown a catalogue message chosen by `code`. */
export class CommunityError extends Error {
  readonly code: CommunityErrorCode;

  constructor(code: CommunityErrorCode, message: string) {
    super(message);
    this.name = 'CommunityError';
    this.code = code;
  }
}

async function request(url: string, init?: RequestInit): Promise<Response> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(
      () => reject(new CommunityError('network', 'The community did not answer in time.')),
      REQUEST_TIMEOUT_MS,
    );
  });
  try {
    return await Promise.race([fetch(url, init), timeout]);
  } catch (requestError) {
    throw requestError instanceof CommunityError
      ? requestError
      : new CommunityError('network', 'The community could not be reached.');
  } finally {
    clearTimeout(timer);
  }
}

type ListingEntry = { name: string; downloadUrl: string };

function listingEntries(data: unknown): ListingEntry[] {
  if (!Array.isArray(data)) {
    return [];
  }
  const entries: ListingEntry[] = [];
  for (const item of data as unknown[]) {
    const entry = item as Record<string, unknown> | null;
    if (
      entry &&
      entry.type === 'file' &&
      typeof entry.name === 'string' &&
      entry.name.endsWith('.json') &&
      typeof entry.download_url === 'string'
    ) {
      entries.push({ name: entry.name, downloadUrl: entry.download_url });
    }
  }
  return entries;
}

/** Null when the file could not be fetched; a file that is not a deck is skipped, not an error. */
async function fetchDeckFile(entry: ListingEntry): Promise<CommunityDeckFile | null | 'skip'> {
  try {
    const response = await request(entry.downloadUrl);
    if (!response.ok) {
      return null;
    }
    const file = parseCommunityFile(await response.json());
    return file !== null && `${file.deck_id}.json` === entry.name.toLowerCase() ? file : 'skip';
  } catch (error) {
    return error instanceof CommunityError ? null : 'skip';
  }
}

export async function fetchCommunityDecks(): Promise<CommunityDeckFile[]> {
  const response = await request(LISTING_URL, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (response.status === 404) {
    return [];
  }
  if (!response.ok) {
    throw new CommunityError('server', `The deck list request failed with status ${response.status}.`);
  }
  const entries = listingEntries(await response.json()).slice(0, MAX_LISTED_DECKS);

  const results: (CommunityDeckFile | null | 'skip')[] = new Array(entries.length);
  let next = 0;
  const worker = async () => {
    while (next < entries.length) {
      const index = next;
      next += 1;
      results[index] = await fetchDeckFile(entries[index]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(FETCH_CONCURRENCY, entries.length) }, worker));

  if (entries.length > 0 && results.every(result => result === null)) {
    throw new CommunityError('network', 'No deck file could be fetched.');
  }
  return results
    .filter((result): result is CommunityDeckFile => result !== null && result !== 'skip')
    .sort((a, b) => a.title.localeCompare(b.title));
}

/** Creates or updates the deck's file through the Worker; resolves when the Worker accepted it. */
export async function publishCommunityDeck(payload: CommunityPayload): Promise<void> {
  const response = await request(COMMUNITY_WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    return;
  }
  if (response.status === 403) {
    throw new CommunityError('notOwner', 'The deck belongs to another author.');
  }
  if (response.status === 400 || response.status === 413 || response.status === 422) {
    throw new CommunityError('invalid', `The community rejected the deck (${response.status}).`);
  }
  throw new CommunityError('server', `The community service failed with status ${response.status}.`);
}
