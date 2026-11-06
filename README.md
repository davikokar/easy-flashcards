# Easy Flashcards

Android flashcards app built with React Native. Import decks from local CSV or JSON files, study
them card by card, and track how well you know each card.

## Features

- **Bottom tab navigation** with a *Decks* tab (import or create decks and start sessions), a
  *Learn* tab (your sessions, and where you study them), a *Categories* tab and a *Statistics* tab.
- **Deck import** from any local file through the Android system file picker: *Import deck from
  file* opens the picker straight away, and the app tells CSV from JSON by the file's content —
  a file starting with `{` or `[` is read as JSON, anything else as CSV — whatever its name or
  extension.
  - **CSV**: columns `Question` and `Answer` (header matching is case-insensitive), separated by a
    comma, semicolon, tab or any single symbol the export accepts; a `# title:`, `# description:`
    or `# category:` comment line above the header gives the deck its title, description and —
    when it exists on this device — its category, and without a title the deck is named after the
    file. See [CSV format](#csv-format).
  - **JSON**: a deck file exported by the app, bringing its title, description and — when it
    exists on this device — its category; without a title the deck is named after the file. See
    [Export formats](#export-formats).
  - BOM and CRLF tolerant; incomplete rows or cards are skipped and reported, and a file that
    cannot be read is refused with the reason. Every imported card starts with no statistics.
- **Deck editing**: *Edit deck* in a deck's menu opens a form for the deck's title, an optional
  description, its category and its cards. Edit a card's
  question or answer, add a card, or remove one, then press *Save*; nothing changes until you do.
  Editing a card keeps its statistics, removing one deletes them, and the title change reaches the
  deck's sessions.
- **Deck creation by hand**: *Add deck manually* in the add deck menu opens the same form, blank —
  a title, an optional description, a category and no cards until you add one. *Save* asks for a
  title and for both sides of every card, then adds the deck to the *Decks* tab. A deck may have
  no cards; leaving before saving asks first.
- **Deck export**: *Export to file* in a deck's menu saves the deck's title, description, category
  and cards as a JSON or CSV file wherever you choose in the system save dialog. For CSV, pick a
  comma, semicolon or tab as the separator, or type any single character that is not a letter, a
  digit, whitespace, a double quote or `#`. Statistics and sessions are not exported. Both formats
  import back with the title, description and cards, and the category when it exists on this
  device. See [Export formats](#export-formats).
- **Study sessions** with an animated card flip, three icon feedback buttons — *Not Ok* (cross),
  *Okeish* (question mark) and *Ok* (tick) — a progress indicator, and an end-of-session summary
  that offers to review the cards you missed or were unsure of, or to study the whole deck again
  (in deck order). Okeish counts as a review but not as a success. A deck's start button begins a
  session over the whole deck in random order.
- **Session options**: *Start session with options* in a deck's menu lets you study the deck the
  other way round (each card's answer first, its question on the back), in deck order, or both.
  *Shuffle* starts ticked and *Inverted* unticked each time; untick *Shuffle* for deck order. A
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
  session date. Chips at the top switch the success rate, the review and session totals, and each
  deck's split, review count and session count between *All time*, *This month* and *Last 7
  days*; deck and card counts and last session dates are always all time. The choice is not
  remembered.
- **Deck statistics**: tap a deck on the *Statistics* tab to see it on its own, always all time —
  its card count and category, its success rate with the change since the last session, its ok /
  okeish / not ok counts, its reviews, sessions and last session date, a chart of its latest five
  sessions, and a row per card with its status, split, review count and when it was last
  reviewed. Search the cards by question or answer text, filter them by status (*Needs review*
  below 40% success, *Learning*, *Mastered* from 70%, or *New*), and sort them hardest first, in
  deck order or most recently reviewed first. *Reset statistics* in the screen's menu clears the
  deck's results and sessions. The session chart stacks each session's ok, okeish, not ok and
  unanswered cards as shares of that session's own cards, oldest on the left with the date and
  success rate under each, and joins the sessions with smooth curves; the curves only connect
  them, and nothing is measured between two sessions. A deck with one session shows a single bar.
- **Categories** on the *Categories* tab: a set of built-in subject categories (astronomy,
  mathematics, cinema and more), each with its own colour and icon, plus your own. *New category*
  lets you pick a name (up to 30 characters, not already used), a colour and an icon. The colour
  is one of the palette, or any colour you mix yourself from the rainbow *Custom colour* swatch
  (hue, saturation and brightness), as long as it is light enough for the icon to stay readable
  on it. A category you created can be deleted from its tile. Give a deck a category from *Edit deck*: its icon then
  shows on the deck's card and on its sessions on the *Learn* tab, at the top of their options
  menus, on the deck's card on the *Statistics* tab, and at the top of the deck's statistics
  screen. Deleting a category leaves its
  decks with no category (the confirmation says how many). Categories cannot be edited, and you
  cannot yet filter by category or see totals per category in *Statistics*. The category icons are
  Android-only.
- **Settings**: *Settings* in the app menu (the three-dot button at the top right of each tab)
  opens a screen with four sections. *General* has *Change language*, which lists the languages
  the app is translated into and applies the choice at once, remembering it; *System default*
  follows the device. *App* has *Share app*, *Rate app*, *Customer support* (a mail to the support
  address) and *About* (the app's name and version). *Community and support* has *Buy me a
  coffee*, a one-off in-app purchase through Google Play. *Legal* opens the privacy policy and
  the terms. The store link and the two legal links are placeholders until the real ones exist,
  and the purchase only works once its product exists in the Play Console and the app is
  installed from Google Play.
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
missing its question or its answer is skipped and counted. Comment lines above the header give the
deck its metadata, as the export writes them — see [Export formats](#export-formats): `# title:`
names the deck, `# description:` gives its description, and `# category:` its category when it
names one on this device. Without a title, or with a blank one, the deck is named after the file;
without a description it has none. The first line for each name wins, and inside one `\n` is read
as a line break and `\\` as a backslash. Other comment lines are not read, except that a file
marked `# format: easy-flashcards-deck` with a `# version:` newer than the app supports is refused.
A CSV file must not start with `{` or `[` — that is how the app recognises JSON — so if your first
column name begins with one, quote it or put a `#` comment line above the header.

Ready-to-use examples live in [samples/sample-deck.csv](samples/sample-deck.csv) and
[samples/sample-deck.json](samples/sample-deck.json): the same five-card deck in both
[export formats](#export-formats), the CSV with its five comment lines and semicolons as the
separator. Copy one to the device (or to the emulator's Downloads folder) and import it from the
*Decks* tab with *Import deck from file*; the app recognises which format it is.

*Export sample deck* in the app menu (the three-dot button at the top right of each tab) saves the
same two files from the app: `Sample deck.csv`, then `Sample deck.json`. You are asked where to
save each one in turn, and cancelling either dialog skips that file. An alert then says which files
were saved; cancelling both shows nothing.

## Export formats

*Export to file* writes one of two formats. Card text is written exactly as stored, HTML included.
Both are UTF-8 with LF line endings.

Both formats are version 2 of the app's deck file and carry the same metadata: `format`,
`version`, `title`, `description` and `category`. The category is written as one string: a
built-in category's id, such as `default_languages` — never its name, which a translated app
would change — or the name of a category you created. A deck with no category has none.

**CSV**: five comment lines, then a `question` / `answer` header, then one row per card, separated
by the separator you chose:

```text
# format: easy-flashcards-deck
# version: 2
# title: German words
# description: Words from work.\nSecond line.
# category: default_languages
question;answer
What is the capital of <b>France</b>?;Paris
```

A comment line is written even when its value is empty (`# category:`). Inside one, a line break is
written as `\n` and a backslash as `\\`. A field is quoted when it contains the separator, a quote
or a line break, or starts or ends with a space, and a quote inside it is doubled; a field that
starts with `#` is always quoted, so it cannot be mistaken for a comment line.

**JSON**: one object with `format` (`"easy-flashcards-deck"`), `version` (`2`), `title`,
`description`, `category` (the string above, or `null`) and `cards` (each a `question` and an
`answer`).

Both formats import back, with the deck's title, description and category; a file with no title
gives a deck named after the file. Either way the category is looked up on this device: a built-in
id always comes back, and a category you created comes back wherever a category of yours has the
same name, ignoring case; otherwise the deck has none, and no category is created. A built-in
category is never matched by its name, so a CSV exported by an older version of the app, which
wrote the built-in's name, imports without its category, though with its title and description.
Version 1 JSON files from an older version still import. A file of either format
from a newer version of the app is refused. Imported text is trimmed of leading and trailing
whitespace, and a deck exported with no cards cannot be imported. The full specification is
[ADR-0016](docs/architecture/decisions/0016-deck-export-file-formats.md), the import rules
[ADR-0017](docs/architecture/decisions/0017-deck-import-reads-exported-formats.md), and version 2
[ADR-0019](docs/architecture/decisions/0019-deck-file-format-version-2.md).

## Languages

The app shows its text in the language you choose in *Settings*, else the device's language, and
in English when that language has no
translation. English is the source of every message; which other languages exist is `LANGUAGES` in
[src/locales/index.ts](src/locales/index.ts). The translations are machine-written and have not
been reviewed by native speakers; Portuguese is Brazilian wording, and Chinese is Simplified only,
so a Traditional Chinese device shows English. The registry also holds a
developer pseudo-language (`en-XA`), English with accented letters and longer text, used to spot
text that was missed or does not fit. Card text, deck names and the keys
of deck files are never translated. Right-to-left text, such as Arabic, is shown in the
left-to-right layout: the screens are never mirrored. On the very first launch on a right-to-left
device the layout can still appear mirrored once; it is left-to-right from the next start.

To add a language, create one file under [src/locales](src/locales) typed as the full catalogue,
so that a missing message fails `npm run typecheck`, with its own plural rule, and add one entry
for it to `LANGUAGES` in [src/locales/index.ts](src/locales/index.ts), and its name in its own
language to `LANGUAGE_NAMES` there. The rules are in
[ADR-0020](docs/architecture/decisions/0020-ui-text-translated-through-typed-catalogue.md).

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

The app has native dependencies, so after pulling a change that adds or upgrades one — such as the
one that added `react-native-svg` for the session chart — run `npm install` and rebuild the app
with `npm run android`; reloading the JavaScript in Metro is not enough. The first build after
`react-native-svg` arrived compiles its native code and takes noticeably longer.

## Project structure

| Path | Purpose |
| --- | --- |
| [src/navigation](src/navigation) | Bottom tabs + per-tab native stacks |
| [src/screens](src/screens) | One file per screen: decks, sessions and study, categories, statistics |
| [src/components](src/components) | Flip card, HTML renderer, buttons, progress bars, the session history chart, dialogs, category tiles, squares and pickers, colour sliders |
| [src/state](src/state) | Context store (`DecksContext.tsx`) over a pure reducer (`reducer.ts`), auto-persisting |
| [src/storage](src/storage) | AsyncStorage read/write with defensive normalisation, one module per key |
| [src/services](src/services) | Document picker + file read + CSV or JSON parsing; deck and sample deck export through the save dialog; reading the device language; share, store, mail and link hand-offs; the in-app tip purchase |
| [src/utils](src/utils) | Pure logic: CSV, JSON and HTML parsing, deck import and export formats, statistics, the session chart's geometry, search, categories, colour maths, the translation engine, and more |
| [src/locales](src/locales) | The UI text catalogue: English, one file per area; one file per translation; and the registry of languages |
| [src/i18n](src/i18n) | The provider with the `useT()` and `useLanguage()` hooks that give screens and components their text and the saved language choice |
| [src/assets/category-icons](src/assets/category-icons) | Category icons: Material Symbols by Google (Apache License 2.0, see its `NOTICE`) as Android vector drawables |
| [\_\_tests\_\_](__tests__) | Jest unit tests for the utils, the reducer and the storage loaders |

## Notes on dependencies

- `react-native-document-picker` is deprecated; its maintained successor
  `@react-native-documents/picker` is used instead.
- `react-native-render-html` relies on `defaultProps` for function components, which React 19
  ignores, so HTML rendering is done by a small dedicated renderer
  ([src/components/RichText.tsx](src/components/RichText.tsx)) built on nested `Text` nodes.
- `react-native-svg` draws the session chart on a deck's statistics screen, and is used for data
  charts only: icons are drawn from plain views or Android vector drawables, and card HTML is
  rendered as text
  ([ADR-0018](docs/architecture/decisions/0018-react-native-svg-draws-charts.md)). It is a native
  module, and npm does not check it against the React Native version, so a React Native upgrade
  needs its supported versions checked by hand.
- `react-native-iap` (with its peer `react-native-nitro-modules`) is the Google Play Billing
  wrapper behind *Buy me a coffee*; it is used in one file, only for that one-off tip
  ([ADR-0021](docs/architecture/decisions/0021-settings-screen-language-choice-and-tip-purchase.md)).
  It is native, so installing it needs a rebuild, and a purchase can only be tried from a build
  installed through Google Play once the `tip_coffee` product exists in the Play Console.
