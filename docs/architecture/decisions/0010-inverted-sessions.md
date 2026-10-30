# ADR-0010: A session's direction is chosen at creation and stored on the session

- Status: Active
- Date: 2026-10-30
- Decision makers: Project owner

## Context

Every card has a `question` and an `answer`, and every session today shows the question first and
the answer on the back. For a vocabulary deck that only trains one direction of recall: a German
word to its meaning, never the meaning back to the word. The project owner wants to study a deck
the other way round — an **inverted** session, which shows each card's answer first and its
question on the back.

The direction has to belong to something, and it has to last as long as that thing does:

- A session can be left and resumed from the Learn screen, and survives an app restart
  ([ADR-0002](0002-sessions-are-snapshots.md)). An inverted session that came back un-inverted
  after either would show the user the side they are meant to recall.
- A session can be the starting point of another session. A user drilling a deck the inverted way
  expects the next pass over it to be inverted too, without choosing again.
- Surviving a restart means **persisting** it, which in this repo always needs an ADR and the
  owner's approval ([ADR-0004](0004-versioned-defensive-storage.md), `AGENTS.md` *What to ask
  before doing*). **The project owner approved the decision below, including the storage change,
  on 2026-10-30.**

The constraints are the ones [ADR-0007](0007-okeish-third-answer.md),
[ADR-0008](0008-clear-completed-sessions.md) and
[ADR-0009](0009-error-review-marks-cards-fixed.md) met:

- **Every existing record is already correct under the new shape.** No session has ever been
  inverted, so a session with no direction stored is exactly a non-inverted one, not an unknown.
- **The loaders are the only migration path, and they are untested**
  ([ARCHITECTURE.md §8](../ARCHITECTURE.md)).
- **Downgrades are not blocked** — see ADR-0007's *Context*.

The Decks screen already offers one variation on starting a session: the Deck options menu's
**Shuffle and start session**, which passes the deck's card ids in random order. That needs no
storage, because a session's order already *is* its `cardIds`. Direction is different: nothing in
the stored session can express it today.

## Decision

### Storage

**`inverted` is stored on the session under the existing `/v1` key, with no new key and no
migration.**

- `Session` gains a **required** `inverted: boolean` on the TypeScript type. It may be absent in
  storage; the type is what the loader returns, not what it reads.
- The sessions loader reads `inverted` as `true` **only** when the stored value is exactly `true`.
  Anything else — missing, `"true"`, `1`, `null`, any other value — is read as `false`. The rule
  applies to active and completed sessions alike.
- This is the additive case [ADR-0004](0004-versioned-defensive-storage.md) Amendment 1 keeps under
  `/v1`: `false` is the true value for every record written before this change.
- **Shuffle is not stored.** It only decides the order of `cardIds` when a session is created, and
  that order is already persisted as the `cardIds` themselves.

### Direction is per session, and fixed at creation

- A session's direction is chosen when it is created and **never changes**. No store action
  modifies `inverted` after creation, and there is no control to switch direction mid-session.
- Every card in a session is shown in the session's direction. There is **no per-card direction**
  and no mixed session.
- Everything the Study screen shows for a session uses that session's direction — the session's
  own pass and any review pass over its errors ([ADR-0009](0009-error-review-marks-cards-fixed.md)).
- Direction is a property of a session only. A deck, a card, and every view that shows a deck's
  cards outside a session are unchanged.

### A session started from a session takes its direction

**A session created from an existing session takes that session's `inverted`**, whichever control
creates it and whichever store function it goes through. The user chooses a direction only when
starting a session from a deck.

### Faces come from one pure function

- Which side of a card is shown first is decided by a pure function,
  **`cardFaces(card, inverted)`**, in [`src/utils/`](../../../src/utils/), with a test. Not
  inverted, the front is the `question` and the back the `answer`; inverted, the two are swapped.
- Every place that shows a card as part of a session gets its faces from it, and nothing else
  decides the direction. The stored card is never rewritten; both sides are already HTML and go
  through the same renderer ([ADR-0001](0001-own-the-html-renderer.md)).

### Answers and statistics ignore direction

- `recordAnswer` is unchanged: the answer is appended to `session.results` and bumps the card's
  counter for that answer, in one dispatch, exactly as in a non-inverted session
  ([ADR-0005](0005-answers-recorded-immediately.md)). `recordReviewAnswer` is likewise unchanged.
- **A card's counters combine both directions.** There is one `okCount`, `okeishCount` and
  `notOkCount` per card, and an inverted answer adds to the same one.
- **Every function in [`src/utils/stats.ts`](../../../src/utils/stats.ts) ignores `inverted`.**
  Success rates, tallies, progress, Hardest first and every session count are computed as though
  no session were inverted. No statistic is split by direction.

### The store API

- `startSession` and `replaySession` each take a **required** options argument
  `{ inverted: boolean }`. It is required, not optional with a default, so a call site that forgets
  to choose a direction **fails `npm run typecheck`** rather than silently creating a non-inverted
  session. The exact parameter order belongs to the implementation, provided the argument cannot be
  omitted.
- Every place that creates a session sets `inverted` from that argument.
- No new reducer action is needed: the direction travels inside the `Session` object the existing
  actions already carry. `DecksContextValue` still changes shape, because two of its function
  signatures do.

### Starting a session from the Decks screen

- The Deck options menu's **Shuffle and start session** is replaced by **Start session with
  options**, which opens a dialog with two **independent** options: **Inverted** and **Shuffle**.
  Any combination is valid. The dialog's look, copy and defaults belong to
  [the UI vocabulary](../../../.github/instructions/ui-vocabulary.instructions.md).
- The **Start session button** is unchanged: a new session over the whole deck, in deck order,
  **not inverted and not shuffled**.

## Alternatives Considered

- **A route param on the Study screen only.** No storage change at all. Rejected: the direction
  would be lost whenever the Study screen is reached without it — resuming from the Learn screen,
  launching into an active session after a restart, or starting a session from an existing one.
- **A map of session id to direction in the store, not persisted.** Survives navigation. Rejected:
  it is lost on every restart, so an inverted session resumed the next day would come back
  un-inverted, and it would be the store's only state that is not written with the rest.
- **Encoding the direction in `cardIds`** (for example a marker on each id). Avoids a new field.
  Rejected: `cardIds` are resolved against the deck by every function that reads them, and each
  would have to decode them first; one that forgot would treat every card of an inverted session as
  missing — as an older build would.
- **A third storage key for session directions.** Rejected for the reasons ADR-0008 and ADR-0009
  rejected one: a new module, a second write, and a cross-key cascade to express one field.
- **A per-card direction** (an enum per card in the session, allowing mixed sessions). Rejected by
  the owner: a session has one direction. It would also add a parallel array the normaliser would
  have to keep aligned with `cardIds`.
- **Separate counters per direction on each card.** Would let statistics distinguish the two kinds
  of recall. Not chosen: it changes the decks key, the larger and more valuable of the two, and
  every statistic that reads a counter. The owner accepted combined counters instead.

## Consequences

### Positive

- An inverted session stays inverted across resume, app restart, and every session started from it.
- No migration, no new key, and no conversion code. Every existing session reads back as
  non-inverted, which is what it was.
- `inverted` is required on the type and the direction is a required argument, so a creation site
  or call site that forgets it **fails `npm run typecheck`**.
- The face rule is a pure function with a test, and it is the only place the direction is applied.
- Statistics code does not change: answers, counters and every `stats.ts` function work as before.
- Shuffling costs no storage and no new field.

### Negative

- **Downgrading to an older APK makes every inverted session non-inverted, permanently, without
  warning.** An older sessions loader rebuilds each session field by field and drops `inverted`,
  and its first save — any answer, import, deletion or clear — writes that back. An active inverted
  session resumed in the older build shows the question first. Reinstalling the newer app does not
  bring the flag back. **No answer and no statistic is lost**, because a session's `results` and
  every card counter are written the same way in both directions. Accepted by the owner and not
  mitigated; nothing blocks the downgrade (`versionCode` has never been bumped).
- **A card's counters and success rate blend both directions.** A card known well one way and
  poorly the other shows one middling rate, and Hardest first cannot tell which direction is hard.
  Nothing in Statistics says that some reviews were inverted.
- **Whether a session was shuffled is not recorded.** Nothing can show it afterwards.
- **The sessions loader gains another rule that compiles when wrong**, in a loader that is
  untested. The rule is one strict comparison, and getting it wrong in the lenient direction would
  read stray values as inverted.
- **The Study screen gains another input that only a device can verify.** No test renders a
  screen, so a face shown the wrong way round passes `npm test`.
- `Session` gains a field and `DecksContextValue` changes shape. Every caller of `startSession` and
  `replaySession` must be edited, and every screen consumes the context value, so the blast radius
  is wider than the diff.

## References

- [ADR-0001](0001-own-the-html-renderer.md) — both faces go through the same renderer
- [ADR-0002](0002-sessions-are-snapshots.md) — amended by this record (Amendment 3)
- [ADR-0003](0003-single-context-reducer-store.md) — the store whose function signatures change
- [ADR-0004](0004-versioned-defensive-storage.md) — Amendment 1, the additive-field rule under `/v1`
- [ADR-0005](0005-answers-recorded-immediately.md) — unaffected: an answer is recorded the same way
  in both directions
- [ADR-0006](0006-launch-on-the-tab-with-unfinished-work.md) — unaffected: an inverted session is
  an ordinary active session
- [ADR-0007](0007-okeish-third-answer.md) — the downgrade precedent this record follows
- [ADR-0009](0009-error-review-marks-cards-fixed.md) — a review pass uses its session's direction
- [`src/types.ts`](../../../src/types.ts) — `Session`
- [`src/storage/sessionsStorage.ts`](../../../src/storage/sessionsStorage.ts)
- [`src/state/DecksContext.tsx`](../../../src/state/DecksContext.tsx) — `startSession`,
  `replaySession`
- [`src/utils/stats.ts`](../../../src/utils/stats.ts) — every statistic, unchanged by direction
- [`src/screens/DecksScreen.tsx`](../../../src/screens/DecksScreen.tsx),
  [`src/screens/StudyScreen.tsx`](../../../src/screens/StudyScreen.tsx)
- [ARCHITECTURE.md](../ARCHITECTURE.md) — updated for this record by the change that implemented
  it, and links back to it
- [AGENTS.md](../../../AGENTS.md) — *Storage keys*, *State ownership*, *What to ask before doing*
