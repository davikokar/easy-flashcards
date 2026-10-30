export type HtmlNode =
  | { type: 'text'; text: string }
  | { type: 'element'; tag: string; attrs: Record<string, string>; children: HtmlNode[] };

const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link']);

export const BLOCK_TAGS = new Set([
  'p',
  'div',
  'ul',
  'ol',
  'li',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'pre',
  'tr',
  'table',
  'section',
  'article',
  'hr',
]);

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: '\u00a0',
  hellip: '\u2026',
  mdash: '\u2014',
  ndash: '\u2013',
  laquo: '\u00ab',
  raquo: '\u00bb',
  deg: '\u00b0',
  eacute: '\u00e9',
  egrave: '\u00e8',
  agrave: '\u00e0',
  ccedil: '\u00e7',
  uuml: '\u00fc',
  ouml: '\u00f6',
  auml: '\u00e4',
};

export function decodeEntities(input: string): string {
  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (match, entity: string) => {
    if (entity[0] === '#') {
      const isHex = entity[1] === 'x' || entity[1] === 'X';
      const code = parseInt(isHex ? entity.slice(2) : entity.slice(1), isHex ? 16 : 10);
      if (Number.isNaN(code) || code < 0 || code > 0x10ffff) {
        return match;
      }
      return String.fromCodePoint(code);
    }
    const replacement = ENTITIES[entity.toLowerCase()];
    return replacement === undefined ? match : replacement;
  });
}

function parseAttributes(raw: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const pattern = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let match = pattern.exec(raw);
  while (match !== null) {
    const value = match[2] ?? match[3] ?? match[4] ?? '';
    attrs[match[1].toLowerCase()] = decodeEntities(value);
    match = pattern.exec(raw);
  }
  return attrs;
}

/**
 * Where an opening `li` or `p` ends the previous sibling the author never closed, or -1. An `li`
 * stops at a nested list; a `p` only closes over inline content.
 */
function implicitCloseIndex(stack: Array<{ tag: string }>, tag: string): number {
  if (tag !== 'li' && tag !== 'p') {
    return -1;
  }
  for (let i = stack.length - 1; i >= 0; i -= 1) {
    const open = stack[i].tag;
    if (open === tag) {
      return i;
    }
    if (tag === 'li' ? open === 'ul' || open === 'ol' : BLOCK_TAGS.has(open)) {
      return -1;
    }
  }
  return -1;
}

/**
 * Tolerant parser for the small HTML subset used in flashcards; unknown or
 * unbalanced tags never throw, they are kept as plain text or auto-closed.
 */
export function parseHtml(source: string): HtmlNode[] {
  const root: HtmlNode[] = [];
  const stack: Array<{ tag: string; children: HtmlNode[] }> = [];
  const current = () => (stack.length > 0 ? stack[stack.length - 1].children : root);

  const tagPattern = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
  let lastIndex = 0;
  let match = tagPattern.exec(source);

  const pushText = (text: string) => {
    if (text.length > 0) {
      current().push({ type: 'text', text: decodeEntities(text) });
    }
  };

  while (match !== null) {
    pushText(source.slice(lastIndex, match.index));
    const isClosing = match[1] === '/';
    const tag = match[2].toLowerCase();
    const rawAttrs = match[3] ?? '';

    if (isClosing) {
      const openIndex = stack.map(entry => entry.tag).lastIndexOf(tag);
      if (openIndex !== -1) {
        while (stack.length > openIndex) {
          stack.pop();
        }
      }
    } else if (VOID_TAGS.has(tag) || rawAttrs.trimEnd().endsWith('/')) {
      current().push({
        type: 'element',
        tag,
        attrs: parseAttributes(rawAttrs.replace(/\/\s*$/, '')),
        children: [],
      });
    } else {
      const implicitIndex = implicitCloseIndex(stack, tag);
      if (implicitIndex !== -1) {
        stack.length = implicitIndex;
      }
      const element: HtmlNode = {
        type: 'element',
        tag,
        attrs: parseAttributes(rawAttrs),
        children: [],
      };
      current().push(element);
      stack.push({ tag, children: element.children });
    }

    lastIndex = tagPattern.lastIndex;
    match = tagPattern.exec(source);
  }

  pushText(source.slice(lastIndex));
  return root;
}
