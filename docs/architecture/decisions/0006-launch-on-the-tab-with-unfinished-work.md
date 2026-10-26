# ADR-0006: The app launches on the tab with unfinished work

- Status: Active
- Date: 2026-10-26
- Decision makers: Project owner
- Recorded retrospectively: the choice was made when the Learn tab was added.

## Context

Sessions are durable and can be left part-finished ([ADR-0005](0005-answers-recorded-immediately.md)).
The common reason to open this app is to continue one. Always opening on the Decks tab would put a
tab switch between the user and the thing they came back for, every time.

The constraint is where the decision can be made. React Navigation reads `initialRouteName` **once**,
when the navigator mounts, and ignores later changes to it. The information it needs — whether any
session is active — lives in AsyncStorage and is not available synchronously. If the navigator
mounts before the store has hydrated, the launch tab is chosen from an empty array and is always
Decks.

## Decision

[`RootNavigator`](../../../src/navigation/RootNavigator.tsx) reads the store and does not mount the
navigator until it has loaded.

- While `isLoading` is true it renders an activity indicator and nothing else.
- Once loaded, `initialRouteName` is `'LearnTab'` if any session satisfies `isSessionActive`, and
  `'DecksTab'` otherwise.

The gate is **structural, not cosmetic**: it exists so that `initialRouteName` is computed from
real data. Rendering the navigator eagerly and switching tabs afterwards is not an equivalent
implementation.

The **Study screen is a route inside the Learn stack**, not a tab of its own, so landing on
`LearnTab` lands on the list of sessions rather than inside one. Resuming is one tap from there.

## Alternatives Considered

- **Always launch on Decks.** Simplest, no gate, no indicator. Rejected: it puts a tab switch in
  front of the most common reason to open the app.
- **Mount immediately and navigate to the Learn tab once the store loads.** Avoids the blank frame.
  Rejected because the user sees the Decks tab render and then be replaced, which reads as a bug,
  and because it adds an effect whose job is to undo the mount's own decision.
- **Resume straight into the Study screen of the active session.** Fewer taps still. Rejected
  because more than one session can be active and the app would have to guess which, and because
  landing directly inside a card with no context is disorienting after a gap.
- **Persist the last tab and restore it.** A general answer, and one React Navigation supports
  through state persistence. Rejected as more machinery than the question needs: the useful signal
  is "is there unfinished work", not "where was I".

## Consequences

### Positive

- Returning to an unfinished session is the default path and costs one tap.
- The launch tab is derived from the stored data, so it is correct after a process kill, a reinstall
  restore, or any other route by which sessions appear without the app having run.
- The load gate also removes an empty-state flash on every screen, since no screen renders before
  the store exists.

### Negative

- **A frame of activity indicator on every cold start**, however fast the load is.
- The whole UI is blocked on AsyncStorage. A slow or failed read delays the app rather than
  degrading part of it — though a failed read still resolves `isLoading`, so the app starts empty
  rather than hanging ([ADR-0004](0004-versioned-defensive-storage.md)).
- The rule is invisible from inside the navigator's configuration: a reader of
  `RootNavigator` has to notice that `initialRouteName` is an expression over store data, and a
  later refactor that mounts the navigator earlier breaks the behaviour without breaking a test.
  Nothing covers it.

## References

- [`src/navigation/RootNavigator.tsx`](../../../src/navigation/RootNavigator.tsx)
- [`src/utils/stats.ts`](../../../src/utils/stats.ts) — `isSessionActive`
- [ADR-0005](0005-answers-recorded-immediately.md) — why unfinished sessions exist at all
- [ARCHITECTURE.md §4](../ARCHITECTURE.md)
