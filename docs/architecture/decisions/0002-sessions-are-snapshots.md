# ADR-0002: A session is a snapshot, stored apart from its deck

- Status: Active
- Date: 2026-10-26
- Decision makers: Project owner
- Recorded retrospectively: the choice was made when sessions were added.

## Context

The app has two things that look like they could be one. A **deck** is the material: cards, and
the cumulative counters saying how well each is known. A **session** is one pass through some of
that material: which cards were in it, in what order, which were answered, and how.

The first version had only decks, and studying simply incremented a card's counters. Sessions were
added so a pass could be left and resumed, so more than one could be in flight, and so the Learn
screen could list them. That raised the question of where a session's data lives and what it refers
to.

The forces:

- A session outlives the state of the deck it was started from. The deck can be renamed; its cards'
  counters change with every answer, including answers from a *different* session.
- The Learn screen shows a session's deck name without having loaded the deck.
- A session's length and content must not change under it. A deck that gained cards mid-session
  would otherwise silently extend a pass the user is halfway through.
- A session can be a subset: "review the missed cards" starts a session over part of a deck.

## Decision

A `Session` is a snapshot, and lives in its own storage key.

- It stores `deckId`, a **copy** of `deckName`, and a frozen `cardIds: string[]` — never a `Card`,
  and never the deck itself.
- `cardIds` is fixed at creation. `startSession(deck, cardIds?)` defaults it to every card in the
  deck and accepts a subset, which is what the end-of-session "review missed cards" path passes.
- A session is **active** while `completedAt === null`. That is the only definition, and it is
  written once, in `isSessionActive` in [`src/utils/stats.ts`](../../../src/utils/stats.ts).
- Sessions persist under `@easy-flashcards/sessions/v1`, separately from
  `@easy-flashcards/decks/v1`.
- Resolving a session back to live cards is the Study screen's job, via `getDeck(session.deckId)`.

The two are reconciled in the reducer, not in storage: deleting a deck deletes its sessions, and
renaming a deck rewrites the `deckName` snapshot on every session that points at it.

## Alternatives Considered

- **Sessions nested inside their deck.** One key, no reconciliation, no dangling `deckId`. Rejected
  because every answer would rewrite the deck object including its entire card array, the Learn
  screen would have to flatten all decks to list sessions, and the deck document would grow without
  bound as sessions accumulate.
- **A session holding `Card` objects rather than ids.** Would make the Study screen's lookup
  unnecessary. Rejected because the card's counters are cumulative and live: a copy would be stale
  the moment another session answered the same card, and the Study screen would be rendering an
  old question after an edit.
- **A session holding only `deckId` and computing its card list from the deck at render.** Rejected
  because the session would change length when the deck did, and subset sessions would have nowhere
  to record their subset.
- **No `deckName` snapshot, resolving the name from the deck each time.** Rejected because a
  deleted deck leaves a session with no name to show, and because the Learn screen would have to
  join against every deck to render a list.

## Consequences

### Positive

- A session is self-describing: it can be listed, counted and summarised without loading a deck.
- Renaming or re-importing a deck does not rewrite history, and a session's length is stable for
  its whole life.
- Subset sessions fall out for free, which is what makes "review the missed cards" a one-line call.
- Writes are smaller and better separated: answering a card touches one session object and one card
  inside one deck.

### Negative

- Two sources of truth for a deck's name, kept in step by the `renameDeck` reducer case. A future
  write path that renames a deck without going through it leaves the snapshots stale.
- Referential integrity is the reducer's job, not the storage layer's. `deleteDeck` cascades;
  anything else that removes a deck must too, or sessions are orphaned.
- A session can reference a card id that no longer exists, if the deck was re-imported. Nothing
  currently prunes that.

## Amendment 1 — 2026-10-27

[ADR-0008](0008-clear-completed-sessions.md) lets the user clear completed sessions from the Learn
screen. The decision above is unchanged — a session is still a snapshot, in its own key, and
*active* still means exactly `completedAt === null`. One detail is added: a session now has a
**second state**, independent of the first in storage.

- A session is **cleared** while `clearedAt !== null`. That is the only definition, and it is
  written once, in `isSessionCleared` in [`src/utils/stats.ts`](../../../src/utils/stats.ts),
  beside `isSessionActive`.
- Only a completed session can be cleared. The sessions loader forces `clearedAt` to `null`
  whenever `completedAt` is `null`, so *active and cleared* cannot be read back.
- A cleared session is hidden from the Learn screen's list and is otherwise an ordinary session: it
  is still counted by every statistic that counts sessions, still renamed by `renameDeck`, and
  still removed by `deleteDeck` and *Reset statistics*.

## Amendment 2 — 2026-10-30

[ADR-0009](0009-error-review-marks-cards-fixed.md) changes how a session's missed or unsure cards
are gone over, and [ADR-0008](0008-clear-completed-sessions.md) Amendment 1 changes what a replay
does. The decision above is unchanged — a session is still a snapshot, in its own key, and its
`cardIds` and `results` are frozen once it is complete. Two details moved:

- **The "review missed cards" subset path no longer exists.** Reviewing a session's missed or
  unsure cards creates no session; it records the cards answered Ok on the original session.
  `startSession(deck, cardIds?)` still accepts an ordered subset, but no caller passes one. Its
  callers are now the Decks screen's **Start session button** (no `cardIds`) and **Shuffle and
  start session** (the whole deck, shuffled), the Learn screen's **Start a new session** (the whole
  deck), and the Session summary's **Study the whole deck again** (no `cardIds`). A replay does
  **not** call `startSession`: the **Replay button** calls `replaySession`, which builds its session
  with the same private `createSession` helper in
  [`src/state/DecksContext.tsx`](../../../src/state/DecksContext.tsx) and passes the original's
  `cardIds` that still resolve in the deck — a subset when the original was one, or when cards
  have since left the deck. The *Positive* consequence that subset sessions make "review the missed
  cards" a one-line call no longer applies.
- **A completed session has one more piece of state that can change after completion:**
  `fixedCardIds`, alongside `clearedAt`. Neither changes what the session's snapshot says about the
  pass it records.

*Correction, 2026-10-30:* this amendment first said a replay calls `startSession` with the
original's `cardIds`. It never did; the first bullet above now lists the real callers.

## References

- [`src/types.ts`](../../../src/types.ts) — `Session`, `SessionResult`
- [`src/state/DecksContext.tsx`](../../../src/state/DecksContext.tsx) — `startSession`,
  `deleteDeck`, `renameDeck`
- [`src/storage/sessionsStorage.ts`](../../../src/storage/sessionsStorage.ts)
- [ADR-0005](0005-answers-recorded-immediately.md) — what writing into a session looks like
- [ADR-0008](0008-clear-completed-sessions.md) — the cleared state (Amendment 1)
- [ADR-0009](0009-error-review-marks-cards-fixed.md) — reviewing without a session (Amendment 2)
- [ARCHITECTURE.md §2, §5](../ARCHITECTURE.md)
