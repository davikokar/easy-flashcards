# ADR-0019: Deck files move to format version 2 — CSV and JSON carry the same metadata, and the category as one language-neutral reference

- Status: Active
- Date: 2026-11-05
- Decision makers: Project owner
- Recorded ahead of the work it governs.

## Context

The user asked:

> "we need to align the export/import of decks. Right now the csv and json do not export the same
> data. These are the changes required:
> - add to the csv export, a comment line #format, to match the corresponding json attribute
> - add to the csv export, a comment line #version, to match the corresponding json attribute
> - category. In the json export we export too much information, we only need to export the id,
>   for example "default_geography", for the built-in categories; and the name or id for custom
>   categories. Export the same to csv. The import logic should work like this: if the category
>   matches a built-in id, then ok, if not, we check if it matches a custom category name or id;
>   if not the category is simply not imported/ignored.
> Later on I want to make the app multi-language. So the default categories should be
> exported/imported in a language-neutral way."

What the files hold today, under [ADR-0016](0016-deck-export-file-formats.md) and
[ADR-0017](0017-deck-import-reads-exported-formats.md):

- **JSON** (`format: "easy-flashcards-deck"`, `version: 1`) writes the category as an object
  `{ id, name, color, icon, builtIn }`. The importer reads only `category.id`.
- **CSV** writes three comment lines — `# title:`, `# description:`, `# category: <name>` — and the
  importer reads none of them. The CSV has no format or version marker.
- **The CSV category line carries the built-in category's English display name** (`Geography`),
  which is not an identifier: the day the app is translated, the same category has a different
  name on every language, and a name written by one build matches nothing in another.
- **A custom category from another device never matches on import**: the JSON importer matches by
  id only, and a custom id is minted per device
  ([ADR-0012](0012-custom-categories-third-storage-key.md)).

The forces:

- **A built-in category already has a language-neutral identity**: its permanent
  `default_<icon key>` id (ADR-0012). Its name is display text and is what a translation would
  change.
- **A custom category has no cross-device identity.** Its id is meaningful only on the device that
  minted it. Its name is the user's own text, never translated, and unique on a device: the New
  category screen rejects a name equal, ignoring case and surrounding whitespace, to any built-in
  or custom one (`validateCategoryName`), and a custom category cannot be renamed.
- **ADR-0016's versioning rule binds.** *"Removing, renaming or retyping a key, or changing what one
  means, takes `version: 2` and an amendment to this record."* Turning `category` from an object
  into a string retypes it.
- **Files already exist.** The owner's device and anyone it shared with may hold version 1 files of
  either kind; the repository's own `samples/` were hand-edited toward the new shape while still
  saying `version: 1`.
- **A deck may only point at a category that resolves when it is written**
  ([ADR-0014](0014-deck-belongs-to-one-category.md)); ADR-0017 resolves an imported category in the
  reducer's `addDeck` case, against the state the deck is written into.
- **Nothing persisted changes.** `Deck.categoryId` stays a resolved id or `null`; only the files
  and the rule that resolves what a file asks for change.

## Decision

### One format, version 2, shared by both files

- **The deck-file format is versioned once, for both serialisations.** `format` is still
  `"easy-flashcards-deck"` and `version` becomes the integer **`2`**, in JSON as keys and in CSV as
  comment lines. Both constants are defined once, in
  [`src/utils/deckExport.ts`](../../../src/utils/deckExport.ts), and the importers read them from
  there, so the writer and the readers cannot disagree about the current version.
- **Both files carry the same five metadata values, in the same order**: `format`, `version`,
  `title`, `description`, `category`.

### The category reference

- **A file names a category with one string, the *category reference*.**
  - **Built-in category: its id**, e.g. `default_geography`. Never its name: a built-in name is
    display text and will be translated.
  - **Custom category: its name**, as stored. Of the two values the user allowed — name or id — the
    name is the one that can match on another device, it matches equally well on the minting
    device because custom names are unique there and cannot be edited, and it is legible in the
    file. The id would match only on the device that minted it.
  - **No category, or a `categoryId` that no longer resolves**: no reference — `null` in JSON, an
    empty value in CSV. The deck's category is still resolved with `findCategory` before it is
    written, as ADR-0016 set out.
- The reference is produced by one pure function in
  [`src/utils/categories.ts`](../../../src/utils/categories.ts), used by both serialisers.

### JSON, version 2

```json
{
  "format": "easy-flashcards-deck",
  "version": 2,
  "title": "German words",
  "description": "",
  "category": "default_languages",
  "cards": [
    { "question": "What is the capital of <b>France</b>?", "answer": "Paris" }
  ]
}
```

- **`category` is the category reference, or `null`.** `name`, `color`, `icon` and `builtIn` are no
  longer written. Every other key, and every other rule of ADR-0016's *JSON* section, is unchanged.

### CSV, version 2

```text
# format: easy-flashcards-deck
# version: 2
# title: German words
# description: Words from work.\nSecond line.
# category: default_languages
question;answer
What is the capital of <b>France</b>?;Paris
```

- **Five comment lines, always present, always in this order**: `format`, `version`, `title`,
  `description`, `category`, each written as `# <key>: <value>` with ADR-0016's escaping. The
  `category` line carries the category reference, or nothing after the colon. Every other rule of
  ADR-0016's *CSV* section — header row, separators, quoting, encoding — is unchanged.
- The key names follow the existing `# key: value` convention; the user's `#format` and `#version`
  are those keys.

### Import

**Resolving a reference** — one pure function in `src/utils/categories.ts`, applied in order to the
reference trimmed of surrounding whitespace:

1. **Blank or absent** → no category.
2. **Equal to a built-in category's id** → that category.
3. **Equal to a stored custom category's id** → that category.
4. **Equal to a stored custom category's name, ignoring case and surrounding whitespace** → that
   category; if stored data ever holds two such names, the first in stored order.
5. **Anything else** → no category. Nothing is created, and the user is not told.

**A built-in category is never matched by name**, in any language: `Geography` in a file is
step 5. This is what keeps the built-ins language-neutral. The order makes a built-in id win over a
custom category that happens to be named like one.

**Where it runs.** The reducer's `addDeck` case resolves the requested category with this function
instead of `findCategory`, against `state.categories`, at dispatch — the place and the reason
ADR-0017 chose. For a deck created by hand on the New deck screen the request is an id, which
resolves exactly as before. `updateDeck` and every display path keep `findCategory`, which matches
by id only: they hold ids, not references. `addDeck`'s input field keeps the name `categoryId`
and the context's shape is unchanged; it carries a request — an id, or from a file a reference —
that the reducer resolves, and the deck `addDeck` returns still carries the request, which no
caller reads.

**JSON.**

- `version` `1` and `2` are read; a greater number is refused as from a newer build; anything else
  is not a deck — ADR-0017's rules, with the upper bound moved.
- **`category` as a string** is the reference, in either version — so a version 1 file hand-edited
  to the new shape, as `samples/` was, imports its category.
- **`category` as an object**, as version 1 wrote it: the reference is its `id` when that is a
  built-in id; otherwise its `name` when that is a non-blank string, so a custom category exported
  by an older build can match by name on another device; otherwise its `id` when that is a string.
- Anything else is no category.

**CSV.**

- **The comment lines above the header are now read**, as `# <key>: <value>`: the key is the text
  between `#` and the first `:`, trimmed and lower-cased; the value is the rest, trimmed and
  unescaped (`\\` → `\`, `\n` → a line feed). A comment line without a colon is ignored, and the
  first line for a key wins. Lines below the header are still never comments.
- **`category`** is the reference, resolved as above. A missing or empty line is no category.
- **`format` and `version` are checked only to refuse a newer file**: when `format` is
  `easy-flashcards-deck` and `version` is an integer greater than the current version, the import
  fails with the JSON importer's *newer version* message. Otherwise they are not validated — a
  missing, lower, malformed or foreign `format` or `version` imports as before. A CSV is
  recognised by its header row, and comment lines stay optional, so a hand-written CSV with no
  comments, or another tool's `# format:` line, still imports.
- **`title` and `description` are still not read.** A CSV-imported deck is still named after its
  file with an empty description, as ADR-0017 decided. The parser this record adds reads every
  key, so reading them later is a change of rule, not of parser.

**Version 1 files.**

- A **version 1 CSV** has no `format` or `version` line and its `category` line holds a display
  name. A custom category's name now matches; a built-in's English name does not, so such a deck
  imports uncategorised — exactly as every CSV import did before this record.
- A **version 1 JSON** file imports as before, and now also matches a custom category by name.

## Alternatives Considered

- **Keep `version: 1` and accept either shape of `category`.** The owner's hand-edited samples
  kept `1`. Rejected: ADR-0016's rule exists for exactly this — a reader must be able to tell
  which meaning a key has from the version, and an older build reading the string with the version
  1 rules would silently drop it. Older builds now refuse a version 2 JSON file with the *newer
  version* message, which is the intended behaviour; they still import a version 2 CSV, whose
  comment lines they skip.
- **Export a custom category's id.** Rejected: it matches only on the device that minted it, which
  is where the name matches too.
- **Export both name and id for a custom category**, or keep the object. Rejected at the user's
  request — one value, the same in both files — and the name alone already matches wherever the id
  would.
- **Match a built-in category by its English name too**, so that version 1 CSV files keep their
  built-in category. Rejected: it makes the English display name an identifier, which is what the
  user asked to avoid ahead of translation; a version 1 CSV never imported a category, so nothing
  is lost.
- **Prefix references** (`builtin:geography`, `custom:Verbs`) so that a custom name can never be
  read as a built-in id. Rejected: the user asked for the bare id, and the collision — a custom
  category deliberately named like `default_law` — costs only that deck's category, which then
  imports as the built-in one.
- **Refuse a CSV whose `format` or `version` is missing or unknown.** Rejected: CSV files are
  hand-written and come from other tools, and the header row already says whether a file is a deck.
  Only a newer version of this app's own format is refused, because only that could mean a key
  this build would misread.
- **Resolve the reference in the import service or the screen** and pass an id to `addDeck`.
  Rejected for the reason ADR-0017 gave: the check must run against the state the deck is written
  into.
- **Rename `addDeck`'s `categoryId` input** to say it may carry a name. Rejected: it changes the
  context's shape and the action's for every caller, while the field already held an unresolved
  request; the import path names the value `categoryRef` up to the call.
- **Read `# title:` and `# description:` from a CSV as well.** Not asked for, and ADR-0017's reasons
  for not doing it stand; recorded as a possible follow-up.

## Consequences

### Positive

- The two files carry the same metadata, and a CSV can be recognised and versioned as a JSON file
  can.
- A built-in category round-trips through **both** files, and will across translated builds.
- A custom category now travels to another device that has a custom category of the same name, in
  both files.
- Nothing persisted changes: no key, no shape, no migration.

### Negative

- **A version 2 JSON file is refused by builds older than this record** as from a newer version.
- **A custom category still does not travel by itself**: on a device without a same-named custom
  category the deck imports uncategorised, and the user is not told. An import still never creates
  a category.
- **A custom category named exactly like a built-in id**, e.g. `default_law`, exports as that string
  and imports as the built-in category. `validateCategoryName` does not forbid such a name.
- **A version 1 CSV's built-in category is not recovered**, though its name is in the file.
- A JSON file loses the colour and icon of its custom category; they were never read.
- **The CSV title and description still do not round-trip.**
- The `addDeck` case now resolves by name as well as by id for every caller, so a hand-made deck's
  request goes through the wider rule; it is always an id or `null`, so the result is unchanged.

## Amendment 1 — 2026-11-05

Recorded after the work it describes, at the owner's request. The decision — one format, version
2, the same five metadata values in both files — is unchanged, and so is the file format: the CSV
already wrote `# title:` and `# description:`. One sub-decision of *Import*, *CSV*, changes: those
two lines are now read, so a CSV brings back the same metadata a JSON file does.

- **`title` and `description` are read from a CSV.** *"`title` and `description` are still not
  read"* no longer holds. Each is read like every other comment line — the value after the first
  colon, trimmed and then unescaped (`\\` → `\`, `\n` → a line feed), the first line for a key
  winning — by the parser this record added; as it anticipated, this is a change of rule, not of
  parser. `parseFlashcardsCsv` returns them as `title` and `description` beside `categoryRef`.
- **The deck is named after `title`, unless the line is missing or blank**; then it is named after
  the file by `deckNameFromFileName`, exactly as a JSON file without a usable title is. The choice
  is made once for both formats, in [`src/services/importDeck.ts`](../../../src/services/importDeck.ts).
- **The description is `description`, or `''` when the line is missing or blank.**
- **One difference from JSON remains in the trim.** A CSV value is trimmed *before* it is
  unescaped, so an escaped line break at either end survives as a line feed, where JSON trims the
  decoded string. The export writes the stored title and description, which the Edit deck and New
  deck screens and the JSON importer all trim, so only a hand-edited CSV produces one.
- **Every CSV with these lines is read the same way.** ADR-0016 wrote `# title:` and
  `# description:` from its first version, with the same escaping, so a version 1 CSV exported by
  an older build now also brings its title and description; so does a hand-written file, or another
  tool's `# title:` line. Comment lines stay optional, and a CSV without them imports as before.
- The rejected alternative *Read `# title:` and `# description:` from a CSV as well* is thereby
  adopted. Its reason — not asked for — no longer holds, and the cost ADR-0017 named, reversing
  the export's escaping, was already paid for `category`.
- The *Negative* consequence *"The CSV title and description still do not round-trip"* no longer
  holds: both files bring back a deck's title, description, category — where it resolves — and
  cards, modulo whitespace at either end (ADR-0017).
- The statements this supersedes in other records are amended there: ADR-0017 Amendment 3,
  ADR-0016 Amendment 5, ADR-0011 Amendment 5 and ADR-0003 Amendment 7.
- Nothing persisted changes: no storage key, no stored shape, no store action, no dependency, no
  permission. Builds from before this amendment still skip both lines.

## References

- [ADR-0016](0016-deck-export-file-formats.md) — the formats this record moves to version 2;
  amended by this record (Amendment 4)
- [ADR-0017](0017-deck-import-reads-exported-formats.md) — the importers; amended by this record
  (Amendment 2)
- [ADR-0014](0014-deck-belongs-to-one-category.md) — resolving a deck's category; amended by this
  record (Amendment 8)
- [ADR-0003](0003-single-context-reducer-store.md) — `addDeck` resolves in the reducer; amended by
  this record (Amendment 6)
- [ADR-0012](0012-custom-categories-third-storage-key.md) — permanent built-in ids, per-device
  custom ids
- [`src/utils/categories.ts`](../../../src/utils/categories.ts) — the reference and its resolution
- [`src/utils/deckExport.ts`](../../../src/utils/deckExport.ts),
  [`src/utils/deckImport.ts`](../../../src/utils/deckImport.ts),
  [`src/utils/csv.ts`](../../../src/utils/csv.ts) — the format, written and read
- [`src/state/reducer.ts`](../../../src/state/reducer.ts) — `addDeck`
- [`src/services/importDeck.ts`](../../../src/services/importDeck.ts) — the deck's name: the
  file's title, else its file name (Amendment 1)
- [ADR-0011](0011-deck-editing-is-one-action.md) — the description read back from a CSV; amended
  for it (ADR-0011 Amendment 5)
- ADR-0016 Amendment 5, ADR-0017 Amendment 3, ADR-0003 Amendment 7 — the CSV title and
  description read (Amendment 1)
- [`src/utils/sampleDeck.ts`](../../../src/utils/sampleDeck.ts), [`samples/`](../../../samples/) —
  regenerated in version 2
- [ARCHITECTURE.md §1, §2, §3, §8](../ARCHITECTURE.md) — updated for this record by the change
  that implemented it
