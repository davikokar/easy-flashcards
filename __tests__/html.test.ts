import { decodeEntities, htmlToPlainText, parseHtml } from '../src/utils/html';

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
});

describe('decodeEntities', () => {
  it('decodes named and numeric entities', () => {
    expect(decodeEntities('a &amp; b &lt;c&gt; &#64; &#x41;')).toBe('a & b <c> @ A');
  });

  it('leaves unknown entities untouched', () => {
    expect(decodeEntities('&unknown;')).toBe('&unknown;');
  });
});

describe('htmlToPlainText', () => {
  it('strips tags and collapses whitespace', () => {
    expect(htmlToPlainText('<p>Hello <b>world</b></p><p>Bye</p>')).toBe('Hello world Bye');
  });
});
