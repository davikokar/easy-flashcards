# ADR-0001: The HTML renderer is owned in-repo

- Status: Active
- Date: 2026-10-26
- Decision makers: Project owner
- Recorded retrospectively: the choice was made during initial implementation.

## Context

Both sides of a flashcard are HTML. That is not a feature the app invented — it is what the CSV
decks people already have look like, with `<b>`, `<i>`, `<br>`, lists, headings, `<mark>`, `<code>`
and `<font color>` in the question and answer columns. Rendering a card therefore means rendering
a small subset of HTML.

The obvious answer was `react-native-render-html`, and the original brief named it. It does not
work on this project's React version: it sets `defaultProps` on function components, which React
19 ignores, so the library fails **at render time** rather than at install or at type-check. The
failure does not name `defaultProps` and does not read as a library incompatibility.

The input is also a file the user wrote or downloaded, so it is routinely malformed — unclosed
tags, stray closing tags, entities, inconsistent casing. Whatever renders it has to absorb that
rather than throw, because a single bad row must not take out the card.

## Decision

Own both halves.

- [`src/utils/html.ts`](../../../src/utils/html.ts) is a tolerant parser producing `HtmlNode[]`. It
  never throws: an unclosed tag is closed at end of input, a stray closing tag is dropped, and
  entities are decoded. It imports nothing from `react` or `react-native`.
- [`src/components/RichText.tsx`](../../../src/components/RichText.tsx) renders those nodes as
  **nested `<Text>` elements**, mapping each tag through a `TAG_STYLES` table. An unknown tag
  renders its children unstyled rather than failing.

The supported tag set is whatever `TAG_STYLES` and `RichText`'s special cases cover. Extending it
is a change to those two files and nothing else.

`react-native-render-html` must not be reintroduced.

## Alternatives Considered

- **`react-native-render-html`.** Named in the original brief. Broken on React 19 for the
  `defaultProps` reason above, with a failure mode that costs a session to diagnose.
- **Another HTML rendering library.** The viable ones render into `View` trees, which is heavier
  than this needs and would break the single-`Text` property the app depends on (see Consequences).
  None was worth a dependency for the dozen tags actually used.
- **Strip the HTML and render plain text.** Cheapest, and loses the emphasis that makes a card
  readable — bold on the key term in an answer is most of the formatting people actually use.
- **Convert to Markdown at import and use a Markdown renderer.** A lossy conversion plus a
  dependency, to end up with the same block-layout limits.

## Consequences

### Positive

- No dependency, and no exposure to the next breaking React change in one.
- The parser is pure TypeScript with no framework import, so it is unit-tested directly in
  [`__tests__/html.test.ts`](../../../__tests__/html.test.ts) — tolerance of malformed input
  included — with no renderer and no mocks.
- Rendering to a single nested `<Text>` means `numberOfLines` works on a whole card, which is what
  the Deck statistics screen's two-line previews need, and the card body scrolls as one block.
- The supported tag set is explicit and small, and extending it is a two-file change.

### Negative

- **There is no block layout.** A list is one line per item with a bullet glyph, not an indented
  block; `<blockquote>` is italic muted text; `<hr>` is box-drawing characters. There is no
  `<img>` and no `<table>`, and adding either would mean leaving the single-`Text` model.
- Tag support is whatever has been implemented. A deck using something outside the table renders
  unstyled rather than as intended, silently.
- Parser correctness is this project's problem now, including whatever HTML edge case the next
  user's file contains.

## References

- [`src/utils/html.ts`](../../../src/utils/html.ts),
  [`src/components/RichText.tsx`](../../../src/components/RichText.tsx)
- [`__tests__/html.test.ts`](../../../__tests__/html.test.ts)
- [ARCHITECTURE.md §6](../ARCHITECTURE.md)
- [AGENTS.md](../../../AGENTS.md) — *Dependency traps*
