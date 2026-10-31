# Easy Flashcards

Android flashcards app built with React Native. Import decks from local CSV files, study them
card by card, and track how well you know each card.

## Features

- **Bottom tab navigation** with a *Decks* tab (import decks and start sessions), a *Learn* tab
  (your sessions, and where you study them), a *Categories* tab and a *Statistics* tab.
- **CSV import** from any local file through the Android system file picker.
  - Columns `Question` and `Answer` (header matching is case-insensitive).
  - Delimiters: semicolon (`;`) or tab (`\t`).
  - BOM and CRLF tolerant; incomplete rows are skipped and reported.
- **Deck editing**: *Edit deck* in a deck's menu opens a form for the deck's title, an optional
  description (shown on its card on the *Decks* tab), its category and its cards. Edit a card's
  question or answer, add a card, or remove one, then press *Save*; nothing changes until you do.
  Editing a card keeps its statistics, removing one deletes them, and the title change reaches the
  deck's sessions.
- **Study sessions** with an animated card flip, three icon feedback buttons — *Not Ok* (cross),
  *Okeish* (question mark) and *Ok* (tick) — a progress indicator, and an end-of-session summary
  that offers to review the cards you missed or were unsure of, or to study the whole deck again.
  Okeish counts as a review but not as a success.
- **Inverted sessions**: *Start session with options* in a deck's menu lets you study the deck the
  other way round (each card's answer first, its question on the back), shuffled, or both. A
  session keeps its direction when you resume it, and a session started from it is inverted too.
  Inverted answers count towards the same card statistics as normal ones.
- **Session list** on the *Learn* tab: every session in progress and every completed one you have
  not cleared, unfinished first, each with its progress split into ok / okeish / not ok. Resume a
  session in progress. Replay a completed one to play the same cards again as a new session, which
  takes the original's place in the list (the original is cleared, and still counts in
  Statistics). *Start a new session* in a session's menu studies the whole deck again and leaves
  the session where it is. Either way the new session keeps the original's direction. Completed
  sessions can also be cleared from the list, one at a time or all at once; they still count in
  Statistics.
- **Error review**: a completed session with cards you missed or were unsure of shows a review
  button with the number still to fix. Reviewing goes through those cards once, in the session's
  order and direction; answering *Ok* marks a card fixed for that session, and the others stay for
  the next pass, which you can start from the review summary. A review is practice, not a session:
  it adds no session, changes no statistic, and leaves the session's own results as they were.
- **Search** on the *Decks*, *Learn* and *Statistics* tabs: the search button opens a search bar
  that narrows the list by deck name as you type. Every word you type must appear in the name, in
  any order and ignoring case. On *Statistics* the overall totals stay unfiltered.
- **HTML formatting** on both sides of a card: `<b>`, `<i>`, `<u>`, `<s>`, `<br />`, `<p>`,
  `<ul>`/`<ol>`/`<li>`, `<h1>`-`<h6>`, `<code>`, `<mark>`, `<font color="...">`, HTML entities.
- **Statistics** persisted locally: per-deck review counts, success rate and session counts, plus a
  per-card drill-down sorted hardest first.
- **Categories** on the *Categories* tab: a set of built-in subject categories (astronomy,
  mathematics, cinema and more), each with its own colour and icon, plus your own. *New category*
  lets you pick a name (up to 30 characters, not already used), a colour and an icon; a category
  you created can be deleted from its tile. Give a deck a category from *Edit deck*: its icon then
  shows on the deck's card and on its sessions on the *Learn* tab, and at the top of their options
  menus. Deleting a category leaves its
  decks with no category (the confirmation says how many). Categories cannot be edited, and you
  cannot yet filter by category or see one in *Statistics*. The category icons are Android-only.
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
| [src/screens](src/screens) | One file per screen: decks, sessions and study, categories, statistics |
| [src/components](src/components) | Flip card, HTML renderer, buttons, progress bars, dialogs, category tiles, squares and pickers |
| [src/state](src/state) | Context store (`DecksContext.tsx`) over a pure reducer (`reducer.ts`), auto-persisting |
| [src/storage](src/storage) | AsyncStorage read/write with defensive normalisation, one module per key |
| [src/services](src/services) | Document picker + file read + CSV parsing; sample deck export |
| [src/utils](src/utils) | Pure logic: CSV and HTML parsing, statistics, search, categories, and more |
| [src/assets/category-icons](src/assets/category-icons) | Category icons: Material Symbols by Google (Apache License 2.0, see its `NOTICE`) as Android vector drawables |
| [\_\_tests\_\_](__tests__) | Jest unit tests for the utils, the reducer and the storage loaders |

## Notes on dependencies

- `react-native-document-picker` is deprecated; its maintained successor
  `@react-native-documents/picker` is used instead.
- `react-native-render-html` relies on `defaultProps` for function components, which React 19
  ignores, so HTML rendering is done by a small dedicated renderer
  ([src/components/RichText.tsx](src/components/RichText.tsx)) built on nested `Text` nodes.
