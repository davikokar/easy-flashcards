# ADR-0015: Each answer records when it was given, and statistics by timeframe are derived from session results under new v2 keys

- Status: Active
- Date: 2026-11-03
- Decision makers: Project owner
- Recorded ahead of the work it governs.

## Context

The Statistics screen was redesigned after a Stitch mock that has three **timeframe chips** under
the title: *All Time* (selected by default), *This Month* and *Last 7 Days*. The redesign left them
out, because nothing stored says **when** an answer was given:

- a card holds one raw counter per `Answer` and a `lastReviewedAt` — a running total, with no
  history behind it;
- a session's `results` are `{ cardId, answer }` pairs — a history, with no time on each entry.
  The session's `startedAt`, `updatedAt` and `completedAt` bound a pass, not an answer, and a pass
  can be resumed days after it started.

A per-timeframe figure therefore cannot be computed from anything the app stores today. Adding the
time is a change to what is persisted, which in this repo always needs an ADR and the owner's
approval ([ADR-0004](0004-versioned-defensive-storage.md), `AGENTS.md` *What to ask before doing*).

**The project owner approved it on 2026-11-03, and waived any migration:**

> "I would actually add the timeframe chips. Add the necessary infrastructure and db change. We
> are in a greenfield project, so we can throw away data and reimport the decks. Don't worry about
> database migrations."

So the storage-shape change is approved, existing stored data may be discarded, and no conversion
or backward-compatible reading is wanted. ADR-0004's other half still binds: a loader never throws
on bad data.

The forces:

- **Answers are already logged.** `recordAnswer` appends a result to the session and bumps the
  card's counter in one dispatch ([ADR-0005](0005-answers-recorded-immediately.md)). A review
  answer writes neither ([ADR-0009](0009-error-review-marks-cards-fixed.md)). Sessions are already
  stored, snapshotted ([ADR-0002](0002-sessions-are-snapshots.md)), kept when cleared
  ([ADR-0008](0008-clear-completed-sessions.md)), and removed with their deck by *Delete deck* and
  *Reset statistics*.
- **The chips must not disagree with each other.** If *All time* came from the counters and the
  windows from somewhere else, a user who studied only this week could see fewer reviews under
  *Last 7 days* than under *All time*, on the same screen.
- **The counters and the session results already drift apart in two places.** A card removed by
  the Edit deck screen takes its counters with it while completed sessions keep its answers
  ([ADR-0011](0011-deck-editing-is-one-action.md)); and **Discard session** deletes an active
  session's results while the counters keep its answers.
- **Derived values are computed, never stored** ([ADR-0003](0003-single-context-reducer-store.md)).
  A per-window total is a derived value.

## Decision

### Each answer carries its time

- `SessionResult` gains a **required** `answeredAt: number` — the `Date.now()` the `recordAnswer`
  dispatch already carries as `at`, written in that same dispatch. It is set once and never
  changed.
- A review answer still writes no result ([ADR-0009](0009-error-review-marks-cards-fixed.md)), so
  it is never in any timeframe. Nothing else changes about what a review writes.

### Session results are the answer log

- **There is no separate log and no new key.** With a time on each result, the sessions array is
  already a complete, append-only record of every counted answer.
- **The Statistics screen derives every timeframe from it, All time included**, through one
  family of pure functions in [`src/utils/`](../../../src/utils/) that take a start time (`null`
  for All time). An answer counts when its session's deck exists, **its card is still in that
  deck**, and its `answeredAt` is at or after the start. Excluding removed cards' answers is what
  makes a removed card take its statistics with it ([ADR-0011](0011-deck-editing-is-one-action.md))
  on this screen too.
- **The card counters stay**, unchanged in shape. The Decks screen's Mastery bar, the Deck
  statistics screen and Hardest first keep reading them.

### The counters and the log are kept equal

For every card in every deck, its three counters equal the number of results with that card's id,
by answer, across the sessions of its deck. Every action keeps that true:

| Action | Counters | Results |
|---|---|---|
| `recordAnswer` | +1 | +1, with `answeredAt` |
| `recordReviewAnswer`, `clearSession`, `clearCompletedSessions`, `replaySession`, `startSession` | — | — |
| `resetDeckStats`, `deleteDeck` | zeroed / removed | the deck's sessions removed |
| `updateDeck`, a card removed | removed with the card | kept, and not counted, because the card is gone |
| `deleteSession` (**Discard session**) | **−1 per result of the discarded session** | removed with the session |

**`deleteSession` now withdraws the session's answers from its deck's card counters, in the same
dispatch.** Each result decrements the matching counter of the card, if that card is still in the
deck, never below zero. `lastReviewedAt` and the deck's `lastStudiedAt` are left as they are: they
record that studying happened, and nothing reads either. [ADR-0008](0008-clear-completed-sessions.md)
already calls a discard "a mistake being undone", and an undo that left the answers behind would
break the equality above. A reducer test pins the equality across a sequence of these actions.

### New keys, nothing migrated

- **Decks move to `@easy-flashcards/decks/v2` and sessions to `@easy-flashcards/sessions/v2`.**
  The deck shape is unchanged; it moves because its counters tally answers recorded in
  `sessions/v1`, which nothing reads any more, and keeping them would make the equality false from
  the first launch.
- **The `/v1` keys are not read, not converted and not deleted.** The owner waived the conversion
  step ADR-0004 prescribes; deleting them would be an extra destructive code path for no gain.
- **`@easy-flashcards/categories/v1` is untouched.** Custom categories survive the upgrade.
- **Loader rule:** a result whose `answeredAt` is not a finite number reads as its session's
  `startedAt` — never `Date.now()`, which would move a corrupt answer into every window. Under
  `/v2` every result is written with one, so this is repair of a bad record, not a migration.

### Timeframes

Timeframes are a view, not data: nothing about them is stored.

- **All time**: no start.
- **This month**: from local midnight on the first day of the current calendar month.
- **Last 7 days**: from local midnight six days before today — today and the six calendar days
  before it.
- Both are computed in the **device's local time zone** at the moment the figures are derived,
  from a `now` passed in, so they are testable. Only a start is applied; there is no end.
- An answer belongs to a window by its own `answeredAt`, not by its session's start, so a session
  that spans a boundary is split across it.

### What a timeframe changes

- **Changes:** the Mastery ring and its legend, the **Total reviews** and **Sessions** Stat tiles,
  and on each Deck stats card the Mastery bar, **Reviews** and **Sessions**. A session is in a
  window when it was started in it or has an answer in it; under All time that is every session,
  as today.
- **Does not change:** the **Decks** and **Total cards** tiles, a deck's **Cards**, its **Last**
  date, and the Deck statistics screen, which stays all time.

## Alternatives Considered

- **A new answer-log key** (`{ cardId, deckId, answer, at }`). Rejected: it duplicates what the
  session results hold, and adds a fourth whole-array write per answer, a module, and cascade rules
  for *Delete deck*, *Reset statistics*, Discard and card removal that sessions already obey.
- **Timestamps on the card** (a list of answer times per card). Rejected: it duplicates the results
  inside the decks key, which is rewritten on every answer, and has no answer type without a second
  list per answer.
- **Keep All time on the counters and use the log only for windows.** Smallest change to the screen.
  Rejected because the chips could then disagree with each other on one screen, which is the first
  thing a user would notice.
- **Drop the counters and derive every statistic from the results.** One source of truth by
  construction. Rejected for now: it rewrites the Decks screen, the Deck statistics screen, Hardest
  first, deck editing, import and most of the tests, for numbers the equality above already makes
  identical. It is the route to take if the two are ever found to drift.
- **Leave Discard as it is.** Rejected: the Statistics screen and the Deck statistics screen would
  then disagree after any discard of a part-answered session, one tap apart.
- **Stay under `/v1` and give old results a guessed `answeredAt`** (the session's start or last
  update). Rejected: ADR-0004 Amendment 1 keeps a field under `/v1` only when its default is the
  true value for every older record, and a guessed time would place old answers in windows they
  were never given in.
- **Stay under `/v1` and drop old sessions.** Rejected: `decks/v1` would keep counting their
  answers, so the counters and the log would disagree from the first launch.
- **Read `/v1` once and convert it.** What ADR-0004 prescribes; waived by the owner.
- **Last 7 days as a rolling 168 hours.** Rejected: it moves while the screen is read, splits a day
  at the current hour, and is off by an hour across a daylight-saving change. Calendar days match
  how *This month* is cut.

## Consequences

### Positive

- The three chips are computed by one function from one source, so they cannot disagree, and All
  time on the Statistics screen equals what the Deck statistics screen shows.
- No new key, module or cascade rule: sessions already have the lifecycle the log needs.
- Every timeframe rule is a pure function with `now` as an argument, so it is unit-tested.
- A missed creation site fails `npm run typecheck`, because `answeredAt` is required.
- Downgrading is safe for the data: an older build reads and writes only `/v1`, so it never touches
  the `/v2` keys.

### Negative

- **Upgrading hides every existing deck and session.** They stay in the `/v1` keys, unread; the user
  re-imports. Approved by the owner. A downgrade shows the old `/v1` data again, and reinstalling
  the newer build shows the `/v2` data; the two never merge.
- **The `/v1` keys are orphaned bytes** for as long as the app is installed.
- **Discard session is now an undo of its answers.** A discard of a part-answered session lowers
  the card counters, and its confirmation has to say so. `lastReviewedAt` and `lastStudiedAt` are
  not rolled back.
- **Every result grows by one number**, and the sessions key is still written whole on each answer
  ([ADR-0005](0005-answers-recorded-immediately.md)).
- **Windows follow the device clock.** A time-zone change or a clock set back moves answers between
  windows, and an answer stamped in the future counts in every window. A Statistics screen left
  open across midnight keeps its old window until its data or the selection changes.
- **The equality is held by the reducer, not by storage.** A future action that changes counters
  or results without the other breaks it silently on screen; only the reducer test catches it.
- The Learn screen's Session cards still count a removed card's answers in their session's tally,
  as before; only the Statistics screen excludes them.

### Not decided here

- Whether the Deck statistics screen follows the selected timeframe.
- Custom date ranges, charts over time, and remembering the selected timeframe across launches.

## Amendment 1 — 2026-11-03

The work landed as decided. One detail of the loader rule is narrower than written: a result with
no finite `answeredAt` reads as its session's `startedAt` **after normalisation**, and the sessions
loader reads a missing or non-numeric `startedAt` as `Date.now()`, as every loader does for a
missing timestamp ([ADR-0004](0004-versioned-defensive-storage.md)). So a session record missing
both lands its answers at the time it is loaded, in every window at that moment, until the next
save fixes that time. Under `/v2` every session and result is written with both, so this is a
corrupt record only; the rule stands.

## Amendment 2 — 2026-11-04

Recorded ahead of the work it governs. The decision above is unchanged. This settles both items of
*Not decided here* that concern the **Deck statistics screen**, for that screen only, as part of
its redesign.

- **The Deck statistics screen stays all time.** It has no Timeframe chips and does not follow the
  Statistics screen's selection, as *What a timeframe changes* already says. That settles
  "whether the Deck statistics screen follows the selected timeframe": it does not.
- **It gains three figures over time, all derived from this deck's sessions** — their snapshots
  and their results, the answer log — and none from the counters:
  - **A session history:** one column per recent session of this deck, the newest N by
    `startedAt`, each built from the session's own snapshot: its `cardIds` length, its tally of
    results by answer, and its `startedAt`. Active and cleared sessions are included, as every
    session statistic includes them ([ADR-0008](0008-clear-completed-sessions.md)). N is a
    presentation constant, not stored.
  - **Each card's last-reviewed date:** the latest `answeredAt` among that card's results in this
    deck's sessions, *Never* when there is none. It deliberately does **not** read
    `Card.lastReviewedAt`: a **Discard session** withdraws its answers from the counters but leaves
    `lastReviewedAt` as it was (*The counters and the log are kept equal*, above), so after a
    discard it can name a review that no longer exists. Read from the log, a discarded answer
    leaves the date with it. `lastReviewedAt` stays written and unread.
  - **A change since the last session:** the success rate computed from the log over the cards
    still in the deck, minus the same rate computed without the session holding the newest answer,
    in percentage points. It is `null`, not `0`, when either rate cannot be computed. By the
    equality above, the first of the two rates is the headline rate.
- **The headline success rate, the answer tiles and the card rows still read the counters**, as
  the decision says. Only the three figures above read the log.
- **Settles "charts over time" for this screen only.** Charts over time on the Statistics screen,
  custom date ranges, and remembering the selected timeframe across launches are still not decided.
- Every figure is a pure function in [`src/utils/`](../../../src/utils/), called from the screen
  and never stored. **No storage change, no new key, no store action, nothing stored**, and no
  dependency is added.
- **Accepted inconsistency, recorded as known debt:** a session column counts the answers of cards
  removed from the deck since, exactly as the Learn screen's Session card does (the last *Negative*
  consequence above), while the headline, the answer tiles and the change since the last session
  do not. After an edit that removes answered cards, a session column can therefore show more
  answers than the headline accounts for. The architecture overview's *Known debt* records it once
  the work lands.

## Amendment 3 — 2026-11-04

Recorded ahead of the work it governs. The decision above is unchanged, and so are Amendment 2's
data rules. This replaces only the **look** of Amendment 2's session history: it was one column
per session; it becomes a **stacked area chart**.

- **What is drawn.** The newest N sessions of the deck, oldest on the left. Each session is a
  point on the X axis, and its bands stack bottom to top: one per answer and one for
  **unanswered** cards. Smooth curves join each band from one session to the next.
- **The Y axis is a percentage of each session's own cards**, not a count. Each band's height at a
  session is its share of that session's snapshot — results by answer, and unanswered, over its
  `cardIds` length — so every session spans the full height. Counts are not used because session
  sizes differ: a session over 5 cards beside one over 56 would make the small one unreadable.
- **The X axis is ordered by session start, not spaced by time.** Sessions sit at equal intervals in
  `startedAt` order, whatever the time between them.
- **The curves between sessions are visual only.** They do not mean the deck passed through those
  states between two sessions; nothing was measured there. Markers sit only at the real sessions,
  and only they carry values.
- **Each curve is a cubic Bézier with horizontal tangents at both sessions.** Every boundary
  between two bands is then monotonic between neighbouring sessions, so stacked boundaries can
  never cross or overshoot a band, as an unconstrained spline could.
- **One session is drawn as a single column** of the same bands, since there is nothing to join.
  **No session** keeps the empty state the card shows today.
- **Active and cleared sessions stay included**, as Amendment 2 says; an active session's
  unanswered cards are its **unanswered** band.
- **N stays a presentation constant, 5**, not stored.
- **The latest session is emphasised neutrally**, not in green. Green means **Ok** on this screen,
  and a success rate of 70% or more, so a green highlight would read as a verdict on the session.
- **Nothing persisted changes.** No storage key, no store action, nothing stored. The geometry is a
  pure function in [`src/utils/`](../../../src/utils/), Jest-tested.
- **This drawing relies on [ADR-0018](0018-react-native-svg-draws-charts.md)**, which adds
  `react-native-svg` for data charts. Amendment 2 said no dependency is added; that was true of
  Amendment 2, and it is this amendment that needs one.
- The accepted inconsistency Amendment 2 records is unchanged: a session's bands still count the
  answers of cards removed from the deck since.

## References

- [ADR-0002](0002-sessions-are-snapshots.md) — Amendment 7, a result records its time
- [ADR-0003](0003-single-context-reducer-store.md) — derived values are computed
- [ADR-0004](0004-versioned-defensive-storage.md) — Amendment 4, the `/v2` keys
- [ADR-0005](0005-answers-recorded-immediately.md) — Amendment 4, what `recordAnswer` writes
- [ADR-0007](0007-okeish-third-answer.md) — Okeish earns no credit, in every timeframe
- [ADR-0008](0008-clear-completed-sessions.md) — Amendment 2, Discard withdraws answers
- [ADR-0009](0009-error-review-marks-cards-fixed.md) — review answers are not results
- [ADR-0011](0011-deck-editing-is-one-action.md) — a removed card takes its counters
- [ADR-0014](0014-deck-belongs-to-one-category.md) — Amendment 6, the same redesign's category row
- [ADR-0018](0018-react-native-svg-draws-charts.md) — the drawing dependency the stacked area
  Session history needs (Amendment 3)
- [`src/types.ts`](../../../src/types.ts) — `SessionResult`, `SessionCount`
- [`src/state/reducer.ts`](../../../src/state/reducer.ts) — `recordAnswer`, `deleteSession`
- [`src/storage/decksStorage.ts`](../../../src/storage/decksStorage.ts),
  [`src/storage/sessionsStorage.ts`](../../../src/storage/sessionsStorage.ts)
- [`src/utils/timeframe.ts`](../../../src/utils/timeframe.ts) — `TIMEFRAMES`, `timeframeStart`
- [`src/utils/stats.ts`](../../../src/utils/stats.ts) — `getDeckStatsSince`, `getGlobalStatsSince`,
  `countSessionsSince`, `countSessionsByDeckSince`
- [`src/components/TimeframeChips.tsx`](../../../src/components/TimeframeChips.tsx),
  [`src/screens/StatsScreen.tsx`](../../../src/screens/StatsScreen.tsx)
- [`src/screens/LearnScreen.tsx`](../../../src/screens/LearnScreen.tsx) — the Discard session
  confirmation
- [`src/screens/DeckStatsScreen.tsx`](../../../src/screens/DeckStatsScreen.tsx) — the Deck
  statistics screen, all time, with its figures over time (Amendment 2)
- [`src/components/SessionHistoryChart.tsx`](../../../src/components/SessionHistoryChart.tsx) —
  the session history, redrawn as a stacked area chart (Amendment 3); its geometry goes in
  `src/utils/historyChart.ts`, created by that work
- [`__tests__/reducer.test.ts`](../../../__tests__/reducer.test.ts) — *counters and the answer log*
- [ARCHITECTURE.md §1–§5, §8](../ARCHITECTURE.md) — updated for this record by the change that
  implemented it
- [AGENTS.md](../../../AGENTS.md) — *State ownership*, *Storage keys*
