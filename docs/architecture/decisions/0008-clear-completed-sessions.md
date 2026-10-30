# ADR-0008: Clearing a completed session archives it under the existing v1 key

- Status: Active
- Date: 2026-10-27
- Decision makers: Project owner

## Context

The Learn screen lists every session, active ones first and then most recently touched first
(`sortSessions`). Completed sessions are never removed by anything except the user, so the list
grows by one row per pass and the sessions that matter — the active ones and the last few — are
pushed down by history. The user asked for a way to clear completed sessions, both all at once and
one at a time.

Today the only way to remove a completed session is **Delete session** in the Session options
menu, which calls `deleteSession` and removes the record from `@easy-flashcards/sessions/v1`
outright. That is not neutral, because the sessions array is the **only** source of four
statistics:

- a deck's session count and last-session date on its **Deck meta row** and its **Deck stats row**
  (`summarizeSessionsByDeck`);
- the **Sessions** tile in the **Global summary** (the length of the sessions array);
- the `{n} sessions` and `Last session {date}` line of the **Deck summary** (`summarizeSessions`).

Deleting a completed session lowers the first three and can move the last-session date backwards.
Tidying a list should not rewrite history. ([ADR-0007](0007-okeish-third-answer.md) already relies
on a card's counters, not its sessions, for a card's history; this record is about the session
statistics, which have no such second copy.)

Keeping a session but hiding it changes what is persisted, which in this repo always needs an ADR
and the owner's approval ([ADR-0004](0004-versioned-defensive-storage.md), `AGENTS.md` *What to ask
before doing*). **The project owner approved the decision below on 2026-10-27.**

The constraints are the ones ADR-0007 met:

- **Every existing record is already correct under the new shape.** No session has ever been
  cleared, so a session with no `clearedAt` has a cleared time of exactly `null`, not an unknown
  one.
- **The loaders are the only migration path, and they are untested**
  ([ARCHITECTURE.md §8](../ARCHITECTURE.md)). A route that needs conversion code is new untested
  code against the user's only copy of their data.
- **Downgrades are not blocked** — see ADR-0007's *Context*.

## Decision

**Clearing is archiving.** A cleared session is hidden from the Learn screen's list and is still
counted by every statistic that counts sessions. Nothing that is a statistic changes.

### Storage

**`clearedAt` is stored under the existing `/v1` key, with no new key and no migration.**

- `Session` gains a **required** `clearedAt: number | null` — the `Date.now()` at which it was
  cleared, or `null` while it is listed.
- The sessions loader reads a missing or non-numeric `clearedAt` as `null`.
- The sessions loader **forces `clearedAt` to `null` for any session whose `completedAt` is
  `null`**, so an active session can never be hidden, whatever was written.
- Every place that creates a session — `startSession` — sets `clearedAt: null`.

This is the additive case [ADR-0004](0004-versioned-defensive-storage.md) Amendment 1 keeps under
`/v1`: the default the normaliser fills in is the true value for every record written before this
change.

### Who may be cleared

**Only a completed session can be cleared.** A session is cleared while `clearedAt !== null`; that
definition is written once, in `isSessionCleared` in
[`src/utils/stats.ts`](../../../src/utils/stats.ts), beside `isSessionActive`. A session is
therefore in exactly one of three states: active, completed and listed, or completed and cleared.

### Store operations

Two new reducer actions, each exposed as a function on `DecksContextValue`
([ADR-0003](0003-single-context-reducer-store.md)):

- **`clearCompletedSessions()`** marks every completed, not-yet-cleared session with **one shared
  timestamp**. Sessions already cleared keep their original `clearedAt`.
- **`clearSession(id)`** marks one completed session. It leaves the state unchanged for an unknown
  id, an active session, or a session already cleared — the same guard shape as `recordAnswer`.

**Delete session on a completed session now clears it.** The destructive item in the Session
options menu calls `clearSession` for a completed session. The menu item's label and the
confirmation copy are UI decisions and belong to
[the UI vocabulary](../../../.github/instructions/ui-vocabulary.instructions.md).

**Removal is unchanged where it already happens:**

- **Discard session** on an active session stays a real delete, through `deleteSession`. An
  abandoned pass is not history; it is a mistake being undone.
- **Delete deck** and **Reset statistics** still remove every session with that `deckId`,
  **cleared ones included**. Both already delete the statistics the cleared sessions feed.

### Derived values

The listing and the counting are pure functions in
[`src/utils/stats.ts`](../../../src/utils/stats.ts), so they are tested:

- `isSessionCleared(session)` — the one definition above;
- `listedSessions(sessions)` — the sessions the Learn screen shows, i.e. every session not cleared;
- `clearableSessionCount(sessions)` — completed sessions not yet cleared, which is what a *clear
  all* control enables on and confirms;
- the transform the reducer applies to mark sessions cleared at a given time, so the guard rules
  above are tested rather than only written in a `.tsx` file.

**`summarizeSessions` and `summarizeSessionsByDeck` keep counting cleared sessions**, and the
Sessions tile keeps counting the whole array. A regression test pins that a cleared session is
still counted, because the obvious edit — filtering cleared sessions out early — compiles and
changes four numbers.

### Retention

**Cleared sessions are kept indefinitely and are not recoverable from the UI.** There is no
*restore* and no *show cleared*. Both are accepted as debt; see *Consequences*.

## Alternatives Considered

- **Delete completed sessions outright.** The simplest change and no storage change at all.
  Rejected because sessions are the only source of the per-deck session count, the per-deck
  last-session date, the Sessions tile and the Deck summary's session line, and all four would
  drop. Clearing a list would silently rewrite the user's history.
- **Delete, but keep per-deck session aggregates stored on the deck** (a count and a last date that
  survive the deletion). Rejected: it stores derived values, which
  [ADR-0003](0003-single-context-reducer-store.md) forbids — they can go stale against the
  sessions they summarise — and seeding them for existing decks is a migration of the decks key,
  which is new untested code against the user's data. It would also leave the Sessions tile with
  two sources to add together.
- **A third storage key holding cleared sessions, or the ids of cleared sessions.** Rejected as
  unjustified: it adds a module, a second whole-array write per change, and a cross-key integrity
  rule (deleting a deck would have to cascade into it) to express one nullable field.
- **A boolean `cleared` instead of a timestamp.** Rejected: every other state change on a session
  is a `Date.now()` timestamp, and a shared timestamp keeps one *clear all* identifiable as a batch,
  which is what a future restore would need.
- **Allow clearing an active session.** Rejected: an active session hidden from the Learn screen
  cannot be resumed from anywhere, yet it still decides the launch tab
  ([ADR-0006](0006-launch-on-the-tab-with-unfinished-work.md)) and the Active pill. The loader rule
  makes the combination unrepresentable rather than merely unused.

## Consequences

### Positive

- The Learn screen can be kept short without changing a single statistic, because every number the
  app shows about sessions is computed over the same array as before.
- No migration, no new key, and no conversion code. Upgrading changes nothing visible until the
  user clears something.
- `clearedAt` is required on the type and the sessions loader is typed to return `Session`, so a
  creation site or loader that forgets it **fails `npm run typecheck`** rather than compiling.
- "Active" keeps its single definition, and the launch tab, the Active pill and the Sessions header
  are unaffected, because an active session cannot be cleared.

### Negative

- **Storage only grows.** Clearing removes nothing, so the sessions key — written whole on every
  answer ([ADR-0005](0005-answers-recorded-immediately.md)) — keeps every completed session for the
  life of its deck. This adds to the whole-store-write debt in
  [ARCHITECTURE.md §8](../ARCHITECTURE.md); only *Delete deck* and *Reset statistics* shrink it.
- **There is no restore.** A session cleared by mistake stays hidden. Its data is intact and still
  counted, but nothing in the UI shows it again. Accepted by the owner as debt.
- **Downgrading un-clears everything, permanently.** An older APK's sessions loader rebuilds each
  session field by field and drops `clearedAt`, and its first save writes that back. Every cleared
  session reappears in the older build's Learn list, and reinstalling the newer app does not hide
  them again. No statistic is lost — the older build counts the same sessions — so this is a
  nuisance, not data loss. Accepted by the owner, and not mitigated.
- **The sessions loader is again the place a mistake compiles.** Dropping the `completedAt === null`
  rule type-checks, and nothing tests the loaders; a missed edit would make a corrupt record able to
  hide an active session.
- **Delete session no longer deletes.** The word on the menu item and the behaviour diverge until
  the UI vocabulary renames it; a label that still says *Delete* misdescribes a reversible-in-data,
  irreversible-in-UI archive.
- **"No sessions yet" can be false.** When every session is cleared the Learn screen's list is
  empty although sessions exist and are counted on the Statistics screen. The empty-state copy is a
  UI decision, but it has to be made.
- **`deleteSession` still deletes whatever it is given.** Nothing in the reducer stops a future
  caller deleting a completed session and changing the statistics; the rule that it is only for
  active sessions lives in the Learn screen.
- `DecksContextValue` gains two functions and `Session` gains a field. Every screen consumes the
  context value, so the blast radius is wider than the diff.

## Amendment 1 — 2026-10-30

The project owner decided that replaying a completed session should feel like playing the same
session again, rather than adding a row to the Learn list each time. The decision above is
unchanged — clearing is still archiving, and nothing that is a statistic changes when a session is
cleared. One more path now clears a session:

- **Replay clears its original.** The **Replay button** on a completed Session card starts a new
  session over the original's cards that still exist in the deck, in the original's order, **and
  clears the original**, in **one reducer action, `replaySession`**, exposed on
  `DecksContextValue`. One dispatch means there is no state, and no save, in which both sessions or
  neither are listed.
- **The new session is an ordinary session.** It is active, counts in every session statistic, and
  its answers bump card counters like any other. The Sessions tile and the deck's session count go
  up by one per replay; only the Learn list stays the same length.
- **The original is cleared with exactly `clearSessionAt` semantics** — the same guard: an unknown,
  active, or already cleared session is left as it is. The new session is started regardless.
- **No clear without a replay.** When none of the original's cards still exists, the Learn screen
  alerts and dispatches nothing.
- A cleared original takes its error-review state ([ADR-0009](0009-error-review-marks-cards-fixed.md))
  with it; since there is no restore, that state is no longer visible anywhere.
- **Unchanged:** *Start a new session* in the Session options menu, *Study the whole deck again* on
  the Session summary, and the Decks screen's start actions clear nothing.

Two existing consequences become more frequent: storage grows by one session per replay, as
before, and a downgrade un-clears every replayed original along with every hand-cleared session.

## References

- [ADR-0002](0002-sessions-are-snapshots.md) — amended by this record (Amendment 1)
- [ADR-0003](0003-single-context-reducer-store.md) — new operations are new reducer actions
- [ADR-0004](0004-versioned-defensive-storage.md) — Amendment 1, the additive-field rule under `/v1`
- [ADR-0005](0005-answers-recorded-immediately.md) — the whole-store write per answer
- [ADR-0006](0006-launch-on-the-tab-with-unfinished-work.md) — why an active session cannot be
  hidden
- [ADR-0007](0007-okeish-third-answer.md) — the precedent for an additive field and its downgrade
  cost
- [ADR-0009](0009-error-review-marks-cards-fixed.md) — the review state a cleared original keeps
  (Amendment 1)
- [`src/types.ts`](../../../src/types.ts) — `Session`
- [`src/storage/sessionsStorage.ts`](../../../src/storage/sessionsStorage.ts)
- [`src/state/DecksContext.tsx`](../../../src/state/DecksContext.tsx) — `deleteSession`,
  `deleteDeck`, `resetDeckStats`, `startSession`
- [`src/utils/stats.ts`](../../../src/utils/stats.ts) — `isSessionActive`, `summarizeSessions`,
  `summarizeSessionsByDeck`, `sortSessions`
- [`src/screens/LearnScreen.tsx`](../../../src/screens/LearnScreen.tsx) — the Session options menu
- [ARCHITECTURE.md §2, §3, §5, §8](../ARCHITECTURE.md) — not yet updated for this record; the
  overview is updated by the change that implements it, which carries adding this link
- [AGENTS.md](../../../AGENTS.md) — *Storage keys*, *What to ask before doing*
