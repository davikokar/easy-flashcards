# ADR-0017: Deck import reads the formats the app exports — CSV with any supported separator and leading comments, and the versioned JSON file

- Status: Active
- Date: 2026-11-04
- Decision makers: Project owner
- Recorded ahead of the work it governs.

## Context

The user asked:

> "adapt the csv importer. Make it select the separator and ignore the comments. Also, implement
> the json importer. Remove placeholders for xml and jsonl import."

[ADR-0016](0016-deck-export-file-formats.md) defined two export formats and accepted that the
importer could read neither: *"Making the importer read the comment lines, comma and custom
separators, and the JSON format is the follow-up, and needs its own decision — in particular, how
an imported category is matched against the ones on the device."* This is that decision.

What the importer does today:

- **CSV only.** The **Import format menu** offers `CSV`, `XML`, `JSON` and `JSONL`; all but CSV
  alert *"Only CSV files can be imported for now."*
- `parseFlashcardsCsv` in [`src/utils/csv.ts`](../../../src/utils/csv.ts) strips a BOM, takes the
  **first line** as the header, and picks `;` or tab by whichever occurs more often in it; anything
  else is *"Unsupported delimiter"*. It lower-cases and trims headers, requires `question` and
  `answer`, trims every field, ignores rows where both are empty, skips and counts rows where one
  is, and rejects a file with no usable row. It has no notion of a comment line.
- The deck is named after the file (`deckNameFromFileName`), and `addDeck` in
  [`DecksContext.tsx`](../../../src/state/DecksContext.tsx) creates it with description `''` and
  category `null`; its input carries only `name`, `sourceFileName` and `cards`.
- The picker ([`src/services/importDeck.ts`](../../../src/services/importDeck.ts)) copies the
  picked `content://` file into the cache, reads it as UTF-8, and parses it as CSV.

So every CSV the app exports is rejected — its first line is a comment — and so is every JSON
file.

The forces:

- **An imported file is untrusted input.** It may come from another tool, another device, a newer
  build, or a hand edit. A bad file must fail with a message, never with a half-built deck, and
  never by crashing.
- **Progress must not arrive from a file.** A card's counters equal its results across its deck's
  sessions ([ADR-0015](0015-answers-carry-a-timestamp-under-v2-keys.md)), and an imported deck has
  no sessions. ADR-0016 exports no progress for that reason; a reader must not take any either.
- **A custom category's id means nothing on another device.** Built-in ids are permanent
  `default_<icon key>` constants ([ADR-0012](0012-custom-categories-third-storage-key.md)); a
  custom id is minted per device from a timestamp and a random suffix.
- **A deck may only point at a category that resolves when it is written**
  ([ADR-0014](0014-deck-belongs-to-one-category.md)): `updateDeck` writes `null` for an id that
  does not resolve, and `deleteCategory` detaches decks in the same dispatch, so no state and no
  save holds a deck pointing at a category deleted through the app.
- **The separator is not stated anywhere in a CSV.** ADR-0016 lets the user export with a comma, a
  semicolon, a tab or one custom character. But the header row is known text — it must name
  `question` and `answer` — so the separator can be found deterministically instead of guessed by
  frequency.
- **Nothing persisted changes.** `Deck.description` and `Deck.categoryId` already exist
  ([ADR-0011](0011-deck-editing-is-one-action.md), ADR-0014); importing only fills them in.

## Decision

### The flow

- The **Import format menu** offers exactly **CSV** and **JSON**. The `XML` and `JSONL`
  placeholders are removed, not kept as stubs. Each item opens the system picker and parses the
  picked file **as the chosen format**; the format is never sniffed from the extension or the
  content, so a JSON file picked under CSV fails as a CSV, and the other way round.
- The CSV picker keeps its MIME list. The JSON picker offers `application/json`, `text/plain` and
  `*/*`; as for CSV, the trailing `*/*` keeps any file pickable, because providers label files
  inconsistently.
- Parsing is pure, in `src/utils/`, and tested without a device. The device step stays in
  `src/services/importDeck.ts`, whose `pickAndParseCsv()` becomes `pickAndParseDeck(format)`.
- A failure of either format is a **`DeckImportError`**, which replaces `CsvImportError`, and its
  message is shown in the existing *Import failed* alert. `DeckImportError`, the `ParsedCard` type
  and `parseDeckJson` live in a new `src/utils/deckImport.ts`; `csv.ts` keeps the CSV parser and
  imports them from there.
- The success alert and the skipped-row count work as today for both formats.
- **Nothing persisted changes**: no storage key, no shape, no migration, no dependency, no Android
  permission. The deck is created by the existing `addDeck` action.

### Both formats

- A leading BOM is stripped, and a file that is empty or only whitespace is rejected as empty.
- **Card text is trimmed** at both ends, as CSV import already does, and otherwise stored verbatim
  as HTML ([ADR-0001](0001-own-the-html-renderer.md)).
- A card needs a non-blank question **and** a non-blank answer. One that lacks either is skipped
  and counted in the skipped-row count. **Zero usable cards is still rejected**, whatever else the
  file holds.
- **Duplicate cards are kept.** The importer does not compare cards with each other or with any
  deck on the device, and importing the same file twice makes two decks, as it does today.
- **No progress and no identity is read.** Every card starts with zero counters and a fresh id, the
  deck with a fresh id and no sessions. Keys a file carries beyond those below — counters, ids,
  timestamps — are ignored, so ADR-0015's invariant holds for an imported deck by construction.

### CSV

- **Comments are lines before the header.** Reading from the top, a line that is blank (empty or
  only whitespace) or whose **first character** is `#` is skipped. **The first line that is
  neither is the header row.** Nothing after the header is a comment: a row starting with `#` below
  the header is an ordinary card row. PapaParse's own `comments` option is not used, because it
  would drop such rows wherever they are.
- **The comment lines are ignored, including `# title:`, `# description:` and `# category:`.** A
  CSV-imported deck is still named after its file, has description `''`, and has no category. The
  values ADR-0016 writes there are for people and other tools.
- **The separator is detected from the header row.** The candidates are the distinct characters
  of that line, by code point, that are either a preset — `,`, `;` or tab — or pass
  `validateCustomSeparator` from [`src/utils/deckExport.ts`](../../../src/utils/deckExport.ts),
  the same rule the export enforces. Each candidate splits the header row with PapaParse, so a
  quoted header name splits correctly, and a candidate is **kept if its trimmed, lower-cased
  fields include both `question` and `answer`**.
- **Order when several candidates qualify:** `;`, then tab, then `,`, then custom candidates in the
  order they first appear in the header row. In practice a header row splits into both names with
  at most one candidate, so the order only settles contrived headers; `;` and tab come first
  because they were the only separators accepted before.
- **No candidate qualifies → the import fails**, with one message saying that the header row must
  name a `question` and an `answer` column separated by a comma, a semicolon, a tab or one other
  symbol. This replaces both *"Unsupported delimiter"* and *"Missing required headers"*: without a
  header row that names both columns there is no way to tell which of the two went wrong. A file
  holding nothing but blank and comment lines fails the same way.
- The rows from the header onward are parsed with the detected separator exactly as today: blank
  lines skipped, header names lower-cased and trimmed, extra columns ignored, a row with both
  fields empty ignored without counting it.

### JSON

The file must be the object ADR-0016 defines.

- **Recognition.** The text must parse as JSON into an object — **not an array** — whose `format`
  is the string `"easy-flashcards-deck"` and whose `version` is a number.
  - `version` `1` is read.
  - `version` greater than `1` fails with a message that the file comes from a **newer version** of
    the app.
  - Anything else — text that is not JSON, a bare array of cards, a missing or different `format`,
    a missing, non-numeric or lower `version` — fails as **not an Easy Flashcards deck file**.
- **Unknown keys are ignored**, at the top level and on each card, as ADR-0016's versioning rule
  requires of a reader.
- **`cards`** must be an array, or the file is not a deck. Each element counts as a card only if it
  is an object whose `question` and `answer` are both strings, non-blank once trimmed; any other
  element — wrong type, missing field, a blank side — is skipped and counted. Order is kept.
- **The deck's name is `title`**, trimmed, unless it is not a string or is blank; then it is named
  after the file, as a CSV deck is.
- **The description is `description`**, trimmed, or `''` when it is not a string — the same trim
  the Edit deck screen applies.
- **The category is matched by `category.id` only.** When `category` is an object with a string
  `id`, that id is passed to `addDeck` as the requested `categoryId`; otherwise the request is
  `null`. `name`, `color`, `icon` and `builtIn` are not read. **The import never creates a
  category.**

### Resolving the category: in the reducer, at dispatch

- **`addDeck`'s input gains two required fields, `description` and `categoryId`.** CSV import
  passes `''` and `null`. There is still one `addDeck` action and one dispatch per import.
- **The reducer's `addDeck` case resolves `categoryId` with `findCategory`** against the built-in
  categories and `state.categories`, and stores `null` when it resolves to neither — exactly as
  `updateDeck` does. Resolving in the reducer rather than in the screen means the check runs
  against the state the deck is written into, so ADR-0014's rule that no state holds a deck
  pointing at a missing category holds for import too.
- So a **built-in** category always matches; a **custom** category matches only on the device that
  minted it, while it still exists; any other id imports as **no category**.
- The deck `addDeck` returns is the one it dispatched, carrying the *requested* `categoryId`. No
  caller may read the category from it; a caller that needs the stored category reads the deck
  from the store.

## Alternatives Considered

- **Let the user choose the separator on import**, mirroring the export's choice. Rejected: the
  header row already identifies it, a choice is one more step and one more way to get it wrong, and
  detection uses the export's own validation rule, so every separator the app can write is one it
  can read.
- **Guess the separator by frequency**, as today, or with PapaParse's auto-detection. Rejected:
  the most frequent character need not be the separator — `question,answer,"x;y;z"` has more
  semicolons than commas — and PapaParse scores a fixed candidate list, which cannot include a
  custom separator it does not know. The header names are known, so a deterministic check is
  available.
- **Read `# title:`, `# description:` and `# category:` from a CSV.** It would make a CSV round
  trip keep the deck's metadata. Not adopted: the comment convention is this app's own, the
  escaping (`\n`, `\\`) would have to be reversed, the category line carries only a name — which
  would need name matching, with its own collisions — and JSON already carries all three
  structurally. It can be added later without changing the file format.
- **Treat every `#` line as a comment, anywhere** (PapaParse's `comments: '#'`). Rejected: a card
  whose text starts with `#` in a hand-written file would vanish silently. ADR-0016 quotes such
  fields on export, but other tools do not.
- **Match a category by name**, or **create a missing custom category** from the file's name,
  colour and icon. Rejected for now: names are not unique across devices, a created category is a
  side effect of an import the user did not ask for, and either needs rules for collisions with an
  existing category. Matching by id is exact and can be widened later.
- **Resolve the category in the screen or in the provider before dispatch.** Rejected: it would be
  checked against state that may have changed by the time the action is reduced, and it would be
  the only place the rule lived outside the reducer.
- **Accept a bare JSON array of cards**, or JSON without `format`/`version`. Rejected: ADR-0016
  versioned the format so a reader could recognise it rather than guess from its shape. A bare
  array is easy to produce by mistake from another tool and would import with no way to tell what
  the fields mean.
- **Keep XML and JSONL as placeholders.** Rejected at the user's request: a menu item that only
  says *not yet* is noise, and neither format is defined anywhere.
- **Sniff the format from the file's extension or content.** Rejected: the menu already asks, and
  an explicit choice gives a precise error instead of a guess.
- **Import a deck with no cards.** Rejected, as today: an empty import is far more often a wrong
  file than an intended empty deck. The cost — an exported empty deck cannot come back — is
  recorded below.

## Consequences

### Positive

- Every file the app exports imports again, in both formats and with every separator, so a deck
  can be backed up or moved between devices.
- A JSON import keeps the title, the description and — for a built-in category, or on the same
  device — the category.
- One pure parser per format, tested in Jest; the separator rule is shared with the export, so the
  two cannot drift apart.
- The **Import format menu** offers only what works.
- Nothing persisted changes, so there is nothing to migrate and nothing a user can lose.

### Negative

- **A CSV round trip still loses the description and the category**, and the title survives only
  as the file name — which is the export's suggested name unless the user changed it. JSON is the
  format that moves a deck whole.
- **A custom category does not travel.** On another device, or after the category was deleted, the
  deck imports with no category, and nothing tells the user it had one.
- **Progress does not travel**, as ADR-0016 already accepted: every imported card starts unreviewed.
- **Whitespace at either end of a card side, the title or the description is trimmed on import**,
  while the export writes it untrimmed, so a round trip is exact only modulo that whitespace.
- **An exported empty deck does not import.** ADR-0016 lets a deck with no cards be exported; both
  importers reject it for having no usable cards.
- **`DecksContextValue.addDeck` changes shape**: two new required input fields, which every caller
  must pass. Its only caller is the Decks screen.
- `addDeck` returns a deck whose `categoryId` may differ from the one stored.
- **A header row is required in a CSV.** A file whose first non-comment line is data, or which uses
  other column names, is rejected as before; a `#` line after the header becomes a card or a skipped
  row.
- A JSON file written by a newer build is refused outright, even if the newer version only added
  something this one could ignore; ADR-0016 says such additions keep `version: 1`, so this happens
  only when a newer build has changed a key's meaning.
- Card text from a file is untrusted HTML, as CSV text already was; it is rendered only by the
  app's own renderer and its supported tag set ([ADR-0001](0001-own-the-html-renderer.md)).

## References

- [ADR-0016](0016-deck-export-file-formats.md) — the formats read here; amended by this record
  (Amendment 2)
- [ADR-0014](0014-deck-belongs-to-one-category.md) — resolving a category id; amended by this
  record (Amendment 4)
- [ADR-0011](0011-deck-editing-is-one-action.md) — the description; amended by this record
  (Amendment 3)
- [ADR-0003](0003-single-context-reducer-store.md) — the store; amended by this record
  (Amendment 4)
- [ADR-0001](0001-own-the-html-renderer.md) — card text is HTML
- [ADR-0012](0012-custom-categories-third-storage-key.md) — built-in and custom category ids
- [ADR-0015](0015-answers-carry-a-timestamp-under-v2-keys.md) — counters equal the answer log
- [`src/utils/csv.ts`](../../../src/utils/csv.ts) — the CSV parser, widened by this record
- [`src/utils/deckImport.ts`](../../../src/utils/deckImport.ts) — created by the work:
  `DeckImportError`, `ParsedCard`, `parseDeckJson`
- [`src/utils/deckExport.ts`](../../../src/utils/deckExport.ts) — `validateCustomSeparator`,
  `SEPARATOR_PRESETS`
- [`src/services/importDeck.ts`](../../../src/services/importDeck.ts) — the picker
- [`src/state/reducer.ts`](../../../src/state/reducer.ts),
  [`src/state/DecksContext.tsx`](../../../src/state/DecksContext.tsx) — `addDeck`
- [`src/utils/categories.ts`](../../../src/utils/categories.ts) — `findCategory`
- [ARCHITECTURE.md](../ARCHITECTURE.md) — the import path (§2), `csv.ts`, `deckImport.ts` and
  `importDeck.ts` (§3), and the limits that remain (§8); linked once the work landed
