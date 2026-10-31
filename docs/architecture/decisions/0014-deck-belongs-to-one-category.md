# ADR-0014: A deck belongs to at most one category, stored on the deck under the existing v1 key

- Status: Active
- Date: 2026-10-30
- Decision makers: Project owner
- Recorded ahead of the work it governs.

## Context

[ADR-0012](0012-custom-categories-third-storage-key.md) added categories — 21 built-in ones with
permanent `default_<key>` ids, and the user's own under `@easy-flashcards/categories/v1` — but
nothing referred to one. It named assigning decks to categories as the next step, and **required
that change to decide, in its own ADR, what deleting a category in use does**. This is that ADR.

The user wants to give a deck a category on the **Edit deck screen**, and to see the category's
icon on the deck's **Deck card** and on the **Session card** of its sessions on the Learn screen.

In this repo anything that changes what is persisted needs an ADR and the owner's approval
([ADR-0004](0004-versioned-defensive-storage.md), `AGENTS.md` *What to ask before doing*). **The
project owner approved the decision below on 2026-10-30.**

The forces:

- **A reference now crosses two keys.** The deck lives under `@easy-flashcards/decks/v1`; a custom
  category under `@easy-flashcards/categories/v1`. Each key has its own loader, and a deck can be
  read back pointing at a category that is no longer there — deleted, or lost to a corrupt
  categories key.
- **Persisted shape** (ADR-0004). A category reference is a new field on `Deck`, and the decks key
  holds the user's most valuable data.
- **Sessions snapshot their deck** ([ADR-0002](0002-sessions-are-snapshots.md)): `deckId`, a copy
  of `deckName`, a frozen `cardIds`. Whether a session should snapshot its category too has an
  obvious-looking wrong answer.
- **Editing a deck is one action** ([ADR-0011](0011-deck-editing-is-one-action.md)). The category
  is one more thing the Edit deck screen changes.

## Decision

### The field

- **`Deck.categoryId: string | null`**, required in the type. `null` means *no category*. A deck
  has at most one category.
- It is stored on the deck under **`@easy-flashcards/decks/v1`**, with no new key. Per
  [ADR-0004](0004-versioned-defensive-storage.md) Amendment 1 it stays under `/v1`, because *no
  category* is the **true** value for every deck written before this record — no older build could
  assign one.
- **An imported deck starts with no category.** The CSV format is unchanged.

### The loader

- A **non-empty string** is kept **as stored**. It is **not** checked against the categories:
  each key's loader is independent, reads only its own key, and must not depend on another key
  having loaded.
- **Anything else** — missing, `null`, a non-string, `''` — reads as `null`.

### Resolving an id

- A deck's category is the default or stored custom category whose id equals `categoryId`. **An id
  that resolves to neither displays as *no category*, everywhere.** Nothing crashes, nothing shows
  a placeholder, and the stored id is not rewritten on load.
- The resolution is derived, never stored, and is one pure function in `src/utils/`, used by every
  screen and by the reducer, so there is one answer to "which category is this deck in?".

### Assigning: through `updateDeck`

- The category is chosen on the **Edit deck screen** and committed with the rest of the edit by the
  one `updateDeck` action (ADR-0011 Amendment 1). There is no separate assign action.
- **`updateDeck` writes `null` for an id that does not resolve** at dispatch time. This covers a
  category deleted on the Categories tab while the deck's edit was open, and a deck carrying a
  dangling id from storage.

### Deleting a category detaches its decks

- **`deleteCategory` sets `categoryId` to `null` on every deck that uses the category, in the same
  dispatch** that removes the category. No state and no save ever holds a deck pointing at a
  category that was deleted through the app.
- **A default id or an unknown id still leaves state unchanged** — decks included. Defaults cannot
  be deleted (ADR-0012), and an unknown id deletes nothing, so it detaches nothing.
- **The delete confirmation tells the user how many decks lose the category.** The count is derived
  from the decks when the confirmation opens; it is not stored.
- Detaching changes nothing else on a deck: not its cards, counters, `lastStudiedAt` or sessions.

### Sessions do not store a category

- A `Session` gets **no category field**. The Learn screen resolves a session's category at render
  time through `session.deckId` → `deck.categoryId`.
- So **re-categorising a deck changes the icon on its existing sessions**, cleared ones included,
  and deleting a category removes it from them.
- **A session whose deck no longer exists shows no category icon.**
- [ADR-0002](0002-sessions-are-snapshots.md) Amendment 6 records why this is not a breach of the
  snapshot rule.

### Display

- **A deck with no category shows nothing and reserves no gap** — on the Deck card and on the
  Session card alike. A dangling id displays exactly as `null` does.

### Not decided here

Each of these is a follow-up, and none is blocked by this record:

- a deck count ("N entries") on the Categories tab's tiles;
- filtering the Decks or Learn screen by category — the Header toolbar's **Filter button** stays a
  placeholder;
- the category in Statistics;
- a category column in the CSV format.

## Alternatives Considered

- **Block deleting a category that is in use.** The user would have to re-categorise every deck
  first, with no screen that lists which decks those are. Rejected: detaching loses only the
  assignment, and the confirmation says how many decks lose it.
- **Leave decks pointing at a deleted category, and let display treat it as none.** One action
  fewer to change. Rejected: storage would accumulate dead ids that a later category could never
  reuse safely, and every consumer would carry the rule forever. Display does treat an unknown id as
  none — but as a defence against data the app did not write, not as the way deletion works.
- **Clean dangling ids in the decks loader, against the loaded categories.** Rejected: it couples
  two loaders that are independent today, and a categories key that failed to parse — reading as
  `[]` under ADR-0004 — would then strip every custom assignment on the next save. Keeping the id
  and resolving at display loses nothing until the user edits the deck.
- **Store a deck's categories as a list (`categoryIds: string[]`).** Rejected: the approved scope
  is one category per deck, and a list would need an order and a "primary" for the icon.
- **Store the category on the session as well, as a snapshot.** Rejected: a category is
  presentation, not part of what a session recorded, and a snapshot would leave old sessions showing
  a category the deck no longer has, or one that was deleted. ADR-0002 Amendment 6.
- **Keep assignments in the categories key, as a map from category to deck ids.** Puts the
  relationship in the key an older build never touches, so a downgrade would keep it. Rejected: a
  deck's own properties belong on the deck, deleting a deck would need to rewrite the categories
  key, and the map would have to be reconciled against decks the categories loader cannot see.
- **A new decks key (`/v2`).** Rejected: the field's default is true for every older deck, which
  ADR-0004 Amendment 1 absorbs under `/v1`.

## Consequences

### Positive

- No new key and no migration; every existing deck reads as uncategorised, which is what it is.
- Deleting a category is one atomic dispatch; the app never writes a deck pointing at a category it
  deleted.
- One rule for every unexpected id — display as none, write `null` on the next save — so a corrupt
  or partial categories key degrades to missing icons rather than errors.
- Sessions stay a snapshot of what was studied; nothing about them changes shape.

### Negative

- **A downgrade loses every assignment, permanently.** An older build rebuilds each deck without
  `categoryId`, and its first save writes that back. This is the same loss already accepted for
  `okeishCount` ([ADR-0007](0007-okeish-third-answer.md)) and `description` (ADR-0011). The custom
  categories themselves survive, because an older build never touches their key (ADR-0004
  Amendment 3).
- **A dangling id can sit in storage indefinitely.** It is written over only when the deck is next
  saved through `updateDeck`, or when a category with that id is deleted — which, for an id the app
  did not mint, never happens.
- **Re-categorising rewrites history's presentation.** A session studied under one category shows
  the deck's current one. That is the intent, but it means the Learn screen cannot show which
  category a deck had when a session was studied.
- **`deleteCategory` now touches decks**, so it rewrites the decks key as well as the categories key
  on the save that follows. Every save writes every key already ([ADR-0003](0003-single-context-reducer-store.md),
  ADR-0004 Amendment 3), so this adds no write, but it is the first category action whose effect
  reaches the decks.
- **A default category still cannot be withdrawn freely.** Withdrawing one would leave decks
  showing *no category* — legible, not broken — but the user would see a deck lose its category
  without having changed it. ADR-0012's rule stands: removing a default needs a rule of its own.
- Category icons render on Android only ([ADR-0013](0013-category-icons-are-android-vector-drawables.md)),
  so on iOS a categorised deck looks uncategorised.

## Amendment 1 — 2026-10-31

The decision above is unchanged. Two details of it are recorded more precisely:

- **The category also shows in two Menu sheet titles.** The Menu sheet of the **Deck options
  menu** and of the **Session options menu** shows the deck's **Category square**, at 28 points,
  immediately before the sheet's title (the deck name). It is the same category the Deck card or
  Session card already shows, passed down rather than resolved again, so the rules above hold
  unchanged: a deck with no category, a dangling id and a session whose deck no longer exists show
  no square and reserve no gap, and the title is then laid out as before. No other Menu sheet shows
  a category. Nothing persisted changed.
- **On iOS a categorised deck does not look uncategorised.** The Negative consequence above is
  wrong. A Category square paints its background in the category's colour itself, and only the
  icon inside it is an Android vector drawable, so on iOS a Category square would show as a
  coloured square with no glyph — on the Deck card, the Session card, the Category field and the
  two sheet titles alike. The Category tile is drawn the same way and would show the same. This is
  read from the code, not observed: the iOS project has never been built.

## References

- [ADR-0002](0002-sessions-are-snapshots.md) — snapshots; amended by this record (Amendment 6)
- [ADR-0004](0004-versioned-defensive-storage.md) — Amendment 1, new fields under `/v1`;
  Amendment 3, the categories key and downgrades
- [ADR-0007](0007-okeish-third-answer.md) — the downgrade loss first accepted
- [ADR-0011](0011-deck-editing-is-one-action.md) — `updateDeck`; amended by this record
  (Amendment 1)
- [ADR-0012](0012-custom-categories-third-storage-key.md) — categories, and the requirement for
  this record; amended by this record (Amendment 1)
- [ADR-0013](0013-category-icons-are-android-vector-drawables.md) — the icons shown
- [`src/types.ts`](../../../src/types.ts) — `Deck`
- [`src/storage/decksStorage.ts`](../../../src/storage/decksStorage.ts) — the `categoryId` default
- [`src/state/reducer.ts`](../../../src/state/reducer.ts) — `updateDeck`, `deleteCategory`
- [`src/utils/categories.ts`](../../../src/utils/categories.ts),
  [`src/utils/deckEdit.ts`](../../../src/utils/deckEdit.ts)
- [`src/components/CategorySquare.tsx`](../../../src/components/CategorySquare.tsx),
  [`src/components/MenuSheet.tsx`](../../../src/components/MenuSheet.tsx) — the square, and the
  sheet title that shows it (Amendment 1)
- [ARCHITECTURE.md §1, §2, §3, §5, §8](../ARCHITECTURE.md) — updated for this record by the change
  that implemented it
- [AGENTS.md](../../../AGENTS.md) — *State ownership*, *Storage keys*, *What to ask before doing*
