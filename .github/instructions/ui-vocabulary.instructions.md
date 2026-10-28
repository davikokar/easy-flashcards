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
- **Study screen** (`StudyScreen`, route `Study`, param `sessionId`): One session being studied —
  the flip card, the answer buttons, the progress header, and the end-of-session summary. Pushed
  onto the Learn stack. Aliases: **study view**, **the session screen**
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
it has no screen to belong to — the navigator mounts it as `headerRight` on the Statistics
screen, and the **Header toolbar** mounts it (boxed) on the Decks and Learn screens. It takes
optional `extraItems` so a screen can add items without `AppMenu` gaining store knowledge: the
Learn screen overrides `headerRight` itself (via `navigation.setOptions`, as the Decks screen does)
with a Header toolbar whose `menuItems` supply **Clear completed sessions**.

## Header and menus

- **App menu** (`AppMenu`, labelled `App menu`): the three-dot control at the right of the header
  on the three root screens (inside the **Header toolbar** on Decks and Learn). Holds **Export
  sample deck** and **Settings**; on the Learn screen it also holds **Clear completed sessions**,
  first. Detail screens do not show it. Aliases: **the
  header menu**, **the overflow menu**
- **Kebab menu** (`KebabMenu`): the reusable three-dot control. Default label `More options`;
  callers override it. Opens a **Menu sheet**. Has a `plain` variant (bare dots) and a `boxed`
  variant (a bordered rounded square, used by the **Header toolbar**). Aliases: **three-dot menu**,
  **options button**
- **Menu sheet** (`MenuSheet`): the bottom sheet a Kebab menu opens — a dimmed backdrop and a list
  of **Menu items**, each with an optional **Menu icon** and an optional `destructive` flag that
  colours it danger. This is the app's only menu surface. Aliases: **bottom sheet**, **action
  sheet**
- **Menu icon** (`MenuIcon`): the small glyph on a menu item, and also used outside menus (the
  **Header toolbar**, the **Deck meta row**, and the **Session card footer**). The available names
  are the `MenuIconName` type in
  [src/components/MenuIcons.tsx](../../src/components/MenuIcons.tsx), and every glyph is drawn from
  nested `View`s. An optional `size` scales a glyph from its 20-point grid. **Reuse an existing
  name rather than adding a second glyph for an existing idea**, and remember that adding one means
  drawing it, not importing it.
- **Export sample deck dialog** (in `AppMenu`): the centred `Modal` explaining the CSV format,
  with **Share** and **Cancel**. The one dialog in the app that is not an `Alert`.

Everything else that interrupts the user is a native `Alert` — confirmations, failures, and the
"not available yet" stubs.

## Header toolbar

- **Header toolbar** (`HeaderToolbar`): the three rounded-square buttons at the right of the header
  on the Decks and Learn screens, in this order: **Search button**, **Filter button**, and the
  **App menu** (the Kebab menu in its `boxed` variant). Each screen sets it as `headerRight`
  itself, supplying the two button labels and, optionally, `menuItems` for the App menu; both
  screens' header titles are larger and bolder than the other screens'. It was the **Decks
  toolbar** before the Learn screen used it.
- **Search button**: labelled `Search decks` on the Decks screen and `Search sessions` on the Learn
  screen. **A stub** — shows a "not available yet" alert.
- **Filter button**: labelled `Filter decks` on the Decks screen and `Filter sessions` on the Learn
  screen. **A stub** — shows a "not available yet" alert.

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
  Creates a **new** session over the whole deck and navigates across tabs into the Study screen; it
  does not resume an active one.
- **Deck options menu**: the Kebab menu on a Deck card, labelled ``Options for {deck name}``.
  Holds **Shuffle and start session** (same as the Start session button, but the new session's cards
  are in random order), **Edit deck** (a stub) and **Delete deck** (destructive, confirmed by an
  `Alert`).
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
  glyph and `Started {date}`, on the right the replay and resume buttons below, vertically centred.
- **Resume button**: the primary icon-only Button with a play glyph, shown **only on an active
  session**, labelled ``Resume session for {deck name}``. Continues that session in the Study
  screen.
- **Replay button**: the secondary icon-only Button with a `replay` glyph, shown **only on a
  completed session**, labelled ``Replay session for {deck name}``. Creates a **new** session over
  the same cards; the original is never cleared or deleted.
- **Replay missed button**: the warning icon-only Button with a `replay` glyph, shown **only on a
  completed session that has missed or unsure cards**, to the left of the Replay button, labelled
  ``Replay the {n} missed or unsure card(s) for {deck name}``. Creates a **new** session over the
  not ok and okeish cards. "Unsure" appears in this label as it does in the Study summary's.
- **Search button** and **Filter button** on this screen belong to the **Header toolbar**.
- **Cleared session**: a completed session the user removed from the Learn list
  ([ADR-0008](../../docs/architecture/decisions/0008-clear-completed-sessions.md)). It is hidden
  from the Learn screen but kept and **still counted everywhere** (Sessions tile, Deck meta row,
  Deck summary), and there is no way to show it again. Say "clear", never "delete", for this; only
  **Discard session** really deletes. An active session cannot be cleared.
- **Clear completed sessions**: the destructive item at the top of the **App menu** on the Learn
  screen (delete glyph). With nothing to clear it alerts `No completed sessions to clear.`;
  otherwise an `Alert` says how many completed sessions will be removed from the list and that
  their results stay in Statistics, with **Cancel** and a destructive **Clear**.
- **Session options menu**: the Kebab menu on a Session card, labelled
  ``Options for the {deck name} session``. Holds **Start a new session** and a destructive item
  labelled **Discard session** when active (a real delete) and **Clear session** when completed
  (archives it as a **Cleared session**; the confirmation says its results stay in Statistics).
  **Clear session** was **Delete session** before ADR-0008.
- **Sessions empty state**: `No sessions yet` when no session exists at all, and `No sessions to
  show` when sessions exist but every one is cleared (its message says cleared sessions still count
  in Statistics). Both carry a **Go to decks** action.

## Study screen

The densest screen in the app, and the one with vocabulary worth being precise about.

- **Progress header**: `Card {n} of {total}` on the left, `Ok {n}` on the right. Only plain ok
  answers are counted there, not okeish.
- **Session progress bar**: the thin **Success bar** under the progress header. It shows **how far
  through the session the user is**, not how well they are doing — the same component, a different
  meaning. Say which you mean. Not the **Session results bar** on the Learn screen's Session cards.
  It is drawn in fixed white (`colors.text`, via `SuccessBar`'s `color` prop), **not** the
  success/warning/danger rate colours, so it cannot be read as a rate.
- **History strip** (`HistoryStrip`, labelled `Answers so far`): the horizontal row of small tiles,
  one per answer — green for ok, yellow (warning) for okeish, red for not ok. The tile for the
  card on screen is taller and outlined. Auto-scrolls to keep the current card in view.
  Aliases: **the answer tiles**
- **Flip card** (`FlipCard`): the card itself. Two faces, **Question** and **Answer**, rotated with
  a `rotateY` animation. Its accessibility label is the **action**, not the state — `Show answer`
  while the question is up, `Show question` while the answer is. Each face scrolls independently.
  Flipping it is what unlocks the **Answer buttons**. Aliases: **the card**
- **Answer buttons**: three **icon-only** Buttons side by side at the bottom, in this order: **Not
  ok** (danger, cross), **Okeish** (warning, question mark), **Ok** (success, tick). They have no
  visible text; the accessibility labels are `Not ok`, `Okeish`, and `Ok`. They are **disabled
  until the user has flipped the current card at least once**, so the answer is read before it is
  graded; the requirement starts over for each new card. They are also **disabled while
  reviewing**.
- **Okeish**: the third answer — half-remembered, or got with effort. It is stored as `okeish`,
  counts as a review but **earns no credit** in the success rate (`ok / (ok + okeish + not ok)`, so
  an okeish-only card is 0%, not `--`), and the **Session summary** replays it along with the
  missed cards ([ADR-0007](../../docs/architecture/decisions/0007-okeish-third-answer.md)). The UI
  word is always "okeish"; "unsure" appears only in two labels, the Study summary's replay action
  and the Learn screen's **Replay missed button**.
- **Swipe hint**: the dim line between the card and the buttons. It is **empty except while
  reviewing**, when it reads `Reviewing an answered card — swipe left to get back to where you were`.
  Nothing on screen advertises swiping right; the gesture is undiscoverable until tried.
- **Reviewing**: looking back at a card that was already answered. It is read-only —
  an answer cannot be changed and the Answer buttons are disabled
  ([ADR-0005](../../docs/architecture/decisions/0005-answers-recorded-immediately.md)). The card
  the user is actually on is the **frontier**. Swiping right **wraps**: from the frontier it goes
  to the newest answered card, then each older one, and from the oldest it returns to the frontier
  (`previousReviewIndex`); it does nothing until a card has been answered. Swiping left steps
  toward the frontier one card at a time and stops there. Do not call reviewing "going back" —
  that is navigation.
- **Session summary**: what the screen becomes once every card is answered. A large success rate
  and a **Success bar**, then one row of `Ok {n}`, `Okeish {n}`, `Not Ok {n}` (tinted success,
  warning, danger), then `Reviewed {n}` on its own line. Up to three actions:
  ``Review the {n} missed or unsure`` (the not ok and okeish cards; absent when there are none),
  **Study the whole deck again**, and **Back to sessions**. Aliases: **end-of-session summary**
- **Study empty state**: `Nothing to study`, with a **Back to sessions** action.

## Statistics screens

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
  action. Each one's title is listed with its screen above.
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
  magic number in a `StyleSheet` is a finding, with two existing exceptions: `mark`'s foreground in
  `RichText` and the FAB's spinner colour, both of which need contrast against a fixed background.
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
