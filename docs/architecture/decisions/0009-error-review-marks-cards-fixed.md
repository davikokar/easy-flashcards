# ADR-0009: Reviewing a session's errors marks cards fixed and changes no statistic

- Status: Active
- Date: 2026-10-30
- Decision makers: Project owner

## Context

A completed session can have **missed or unsure cards** — the ones answered Not ok or Okeish,
`getMissedOrUnsureCardIds` ([ADR-0007](0007-okeish-third-answer.md)). There are two ways to go over
them again: the **Session summary**'s `Review the {n} missed or unsure` action on the Study screen,
and the **Replay missed button** on a completed Session card on the Learn screen. Both call
`startSession(deck, subset)`, so both create an ordinary session:

- the Sessions tile, the deck's session count and its last-session date go up by one;
- every answer bumps a card counter ([ADR-0005](0005-answers-recorded-immediately.md)), so
  Reviews, every success rate and **Hardest first** move — and they move in a misleading direction,
  because the drilled cards are by construction the hard ones, answered again minutes after their
  answer was seen;
- each drill adds a Session card to the Learn screen;
- the original session shows no trace that its errors were ever worked through.

The project owner decided that going over a session's errors is **practice, not study**: it writes
nothing any statistic reads, the original session keeps its results exactly as they were (its
Session results bar and its Not ok / Okeish history are the record of how the session went), and
the session gains a record of which of its errors have since been answered Ok.

That record is persisted, which in this repo always needs an ADR and the owner's approval
([ADR-0004](0004-versioned-defensive-storage.md), `AGENTS.md` *What to ask before doing*). **The
project owner approved the decision below, including the storage change, on 2026-10-30.**

The constraints are the ones [ADR-0007](0007-okeish-third-answer.md) and
[ADR-0008](0008-clear-completed-sessions.md) met:

- **Every existing record is already correct under the new shape.** No review of this kind has
  ever happened, so a session with no record of fixed cards has exactly none, not an unknown set.
- **The loaders are the only migration path, and they are untested**
  ([ARCHITECTURE.md §8](../ARCHITECTURE.md)).
- **Downgrades are not blocked** — see ADR-0007's *Context*.

## Decision

### Terms

- A session's **missed or unsure cards** are `getMissedOrUnsureCardIds(session)`: answered Not ok
  or Okeish, once each, in the order they were answered — which is the session's own card order,
  because a session is answered strictly in `cardIds` order.
- A **reviewable** card is a missed or unsure card that still exists in the session's deck
  (`resolvableCardIds`). A session whose deck no longer resolves has none.
- A card is **fixed** once it has been answered Ok in a review of that session.
- A card is **outstanding** while it is reviewable and not fixed. Outstanding cards are always in
  session order.

### Storage

**`fixedCardIds` is stored on the session under the existing `/v1` key, with no new key and no
migration.**

- `Session` gains a **required** `fixedCardIds: string[]` on the TypeScript type. It may be absent
  in storage; the type is what the loader returns, not what it reads.
- The sessions loader reads a missing or non-array `fixedCardIds` as `[]`, keeps only strings,
  drops duplicates (first occurrence wins), keeps only ids that are missed or unsure in the
  session's normalised `results`, and **forces `[]` whenever `completedAt` is `null`** — only a
  completed session can be reviewed, so an active session can never carry one.
- That rule is a pure function in [`src/utils/stats.ts`](../../../src/utils/stats.ts) that the
  loader calls, so it is tested even though the loader is not.
- Every place that creates a session sets `fixedCardIds: []`.

This is the additive case [ADR-0004](0004-versioned-defensive-storage.md) Amendment 1 keeps under
`/v1`: the default the normaliser fills in is the true value for every record written before this
change.

**Only the fixed ids are stored.** The outstanding cards, their count, whether a session's review
is finished, a pass's position, and any review answer other than Ok are derived or held in screen
state, never persisted.

### What a review answer does

One new reducer action, exposed as a function on `DecksContextValue`
([ADR-0003](0003-single-context-reducer-store.md)):
**`recordReviewAnswer(sessionId, cardId, answer)`**. It is dispatched the moment the answer is
given, in one dispatch, with no commit step — the principle of ADR-0005.

- **Ok** appends `cardId` to the session's `fixedCardIds` when the session exists, is completed,
  `cardId` is one of its missed or unsure cards, and it is not already fixed. Otherwise nothing
  changes.
- **Okeish and Not ok change nothing.** The reducer returns the same state object, so nothing
  re-renders for it and nothing is written. The card stays outstanding and is in the next pass.
  The action accepts every answer, rather than only Ok, so the Study screen calls one function for
  all three Answer buttons and the rule lives in one tested place.
- It **never** appends to `results`; changes `completedAt`, `updatedAt` or `clearedAt`; touches a
  card's counters or `lastReviewedAt`, or a deck's `lastStudiedAt`; or creates a session. Leaving
  `updatedAt` alone means a review does not move the session in the Learn screen's ordering.
- The transform is a pure function in `stats.ts` that returns the same array when nothing changes,
  and the reducer delegates to it — as the clear actions do (ADR-0008) — so the guards are tested.

**Fixed is permanent for the life of the session.** Nothing un-fixes a card, and a fixed card is
never shown in a later pass of that session.

### Derived, never stored

Pure functions in `stats.ts`, each tested:

- the session's **outstanding** card ids, given its deck (or no deck);
- the session's **review state**: *none* when the session is active or has no reviewable cards;
  *outstanding, n* while any remain; *done* when it had reviewable cards and every one is fixed.

The Learn screen's counter and the cards a pass shows come from the same function, so the number on
the button is the number of cards a tap starts. The control is hidden in the *none* state, shows
the count while *outstanding*, and is disabled and shown as done when *done*. Its look and copy
belong to [the UI vocabulary](../../../.github/instructions/ui-vocabulary.instructions.md).

### The review pass

- A review happens on the **Study screen in review mode**, selected by a route param beside
  `sessionId`. Review mode applies only to a completed session.
- A **pass** is a snapshot of the outstanding card ids taken when the pass starts. It shows each
  once, in session order, and does not loop. Fixing a card mid-pass does not shorten the pass on
  screen.
- A pass's answers live in screen state only. Ok is written through `recordReviewAnswer` as it is
  given; leaving mid-pass loses nothing stored, and the next pass contains whatever is still
  outstanding.
- **Both entry points open review mode, and neither creates a session**: the Session summary's
  review action and the Learn screen's review button. After this change no path calls
  `startSession` with a session's missed or unsure cards.

### Lifecycle

- **Clearing** a session, by hand or by a replay ([ADR-0008](0008-clear-completed-sessions.md)
  Amendment 1), keeps its `fixedCardIds`. A cleared session is not shown, so its review state is
  hidden with it.
- **Discard session** deletes an active session, whose list is always `[]`.
- **Delete deck** and **Reset statistics** remove the deck's sessions and their fixed lists with
  them.
- No path exports or imports sessions (checked 2026-10-30: the only export is the built-in sample
  deck CSV), so there is no serialisation to update.

## Alternatives Considered

- **Keep the review as a counted subset session** — the previous behaviour. Rejected by the owner:
  it inflates Reviews, flatters success rates, reorders Hardest first, and grows the Learn list
  with every drill.
- **A session flagged as a review (`kind: 'review'`), excluded from the statistics.** Keeps one
  mechanism for studying. Rejected: every session statistic and the Sessions tile would need a
  filter, which is exactly the "obvious edit that compiles and changes four numbers" ADR-0008
  warns about; it would still add Session cards; and the record of what was fixed would sit in a
  different session from the one it describes.
- **A flag on the card** (for example `needsReview`). Rejected: a card is shared by every session
  over its deck, so fixing it in one would mark it in all, and it would put session state on the
  decks key, the larger and more valuable of the two.
- **Store every review answer** (a second results array on the session). Rejected: the owner
  decided on one field, and only an Ok changes anything. Storing Okeish and Not ok review answers
  would persist history nothing reads, and give the normaliser more to defend.
- **Store the outstanding list, or its count, instead of the fixed list.** Rejected: both are
  derived — the outstanding list depends on which cards still exist in the deck — and neither has a
  default that is *true* for older records without computing it, so neither is the additive case.
- **A third storage key for review progress.** Rejected for the reasons ADR-0008 rejected one: a
  new module, a second write, and a cross-key cascade to express one field.
- **Loop within a pass until every card is Ok.** Rejected by the owner: a pass shows each
  outstanding card once, and the user decides when to go again.

## Consequences

### Positive

- Working through errors changes no statistic. Reviews, success rates, Hardest first and every
  session count move only when the user studies.
- The original session keeps its results, so its Session results bar and history still say how the
  session went, and its review button says how much of it has since been fixed.
- The Learn list no longer gains a row per drill.
- No migration, no new key, and no conversion code. Upgrading shows every completed session's full
  missed-or-unsure count until the user reviews.
- `fixedCardIds` is required on the type, so a creation site or loader that forgets it **fails
  `npm run typecheck`**.
- The answer rule, the loader rule and every derived value are pure functions with tests.
- Review mode creates no active session, so the launch tab
  ([ADR-0006](0006-launch-on-the-tab-with-unfinished-work.md)) and the Active pill are unaffected.

### Negative

- **Downgrading to an older APK loses every fixed list, permanently, without warning.** An older
  sessions loader rebuilds each session field by field and drops `fixedCardIds`, and its first save
  — any answer, import, deletion or clear — writes that back. Every reviewed session's count
  returns to its full number of missed or unsure cards and every done state disappears.
  Reinstalling the newer app does not bring them back. **No statistic is lost**, because a review
  never wrote one — but the older build's Replay missed button creates counted sessions again.
  Accepted by the owner and not mitigated; nothing blocks the downgrade (`versionCode` has never
  been bumped).
- **Review practice is invisible in Statistics, by design.** A card fixed in review keeps the rate
  its sessions gave it and stays where Hardest first put it.
- **Okeish and Not ok answers in a review are recorded nowhere.** They are shown during the pass and
  in its summary, and are gone once the user leaves.
- **There is no un-fix.** An accidental Ok in a review removes the card from that session's later
  passes. The only way to drill it again is a Replay or a new session, which count.
- **The sessions loader gains another rule that compiles when wrong.** The rule itself is tested;
  the call to it from the untested loader is not.
- **The Study screen gains a second position model.** In review mode the frontier is the number of
  answers given in the pass, not `session.results.length`; that state lives only in the screen,
  which has no tests, and can only be verified on a device.
- A fixed id whose card later leaves the deck stays stored. It is harmless — every derived value
  goes through `resolvableCardIds` — and only *Delete deck* or *Reset statistics* removes it.
- `DecksContextValue` gains a function and `Session` gains a field. Every screen consumes the
  context value, so the blast radius is wider than the diff.

## References

- [ADR-0002](0002-sessions-are-snapshots.md) — amended by this record (Amendment 2)
- [ADR-0003](0003-single-context-reducer-store.md) — a new operation is a new reducer action
- [ADR-0004](0004-versioned-defensive-storage.md) — Amendment 1, the additive-field rule under `/v1`
- [ADR-0005](0005-answers-recorded-immediately.md) — amended by this record (Amendment 2)
- [ADR-0006](0006-launch-on-the-tab-with-unfinished-work.md) — unaffected: a review is not a session
- [ADR-0007](0007-okeish-third-answer.md) — amended by this record (Amendment 1)
- [ADR-0008](0008-clear-completed-sessions.md) — Amendment 1, the replay that clears its original
- [`src/types.ts`](../../../src/types.ts) — `Session`
- [`src/storage/sessionsStorage.ts`](../../../src/storage/sessionsStorage.ts)
- [`src/state/reducer.ts`](../../../src/state/reducer.ts),
  [`src/state/DecksContext.tsx`](../../../src/state/DecksContext.tsx)
- [`src/utils/stats.ts`](../../../src/utils/stats.ts) — `getMissedOrUnsureCardIds`,
  `resolvableCardIds`
- [`src/screens/StudyScreen.tsx`](../../../src/screens/StudyScreen.tsx),
  [`src/screens/LearnScreen.tsx`](../../../src/screens/LearnScreen.tsx)
- [ARCHITECTURE.md §1–§5, §8](../ARCHITECTURE.md) — updated for this record by the change that
  implemented it, and links back to it
- [AGENTS.md](../../../AGENTS.md) — *Storage keys*, *State ownership*, *What to ask before doing*
