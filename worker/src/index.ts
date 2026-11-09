import { Env, githubStore } from './github';
import { MAX_BODY_CHARS, publishDeck } from './publish';

function reply(status: number, body: unknown, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
      return reply(405, { error: 'method_not_allowed' }, { Allow: 'POST' });
    }
    if (!env.GITHUB_TOKEN || !env.GITHUB_REPO) {
      return reply(500, { error: 'not_configured' });
    }
    const declared = Number(request.headers.get('Content-Length') ?? 0);
    if (declared > MAX_BODY_CHARS * 4) {
      return reply(413, { error: 'too_large' });
    }

    try {
      const result = await publishDeck(await request.text(), githubStore(env));
      return reply(result.status, result.body);
    } catch {
      return reply(502, { error: 'github_unavailable' });
    }
  },
};
