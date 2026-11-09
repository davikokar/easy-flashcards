import type { DeckStore } from './publish';

export type Env = {
  /** A fine-grained token with Contents read and write on the one repository. */
  GITHUB_TOKEN: string;
  /** owner/name, for example davikokar/community-decks. */
  GITHUB_REPO: string;
  /** The repository's default branch when unset. */
  GITHUB_BRANCH?: string;
};

function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

function fromBase64(encoded: string): string {
  const binary = atob(encoded.replace(/\s/g, ''));
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function githubStore(env: Env, fetcher: typeof fetch = fetch): DeckStore {
  const url = (path: string) =>
    `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${path}`;
  const headers = {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'easy-flashcards-community-worker',
  };

  return {
    async read(path) {
      const ref = env.GITHUB_BRANCH ? `?ref=${encodeURIComponent(env.GITHUB_BRANCH)}` : '';
      const response = await fetcher(`${url(path)}${ref}`, { headers });
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error(`GitHub read failed with status ${response.status}`);
      }
      const data = (await response.json()) as { sha?: unknown; content?: unknown };
      if (typeof data.sha !== 'string' || typeof data.content !== 'string') {
        throw new Error('GitHub returned an unexpected file shape');
      }
      return { sha: data.sha, text: fromBase64(data.content) };
    },

    async write(path, text, sha, message) {
      const response = await fetcher(url(path), {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          content: toBase64(text),
          ...(env.GITHUB_BRANCH ? { branch: env.GITHUB_BRANCH } : {}),
          ...(sha ? { sha } : {}),
        }),
      });
      // 409 and 422 both mean the file changed since it was read, or appeared meanwhile.
      if (response.status === 409 || response.status === 422) {
        return 'conflict';
      }
      if (!response.ok) {
        throw new Error(`GitHub write failed with status ${response.status}`);
      }
      return 'ok';
    },
  };
}
