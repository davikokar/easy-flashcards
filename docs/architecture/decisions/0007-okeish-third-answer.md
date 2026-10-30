# ADR-0007: A third answer, Okeish, stored under the existing v1 keys

- Status: Active
- Date: 2026-10-26
- Decision makers: Project owner

## Context

A card has always been answered one of two ways, **Ok** or **Not Ok**. That forces a choice the
user often cannot make honestly: they half-remembered it, or got it with effort. Picking Ok inflates
the card's rate; picking Not Ok sends a card they nearly know back into the next *Review the missed*
session alongside the ones they did not know at all. The user asked for a third answer, **Okeish**.

An answer is not just a button. It is persisted twice, under both AsyncStorage keys:

- as a `SessionResult.answer` in `@easy-flashcards/sessions/v1`, and
- as a raw counter on the `Card` in `@easy-flashcards/decks/v1` (`okCount`, `notOkCount`),
  incremented in the same dispatch ([ADR-0005](0005-answers-recorded-immediately.md)).

So adding one changes what is persisted, which in this repo always needs an ADR and the owner's
approval ([ADR-0004](0004-versioned-defensive-storage.md), `AGENTS.md` *What to ask before
doing*). It also changes what the success rate means, and that number is shown on every screen.

Three constraints shaped the decision:

- **Every existing record is already correct under the new shape.** No Okeish answer has ever been
  given, so a card with no `okeishCount` has an Okeish count of exactly zero, not an unknown one.
- **The loaders are the only migration path, and they are untested**
  ([ARCHITECTURE.md §8](../ARCHITECTURE.md)). Any route that needs new conversion code is new
  untested code running against the user's only copy of their data.
- **Downgrades are not blocked.** `versionCode` in `android/app/build.gradle` has never been
  bumped, and release builds are signed with the debug keystore, so `adb install -r` of an older
  APK over a newer one is accepted without a prompt.

## Decision

### Storage

**Okeish is stored under the existing `/v1` keys, with no new key and no migration.**

- `Answer` becomes `'ok' | 'okeish' | 'notOk'`. `SessionResult.answer` may hold `'okeish'`.
- `Card` gains a **required** `okeishCount: number`, a raw tally like the other two.
- The decks loader reads a missing or non-numeric `okeishCount` as `0`.
- The sessions loader **preserves** `'okeish'`. Any value that is not one of the three is still
  coerced to `'ok'`, exactly as before.
- `recordAnswer` increments exactly one of the three counters, chosen by the answer.
- Every place that creates or zeroes a card's counters — import, and *Reset statistics* — sets
  `okeishCount` alongside the other two.

This is the additive case ADR-0004 keeps under `/v1`: the normaliser absorbs it exactly, because
the default it fills in is the true value for every record written before this change. ADR-0004 is
amended to say so.

### The success rate

**Only Ok earns credit. Okeish is a review that earns nothing.**

```
rate = ok / (ok + okeish + notOk)
```

- A review count is `ok + okeish + notOk`. A card answered only Okeish has been reviewed: its rate
  is **0%**, not `--`. The app distinguishes those two, and *never reviewed* would be false.
- The same formula applies at every level — card, deck, global, and session.
- **Hardest first** (`sortCardsByDifficulty`) orders by this rate, so a card answered only Okeish
  ranks as hard as a card answered only Not Ok. How ties are broken beyond the existing
  review-count rule is an implementation choice, but the order **must be deterministic**: the same
  cards always sort the same way.

### Counting and showing it

- **Okeish is counted and shown separately wherever Ok and Not Ok are**: the session summary, the
  session meta row, the global summary, the deck summary, and the card stats row. It is never
  folded into either of the other two.
- **The session summary's replay action includes Okeish cards.** *Review the {n} missed* becomes a
  replay of the cards answered Not Ok **or** Okeish, and its label changes to say so. The exact copy
  belongs to the UI vocabulary, not to this record.

How the answer buttons look — order, icons, colour — is a UI decision and lives in
[the UI vocabulary](../../../.github/instructions/ui-vocabulary.instructions.md). It requires no
theme change: Okeish uses the existing `colors.warning`.

## Alternatives Considered

- **A `/v2` key per AsyncStorage entry, converting `/v1` once.** The route ADR-0004 prescribes for
  a change the normaliser cannot absorb. Rejected because this one can be absorbed exactly, and a
  conversion would be new untested code against the user's only copy. It would not have protected
  a downgrade either: an older APK would read the stale `/v1` data and silently lose everything
  studied since the upgrade — a different loss, not no loss.
- **A `schemaVersion` inside each record.** Already rejected in ADR-0004, for the same reason.
- **Half credit for Okeish in the rate** (`(ok + 0.5 × okeish) / reviews`). The Planner's original
  recommendation, because it rewards partial recall and makes Okeish distinguishable from Not Ok in
  the rate itself. **Rejected by the project owner**, who wants the rate to measure confident recall
  only: a card the user is unsure of is not yet known. The cost, accepted, is that the rate alone
  cannot tell an Okeish card from a Not Ok one; that is why Okeish is always shown as its own count.
- **Okeish as a non-review, left out of the rate entirely.** Rejected: a card answered only Okeish
  would show `--`, which in this app means *never reviewed*, and it was.
- **Storing Okeish as a fractional `okCount`** (adding 0.5). Rejected: it destroys the raw tallies
  that every derived statistic is computed from, and cannot be shown separately afterwards.
- **No counter on the card; derive Okeish from sessions.** Rejected: sessions are deleted and
  discarded independently of their deck, and *Reset statistics* removes them, so a card's history
  is not recoverable from sessions. The counters on a `Card` are the stored tallies for that
  reason.
- **Reusing `notOkCount` for Okeish and keeping two answers in storage.** Rejected: it records an
  answer the user did not give, and the replay and statistics could never separate them later.

## Consequences

### Positive

- No migration, no new key, and no conversion code. Upgrading leaves every existing statistic
  exactly as it was, because no stored record changes meaning.
- `okeishCount` is required on the type, and the decks loader is typed to return `Deck`, so a
  loader or creation site that forgets it **fails `npm run typecheck`** rather than compiling.
- The user can answer honestly, and an uncertain card comes back in the replay instead of being
  quietly credited.

### Negative

- **Downgrading to an older APK loses Okeish data permanently, without warning.** The older decks
  loader rebuilds every card field by field, so it drops `okeishCount`; the older sessions loader
  coerces `'okeish'` to `'ok'`. Neither is written back on load, but the first state change in the
  older app — any answer, import, or deletion — saves both arrays whole and makes the loss
  permanent. Each Okeish answer then becomes an Ok in its session, raising that session's rate, and
  disappears from its card, lowering the card's review count. Reinstalling the newer app does not
  bring it back. This is the first time a `/v1` record written by a newer app is not fully
  readable by an older one; ADR-0004 had only considered the opposite direction. Accepted by the
  owner; it is not mitigated, and nothing blocks the downgrade (see *Context*).
- **The sessions loader is the one place a mistake still compiles.** Coercing `'okeish'` to `'ok'`
  type-checks, and nothing tests the loaders. A missed edit there would silently convert every
  Okeish answer on the next launch.
- **Binary assumptions in the code become wrong silently.** Today several places compute Not Ok as
  "every result that is not Ok", or colour a result as "Ok, else Not Ok". Each of those would
  quietly count Okeish as Not Ok. They have to be found and made three-way; only the ones in
  `src/utils/` are covered by tests.
- **`successRate` changes signature**, and `src/utils/stats.ts` is imported by four screens and the
  tests. The `Answer` type widens, so `recordAnswer` in `DecksContextValue` widens with it.
- **Yellow now means two things.** `colors.warning` is both the Okeish answer and the Success bar's
  40–70% band. Accepted to avoid a theme change.
- The Okeish counter is one more field the normaliser duplicates from `src/types.ts` — the existing
  cost recorded in ADR-0004, made slightly larger.

## Amendment 1 — 2026-10-30

[ADR-0009](0009-error-review-marks-cards-fixed.md) changes what the Session summary's replay action
is. The decision above is unchanged: Okeish cards are still gone over together with the Not ok
ones, and the success rate is still `ok / (ok + okeish + notOk)`. One detail moved:

- **The action is a review, not a replay.** *Review the {n} missed or unsure* — and the Learn
  screen's button that does the same — opens the Study screen in review mode over the outstanding
  Not ok and Okeish cards. It creates no session and changes no counter.
- **An Okeish answer given in a review changes nothing.** Only Ok fixes a card; Okeish and Not ok
  leave it outstanding for the next pass, and neither is counted anywhere. Okeish keeps its meaning
  in a session exactly as decided above.

## References

- [ADR-0004](0004-versioned-defensive-storage.md) — amended by this record (Amendment 1)
- [ADR-0005](0005-answers-recorded-immediately.md) — amended by this record (Amendment 1)
- [ADR-0002](0002-sessions-are-snapshots.md) — what a `SessionResult` is written into
- [ADR-0009](0009-error-review-marks-cards-fixed.md) — the review of missed or unsure cards
  (Amendment 1)
- [`src/types.ts`](../../../src/types.ts) — `Answer`, `Card`, `SessionResult`
- [`src/storage/decksStorage.ts`](../../../src/storage/decksStorage.ts),
  [`src/storage/sessionsStorage.ts`](../../../src/storage/sessionsStorage.ts)
- [`src/state/reducer.ts`](../../../src/state/reducer.ts) — `recordAnswer`, `resetDeckStats`;
  [`src/state/DecksContext.tsx`](../../../src/state/DecksContext.tsx) — `addDeck`
- [`src/utils/stats.ts`](../../../src/utils/stats.ts) — `successRate`, `cardReviewCount`,
  `getSessionTally`, `sortCardsByDifficulty`
- [`android/app/build.gradle`](../../../android/app/build.gradle) — `versionCode`
- [AGENTS.md](../../../AGENTS.md) — *Storage keys*, *What to ask before doing*
