---
description: Canonical names for Easy Flashcards tabs, screens, areas, controls, and UI interactions.
applyTo: "src/screens/**, src/components/**, src/navigation/**"
---

# UI vocabulary

> **Maintenance — owner: Designer. Mode: in-change.**
> If you **add** a named screen, area, dialog, or control, name it here in the same change. You
> built it, you know it, and a vocabulary file that lags the UI misleads every agent it is injected
> into. **Renaming, removing, or resolving a collision between existing terms is the Designer's** —
> those need the whole vocabulary in view, not one entry.

Use these canonical names when discussing, implementing, and testing Easy Flashcards' UI. Prefer
the product-facing name in prose and include the symbol when extra precision is useful. Treat
aliases as input synonyms only: use the canonical bold name in responses, implementation notes,
and tests.

Where a symbol predates its canonical name, the symbol is given in parentheses and the mismatch is
called out. Use the canonical name in prose; use the real symbol in code.

## Tabs

The app has **three tabs**, in this order. They are peers — switching tab is not navigation into a
hierarchy, and each tab keeps its own stack.

- **Decks tab** (`DecksTab`): where decks are imported, started, and deleted.
  Aliases: **decks**, **library**
- **Learn tab** (`LearnTab`): where sessions live. Also holds the Study screen.
  Aliases: **sessions**, **study tab**
- **Statistics tab** (`StatsTab`): where results are read. Never writes anything except the reset.
  Aliases: **stats**, **statistics**

The app opens on the **Learn tab** when any session is unfinished, and on the **Decks tab**
otherwise ([ADR-0006](../../docs/architecture/decisions/0006-launch-on-the-tab-with-unfinished-work.md)).
Say "the app launches on the tab with unfinished work", not "the app defaults to Learn".

## Screens

Five screens. Three are the roots of their tabs; two are detail screens pushed onto a stack.

- **Decks screen** (`DecksScreen`, route `DecksList`): The list of imported decks, one **Deck card**
  each. Root of the Decks tab. Aliases: **deck list**, **deck library**
- **Learn screen** (`LearnScreen`, route `LearnList`): The list of sessions, one **Session card**
  each, unfinished ones first. Root of the Learn tab. Aliases: **session list**
- **Study screen** (`StudyScreen`, route `Study`, params `sessionId` and optional `mode`): One
  session being studied — the flip card, the answer buttons, the progress header, and the
  end-of-session summary — or, with `mode: 'review'`, one completed session's errors being
  reviewed (**review mode**, below). Pushed onto the Learn stack. Aliases: **study view**, **the
  session screen**
- **Statistics screen** (`StatsScreen`, route `StatsOverview`): Totals across every deck, then one
  row per deck. Root of the Statistics tab. Aliases: **stats overview**
- **Deck statistics screen** (`DeckStatsScreen`, route `DeckStats`, param `deckId`): One deck's
  totals, and every card in it ordered hardest first. Pushed onto the Statistics stack.
  Aliases: **per-deck statistics**, **card breakdown**

Use **screen** only for a route in a navigator. Use **tab** for the three above, **dialog** for
modal content, **sheet** for the bottom sheet, and **area** for a region inside a screen.

**There is no Settings screen.** The *Settings* menu item shows a "not available yet" alert. Do not
refer to one as though it exists.

## Screen structure

The split here is by **folder, not by suffix** — there is no `*Screen` / `*Content` pair.

- **Screens** (`src/screens/`) are the stateful half: they call `useDecks()` and `useNavigation()`,
  derive what they need with `src/utils/stats.ts` inside a `useMemo`, and own local UI state.
- **Components** (`src/components/`) are the stateless half: plain props and callbacks, no store
  and no navigator.

`AppMenu` is the one exception and a deliberate one: it calls `exportSampleDeck` directly because
it has no screen to belong to — the **Header toolbar** mounts it (boxed) on the Decks, Learn and
Statistics screens (the navigator's default `headerRight` still mounts it plain, until a screen
overrides it). It takes optional `extraItems` so a screen can add items without `AppMenu` gaining
store knowledge: each of those screens overrides `headerRight` itself (via
`navigation.setOptions`), and the Learn screen's Header toolbar passes `menuItems` that supply
**Clear completed sessions**.

## Header and menus

- **App menu** (`AppMenu`, labelled `App menu`): the three-dot control at the right of the header
  on the three root screens (inside the **Header toolbar** on all three, boxed). Holds **Export
  sample deck** and **Settings**; on the Learn screen it also holds **Clear completed sessions**,
  first. Detail screens do not show it. Aliases: **the
  header menu**, **the overflow menu**
- **Kebab menu** (`KebabMenu`): the reusable three-dot control. Default label `More options`;
  callers override it. Opens a **Menu sheet**. Has a `plain` variant (bare dots) and a `boxed`
  variant (a bordered rounded square, used by the **Header toolbar**). Aliases: **three-dot menu**,
  **options button**
- **Menu sheet** (`MenuSheet`): the bottom sheet a Kebab menu opens — a dimmed backdrop and a list
  of **Menu items**, each with an optional **Menu icon** and an optional `destructive` flag that
  colours it danger. This is the app's only menu surface (a **menu** is a list of actions; the
  **Session setup dialog** is a dialog, not a second menu). Aliases: **bottom sheet**, **action
  sheet**
- **Menu icon** (`MenuIcon`): the small glyph on a menu item, and also used outside menus (the
  **Header toolbar**, the **Deck meta row**, and the **Session card footer**). The available names
  are the `MenuIconName` type in
  [src/components/MenuIcons.tsx](../../src/components/MenuIcons.tsx), and every glyph is drawn from
  nested `View`s. An optional `size` scales a glyph from its 20-point grid. **Reuse an existing
  name rather than adding a second glyph for an existing idea**, and remember that adding one means
  drawing it, not importing it.
- **Export sample deck dialog** (in `AppMenu`): the centred `Modal` explaining the CSV format,
  with **Share** and **Cancel**. One of the two dialogs in the app that are not an `Alert`; the
  other is the **Session setup dialog**.

Everything else that interrupts the user is a native `Alert` — confirmations, failures, and the
"not available yet" stubs.

## Header toolbar

- **Header toolbar** (`HeaderToolbar`): the rounded-square buttons at the right of the header on
  the Decks, Learn and Statistics screens, in this order: **Search button**, **Filter button**
  (Decks and Learn only), and the **App menu** (the Kebab menu in its `boxed` variant). The Filter
  button is rendered only when the screen supplies its handler and label, so **Statistics shows the
  Search button and the App menu alone**. Each screen sets the toolbar as `headerRight` itself,
  supplying the button labels and, optionally, `menuItems` for the App menu. All three screens use
  the same header style: a `colors.background` header (not the `surface` default of the other
  screens) and a 24-point, 700-weight title. It was the **Decks toolbar** before the Learn screen
  used it.
- **Search button**: labelled `Search decks` on the Decks and Statistics screens and `Search
  sessions` on the Learn screen. **Toggles the Search bar**: pressing it opens the bar, and
  pressing it while the bar is open behaves exactly like the **Close search button** — clears the
  query and hides the bar. While the bar is open the button is **active**: primary-coloured border
  and glyph, and `accessibilityState.expanded` is true.
- **Filter button**: labelled `Filter decks` on the Decks screen and `Filter sessions` on the Learn
  screen. **A stub** — shows a "not available yet" alert.

## Search

- **Search bar** (`SearchBar`): the rounded `surface` bar at the top of a screen's content, above the
  list and below the header, shown only while search is open. A search glyph (the `search` Menu
  icon), the **Search input**, and the **Close search button**. Stateless: the screen owns the
  query and whether the bar is open. The list filters as the user types; a title matches when
  **every typed word appears in it, in any order, case-insensitively**. A blank query shows
  everything. What is searched is the **title** — the deck's name on Decks and Statistics, the
  session's deck name on Learn. Aliases: **search field**
- **Search input**: the text field inside the Search bar. Auto-focused on open, with auto-correct
  and auto-capitalise off and a `search` return key. Placeholder `Search decks` on Decks and
  Statistics, `Search sessions` on Learn. Accessibility label `Search text` — deliberately not the
  Search button's label, so the two can be told apart by label alone.
- **Close search button**: the × (the `close` Menu icon — not the **Answer icon** `cross`) at the
  end of the Search bar, labelled `Close search`. Clears the query and hides the bar.
- **Search empty state**: the **Empty state** shown when a query is typed and matches nothing, in
  place of the list: title `No matches`, message `Nothing matches "{query}".`, action
  **Clear search**. **Clear search** empties the query but **leaves the Search bar open** and
  focused for the next try; only the Close search button and the Search button close it. Distinct
  from `No decks yet`, `No sessions yet` and `No statistics yet`, which mean there is nothing to
  search.

## Decks screen

- **Deck card** (`DeckCard`): one deck's row — a header (its name on one truncated line, its card
  count, and the **Deck options menu**), a **Mastery bar**, and a **Deck meta row**.
- **Mastery bar** (`MasteryBar`): the darker inset panel on a Deck card — a segmented track with one
  segment per answer, then a three-column legend of **Answer icon** (tick, question mark, cross) and
  percentage, with no text label. Segments and icons are green `Ok`, amber `Okeish`, red `Not ok`,
  sized by each answer's share of all reviews (`answerShares`). A deck with no reviews shows an
  empty track, `--` in every column and grey icons, not 0%. The `Ok` percentage
  is the deck's success rate. Not the **Success bar**, which carries one rate; do not call this one
  by that name. Labelled `Mastery: {summary}` as a whole.
- **Deck meta row**: the footer of a Deck card — on the left, two lines: a clock glyph, `{n}
  session(s)` and the **Active pill**, then `Last: {date}` (or `Last: Never`); on the right, the
  **Start session button**, vertically centred. The structure is the same on every card, reviewed or
  not; only the first line wraps, at very large font sizes.
- **Active pill**: `{n} active`. Tinted primary with a dot when `n` is above zero, muted grey when
  it is zero.
- **Start session button**: the small rounded-square primary button with a play glyph at the end of
  the Deck meta row, labelled ``Start session for {deck name}``. Icon-only, with no visible text.
  Creates a **new** session over the whole deck, in deck order, **not inverted and not shuffled**,
  and navigates across tabs into the Study screen; it does not resume an active one.
- **Deck options menu**: the Kebab menu on a Deck card, labelled ``Options for {deck name}``.
  Holds **Start session with options** (play glyph; opens the **Session setup dialog**), **Edit
  deck** (a stub) and **Delete deck** (destructive, confirmed by an `Alert`). It was **Shuffle and
  start session** before
  [ADR-0010](../../docs/architecture/decisions/0010-inverted-sessions.md).
- **Session setup dialog** (`SessionSetupDialog`): the centred `Modal` that **Start session with
  options** opens, titled `Start session` over the deck's name. It holds two independent **Session
  options** and the **Start** and **Cancel** buttons. Not the **Session options menu**, which is the
  Kebab menu on a Learn **Session card** — "session options" there are menu items, here they are
  checkboxes. Aliases: **options dialog**, **start options**
  - **Session options**: two checkbox rows, **Inverted** (the card front shows the answer and the
    back the question) and **Shuffle** (random card order). They are independent — either, both or
    neither. A row is a `Pressable` with `accessibilityRole="checkbox"`, labelled `Inverted` or
    `Shuffle`, with its checked state in `accessibilityState`. **Both start unchecked every time the
    dialog opens.** With both unchecked, **Start** does the same as the **Start session button**.
  - **Start**: the primary Button. Creates a **new** session with the chosen options and navigates
    across tabs into the Study screen, as the Start session button does. An empty deck alerts
    `Empty deck` instead, on every start path including this one.
  - **Cancel**: the secondary Button; also the backdrop and the Back button. Creates nothing.
- **Inverted session**: a session whose faces are swapped — the Flip card's front shows each
  card's answer and its back the question
  ([ADR-0010](../../docs/architecture/decisions/0010-inverted-sessions.md)). The direction is fixed
  when the session is created and never changes. It is kept by the **Replay button**, **Start a
  new session** and **Study the whole deck again**, and a **Review pass** shows the faces in the
  original session's direction. Only starting from a deck chooses a direction; the plain **Start
  session button** is never inverted. Statistics do not distinguish it.
- **Add deck button**: the floating action button at the bottom right, a primary rounded square
  labelled `Add a deck`. It is
  the app's only FAB. Shows a spinner while an import is in flight. Opens the **Add deck menu**.
  Aliases: **the + button**, **the FAB**
- **Add deck menu**: the Menu sheet behind the Add deck button — **Import deck from file**, which
  opens the **Import format menu**, and **Add deck manually** (a stub).
- **Import format menu**: `CSV`, `XML`, `JSON`, `JSONL`. **Only CSV is implemented**; the other
  three alert. Do not describe the app as supporting four formats.
- **Decks empty state**: `No decks yet`.

## Learn screen

- **Session card** (`SessionCard`): one session's row — a header (the deck name on one truncated
  line over the **Session status pill**, and the **Session options menu**), a **Session results
  bar**, and a **Session card footer**. Active and completed cards share this structure and the
  same neutral border; the pill and the footer buttons are what differ. Only **listed** sessions
  get one — active, or completed and not cleared.
- **Session status pill**: the small rounded pill under the deck name, whose text is
  ``In progress — {answered}/{total} cards`` on an active session and ``Completed — {n} cards`` on a
  completed one. Active is tinted primary with a dot; completed is tinted success with a tick
  (**Answer icon**). "In progress" and "Completed" are the user-facing words; **active** is the
  word used in code and in prose about state.
- **Inverted pill**: the neutral (`surfaceAlt` fill, `border` outline, muted text) pill reading
  `Inverted`, shown beside the Session status pill on an **inverted session**, in both active and
  completed states, and absent otherwise. It wraps under the status pill when the row is too narrow.
  Labelled `Inverted session`. Deliberately not tinted: direction is not a state. The Study screen
  shows the same pill in its **Progress header**.
- **Session results bar** (`SessionResultsBar`): the segmented track and legend on a Session card,
  labelled ``Progress: {answered} of {total} answered — {n} ok, {n} okeish, {n} not ok``. One
  segment per answer — green ok, amber okeish, red not ok — each sized by its share of **all the
  session's cards** (`sessionProgressShares`), so the unfilled remainder of the track is the
  unanswered part. Below it, a **legend** of three **Answer icons** (tick, question mark, cross),
  each with its count; the icons are grey while nothing is answered. Not the **Session progress
  bar** on the Study screen, which shows position through the session as one white bar, and not the
  **Success bar** or the **Mastery bar**, which are sized by answers as a share of *reviews* or a
  single rate.
- **Session card footer**: the bottom row of a Session card, under a divider — on the left a clock
  glyph and `Started {date}`, on the right the buttons below, vertically centred: the **Resume
  button** on an active session; on a completed one the **Review errors button** (when the session
  ever had errors) to the left of the **Replay button**.
- **Resume button**: the primary icon-only Button with a play glyph, shown **only on an active
  session**, labelled ``Resume session for {deck name}``. Continues that session in the Study
  screen.
- **Replay button**: the secondary icon-only Button with a `replay` glyph, shown **only on a
  completed session**, labelled ``Replay session for {deck name}``. In one step (`replaySession`) it
  creates a **new, active, counted** session over the same cards that still exist in the deck,
  **clears the original** (a **Cleared session**: the completed Session card leaves the list and a
  new active one takes its place), keeps the original's **inverted** setting, and opens the
  new session in the Study screen. No confirmation. If the deck is gone or no card resolves it
  shows a `Deck unavailable` alert and changes nothing. Not **Start a new session** in the Session
  options menu, which is also counted and over the whole deck but clears nothing.
- **Review errors button**: the warning icon-only Button with a `replay` glyph, shown **only on a
  completed session that ever had missed or unsure cards** (hidden when it never had any, and when
  its deck no longer resolves), to the left of the Replay button. Labelled ``Review the {n} missed
  or unsure card(s) for {deck name}`` while any are outstanding, and ``All missed or unsure cards
  fixed for {deck name}`` when none are. It starts a **review**, not a session: it opens the Study
  screen in **review mode** and creates nothing, clears nothing and changes no statistic
  ([ADR-0009](../../docs/architecture/decisions/0009-error-review-marks-cards-fixed.md)). It was
  the **Replay missed button**, which created a counted session. "Unsure" appears in its label as in
  the **Review summary** action. It has three parts:
  - **Review badge**: the small round badge on the button's top-right corner, a sibling of the
    button so that dimming a disabled button does not fade it, and hidden from accessibility.
    Warning-ringed and showing the **Review count** while errors are outstanding; success-ringed
    and showing the **Review done tick** when none are.
  - **Review count**: the number in the badge — the outstanding missed or unsure cards, the same
    number a tap would review. Capped at `99+`.
  - **Review done tick**: the tick (**Answer icon**) in the badge once every missed or unsure card is
    fixed. The button is then **disabled**, and its label says everything is fixed.
- **Search button** and **Filter button** on this screen belong to the **Header toolbar**; the
  Search button opens the **Search bar** (placeholder `Search sessions`).
- **Cleared session**: a completed session the user removed from the Learn list
  ([ADR-0008](../../docs/architecture/decisions/0008-clear-completed-sessions.md)). It is hidden
  from the Learn screen but kept and **still counted everywhere** (Sessions tile, Deck meta row,
  Deck summary), and there is no way to show it again. A session becomes cleared in three ways:
  **Clear session** (one), **Clear completed sessions** (all), and the **Replay button**
  (the replayed one). Say "clear", never "delete", for this; only
  **Discard session** really deletes. An active session cannot be cleared.
- **Clear completed sessions**: the destructive item at the top of the **App menu** on the Learn
  screen (delete glyph). With nothing to clear it alerts `No completed sessions to clear.`;
  otherwise an `Alert` says how many completed sessions will be removed from the list and that
  their results stay in Statistics, with **Cancel** and a destructive **Clear**.
- **Session options menu**: the Kebab menu on a Session card, labelled
  ``Options for the {deck name} session``. Holds **Start a new session** (a counted session over
  the whole deck, in deck order, keeping the session's **inverted** setting; it clears nothing and
  shows `Deck unavailable` when the deck is gone or empty) and a destructive item
  labelled **Discard session** when active (a real delete) and **Clear session** when completed
  (archives it as a **Cleared session**; the confirmation says its results stay in Statistics).
  **Clear session** was **Delete session** before ADR-0008.
- **Sessions empty state**: `No sessions yet` when no session exists at all, and `No sessions to
  show` when sessions exist but every one is cleared (its message says cleared sessions still count
  in Statistics). Both carry a **Go to decks** action.

## Study screen

The densest screen in the app, and the one with vocabulary worth being precise about.

- **Review mode**: the Study screen opened with `mode: 'review'` on a **completed** session, by the
  **Review errors button** or the **Session summary**'s review action. It works through that
  session's missed or unsure cards in **Review passes**, records an Ok as that card being **fixed**
  on the session, and otherwise **changes no statistic and creates no session**
  ([ADR-0009](../../docs/architecture/decisions/0009-error-review-marks-cards-fixed.md)). Unlike
  an ordinary session its answers are not in `session.results`. It is **a review, not a session**:
  say "review", not "review session".
- **Review pass**: one run through the cards outstanding when it began — a snapshot, each card
  once, in session order, not looping. Fixing a card mid-pass does not shorten the pass on screen.
  Its answers live only in the screen; leaving mid-pass loses nothing stored, and the next pass
  holds whatever is still outstanding. It uses the session's direction (**inverted** or not).
- **Progress header**: `Card {n} of {total}` on the left, `Ok {n}` on the right. Only plain ok
  answers are counted there, not okeish. In review mode `{total}` is the **pass length** and `Ok`
  counts the pass's own answers. On an **inverted session** the **Inverted pill** sits
  between them, labelled `Inverted session: the front shows the answer`; a normal session shows
  nothing there.
- **Session progress bar**: the thin **Success bar** under the progress header. It shows **how far
  through the session the user is** (in review mode, through the pass), not how well they are
  doing — the same component, a different
  meaning. Say which you mean. Not the **Session results bar** on the Learn screen's Session cards.
  It is drawn in fixed white (`colors.text`, via `SuccessBar`'s `color` prop), **not** the
  success/warning/danger rate colours, so it cannot be read as a rate.
- **History strip** (`HistoryStrip`, labelled `Answers so far`): the horizontal row of small tiles,
  one per answer — green for ok, yellow (warning) for okeish, red for not ok. The tile for the
  card on screen is taller and outlined. Auto-scrolls to keep the current card in view. In review
  mode it shows the **pass's own** answers, not the session's.
  Aliases: **the answer tiles**
- **Flip card** (`FlipCard`): the card itself. Two faces, **Question** and **Answer**, rotated with
  a `rotateY` animation. Its accessibility label is the **action**, not the state — `Show answer`
  while the question is up, `Show question` while the answer is. Each face scrolls independently.
  Flipping it is what unlocks the **Answer buttons**. Aliases: **the card**. Its props are `front`
  and `back`, and the face labels (`QUESTION`, `ANSWER`) and hints (`Tap to reveal the answer`)
  are **roles, not card fields**: the front is always labelled `QUESTION` and the back `ANSWER`,
  whichever of the card's fields each shows. In an **inverted session** the front therefore shows
  the card's answer under `QUESTION`; the **Inverted pill** is what explains it. Do not relabel
  the faces by direction.
- **Answer buttons**: three **icon-only** Buttons side by side at the bottom, in this order: **Not
  ok** (danger, cross), **Okeish** (warning, question mark), **Ok** (success, tick). They have no
  visible text; the accessibility labels are `Not ok`, `Okeish`, and `Ok`. They are **disabled
  until the user has flipped the current card at least once**, so the answer is read before it is
  graded; the requirement starts over for each new card. They are also **disabled while
  reviewing** (an already answered card). In review mode they work the same, but only **Ok** writes
  anything — it marks the card fixed; **Okeish** and **Not ok** are shown in the pass and recorded
  nowhere, and the card comes back in the next pass.
- **Okeish**: the third answer — half-remembered, or got with effort. It is stored as `okeish`,
  counts as a review but **earns no credit** in the success rate (`ok / (ok + okeish + not ok)`, so
  an okeish-only card is 0%, not `--`), and a **review** treats it as an error along with the
  missed cards ([ADR-0007](../../docs/architecture/decisions/0007-okeish-third-answer.md)). The UI
  word is always "okeish"; "unsure" appears only in the labels of the **Review errors button** and
  the review actions (``Review the {n} missed or unsure``).
- **Swipe hint**: the dim line between the card and the buttons. It is **empty except while
  reviewing**, when it reads `Reviewing an answered card — swipe left to get back to where you were`.
  Nothing on screen advertises swiping right; the gesture is undiscoverable until tried. It reads
  the same inside a Review pass.
- **Reviewing** (-ing): looking back at a card that was already answered. It is read-only —
  an answer cannot be changed and the Answer buttons are disabled
  ([ADR-0005](../../docs/architecture/decisions/0005-answers-recorded-immediately.md)). The card
  the user is actually on is the **frontier**. Swiping right **wraps**: from the frontier it goes
  to the newest answered card, then each older one, and from the oldest it returns to the frontier
  (`previousReviewIndex`); it does nothing until a card has been answered. Swiping left steps
  toward the frontier one card at a time and stops there. Do not call reviewing "going back" —
  that is navigation.
- **Review, Reviewing, Reviewed, Reviews** — four words that must not be mixed up:
  **Reviewing** (-ing) is the swipe-back above. **Review** as a noun, a verb or in a compound
  (**Review errors button**, **Review pass**, **Review summary**, `Review the {n} missed or
  unsure`, **review mode**) is the error review of a completed session. **`Reviewed {n}`** (the
  Session summary) and **`Reviews`** / `{n} reviews` (the Statistics screens, the Mastery bar)
  are counts of recorded answers, **which a review never adds to**. Never say "reviews" for the
  error review, nor "reviewing" for it.
- **Session summary**: what an ordinary session becomes once every card is answered, titled
  `Session complete`. A large success rate
  and a **Success bar**, then one row of `Ok {n}`, `Okeish {n}`, `Not Ok {n}` (tinted success,
  warning, danger), then `Reviewed {n}` on its own line. Up to three actions:
  ``Review the {n} missed or unsure`` (the outstanding not ok and okeish cards; **hidden when there
  are none**) which starts a **review** — it replaces the summary with review mode, creating no
  session — **Study the whole deck again**, and **Back to sessions**. Aliases: **end-of-session
  summary**
- **Review summary**: what review mode becomes when a **Review pass** ends (or at once, when nothing
  is outstanding), titled `Review complete`. A card, not a rate: the pass's own `Ok {n}`,
  `Okeish {n}`, `Not Ok {n}` row (omitted when the pass answered nothing), then either
  `{n} still to fix` or, when none remain, the **All fixed state**. Actions: ``Review the {n}
  missed or unsure`` (the **next pass**, only while any remain) and **Back to sessions**. There is
  no success rate, no Success bar and no `Reviewed {n}`, because nothing was recorded.
- **All fixed state**: the success-coloured tick (**Answer icon**) over `All fixed`, shown in the
  Review summary in place of `{n} still to fix` once every missed or unsure card is fixed.
- **Study empty state**: `Nothing to study` (message `This session is no longer available.`), with
  a **Back to sessions** action. Also what review mode shows for a session that is missing, still
  active, or whose deck is gone.

## Statistics screens

- The **Statistics screen** has a **Header toolbar** with the **Search button** (`Search decks`) and
  the **App menu** only — no Filter button — and the same header style as Decks and Learn. Its
  **Search bar** filters the **Deck stats rows** by deck name; the **Global summary** is not
  filtered and stays totals across every deck. The Deck statistics screen has no search.
- **Global summary**: the block at the top of the Statistics screen — a large success rate above a
  **Stat grid** of seven **Stat tiles** in two rows: `Decks`, `Cards`, `Sessions` (three columns),
  then `Reviews`, `Ok` (tinted success), `Okeish` (tinted warning), `Not Ok` (tinted danger) (four
  columns). `Stat` takes a `columns` prop, `3` or `4`, that sets the tile width.
- **Deck stats row**: one deck on the Statistics screen. Pressable; opens the Deck statistics
  screen.
- **Deck summary**: the header of the Deck statistics screen — success rate, a line of
  `{n} reviews`, `{n} ok`, `{n} okeish`, `{n} not ok`, a line of `{n} sessions` and
  `Last session {date}`, and the **Reset statistics button** (`Reset statistics`, secondary, confirmed by an `Alert`).
  Resetting zeroes every card counter **and deletes every session for that deck**; say both.
- **Card stats row**: one card on the Deck statistics screen — its question and answer as
  two-line **Rich text** previews, a **Success bar**, and its counters: the rate, `{n} reviews` (or
  `Never reviewed`), `{n} ok`, `{n} okeish`, `{n} not ok`.
- **Hardest first**: the order of the Card stats rows — lowest success rate first, ties broken by
  review count, never-reviewed cards last. It is `sortCardsByDifficulty`. Do not call it "sorted by
  score".
- **Statistics empty state**: `No statistics yet`. **Deck not found** is the Deck statistics
  screen's state when its `deckId` no longer resolves, with a **Back** action.

## Shared components

- **Button** (`Button`): the only button in the app. Five variants: **primary** (filled blue, the
  default), **secondary** (filled `surfaceAlt`, light text — not outlined), **success** (green),
  **danger** (red), **warning** (amber). Handles `disabled` and `loading`, and a loading button
  shows a spinner beside its label. An optional `icon` renders a glyph before the label. With no
  `label` it is **icon-only**: `accessibilityLabel` is then required, there is no visible text, and
  it has a 48-point minimum size; while loading, an icon-only button shows the spinner in place of
  its icon. Icon-only is a mode of Button, not a second component. There is still no text button
  and no separate icon button — if you need one, that is a vocabulary change.
- **Answer icon** (`AnswerIcon`, in `AnswerIcons.tsx`): the glyph on an Answer button, in the
  **Mastery bar** and **Session results bar** legends, and in the **Session status pill** (tick) — `tick`, `cross`, or `question`, drawn from nested `View`s and hidden from
  accessibility. It is separate
  from the **Menu icon** vocabulary; do not add an answer glyph to `MenuIcon` or the reverse.
- **Not ok / Not Ok**: capitalisation differs by place. The Answer button's label is `Not ok`
  (sentence case); the tiles and the summary say `Not Ok`; the meta rows say `not ok` in running
  text. Match the place you are in.
- **Success bar** (`SuccessBar`): the horizontal rate bar, used on the Study, Statistics and Deck
  statistics screens — not the Decks screen, which uses the **Mastery bar**, nor the Learn screen,
  which uses the **Session results bar**. **Colour carries
  meaning and is fixed by the rate**: border grey for *no data*, success green at 70% and above,
  warning amber from 40%, danger red below. Grey and 0% are different states and the app
  distinguishes them. The one override is the optional `color` prop, which replaces the rate colour
  with a fixed one; only the **Session progress bar** uses it (white), because it is not a rate.
- **Empty state** (`EmptyState`): every list's empty content — a title, a message, and an optional
  action. Each one's title is listed with its screen above; the **Search empty state** is under
  **Search**.
- **Rich text** (`RichText`): renders a card's HTML. Supports inline formatting, headings, lists,
  `<br>`, `<hr>`, and `<font color>`; **there is no block layout, no images, and no tables**
  ([ADR-0001](../../docs/architecture/decisions/0001-own-the-html-renderer.md)). Honours
  `numberOfLines`, which is what the Card stats rows use.
- **Tab icons** (`DecksIcon`, `LearnIcon`, `StatsIcon`): the three tab glyphs, drawn from `View`s.

## Writing UI

These are constraints, not suggestions. Each one is load-bearing somewhere.

- **There is no icon library.** Every glyph in the app is composed from nested `View`s with
  borders and radii — `MenuIcons.tsx`, `TabIcons.tsx`, and `AnswerIcons.tsx` are the three files of
  them. A design that needs a new icon is asking for one to be drawn. Check `MenuIcon` and
  `AnswerIcon` first — reusing an existing glyph for a related idea is nearly always better than a
  new one.
- **Every token comes from [`src/theme.ts`](../../src/theme.ts).** `colors`, `spacing`, `radius` —
  twelve colours, five spacings, three radii, and no second source of styling. A raw hex or a
  magic number in a `StyleSheet` is a finding, with three existing exceptions: `mark`'s foreground in
  `RichText` and the FAB's spinner colour, both of which need contrast against a fixed background,
  and the **modal backdrop scrim** (`#000000aa`) behind the Menu sheet, the Export sample deck
  dialog and the Session setup dialog — a translucent black has to dim whatever is underneath, so
  it cannot be one of the opaque theme colours. Reuse that value for any new modal; do not pick a
  second one.
- **Every control needs an accessibility label on the same element as its press handler**, not on
  the child that draws it. `Button` and the menu items set `accessibilityRole="button"`; a bare
  `Pressable` needs both.
- **The app has no `testID` anywhere.** Controls are found by accessibility label or by text. Keep
  it that way rather than introducing a parallel identification scheme; if a label is too vague to
  find a control by, the label is the thing to fix.
- **The app is English-only and has no i18n layer.** Strings are literals in the component that
  shows them. Write them in sentence case, keep them short, and do not introduce a translation
  framework without asking.
- **The app is dark-only.** There is no light scheme and no theme switch. Do not design a surface
  that assumes one.
- **Dates and rates go through `formatDate` and `formatRate`.** They return `Never` and `--`
  respectively for the no-data case, which is deliberately distinct from `0%`.
- **A destructive action is confirmed by an `Alert`, and its menu item carries `destructive: true`.**
  Both, every time.
