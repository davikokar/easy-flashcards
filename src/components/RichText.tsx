import React, { useMemo } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { BLOCK_TAGS, HtmlNode, parseHtml } from '../utils/html';
import { colors } from '../theme';

type Props = {
  html: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
};

const TAG_STYLES: Record<string, TextStyle> = {
  b: { fontWeight: 'bold' },
  strong: { fontWeight: 'bold' },
  i: { fontStyle: 'italic' },
  em: { fontStyle: 'italic' },
  u: { textDecorationLine: 'underline' },
  ins: { textDecorationLine: 'underline' },
  s: { textDecorationLine: 'line-through' },
  strike: { textDecorationLine: 'line-through' },
  del: { textDecorationLine: 'line-through' },
  small: { fontSize: 13 },
  big: { fontSize: 22 },
  mark: { backgroundColor: colors.warning, color: '#121212' },
  code: { fontFamily: 'monospace', backgroundColor: colors.surfaceAlt },
  pre: { fontFamily: 'monospace' },
  h1: { fontSize: 26, fontWeight: 'bold' },
  h2: { fontSize: 23, fontWeight: 'bold' },
  h3: { fontSize: 20, fontWeight: 'bold' },
  h4: { fontSize: 18, fontWeight: 'bold' },
  h5: { fontSize: 16, fontWeight: 'bold' },
  h6: { fontSize: 15, fontWeight: 'bold' },
  blockquote: { fontStyle: 'italic', color: colors.textMuted },
  sub: { fontSize: 11 },
  sup: { fontSize: 11 },
};

function styleForElement(tag: string, attrs: Record<string, string>): TextStyle | undefined {
  const base = TAG_STYLES[tag];
  return attrs.color ? { ...base, color: attrs.color } : base;
}

type RenderContext = { ordered: boolean; preserveWhitespace: boolean };

function renderNodes(
  nodes: HtmlNode[],
  keyPrefix: string,
  context: RenderContext,
): React.ReactNode[] {
  const output: React.ReactNode[] = [];
  let itemNumber = 1;

  nodes.forEach((node, index) => {
    const key = `${keyPrefix}.${index}`;

    if (node.type === 'text') {
      const text = context.preserveWhitespace ? node.text : node.text.replace(/\s+/g, ' ');
      if (text.length > 0) {
        output.push(text);
      }
      return;
    }

    if (node.tag === 'br') {
      output.push('\n');
      return;
    }

    if (node.tag === 'hr') {
      output.push('\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n');
      return;
    }

    const childContext: RenderContext = {
      ordered: node.tag === 'ol' ? true : node.tag === 'ul' ? false : context.ordered,
      preserveWhitespace: context.preserveWhitespace || node.tag === 'pre',
    };

    const children = renderNodes(node.children, key, childContext);
    const bullet = node.tag === 'li' ? (context.ordered ? `${itemNumber++}. ` : '\u2022  ') : '';
    const leadingBreak = BLOCK_TAGS.has(node.tag) && output.length > 0 ? '\n' : '';

    output.push(
      <Text key={key} style={styleForElement(node.tag, node.attrs)}>
        {leadingBreak}
        {bullet}
        {children}
      </Text>,
    );
  });

  return output;
}

/**
 * Renders the HTML subset supported by flashcards (bold, italics, lists, line
 * breaks, ...) using nested react-native Text nodes.
 */
export default function RichText({ html, style, numberOfLines }: Props) {
  const content = useMemo(
    () => renderNodes(parseHtml(html ?? ''), 'n', { ordered: false, preserveWhitespace: false }),
    [html],
  );

  return (
    <Text style={style} numberOfLines={numberOfLines}>
      {content}
    </Text>
  );
}
