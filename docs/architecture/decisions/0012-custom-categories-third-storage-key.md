# ADR-0012: Custom categories live under a third storage key

- Status: Active
- Date: 2026-10-30
- Decision makers: Project owner
- Recorded ahead of the work it governs.

## Context

The app is gaining a **Categories** tab: a list of subject categories, each with a name, an icon
and a colour. Twenty-one of them ship with the app — astronomy, mathematics, botany, gastronomy,
computer science and so on — and the user can add their own, choosing an icon and a colour from
the same sets the built-in ones use.

The user's own categories have to survive a restart, so they are persisted, and in this repo
anything that changes what is persisted always needs an ADR and the owner's approval
([ADR-0004](0004-versioned-defensive-storage.md), `AGENTS.md` *What to ask before doing*). **The
project owner approved the decision below, including the new storage key, on 2026-10-30.**

The forces:

- **Nothing refers to a category yet.** Assigning decks to categories is the obvious next step but
  is not part of this work. When it comes, a deck will hold a category id, so every id handed out
  now — a built-in one above all — has to stay valid for good.
- **Categories are independent of decks and sessions.** A category is not part of a deck, does not
  change when a deck is studied, and is not touched by any existing action.
- **The two existing keys hold the user's most valuable data.** Changing the shape of either for
  data that has nothing to do with it puts that data at risk for no benefit.
- **There is one store and one save path** ([ADR-0003](0003-single-context-reducer-store.md)), and
  a failed load must not be followed by a save (ADR-0004 Amendment 2).

## Decision

### The built-in categories are code, not data

- The 21 **default categories** are constants in a pure module in [`src/utils/`](../../../src/utils/),
  each with a **permanent id** of the form `default_<key>` (for example `default_astronomy`), a
  name, an icon key and a colour.
- They are **never stored**, never appear in the store's state, and cannot be renamed, recoloured,
  deleted or hidden.
- A default id, once shipped, is never changed or reused, because a later change will let decks
  refer to it.

### Custom categories are stored under a third key

- **Key `@easy-flashcards/categories/v1`**, owned by a new module,
  [`src/storage/categoriesStorage.ts`](../../../src/storage/categoriesStorage.ts), which owns
  reading, writing and normalising it. Nothing else calls AsyncStorage for it.
- It holds **only custom categories**, as a whole array of
  `Category { id, name, color, icon, createdAt }`:
  - `id` — minted by `createId('category')` in `DecksProvider`, as deck and session ids are. The
    `category_` prefix means a minted id can never take the form of a default id.
  - `name` — trimmed, as entered.
  - `color` — a hex colour string, chosen from the palette.
  - `icon` — an icon key, chosen from the icon set ([ADR-0013](0013-category-icons-are-android-vector-drawables.md)).
  - `createdAt` — a `Date.now()` number, as every timestamp in the app is.
- The list of every category the app shows — defaults and customs together — is **derived**, by a
  pure function, and never stored.

### Choices are shared with the defaults

- A custom category chooses its icon from **the same 21 icons** the defaults use, and its colour
  from **the same 21-colour palette**. The palette lives in [`src/theme.ts`](../../../src/theme.ts),
  beside the rest of the design tokens.

### Two operations: add and delete

- **`addCategory`** appends one custom category. **`deleteCategory`** removes one by id, and does
  nothing for an id that is not a stored custom category — which includes every default id.
- There is **no rename and no recolour** yet. Deleting loses nothing but the category itself,
  because nothing refers to a category yet.

### The name rule

- A name is **trimmed**, must be **non-empty**, at most **30 characters**, and **unique ignoring
  case across defaults and customs together**.
- The rule is a pure function in `src/utils/`, with a test, and is applied **on creation only**. The
  loader does not re-apply it to stored rows (see *Defensive read*).

### Defensive read

The loader follows [ADR-0004](0004-versioned-defensive-storage.md) and never throws on bad data:

- a row with no string `id`, or with an empty name, is dropped;
- a row whose `id` repeats an earlier row's is dropped — **the first wins**;
- a `color` that is not a hex colour string reads as **the first palette colour**. A well-formed
  hex colour that is not in the current palette is kept, so a later palette change does not repaint
  existing categories;
- an `icon` that is not a known icon key reads as **a designated fallback icon**, named in code
  beside the icon keys;
- a missing or non-numeric `createdAt` reads as `Date.now()`;
- a missing key, or a key that does not parse as an array, reads as `[]`
  ([`parseStoredArray`](../../../src/utils/storedArray.ts)).

Names that collide ignoring case, or exceed 30 characters, are kept as stored. Only the app writes
this key, and it applies the name rule before it does.

### Loading and saving

- The store's state holds a **third array, `categories`**, of custom categories only
  (ADR-0003 Amendment 2).
- The mount load reads all three keys together. **If any one of them fails, the whole load
  fails**: the store starts empty with `error` set, as it does today.
- **One save effect writes all three keys**, each as a whole array, and stays off while `error` is
  set (ADR-0004 Amendment 3).

## Alternatives Considered

- **Store the defaults too, seeded on first launch.** One list, all of it data. Rejected: a default
  would then be user data that a code change could not correct, its id would depend on a seeding
  run rather than on the code, and every later change to the defaults would need a migration.
- **Store categories inside the decks key.** No new key. Rejected: it changes the shape of the most
  valuable key for data that has nothing to do with decks, and an older build reading it would
  drop the categories on its first save — where a separate key is never touched by an older build.
- **A second store or context for categories.** Rejected by
  [ADR-0003](0003-single-context-reducer-store.md): one store, one save path. A second one would
  also need its own copy of the failed-load rule.
- **Rename and recolour now.** Rejected for scope. Both are additive later: a new action each, no
  change to the stored shape.
- **Hiding default categories.** Rejected by the owner. It would also be the first stored state
  about a default, which this decision avoids entirely.

## Consequences

### Positive

- The existing two keys do not change shape, so no existing data is at risk.
- **A downgrade is safe.** An older build never reads or writes the categories key; the custom
  categories are still there when the newer build is reinstalled.
- Default ids are fixed in code, so assigning decks to categories later can refer to them without a
  migration.
- The name rule, the derived list and the loader's repairs are pure or mocked-AsyncStorage code, so
  all of it is testable.

### Negative

- **A third key, a third module and a third write.** Every state change — an answer included —
  rewrites the categories key too. It is small, but it is another write that can fail silently.
- **One failed key blocks the whole app's saves for that run.** A categories key AsyncStorage cannot
  read stops decks and sessions being saved as well. This is the existing rule, applied to a key
  that matters less than the other two.
- Stored names are not re-checked on load, so a hand-edited or foreign write could leave two
  categories whose names differ only in case.
- The defaults can never be withdrawn freely. Once decks can refer to them, removing one will need
  a rule for the decks that do.
- Delete is safe **only while nothing refers to a category**. The change that assigns decks to
  categories must decide what deleting a used category does, and that decision needs its own ADR.

## Amendment 1 — 2026-10-30

[ADR-0014](0014-deck-belongs-to-one-category.md) is the ADR the last *Negative* consequence above
required: a deck now holds `categoryId`, so **"nothing refers to a category" no longer holds** —
in *Context*, in *Two operations*, and in that consequence. The decision above is unchanged: the
defaults are still code, custom categories are still the only stored ones, under the same key, and
there is still no rename or recolour. One detail moved:

- **`deleteCategory` also detaches the category from every deck that uses it**, setting their
  `categoryId` to `null` in the **same dispatch** that removes the category. Deleting a category in
  use therefore loses the category and those decks' assignment to it, and nothing else. A default
  id or an id that is not a stored custom category still leaves state unchanged, decks included.
## Amendment 2 — 2026-10-31

Recorded ahead of the work it governs, together with
[ADR-0013](0013-category-icons-are-android-vector-drawables.md) Amendment 2. The owner approved
the direction on 2026-10-31: more icons to choose from when creating a custom category, with no
change to the storage key or its shape. The decision above stands; one detail moves.

**A custom category chooses its icon from the full icon set**, not from "the same 21 icons the
defaults use" (*Choices are shared with the defaults*): the 21 icons of the default categories
plus the extra icons ADR-0013 Amendment 2 adds. The colour is still chosen from the same palette.

What does not move:

- **The default categories are exactly as they were** — the same 21, with the same ids, icons,
  colours and order, and each still uses its own icon exactly once. What no longer holds is that
  the defaults' icons *are* the icon set: an extra icon belongs to no default category, and no
  default category is added for one.
- **The stored shape is unchanged** and the key stays `@easy-flashcards/categories/v1`. `icon` is
  still one icon-key string; it only has more valid values. Nothing older needs converting, because
  every value an older build wrote is still valid.
- **The loader rule is unchanged**: an `icon` that is not a known key reads as the fallback icon.
  "Known" now means the full set, so an extra key is kept. The fallback stays a **default
  category's icon** (`literature` today), because that is the only kind of key every build with
  this storage key knows.
- **The name rule is unchanged.** It compares a new name with the default and custom categories'
  names only. An icon's label is not a category name, so naming a custom category after an icon is
  allowed.

**The downgrade consequence, precisely.** The *Positive* consequence "a downgrade is safe" was
written about builds that predate this key, and for them it still holds: they never read or write
it. It does **not** hold for a build that has categories but predates this amendment. That build's
loader does not know an extra key, so it reads every custom category with an extra icon as the
fallback icon, and shows that icon. Its save effect skips the run's first state after loading, so
nothing is written yet — but the **first state change of any kind in that run**, an answer
included, rewrites the categories key whole, with the fallback icon in place of the extra one.
Reinstalling a newer build then shows the fallback icon: the original choice is lost, silently and
for good. The category's id, name, colour and `createdAt` survive, and so does every deck's
assignment to it. This is the same kind of loss
[ADR-0004](0004-versioned-defensive-storage.md) Amendment 1 records for Okeish, it is the cost of
keeping the key at `/v1`, and nothing blocks a downgrade, because `versionCode` has never been
bumped.
## References

- [ADR-0003](0003-single-context-reducer-store.md) — the store; amended by this record
  (Amendment 2)
- [ADR-0004](0004-versioned-defensive-storage.md) — versioned keys and the defensive read; amended
  by this record (Amendment 3)
- [ADR-0013](0013-category-icons-are-android-vector-drawables.md) — the icons a category chooses
  from; its Amendment 2 widens the set (Amendment 2 here)
- [ADR-0014](0014-deck-belongs-to-one-category.md) — decks refer to categories; what deleting one
  in use does (Amendment 1)
- [`src/storage/categoriesStorage.ts`](../../../src/storage/categoriesStorage.ts)
- [`src/utils/categories.ts`](../../../src/utils/categories.ts) — the defaults, the icon keys and
  the name rule
- [`src/utils/storedArray.ts`](../../../src/utils/storedArray.ts)
- [`src/theme.ts`](../../../src/theme.ts) — the palette
- [`src/state/reducer.ts`](../../../src/state/reducer.ts),
  [`src/state/DecksContext.tsx`](../../../src/state/DecksContext.tsx)
- [ARCHITECTURE.md §5](../ARCHITECTURE.md) — updated for this record by the change that
  implemented it
- [AGENTS.md](../../../AGENTS.md) — *Storage keys*, *What to ask before doing*
