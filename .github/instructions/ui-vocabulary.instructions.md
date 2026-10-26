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
the navigator mounts it as `headerRight` and it has no screen to belong to.

## Header and menus

- **App menu** (`AppMenu`, labelled `App menu`): the three-dot control at the right of the header
  on the three root screens. Holds **Export sample deck** and **Settings**. Detail screens do not
  show it. Aliases: **the header menu**, **the overflow menu**
- **Kebab menu** (`KebabMenu`): the reusable three-dot control. Default label `More options`;
  callers override it. Opens a **Menu sheet**. Aliases: **three-dot menu**, **options button**
- **Menu sheet** (`MenuSheet`): the bottom sheet a Kebab menu opens — a dimmed backdrop and a list
  of **Menu items**, each with an optional **Menu icon** and an optional `destructive` flag that
  colours it danger. This is the app's only menu surface. Aliases: **bottom sheet**, **action
  sheet**
- **Menu icon** (`MenuIcon`): the small glyph on a menu item. The vocabulary is fixed and small —
  `edit`, `delete`, `play`, `export`, `import`, `file`, `settings` — and every one is drawn from
  nested `View`s. **Reuse an existing name rather than adding a second glyph for an existing idea**,
  and remember that adding one means drawing it, not importing it.
- **Export sample deck dialog** (in `AppMenu`): the centred `Modal` explaining the CSV format,
  with **Share** and **Cancel**. The one dialog in the app that is not an `Alert`.

Everything else that interrupts the user is a native `Alert` — confirmations, failures, and the
"not available yet" stubs.

## Decks screen

- **Deck card**: one deck's row — its name, its card count, a **Success bar**, a meta row, and a
  **Start session** button.
- **Deck meta row**: `Success`, `Sessions`, `Active`, `Last session`. `Active` is tinted when
  non-zero.
- **Start session button**: labelled `Start session`. Creates a session over the whole deck and
  navigates across tabs into the Study screen.
- **Deck options menu**: the Kebab menu on a Deck card, labelled ``Options for {deck name}``.
  Holds **Edit deck** (a stub) and **Delete deck** (destructive, confirmed by an `Alert`).
- **Add deck button**: the floating action button at the bottom right, labelled `Add a deck`. It is
  the app's only FAB. Shows a spinner while an import is in flight. Opens the **Add deck menu**.
  Aliases: **the + button**, **the FAB**
- **Add deck menu**: the Menu sheet behind the Add deck button — **Import deck from file**, which
  opens the **Import format menu**, and **Add deck manually** (a stub).
- **Import format menu**: `CSV`, `XML`, `JSON`, `JSONL`. **Only CSV is implemented**; the other
  three alert. Do not describe the app as supporting four formats.
- **Decks empty state**: `No decks yet`.

## Learn screen

- **Session card**: one session's row. Carries a **primary border when the session is active**,
  which is the main visual signal on this screen.
- **Session status line**: ``In progress — {answered}/{total} cards`` or
  ``Completed — {n} cards``. "In progress" and "Completed" are the user-facing words; **active** is
  the word used in code and in prose about state.
- **Session meta row**: `Success`, `{n} ok`, `{n} okeish`, `{n} not ok`, `Started`. The three
  counts are tinted success, warning, and danger.
- **Resume button**: labelled `Resume session` on an active session and `Study this deck again` on
  a completed one — one control, two labels, two behaviours.
- **Session options menu**: the Kebab menu on a Session card, labelled
  ``Options for the {deck name} session``. Holds **Start a new session** and a destructive item
  labelled **Discard session** when active and **Delete session** when not.
- **Sessions header**: the muted line above the list — `No session in progress` or
  ``{n} session(s) in progress``. Hidden when the list is empty.
- **Sessions empty state**: `No sessions yet`, with a **Go to decks** action.

## Study screen

The densest screen in the app, and the one with vocabulary worth being precise about.

- **Progress header**: `Card {n} of {total}` on the left, `Ok {n}` on the right. Only plain ok
  answers are counted there, not okeish.
- **Session progress bar**: the thin **Success bar** under the progress header. It shows **how far
  through the session the user is**, not how well they are doing — the same component, a different
  meaning. Say which you mean.
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
  word is always "okeish"; "unsure" appears only in the replay action's label.
- **Swipe hint**: the dim line between the card and the buttons. Swipe right reviews already
  answered cards; swipe left returns toward the current one.
- **Reviewing**: looking back at a card that was already answered. It is read-only —
  an answer cannot be changed and the Answer buttons are disabled
  ([ADR-0005](../../docs/architecture/decisions/0005-answers-recorded-immediately.md)). The card
  the user is actually on is the **frontier**. Do not call reviewing "going back" — that is
  navigation.
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
- **Answer icon** (`AnswerIcon`, in `AnswerIcons.tsx`): the glyph on an Answer button — `tick`,
  `cross`, or `question`, drawn from nested `View`s and hidden from accessibility. It is separate
  from the **Menu icon** vocabulary; do not add an answer glyph to `MenuIcon` or the reverse.
- **Not ok / Not Ok**: capitalisation differs by place. The Answer button's label is `Not ok`
  (sentence case); the tiles and the summary say `Not Ok`; the meta rows say `not ok` in running
  text. Match the place you are in.
- **Success bar** (`SuccessBar`): the horizontal rate bar, used on every screen. **Colour carries
  meaning and is fixed**: border grey for *no data*, success green at 70% and above, warning amber
  from 40%, danger red below. Grey and 0% are different states and the app distinguishes them.
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
