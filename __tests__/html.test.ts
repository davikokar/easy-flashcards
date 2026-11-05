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

  it('decodes the accented letters used in language decks', () => {
    expect(decodeEntities('d&iacute;as, ma&ntilde;ana, Stra&szlig;e')).toBe('días, mañana, Straße');
  });
});

describe('htmlToPlainText', () => {
  it('strips tags and keeps the text', () => {
    expect(htmlToPlainText('a <b>bold <i>both</i></b> end')).toBe('a bold both end');
  });

  it('decodes entities', () => {
    expect(htmlToPlainText('Buenos d&iacute;as &amp; <b>adi&oacute;s</b>')).toBe('Buenos días & adiós');
  });

  it('puts a space at a br', () => {
    expect(htmlToPlainText('one<br>two<br />three')).toBe('one two three');
  });

  it('puts a space between blocks', () => {
    expect(htmlToPlainText('<p>one</p><p>two</p><ul><li>three</li><li>four</li></ul>')).toBe(
      'one two three four',
    );
  });

  it('collapses whitespace and trims', () => {
    expect(htmlToPlainText('  a \n\t b  <br> <br> c  ')).toBe('a b c');
  });

  it('does not use an attribute value as text', () => {
    expect(htmlToPlainText('<font color="red">x</font>')).toBe('x');
  });

  it('returns an empty string for empty or tag-only input', () => {
    expect(htmlToPlainText('')).toBe('');
    expect(htmlToPlainText('<br><b></b>')).toBe('');
  });

  it('does not throw on malformed html', () => {
    expect(() => htmlToPlainText('<b>unclosed <i>tags')).not.toThrow();
    expect(() => htmlToPlainText('text</b></p>')).not.toThrow();
    expect(() => htmlToPlainText('<b <i> & <')).not.toThrow();
    expect(htmlToPlainText('<b>unclosed <i>tags')).toBe('unclosed tags');
    expect(htmlToPlainText('text</b></p>')).toBe('text');
  });

  it('keeps a stray less-than as text', () => {
    expect(htmlToPlainText('1 < 2')).toBe('1 < 2');
  });
});
