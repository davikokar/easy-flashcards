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

The app has **four tabs**, in this order. They are peers — switching tab is not navigation into a
hierarchy, and each tab keeps its own stack.

- **Decks tab** (`DecksTab`): where decks are imported, started, and deleted.
  Aliases: **decks**, **library**
- **Learn tab** (`LearnTab`): where sessions live. Also holds the Study screen.
  Aliases: **sessions**, **study tab**
- **Categories tab** (`CategoriesTab`): where categories are shown and the user's own are created and
  deleted. Described under **Categories tab** below. Aliases: **categories**
- **Statistics tab** (`StatsTab`): where results are read. Never writes anything except the reset.
  Aliases: **stats**, **statistics**

The app opens on the **Learn tab** when any session is unfinished, and on the **Decks tab**
otherwise ([ADR-0006](../../docs/architecture/decisions/0006-launch-on-the-tab-with-unfinished-work.md)).
Say "the app launches on the tab with unfinished work", not "the app defaults to Learn".

## Screens

Each tab has one **root screen**; every other screen is a **detail screen** pushed onto that tab's
stack. The two Categories screens are described in more detail under **Categories tab** below.

- **Decks screen** (`DecksScreen`, route `DecksList`): The list of imported decks, one **Deck card**
  each. Root of the Decks tab. Aliases: **deck list**, **deck library**
- **Edit deck screen** (`EditDeckScreen`, route `EditDeck`, param `deckId`): One deck's title,
  description, category and cards as editable fields. Pushed onto the Decks stack from **Edit deck**
  in the Deck options menu. The same component also serves the **New deck screen**. Aliases: **deck
  editor**
- **New deck screen** (`EditDeckScreen`, route `NewDeck`, no params): the **Edit deck screen**'s form
  started blank, to create a deck by hand. Titled `New deck`. Pushed onto the Decks stack from **Add
  deck manually** in the **Add deck menu**. One component, two routes: say **Edit deck screen** for
  an existing deck and **New deck screen** for a new one. Described under **Edit deck screen**
  below.
- **Learn screen** (`LearnScreen`, route `LearnList`): The list of sessions, one **Session card**
  each, unfinished ones first. Root of the Learn tab. Aliases: **session list**
- **Study screen** (`StudyScreen`, route `Study`, params `sessionId` and optional `mode`): One
  session being studied — the flip card, the answer buttons, the progress header, and the
  end-of-session summary — or, with `mode: 'review'`, one completed session's errors being
  reviewed (**review mode**, below). Pushed onto the Learn stack. Aliases: **study view**, **the
  session screen**
- **Categories screen** (`CategoriesScreen`, route `CategoriesList`): The built-in and custom
  categories as tiles. Root of the Categories tab.
- **New category screen** (`NewCategoryScreen`, route `NewCategory`): The form that creates a
  custom category. Pushed onto the Categories stack. Aliases: **category editor**
- **Statistics screen** (`StatsScreen`, route `StatsOverview`): the **Timeframe chips**, the
  **Aggregated stats** across every deck, then the **Decks breakdown**, one **Deck stats card** per
  deck. Root of the Statistics tab. Aliases: **stats overview**
- **Deck statistics screen** (`DeckStatsScreen`, route `DeckStats`, param `deckId`): One deck's
  **Deck identity row**, **Overall mastery card**, **Session history card** and **Card performance
  section**, titled with the deck's name. **Always all time** — it ignores the Statistics screen's
  timeframe. Its header carries the **Deck statistics menu**. Pushed onto the Statistics stack.
  Described under **Deck statistics screen** below.
  Aliases: **per-deck statistics**, **card breakdown**

Use **screen** only for a route in a navigator. Use **tab** for the four above, **dialog** for
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
it has no screen to belong to. The **Header toolbar** mounts it (boxed) on the Decks, Learn and
Statistics screens; the Categories screen mounts it (boxed) directly, with no Search button and no
Filter button; the navigator sets no default `headerRight`. It takes optional `extraItems` so a
screen can add items without `AppMenu` gaining store knowledge: each root screen overrides
`headerRight` itself (via `navigation.setOptions`), and the Learn screen's Header toolbar passes
`menuItems` that supply **Clear completed sessions**.

## Header and menus

- **App menu** (`AppMenu`, labelled `App menu`): the three-dot control at the right of the header
  on every tab's root screen — inside the **Header toolbar** on the Decks, Learn and Statistics
  screens, and on its own on the Categories screen (boxed in both). Holds **Export sample deck**
  and **Settings**; on the Learn screen it also holds **Clear completed sessions**,
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
  sheet**. A sheet with a title can also show a **Category square** (28-point) on the same row,
  before the title; only the **Deck options menu** and the **Session options menu** pass one, and
  with no category the title is unchanged. The square keeps its own label (``Category: {name}``),
  read before the title, since the title never names the category. A **Menu item** can also be
  **selected** (the **Card sort menu** only): its label turns `colors.primary`, a trailing tick
  (**Answer icon** `tick`) shows, and `accessibilityState.selected` is true — so the choice is not
  marked by colour alone. Every other sheet is a list of actions and marks nothing.
- **Menu icon** (`MenuIcon`): the small glyph on a menu item, and also used outside menus (the
  **Header toolbar**, the **Search bar**, the **Card search field**, the **Sort button**, the
  **Deck meta row**, the **Session card footer**, the **Stat tiles** and
  the **Remove card button**). The available names
  are the `MenuIconName` type in
  [src/components/MenuIcons.tsx](../../src/components/MenuIcons.tsx), and every glyph is drawn from
  nested `View`s. An optional `size` scales a glyph from its 20-point grid. **Reuse an existing
  name rather than adding a second glyph for an existing idea**, and remember that adding one means
  drawing it, not importing it. `tally` (four strokes struck through by a slash) is the **Total
  reviews** tile's glyph and means "answers recorded"; it is not `replay`, which belongs to the
  **Replay button** and the **Review errors button**, and reviews as a statistic are never the
  error review. `sort` (two vertical arrows side by side, the left pointing up and the right
  down) is the **Sort button**'s glyph; it is deliberately not `filter` (three decreasing bars),
  which is the **Filter button**'s and means narrowing, not ordering.
- **Export sample deck dialog** (in `AppMenu`): the centred `Modal` explaining the two sample
  files it saves, a CSV and a JSON of the same deck — how the CSV is laid out, what the JSON adds
  back, and that basic HTML is allowed, in a body that scrolls — with **Export** and **Cancel**
  fixed below it. **Export** opens one
  system save dialog per file, CSV first; cancelling either skips that file
  ([ADR-0016](../../docs/architecture/decisions/0016-deck-export-file-formats.md) Amendment 3). The
  dialog closes once at least one file was saved, and a final `Alert` reports the outcome. Its
  **Export** button is not the **Custom separator dialog**'s, which is a different button in a
  different dialog. One of the five dialogs in the app that are not an `Alert`; the
  others are the **Session setup dialog**, the **Category picker**, the **Custom colour dialog**
  and the **Custom separator dialog**.

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
  screens) and a 24-point, 700-weight title; the Categories screen uses that header style too but
  not the toolbar. It was the **Decks toolbar** before the Learn screen used it.
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

- **Deck card** (`DeckCard`): one deck's row — a header (the **Category square** at the top left
  when the deck has a category, then its name on one truncated line, its card count, and the
  **Deck options menu**), a **Mastery bar**, and a **Deck meta row**. A deck with no category shows no square and leaves no gap.
- **Mastery bar** (`MasteryBar`): the darker inset panel on a Deck card and a **Deck stats card** — a **Mastery track** with one
  segment per answer, then a three-column legend of **Answer icon** (tick, question mark, cross) and
  percentage, with no text label. Segments and icons are green `Ok`, amber `Okeish`, red `Not ok`,
  sized by each answer's share of all reviews (`answerShares`). A deck with no reviews shows an
  empty track, `--` in every column and grey icons, not 0%. The `Ok` percentage
  is the deck's success rate. Not the **Success bar**, which carries one rate; do not call this one
  by that name. Labelled `Mastery: {summary}` as a whole. Used on a Deck card and a Deck stats
  card only: the Deck statistics screen shows the **Mastery track** and the **Answer tiles**
  instead, never this panel.
- **Mastery track** (`MasteryTrack`, the track half of the Mastery bar): the segmented tri-colour
  track on its own — one rounded segment per answer, in the order green `Ok`, amber `Okeish`,
  red `Not ok`, sized by each answer's share of all reviews (`answerShares`) on a `surfaceAlt`
  base, a 2-point inset and gap, and no segment narrower than 4 points. It has **no legend and no
  text of its own**: whatever carries it says the numbers, because colour alone must not (the
  **Mastery bar** adds a legend; the **Overall mastery card** adds the **Answer tiles**; a **Card
  stats row** adds shares text). No reviews gives an empty track. Height is a prop: 10 points on
  the Mastery bar and the Overall mastery card, 8 on a Card stats row.
- **Deck meta row**: the footer of a Deck card — on the left, two lines: a clock glyph, `{n}
  session(s)` and the **Active pill**, then `Last: {date}` (or `Last: Never`); on the right, the
  **Start session button**, vertically centred. The structure is the same on every card, reviewed or
  not; only the first line wraps, at very large font sizes.
- **Active pill**: `{n} active`. Tinted primary with a dot when `n` is above zero, muted grey when
  it is zero.
- **Start session button**: the small rounded-square primary button with a play glyph at the end of
  the Deck meta row, labelled ``Start session for {deck name}``. Icon-only, with no visible text.
  Creates a **new** session over the whole deck, **shuffled and not inverted**
  ([ADR-0010](../../docs/architecture/decisions/0010-inverted-sessions.md) Amendment 1), and
  navigates across tabs into the Study screen; it does not resume an active one. Deck order is
  reached only through **Start session with options** with **Shuffle** unchecked.
- **Deck options menu**: the Kebab menu on a Deck card, labelled ``Options for {deck name}``. Its
  Menu sheet is titled with the deck name, after the deck's **Category square** when it has a
  category. Holds **Start session with options** (play glyph; opens the **Session setup dialog**,
  where **Shuffle** is checked by default and the only way to get deck order is to uncheck it), **Edit
  deck** (opens the **Edit deck screen**), **Export to file** (`export` glyph; opens the **Export
  format menu**) and **Delete deck** (destructive, confirmed by an `Alert`) — always last. It was **Shuffle and
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
    `Shuffle`, with its checked state in `accessibilityState`. **Every time the dialog opens,
    Shuffle starts checked and Inverted unchecked**; nothing chosen in an earlier opening carries
    over. With those defaults, **Start** does the same as the **Start session button**. Unchecking
    **Shuffle** gives deck order
    ([ADR-0010](../../docs/architecture/decisions/0010-inverted-sessions.md) Amendment 1).
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
- **Export to file**: the item in the **Deck options menu** (`export` glyph, **before Delete deck**
  and after Edit deck) that starts exporting that deck
  ([ADR-0016](../../docs/architecture/decisions/0016-deck-export-file-formats.md)). Not
  destructive, so no confirmation and no `Alert` before the save dialog; it changes nothing stored.
  Works on a deck with no cards. It is a **chain of menus**, not one dialog: **Export format menu**,
  then for CSV the **CSV separator menu**, then for Custom the **Custom separator dialog**, then
  the system save dialog. Not **Export sample deck**, which is in the **App menu**
  and shares only the `export` glyph and the verb: it saves a fixed sample deck as two files, with
  no format choice.
- **Export format menu**: the **Menu sheet** **Export to file** opens, titled `Export deck to file`,
  with the same shape as the **Import format menu** — one `file` glyph item per format: **JSON**,
  then **CSV**. Both are implemented; there are no stubs in it. **JSON** goes straight to the save
  dialog; **CSV** opens the **CSV separator menu**. Mirrors the Import format menu's wording
  (`Import deck from file`) and is a different menu, not the same one reused.
- **CSV separator menu**: the **Menu sheet** **CSV** opens in the Export format menu, titled `CSV
  separator`, with four items and no icons: `Comma (,)`, `Semicolon (;)`, `Tab` and `Custom…`
  (a real ellipsis character, because it opens another step). The first three go straight to the
  save dialog; **Custom…** opens the **Custom separator dialog**. The items have no `file` glyph
  because they are values, not files. Not the **Session options menu**.
- **Custom separator dialog** (`CustomSeparatorDialog`): the centred `Modal` **Custom…** opens,
  titled `Custom separator` over the deck's name — the **Session setup dialog**'s shape. It holds
  the **Separator field**, a **Separator message** and the **Export** and **Cancel** buttons. The
  fifth dialog that is not an `Alert`. Stateless and controlled: the screen holds the typed text,
  validates it, and passes the reason it is unusable as `error`. The text starts empty every time
  it opens. The dialog is lifted clear of the keyboard, since the keyboard overlays the window.
  - **Separator field**: the single-line **FormField** labelled `Separator`, auto-focused, with the
    placeholder `For example |`. It does not cap the length, so a second character is reported
    rather than silently refused.
  - **Separator message**: the one line under the field, always present so the buttons do not move.
    Empty while the text is usable. Otherwise it says why not: `Enter one character.` (empty —
    muted, not red, because a blank field is a prompt rather than a mistake and this is what the
    user sees on opening), `Use a single character.`, `Quotes, # and line breaks cannot be
    used.`, `Spaces are not allowed. Use the Tab option for a tab.` and `Letters and digits are
    not allowed.` (all danger red). Announced as a polite live region.
  - **Export**: the primary Button. **Disabled while the separator message shows any reason**;
    shows a spinner while the file is being written. Hands off to the system save dialog.
  - **Cancel**: the secondary Button; also the backdrop and the Back button. Writes nothing.
- **Add deck button**: the floating action button at the bottom right, a primary rounded square
  labelled `Add a deck`. It is
  the app's only FAB. Shows a spinner while an import is in flight. Opens the **Add deck menu**.
  Aliases: **the + button**, **the FAB**
- **Add deck menu**: the Menu sheet behind the Add deck button — **Import deck from file**, which
  opens the **Import format menu**, and **Add deck manually**, which opens the **New deck screen**.
- **Import format menu**: the **Menu sheet** **Import deck from file** opens, with exactly two
  items, each with the `file` glyph: **CSV**, then **JSON**. Both are implemented; there are no
  stubs and no "not available yet" alert in it. Each opens the system picker and reads the file
  as the chosen format, whatever its extension
  ([ADR-0017](../../docs/architecture/decisions/0017-deck-import-reads-exported-formats.md)).
  Not the **Export format menu**, which lists the same two formats in the opposite order. Do not
  describe the app as supporting XML or JSONL.
- **Decks empty state**: `No decks yet`.

## Edit deck screen

Titled `Edit deck`. A scrolling form: the **Deck fields**, the **Category field**, then one **Card
editor** per card, then the **Add card button**. Everything is a draft held on the screen; nothing
reaches the store until **Save**
([ADR-0011](../../docs/architecture/decisions/0011-deck-editing-is-one-action.md)).

The same component is the **New deck screen** (route `NewDeck`), titled `New deck`. It has the same
form, but the draft starts **blank with no cards** and the **Title** field is focused on open. The
sections below say where the two differ; everything else applies to both.

- **Deck fields**: two labelled text fields at the top. **Title** (single line) and **Description**
  (multi-line, placeholder `Optional`). Followed by the **Category field** and then a count heading,
  `{n} card(s)`. The description is shown only here: not on the **Deck card** or the **Session
  card**, and it is not searched.
- **Category field** (`CategoryField`): the labelled row under Description, in the same style as the
  text fields — the label `Category`, then a row holding the **Category square** and the
  category's name on one truncated line, with a right-pointing chevron at its end. With no
  category it shows the dimmed text `No category` and no square, and the row is no shorter. A
  button, labelled ``Category: {name}`` or `Category: none`, with the hint `Opens the category
  picker`; it opens the **Category picker**. Stateless: the screen holds the draft category.
- **Category picker** (`CategoryPicker`, group labelled `Category picker`): the centred `Modal`
  the Category field opens, titled `Category`, over a scrolling three-column grid of **category
  tiles** and a **Cancel** button below it that stays in view. The **No category choice** comes
  first; then every category, default and custom alike, in **one** alphabetical list. A radio
  group: each tile is a `radio` labelled with the category's name, with its state in
  `accessibilityState.selected`, and the selected one has a ring and a tick. Choosing a tile
  changes the **draft** only and closes the picker; **Cancel**, the backdrop and the Back button
  close it with no change. The third dialog in the app that is not an `Alert`, after the **Export
  sample deck dialog** and the **Session setup dialog** (the **Custom colour dialog** is the
  fourth and the **Custom separator dialog** the fifth). Not the **Colour picker** or the **Icon picker**, which sit inline on the New category
  screen.
- **No category choice**: the first tile of the Category picker, labelled `No category` — a dashed
  square with a `close` glyph rather than a category's colour and pictogram. Picking it clears the
  draft's category. It is selected whenever the draft has none, which includes a deck whose stored
  category no longer exists.
- **Card editor** (`CardEditor`): one card's panel — a `Card {n}` heading with the **Remove card
  button** at its end, then a multi-line **Question** field and a multi-line **Answer** field, both
  raw HTML text. Fields are labelled ``Question for card {n}`` and ``Answer for card {n}``. Not the
  **Flip card** on the Study screen.
- **Remove card button**: the danger-coloured delete glyph in a Card editor's header, labelled
  ``Remove card {n}``. Removes the card from the draft at once, with no prompt; the confirmation is
  at Save.
- **Add card button**: the secondary Button `Add card` after the last Card editor. Appends an empty
  card, scrolls to it and focuses its Question field.
- **Save button**: the `Save` text button at the end of the header, labelled `Save deck`.
  **Disabled until something differs from the stored deck** — the category included. It refuses, with an `Alert`, a blank
  title (`Title needed`) or a card missing its question or answer (`Card incomplete`, naming the
  card). If cards were removed, an `Alert` titled `Remove cards?` says how many go with their
  statistics, with **Cancel** and a destructive **Save**. A successful save goes back to the Decks
  screen. On the **New deck screen** the button is the same `Save`, labelled `Save deck`, and is
  **disabled until the draft differs from the blank form** — a non-blank trimmed title or
  description, a category, or any card. It refuses a blank title and an incomplete card with the
  same two alerts, never shows `Remove cards?` (nothing was stored to lose), and on success goes
  back to the Decks screen with **no success alert**, the new deck first in the list.
- **Discard prompt**: leaving by the back arrow or the Back button with unsaved changes shows an
  `Alert` titled `Discard changes?` with **Keep editing** and a destructive **Discard**. On the
  **New deck screen** the message is `This deck has not been saved.`, and "unsaved changes" means
  the draft differs from the blank form.
- **Deck not found state**: the **Empty state** `Deck not found`, with action `Back to decks`, if
  the deck no longer exists. The **New deck screen** has no such state.

## Learn screen

- **Session card** (`SessionCard`): one session's row — a header (the **Category square** at the top
  left when the session's deck has a category, then the deck name on one truncated line over the
  **Session status pill**, and the **Session options menu**), a **Session results bar**, and a
  **Session card footer**. Active and completed cards share this structure and the same neutral
  border; the pill and the footer buttons are what differ. Only **listed** sessions get one —
  active, or completed and not cleared. The square shows the deck's category **as it is now**, not
  as it was when the session was studied, and a session whose deck is gone shows none
  ([ADR-0014](../../docs/architecture/decisions/0014-deck-belongs-to-one-category.md)).
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
  Figures ribbon, Session history card), and there is no way to show it again. A session becomes cleared in three ways:
  **Clear session** (one), **Clear completed sessions** (all), and the **Replay button**
  (the replayed one). Say "clear", never "delete", for this; only
  **Discard session** really deletes. An active session cannot be cleared.
- **Clear completed sessions**: the destructive item at the top of the **App menu** on the Learn
  screen (delete glyph). With nothing to clear it alerts `No completed sessions to clear.`;
  otherwise an `Alert` says how many completed sessions will be removed from the list and that
  their results stay in Statistics, with **Cancel** and a destructive **Clear**.
- **Session options menu**: the Kebab menu on a Session card, labelled
  ``Options for the {deck name} session``. Its Menu sheet is titled with the deck name, after the
  session's deck's **Category square** when it has a category. Holds **Start a new session** (a
  counted session over the whole deck, in deck order, keeping the session's **inverted** setting; it clears nothing and
  shows `Deck unavailable` when the deck is gone or empty) and a destructive item
  labelled **Discard session** when active (a real delete, which also **removes the session's
  answers from Statistics** — its Alert says so,
  [ADR-0008](../../docs/architecture/decisions/0008-clear-completed-sessions.md) Amendment 2) and
  **Clear session** when completed
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
  mode it shows the **pass's own** answers, not the session's. Its tiles are the **History strip**'s
  and are not the **Answer tiles** of the Deck statistics screen, which are counts.
  Aliases: **the history tiles**
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
  Session summary) and **`Reviews`** / `{n} reviews` / `Total reviews` (the Statistics screens, the Mastery bar)
  are counts of recorded answers, **which a review never adds to**. Never say "reviews" for the
  error review, nor "reviewing" for it. Two more uses are *not* the error review: `Reviewed {date}`
  on a **Card stats row** (when a card was last answered) and the **Card status** `Needs review`
  (a success rate below 40%, which a card can have without any session ever being reviewed).
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

## Categories tab

Added by [ADR-0012](../../docs/architecture/decisions/0012-custom-categories-third-storage-key.md)
and [ADR-0013](../../docs/architecture/decisions/0013-category-icons-are-android-vector-drawables.md).
A deck belongs to at most one category
([ADR-0014](../../docs/architecture/decisions/0014-deck-belongs-to-one-category.md)), chosen in the
  **Category field** on the Edit deck screen and shown as the **Category square** on its Deck card,
  on its **Deck stats card**, in the **Category pill** of the Deck statistics screen and on the Session cards of its sessions. No tile shows a deck count yet.

- **Categories tab** (`CategoriesTab`): the fourth tab, **between the Learn tab and the Statistics
  tab**, with its own stack. Where the categories are shown and the user's own are created and
  deleted. Aliases: **categories**
- **Categories screen** (`CategoriesScreen`, route `CategoriesList`): root of the Categories tab.
  Its header carries the boxed **App menu** only — no Search button, no Filter button, so it does
  not use the **Header toolbar**. One scrolling column of two sections, with the **New category
  button** pinned below it.
- **New category screen** (`NewCategoryScreen`, route `NewCategory`): pushed onto the Categories
  stack by the New category button. A scrolling form: a **category tile** preview, the **Name
  field**, the **Colour picker** and the **Icon picker**, with the **Custom colour dialog** opening
  over it from the Colour picker's **Custom colour swatch**. Modelled on the Edit deck screen — a
  draft held on the screen, nothing reaches the store until **Save**, with the same **Discard
  prompt**.
  Aliases: **category editor**
- **Custom categories section**: the first section — the heading `Custom categories`, the subtitle
  `{n} available`, then the user's own categories as **category tiles**, alphabetical. With none it
  shows the hint `Your own categories will appear here.` instead of tiles.
- **Default categories section**: the second section — `Default categories`, `{n} built in`, then
  the built-in categories alphabetically, each coloured along the palette's red, violet, blue,
  green, yellow, orange ramp. Not pressable and not editable.
- **Category tile** (`CategoryTile`): a coloured rounded square with the category's icon centred in
  `colors.background`, and its name below on up to two lines. The sections lay them out as a
  wrapping three-column grid. A tile is a **button only in the Custom categories section**,
  labelled ``Options for {name}``, which opens the **Category options menu**; a default tile has
  no press behaviour. The **preview** on the New category screen is the same component, labelled
  ``Preview: {name}``, and shows the dimmed placeholder `Category name` while the name is blank.
  The **Category picker** reuses it as a radio: a `selected` tile gets a light ring and a tick in
  its corner (the **Answer icon** `tick` on a light disc), so it is not marked by colour alone, and
  the **No category choice** is its `none` look — a dashed `surfaceAlt` square with a `close`
  **Menu icon** instead of a category colour and pictogram.
- **Category icon** (`CategoryIcon`): the pictogram on a tile, in the **Category square** or in the
  Icon picker — an Android
  vector drawable drawn with `Image` and tinted, hidden from accessibility. The one icon
  mechanism that is **not** drawn from `View`s, for category icons only
  ([ADR-0013](../../docs/architecture/decisions/0013-category-icons-are-android-vector-drawables.md)).
  Not a **Menu icon**; do not add a category pictogram to `MenuIcon`.
- **New category button**: the full-width primary Button `New category`, pinned at the bottom of
  the Categories screen **under** the scrolling content, not over it, so it never hides a tile. It
  is **not a second FAB**: the **Add deck button** stays the app's only one.
- **Category options menu**: the **Menu sheet** a custom tile opens, titled with the category's
  name. Holds **Delete category** and nothing else.
- **Delete category**: the destructive item (delete glyph) in the Category options menu. Confirmed
  by an `Alert` titled `Delete category?` with **Cancel** and a destructive **Delete**. Deleting
  **detaches** every deck in the category: each becomes *no category*, in the same step, and its
  cards, statistics and sessions are untouched. The alert says how many decks lose the category
  ([ADR-0014](../../docs/architecture/decisions/0014-deck-belongs-to-one-category.md)). Defaults
  cannot be deleted.
- **Category square** (`CategorySquare`, labelled ``Category: {name}``): the small (32-point)
  rounded square in a category's colour with its **Category icon** (about 20 points, tinted
  `colors.background`) centred in it — the category made small enough to sit beside a title. Shown
  at the top left of a **Deck card**, a **Session card** and a **Deck stats card**, inside the **Category field**, and in
  28-point size before the title in the Menu sheet of the **Deck options menu** and the **Session
  options menu**, and in 24-point size inside the **Category pill** of the Deck statistics screen's **Deck identity row**. It is
  an image for accessibility and has no press behaviour. Not the **Category tile**, which is larger
  and carries the name below it. Do not call it a "badge" (that is the **Review badge**) or a "chip".
- **Name field**: the `Name` text field on the New category screen (a **FormField**), at most 30
  characters — typing stops at the limit. Beneath it a helper line holds the error and a `{n}/30`
  counter. The error appears only **after the user has typed**, never on first render: `Enter a
  name.`, `Use 30 characters or fewer.` or `A category with this name already exists.` (compared
  ignoring case, against defaults and custom categories alike).
- **Colour picker** (`CategoryColorPicker`, labelled `Colour picker`): the grid of swatches, one per
  `categoryPalette` colour followed by the **Custom colour swatch**, six to a row. The boxes are
  square and share the grid's measured width, with **one gap (`spacing.sm`) both between boxes and
  between rows**, so the two are equal at any screen width; a box is at most 56 points, and 48 on
  a 360-point-wide phone. A radio group; each palette swatch is a `radio` labelled ``Colour {n} of
  {total}`` (`total` is the palette's 21, the Custom colour swatch not counted) with its state in
  `accessibilityState.selected`. The selected one has a light ring and a tick (the **Answer icon**
  `tick`), so it is not marked by colour alone. Exactly one swatch is selected: the palette swatch
  whose colour equals the current one (ignoring case), else the Custom colour swatch. It holds its
  measured width and nothing else, and reads neither the store nor navigation: the screen owns the
  colour and whether the **Custom colour dialog** is open.
- **Custom colour swatch**: the last box of the Colour picker, drawn as a rainbow (a hue-spectrum
  gradient, not a colour of its own, and **not in `categoryPalette`**). A `radio` labelled `Custom
  colour`, hint `Opens the colour chooser`. Pressing it opens the **Custom colour dialog**. It is
  selected when the current colour is **not** a palette colour; its tick sits on a light disc,
  since a rainbow has no one ground colour for the palette's dark tick. It does not show the
  chosen colour — the New category screen's tile preview does.
- **Custom colour dialog** (`CustomColorDialog`, titled `Custom colour`): the centred `Modal` the
  Custom colour swatch opens, holding the **Hue slider**, the **Saturation slider**, the
  **Brightness slider**, the **Colour preview**, a **Use colour** button and a **Cancel** button.
  It opens at the current colour every time. **Use colour** hands back one lowercase opaque
  `#rrggbb`; it is **disabled** while that colour's contrast with `colors.background` is below
  4.5:1, and the message `Too dark for the icon. Try a lighter colour.` takes the place of the hex
  beside the Colour preview
  ([ADR-0012](../../docs/architecture/decisions/0012-custom-categories-third-storage-key.md)
  Amendment 3). **Cancel**, the backdrop and the Back button leave the colour unchanged. The
  fourth dialog that is not an `Alert`. Its sliders sit in a scroll view (with **Use colour** and
  **Cancel** outside it, so they stay in view) that does not scroll while a slider is held.
  Aliases: **colour chooser**
- **Hue slider**, **Saturation slider**, **Brightness slider** (`ColorSlider`): the three
  horizontal sliders of the Custom colour dialog, each a gradient track with a light thumb and
  its name and value above (`240°`, `75%`). Built from `View`s and the responder handlers, since
  React Native has no slider. Each is one `adjustable` element labelled `Hue`, `Saturation` or
  `Brightness`, with its value in `accessibilityValue` and `increment` / `decrement` actions
  (15° for hue, 5% for the others). Hue runs 0 to 360 at full saturation and brightness;
  saturation and brightness show the colour's own range at the other two settings.
- **Colour preview**: the 64-point rounded square in the Custom colour dialog showing the colour
  as it stands, labelled ``Colour preview {hex}``. Not the **tile preview** at the top of the New
  category screen, which shows the whole category.
- **Icon picker** (`CategoryIconPicker`, labelled `Icon picker`): every category icon
  (`CATEGORY_ICONS`) in a plain wrapping grid of 48-point cells, six to a row, on a neutral
  `surface` panel, inside the form's scroll — no inner scroll, search or grouping. The default
  categories' icons come first, then the extra icons sorted by label. A radio group; each icon is a
  `radio` labelled by `getCategoryIconLabel` — a default icon with its category's name
  (`Computer science`, `Astronomy`), an extra icon with what it shows (`Anchor`, `Rocket`) — and its
  state in `accessibilityState.selected`. The selected one has a primary border and a `surfaceAlt`
  fill.
- **Save button** (on the New category screen): the `Save` text button at the end of the header,
  labelled `Save category` (not `Save deck`, which is the Edit deck screen's). **Disabled until the
  name is valid.** Saving adds the category and goes back to the Categories screen. A fresh form is
  an empty name, the first palette colour and the fallback icon; leaving it with any change shows
  the **Discard prompt**.
- **Categories tab icon** (`CategoriesIcon`, in `TabIcons.tsx`): a two-by-two grid of outlined
  rounded squares, drawn from `View`s like the other tab icons.

## Statistics screens

- The **Statistics screen** has a **Header toolbar** with the **Search button** (`Search decks`) and
  the **App menu** only — no Filter button — and the same header style as Decks and Learn. Its
  **Search bar** filters the **Deck stats cards** by deck name and the count in the **Decks
  breakdown** heading follows it; the **Aggregated stats** are not filtered by search and stay
  totals across every deck (though they follow the **Timeframe chips**). The Deck statistics
  screen has no Search button and no Search bar; it searches cards with its own always-visible
  **Card search field**.
- **Timeframe chips** (`TimeframeChips`, a `radiogroup` labelled `Timeframe`): the fixed,
  non-scrolling row of **Timeframe chips** at the top of the Statistics screen's content, under the
  **Search bar** when it is open and above the list. Hidden when there are no decks. The selection
  is local to the screen, starts at `All time` and is never stored
  ([ADR-0015](../../docs/architecture/decisions/0015-answers-carry-a-timestamp-under-v2-keys.md)).
  It changes the **Mastery ring**, the `Total reviews` and `Sessions` **Stat tiles**, and each **Deck
  stats card**'s **Mastery bar**, `Reviews` and `Sessions`; it does **not** change the `Decks` and
  `Total cards` tiles, a card's `Cards` and `Last`, or the Deck statistics screen. A deck with
  nothing in the window is still listed, not dimmed, and there is no separate empty state: the
  ring shows `--` and the counts are 0. Not the **Search bar**'s filtering, which hides rows.
- **Timeframe chip**: one pill in the Timeframe chips — `All time`, `This month` or `Last 7 days`
  (`TIMEFRAMES`). A `radio` labelled with its text and its state in `accessibilityState.selected`,
  the same pattern as the **Category picker**. Selected is a `colors.primary` fill with
  `colors.background` text; the others a `surfaceAlt` fill with muted text. The pill is about
  36 points high inside a 48-point touch target, and the row wraps rather than scrolls. A chip, not
  a **Button**: no new Button variant. Not the **Category square** (do not call that a chip).
- **Aggregated stats** (`StatsScreen`'s list header): the first section of the Statistics screen —
  the small uppercase muted heading `Aggregated stats`, then one `surface` card holding the **Mastery
  ring** above a two-by-two grid of **Stat tiles**. Shown whenever any deck exists, and never
  filtered by search; it follows the **Timeframe chips**. It was the **Global summary** (a large success rate, a **Success bar** and a
  row of seven tiles that spelled out `Ok`, `Okeish` and `Not Ok`).
- **Mastery ring** (`MasteryRing`, labelled ``Success rate {rate}. {shares}. Counts: …``): the
  circular gauge at the top of the Aggregated stats card — 60 short bars round a ring, coloured
  green, amber and red in proportion to each answer's share of all reviews (`allocateRingSegments`)
  and grey for the rest, with the success rate (`formatRate`, so `--` when nothing is reviewed) and
  the caption `Success rate` in its centre. The centre is the **Ok-only** rate, not the sum of the
  bars ([ADR-0007](../../docs/architecture/decisions/0007-okeish-third-answer.md)). Under it, a
  **legend** of three rows, each an **Answer icon** (tick, question mark, cross), the percentage
  and the raw count — no text label. The icons are grey while nothing is reviewed. **Follows the
  Timeframe chips**: the bars, rate and counts cover only the answers given in the window, and with
  none it shows `--` and grey, the same as an unreviewed library. It draws no
  panel of its own — the ring and legend sit directly on the Aggregated stats card. Not the
  **Mastery bar**, which is a straight segmented track on a Deck card; same colours and the same
  legend idea, a different shape. Do not call it a "donut" or a "chart".
- **Stat tile**: one of the four in the Aggregated stats grid — a `surfaceAlt` rounded square with
  an optional **Menu icon** (or the **Decks tab**'s `DecksIcon`) beside an uppercase label, a large
  value on one line (shrunk to fit, not truncated), and a muted caption of up to two lines; every
  tile reserves two caption lines, so values line up across a row. In order: `Decks` (`DecksIcon`,
  `In your library`), `Total cards` (`file`, `Across all decks`), `Total reviews` (`tally`, whose
  caption names the timeframe: `Answers recorded`, `Answers this month`, `Answers in the last 7
  days`) and `Sessions` (`clock`, `{n} active`). `Decks` and `Total cards` ignore the **Timeframe
  chips**; `Total reviews` and `Sessions` follow them, and `{n} active` counts the active sessions
  inside the window. A session is in a window when it started in it or has an answer in it.
  `Sessions` counts every such session, **cleared ones included**
  ([ADR-0008](../../docs/architecture/decisions/0008-clear-completed-sessions.md)). Labelled as one
  element, ``{label}: {value}, {caption}``; not pressable. It was one of seven in the **Global
  summary**'s **Stat grid**, a name that no longer exists.
- **Decks breakdown**: the second section of the Statistics screen — the uppercase muted heading
  `Decks breakdown` with `{n} deck(s)` at its end (the number shown, so it follows search), above
  the **Deck stats cards**.
- **Deck stats card** (`DeckStatsCard`): one deck in the Decks breakdown — a header (the **Category
  square** when the deck has a category, then its name on one truncated line and a right-pointing
  chevron), a **Mastery bar**, and an inset row of four figures: `Cards`, `Sessions`, `Reviews` and
  `Last` (`formatDate`, `Never` when the deck has no session); `Last` is the widest column and the
  four shrink their text to fit rather than truncate it. The **Mastery bar**, `Sessions` and `Reviews`
  follow the **Timeframe chips**; `Cards` and `Last` do not (`Last` is the deck's latest session
  start, all time). Pressable, labelled with the deck
  name and all its figures, with the hint `Opens per-card details`; opens the Deck statistics
  screen. A deck with no category, or one whose category no longer resolves, shows no square and no
  gap ([ADR-0014](../../docs/architecture/decisions/0014-deck-belongs-to-one-category.md)
  Amendment 2). It was the **Deck stats row**, a name that no longer exists; the row's success bar
  and `Tap for per-card details` line are gone.
- **Statistics empty state**: `No statistics yet`. The Deck statistics screen's own states are
  under **Deck statistics screen**, next.

## Deck statistics screen

Reached from a **Deck stats card**. One scrolling list, top to bottom: the **Deck identity row**, the
**Overall mastery card**, the **Session history card**, then the **Card performance section**, whose
**Card stats rows** are the list's rows. **Always all time.** The sort, the status and the query are
local to the screen and reset when it is left. The headline is the **Ok-only success rate**
([ADR-0007](../../docs/architecture/decisions/0007-okeish-third-answer.md)): never an ok-plus-okeish
blend, and never captioned "mastery" or "mastered" on screen — `Mastered` belongs to the **Card
status badge** (the **Mastery track** and **Overall mastery card** are names for the code, not
words the user reads).
Like the rest of Statistics it prints no answer words: answers are **Answer icons** with numbers,
and the words appear only in accessibility labels.

- **Deck statistics menu**: the Kebab menu (`plain` variant) at the right of this screen's header,
  labelled ``Options for {deck name} statistics``. Its Menu sheet is titled with the deck's name,
  with no **Category square** (the **Deck identity row** shows it). Holds **Reset statistics** and
  nothing else. Not the **Deck options menu** (Decks screen) and not the **App menu**.
- **Reset statistics**: the destructive item (`delete` glyph) in the Deck statistics menu. Confirmed
  by an `Alert` titled `Reset statistics` — ``Clear all recorded results and sessions for "{deck
  name}"?`` — with **Cancel** and a destructive **Reset**. It zeroes every card counter **and
  deletes every session for that deck**; say both. It was the **Reset statistics button** on the
  **Deck summary**; neither name exists any more.
- **Deck identity row**: the wrapping row of neutral pills under the header (`surfaceAlt` fill,
  `border` outline, 12-point text, **not** tinted — they are facts, not states): the **Card count
  pill**, ``{n} card(s)``, and the **Category pill**, a 24-point **Category square** before the
  category's name on one truncated line, labelled ``Category: {name}``. A deck with no category, or
  one whose category no longer resolves, shows **no Category pill and no gap**
  ([ADR-0014](../../docs/architecture/decisions/0014-deck-belongs-to-one-category.md)). Neither pill
  is pressable. Not the **Deck meta row**.
- **Overall mastery card**: the first `surface` card — the **Success rate headline** with the
  **Mastery change chip**, the **Mastery track**, the three **Answer tiles**, and the **Figures
  ribbon**. It has no heading of its own; the headline's caption names it.
- **Success rate headline**: `formatRate` of the deck's success rate at 40 points, weight 800, with
  the muted caption `Success rate` beside it (they wrap together; the chip drops below them when
  the row is too narrow). `--` when the deck has no reviews, not `0%`. Labelled ``Success rate:
  {rate}`` or `Success rate: no reviews yet`, as one element.
- **Mastery change chip**: the pill at the end of the headline row — `+{n} pts since last session`,
  `-{n} pts since last session` or `No change since last session`, tinted success, danger or
  neutral (`surfaceAlt`, muted text) — so the sign and the words, not the colour, carry the
  direction. **Absent** (not empty) when the figure is null, i.e. there is nothing to compare.
  Labelled ``Success rate up {n} points since the last session``, `down` or `unchanged since the
  last session`. It is a difference of two success rates, computed in `src/utils`, never in the
  screen.
- **Answer tiles**: the three equal tiles under the Mastery track, in the order Ok, Okeish, Not ok —
  each a `surfaceAlt` rounded square holding, centred and stacked, an **Answer icon** (20 points,
  its answer's colour, grey with no reviews), the **count** (20 points, weight 700, one line) and
  the **percentage** of all reviews (`formatRate`, 12 points, muted). No answer word is printed.
  Labelled ``{n} ok, {pct}``, ``{n} okeish, {pct}`` or ``{n} not ok, {pct}`` (`no reviews yet`
  in place of the percentage when there are none). Not the **History strip**'s tiles. Not pressable.
- **Figures ribbon**: the inset row at the bottom of the Overall mastery card (`colors.background`
  panel, `border` outline, as the **Mastery bar**'s) of three figures, each a small uppercase muted
  label over a 16-point, weight-700 value: `Reviews` (every recorded answer), `Sessions` (every
  session of the deck, **cleared and active ones included**) and `Last session` (a short date, or
  `Never` when there is no session). `Last session` gets the widest column; labels may wrap to two
  lines, values stay on one.
- **Session history card**: the second `surface` card — the title `Session history`, a muted
  subtitle (``{n} session(s)``, or ``Latest 5 of {n}`` when there are more), the **Chart legend**
  and the **Session history chart**. With no sessions it shows the **Session history empty state**
  in place of the legend and chart.
- **Session history chart** (`SessionHistoryChart`): the smooth stacked area chart of **the latest
  five** sessions (five is the most that fit a 360-point-wide phone at the largest font scale,
  because every session needs a **Session label** under it), **oldest on the left, newest on the
  right**. Active, completed and cleared sessions all count. It is drawn with `react-native-svg`
  and is **a chart, not an icon**: see *Writing UI*. It replaces the five stacked **Session
  columns**, a name that no longer exists. Its parts:
  - **Chart plot**: the SVG and the **Latest session badge** over it, all hidden from
    accessibility (`importantForAccessibility="no-hide-descendants"`). The plot is a fixed 150
    points high and has a fixed
    28-point left gutter for the **Y axis labels** and the rest for the sessions. **Y axis =
    percent of each session's own cards, 0 to 100, not counts**, so a chart never mixes sessions of
    different sizes and never means anything but their own shares (`sessionProgressShares`). **X
    axis = session order, not time**: the dates are in the **Session labels**, and the spacing
    between sessions is the same whatever the days between them. The sessions sit at the centres
    of equal slots across the plot, never narrower than a fifth of its width, so a **Session label**
    always has room.
  - **Answer bands**: three stacked areas, **Ok at the bottom, then Okeish, then Not ok**, each as
    tall as its answer's share of that session's cards, joined between sessions by smooth curves.
    Each is filled with a vertical gradient of its answer's colour from `ANSWER_SEGMENTS` (the
    `Ok` green, the `Okeish` amber, the `Not ok` red — theme tokens, no raw hex), about 0.7 opaque
    at the top fading to about 0.2 at the bottom. Above Not ok sits the **Unanswered band** up to
    100: flat `surfaceAlt` at about 0.6 opacity, with no line and no markers.
  - **Band line**: the smooth line along the top of an answer band, in the answer's colour, with a
    **shadow** that is a wider, darker stroke drawn underneath it (an underlay, **no SVG filters**).
    A band's line is drawn **only if that band's share is above zero at some shown session**; a
    band that is never present has no line, and the bands above it just sit lower.
  - **Chart grid**: dashed horizontal lines at 0, 25, 50, 75 and 100, with the **Y axis labels**
    `0`, `50` and `100` (11 points, muted) in the gutter, and one dashed vertical **Session guide**
    per session, at its marker's x position. The **latest** session's guide is emphasised
    **neutrally** — `colors.text`, heavier — **not green**, which would read as a verdict.
  - **Session marker**: a round marker per session per band, on that band's line, **only where
    that band's share is above zero**. The latest session's markers are larger and filled, with a
    `colors.background` stroke so they lift off the lines.
  - **Latest session badge**: the small badge over the **latest** session's Ok marker — a 12-point
    **Answer icon** `tick` and that session's **Ok count** (`{n}`, 12 points, weight 700), on a
    `surfaceAlt` pill with a `border` outline. It shows the **count**, not the success rate, because
    for an active session the rate is not the Ok share of its cards and the badge sits on the Ok
    marker. It is centred 14 points above that marker and clamped so its centre is never higher
    than 9 points from the top of the plot, so a high Ok marker never pushes it out, and
    it is hidden from accessibility. Statistics prints no answer words, so it has none.
  - **Session label**: the text under each session's guide — its short start date (`formatShortDate`,
    11 points, muted) over its success rate (`formatRate` of its own answers, `--` when it has none;
    12 points, weight 700). The latest session's label is `colors.text` and bold in both lines.
    It is **the one accessible element for its session**, and carries the label the old **Session
    column** carried, unchanged: ``Session on {date}: success rate {rate}, {answered} of {total}
    cards answered — {n} ok, {n} okeish, {n} not ok`` (`no answers yet` in place of the rate when it
    has none). Not pressable. There is no `Session {n}` line.
  - **All chart text is React Native `Text`** with `maxFontSizeMultiplier={1.3}` — the **Y axis
    labels**, the **Session labels** and the badge — **never SVG text**, which ignores the font
    scale.
  - **Single-session bar**: with **one** session there is nothing to join, so the chart is a
    single centred bar, 24 points wide (narrower only if the plot itself is), with the same
    gradient look, the same stacking and **Session markers on its top edges**, and no curve. It
    keeps the **Chart grid**, **Latest session badge** and **Session label**. With two or more
    sessions it is the area chart.
  - **Honesty note**: the curves between sessions are **visual only**. They do not mean the deck
    passed through those states; each session stands on its own shares, and only the markers are
    measurements. Do not add an interpolated value, tooltip or label on a curve.

  Not the **Session results bar** (Learn screen), which is one horizontal bar per session; this is
  the whole deck's history.
- **Chart legend**: the row above the **Session history chart** — three **Answer icons** (tick,
  question mark, cross; 16 points, in their answer colours), a grey swatch with the word
  `Unanswered` **only when some shown session has an unanswered part** (the one word here: nothing
  else says what the grey is), and, at the end, the muted note `% of each session's cards` (12
  points), which names the Y axis. It was the **Session history legend**, a name that no longer
  exists. Hidden from accessibility, since every **Session label** says it in words.
- **Session history empty state**: inline in the card, not a full-screen **Empty state**: `No
  sessions for this deck` over `Start one from the Decks tab and its results will show here.` No
  chart and no legend. No action. Not `No sessions yet`, which is the Learn screen's.
- **Card performance section**: the third area — a header, the **Card search field**, the **Card
  status chips**, then the **Card stats rows** (or one of the empty states below). The header is the
  title `Card performance` (18 points, weight 700, sentence case — not the uppercase muted heading
  the Statistics screen uses, because it hosts a control and a subtitle), the muted subtitle ``{n}
  card(s) · {sort label}``, and the **Sort button** at its end. When the status or the query
  narrows the list the subtitle reads ``{m} of {n} cards · {sort label}`` and is a polite live
  region. With no cards the search field, chips and Sort button are not shown.
- **Sort button**: the icon-only secondary Button (`sort` glyph) at the end of the Card performance
  header, labelled ``Sort cards: {sort label}`` (the current order, so state is not left to the
  subtitle alone). Opens the **Card sort menu**.
- **Card sort menu**: the **Menu sheet** the **Sort button** opens — its only trigger, the
  icon-only secondary Button with the `sort` MenuIcon — titled `Sort cards`, with three
  items in this order, the current one **selected**: **Hardest first** (the default), **Deck order**
  and **Recently reviewed**. None has an icon. Choosing one sorts and closes the sheet.
  - **Hardest first**: lowest success rate first, ties by review count (`sortCardsByDifficulty`),
    never-reviewed cards last. Do not call it "sorted by score". It is the default, not the only
    order.
  - **Deck order**: the cards as the deck stores them — the order of the Edit deck screen and of an
    export. The order **Start session with options** gives with **Shuffle** unchecked.
  - **Recently reviewed**: the most recently answered card first, by its latest `answeredAt`
    in the answer log (`lastAnsweredAtByCard` in `stats.ts`, over the deck's sessions, cleared ones
    included); cards never answered last, in deck order. It does not read `Card.lastReviewedAt`,
    which **Discard session** leaves stale
    ([ADR-0015](../../docs/architecture/decisions/0015-answers-carry-a-timestamp-under-v2-keys.md)
    Amendment 2).
- **Card search field**: the always-visible rounded `surface` field, at least 48 points tall, at
  the top of the Card performance section's controls — the `search` glyph, the text input and,
  only while the query is non-empty, a 40-point clear button (`close` glyph, hit area 48) labelled
  `Clear card search`.
  Placeholder `Search questions and answers`; the input is labelled `Search cards`, with
  auto-correct and auto-capitalise off and a `search` return key, and is **not** auto-focused.
  A card matches when **every typed word appears in the plain text of its question or its answer,
  in any order, case-insensitively** — the rule of the **Search bar**, over both sides. A blank
  query matches everything. Not the **Search bar**: no Search button opens or closes it, and
  it never hides. Not the Statistics screen's **Search input** (`Search text`).
- **Card status chips** (a `radiogroup` labelled `Card status`): the wrapping row under the Card
  search field — **All**, **Needs review**, **Learning**, **Mastered**, **New**, in that order, each
  followed by its count in brackets: `All (56)`, `Needs review (3)`. One is always selected,
  starting at `All`. Same pattern as the **Timeframe chips**: a `radio` per chip (48-point touch
  target, about 36-point pill), `colors.primary` fill when selected, `surfaceAlt` otherwise, wraps
  rather than scrolls. A **Card status chip** is labelled ``{Status}, {n} card(s)`` with its state
  in `accessibilityState` (``Needs review, 3 cards``). **The counts ignore the search** and always
  describe the whole deck. The chips themselves carry no status colour or glyph: that is the
  **Card status badge**'s.
- **Card status**: a card's band, from the success rate `SuccessBar` already uses (the same number,
  so a badge and a bar cannot disagree): **Mastered** at 70% and above, **Learning** from 40% to
  below 70%, **Needs review** below 40%, and **New** when the card has never been reviewed. A card
  that has only okeish answers is 0%, so it is **Needs review**, not New. Derived, never stored.
  This is a statement about the success rate and not a second metric. It is **not** the session
  **review** (error review).
- **Card status badge**: the small pill at the end of a Card stats row's first line — the status's
  word and, in front of it, a 12-point **Answer icon**, in a tint of the status's colour
  (`${token}26` fill, `${token}4d` outline, token-coloured text, 12 points, weight 700, one line):
  **Mastered** `tick` on `colors.success`; **Learning** `question` on `colors.warning`;
  **Needs review** `cross` on `colors.danger`; **New** no glyph, `surfaceAlt` fill, `border` outline,
  `colors.textMuted` text. The word and the glyph carry the status, the colour is a third cue, so
  the amber of Learning is not read by colour alone. The glyph names the **band**, not an answer: a
  Needs review card may have been answered okeish. Hidden from accessibility (the row's label says
  the status).
- **Card stats row**: one card on the Deck statistics screen, a `surface` bordered card, not
  pressable and labelled as one element — ``Question: {question}. Answer: {answer}. {Status},
  success rate {rate}. {n} reviews: {n} ok, {n} okeish, {n} not ok. Reviewed {date}.`` (the last
  two sentences become `Never reviewed.` for a card never reviewed; plain text, HTML removed). From the top: a wrapping line
  of the question (**Rich text**, two lines, 15 points, weight 600) and the **Card status badge**
  (the question takes the whole line and the badge drops under it if less than about 160 points
  remain for the question); the answer (**Rich text**, two lines, 14 points, muted); an 8-point
  **Mastery track**; and a footer line: three **Answer icons** (12 points) each with its percentage
  of the card's reviews (`80%`; **the tick's percentage is the card's success rate**, so it is not
  repeated), and at its end `{n} reviews · Reviewed {short date}` or `Never reviewed`. A card that
  was never reviewed shows an empty track, `--` for each percentage and grey icons. The face shown
  first in a session (**inverted** or not) does not matter here: the question is the question.
- **Deck not found state**: on this screen, the **Empty state** `Deck not found` (message `This
  deck has been deleted.`) with the action `Back`. Unchanged.
- **No cards state**: the **Empty state** `No cards yet` (message `Add cards to this deck to see
  how each one performs.`, no action), shown as the whole Card performance section's body when
  the deck has no cards. The **Overall mastery card** and **Session history card** are still
  shown.
- **Status empty state**: the **Empty state** shown when the selected **Card status chip** has a
  count of zero (taking precedence over the query), with the action **Show all cards**, which
  selects `All`. Titles and messages: `No cards need review` / `No card is below 40% success.`;
  `No cards are learning` / `No card is between 40% and 70% success.`; `No mastered cards yet` / `A
  card is mastered at 70% success or more.`; `No new cards` / `Every card has been reviewed at
  least once.`
- **Search empty state** (on this screen): when the status has cards but the query leaves none:
  `No matches`, ``Nothing matches "{query}".`` — with ``Nothing matches "{query}" with the {Status}
  filter.`` when a status other than `All` is selected — and **Clear search**, which empties the
  query and leaves the **Card search field** where it is.

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
  **Mastery bar**, **Mastery ring** and **Session results bar** legends (so on a **Deck card**, the
  **Aggregated stats** and a **Deck stats card**), in the **Session status pill** (tick), and on the
  Deck statistics screen in the **Answer tiles**, the **Chart legend**, the **Latest session badge**,
  a **Card stats row**'s footer and the **Card status badge** —
  `tick`, `cross`, or `question`, drawn from nested `View`s and hidden from
  accessibility. It is separate
  from the **Menu icon** vocabulary; do not add an answer glyph to `MenuIcon` or the reverse.
- **Not ok / Not Ok**: capitalisation differs by place. The Answer button's label is `Not ok`
  (sentence case); the **Session summary** and **Review summary** say `Not Ok`; the meta rows say
  `not ok` in running text. The Statistics screen prints neither: its answer breakdown is **Answer
  icons** with percentages and counts, and the words appear only in accessibility labels. Match the
  place you are in.
- **Success bar** (`SuccessBar`): the horizontal rate bar, used **on the Study screen only** (the
  **Session progress bar**, and the rate bar of the **Session summary**) — not the Decks screen,
  which uses the **Mastery bar**, nor the Learn screen, which uses the **Session results bar**, nor
  the Statistics screen, which uses the **Mastery ring** and the **Mastery bar**, nor the Deck
  statistics screen, which uses the **Mastery track** (both used `SuccessBar` before their
  redesigns). **Colour carries
  meaning and is fixed by the rate**: border grey for *no data*, success green at 70% and above,
  warning amber from 40%, danger red below — the same bands a **Card status** is read from. Grey and 0% are different states and the app
  distinguishes them. The one override is the optional `color` prop, which replaces the rate colour
  with a fixed one; only the **Session progress bar** uses it (white), because it is not a rate.
- **Empty state** (`EmptyState`): every list's empty content — a title, a message, and an optional
  action. Each one's title is listed with its screen above; the **Search empty state** is under
  **Search**.
- **Rich text** (`RichText`): renders a card's HTML. Supports inline formatting, headings, lists,
  `<br>`, `<hr>`, and `<font color>`; **there is no block layout, no images, and no tables**
  ([ADR-0001](../../docs/architecture/decisions/0001-own-the-html-renderer.md)). Honours
  `numberOfLines`, which is what the Card stats rows use.
- **Tab icons** (`DecksIcon`, `LearnIcon`, `CategoriesIcon`, `StatsIcon`, in `TabIcons.tsx`): one
  glyph per tab, drawn from `View`s. `DecksIcon` is also on the `Decks` **Stat tile**.

## Writing UI

These are constraints, not suggestions. Each one is load-bearing somewhere.

- **There is no icon library.** Every glyph in the app is composed from nested `View`s with
  borders and radii — `MenuIcons.tsx`, `TabIcons.tsx`, and `AnswerIcons.tsx` are the files of
  them. A design that needs a new icon is asking for one to be drawn. Check `MenuIcon` and
  `AnswerIcon` first — reusing an existing glyph for a related idea is nearly always better than a
  new one. **The one exception is the category pictograms**
  ([ADR-0013](../../docs/architecture/decisions/0013-category-icons-are-android-vector-drawables.md)):
  they are Android vector drawables in `src/assets/category-icons/`, rendered and tinted by
  **Category icon** (`CategoryIcon`), and used for categories only. Do not use one for anything else,
  and do not draw a category pictogram from `View`s.
- **`react-native-svg` is for charts only.** The one dependency that draws ([ADR-0018](../../docs/architecture/decisions/0018-react-native-svg-draws-charts.md)) is used for
  the **Session history chart** and any later chart — areas, lines, grids and markers — and
  nothing else: **icons are still drawn from `View`s**, and category pictograms stay Android
  drawables (ADR-0013). Text inside a chart is React Native `Text` with `maxFontSizeMultiplier`,
  never SVG text, and a chart's plot is hidden from accessibility, so each of its meaningful parts
  carries one accessible label of its own. No SVG filters: a shadow is an underlay stroke.
- **Every token comes from [`src/theme.ts`](../../src/theme.ts).** `colors`, `spacing`, `radius`, and
  `categoryPalette` (the 21 colours offered for a category; a category can also take a **custom
  colour** the user picks, which is data, not a token) — and no second source of styling. A raw hex
  or a magic number in a `StyleSheet` is a finding, with existing exceptions: `mark`'s foreground in
  `RichText`, the FAB's spinner colour and the foreground on a filled `Button` (`FOREGROUND_ON_FILL`),
  all of which need contrast against a fixed background,
  and the **modal backdrop scrim** (`#000000aa`) behind the Menu sheet, the Export sample deck
  dialog, the Session setup dialog, the Category picker, the Custom colour dialog and the Custom
  separator dialog — a translucent
  black has to dim whatever is underneath, so
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
