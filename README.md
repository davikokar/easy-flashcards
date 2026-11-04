# Easy Flashcards

Android flashcards app built with React Native. Import decks from local CSV or JSON files, study
them card by card, and track how well you know each card.

## Features

- **Bottom tab navigation** with a *Decks* tab (import decks and start sessions), a *Learn* tab
  (your sessions, and where you study them), a *Categories* tab and a *Statistics* tab.
- **Deck import** from any local file through the Android system file picker: *Import deck from
  file* asks for **CSV** or **JSON** first, and the file is read as that format whatever its
  extension.
  - **CSV**: columns `Question` and `Answer` (header matching is case-insensitive), separated by a
    comma, semicolon, tab or any single symbol the export accepts; the deck is named after the
    file. See [CSV format](#csv-format).
  - **JSON**: a deck file exported by the app, bringing its title, description and — when it
    exists on this device — its category. See [Export formats](#export-formats).
  - BOM and CRLF tolerant; incomplete rows or cards are skipped and reported, and a file that
    cannot be read is refused with the reason. Every imported card starts with no statistics.
- **Deck editing**: *Edit deck* in a deck's menu opens a form for the deck's title, an optional
  description, its category and its cards. Edit a card's
  question or answer, add a card, or remove one, then press *Save*; nothing changes until you do.
  Editing a card keeps its statistics, removing one deletes them, and the title change reaches the
  deck's sessions.
- **Deck export**: *Export to file* in a deck's menu saves the deck's title, description, category
  and cards as a JSON or CSV file wherever you choose in the system save dialog. For CSV, pick a
  comma, semicolon or tab as the separator, or type any single character that is not a letter, a
  digit, whitespace, a double quote or `#`. Statistics and sessions are not exported. Both formats
  import back; JSON keeps the title, description and category, CSV only the cards. See
  [Export formats](#export-formats).
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
  Statistics. Discarding an unfinished session deletes it and takes its answers back out of the
  statistics.
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
- **Statistics** on the *Statistics* tab: an overall success rate in a ring split into ok / okeish
  / not ok, with totals for decks, cards, reviews and sessions; then a card per deck with its
  category, its ok / okeish / not ok split, and its card, session and review counts and last
  session date. Tap a deck for a per-card drill-down sorted hardest first. Chips at the top switch
  the success rate, the review and session totals, and each deck's split, review count and session
  count between *All
  time*, *This month* and *Last 7 days*; deck and card counts, last session dates and the per-card
  drill-down are always all time. The choice is not remembered.
- **Categories** on the *Categories* tab: a set of built-in subject categories (astronomy,
  mathematics, cinema and more), each with its own colour and icon, plus your own. *New category*
  lets you pick a name (up to 30 characters, not already used), a colour and an icon. The colour
  is one of the palette, or any colour you mix yourself from the rainbow *Custom colour* swatch
  (hue, saturation and brightness), as long as it is light enough for the icon to stay readable
  on it. A category you created can be deleted from its tile. Give a deck a category from *Edit deck*: its icon then
  shows on the deck's card and on its sessions on the *Learn* tab, at the top of their options
  menus, and on the deck's card on the *Statistics* tab. Deleting a category leaves its
  decks with no category (the confirmation says how many). Categories cannot be edited, and you
  cannot yet filter by category or see totals per category in *Statistics*. The category icons are
  Android-only.
- Everything is stored on-device with AsyncStorage. Each answer is saved the moment you give it,
  so leaving a session early loses nothing and you can resume it later from the *Learn* tab.

## Upgrading

The version that added the Statistics timeframes stores decks and sessions under new storage keys,
and does not carry the old ones over. After updating to it, the *Decks* tab starts empty: import
your decks again. Earlier decks, sessions and statistics are not converted or deleted; they stay
on the device, unread. Your own categories are kept. Installing an older version again shows the
old library, and the two never merge.

## CSV format

```csv
Question;Answer
This is the question; This is the <b>answer</b>
```

The header row is the first line that is neither blank nor starts with `#`; blank and `#` lines
above it are skipped, so the app's own CSV exports import as they are. The separator is detected
from the header row: a semicolon, tab or comma, or any other single symbol that is not a letter,
digit, whitespace, a double quote or `#`. Extra columns are ignored, card text is trimmed, and a row
missing its question or its answer is skipped and counted. The deck is named after the file, with
no description and no category.

Ready-to-use examples live in [samples/sample-deck.csv](samples/sample-deck.csv) and
[samples/sample-deck.json](samples/sample-deck.json): the same five-card deck in both
[export formats](#export-formats), the CSV with its three comment lines and semicolons as the
separator. Copy one to the device (or to the emulator's Downloads folder) and import it from the
*Decks* tab as CSV or JSON.

*Export sample deck* in the app menu (the three-dot button at the top right of each tab) saves the
same two files from the app: `Sample deck.csv`, then `Sample deck.json`. You are asked where to
save each one in turn, and cancelling either dialog skips that file. An alert then says which files
were saved; cancelling both shows nothing.

## Export formats

*Export to file* writes one of two formats. Card text is written exactly as stored, HTML included.
Both are UTF-8 with LF line endings.

**CSV**: three comment lines, then a `question` / `answer` header, then one row per card, separated
by the separator you chose:

```text
# title: German words
# description: Words from work.\nSecond line.
# category: Languages
question;answer
What is the capital of <b>France</b>?;Paris
```

A comment line is written even when its value is empty (`# category:`). Inside one, a line break is
written as `\n` and a backslash as `\\`. A field is quoted when it contains the separator, a quote
or a line break, or starts or ends with a space, and a quote inside it is doubled; a field that
starts with `#` is always quoted, so it cannot be mistaken for a comment line.

**JSON**: one object with `format` (`"easy-flashcards-deck"`), `version` (`1`), `title`,
`description`, `category` (`null`, or its `id`, `name`, `color`, `icon` and whether it is
`builtIn`) and `cards` (each a `question` and an `answer`).

Both formats import back. A CSV import reads past the comment lines, so the deck is named after
the file and has no description or category. A JSON import keeps the title, description and
category; the category is matched by its `id` only, so a built-in one always comes back and one you
created comes back only on the device where you created it, and otherwise the deck has none. A JSON
file from a newer version of the app is refused. Imported text is trimmed of leading and trailing
whitespace, and a deck exported with no cards cannot be imported. The full specification is
[ADR-0016](docs/architecture/decisions/0016-deck-export-file-formats.md), and the import rules
[ADR-0017](docs/architecture/decisions/0017-deck-import-reads-exported-formats.md).

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
| [src/components](src/components) | Flip card, HTML renderer, buttons, progress bars, dialogs, category tiles, squares and pickers, colour sliders |
| [src/state](src/state) | Context store (`DecksContext.tsx`) over a pure reducer (`reducer.ts`), auto-persisting |
| [src/storage](src/storage) | AsyncStorage read/write with defensive normalisation, one module per key |
| [src/services](src/services) | Document picker + file read + CSV or JSON parsing; deck and sample deck export through the save dialog |
| [src/utils](src/utils) | Pure logic: CSV, JSON and HTML parsing, deck import and export formats, statistics, search, categories, colour maths, and more |
| [src/assets/category-icons](src/assets/category-icons) | Category icons: Material Symbols by Google (Apache License 2.0, see its `NOTICE`) as Android vector drawables |
| [\_\_tests\_\_](__tests__) | Jest unit tests for the utils, the reducer and the storage loaders |

## Notes on dependencies

- `react-native-document-picker` is deprecated; its maintained successor
  `@react-native-documents/picker` is used instead.
- `react-native-render-html` relies on `defaultProps` for function components, which React 19
  ignores, so HTML rendering is done by a small dedicated renderer
  ([src/components/RichText.tsx](src/components/RichText.tsx)) built on nested `Text` nodes.
