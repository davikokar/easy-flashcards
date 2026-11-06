# ADR-0003: One React Context reducer is the whole store

- Status: Active
- Date: 2026-10-26
- Decision makers: Project owner
- Recorded retrospectively: the choice was made during initial implementation.

## Context

The app's entire state is two arrays — decks and sessions — plus a load flag and an error. Every
screen needs some of it, and the three tabs are siblings rather than a chain, so prop drilling is
not available: the Statistics screen and the Decks screen have no common parent but the navigator.

The original brief left the choice of state library open, listing the usual candidates. Something
had to be decided, and the decision has to survive the next feature, not just the current one.

What the state actually does:

- It changes rarely — once per answer, once per import, once per delete.
- Every mutation is a whole-array replacement, because the store is persisted whole.
- Nothing is async beyond the initial load and the writes that follow a change.
- Nothing is per-screen. There is one copy of the truth and every screen reads it.

## Decision

One React Context over `useReducer`, in
[`src/state/DecksContext.tsx`](../../../src/state/DecksContext.tsx). No Redux, no Zustand, no
MobX, no React Query, and no second provider.

- The reducer is the only place state changes. Its action set is the API:
  `loaded`, `loadFailed`, `addDeck`, `deleteDeck`, `renameDeck`, `startSession`, `recordAnswer`,
  `deleteSession`, `resetDeckStats`.
- `DecksProvider` wraps the whole app in [`App.tsx`](../../../App.tsx) and owns both effects — the
  mount load and the save that follows every change.
- `useDecks()` is the only way in, and it throws if used outside the provider.
- Screens call an exposed function. **A screen never reads state and writes it back**, and there
  is no `dispatch` in the context value to tempt one.
- **Derived values are not stored.** Rates, progress, orderings and rankings are pure functions in
  [`src/utils/stats.ts`](../../../src/utils/stats.ts), called from a `useMemo` in the screen. The
  only persisted tallies are a card's raw `okCount` and `notOkCount`.

A new operation is a new action plus a new function on `DecksContextValue`. It is not a new store.

## Alternatives Considered

- **Redux Toolkit.** Would bring devtools, middleware, and a selector memoisation story. Rejected
  as a dependency and a layer out of proportion to two arrays, for an app with no async
  orchestration to coordinate.
- **Zustand or Jotai.** Lighter than Redux and would remove the provider. Rejected because the
  gain over `useReducer` here is ergonomic rather than structural, and a global store outside the
  React tree makes the "no screen writes storage" boundary harder to see.
- **Several small contexts — one for decks, one for sessions.** Fewer re-renders. Rejected because
  the two are not independent: deleting a deck deletes sessions, recording an answer writes both,
  and splitting them would put that coupling in a component instead of in a reducer.
- **`useState` in a context rather than `useReducer`.** Rejected because the interesting operations
  are multi-object — `recordAnswer` touches a session and a card; `deleteDeck` touches both arrays
  — and those are exactly what a reducer expresses and a setter does not.

## Consequences

### Positive

- No state dependency at all, and nothing to keep up to date.
- Every way the state can change is visible in one `switch` in one file, which is the first thing
  worth knowing about the app.
- Persistence has one hook point: one effect watching the two arrays, so there is no path that
  changes state without saving it.
- Testing a change to state logic would mean testing a pure function — if it were extracted (see
  Negative).

### Negative

- **Any change re-renders every consumer.** The context value is a new object on each state change,
  so all three tabs re-render on each answer. At the sizes an imported CSV produces this is not
  measurable, and it is not a design that would survive a large library.
- **The reducer is untested**, because it lives in a `.tsx` file beside the provider and testing it
  means rendering. It is also the most behaviour-dense code in the app. Extracting it into a `.ts`
  file would fix this and has not been done — recorded in
  [ARCHITECTURE.md §8](../ARCHITECTURE.md).
- No devtools, no time-travel, no action log. Debugging a state bug means reading the reducer.
- Everything is in memory at once. There is no pagination and no partial load, so deck size is
  bounded only by the device.

## Amendment 1 — 2026-10-30

The decision above is unchanged — one Context over `useReducer`, one provider, no second store. Two
details moved:

- **The reducer has its own file.** `State`, `initialState`, the `Action` union and `reducer` now
  live in [`src/state/reducer.ts`](../../../src/state/reducer.ts), plain TypeScript with no React
  import; [`DecksContext.tsx`](../../../src/state/DecksContext.tsx) keeps the provider, its effects
  and the exposed functions. The *Negative* consequence "the reducer is untested" no longer holds:
  `__tests__/reducer.test.ts` tests every action. The *Positive* "every way the state can change is
  visible in one `switch` in one file" now points at `reducer.ts`.
- **The action set changed.** `renameDeck` was removed as dead code (see
  [ADR-0002](0002-sessions-are-snapshots.md) Amendment 4). Since this record was written,
  `replaySession`, `recordReviewAnswer`, `clearCompletedSessions` and `clearSession` were added;
  the reducer's `Action` union is the current list.

## Amendment 2 — 2026-10-30

[ADR-0012](0012-custom-categories-third-storage-key.md) adds custom categories. The decision above
is unchanged — they go into the same store, not a second one. Three details moved:

- **`State` gains a third array, `categories`**, holding the user's custom categories only. The 21
  default categories are constants in code and never enter the state; the full list the app shows
  is derived by a pure function, as every other derived value is.
- **The action set gains `addCategory` and `deleteCategory`**, and `loaded` carries the categories
  alongside the decks and sessions. `DecksContextValue` gains `categories` and one function per new
  action; `addCategory` mints the id, as `addDeck` and `startSession` do. No existing action touches
  categories.
- **"One effect watching the two arrays"** in *Positive* is now one effect watching three, and it
  writes all three keys ([ADR-0004](0004-versioned-defensive-storage.md) Amendment 3). The store
  keeps its name, `DecksContext`.

## Amendment 3 — 2026-10-30

[ADR-0014](0014-deck-belongs-to-one-category.md) lets a deck refer to a category. The decision above
is unchanged — still one store — but Amendment 2's "no existing action touches categories" no longer
holds, in either direction:

- **`updateDeck` reads `state.categories`.** It resolves the edit's `categoryId` against the
  defaults and the stored custom categories, and writes `null` for an id that resolves to neither.
- **`deleteCategory` writes `state.decks`.** In the same dispatch that removes the category it sets
  `categoryId` to `null` on every deck that used it. It is the first category action whose effect
  reaches another array, which a single store makes one atomic step rather than two saves.

## Amendment 4 — 2026-11-04

Recorded ahead of the work it governs. [ADR-0017](0017-deck-import-reads-exported-formats.md)
lets a JSON import carry a deck's description and category. The decision above is unchanged —
still one store, one `addDeck` action, one dispatch per import. Two details moved:

- **`addDeck` reads `state.categories`.** The reducer's `addDeck` case resolves the new deck's
  `categoryId` with `findCategory` against the built-in and stored custom categories, and stores
  `null` for an id that resolves to neither, as `updateDeck` does (Amendment 3). It is resolved in
  the reducer, not by the caller, so it is checked against the state the deck is written into.
- **`DecksContextValue.addDeck` changes shape.** Its input gains two required fields,
  `description: string` and `categoryId: string | null`, beside `name`, `sourceFileName` and
  `cards`; a CSV import passes `''` and `null`. The function still mints every id and returns the
  deck it dispatched — whose `categoryId` is the one requested, so a caller must read the stored
  category from the store, not from the return value. Every consumer of the context type sees the
  change; its only caller is the Decks screen.

## Amendment 5 — 2026-11-04

Recorded ahead of the work it governs. [ADR-0011](0011-deck-editing-is-one-action.md) Amendment 4
lets the Edit deck form create a deck by hand, as the **New deck screen**. The decision above is
unchanged — still one store, one `addDeck` action, one dispatch per deck created. Three details are
recorded:

- **`addDeck` gains a second caller.** Amendment 4's *"its only caller is the Decks screen"* no
  longer holds: `EditDeckScreen`, in its new-deck mode, calls `addDeck` once on **Save**, passing
  `sourceFileName: null`. The action's shape is unchanged, and so is `DecksContextValue`; no action
  and no context function is added. The category is resolved in the reducer, as Amendment 4 set
  up ([ADR-0014](0014-deck-belongs-to-one-category.md) Amendment 5).
- **`addDeck` is not idempotent.** It mints new ids on every call, so a second call with the same
  input creates a second deck. A caller that can fire twice — a double-tapped **Save** — must guard
  itself; the store does not deduplicate.
- Nothing persisted changes: no storage key and no stored shape.

## Amendment 6 — 2026-11-05

Recorded ahead of the work it governs, under [ADR-0019](0019-deck-file-format-version-2.md). The
decision above is unchanged — one store, one `addDeck` action, one dispatch per deck.

- **`addDeck` resolves its requested category with ADR-0019's resolver, not `findCategory`.**
  Amendment 4's *"resolves the new deck's `categoryId` with `findCategory`"* now reads: with the
  resolver in `src/utils/categories.ts`, which matches a built-in id, then a stored custom id, then
  a stored custom name ignoring case. It still runs in the reducer, against `state.categories`, and
  still stores only a resolved id or `null`. `updateDeck` keeps `findCategory`.
- **No shape changes.** The `addDeck` action and `DecksContextValue.addDeck` keep their fields; the
  input's `categoryId` is documented as a request — an id, or from an imported file a category
  reference — which it already was in being unresolved.
- Nothing persisted changes.

## Amendment 7 — 2026-11-05

Recorded after the work it describes, under [ADR-0019](0019-deck-file-format-version-2.md)
Amendment 1. The decision and `addDeck`'s shape are unchanged.

- Amendment 4's *"a CSV import passes `''` and `null`"* no longer holds. A CSV import passes the
  file's title as `name` (the file name when it has none), its `# description:` line as
  `description` (`''` when it has none) and, since Amendment 6, its `# category:` reference as
  `categoryId` — the same fields a JSON import passes.
- Nothing persisted changes.

## Amendment 8 — 2026-11-05

Recorded ahead of the work it governs, under
[ADR-0020](0020-ui-text-translated-through-typed-catalogue.md), with the owner's approval. The
decision above is unchanged — one Context over `useReducer` holds all app data, and there is no
second store. One sentence of it is narrowed:

- **"No second provider" now reads "no second store".** ADR-0020 adds `I18nProvider` in
  `src/i18n/I18nProvider.tsx`, a second React Context whose value is a `Translator` derived from
  the device language when it mounts. It is configuration, not a store: no reducer, no actions,
  no dispatch, no load or save effect, nothing persisted, and nothing in it that the user changes.
  [`App.tsx`](../../../App.tsx) nests it outside the store, as
  `SafeAreaProvider > I18nProvider > DecksProvider > RootNavigator`.
- **The store does not hold text and does not read the language.** The reducer and
  `DecksContextValue` are unchanged; `State.error` keeps the raw diagnostic text, and the screen
  that shows it supplies the translated wording.
- **`useT()` does not throw outside its provider**, unlike `useDecks()`: it returns the English
  translator, because a component with no provider above it should still read as English rather
  than crash.
- **What would make it a store.** Anything the user chooses or the app saves — an in-app language
  choice, above all — is not allowed in this context. Such a setting is persisted state, so it
  needs a storage key ([ADR-0004](0004-versioned-defensive-storage.md)), an ADR and approval, and
  then belongs in this store or in a decision that says otherwise.
- Nothing persisted changes.

## References

- [`src/state/reducer.ts`](../../../src/state/reducer.ts)
- [`src/state/DecksContext.tsx`](../../../src/state/DecksContext.tsx)
- [`src/utils/stats.ts`](../../../src/utils/stats.ts)
- [ADR-0004](0004-versioned-defensive-storage.md) — the persistence this store drives
- [ADR-0012](0012-custom-categories-third-storage-key.md) — the third array (Amendment 2)
- [ADR-0014](0014-deck-belongs-to-one-category.md) — decks refer to categories (Amendment 3)
- [ADR-0017](0017-deck-import-reads-exported-formats.md) — `addDeck` takes a description and a
  category (Amendment 4)
- [ADR-0011](0011-deck-editing-is-one-action.md) — the New deck screen, `addDeck`'s second caller
  (Amendment 5; ADR-0011 Amendment 4)
- [ADR-0019](0019-deck-file-format-version-2.md) — `addDeck` resolves a category reference
  (Amendment 6); a CSV import passes its title and description (Amendment 7)
- [ADR-0020](0020-ui-text-translated-through-typed-catalogue.md) — the read-only i18n context,
  which is not a store (Amendment 8)
- [ARCHITECTURE.md §2, §3](../ARCHITECTURE.md)
