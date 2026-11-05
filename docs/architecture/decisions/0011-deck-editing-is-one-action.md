# ADR-0011: A deck is edited by one action, and a deck gains a description under the existing v1 key

- Status: Active
- Date: 2026-10-30
- Decision makers: Project owner
- Recorded ahead of the work it governs.

## Context

The app could import a deck and delete it, nothing more. The deck options menu's *Edit deck* item
was a stub. Editing a deck means changing its name, giving it a description (a field that does not
exist), changing the question and answer of existing cards, adding cards, and removing cards.

Three things make this more than a form:

- **A card carries history.** Its counters and `lastReviewedAt` are the only stored tallies
  ([ADR-0005](0005-answers-recorded-immediately.md)). Editing a card's text must keep them;
  removing a card necessarily discards them.
- **Sessions snapshot the deck** ([ADR-0002](0002-sessions-are-snapshots.md)): a `deckName` copy and
  a frozen `cardIds`. A rename must reach every session's `deckName` (ADR-0002 Amendment 4), and a
  removed card leaves ids behind. In an *active* session that is a dead end: the Study screen
  resolves the next card through the deck, finds none, and offers no way past it.
- **Persisted shape** ([ADR-0004](0004-versioned-defensive-storage.md)). A description is a new field
  on `Deck`.

## Decision

**One reducer action edits a deck.** `updateDeck` carries the deck id, the new `name` and
`description`, and the complete list of cards as they should be afterwards, each with an id. The
store function `updateDeck(deckId, edit)` mints an id for every card that has none, then dispatches
once, so no state and no save sees a half-edited deck. The editing screen keeps its changes in local
state and commits them with a single **Save**; nothing is written while the user types.

In the reducer, in one case:

- A card whose id exists keeps its counters and `lastReviewedAt`; only `question` and `answer`
  change. A card whose id is new starts with zero counters. A card missing from the list is removed,
  with its counters. The list's order becomes the deck's order.
- `name` is trimmed by the screen and written to the deck and to **every** session of the deck,
  cleared ones included.
- **Active sessions are repaired when cards are removed.** A removed card is dropped from the
  *unanswered* part of an active session's `cardIds` (everything at or after `results.length`). The
  answered prefix is left alone, so `results[i]` still lines up with `cardIds[i]` and the session's
  statistics do not change. If nothing unanswered is left the session completes; if it has no cards
  and no answers it is deleted.
- **Completed sessions are not touched**, apart from the name. Their `cardIds` may name cards that
  no longer exist, as ADR-0002 already allows; every consumer resolves ids through the deck.
- Cards added by an edit join no existing session.

**A deck has a `description`: a string, `''` when there is none.** It is stored on the deck under
`@easy-flashcards/decks/v1` without a new key. The loader reads a missing or non-string value as
`''`, which is the true value for every older deck (ADR-0004 Amendment 1). Import creates decks with
`''`. The Deck card shows it when it is not blank. It is not searched, and it is not part of the CSV
format: how a title and description are exported is deliberately left for later.

## Alternatives Considered

- **Separate actions (`renameDeck`, `addCard`, `updateCard`, `removeCard`) applied as the user
  taps.** Rejected: each tap would write storage, a half-finished edit could not be cancelled, and
  four actions would each need the session reconciliation. One commit point is also the one place to
  warn that removing cards deletes their statistics.
- **Leave sessions alone when a card is removed.** Rejected for active sessions: it leaves a session
  that cannot be finished. Tolerating stale ids was acceptable for completed ones only because
  nothing is waiting on them.
- **Remove answered cards from active sessions as well.** Rejected: it would shift `cardIds` out of
  step with `results`, and rewrite what the session already recorded.
- **A new storage key for descriptions.** Rejected: the field's default is true for every older
  deck, which ADR-0004 Amendment 1 absorbs under `/v1`.
- **Stable card identity by position rather than id.** Rejected: ids already exist, are what
  sessions and results refer to, and survive reordering.

## Consequences

### Positive

- Editing is atomic, cancellable until Save, and one reducer case with one test file's worth of
  behaviour.
- Editing a card's wording keeps its history; sessions referring to it keep working.
- No stored-shape break: no new key, no migration.

### Negative

- Removing a card deletes its counters for good, and the statistics of a session that included it are
  unchanged while the deck's are not, so a deck's totals can drop below the sum of its sessions'.
- An older build reading data this one wrote drops `description` on its first save, permanently.
  Nothing else is lost.
- The edit holds the whole deck in memory as local state, which is fine for the deck sizes the app
  is used with and would need virtualised editing beyond it.
- Deck order is now editable only by deleting and re-adding; there is no reorder control.

## Amendment 1 — 2026-10-30

[ADR-0014](0014-deck-belongs-to-one-category.md) gives a deck a category, chosen on the Edit deck
screen. The decision above is unchanged — a deck is still edited by **one** `updateDeck` action,
committed once by **Save**. Two details moved:

- **The payload carries the category.** `DeckEdit` — and so the `updateDeck` action — carries
  `categoryId: string | null` beside `name`, `description` and the cards. The reducer writes it to
  the deck in the same case, and writes `null` for an id that does not resolve to a default or
  stored custom category at dispatch time. Sessions are not touched by it.
- **The changed-check includes it.** `isDeckEditChanged` reports a change when `categoryId` differs
  from the deck's, so choosing only a category enables **Save**.

## Amendment 2 — 2026-11-03

Recorded ahead of the work it governs. The decision above is unchanged; this settles what it left
"deliberately for later" — how a deck's title and description are exported.

- **They are exported by [ADR-0016](0016-deck-export-file-formats.md)**, through the Deck options
  menu's **Export to file**: as the `title` and `description` keys of a JSON file, or as the
  `# title:` and `# description:` comment lines at the top of a CSV file. A description that is
  `''` is exported empty, and its line breaks are escaped so the comment stays on one line.
- **The import format is unchanged.** The importer still reads neither, still names an imported
  deck after its file, and still gives it the description `''`. Reading them back is ADR-0016's
  follow-up.
- Nothing persisted changes; `description` keeps its shape and its `''` default.

## Amendment 3 — 2026-11-04

Recorded ahead of the work it governs. The decision above is unchanged; this settles Amendment 2's
follow-up — reading a deck's title and description back on import — under
[ADR-0017](0017-deck-import-reads-exported-formats.md).

- **A JSON import reads both.** The deck is named after `title`, trimmed, unless it is not a string
  or is blank, in which case it is named after the file. Its description is `description`,
  trimmed — the same trim the Edit deck screen applies on Save — or `''` when it is not a string.
  The decision's line *"Import creates decks with `''`"* now holds for CSV only.
- **A CSV import reads neither.** Its `# title:` and `# description:` lines are skipped with the
  other comment lines; the deck is still named after its file and gets the description `''`.
  ADR-0016's escaping of line breaks in the comment is therefore never reversed by the app.
- **`addDeck` takes the description.** Its input gains a required `description` beside `name`, so
  the import passes it in the one `addDeck` dispatch rather than following with an `updateDeck`.
  Editing is unaffected: a deck is still edited by the one `updateDeck` action.
- Nothing persisted changes; `description` keeps its shape and its `''` default.

## Amendment 4 — 2026-11-04

Recorded ahead of the work it governs. The decision above is unchanged — a deck is still edited by
the one `updateDeck` action, committed once by **Save**. This records a second use of the same
form: **Add deck manually** in the Add deck menu, until now a placeholder, creates a deck by hand
on it.

- **The Edit deck form also creates a deck.** A second route in the Decks stack, `NewDeck`, with no
  params, is rendered by the same `EditDeckScreen` component in a *new deck* mode — the **New deck
  screen**. It starts blank: an empty title and description, no category, and **no cards** — no
  empty card is pre-added. The user adds cards with the form's existing **Add card** control.
- **It commits once, through `addDeck`, not `updateDeck`.** **Save** dispatches the existing
  `addDeck` once, with the trimmed title as `name`, the trimmed description, the chosen
  `categoryId` (ADR-0014 Amendment 5), `sourceFileName: null`, and the cards. Nothing is written
  while the user types, exactly as when editing. `addDeck` mints the deck and card ids, and every
  card starts with zero counters, as an imported card does.
- **Only the title and description are trimmed.** Card text is stored as typed, as an edit stores
  it; the import's trimming of card text is the importer's, not `addDeck`'s.
- **A deck may be created with no cards**, as an edit may already leave one with none. The empty
  deck is handled wherever the existing empty deck is.
- **Save is enabled once the draft differs from the blank form** — a non-blank trimmed title or
  description, a category, or any card. Pressing it still validates as an edit does: a blank title
  gives *Title needed*, and a card missing either side gives *Card incomplete*. A draft whose only
  change is whitespace in the title or description is not a change.
- **Leaving unsaved asks first**, with the same *Discard changes?* prompt as editing, its message
  reading *"This deck has not been saved."*
- **After Save the screen goes back to the Decks screen**, where the new deck appears. There is no
  success alert.
- **A repeated Save press must not create a second deck.** `updateDeck` is idempotent — a second
  dispatch of the same edit writes the same deck — but `addDeck` mints new ids on every call, so a
  double tap on **Save** would create two decks. The screen ignores any Save after the first that
  committed.
- **What does not apply in new-deck mode:** the *Deck not found* state, which needs a deck id, and
  the *Remove cards?* prompt, since a new deck has no stored cards to lose. Sessions are not
  touched; a new deck has none.
- **A third way to create a deck.** The decision's line *"Import creates decks with `''`"*, already
  narrowed to CSV by Amendment 3, gains a third creation path: a deck created by hand gets the
  description typed, trimmed, and `''` when none was.
- Nothing persisted changes: no storage key, no stored shape, and no new store action. A hand-made
  deck is stored exactly as an imported one, with `sourceFileName` `null`.

## References

- [`src/types.ts`](../../../src/types.ts) — `Deck.description`
- [`src/state/reducer.ts`](../../../src/state/reducer.ts) — `updateDeck`
- [`src/utils/deckEdit.ts`](../../../src/utils/deckEdit.ts) — the pure transforms
- [`src/storage/decksStorage.ts`](../../../src/storage/decksStorage.ts) — the `description` default
- [ADR-0002](0002-sessions-are-snapshots.md) — snapshots; Amendment 4's rename rule is met here
- [ADR-0004](0004-versioned-defensive-storage.md) — Amendment 1, new fields under `/v1`
- [ADR-0005](0005-answers-recorded-immediately.md) — card counters
- [ADR-0014](0014-deck-belongs-to-one-category.md) — the deck's category (Amendment 1); the
  category of a deck created by hand (Amendment 4; ADR-0014 Amendment 5)
- [ADR-0016](0016-deck-export-file-formats.md) — exporting the title and description (Amendment 2)
- [ADR-0017](0017-deck-import-reads-exported-formats.md) — importing them back from JSON
  (Amendment 3)
- [ADR-0003](0003-single-context-reducer-store.md) — `addDeck` gains a second caller
  (Amendment 4; ADR-0003 Amendment 5)
- [`src/screens/EditDeckScreen.tsx`](../../../src/screens/EditDeckScreen.tsx) — the form, in both
  modes (Amendment 4)
