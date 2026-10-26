# ADR-0005: An answer is recorded when it is given

- Status: Active
- Date: 2026-10-26
- Decision makers: Project owner
- Recorded retrospectively: the choice was made when sessions were added.

## Context

Studying is interrupted. The user answers a few cards, switches app, gets a call, locks the phone,
or simply leaves the Study screen to look at something else. On Android the process can be killed
at any point after that with no further notice to the app.

Two things need to be written when a card is answered: the result into the session, and the
cumulative counters on the card. Both feed the statistics the whole app is built around, so when
they are written determines what survives an interruption.

The obvious alternative — accumulate in memory and commit at the end — has an appealing property
and a fatal one. Appealing: one write per session instead of one per card. Fatal: it needs a
reliable "end", and there is not one. A session that is abandoned has no end event, and an
`onUnmount` or `AppState` handler is not guaranteed to run before a process is killed.

## Decision

`recordAnswer` writes everything, immediately, in one dispatch. There is no commit step and no
"end of session" save path.

A single reducer case does all of it:

- appends `{ cardId, answer }` to `session.results`;
- sets `session.updatedAt`;
- sets `session.completedAt` when `results.length >= cardIds.length`, so **completion is derived
  from the data rather than signalled by the UI**;
- increments the card's `okCount` or `notOkCount` and sets its `lastReviewedAt`;
- sets the deck's `lastStudiedAt`.

The store's save effect then persists both arrays, as it does for any change
([ADR-0003](0003-single-context-reducer-store.md)).

The case is guarded: an answer for an unknown session, or for one already completed, returns the
state unchanged rather than appending.

The Study screen therefore has **no save responsibility at all**. Leaving it is not an exit path
that needs handling; it is just navigation.

## Alternatives Considered

- **Accumulate in component state, commit on session end.** One write per session. Rejected: an
  abandoned session loses everything, and "end" is not an event the app reliably receives.
- **Commit on unmount or on an `AppState` change to background.** Catches the common case of
  leaving deliberately. Rejected because it does not catch a process kill, and it makes correctness
  depend on a lifecycle callback firing — a failure that only shows up on a real device under
  memory pressure, which is exactly where it is hardest to find.
- **Debounce or batch writes.** Would cut the write volume while keeping most of the durability.
  Rejected as unnecessary at the volumes involved — a write is one `setItem` of a few kilobytes,
  and answers arrive at human speed — and because a debounce window is a window in which data is
  lost.
- **Let the UI mark a session complete.** Rejected because completion would then depend on the user
  reaching the summary screen. Deriving it from `results.length` means a session that was answered
  to the end is complete whether or not anyone saw the summary.

## Consequences

### Positive

- Nothing is lost by leaving a session, however it is left. Resuming shows exactly the answers that
  were given.
- The Study screen holds only view state — which card is on screen and whether it is flipped — and
  no durable data, which is what keeps it simple despite the swipe and flip handling.
- Completion is a property of the stored data, so the Learn screen, the statistics and the Study
  screen all agree about it without coordinating.
- "Active" has one definition — `completedAt === null`, in `isSessionActive` — and it is true the
  moment the last answer is recorded.

### Negative

- **One write of the entire store per answer.** Two full arrays are serialised for each tap. It
  costs nothing at hand-imported-CSV sizes and does not scale to a large library; this is the main
  reason the whole-store write is listed as debt in
  [ARCHITECTURE.md §8](../ARCHITECTURE.md).
- **There is no undo.** A mis-tapped answer is already in the counters. The Study screen lets the
  user swipe back to *review* an answered card, but the buttons are disabled there — reviewing is
  not re-answering.
- A partially-answered session is a durable object the user has to deal with, which is why the
  Learn screen needs a discard action at all.

## Amendment 1 — 2026-10-26

[ADR-0007](0007-okeish-third-answer.md) adds a third answer, **Okeish** (`'okeish'`). The decision
above is unchanged — the answer is still written immediately, in one dispatch, with no commit step.
One line of what that dispatch does has changed:

- it increments **exactly one** of the card's `okCount`, `okeishCount` or `notOkCount`, chosen by
  the answer, and sets its `lastReviewedAt`.

An Okeish answer is an answer like the other two in every other respect: it is appended to
`session.results`, it counts towards `results.length` and therefore towards completion, and it sets
the deck's `lastStudiedAt`. The *no undo* consequence applies to it unchanged — a mis-tapped Okeish
is already in the counters.

## References

- [`src/state/DecksContext.tsx`](../../../src/state/DecksContext.tsx) — the `recordAnswer` case
- [`src/screens/StudyScreen.tsx`](../../../src/screens/StudyScreen.tsx)
- [`src/utils/stats.ts`](../../../src/utils/stats.ts) — `isSessionActive`, `getSessionStats`
- [ADR-0002](0002-sessions-are-snapshots.md) — what is being written into
- [ADR-0007](0007-okeish-third-answer.md) — the third answer (Amendment 1)
- [ARCHITECTURE.md §2](../ARCHITECTURE.md)
