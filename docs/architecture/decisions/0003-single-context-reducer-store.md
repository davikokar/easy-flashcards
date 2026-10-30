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

## References

- [`src/state/reducer.ts`](../../../src/state/reducer.ts)
- [`src/state/DecksContext.tsx`](../../../src/state/DecksContext.tsx)
- [`src/utils/stats.ts`](../../../src/utils/stats.ts)
- [ADR-0004](0004-versioned-defensive-storage.md) — the persistence this store drives
- [ARCHITECTURE.md §2, §3](../ARCHITECTURE.md)
