# Easy Flashcards

Android flashcards app built with React Native. Import decks from local CSV files, study them
card by card, and track how well you know each card.

## Features

- **Bottom tab navigation** with a *Decks* tab (import decks and start sessions), a *Learn* tab
  (your sessions, and where you study them) and a *Statistics* tab.
- **CSV import** from any local file through the Android system file picker.
  - Columns `Question` and `Answer` (header matching is case-insensitive).
  - Delimiters: semicolon (`;`) or tab (`\t`).
  - BOM and CRLF tolerant; incomplete rows are skipped and reported.
- **Study sessions** with an animated card flip, three icon feedback buttons — *Not Ok* (cross),
  *Okeish* (question mark) and *Ok* (tick) — a progress indicator, and an end-of-session summary
  that offers to review the cards you missed or were unsure of. Okeish counts as a review but not
  as a success.
- **Error review** of a completed session: go over its missed or unsure cards again, one pass at a
  time, until each has been answered Ok. A review is practice — it creates no session and changes
  no statistic; it only remembers which of the session's errors you have since fixed.
- **Session list** on the *Learn* tab: every session in progress and every completed one you have
  not cleared, unfinished first, each with its progress split into ok / okeish / not ok. Resume a
  session in progress. On a completed one, review its errors — the button shows how many are still
  to fix, or a tick once all are — or replay it over the same cards: a replay is a new session, and
  it takes the original's place in the list (the original is cleared). Completed sessions can also
  be cleared from the list, one at a time or all at once; they still count in Statistics.
- **Search** on the *Decks*, *Learn* and *Statistics* tabs: the search button opens a search bar
  that narrows the list by deck name as you type. Every word you type must appear in the name, in
  any order and ignoring case. On *Statistics* the overall totals stay unfiltered.
- **HTML formatting** on both sides of a card: `<b>`, `<i>`, `<u>`, `<s>`, `<br />`, `<p>`,
  `<ul>`/`<ol>`/`<li>`, `<h1>`-`<h6>`, `<code>`, `<mark>`, `<font color="...">`, HTML entities.
- **Statistics** persisted locally: per-deck review counts, success rate and session counts, plus a
  per-card drill-down sorted hardest first.
- Everything is stored on-device with AsyncStorage. Each answer is saved the moment you give it,
  so leaving a session early loses nothing and you can resume it later from the *Learn* tab.

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
| [src/screens](src/screens) | Decks, Learn, Study, Statistics and per-deck statistics screens |
| [src/components](src/components) | Flip card, HTML renderer, buttons, progress bars |
| [src/state/DecksContext.tsx](src/state/DecksContext.tsx) | Context + reducer store, auto-persisting |
| [src/storage/decksStorage.ts](src/storage/decksStorage.ts) | AsyncStorage read/write with defensive normalisation |
| [src/services/importDeck.ts](src/services/importDeck.ts) | Document picker + file read + CSV parsing |
| [src/utils](src/utils) | CSV parsing, HTML parsing, statistics helpers, file URI conversion, shuffling |
| [\_\_tests\_\_](__tests__) | Unit tests for the CSV, HTML, statistics, file URI and shuffle logic |

## Notes on dependencies

- `react-native-document-picker` is deprecated; its maintained successor
  `@react-native-documents/picker` is used instead.
- `react-native-render-html` relies on `defaultProps` for function components, which React 19
  ignores, so HTML rendering is done by a small dedicated renderer
  ([src/components/RichText.tsx](src/components/RichText.tsx)) built on nested `Text` nodes.
