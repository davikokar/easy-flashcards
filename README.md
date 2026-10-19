# Easy Flashcards

Android flashcards app built with React Native. Import decks from local CSV files, study them
card by card, and track how well you know each card.

## Features

- **Bottom tab navigation** with a *Decks* tab (import and study) and a *Statistics* tab.
- **CSV import** from any local file through the Android system file picker.
  - Columns `Question` and `Answer` (header matching is case-insensitive).
  - Delimiters: semicolon (`;`) or tab (`\t`).
  - BOM and CRLF tolerant; incomplete rows are skipped and reported.
- **Study sessions** with an animated card flip, `Ok` / `Not Ok` feedback, progress indicator and
  an end-of-session summary that offers to replay only the missed cards.
- **HTML formatting** on both sides of a card: `<b>`, `<i>`, `<u>`, `<s>`, `<br />`, `<p>`,
  `<ul>`/`<ol>`/`<li>`, `<h1>`-`<h6>`, `<code>`, `<mark>`, `<font color="...">`, HTML entities.
- **Statistics** persisted locally: per-deck review counts, success rate and session counts, plus a
  per-card drill-down sorted hardest first.
- Everything is stored on-device with AsyncStorage; results are saved when a session ends,
  including when you leave the session early.

## CSV format

```csv
Question;Answer
This is the question; This is the <b>answer</b>
```

A ready-to-use example lives in [samples/sample-deck.csv](samples/sample-deck.csv). Copy it to the
device (or to the emulator's Downloads folder) and import it from the *Decks* tab.

## Getting started

```bash
npm install
npm start           # Metro bundler
npm run android     # build and run on a connected device/emulator
```

Quality gates:

```bash
npm run typecheck
npm run lint
npm test
```

### Requirements

- Node 22+
- JDK 17
- Android SDK with platform 37 and the NDK version declared in [android/build.gradle](android/build.gradle)

## Project structure

| Path | Purpose |
| --- | --- |
| [src/navigation](src/navigation) | Bottom tabs + per-tab native stacks |
| [src/screens](src/screens) | Decks, Study, Statistics and per-deck statistics screens |
| [src/components](src/components) | Flip card, HTML renderer, buttons, progress bars |
| [src/state/DecksContext.tsx](src/state/DecksContext.tsx) | Context + reducer store, auto-persisting |
| [src/storage/decksStorage.ts](src/storage/decksStorage.ts) | AsyncStorage read/write with defensive normalisation |
| [src/services/importDeck.ts](src/services/importDeck.ts) | Document picker + file read + CSV parsing |
| [src/utils](src/utils) | CSV parsing, HTML parsing, statistics helpers |
| [\_\_tests\_\_](__tests__) | Unit tests for the CSV, HTML and statistics logic |

## Notes on dependencies

- `react-native-document-picker` is deprecated; its maintained successor
  `@react-native-documents/picker` is used instead.
- `react-native-render-html` relies on `defaultProps` for function components, which React 19
  ignores, so HTML rendering is done by a small dedicated renderer
  ([src/components/RichText.tsx](src/components/RichText.tsx)) built on nested `Text` nodes.
