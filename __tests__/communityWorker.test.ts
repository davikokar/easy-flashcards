import { DeckStore, StoredFile, publishDeck } from '../worker/src/publish';
import { hashAuthor, parseCommunityFile } from '../src/utils/communityDeck';

const DECK_ID = '0b9f6d1c-5a3e-4f7b-8c2d-1e4a6b8c9d0e';
const AUTHOR = '7c1d2e3f-4a5b-4c6d-8e7f-9a0b1c2d3e4f';
const OTHER = '11111111-2222-4333-8444-555555555555';
const PATH = `decks/${DECK_ID}.json`;

function body(overrides: Record<string, unknown> = {}): string {
  return JSON.stringify({
    deck_id: DECK_ID,
    author_uuid: AUTHOR,
    title: 'German',
    description: '',
    category: null,
    cards: [{ question: 'Haus', answer: 'house' }],
    ...overrides,
  });
}

function memoryStore(files: Record<string, string> = {}) {
  const writes: { path: string; text: string; sha: string | undefined }[] = [];
  let conflict = false;
  const store: DeckStore = {
    async read(path): Promise<StoredFile | null> {
      return path in files ? { sha: `sha-of-${path}`, text: files[path] } : null;
    },
    async write(path, text, sha) {
      if (conflict) {
        return 'conflict';
      }
      writes.push({ path, text, sha });
      files[path] = text;
      return 'ok';
    },
  };
  return { store, writes, files, setConflict: () => (conflict = true) };
}

describe('publishDeck', () => {
  it('creates a new deck file holding the author hash and never the secret', async () => {
    const { store, writes } = memoryStore();

    const result = await publishDeck(body(), store);

    expect(result).toEqual({ status: 200, body: { ok: true, created: true } });
    expect(writes).toHaveLength(1);
    expect(writes[0].path).toBe(PATH);
    expect(writes[0].sha).toBeUndefined();
    expect(writes[0].text).not.toContain(AUTHOR);
    expect(parseCommunityFile(JSON.parse(writes[0].text))?.author_hash).toBe(hashAuthor(AUTHOR));
  });

  it('lets the author update the file, passing the existing sha', async () => {
    const { store, writes } = memoryStore();
    await publishDeck(body(), store);

    const result = await publishDeck(body({ title: 'German 2' }), store);

    expect(result).toEqual({ status: 200, body: { ok: true, created: false } });
    expect(writes[1].sha).toBe(`sha-of-${PATH}`);
    expect(JSON.parse(writes[1].text).title).toBe('German 2');
  });

  it('rejects an update from another author and leaves the file alone', async () => {
    const { store, writes, files } = memoryStore();
    await publishDeck(body(), store);
    const before = files[PATH];

    const result = await publishDeck(body({ author_uuid: OTHER, title: 'Hijacked' }), store);

    expect(result).toEqual({ status: 403, body: { error: 'not_owner' } });
    expect(writes).toHaveLength(1);
    expect(files[PATH]).toBe(before);
  });

  it('is not fooled by the case of the author uuid', async () => {
    const { store } = memoryStore();
    await publishDeck(body(), store);

    const result = await publishDeck(body({ author_uuid: AUTHOR.toUpperCase() }), store);

    expect(result.status).toBe(200);
  });

  it('migrates a file the first Worker wrote, for its author only', async () => {
    const legacy = JSON.stringify({
      deck_id: DECK_ID,
      author_uuid: AUTHOR,
      title: 'Old',
      description: '',
      category: null,
      cards: [{ question: 'a', answer: 'b' }],
    });
    const { store, writes, files } = memoryStore({ [PATH]: legacy });

    expect(await publishDeck(body({ author_uuid: OTHER }), store)).toEqual({
      status: 403,
      body: { error: 'not_owner' },
    });
    expect(await publishDeck(body(), store)).toEqual({ status: 200, body: { ok: true, created: false } });

    expect(writes).toHaveLength(1);
    expect(files[PATH]).not.toContain(AUTHOR);
    expect(files[PATH]).toContain(hashAuthor(AUTHOR));
  });

  it('refuses to overwrite a file it cannot read', async () => {
    const { store, writes } = memoryStore({ [PATH]: 'not json' });

    const result = await publishDeck(body(), store);

    expect(result).toEqual({ status: 409, body: { error: 'existing_file_unreadable' } });
    expect(writes).toHaveLength(0);
  });

  it('reports a write conflict', async () => {
    const { store, setConflict } = memoryStore();
    setConflict();

    expect(await publishDeck(body(), store)).toEqual({ status: 409, body: { error: 'conflict' } });
  });

  it.each([
    ['invalid_json', 'not json'],
    ['badDeckId', body({ deck_id: '../../etc/passwd' })],
    ['badAuthorUuid', body({ author_uuid: 'abc' })],
    ['noCards', body({ cards: [] })],
  ])('answers 400 %s without touching the store', async (error, text) => {
    const { store, writes } = memoryStore();

    expect(await publishDeck(text, store)).toEqual({ status: 400, body: { error } });
    expect(writes).toHaveLength(0);
  });

  it('answers 413 for an oversized body', async () => {
    const { store } = memoryStore();

    const result = await publishDeck('x'.repeat(400_001), store);

    expect(result.status).toBe(413);
  });
});
