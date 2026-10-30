import { decodeEntities, parseHtml } from '../src/utils/html';

describe('parseHtml', () => {
  it('parses nested inline tags', () => {
    expect(parseHtml('a <b>bold <i>both</i></b>')).toEqual([
      { type: 'text', text: 'a ' },
      {
        type: 'element',
        tag: 'b',
        attrs: {},
        children: [
          { type: 'text', text: 'bold ' },
          { type: 'element', tag: 'i', attrs: {}, children: [{ type: 'text', text: 'both' }] },
        ],
      },
    ]);
  });

  it('treats br as a void element', () => {
    const nodes = parseHtml('line<br />next');
    expect(nodes).toHaveLength(3);
    expect(nodes[1]).toEqual({ type: 'element', tag: 'br', attrs: {}, children: [] });
  });

  it('reads attributes', () => {
    expect(parseHtml('<font color="red">x</font>')[0]).toMatchObject({
      tag: 'font',
      attrs: { color: 'red' },
    });
  });

  it('tolerates unclosed tags', () => {
    expect(() => parseHtml('<b>unclosed')).not.toThrow();
    expect(parseHtml('<b>unclosed')[0]).toMatchObject({ tag: 'b' });
  });

  it('ignores stray closing tags', () => {
    expect(parseHtml('text</b>')).toEqual([{ type: 'text', text: 'text' }]);
  });

  it('closes an unclosed li when the next li opens', () => {
    const [list] = parseHtml('<ul><li>a<li>b</ul>');

    expect(list).toMatchObject({ tag: 'ul' });
    expect((list as { children: unknown[] }).children).toHaveLength(2);
  });

  it('keeps an li inside a nested list as a child of its own list', () => {
    const [list] = parseHtml('<ul><li>a<ul><li>b</li></ul></li></ul>');

    expect((list as { children: unknown[] }).children).toHaveLength(1);
  });

  it('closes an unclosed p when the next p opens', () => {
    const nodes = parseHtml('<p>a<p>b');

    expect(nodes).toHaveLength(2);
    expect(nodes[1]).toMatchObject({ tag: 'p' });
  });
});

describe('decodeEntities', () => {
  it('decodes named and numeric entities', () => {
    expect(decodeEntities('a &amp; b &lt;c&gt; &#64; &#x41;')).toBe('a & b <c> @ A');
  });

  it('leaves unknown entities untouched', () => {
    expect(decodeEntities('&unknown;')).toBe('&unknown;');
  });
});
