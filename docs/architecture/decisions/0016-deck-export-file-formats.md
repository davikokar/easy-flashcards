# ADR-0016: A deck is exported to a JSON or CSV file in formats the app defines, carrying no progress data

- Status: Active
- Date: 2026-11-03
- Decision makers: Project owner
- Recorded ahead of the work it governs.

## Context

The user wants an **Export to file** item in the Decks screen's **Deck options menu**:

> "choose JSON or CSV; for CSV choose a separator: comma, semicolon, tab, or custom. JSON contains
> deck title, description, category and cards. CSV has columns question and answer; the other data
> are exported as comment lines at the top of the file (`# title: ...`, `# description: ...`, and
> so on)."

Nothing in the app writes a deck out today. The one export is the App menu's **Export sample
deck**, which writes a fixed CSV string to the cache with `@dr.pogodin/react-native-fs` and hands it
to the system save dialog through `saveDocuments` from `@react-native-documents/picker`
([`src/services/exportSampleDeck.ts`](../../../src/services/exportSampleDeck.ts)).

Nothing here changes what the app persists, so this is not a storage decision. It is recorded
because it fixes two **file formats**, and a format outlives the build that wrote it: once a file
is on a user's device or in someone else's tool it cannot be recalled, and a later importer must
read whatever earlier builds wrote. Two earlier records left exactly this open:
[ADR-0011](0011-deck-editing-is-one-action.md) left how a deck's title and description are
exported "deliberately for later", and [ADR-0014](0014-deck-belongs-to-one-category.md) left "a
category column in the CSV format" undecided.

The forces:

- **The importer is narrow.** `parseFlashcardsCsv` in [`src/utils/csv.ts`](../../../src/utils/csv.ts)
  accepts only `;` or tab, detects the delimiter from the **first line**, and has no notion of
  comment lines. It matches headers after trimming and lower-casing them, so `question` and
  `Question` are the same to it. JSON import is a placeholder that alerts. A file with comment
  lines at the top, or separated by commas, is therefore rejected by today's importer.
- **Progress data has an invariant.** A card's counters must equal its results across its deck's
  sessions ([ADR-0015](0015-answers-carry-a-timestamp-under-v2-keys.md)). Counters arriving in a
  file without the sessions behind them would break that the moment a future importer read them.
- **Card text is HTML** ([ADR-0001](0001-own-the-html-renderer.md)), and the importer stores what it
  reads verbatim. Anything other than the stored text would not come back as the same card.
- **The separator is user-chosen**, so it can collide with quoting, with line breaks, or with the
  comment marker, and PapaParse — the CSV library the app already has — silently writes commas
  when handed a delimiter it considers bad (`\r`, `\n`, `"`, the BOM) instead of failing.
- **A deck name is user text.** It can contain `/`, `..`, or characters a file system rejects.

## Decision

### Flow

- The **Deck options menu** gains **Export to file**. It lets the user choose **JSON** or **CSV**
  and, for CSV, a separator: **Comma**, **Semicolon**, **Tab** or **Custom**. Then it opens the
  system save dialog. The layout of that choice is a UI matter for the plan and the UI vocabulary,
  not for this record.
- Export reads the deck as it is in the store when the user confirms. It **dispatches nothing and
  changes nothing stored**: no store action, no storage key, no route, no dependency, and no Android
  permission. `saveDocuments` uses the system's create-document dialog, which grants access to the
  one file the user picks.
- A deck with no cards can be exported; the file holds its metadata and no cards.
- Cancelling the save dialog is not an error and shows nothing, as for the sample deck.

### What is exported

- The deck's **title** (`Deck.name`), its **description** (`''` when it has none), its **category**,
  and its **cards** in deck order, each as **question** and **answer**.
- **Card text is written exactly as stored**: HTML untouched, not converted to plain text, not
  trimmed.
- **The category is resolved with `findCategory`** ([ADR-0014](0014-deck-belongs-to-one-category.md)).
  A deck with no category, or whose `categoryId` no longer resolves, exports **no category**.
- **No progress data and no identity.** Card ids, counters, `lastReviewedAt`, the deck's id,
  `createdAt`, `lastStudiedAt` and `sourceFileName`, and every session, stay on the device. An
  export is the deck's content, not its history.

### JSON

One object, pretty-printed with two-space indentation, keys in this order:

```json
{
  "format": "easy-flashcards-deck",
  "version": 1,
  "title": "German words",
  "description": "",
  "category": {
    "id": "default_languages",
    "name": "Languages",
    "color": "#…",
    "icon": "languages",
    "builtIn": true
  },
  "cards": [
    { "question": "What is the capital of <b>France</b>?", "answer": "Paris" }
  ]
}
```

- **`format`** is always the string `"easy-flashcards-deck"` and **`version`** the integer `1`. They
  let a future importer recognise the file and refuse a version it does not know, rather than
  guessing from the shape.
- **`category`** is `null` for no category, otherwise `{ id, name, color, icon, builtIn }` from the
  resolved category. `builtIn` is `true` for a default id. A custom category's `createdAt` is not
  exported. The id is carried so that a default category can be matched exactly on import; a custom
  id means nothing on another device, which is why the name, colour and icon travel with it.
- **Versioning.** A reader ignores keys it does not know, so adding an optional key keeps
  `version: 1`. Removing, renaming or retyping a key, or changing what one means, takes
  `version: 2` and an amendment to this record.

### CSV

```text
# title: German words
# description: Words from work.\nSecond line.
# category: Languages
question;answer
What is the capital of <b>France</b>?;Paris
```

- **Three comment lines, then a header row, then one row per card.** The comment lines are always
  present and always in the order `title`, `description`, `category`, each written as
  `# <key>: <value>`. An empty value is written as `# <key>:` with nothing after the colon. The
  category line carries the category's **name** only; no category is an empty value.
- **A comment value stays on one line.** `\` is written as `\\` and a line feed as `\n`; a carriage
  return is dropped. Nothing else is escaped. Comment lines are not CSV rows: the separator is not
  special in them and they are never quoted.
- **The header row is `question` and `answer`, in lower case**, as the user worded it. The
  importer lower-cases headers before matching, so this casing is exactly as importable as the
  sample deck's `Question` / `Answer`.
- **Separators.** Comma `,`, Semicolon `;` and Tab are presets. A **custom** separator is exactly
  one character, counted by code point (`Array.from`), and is **not** whitespace (Tab is a preset
  for that), not a letter or digit, and not `"`, `#`, a carriage return, a line feed or the BOM.
  Validation is the export's own and fails loudly; it never relies on PapaParse, which would
  silently fall back to a comma.
- **Quoting** follows the usual CSV rule, as PapaParse's `unparse` writes it: a field is quoted
  when it contains the separator, `"`, a carriage return or a line feed, or starts or ends with a
  space, and a `"` inside it is doubled. **In addition, every field that starts with `#` is
  quoted**, so a reader that treats `#` lines as comments — as this file invites — never swallows a
  card.
- **No formula-injection prefixing.** A field beginning with `=`, `+`, `-` or `@` is written as is.
  Prefixing it, as PapaParse's `escapeFormulae` does, would change the user's own card text; the
  data is theirs and goes where they save it. A spreadsheet opening the file may evaluate such a
  field, and that is accepted.
- **Encoding.** UTF-8 with no BOM, lines ended with LF, including the last.
- **The extension is `.csv` for every separator, Tab included**, and the MIME type `text/csv`.

### Saving

- **Serialisation is pure and lives in `src/utils/`**, with the separator validation and the
  suggested file name, so all of it is tested without a device. The device step lives in
  `src/services/` and **reuses the sample deck's mechanism**: write the text to
  `CachesDirectoryPath` under a **fixed** file name, then call `saveDocuments` with the MIME type
  (`text/csv` or `application/json`) and a suggested file name.
- **The cache path never contains the deck name.** User text in a file-system path can escape the
  cache directory or be rejected outright; a fixed name can do neither. Each export overwrites the
  previous one.
- **The suggested file name is the deck title made safe**: characters a file system rejects
  (`/ \ : * ? " < > |` and control characters) replaced, trimmed, falling back to `deck` when
  nothing is left, plus `.csv` or `.json`. It only pre-fills the save dialog, which the user can
  change and the system provider sanitises again. It matters because the importer names a deck
  after its file. On iOS `saveDocuments` ignores it and uses the source file's name, so an iOS
  export would be offered the fixed name; the iOS project has never been built.

### The importer is unchanged

**An export does not round-trip.** Today's importer rejects every file this record describes: a CSV
because its first line is a comment, and a comma or custom separator besides; a JSON file because
JSON import is a placeholder. It rejects them with an error rather than importing the wrong cards.
This is accepted for this change. Making the importer read the comment lines, comma and custom
separators, and the JSON format is the follow-up, and needs its own decision — in particular, how an
imported category is matched against the ones on the device.

## Alternatives Considered

- **Export the progress data — counters, ids, sessions — so a deck can move between devices with
  its history.** Rejected: counters without the sessions behind them break ADR-0015's rule that
  counters equal the answer log, and importing sessions would mean merging another device's history
  into this one's. History stays where it was made.
- **Write only what today's importer reads** — `;` or tab, no comment lines — so the export
  round-trips now. Rejected: the user asked for comment lines and for comma and custom separators,
  and the title, description and category would have nowhere to go. Widening the importer is the
  better fix, and it is a separate change.
- **Widen the importer in the same change.** Rejected for scope: it raises its own questions (the
  title from a comment or from the file name, an unknown category, a JSON file from a newer
  version) and would double the change.
- **The category as a CSV column.** Rejected: it is one value per deck, and a column repeats it on
  every row. The user asked for comment lines.
- **Metadata in a second file, or in the header row.** Rejected: two files can be separated, and a
  header row is not where a CSV reader looks for anything but column names.
- **The sample deck's `Question` / `Answer` header casing.** Not needed: the importer is
  case-insensitive, and the user's wording is lower case.
- **Convert card HTML to plain text.** Rejected: lossy, and the importer expects HTML.
- **CRLF line endings, as RFC 4180 and PapaParse's default have them.** Rejected: LF is what every
  tool the user is likely to open the file with handles, and the importer normalises both.
- **`.tsv` for a tab separator.** Rejected: one extension and one MIME type for every CSV keeps the
  export simple, and the import picker already accepts any file.
- **A multi-character custom separator.** Rejected: one character is what CSV readers expect, and
  what a future importer can detect.
- **Prefix formula-like fields.** Rejected above: it alters the user's text.
- **A share sheet instead of a save dialog**, or a new library for it. Rejected: it adds a
  dependency, and the save dialog already works for the sample deck.
- **Name the cache file after the deck.** Rejected: user text in a path, for no gain — the name the
  user sees is the suggested one.

## Consequences

### Positive

- A deck's title, description and category can finally leave the app, closing the questions ADR-0011
  and ADR-0014 left open for export.
- No store, storage, route, permission or dependency change: nothing a user can lose, and nothing
  to migrate.
- The JSON format is versioned from its first file, so the importer that reads it can be written
  against a contract rather than against examples.
- All the logic that decides what the file says is pure and tested.

### Negative

- **An exported file cannot be imported back** until the importer is widened. A user who exports
  to move a deck will find that out by trying.
- **Progress does not travel.** A deck exported and later re-imported starts with zero counters
  and no sessions.
- A CSV opened in a spreadsheet may evaluate a card beginning with `=`, `+`, `-` or `@`, and most
  spreadsheets show `#` comment lines as data rows.
- The comment escaping is this app's own convention; another tool reading the file sees `\n` and
  `\\` literally in the description.
- The last export stays in the app's cache under the fixed name until the next export overwrites it
  or the system clears the cache. The cache is private to the app.
- On iOS, if it is ever built, the save dialog would offer the fixed cache name rather than the
  deck's.

## Amendment 1 — 2026-11-03

**The cache file is deleted after every save attempt; no export stays in the cache.** *Saving*
says each export overwrites the previous one, and *Consequences* says the last export stays in the
cache until the next export or the system clears it. Neither is what landed.
[`src/services/exportDeck.ts`](../../../src/services/exportDeck.ts) still writes the text to the
fixed cache name before opening the save dialog, but removes it with `unlink` in a `finally` once
the dialog returns — whether the file was saved, the user cancelled, or the save failed. A failed
`unlink` is swallowed, so it can neither turn a saved export into a reported error nor hide the
error of a failed save.

This is better than leaving the file behind. The cached copy has no use once the dialog closes:
the user's copy is wherever they saved it, and the next export writes a fresh one. Deleting it
means a deck's full card text does not sit in the cache after the user has finished with it, and
the cache does not keep one stale file per format. Deletion is best-effort, so the fixed name still
matters: a file left by a failed `unlink` is overwritten by the next export, as the original text
describes. The decision — a fixed cache name, never the deck's title, then `saveDocuments` — is
unchanged.

## Amendment 2 — 2026-11-04

Recorded ahead of the work it governs. The export formats above are unchanged; what changed is
*The importer is unchanged*, the follow-up this record left open. It is decided by
[ADR-0017](0017-deck-import-reads-exported-formats.md):

- **An export now round-trips, with known losses.** The CSV importer skips blank and `#` lines
  before the header row and detects the separator from that row, among the presets and every
  character `validateCustomSeparator` accepts — so every separator this record lets the user write
  is one the importer reads. The JSON importer reads `version: 1` of the format above.
- **The CSV comment lines are written but not read.** `# title:`, `# description:` and
  `# category:` are ignored on import; a CSV-imported deck is still named after its file, with no
  description and no category. The JSON file is the one that carries a deck's metadata back.
- **A reader now holds this record's versioning rule to account.** The importer ignores unknown
  keys, reads `version` `1`, and refuses a greater version as coming from a newer build. Changing a
  key's meaning therefore still takes `version: 2`, as above, and now also an importer for it.
- **Two limits appear on import.** Card text, the title and the description are trimmed on import
  though the export writes them untrimmed, and an exported deck with no cards is rejected on import
  for having no usable cards. ADR-0017 records both as accepted.
- The *Negative* consequence *"An exported file cannot be imported back until the importer is
  widened"* no longer holds once ADR-0017's work lands. The *References* entry calling
  [`src/utils/csv.ts`](../../../src/utils/csv.ts) *unchanged by this record* stays true of this
  record; ADR-0017 changes it.

## Amendment 3 — 2026-11-04

Recorded ahead of the work it governs; that work landed on 2026-11-04, as described below. The
formats above are unchanged. What changes is the App menu's **Export sample deck**, which
*Context* describes as writing "a fixed CSV string": the user
asked for it to export the CSV "according to the new export (with the comments)" and a JSON file
as well — two files in two formats.

- **The sample deck is exported in both formats of this record, as two files.** Export sample deck
  saves the same sample once as CSV and once as JSON, each written by `serializeDeck`, the
  serialiser *Export to file* uses, so each carries everything this record says a file carries:
  the CSV its three comment lines and its `question` / `answer` header, the JSON its `format` and
  `version`. The CSV uses the **Semicolon** preset, as the hand-written sample did. A sample in a
  shape the export never writes teaches a user the wrong file.
- **The sample is defined once, as a deck.** [`src/utils/sampleDeck.ts`](../../../src/utils/sampleDeck.ts)
  holds it as a `Deck` — the title `Sample deck`, a description, a built-in category, and the five
  cards of the hand-written CSV — together with the two export options, and both files are
  generated from that. They cannot disagree with each other, and the hand-written `SAMPLE_DECK_CSV`
  string goes. The deck's ids, timestamps and counters exist only to satisfy the type; none is
  written, because an export carries no progress data and no identity (*What is exported*).
- **Generating the CSV fixes a broken sample card.** The hand-written file wrote `Buenos d&iacute;as`
  unquoted after a `;` separator, so the entity's own `;` split the row and the card imported as
  `Buenos d&iacute`, which no longer decodes. `Papa.unparse` quotes a field that contains the
  separator. Decks already imported from the old sample keep the broken answer: nothing rewrites an
  imported card.
- **The files in `samples/` are that output, and a test checks it.** `samples/sample-deck.csv` is
  regenerated in the new shape and `samples/sample-deck.json` is added, and a test asserts that
  each equals what the export writes, line endings aside. Raw assets are still not bundled into the
  app, so that test remains what keeps the repository's copies and the app's in step: a change to
  the sample, to a serialiser, or to the palette colour of the sample's category fails it until the
  files are regenerated, which is the intent.
- **Two files take two save dialogs, one after the other.** On Android `saveDocuments` saves one
  file per call: the installed `@react-native-documents/picker` opens `ACTION_CREATE_DOCUMENT` for
  `sourceUris[0]` alone, logs a warning for the rest, and its native module rejects a second call
  while one is open. So the export calls it for the CSV and, once that returns, for the JSON, each
  with its own MIME type and its own suggested name: `Sample deck.csv` and `Sample deck.json`, the
  title made safe by `exportFileName` as for any deck. Either file therefore imports as a deck
  named `Sample deck` — the CSV through its file name, the JSON through its title.
- **The two dialogs are independent.** Cancelling one skips that file and moves on to the next,
  and a file that fails to save does not stop the other. One alert at the end reports both
  outcomes, naming each saved file by the name the save dialog returned; cancelling both shows
  nothing, as a cancel did before. *Export to file* is unchanged: it saves one file, and a cancel
  ends it.
- **The cache is handled as Amendment 1 describes.** Each file is written under the fixed name
  `easy-flashcards-export.csv` or `.json` and deleted once its dialog returns. The cache file the
  sample export used to leave behind, `sample-deck.csv`, is no longer written; one already on a
  device stays until the system clears the cache.
- **Still nothing stored, no dependency, no permission.** Export sample deck dispatches nothing, and
  each create-document dialog grants access to the one file the user picks in it.
- **This is not a deck split across two files.** *Alternatives Considered* rejects metadata in a
  second file because two files can be separated. Each sample file is a whole deck on its own; the
  second is the same deck in the other format, and either one can be lost without harming the other.

## Amendment 4 — 2026-11-05

Recorded ahead of the work it governs. The decision — two formats the app defines, carrying a
deck's content and no progress — is unchanged. The formats themselves move to **version 2**, under
[ADR-0019](0019-deck-file-format-version-2.md), which this record's own versioning rule requires:

- **JSON `version` is `2`, and `category` is one string or `null`.** The object
  `{ id, name, color, icon, builtIn }` in *JSON* is no longer written. The string is the *category
  reference*: a built-in category's id, or a custom category's name.
- **The CSV has five comment lines, in the order `format`, `version`, `title`, `description`,
  `category`.** *CSV*'s "three comment lines … in the order `title`, `description`, `category`"
  no longer holds, and its `category` line carries the category reference rather than the
  category's display name.
- **`format` and `version` are defined once and shared** by both serialisations.
- Everything else here — what is exported, the header row, separators, quoting, escaping, encoding,
  the file name and the save mechanism, including Amendments 1 and 3 — is unchanged. The samples of
  Amendment 3 are regenerated in version 2.

## Amendment 5 — 2026-11-05

Recorded after the work it describes, under [ADR-0019](0019-deck-file-format-version-2.md)
Amendment 1. The formats are unchanged; what the importer reads back from a CSV widens.

- **The CSV comment lines are written and read.** Amendment 2's *"The CSV comment lines are written
  but not read"* — already narrowed by ADR-0019 to `title` and `description` — no longer holds. A
  CSV-imported deck is named after its `# title:` line, or after its file when that is missing or
  blank, and gets its `# description:` line, so the escaping this record defines is reversed on
  import. JSON is no longer the only file that carries a deck's metadata back.
- Amendment 3's *"the CSV through its file name, the JSON through its title"* now reads: each
  through its title. The sample still imports as `Sample deck`.
- Nothing persisted changes, and nothing new is written.

## References

- [`src/utils/csv.ts`](../../../src/utils/csv.ts) — the importer, unchanged by this record
- [`src/services/exportSampleDeck.ts`](../../../src/services/exportSampleDeck.ts) — the save
  mechanism reused
- [`src/utils/sampleDeck.ts`](../../../src/utils/sampleDeck.ts) and
  [`samples/`](../../../samples/) — the sample deck, exported in both formats (Amendment 3)
- [`src/services/importDeck.ts`](../../../src/services/importDeck.ts) — the import picker, and the
  deck name: the file's title, else its file name (Amendment 5)
- [`src/utils/categories.ts`](../../../src/utils/categories.ts) — `findCategory`,
  `isDefaultCategoryId`
- [ADR-0001](0001-own-the-html-renderer.md) — card text is HTML
- [ADR-0011](0011-deck-editing-is-one-action.md) — the description; amended by this record
  (Amendment 2)
- [ADR-0014](0014-deck-belongs-to-one-category.md) — the category; amended by this record
  (Amendment 3)
- [ADR-0015](0015-answers-carry-a-timestamp-under-v2-keys.md) — counters equal the answer log
- [ADR-0017](0017-deck-import-reads-exported-formats.md) — the importer that reads these formats
  (Amendment 2)
- [ADR-0019](0019-deck-file-format-version-2.md) — format version 2: the shared `format` and
  `version`, and the category reference (Amendment 4); the CSV title and description read back
  (Amendment 5; ADR-0019 Amendment 1)
- `@react-native-documents/picker` `saveDocuments` — `fileName` and `mimeType` are Android-only;
  on iOS the target name is taken from the source URI
- [ARCHITECTURE.md](../ARCHITECTURE.md) — links to this record now that the work has landed
