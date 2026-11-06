# Easy Flashcards — Architecture

Easy Flashcards is a React Native flashcards app, built and tested on Android. The user imports a
deck from a local CSV or JSON file, studies it card by card, and the app records how well each card
is known. It has no account, no network calls, and no backend. Everything it stores is in
AsyncStorage on the device, one key per module in `src/storage/` (§5); the only times it leaves the
app are to pick a file to import, and to save a deck out through the system save dialog — the
sample deck as two files, one CSV and one JSON, in two dialogs. An exported deck carries its
content, never its progress, and every file the app exports imports again
([ADR-0016](decisions/0016-deck-export-file-formats.md) and its Amendment 3,
[ADR-0017](decisions/0017-deck-import-reads-exported-formats.md)); both files are format version 2
and name a category the same way ([ADR-0019](decisions/0019-deck-file-format-version-2.md)).

- **App id / namespace:** `com.easyflashcards`
- **Language:** TypeScript · **UI:** React Native primitives, no component library
- **Versions:** [`package.json`](../../package.json) owns every dependency version;
  [`android/build.gradle`](../../android/build.gradle) owns the SDK levels. Do not restate one
  here; it will rot.
- **Data:** AsyncStorage keys, one per module in `src/storage/`. No database, no files of its
  own, no cloud. See §5.
- **Dependency injection:** none — modules import each other directly, and pure logic is kept
  framework-free so tests need no doubles.

> **This document describes structure, not decisions.** Choices with lasting impact are recorded
> as ADRs in [decisions/](decisions/) and indexed in [README.md](README.md). An active ADR is
> binding and outranks this file. Where a section below is governed by one, it says so — follow
> the link rather than inferring the rule from the summary here.
>
> **It is maintained, not archived.** The Planner owns it, and a change that adds a screen, a
> store action, a storage key, a `src/utils/` module, or a dependency must update it in the same
> change — *after* the work lands, so it describes what was actually built. The full trigger list
> is in
> [the architecture documentation instructions](../../.github/instructions/architecture-docs.instructions.md).
> Section numbering is cited by those triggers, so keep it stable.

---

## 1. The screens

The table lists every screen, grouped by the tab that carries it, in tab order. These names are
canonical; the full vocabulary is in
[.github/instructions/ui-vocabulary.instructions.md](../../.github/instructions/ui-vocabulary.instructions.md).

| Tab | Canonical name | What it shows | Implementation |
|---|---|---|---|
| Decks | **Decks screen** | Every deck, imported or created by hand, as a **Deck card**: its **Category square** at the top left, and again before the title of its **Deck options menu**, when the deck has a category ([ADR-0014](decisions/0014-deck-belongs-to-one-category.md) Amendment 1), its card count, a **Mastery bar** splitting its reviews into Ok / Okeish / Not ok, its session and active-session counts, and its last session date. Where a deck is imported, created by hand, started, edited, exported, and deleted. The **Add deck button** opens the **Add deck menu**, whose **Import deck from file** opens the system picker directly; the file is read as JSON when its content starts with `{` or `[` and as CSV otherwise, whatever its name or MIME type, either file brings its title — the deck is named after the file when it has none — its description and a category that resolves on this device, and a file that cannot be read gets an `Import failed` alert with the reason ([ADR-0017](decisions/0017-deck-import-reads-exported-formats.md) and its Amendment 1, [ADR-0019](decisions/0019-deck-file-format-version-2.md) and its Amendment 1); its **Add deck manually** opens the **New deck screen** ([ADR-0011](decisions/0011-deck-editing-is-one-action.md) Amendment 4). A deck's description is not shown on its Deck card. The **Start session button** starts a shuffled session, not inverted; the Deck options menu's **Start session with options** opens the **Session setup dialog**, where **Inverted** and **Shuffle** are chosen independently and which opens with **Shuffle** ticked and **Inverted** unticked every time, so unticking **Shuffle** there is the only way to start a deck in deck order ([ADR-0010](decisions/0010-inverted-sessions.md) Amendment 1). Its **Export to file** opens the **Export format menu** (JSON or CSV), for CSV the **CSV separator menu** (Comma, Semicolon, Tab or Custom…), and for Custom… the **Custom separator dialog**, then the system save dialog; it writes the deck's title, description, category and cards to a file and changes nothing stored ([ADR-0016](decisions/0016-deck-export-file-formats.md)). | `DecksScreen`, route `DecksList` |
| Decks | **Edit deck screen** | One deck's title, description, category and cards in editable fields: add a card, remove a card, edit a card's question and answer. The **Category field** under the description opens the **Category picker**, which offers the **No category choice** and then every default and custom category in one alphabetical grid ([ADR-0014](decisions/0014-deck-belongs-to-one-category.md)). Nothing is written until **Save**, which commits the whole edit in one action ([ADR-0011](decisions/0011-deck-editing-is-one-action.md)); leaving with unsaved changes asks first. | `EditDeckScreen`, route `EditDeck` (param `deckId`) |
| Decks | **New deck screen** | The Edit deck screen's form started blank, to create a deck by hand: an empty title and description, no category, and no cards until **Add card** adds one. **Save** is enabled once the draft differs from the blank form — a title or description that is not only whitespace, a category, or any card; it asks for a title and for both sides of every card as editing does, then creates the deck in one `addDeck` and goes back to the Decks screen, where the deck appears, with no alert. A deck may be created with no cards. Its category is chosen with the same **Category field** ([ADR-0014](decisions/0014-deck-belongs-to-one-category.md) Amendment 5). Leaving unsaved asks first — *This deck has not been saved.* ([ADR-0011](decisions/0011-deck-editing-is-one-action.md) Amendment 4) | `EditDeckScreen`, route `NewDeck` (no params) |
| Learn | **Learn screen** | Every listed session — active, or completed and not cleared — as a **Session card**, active ones first and most recently touched first within each group. A card shows the **Category square** of its deck's category as it is now, and again before the title of its **Session options menu** — none when the deck has no category or no longer exists, because a session stores no category ([ADR-0014](decisions/0014-deck-belongs-to-one-category.md), Amendment 1) — a **Session status pill** (followed by an **Inverted pill** on an inverted session), a **Session results bar** splitting the session's cards into answered Ok / Okeish / Not ok and unanswered, and a footer with the start date and icon-only buttons: **Resume** on an active session; on a completed one the **Review errors button** — shown while the session has missed or unsure cards that still exist in its deck, with a **Review badge** giving how many are outstanding, or a tick and the button disabled once every one is fixed — then the **Replay button**. Where a session is resumed; replayed — a new session over the original's cards that still exist, in its order, which **also clears the original** ([ADR-0008](decisions/0008-clear-completed-sessions.md) Amendment 1); restarted over the whole deck with **Start a new session**, which leaves the original untouched; its errors reviewed, which opens the Study screen in review mode and creates no session ([ADR-0009](decisions/0009-error-review-marks-cards-fixed.md)); an active one discarded (a real delete, which also withdraws its answers from the card counters — ADR-0008 Amendment 2); and a completed one cleared, singly or all at once (hidden from the list but still counted — ADR-0008). Every session started from a session keeps its `inverted`. | `LearnScreen`, route `LearnList` |
| Learn | **Study screen** | One session, in its direction — an inverted session shows each card's answer first and an **Inverted pill** in the Progress header ([ADR-0010](decisions/0010-inverted-sessions.md)): the flip card, the icon-only answer buttons (Not Ok, Okeish, Ok — [ADR-0007](decisions/0007-okeish-third-answer.md)), the answered-so-far strip, and the **Session summary**, whose **Summary actions** — each a label beside an icon-only **Summary button** in the Learn screen's footer style — are **Review the missed or unsure cards** (the **Review errors button** with its **Review badge**, only while any are outstanding; switching to review mode over the same session), **Study the whole deck again** (a new session in the same direction) and **Back to sessions**. With `mode: 'review'` on a completed session it is in **review mode** instead: **Review passes** over the session's outstanding missed or unsure cards, each pass a snapshot shown once per card in the session's direction, ending on the **Review summary**, whose Summary actions are **Review the missed or unsure cards** (the next pass, while any remain) and **Back to sessions**. Only an Ok given in a review writes anything, and all it writes is that the card is fixed ([ADR-0009](decisions/0009-error-review-marks-cards-fixed.md)). | `StudyScreen`, route `Study` (params `sessionId`, optional `mode: 'review'`) |
| Categories | **Categories screen** | Two sections of **Category tiles** — a coloured square with the category's **Category icon**, and its name beneath. The **Custom categories section** lists the user's own categories by name, ignoring case, or a hint when there are none; the **Default categories section** lists the built-in ones, which are constants in code and never stored ([ADR-0012](decisions/0012-custom-categories-third-storage-key.md)). A custom tile opens the **Category options menu**, whose only item is **Delete category**; a default tile does nothing. The **New category button** sits in a footer below the scrolling content. Deleting a custom category detaches it from every deck that uses it, and the confirmation says how many decks will have no category ([ADR-0014](decisions/0014-deck-belongs-to-one-category.md)). A tile shows no deck count. | `CategoriesScreen`, route `CategoriesList` |
| Categories | **New category screen** | A preview **Category tile**, the **Name field**, the **Colour picker** and the **Icon picker**. The Colour picker offers the palette and then the **Custom colour swatch**, which opens the **Custom colour dialog** — hue, saturation and brightness sliders and a preview — where **Use colour** stays disabled while the colour's contrast with `colors.background`, the colour the icon is drawn in, is below 4.5:1 ([ADR-0012](decisions/0012-custom-categories-third-storage-key.md) Amendment 3). **Save** stays disabled until the name passes `validateCategoryName`, then adds the category and goes back; leaving with unsaved changes asks first. There is no screen for editing a category. | `NewCategoryScreen`, route `NewCategory` |
| Statistics | **Statistics screen** | The **Timeframe chips** — `All time`, `This month` and `Last 7 days`, a fixed row above the list, hidden when there are no decks — then the **Aggregated stats** card — the **Mastery ring** (each answer's share of every review, with the Ok-only success rate in its centre — [ADR-0007](decisions/0007-okeish-third-answer.md)) above four **Stat tiles**: `Decks`, `Total cards`, `Total reviews` and `Sessions` — then the **Decks breakdown**, one **Deck stats card** per deck, each showing the deck's **Category square** when it has a category ([ADR-0014](decisions/0014-deck-belongs-to-one-category.md) Amendment 2), a **Mastery bar**, and its card, session and review counts and last session date. The selected timeframe changes the Mastery ring, the `Total reviews` and `Sessions` tiles, and each Deck stats card's Mastery bar, `Reviews` and `Sessions`; `Decks`, `Total cards`, a card's `Cards` and `Last` stay all time, and the selection is local to the screen and never stored ([ADR-0015](decisions/0015-answers-carry-a-timestamp-under-v2-keys.md)). A search narrows the Deck stats cards and leaves the Aggregated stats. | `StatsScreen`, route `StatsOverview` |
| Statistics | **Deck statistics screen** | One deck, as one scrolling list: the **Deck identity row** — a **Card count pill** and, when the deck's category resolves through `findCategory`, a **Category pill** with its **Category square** and name, with no pill and no gap otherwise ([ADR-0014](decisions/0014-deck-belongs-to-one-category.md) Amendment 6); the **Overall mastery card** — the Ok-only **Success rate headline**, the **Mastery change chip**, a **Mastery track**, three **Answer tiles** and the **Figures ribbon** (`Reviews`, `Sessions`, `Last session`); the **Session history card**, whose **Session history chart** is a smooth stacked area chart of the latest five sessions, oldest on the left, each session's Ok / Okeish / Not ok / unanswered shares of its own cards stacked to 100% and a **Session label** under each, or a single stacked bar for one session, drawn with `react-native-svg` ([ADR-0015](decisions/0015-answers-carry-a-timestamp-under-v2-keys.md) Amendment 3, [ADR-0018](decisions/0018-react-native-svg-draws-charts.md)); and the **Card performance section** — the **Card search field**, the **Card status chips** and a **Card stats row** per card, ordered by the **Sort button**'s **Card sort menu** (Hardest first, Deck order, Recently reviewed). Always all time; the Statistics screen's timeframe does not reach it. The headline, the Answer tiles, the `Reviews` figure, the card statuses and each row's figures read the card counters; the session history, each row's last-reviewed date, the Recently reviewed order and the Mastery change chip read the answer log ([ADR-0015](decisions/0015-answers-carry-a-timestamp-under-v2-keys.md) Amendment 2). **Reset statistics** is in the **Deck statistics menu** in the header. | `DeckStatsScreen`, route `DeckStats` (param `deckId`) |

The detail screens are reached by pushing onto their tab's stack: **Edit deck** from the Decks
screen's Deck options menu, **New deck** from the Decks screen's Add deck menu, **Study** from the
Learn screen (Resume, Replay, Review errors, Start a new session) or from starting a deck, **New
category** from the Categories screen's New category button, and **Deck statistics** from the
Statistics screen. The other screens are the roots of their tabs and are reached only by switching
tab.

There are no modal screens. Transient UI is an `Alert`, the **Menu sheet** (`MenuSheet`), a
bottom sheet rendered in a `Modal` and opened from a **Kebab menu** (`KebabMenu`), or a centred
`Modal` dialog: the **Export sample deck dialog** inside `AppMenu`, the **Session setup dialog**
(`SessionSetupDialog`) and the **Custom separator dialog** (`CustomSeparatorDialog`) that the Decks
screen opens, the **Category picker** (`CategoryPicker`)
that the Category field of the Edit deck and New deck screens opens, and the **Custom colour dialog**
(`CustomColorDialog`) that the New category screen opens from its Colour picker. The Category options menu is a
Menu sheet too, opened by the Categories screen rather than by a Kebab menu, and so are the Decks
screen's **Export format menu** and **CSV separator menu**, opened in turn from the Deck options
menu's **Export to file**, and its **Add deck menu**, opened from the **Add deck button**, and the
Deck statistics screen's **Card sort menu**, opened by its
**Sort button**, whose current order is the item marked selected. That screen's header carries
the **Deck statistics menu**, a Kebab menu holding only **Reset statistics**. The **App menu**
(`AppMenu`) in the header is one of those kebab menus; on the Decks, Learn and Statistics screens
it sits at the end of the **Header toolbar** (`HeaderToolbar`), after the **Search button**, and
on the Learn screen it carries **Clear completed sessions** ahead of its common items. The Categories screen has no Header toolbar and
no search; its header carries the App menu alone. The Search button opens
the **Search bar** (`SearchBar`) above the screen's list, which narrows the list by deck name as
the user types; see §3 for how a title matches. The Deck statistics screen has no Search button:
its **Card search field** is always shown and matches a card's question and answer as plain text.

---

## 2. Data flow

```
AsyncStorage                              Device (SAF)
  @easy-flashcards/decks/v2                 @react-native-documents/picker
  @easy-flashcards/sessions/v2              @dr.pogodin/react-native-fs
  @easy-flashcards/categories/v1                    │
        │                                           │
  decksStorage.ts                           services/importDeck.ts
  sessionsStorage.ts                        services/exportSampleDeck.ts
  categoriesStorage.ts                      services/exportDeck.ts
   (load / save / normalise)                        │
        │                                     utils/csv.ts (PapaParse)
        │                                     utils/deckImport.ts
        │                                     utils/deckExport.ts (PapaParse)
        └───────────────┬─────────────────────────┘
                        │
              DecksContext  (useReducer over state/reducer.ts)
              state: decks, sessions, categories, isLoading, error
              api:   addDeck, updateDeck, deleteDeck, startSession,
                     replaySession, recordAnswer, recordReviewAnswer,
                     deleteSession, clearCompletedSessions, clearSession,
                     resetDeckStats, getDeck, getSession,
                     addCategory, deleteCategory
                        │
                   useDecks()
                        │
              *Screen components  ← the only consumers of the store
                        │   (derive with utils/stats.ts,
                        │    utils/timeframe.ts, utils/search.ts
                        │    and utils/categories.ts inside useMemo)
                        │
              Components (see §3 for the list)
                        ← plain props + callbacks, no store access
```

The loop is one-way: a screen calls a function on the context, the reducer produces a new state
object, React re-renders, and a `useEffect` watching `state.decks`, `state.sessions` and
`state.categories` writes every key back. No screen writes storage, and no storage module knows
about React.

**The UI language flows beside the store, not through it.** `I18nProvider`, above `DecksProvider`
(§3 *App entry points*), reads the device tag once when it mounts, through
`services/deviceLocale.ts`, and keeps the `Translator` that `translatorForTag` in `src/locales/`
resolves for it. Screens, components and the navigator read it with `useT()`; pure code in
`src/utils/` that builds text takes it as a `t` parameter, and code that only fails returns a code
the screen maps to a message. The reducer never reads it and no text is stored or persisted, so
the language can change between runs without touching data —
[ADR-0020](decisions/0020-ui-text-translated-through-typed-catalogue.md),
[ADR-0003](decisions/0003-single-context-reducer-store.md) Amendment 8.

**Exporting a deck reads the store and writes nothing to it.** The Decks screen takes the deck from
`useDecks()`, resolves its category with `findCategory`, and hands both to `exportDeck` in
`services/`, which serialises them with `utils/deckExport.ts` and opens the system save dialog. No
action is dispatched and no key changes; the file carries the deck's title, description, category
and cards, and none of its ids, counters, timestamps or sessions —
[ADR-0016](decisions/0016-deck-export-file-formats.md). Both files are format version 2 and carry
the same metadata — `format`, `version`, `title`, `description`, `category` — the category as one
string from `categoryReference`: a built-in category's id, a custom one's name
([ADR-0019](decisions/0019-deck-file-format-version-2.md)).

**Exporting the sample deck does not touch the store at all.** `AppMenu` calls
`exportSampleDeck` in `services/`, which hands the constant `SAMPLE_DECK` from
`utils/sampleDeck.ts` to the same `exportDeck` once per file — CSV, then JSON — so the sample is
written by the same serialiser as any deck; `describeSampleDeckExport` turns the two outcomes into
one alert (ADR-0016 Amendment 3).

**Importing a deck is one `addDeck`, and the reducer resolves its category.** The Decks screen
calls `pickAndParseDeck()` in `services/`, which reads the picked file, chooses its format from the
content with `detectDeckFormat` and parses it with `utils/csv.ts` or `utils/deckImport.ts`, then
passes the result to `addDeck` with its name, `description` and the file's unresolved category
reference as the requested `categoryId` — the name being the file's title, or its file name
(`deckNameFromFileName`) when it has none, in either format, or the catalogue's default deck name
in the language active at import when neither is usable; a CSV file's three come from its
`# title:`, `# description:` and `# category:` lines (ADR-0019 Amendment 1). The reducer's
`addDeck` case resolves that request with
`resolveCategoryReference` against `state.categories` — a built-in id, then a stored custom
category's id, then its name ignoring case; never a built-in's name — and stores `null` when
nothing matches; the import never creates a category. Every card
starts with a fresh id and zero counters and the deck with no sessions, whatever the file holds, so
the counters equal the answer log (below) for an imported deck by construction —
[ADR-0017](decisions/0017-deck-import-reads-exported-formats.md) and its Amendments 1 to 3,
[ADR-0019](decisions/0019-deck-file-format-version-2.md) and its Amendment 1,
[ADR-0003](decisions/0003-single-context-reducer-store.md) Amendments 4, 6 and 7.

**Creating a deck by hand is one `addDeck` too.** The New deck screen holds its draft as local
state, as the Edit deck screen does, and writes nothing while the user types. **Save** builds the
input with `newDeckInputOf` in `utils/deckEdit.ts` — the trimmed title and description, the chosen
`categoryId`, `sourceFileName: null`, and the cards with their draft ids dropped and their text as
typed — and calls `addDeck` once; the reducer resolves the category exactly as for an import, and
the deck starts with fresh ids, zero counters and no sessions. `addDeck` mints new ids on every
call, so the screen, not the store, ignores a second **Save** —
[ADR-0011](decisions/0011-deck-editing-is-one-action.md) Amendment 4,
[ADR-0003](decisions/0003-single-context-reducer-store.md) Amendment 5.

**Nothing derived is stored.** Success rates, answer shares, session progress, orderings,
difficulty rankings and every timeframe figure are computed by pure functions in
[`src/utils/stats.ts`](../../src/utils/stats.ts) — a timeframe's start by
[`src/utils/timeframe.ts`](../../src/utils/timeframe.ts) — called from a `useMemo` in the screen
that needs them. Two raw records are persisted: a card's per-answer counters — one for each
`Answer` in [`src/types.ts`](../../src/types.ts) — and each session's `results`, every
`SessionResult` carrying the `answeredAt` of its answer. Okeish counts as a review but earns no
credit in any success rate ([ADR-0007](decisions/0007-okeish-third-answer.md)).

**Session results are the answer log, and the reducer keeps the counters equal to it.** For every
card in a deck, its three counters equal the number of results for that card, by answer, across
its deck's sessions. `recordAnswer` adds one to both, stamping `answeredAt` with the dispatch's
`at`; `deleteSession` takes a discarded session's results back off its deck's counters;
`deleteDeck` and `resetDeckStats` drop both; a card removed by `updateDeck` takes its counters and
leaves its results, which nothing counts because the card is gone; every other action touches
neither. The Statistics screen derives every timeframe, All time included, from the log, counting
a result only while its deck exists and its card is still in it; the Decks screen's Mastery bar
reads the counters. The Deck statistics screen reads both, and stays all time: its headline, Answer
tiles, `Reviews` figure, card statuses, Hardest first order and Card stats rows read the counters,
while its session history (`getSessionHistory`), each card's last-reviewed date and the Recently
reviewed order (`lastAnsweredAtByCard`) and its Mastery change chip
(`rateChangeSinceLastSession`) read the log; it never reads `Card.lastReviewedAt`, which a discard
leaves stale ([ADR-0015](decisions/0015-answers-carry-a-timestamp-under-v2-keys.md) Amendment 2).
A reducer test pins the equality across a sequence of actions —
[ADR-0015](decisions/0015-answers-carry-a-timestamp-under-v2-keys.md).

**Decks and sessions meet only in the reducer.** A `Session` holds a `deckId`, a snapshot of
`deckName`, and a frozen `cardIds` array; it never holds a `Card`. Resolving a session back to its
deck is the job of the screen that needs the cards — the Study screen, and the Learn screen when it
starts a new session from an old one, works out a completed session's review state, or shows a
session's category — through `getDeck(session.deckId)` —
[ADR-0002](decisions/0002-sessions-are-snapshots.md).

**A session carries its direction.** `Session.inverted` is set when the session is created and
nothing changes it afterwards. It comes from a required options argument —
`startSession(deck, { inverted }, cardIds?)` and
`replaySession(sourceSessionId, deck, { inverted }, cardIds)` — so a call site that forgets it
fails `npm run typecheck`; no reducer action was added, because the flag travels inside the
`Session` the existing actions carry. Only the Decks screen chooses a direction, and only it
chooses a card order: the **Start session button** passes `false` and the whole deck's card ids,
shuffled by `shuffle`, as `cardIds`; the **Session setup dialog** passes the user's choices, and
opens with **Shuffle** ticked and **Inverted** unticked every time, so a deck-order start means
unticking **Shuffle** there. A session created from an existing one — the Learn screen's
**Replay button** (`replaySession`, in the original's order) and **Start a new session**
(`startSession` over the whole deck), and the Session summary's **Study the whole deck again**
(`startSession`, always in deck order, because whether the source was shuffled is not stored) —
passes the source session's `inverted`, and a review pass shows its session's cards in that
session's direction. Which face is shown first comes only from `cardFaces`
in `utils/cardFaces.ts`; answers, card counters and every `stats.ts` function ignore direction —
[ADR-0010](decisions/0010-inverted-sessions.md), whose Amendment 1 made the shuffled start the
default.

**Clearing a session archives it; it does not delete it.** `clearCompletedSessions` and
`clearSession` stamp `clearedAt` on completed sessions, which hides them from the Learn screen and
leaves every session statistic unchanged. `deleteSession` still removes a record outright and, in
the same dispatch, withdraws the session's results from its deck's card counters — one per result,
only for cards still in the deck, never below zero, with `lastReviewedAt` and `lastStudiedAt` left
as they were (ADR-0008 Amendment 2). It is used only to discard an active session; `deleteDeck` and `resetDeckStats` remove a deck's sessions,
cleared ones included — [ADR-0008](decisions/0008-clear-completed-sessions.md). `replaySession`
clears too: in one dispatch it prepends the new session and clears its source with `clearSessionAt`
semantics (`prependSessionClearing`), so no state, and no save, has both sessions listed or
neither — ADR-0008 Amendment 1.

**Reviewing a session's errors writes almost nothing.** `recordReviewAnswer(sessionId, cardId,
answer)` is dispatched the moment a review answer is given and delegates to `applyReviewAnswer`:
an Ok on a missed or unsure, not yet fixed card of a completed session appends that card to the
session's `fixedCardIds`; every other case returns the same state object, so nothing re-renders
and nothing is written. It never touches `results`, `completedAt`, `updatedAt` or `clearedAt`, a
card's counters or a deck's `lastStudiedAt`, and it creates no session — so no statistic moves and
the session keeps its place in the Learn list. Which cards are still outstanding, and whether a
session's review is done, is derived, never stored —
[ADR-0009](decisions/0009-error-review-marks-cards-fixed.md),
[ADR-0005](decisions/0005-answers-recorded-immediately.md) Amendment 2.

**Editing a deck is one action, committed once.** The Edit deck screen holds the title, the
description, the category id and the whole card list as local state and writes nothing while the
user types. **Save** calls `updateDeck(deckId, edit)`, which mints an id for each new card and
dispatches `updateDeck` once; the reducer applies `applyDeckEdit` to the deck and
`reconcileSession` to each of its sessions in the same case. A card keeps its counters across an
edit, a removed card takes its counters with it, the new title reaches every session's `deckName`,
and an active session loses the removed cards that it had not yet answered —
[ADR-0011](decisions/0011-deck-editing-is-one-action.md). The reducer resolves the edit's
`categoryId` with `findCategory` at dispatch time and writes `null` when it matches neither a
default nor a stored custom category; the category touches no session — ADR-0011 Amendment 1,
[ADR-0014](decisions/0014-deck-belongs-to-one-category.md).

**A deck refers to at most one category; a session refers to none.** The built-in categories are
`DEFAULT_CATEGORIES` in `utils/categories.ts`: constants with permanent `default_<icon>` ids, never
in the store's state and never stored. `state.categories` holds only the user's own. A deck holds
`categoryId` — `null` for none — and nothing checks it on load. A deck imported from either file
gets the category its reference names only when it resolves at dispatch
([ADR-0019](decisions/0019-deck-file-format-version-2.md),
[ADR-0017](decisions/0017-deck-import-reads-exported-formats.md)), and a deck created by hand the
one chosen on the New deck screen, resolved the same way
([ADR-0014](decisions/0014-deck-belongs-to-one-category.md) Amendment 5).
`findCategory(id, customs)` is the resolution of a stored id: the default or stored custom category
with that id, or `null`. `updateDeck` and every screen that shows a category go through it, so an id
that resolves to neither displays as no category everywhere; only the reducer's `addDeck` case uses
`resolveCategoryReference` instead, because what it is given may be a file's reference rather than
an id (ADR-0014 Amendment 8). A session stores no category; the Learn
screen resolves it through `session.deckId` → `deck.categoryId`, so re-categorising a deck changes
the square on its existing sessions, cleared ones included, and a session whose deck is gone shows
none ([ADR-0002](decisions/0002-sessions-are-snapshots.md) Amendment 6).
`addCategory({ name, color, icon })` trims the name, mints a `category_` id with `createId`,
dispatches `addCategory` and returns the new category; it does not validate the name — the New
category screen calls `validateCategoryName` first and keeps Save disabled until it passes. Nor
does it check the colour: the palette and the Custom colour dialog are the only sources, and the
dialog is where the contrast rule lives
([ADR-0012](decisions/0012-custom-categories-third-storage-key.md) Amendment 3).
`deleteCategory(id)` removes a stored custom category and, in the same dispatch, sets `categoryId`
to `null` on every deck that used it; cards, counters, `lastStudiedAt` and sessions are untouched.
For any other id, a default one included, it returns the same state. The Categories screen counts
the decks a delete will detach with `countDecksInCategory` when the confirmation opens; the count is
not stored — [ADR-0014](decisions/0014-deck-belongs-to-one-category.md),
[ADR-0012](decisions/0012-custom-categories-third-storage-key.md) (and its Amendment 1),
[ADR-0003](decisions/0003-single-context-reducer-store.md) Amendments 2 and 3.

---

## 3. Layers

### `src/utils/` — pure TypeScript

Nothing here imports from `react` or `react-native`, and that is the property that makes it
testable under Jest with no renderer and no mocks. Every file here has a test in `__tests__/`,
named after it; so do `src/state/reducer.ts` and every storage module (see §8 for what is not
tested). A file here may import `src/theme.ts`, which is plain constants.

| File | Role |
|---|---|
| [`csv.ts`](../../src/utils/csv.ts) | `parseFlashcardsCsv` — the CSV importer ([ADR-0017](decisions/0017-deck-import-reads-exported-formats.md)). It strips a BOM, skips the blank lines and the lines starting with `#` above the header, and takes the first other line as the header row; a `#` line below it is an ordinary row. The `#` lines above the header are read as `# key: value` — the key is the text before the first colon, trimmed and lower-cased, the value the rest, trimmed and unescaped (`\\` and `\n`); a line with no colon is ignored and the first line for a key wins ([ADR-0019](decisions/0019-deck-file-format-version-2.md)). All five keys the export writes are used: `title`, returned as `title` (`null` when missing or blank, and the caller then names the deck after the file), and `description`, returned as `description` (`''` when missing) — both trimmed before they are unescaped, so an escaped line break at either end survives (ADR-0019 Amendment 1); `category`, returned unresolved as `categoryRef` (`null` when missing or empty); and `format` with `version`, which refuse the file with the JSON importer's newer-version message only when `format` is `easy-flashcards-deck` and `version` is an integer above `DECK_FILE_VERSION`; any other `format` or `version`, or none, imports. It finds the separator from that row: each of its characters that is `;`, tab, `,` or passes `validateCustomSeparator` (imported from `deckExport.ts`, so the importer accepts every separator the export can write) splits it with PapaParse, and the first, in that order and then custom ones by position, whose trimmed, lower-cased fields include `question` and `answer` wins. Rows from the header on are parsed with it; extra columns are ignored, card text is trimmed, a row with both sides blank is ignored, and one with a single blank side is skipped and counted. Throws `DeckImportError` with a code — `emptyFile`, `newerVersion`, `noHeader` or `noUsableRows` — for an empty file, a newer version, a header row naming no `question` / `answer` pair under any candidate, or no usable row. Also `deckNameFromFileName`: the file name without its extension, or `null` when nothing is left, and the Decks screen then names the deck with the catalogue's default deck name in the language active at import ([ADR-0020](decisions/0020-ui-text-translated-through-typed-catalogue.md)). |
| [`deckImport.ts`](../../src/utils/deckImport.ts) | The format-independent side of import and the JSON importer ([ADR-0017](decisions/0017-deck-import-reads-exported-formats.md)). `DeckImportFormat` (`'csv'` or `'json'`), `ParsedCard`, `DeckImportError` — the one error either importer throws, carrying a `DeckImportErrorCode` (`emptyFile`, `notADeck`, `newerVersion`, `noCards`, `noHeader`, `noUsableRows`, `unreadable`) that the Decks screen maps to a catalogue message, and an English `message` kept for diagnostics and the tests ([ADR-0017](decisions/0017-deck-import-reads-exported-formats.md) Amendment 4) — and `stripBom`. `detectDeckFormat(raw)` chooses the parser from the content alone: after a BOM and leading whitespace, a first character of `{` or `[` is `'json'` and anything else, an empty file included, `'csv'`; the file name and MIME type are never consulted (ADR-0017 Amendment 1). `parseDeckJson` reads the object `serializeDeckJson` writes, version 1 or 2: it must be a JSON object with `format: "easy-flashcards-deck"` (`DECK_FILE_FORMAT`) and a numeric `version`; a `version` above `DECK_FILE_VERSION` is refused with `NEWER_VERSION_MESSAGE`, which `csv.ts` shares, and anything else unrecognised — not JSON, an array, another `format`, a `version` below 1 or not an integer, `cards` not an array — as not a deck file. Unknown keys are ignored. A card counts when both sides are strings, non-blank once trimmed, and is otherwise skipped and counted; no usable card is an error. Returns the trimmed `title` or `null` (the caller then names the deck after the file), the trimmed `description` or `''`, the unresolved `categoryRef` — a string `category` as it is, in either version; for the object version 1 wrote, its `id` when that is a built-in id, else its `name` when non-blank, else its `id`; otherwise `null` ([ADR-0019](decisions/0019-deck-file-format-version-2.md)) — the cards and the skipped count. No id, counter or timestamp in the file is read. |
| [`html.ts`](../../src/utils/html.ts) | A tolerant HTML parser: `parseHtml` to `HtmlNode[]`, `decodeEntities`, and the `BLOCK_TAGS` set. It never throws — unclosed and stray tags are absorbed, and an unclosed `<li>` or `<p>` is closed when its next sibling opens. `decodeEntities` decodes numeric references and a fixed table of named ones, which includes `aacute`, `iacute`, `oacute`, `uacute`, `ntilde` and `szlig`; an unknown name is left as written. `htmlToPlainText` is a card side's visible text — the tags dropped, entities decoded, a `<br>` or block boundary read as a space, whitespace collapsed and trimmed — used for the Card search and for a Card stats row's accessibility label. |
| [`stats.ts`](../../src/utils/stats.ts) | Every derived number in the app: `successRate`, `answerShares`, `describeAnswerShares` (the spoken form of a split, the catalogue's *not reviewed yet* text for `null` — part of the accessibility label of the Mastery bar, the Mastery ring and the Deck stats card; it takes `t`), `allocateRingSegments` (how many of the Mastery ring's bars each answer gets — see below), `sessionProgressShares` (each answer's share of a session's cards rather than of its reviews, scaled down together if the results ever outnumber the cards), `resolvableCardIds` (the given card ids that still exist in a deck, in the given order — what the Learn screen's Replay passes to `replaySession`, and what every review derivation filters through), `getDeckStats`, `getGlobalStats` (the counter-based totals; `getGlobalStats` is no longer called from `src/` — the tests compare it with `getGlobalStatsSince`), `getDeckStatsSince`, `getGlobalStatsSince`, `countSessionsSince` and `countSessionsByDeckSince` (the Statistics screen's figures, from the answer log — see below), `getSessionTally`, `canRecordAnswer` (the reducer's guard for `recordAnswer`: only an active session's next unanswered card is accepted, so a repeated or out-of-order answer is a no-op), `getMissedOrUnsureCardIds`, `getReviewableCardIds`, `getOutstandingReviewCardIds` and `getReviewState` (the error review's derived values — see below), `normalizeFixedCardIds` (the sessions loader's rule for `fixedCardIds`), `applyReviewAnswer` (the transform behind `recordReviewAnswer`, returning the same array when nothing changes), `prependSessionClearing` (the transform behind `replaySession`: the new session first, its source cleared with `clearSessionAt` semantics), `summarizeSessions`, `summarizeSessionsByDeck` (with `EMPTY_SESSION_SUMMARY` for a deck that has none), `isSessionActive`, `isSessionCleared`, `listedSessions` (the sessions the Learn screen shows), `clearableSessionCount` (completed sessions not yet cleared), `clearCompletedSessionsAt` and `clearSessionAt` (the transforms the reducer applies to clear sessions, returning the same array when nothing qualifies), `previousReviewIndex` (where a review swipe right on the Study screen lands — one answered card back, wrapping from the oldest round to the frontier), `sortSessions`, `sortCardsByDifficulty`, `cardReviewCount`, the Deck statistics screen's derivations — `rateBand`, `cardStatus`, `countCardStatuses`, `sortCards`, `lastAnsweredAtByCard`, `getSessionHistory` and `rateChangeSinceLastSession` (see below) — and the `formatRate` / `formatDate` / `formatShortDate` display helpers; `formatDate` and `formatShortDate` take `t` and return the catalogue's *never* text (`answers.dates.never`) for a null timestamp, and `formatShortDate` is month and day only, in the device locale whatever the text language ([ADR-0020](decisions/0020-ui-text-translated-through-typed-catalogue.md)). |
| [`timeframe.ts`](../../src/utils/timeframe.ts) | The Statistics screen's timeframes ([ADR-0015](decisions/0015-answers-carry-a-timestamp-under-v2-keys.md)). `Timeframe` is `'all'`, `'month'` or `'week'`; `TIMEFRAMES` lists them in chip order; their labels (`All time`, `This month`, `Last 7 days`) are catalogue messages under `answers.timeframes`, looked up where they are shown ([ADR-0020](decisions/0020-ui-text-translated-through-typed-catalogue.md)). `timeframeStart(timeframe, now)` is the earliest `answeredAt` a window includes, in the device's local time: `null` for all time, local midnight on the 1st of `now`'s month, or local midnight six days before `now`'s day. There is only a start, no end. `now` is an argument, so the tests fix it. |
| [`i18n.ts`](../../src/utils/i18n.ts) | The translation engine ([ADR-0020](decisions/0020-ui-text-translated-through-typed-catalogue.md)). The types derive every key and every message's placeholders from the English catalogue (`Catalogue`, `MessageKey`, `MessageValues`, `MessageArgs`, and `CatalogueKey` / `CatalogueValues` / `CatalogueArgs` over any catalogue, which the tests use), so an unknown key or a missing or extra value fails typecheck. `createTranslator(language, fallback)` returns a `Translator`: `t(key, values)` and `t.parts(key, values)`, the second split into literal runs and placeholder parts so a value can be styled. A plural message picks its form with the language's own rule function, because Hermes has no `Intl.PluralRules`; a message missing from the language falls back to the fallback language, then to the key itself, and a placeholder with no value stays visible as `{name}`. `formatMessage` / `formatParts` are the primitives. `normalizeLocaleTag` reads a BCP 47 or Java `Locale.toString()` tag as `language[-Script][-Region]`, mapping the legacy language codes Java still reports (`in`, `iw`, `ji`) to `id`, `he`, `yi` (ADR-0020 Amendment 3); `resolveLanguage(tag, codes, fallback)` matches it case-insensitively, trying the full tag, language and script, language and region, the language alone, then `fallback`. `pseudoLocalize` / `pseudoLocalizeCatalogue` build the pseudo-language: accented letters, about a third longer, in brackets, placeholders untouched (ADR-0020 Amendment 1). |
| [`fileUri.ts`](../../src/utils/fileUri.ts) | `fileUriToPath` and `pathToFileUri` — the percent-encoding boundary between a `file://` URI and a path. |
| [`search.ts`](../../src/utils/search.ts) | The title search behind the Search bar. `splitSearchWords` lower-cases a query, splits it on whitespace, `-`, `_` and `.`, and drops empty and repeated words; `titleMatchesWords` is true when every word occurs in the title as a literal substring, in any order; `filterByTitle(items, query, getTitle)` combines the two, and returns `items` itself — not a copy — for a query with no words, so a memoised list keeps its identity. `cardSearchText(card)` is the "title" the Deck statistics screen's Card search field matches: `htmlToPlainText` of the question and of the answer, joined by a space, so a query never matches a tag name or an entity's source form. |
| [`shuffle.ts`](../../src/utils/shuffle.ts) | `shuffle(items, random = Math.random)` — Fisher-Yates over a copy; the input is never mutated. `random` is injectable so tests are deterministic. The Decks screen uses it to order the `cardIds` it passes to `startSession` from the **Start session button**, and from the Session setup dialog unless **Shuffle** is unticked ([ADR-0010](decisions/0010-inverted-sessions.md) Amendment 1). Shuffling is not stored; the order is the `cardIds` themselves. |
| [`cardFaces.ts`](../../src/utils/cardFaces.ts) | `cardFaces(card, inverted)` — the session's direction applied to a card: `{ front, back }`, the `question` then the `answer`, swapped when `inverted`. The single place a direction is applied; the card itself is never rewritten. Also `readInverted(value)`, the sessions loader's rule for the stored flag: `true` only for an exact `true` ([ADR-0010](decisions/0010-inverted-sessions.md)). |
| [`storedArray.ts`](../../src/utils/storedArray.ts) | `parseStoredArray(raw)` — the rows of a stored JSON array; `[]` for a missing, unparseable or non-array value. Every loader reads through it, so a corrupt key never throws. |
| [`sampleDeck.ts`](../../src/utils/sampleDeck.ts) | The sample deck that the App menu's **Export sample deck** saves ([ADR-0016](decisions/0016-deck-export-file-formats.md) Amendment 3). `SAMPLE_DECK` is a `Deck` — the title `Sample deck`, a description, the built-in category `default_geography` and five cards — whose ids, timestamps and counters exist only to satisfy the type, since an export writes none of them; `SAMPLE_DECK_CATEGORY` is that category resolved by `findCategory` with no custom categories. `SAMPLE_DECK_EXPORTS` lists the files to save, in order: CSV with the Semicolon preset, then JSON. `SampleDeckExportOutcome` is one file's result — `saved` with the name the save dialog returned (or `null`), `cancelled`, or `failed` with a message — and `describeSampleDeckExport(outcomes, t)` builds the one alert from catalogue messages under `importExport.sampleExport`, a failure's own (native, English) message inside a translated sentence: `Sample deck exported` when at least one file was saved and none failed, `Sample deck partly exported` when one was saved and another failed, `Export failed` when none was saved and one failed, and `null` — no alert — when every file was cancelled. Its message names each saved file (`Saved as … and ….`, by the suggested name when the dialog returned none), then each failure with its message, then each cancelled file as not saved; with nothing saved it lists only the failures. Raw assets are not bundled, so `samples/sample-deck.csv` and `samples/sample-deck.json` are copies of what the export writes; a test checks that each equals `serializeDeck`'s output, line endings aside, and imports as the deck. |
| [`deckExport.ts`](../../src/utils/deckExport.ts) | The pure side of exporting a deck: the two file formats of [ADR-0016](decisions/0016-deck-export-file-formats.md), at format version 2 ([ADR-0019](decisions/0019-deck-file-format-version-2.md)). `DECK_FILE_FORMAT` (`easy-flashcards-deck`) and `DECK_FILE_VERSION` (`2`) are defined here once and read by both importers. It takes a deck and its already-resolved `Category \| null`, and never resolves one itself; the category is written as `categoryReference(category)` — a built-in id, a custom name, or none. `serializeDeckJson` writes one two-space-indented object — `format`, `version`, `title`, `description`, `category` (that string, or `null`) and `cards` as `{ question, answer }`. `serializeDeckCsv(deck, category, separator)` writes five comment lines, always and in this order — `# format:`, `# version:`, `# title:`, `# description:`, `# category:` (nothing after the colon for no category) — a value kept on one line by writing `\` as `\\` and a line feed as `\n` and dropping a carriage return, never quoted — then a `question` / `answer` header and one row per card through `Papa.unparse`, with `newline: '\n'` and a `quotes` function that also quotes every field starting with `#`; it adds the final line feed Papa leaves off, and throws on a separator that is neither a preset nor valid, because Papa would silently fall back to a comma. Card text is written exactly as stored. `SEPARATOR_PRESETS` are Comma, Semicolon and Tab as a `key` and a `value`, their labels catalogue messages under `importExport.separators`; `EXPORT_FORMAT_NAMES` are the menu labels `JSON` and `CSV`, kept in code because a file-format name is never translated ([ADR-0020](decisions/0020-ui-text-translated-through-typed-catalogue.md) Amendment 1); `validateCustomSeparator` is the custom rule — one code point, untrimmed, not `"`, `#`, a carriage return, a line feed or the BOM (checked before whitespace, because `\s` matches the BOM too), not whitespace, and not a letter or digit in any script by the `\p{L}` / `\p{N}` Unicode property escapes, which Hermes runs (seen on a device) — returning the separator or a reason (`empty`, `tooLong`, `reserved`, `whitespace`, `alphanumeric`). `exportFileName` is the suggested file name: the title with `/ \ : * ? " < > \|` and control characters replaced by `_`, trimmed, `deck` when nothing is left, plus `.json` or `.csv`. `EXPORT_MIME_TYPES` maps each format to `application/json` or `text/csv`, and `serializeDeck` picks the serialiser from a `DeckExportOptions`. The tests round-trip the CSV through PapaParse with `comments: '#'`, and `csv.test.ts` and `deckImport.test.ts` round-trip both formats through the importers. |
| [`deckEdit.ts`](../../src/utils/deckEdit.ts) | The pure side of editing a deck, and of creating one by hand on the same form ([ADR-0011](decisions/0011-deck-editing-is-one-action.md)). `CardDraft` / `DeckEdit` are the editor's shapes — a `DeckEdit` carries the `categoryId` beside the title, description and cards; `draftsOf`, `isDeckEditChanged` (what the Save button and the discard prompt rest on; a different `categoryId` counts as a change), `removedCardIds` and `firstIncompleteCard` serve the Edit deck screen. The New deck screen uses `firstIncompleteCard` too, with `isNewDeckDraftBlank` — true while the draft still equals the blank form, no title or description once trimmed, no category and no card; its negation is what the Save button and the discard prompt rest on — and `newDeckInputOf`, the `addDeck` input for the draft: the trimmed title and description, the `categoryId`, `sourceFileName: null`, and the cards in order with their draft ids dropped and their text untrimmed ([ADR-0011](decisions/0011-deck-editing-is-one-action.md) Amendment 4). `applyDeckEdit(deck, name, description, categoryId, cards)` is the transform behind `updateDeck` — it writes the category id it is given, which the reducer has already resolved; existing cards keep their counters, new ones start at zero, the list's order becomes the deck's — and `reconcileSession` applies the edit to a session: the new `deckName`, and for an active session the removed cards dropped from its unanswered part, which can complete it or, left with no cards and no answers, delete it (`null`). |
| [`categories.ts`](../../src/utils/categories.ts) | The pure side of categories ([ADR-0012](decisions/0012-custom-categories-third-storage-key.md)). The icon keys are plain TypeScript — no `.xml` is imported here, so Jest can load it ([ADR-0013](decisions/0013-category-icons-are-android-vector-drawables.md)). `DEFAULT_CATEGORY_ICONS` are the default categories' icons; `EXTRA_CATEGORY_ICONS` lists the extra icons, which belong to no default category, in the Icon picker's order, the same in every language ([ADR-0013](decisions/0013-category-icons-are-android-vector-drawables.md) Amendment 4); `CATEGORY_ICONS` is the full set a custom category chooses from, the defaults' icons first, then the extras (ADR-0012 Amendment 2, ADR-0013 Amendment 2). Every key is permanent once shipped; a label is not. `getCategoryIconLabel(icon, t)` is a default icon's category name, or an extra icon's label, both catalogue messages (`categoryNames.builtIn.*`, `categoryNames.icons.*`); `categoryDisplayName(category, t)` is what the app shows for a category's name — a built-in's translated name, a custom one's stored name — and a built-in's English `name` in `DEFAULT_CATEGORIES` is never shown directly ([ADR-0012](decisions/0012-custom-categories-third-storage-key.md) Amendment 4). `FALLBACK_CATEGORY_ICON`, typed as a default icon, is the key the loader substitutes for an unknown one, which the New category screen also starts on. `DEFAULT_CATEGORIES` are the built-in categories, alphabetical, each coloured by its position in `categoryPalette`, with `createdAt: 0`. `validateCategoryName(input, customs, t)` is the name rule — trimmed, non-empty, at most `CATEGORY_NAME_MAX_LENGTH`, unique ignoring case across customs and the built-ins' names both in the current language and in English — returning the trimmed name or a reason (`empty`, `tooLong`, `duplicate`). `isCategoryIcon` (over the full set) and `isHexColor` — any `#rgb`, `#rgba`, `#rrggbb` or `#rrggbbaa`, either case — are the loader's checks; `color.ts` has a stricter `isHexColor` of the same name (§8). `sortCategoriesByName(categories, t)` orders by display name ignoring case; the Categories screen uses it for the custom section. `findCategory(id, customs)` resolves a deck's `categoryId` to the default or custom category with that id, or `null` for `null` or an id that matches neither — the one resolution behind `updateDeck` and every screen that shows a category ([ADR-0014](decisions/0014-deck-belongs-to-one-category.md)). `categoryReference(category)` is how a deck file names a category — a built-in's id, never its display name, a custom one's name, `null` for none — and `resolveCategoryReference(reference, customs)` its inverse on import, used only by the reducer's `addDeck` case: the reference trimmed, then a built-in id, a stored custom id, or a stored custom name ignoring case and surrounding whitespace, first in stored order; blank or anything else is `null`, and a built-in is never matched by name ([ADR-0019](decisions/0019-deck-file-format-version-2.md)). `countDecksInCategory(decks, id)` is how many decks a delete detaches. `getAllCategories(customs, t)` (defaults and customs together, sorted by display name) is the Category picker's list. `isDefaultCategoryId` decides which reference `categoryReference` writes and, in `deckImport.ts`, which field of a version 1 category object is read. |
| [`color.ts`](../../src/utils/color.ts) | The colour maths behind the Custom colour dialog ([ADR-0012](decisions/0012-custom-categories-third-storage-key.md) Amendment 3). `Hsv` is a hue in degrees with saturation and brightness from 0 to 1. `hsvToHex` wraps the hue, clamps the rest and always returns an opaque lowercase `#rrggbb`; `hexToHsv` is its inverse, reading a grey as hue 0. `contrastRatio` is the WCAG 2 contrast ratio, and `meetsCategoryContrast(color, background)` is the rule behind **Use colour** — at least `CATEGORY_MIN_CONTRAST`, and false for anything that is not `#rrggbb`, so a malformed colour never passes. `isPaletteColor` compares ignoring case, and is how the Colour picker decides that the Custom colour swatch is the selected one. `hueSpectrumStops`, `saturationStops` and `brightnessStops` are evenly spaced gradient stops for the slider tracks and the Custom colour swatch. Its `isHexColor` accepts only `#rrggbb`, unlike the loader's in `categories.ts` (§8); `hexToHsv` and `contrastRatio` throw `RangeError` on anything else. |
| [`historyChart.ts`](../../src/utils/historyChart.ts) | The geometry of the Deck statistics screen's Session history chart, in dp, so the component only turns it into SVG elements and `Text` ([ADR-0018](decisions/0018-react-native-svg-draws-charts.md), [ADR-0015](decisions/0015-answers-carry-a-timestamp-under-v2-keys.md) Amendment 3). It imports neither `react`, `react-native` nor `react-native-svg`. A `HistoryChartBox` is the svg's width and height and the padding around the plot; `HISTORY_CHART_INSETS` is the padding the chart uses — a left gutter for the y labels and top padding for the badge. `stackHistoryShares` turns each `SessionHistoryEntry`'s shares of its cards into cumulative Ok, Okeish, answered and unanswered tops, clamped to 0-100 and never decreasing, a float sum a hair under 100 snapped to 100, and all 0 for a session with no cards. `historyChartXs` places the sessions at the centres of equal slots across the plot — order, not time — and `percentToY` maps 0-100 onto the plot, clamped. `smoothLinePath` and `smoothAreaPath` join points with one cubic Bézier per segment whose control points both sit at the segment's middle x, so the tangent is horizontal at every session and stacked edges never cross or overshoot; coordinates are rounded to 0.01. `buildHistoryChart(entries, box)` returns everything drawn: the grid lines at `HISTORY_Y_TICKS`, those also in `HISTORY_Y_LABELLED` marked labelled; for two or more sessions one area per band — Ok, Okeish, Not ok, Unanswered — and a top-edge line per answer band, marked visible only when that band is above zero at some session; for exactly one session a single stacked column `HISTORY_COLUMN_WIDTH` wide instead; a marker per session per answer band above zero; a guide per session; and the latest session's badge centre, `HISTORY_BADGE_OFFSET` above its Ok marker and never above `HISTORY_BADGE_MIN_Y`. No entries gives empty geometry and no badge. A non-finite size or share reads as 0, and a box smaller than its padding collapses the plot to nothing rather than inverting it. |

`isSessionActive` is the single definition of "active": `completedAt === null`. Do not write that
comparison anywhere else. `isSessionCleared` is the same for "cleared": `clearedAt !== null`. Only
a completed session can be cleared, so a session is active, completed and listed, or completed and
cleared. `summarizeSessions`, `summarizeSessionsByDeck`, `countSessionsSince` and
`countSessionsByDeckSince` — and so the Statistics screen's Sessions Stat tile and every deck's
session count — count cleared sessions deliberately, and a test pins it
([ADR-0008](decisions/0008-clear-completed-sessions.md)).

The same goes for counting answers. `successRate(ok, okeish, notOk)` credits only Ok, so a card
answered only Okeish is 0%, not `--`. `getSessionTally` is the one three-way count of a session's
results, and `getMissedOrUnsureCardIds` (every card answered Not ok or Okeish, once each, in the
order answered) is where an error review starts. `getReviewableCardIds` keeps those that still
exist in the deck (none when the deck is gone), `getOutstandingReviewCardIds` drops the fixed ones,
and `getReviewState` turns that into *none* (active, or nothing reviewable), *outstanding, n*, or
*done*. The Learn screen's Review badge and the cards a Review pass shows both come from
`getOutstandingReviewCardIds`, so the number on the button is the number of cards a tap reviews —
[ADR-0009](decisions/0009-error-review-marks-cards-fixed.md). `answerShares(tally)` is the display split — each answer's
percentage of all reviews, or `null` when nothing has been reviewed — and is what the Mastery bar
and the Mastery ring draw. `allocateRingSegments(shares, count)` turns that split into whole bars
for the ring: they always add up to `count`, leftovers go by largest remainder, and an answer with
any share gets at least one bar while `count` allows, so a rare answer never vanishes from the ring.
The ring's centre is `successRate`, not the sum of its coloured bars.
`sessionProgressShares(tally, cardCount)` is the same split over a session's cards instead,
so its shares sum to the answered fraction, and is what the Session results bar draws. None of
these is a success rate and none replaces one. Code that computes Not Ok as "everything that is not Ok" silently counts Okeish as
Not Ok — [ADR-0007](decisions/0007-okeish-third-answer.md).

The Statistics screen's figures come from one family over the answer log (§2), each taking a
`since` — a `timeframeStart`, `null` for all time. `getDeckStatsSince(decks, sessions, since)`
makes one pass over the sessions and returns a `DeckStats` for every deck, counting a result only
when its session's deck exists, its card is still in that deck, and its `answeredAt` is at or after
`since`; `cardCount` ignores `since`. `getGlobalStatsSince` sums it, and its `deckCount` and
`cardCount` ignore `since` too. `countSessionsSince` and `countSessionsByDeckSince` put a session in
a window when it started at or after `since` or has any result answered at or after it, and count
how many of those are active; a deck with no session in the window has no entry in the map. With
`since` `null`, `getDeckStatsSince` equals `getDeckStats` and `countSessionsSince` matches
`summarizeSessions` whenever the counters and the log agree —
[ADR-0015](decisions/0015-answers-carry-a-timestamp-under-v2-keys.md).

The Deck statistics screen's derivations are all time and take one deck. `rateBand(rate)` is the
colour band of a success rate — `high` at 70 and above, `mid` from 40, `low` below, `none` for
`null` — and is read by `cardStatus(card)` and by `SuccessBar`'s rate colours, which no screen
shows any more (§3 *components*). `cardStatus(card)` reads the card's
counters: `new` with no reviews, else `mastered`, `learning` or `needsReview` by the band of its
Ok-only rate, so a card answered only Okeish needs review. `countCardStatuses` counts a list of
cards per status. `sortCards(cards, order, lastAnsweredAt)` returns a new array: `hardest` is
`sortCardsByDifficulty`, `deck` the stored order, and `recent` the latest answer first with
never-answered cards last, in deck order. Three read the answer log, over the deck's sessions,
cleared and active ones included: `lastAnsweredAtByCard(deck, sessions)` is each present card's
latest `answeredAt`; `getSessionHistory(sessions, deckId, limit)` is the newest `limit` sessions by
`startedAt`, oldest first, each as a `SessionHistoryEntry` built from the session's own snapshot —
its card count, `getSessionTally`, `sessionProgressShares` and its own success rate — so it counts
answers on cards the deck has since lost; and `rateChangeSinceLastSession(deck, sessions)` is the
deck's success rate over the log, minus the same rate without the session holding the newest
answer, in percentage points, counting only cards still in the deck, and `null` unless at least
two sessions have such answers —
[ADR-0015](decisions/0015-answers-carry-a-timestamp-under-v2-keys.md) Amendment 2.

### `src/types.ts` — the shapes

`Card`, `Deck`, `Answer`, `SessionResult` and `Session` are what is persisted; a `SessionResult` is
`{ cardId, answer, answeredAt }`, `answeredAt` set once when the answer is given
([ADR-0015](decisions/0015-answers-carry-a-timestamp-under-v2-keys.md)), a `Deck` carries
`description` and `categoryId` (a category id, not checked against the categories, or `null`), and
a `Session` carries `clearedAt`, `fixedCardIds` and `inverted` beside its snapshot, and no category. The derived `DeckStats`,
`SessionSummary`, `SessionCount`, `AnswerTally`, `AnswerShares` and `ReviewState` are what
`stats.ts` returns and are never stored, and so are the Deck statistics screen's `RateBand`,
`CardStatus`, `CardSortOrder` and `SessionHistoryEntry`. `Category` (`id`, `name`, `color`, `icon`, `createdAt`) is
the shape of every category, but only a custom one is persisted; `CategoryIcon` is the union of
`DefaultCategoryIcon` (the default categories' icons) and `ExtraCategoryIcon`, which
`CATEGORY_ICONS` in `utils/categories.ts` lists at runtime.

### `src/storage/` — the AsyncStorage boundary

One module per key, each owning `load*`, `save*`, and the normalisation that read applies.
See §5.

### `src/state/` — the store

The store is two files. [`reducer.ts`](../../src/state/reducer.ts) is plain TypeScript with no
React import: the `State` shape, `initialState`, the `Action` union and the `reducer`. It is
tested directly in `__tests__/reducer.test.ts`. [`DecksContext.tsx`](../../src/state/DecksContext.tsx)
holds the rest: the `DecksProvider` with the load and save effects, the `createId` helper, the
functions on `DecksContextValue`, and the `useDecks()` hook that throws if used outside the
provider. `recordAnswer` is guarded by `canRecordAnswer` and appends
`{ cardId, answer, answeredAt }` with the action's `at`; `deleteSession` withdraws the deleted
session's results from its deck's counters through `withdrawAnswers`, a private helper in
`reducer.ts` (§2). The two clear actions,
`replaySession` and `recordReviewAnswer` delegate to `clearCompletedSessionsAt`, `clearSessionAt`,
`prependSessionClearing` and `applyReviewAnswer` — all in `stats.ts`. One private `createSession`
helper in `DecksContext.tsx` builds the session for both `startSession` and `replaySession`, with
`clearedAt: null`, `fixedCardIds: []` and the `inverted` it is given. `addDeck` builds the deck
from an import or from the New deck screen — fresh ids, zero counters, and the `description` and
requested `categoryId` it is given — dispatches it once and returns it; the reducer's `addDeck` case resolves the request
with `resolveCategoryReference`, so it may be an id or a file's category reference, and stores `null` for one that does not resolve, so the returned deck carries
the *requested* value and a caller that needs the stored category reads the deck from the store
([ADR-0003](decisions/0003-single-context-reducer-store.md) Amendments 4 and 6). It is not idempotent:
each call mints new ids, so a second call with the same input is a second deck, and a caller that
can fire twice guards itself (ADR-0003 Amendment 5). `addCategory` and `deleteCategory` are the two category actions, and
`deleteCategory` also detaches the category from every deck that uses it; `updateDeck` resolves the
edit's `categoryId` against `state.categories` with `findCategory` (see §2), by id only. `State.categories`
holds custom categories only.
[ADR-0003](decisions/0003-single-context-reducer-store.md) keeps it the only store.

### `src/services/` — the device boundary

| File | Role |
|---|---|
| [`importDeck.ts`](../../src/services/importDeck.ts) | `pickAndParseDeck()` — opens the system picker with one MIME list, the union of both formats' types (`text/csv`, `text/comma-separated-values`, `text/tab-separated-values`, `text/plain`, `application/json`, ending in `*/*` so any file stays pickable), copies the chosen file into the app cache with `keepLocalCopy` and does not delete the copy, reads it as UTF-8, and parses it as the format `detectDeckFormat` finds in its content, never by name or MIME type — `parseFlashcardsCsv` or `parseDeckJson` ([ADR-0017](decisions/0017-deck-import-reads-exported-formats.md) Amendment 1). Returns `ImportedFile`: the detected `format`, `deckName` (the file's title, CSV or JSON, else `deckNameFromFileName`, else `null`, and the Decks screen then uses the catalogue's `importExport.defaultDeckName`), `fileName`, `description` (`''` when the file has none), the unresolved `categoryRef` from either file, `cards` and `skipped`; the Decks screen passes `categoryRef` to `addDeck` as its `categoryId`. Throws `ImportCancelledError` when the user backs out, and `DeckImportError` when the copy fails or the parser rejects the file ([ADR-0017](decisions/0017-deck-import-reads-exported-formats.md)). |
| [`exportSampleDeck.ts`](../../src/services/exportSampleDeck.ts) | `exportSampleDeck()` — saves `SAMPLE_DECK` with `SAMPLE_DECK_CATEGORY` once per entry of `SAMPLE_DECK_EXPORTS`, each through `exportDeck`, awaiting one save dialog before opening the next: on Android `saveDocuments` saves one file per call and refuses a second call while one is open. A cancel (`ExportCancelledError`) or an error on one file is caught and recorded, and does not stop the next. Never throws for either; returns one `SampleDeckExportOutcome` per file, in order, carrying the format and the suggested name from `exportFileName` ([ADR-0016](decisions/0016-deck-export-file-formats.md) Amendment 3). |
| [`exportDeck.ts`](../../src/services/exportDeck.ts) | `exportDeck(deck, category, options)` — writes `serializeDeck`'s text to the cache under the fixed name `easy-flashcards-export.json` or `.csv`, never the deck's title, so user text never reaches a path; opens the system save dialog through `saveDocuments` with the format's MIME type and `exportFileName` as the suggested name; and returns the name the file was saved as. Defines `ExportCancelledError` and throws it on cancel, throws an `Error` when the provider reports one, and deletes the cache file afterwards either way ([ADR-0016](decisions/0016-deck-export-file-formats.md)). Called by the Decks screen's Export to file and, once per file, by `exportSampleDeck`. |
| [`deviceLocale.ts`](../../src/services/deviceLocale.ts) | `getDeviceLocaleTag()` — the device's language as a normalised BCP 47 tag, read from `Intl.DateTimeFormat().resolvedOptions().locale`, else from `I18nManager.getConstants().localeIdentifier`, else `null`; each read is wrapped so it never throws. The only file that reads a device API for the language ([ADR-0020](decisions/0020-ui-text-translated-through-typed-catalogue.md) and its Amendment 1). Called once, by `I18nProvider`. `keepLayoutLeftToRight()` — calls `I18nManager.allowRTL(false)` and `forceRTL(false)` so a right-to-left device language does not mirror the layout; Android applies it from the next launch, not the current one (ADR-0020 Amendment 3, §8). Called once, by `index.js`. |

A cancelled picker or save dialog is a normal outcome, not an error, which is why the import has
`ImportCancelledError` and the export `ExportCancelledError`, defined in `exportDeck.ts`. The Decks
screen catches it and shows nothing; `exportSampleDeck` catches it per file and records that file
as cancelled.

### `src/locales/` — the UI text catalogue

Every user-facing text the app shows, as plain TypeScript with no React import, governed by
[ADR-0020](decisions/0020-ui-text-translated-through-typed-catalogue.md) and its Amendment 1.
[`en/`](../../src/locales/en/) is English, the source of every key: one file per area, each one
`as const` object named after the file, gathered by `en/index.ts` into `en` with
`englishPlural`. `common.ts` holds what several areas show (`actions`, `search`, `counts`);
`navigation` the tab and header titles; `answers`, `importExport` and `categoryNames` the text of
shared pure code — answer labels, card statuses, timeframes, dates, import errors, separators,
built-in category names and icon labels; the rest are one per screen area. [`index.ts`](../../src/locales/index.ts)
is the registry: `ENGLISH`, `PSEUDO` (`en-XA`, built from English by `pseudoLocalizeCatalogue`),
`LANGUAGES`, `englishT` (the English translator tests and fallbacks use) and
`translatorForTag(tag)`, which resolves a device tag against `LANGUAGES` and falls back to
English. A language is one module typed as the full `Catalogue`, with its own plural rule, plus
its entry in `LANGUAGES`. Each translation is one such file beside `en/`, named by its language
code, holding its catalogue and its hand-written plural rule; which exist, and in what order, is
`LANGUAGES`. The one exception to the naming is Simplified Chinese, registered as `zh-CN` in
`zhHans.ts`; Traditional Chinese tags fall back to English (ADR-0020 Amendment 3). A right-to-left
translation is shown in the same left-to-right layout (§8). They are machine-written and unreviewed (§8). `__tests__/locales.test.ts` checks every registered language against
English.

### `src/i18n/` — the language context

[`I18nProvider.tsx`](../../src/i18n/I18nProvider.tsx) holds `I18nProvider`, which reads the
device tag once, on mount, through `getDeviceLocaleTag` and keeps the `Translator` from
`translatorForTag`, and `useT()`, which returns it — or `englishT` when no provider is mounted. It
is read-only configuration, not a store: no reducer, no actions, nothing persisted
([ADR-0003](decisions/0003-single-context-reducer-store.md) Amendment 8). Screens and components
call `useT()`; pure code takes the `Translator` as a parameter and never imports one.

### `src/screens/` — the stateful half

One file per screen. Each calls `useDecks()` and `useNavigation()`, derives what it needs with
`stats.ts` inside a `useMemo`, and renders a `FlatList` of components. Some also hold local UI
state, which is neither in the store nor persisted. `DecksScreen`, `LearnScreen` and `StatsScreen`
each hold whether the Search bar is open and the query, and filter their list with `filterByTitle`
in a `useMemo`; closing the bar clears the query. The Decks and Statistics screens match on the
deck's `name`; the Learn screen matches on the session's `deckName` snapshot and searches only
`listedSessions`, so a cleared session never appears; the Statistics screen filters only its Deck
stats cards, and its Aggregated stats still cover every deck. `StatsScreen` also holds the selected
`Timeframe`, starting at `'all'` and never stored. One `useMemo` over the timeframe, `decks` and
`sessions` takes `timeframeStart(timeframe, Date.now())` and derives `getGlobalStatsSince` and its
`answerShares`, `countSessionsSince`, `getDeckStatsSince` and `countSessionsByDeckSince`; the
window is cut from the clock only there, so it moves only when the selection or the data changes.
Others derive `summarizeSessionsByDeck` over all time, for each Deck stats card's `Last`, and for
each visible deck its windowed stats, their `answerShares`, its windowed session count and its
category through `findCategory`. The screen renders `TimeframeChips` above its `FlatList`, and only
when a deck exists. `DeckStatsScreen` holds the Card search field's query, the selected Card status
chip (`'all'` or a `CardStatus`, starting at `'all'`), the `CardSortOrder` (starting at
`'hardest'`) and whether the Card sort menu is open — all local, never stored, and gone when the
screen is left. One `useMemo` over the deck and `sessions` derives `getDeckStats` and its
`answerShares`, `summarizeSessions` of the deck's sessions, `rateChangeSinceLastSession`,
`getSessionHistory` cut to `SESSION_HISTORY_LIMIT` (five, exported by `SessionHistoryChart`),
`lastAnsweredAtByCard` and `countCardStatuses`; a second, over that and the three choices, applies
`sortCards`, keeps the cards whose `cardStatus` is the selected one, then `filterByTitle` with
`cardSearchText`, so the chips' counts ignore the query. Its header — the identity row, the two
cards and the section's controls — is an element passed as `ListHeaderComponent`, not a component
type, so the search input keeps its focus across keystrokes. It resolves the deck's category with
`findCategory`, sets the Deck statistics menu as `headerRight`, whose **Reset statistics** asks
before calling `resetDeckStats`, and shows one of three empty states under the header: no cards,
a selected status with no cards (**Show all cards**), or no match for the query (**Clear
search**). A deck deleted while the screen is open shows *Deck not found*. `DecksScreen` also holds import-in-flight, for the Add deck button's spinner —
an import calls `pickAndParseDeck()` with no format, then `addDeck`, and shows a `Deck
imported` alert with the card count and any skipped rows (CSV) or cards (JSON), by the detected
`format` the service returns, an `Import failed`
alert with the error's message, or nothing on a cancelled picker —
which menu is open (`'add'` or `null`: the Add deck menu is the only one), and the Session setup dialog's deck, visibility, and **Inverted** and
**Shuffle** choices, which reset to **Inverted** unticked and **Shuffle** ticked each time the
dialog opens, and resolves each deck's
category with `findCategory` as it renders the Deck card. The Add deck menu's **Add deck
manually** only navigates to the `NewDeck` route; the Decks screen holds nothing for it. For an export it holds the deck's id —
kept after the menus close, so the Custom separator dialog keeps its title — which export menu is
open, the Export format menu or the CSV separator menu, whether the Custom separator dialog is open
and the separator typed into it, emptied each time it opens, and export-in-flight twice: as state,
for the dialog's spinner, and as a ref, which is the guard against a second export, because the
state is stale until the next render. It derives `validateCustomSeparator` of the typed separator
in a `useMemo` for the dialog's message, and when an export starts it reads the deck again by id —
one deleted since its menu opened gets an `Export failed` alert — and resolves its category with
`findCategory` before calling `exportDeck`. A saved file gets a `Deck exported` alert naming it, a
cancelled save dialog shows nothing, and a failure an `Export failed` alert with the error's
message; the Custom separator dialog closes by itself only when the file is saved or the deck is
gone, and ignores Cancel while
the export runs. A JSON or preset-separator export shows nothing in flight: the menu closes before
the save dialog opens. `LearnScreen` derives each listed
session's `getReviewState` in a `useMemo`, and in another each session's category, through its deck
(none when the deck is gone). `StudyScreen` holds the flip, the viewed card
index, and which card's answer has been revealed, and in review mode the current pass: a snapshot
of the outstanding card ids taken when the pass starts, the pass's own answers, and a pass number.
Its frontier is the length of whichever results apply — `session.results` in a session, the pass's
answers in review mode — and it resets all of that local state when `(sessionId, mode)` changes,
because a navigation to the mounted Study route updates its params rather than remounting it.
`EditDeckScreen` renders two routes: `EditDeck`, which looks its deck up by id and shows *Deck not
found* when it is gone, and `NewDeck`, the New deck screen, which has no deck
([ADR-0011](decisions/0011-deck-editing-is-one-action.md) Amendment 4). Either way it holds the
draft of one deck — title, description, a category id and a list of card
drafts, each with a key that is stable while editing — initialised once from the stored deck, or
blank with no cards and the title field focused for a new deck, and
whether the Category picker is open. It resolves both the draft's category id and the deck's stored
one with `findCategory`, so a category deleted elsewhere mid-edit, or a stored id that resolves to
nothing, reads as no category and does not by itself count as a change; it derives whether anything
changed with `isDeckEditChanged` against the deck with its resolved category, or for a new deck as
the negation of `isNewDeckDraftBlank`, passes the picker
`getAllCategories`, and intercepts leaving with the navigator's `beforeRemove` event until the draft
is saved. A new deck's **Save** validates as an edit's does, then calls
`addDeck(newDeckInputOf(draft))` and goes back; it never shows the *Remove cards?* prompt. A `saved`
ref, set before the first commit in either mode, both ends the discard prompt and makes a repeated
**Save** on a new deck a no-op, since `addDeck` would mint a second deck
([ADR-0003](decisions/0003-single-context-reducer-store.md) Amendment 5). `CategoriesScreen` sorts the stored custom categories
with `sortCategoriesByName` in a `useMemo`, renders `DEFAULT_CATEGORIES` as they are, holds which
category the Category options menu is for and whether it is open, and counts the decks a delete
will detach with `countDecksInCategory` when the confirmation opens. `NewCategoryScreen` holds the
draft — name, colour (the first palette colour to start) and icon (`FALLBACK_CATEGORY_ICON` to
start) — whether the name has been typed in yet, and whether the Custom colour dialog is open. It
derives `validateCategoryName` in a `useMemo`, and intercepts leaving with `beforeRemove` while the
draft differs from that starting state and is unsaved. It passes the Colour picker
`categoryPalette`; the Custom colour swatch opens the dialog at the draft colour, **Use colour**
sets the draft colour and closes it, and Cancel only closes it. Because `FormField` takes no `maxLength`, error or `onBlur`, the screen cuts the typed
name to `CATEGORY_NAME_MAX_LENGTH` itself and renders its own helper line — the error, once the
name has been typed in, and a character count.

### `src/components/` — the stateless half

| File | Role |
|---|---|
| [`Button.tsx`](../../src/components/Button.tsx) | The only button. Variants `primary`, `secondary`, `success`, `danger`, `warning`; handles `disabled` and `loading`. Takes an optional `icon` render function, passed the foreground colour for the variant; with no `label` it is icon-only, and its type then requires an `accessibilityLabel`. |
| [`FlipCard.tsx`](../../src/components/FlipCard.tsx) | The study card. Two faces, a `rotateY` interpolation, and a scrollable body. Owns the animation, not the flip state. Takes `front` and `back` — roles, not card fields: the Study screen fills them from `cardFaces`, so in an inverted session `front` is the card's answer. The `QUESTION` / `ANSWER` side labels stay positional. |
| [`RichText.tsx`](../../src/components/RichText.tsx) | Renders `parseHtml` output as nested `<Text>`. See §6. |
| [`SuccessBar.tsx`](../../src/components/SuccessBar.tsx) | A horizontal bar, rendered only as the Study screen's session progress bar, with a fixed `color` (`colors.text`) because that bar is not a success rate. Without `color` its fill is `rateBand` of the rate (grey for `null`, red, amber, green), the same bands a card's status is read from; no caller uses that path since the Session summary moved to a `SessionResultsBar`. The Decks screen shows a `MasteryBar`, the Learn screen and the Study screen's summaries a `SessionResultsBar`, the Statistics screen a `MasteryRing` and a `MasteryBar` per deck, and the Deck statistics screen `MasteryTrack`s instead. |
| [`MasteryTrack.tsx`](../../src/components/MasteryTrack.tsx) | The segmented Ok / Okeish / Not ok track on its own: one segment per answer with a non-zero share of `answerShares`, sized by that share, with a 4-point minimum; an empty track for `null`. An optional `height`. Draws no text and carries no accessibility label — whatever holds it says the numbers. Exports `ANSWER_SEGMENTS`, each answer's key, `AnswerIcon` glyph and colour in Ok, Okeish, Not ok order, which every answer legend and tile iterates. Used by `MasteryBar`, `DeckMasteryCard` and `CardStatsRow`. |
| [`MasteryBar.tsx`](../../src/components/MasteryBar.tsx) | The Ok / Okeish / Not ok split of a deck's reviews: a `MasteryTrack` plus a legend giving each answer's `AnswerIcon` (tick, question mark, cross, in the answer's colour) followed by its percentage. Takes the output of `answerShares`; with `null` it draws an empty track, grey icons, and `--` for each share. The panel carries one accessibility label, `describeAnswerShares` of the shares. Used in the Deck card and the Deck stats card. |
| [`MasteryRing.tsx`](../../src/components/MasteryRing.tsx) | The **Mastery ring** in the Statistics screen's Aggregated stats card: a ring of short bars drawn from `View`s, coloured Ok / Okeish / Not ok by `allocateRingSegments` over the output of `answerShares` and grey for the rest, with the Ok-only success rate (`formatRate`) and `Success rate` in its centre ([ADR-0007](decisions/0007-okeish-third-answer.md)). Under it, a legend of one row per answer: its `AnswerIcon`, its share and its raw count from the `AnswerTally` it is given; the icons are grey while nothing is reviewed. Draws no panel of its own, and carries one accessibility label with the rate, the shares and the counts. |
| [`DeckCard.tsx`](../../src/components/DeckCard.tsx) | One deck on the Decks screen: a header with the **Category square** when given a `category` (no square and no gap otherwise), the name, card count and the **Deck options menu** (a `KebabMenu`), a `MasteryBar`, and a footer with the session counts, the last-session date and the **Start session button**. Takes display-ready values and callbacks; derives nothing. |
| [`DeckStatsCard.tsx`](../../src/components/DeckStatsCard.tsx) | One **Deck stats card** in the Statistics screen's Decks breakdown: a header with the **Category square** when given a `category` (no square and no gap otherwise — [ADR-0014](decisions/0014-deck-belongs-to-one-category.md) Amendment 2), the name and a chevron, a `MasteryBar`, and an inset row of four figures — `Cards`, `Sessions`, `Reviews` and `Last` (`formatDate`). Each figure shrinks to fit its column rather than truncating, inside a line box sized to the font scale so the columns stay aligned. The whole card is one pressable that opens the Deck statistics screen through `onPress`, labelled with the name, `describeAnswerShares` and every figure. Takes display-ready values and callbacks; derives nothing. |
| [`TimeframeChips.tsx`](../../src/components/TimeframeChips.tsx) | The **Timeframe chips** at the top of the Statistics screen: a radio group of one pill per `TIMEFRAMES` entry, in a row that wraps rather than scrolls. Controlled — the screen owns the selected `Timeframe` and passes `value` and `onChange`; the chips derive nothing and store nothing ([ADR-0015](decisions/0015-answers-carry-a-timestamp-under-v2-keys.md)). |
| [`DeckIdentityRow.tsx`](../../src/components/DeckIdentityRow.tsx) | The Deck statistics screen's **Deck identity row**: a wrapping row of neutral pills — the **Card count pill** and, when given a `category` the screen has already resolved, the **Category pill**, a 24-point `CategorySquare` before the category's name on one truncated line, labelled `Category: {name}`. No Category pill and no gap for `null` ([ADR-0014](decisions/0014-deck-belongs-to-one-category.md) Amendment 6). Not pressable. |
| [`DeckMasteryCard.tsx`](../../src/components/DeckMasteryCard.tsx) | The **Overall mastery card**: the **Success rate headline** (`formatRate`, `--` with no reviews), the **Mastery change chip** — `+{n} pts` / `-{n} pts since last session` or `No change since last session`, tinted success, danger or neutral, and absent when `rateChange` is `null` — a `MasteryTrack`, three **Answer tiles** (an `AnswerIcon`, the raw count and the share, per `ANSWER_SEGMENTS`), and the **Figures ribbon**: `Reviews`, `Sessions` and `Last session` (`formatShortDate`). Takes the figures ready-made; rounds the change to whole points for display and derives nothing else. |
| [`SessionHistoryChart.tsx`](../../src/components/SessionHistoryChart.tsx) | The **Session history card**: a title, a subtitle (`{n} session(s)`, or `Latest {shown} of {n}`), the **Chart legend** — the three `AnswerIcon`s, an `Unanswered` swatch only when a shown session has unanswered cards, and `% of each session's cards` — and the **Session history chart**. The only file that imports `react-native-svg` ([ADR-0018](decisions/0018-react-native-svg-draws-charts.md)). It measures its width with `onLayout`, reserving the plot's height until then, and draws `buildHistoryChart`'s geometry at that width: the dashed grid; the **Answer bands** filled with vertical `LinearGradient`s of each answer's `ANSWER_SEGMENTS` colour and the **Unanswered band** flat `surfaceAlt`; the dashed Session guides, the latest one neutral and heavier; each **Band line** over its shadow, a wider translucent `colors.background` stroke offset one point down — no SVG filters; and the **Session markers**, the latest session's larger and filled. One session is a single stacked column. The Y axis labels and the **Latest session badge** (a tick and the latest session's Ok count) are React Native `Text` positioned over the svg, never SVG text; the legend and the whole plot are hidden from accessibility. Under the plot, one **Session label** per session — short date over rate — in flex slots padded to the plot's insets so each sits under its marker, each the one accessible element for its session, labelled with its date, rate and tally. With no entries it shows its own inline empty state. Exports `SESSION_HISTORY_LIMIT` (five); the caller cuts the entries to it. |
| [`CardSearchField.tsx`](../../src/components/CardSearchField.tsx) | The **Card search field**: an always-shown field with the `search` glyph, a `TextInput` labelled `Search cards` (not auto-focused, auto-correct and auto-capitalise off) and, while the value is non-empty, a clear button labelled `Clear card search`. Controlled — `value`, `onChangeText`, `onClear`. Not the `SearchBar`, which a Search button opens and closes. |
| [`CardStatusChips.tsx`](../../src/components/CardStatusChips.tsx) | The **Card status chips**: a wrapping radio group labelled `Card status` — `All`, `Needs review`, `Learning`, `Mastered`, `New`, each with its count in brackets, in the Timeframe chips' pattern. Controlled; takes the per-status `counts` and the `total`. Exports `CardStatusFilter` (`'all'` or a `CardStatus`); the status labels are the catalogue's `answers.cardStatus.*`, which `CardStatsRow` and the screen's empty states read too. |
| [`CardStatsRow.tsx`](../../src/components/CardStatsRow.tsx) | One **Card stats row**: the question and the answer as `RichText` clamped to two lines, the **Card status badge** (a tinted pill with a status glyph — tick, question mark or cross — or none for `New`, hidden from accessibility), an 8-point `MasteryTrack`, and a footer of each answer's share with `{n} reviews · Reviewed {short date}` or `Never reviewed`. Takes the `Card` and its `lastAnsweredAt` from the screen, and derives the rest from the card's counters itself — `successRate`, `answerShares`, `cardStatus` — plus `htmlToPlainText` of both sides, memoised, for its one accessibility label. `React.memo`'d. |
| [`HeaderToolbar.tsx`](../../src/components/HeaderToolbar.tsx) | The `headerRight` of the Decks, Learn and Statistics screens: the **Search button**, then the `AppMenu` in its `boxed` variant. `searchActive` tints the Search button and marks it expanded while the Search bar is open. Takes optional `menuItems` that it passes to `AppMenu` as `extraItems`. The Search button only calls the callback it is given. It was `DecksToolbar` until the Learn screen used it. |
| [`SearchBar.tsx`](../../src/components/SearchBar.tsx) | The **Search bar**: a search glyph, an auto-focused `TextInput`, and the **Close search button**. Controlled — the screen owns the query and whether the bar is shown, and passes `value`, `onChangeText`, `onClose` and the placeholder. |
| [`SessionCard.tsx`](../../src/components/SessionCard.tsx) | One session on the Learn screen: a header with the **Category square** when given a `category` (no square and no gap otherwise), the deck name, the **Session status pill**, the neutral **Inverted pill** when `inverted` is set, and the **Session options menu** (a `KebabMenu`), a `SessionResultsBar`, and a footer with the start date and the icon-only **Resume**, **Review errors** and **Replay** buttons. Resume shows only on an active session and only when `onResume` is given; on a completed one, the Review errors button shows only when a `review` prop (`{ count, done, onPress }`) is given and the Replay button only when `onReplay` is. The Review errors button is a `ReviewErrorsButton`, given the `review` prop's count and `done`, with an accessibility label built here that states the count or that every card is fixed. The pills wrap, so the Inverted pill drops below the status pill on a narrow card. Takes display-ready values and callbacks; derives nothing. |
| [`ReviewErrorsButton.tsx`](../../src/components/ReviewErrorsButton.tsx) | The **Review errors button**: an icon-only `warning` `Button` with the `replay` glyph, and the **Review badge** on its top-right corner — a sibling of the button rather than its child, so a disabled button's dimming does not fade it, and hidden from accessibility — showing `count` (capped at `99+`), or a tick `AnswerIcon` with the button disabled when `done`. Takes `count`, optional `done`, `accessibilityLabel` and `onPress`; the caller writes the label. Used in the Session card's footer and as the review **Summary button** of the Study screen's Session summary and Review summary, which never pass `done`. |
| [`SessionSetupDialog.tsx`](../../src/components/SessionSetupDialog.tsx) | The **Session setup dialog**: a centred `Modal` with the deck name, two independent checkbox rows — **Inverted** and **Shuffle** — and **Start** / **Cancel**. Controlled: the Decks screen owns the visibility and both choices, and starts the session in `onStart`. The backdrop and Back cancel. |
| [`CustomSeparatorDialog.tsx`](../../src/components/CustomSeparatorDialog.tsx) | The **Custom separator dialog**: a centred `Modal` titled `Custom separator` over the deck name, with the **Separator field** (an auto-focused `FormField`), the **Separator message** and **Export** / **Cancel**. Controlled, and it validates nothing: the Decks screen owns the visibility, the value and the export, and passes the `SeparatorError` from `validateCustomSeparator` or `null`. The dialog maps a reason to its message — muted for `empty`, which is a prompt, red for the rest — and keeps the line rendered when there is none so the buttons do not move. Export is disabled while there is a reason and shows `Button`'s spinner while `exporting`. Wrapped in a `KeyboardAvoidingView`, because the keyboard overlays the window rather than resizing it. Cancel, the backdrop and Back call `onCancel`; the caller closes it ([ADR-0016](decisions/0016-deck-export-file-formats.md)). |
| [`SessionResultsBar.tsx`](../../src/components/SessionResultsBar.tsx) | A session's answered part: a segmented track whose Ok / Okeish / Not ok segments are each sized by their share of the session's cards, so the unfilled remainder is the unanswered part, plus a legend giving each answer's `AnswerIcon` and count, the icons grey while nothing is answered. Takes the output of `sessionProgressShares`, the tally and the card count. The panel carries one accessibility label. Not a success rate. Used in the Session card and on the Study screen's Session summary and Review summary. |
| [`HistoryStrip.tsx`](../../src/components/HistoryStrip.tsx) | The answered-so-far tiles on the Study screen, coloured per answer — in review mode, the pass's answers; auto-scrolls to the current card. |
| [`EmptyState.tsx`](../../src/components/EmptyState.tsx) | Every list's `ListEmptyComponent`. |
| [`FormField.tsx`](../../src/components/FormField.tsx) | A labelled `TextInput`, single- or multi-line. Controlled; takes an optional `accessibilityLabel` that replaces the visible label as the accessible name. |
| [`CardEditor.tsx`](../../src/components/CardEditor.tsx) | One card on the Edit deck and New deck screens: a `Card {n}` header with a **Remove card button**, and a **Question** and an **Answer** `FormField`. `React.memo`'d, and takes `cardKey`-addressed callbacks so a keystroke re-renders only the card being typed in. |
| [`KebabMenu.tsx`](../../src/components/KebabMenu.tsx) | The three-dot control; opens a `MenuSheet`. Owns the open/closed state. An optional `variant="boxed"` draws the trigger as a bordered rounded square, matching the Header toolbar's buttons; the default is `plain`. Passes its optional `title` and `category` through to the sheet. |
| [`MenuSheet.tsx`](../../src/components/MenuSheet.tsx) | The bottom sheet, in a `Modal`. Defines the shared `MenuItem` type. An optional `title` heads the sheet above a separator; with an optional `category` as well, a 28-point `CategorySquare` sits before the title on the same row (no square and no gap without one; a category without a title shows nothing). Only the Deck card's and Session card's `KebabMenu`s pass a category. A `MenuItem` may set `selected` for a menu that marks a choice: the row's label fills the line, a selected one is in `colors.primary` with a trailing tick `AnswerIcon`, and the state is in `accessibilityState`; an item that leaves it unset is drawn as before. Only the Card sort menu sets it. |
| [`MenuIcons.tsx`](../../src/components/MenuIcons.tsx) | `MenuIcon` — every menu icon, drawn from nested `View`s on a 20-point grid. Also carries glyphs used outside menus: `search` in the Header toolbar, `search` and `close` in the Search bar, `close` on the Category picker's No category choice, `clock` in the Deck card and Session card footers, `replay` on the Review errors button (`ReviewErrorsButton`), the Session card's Replay button and the Session summary's Study the whole deck again Summary button, `back`, a left-pointing arrow, on the Session summary's and Review summary's Back to sessions Summary button, `play` and `resume` on the Start session and Resume buttons, `delete` on the Edit deck screen's Remove card button, and `file`, `tally` and `clock` on the Statistics screen's Stat tiles — `tally`, four strokes struck through, exists only for the `Total reviews` tile — and on the Deck statistics screen `search` and `close` in the Card search field and `sort`, an up arrow beside a down arrow, on the Sort button. An optional `size` scales the grid about its centre. |
| [`AnswerIcons.tsx`](../../src/components/AnswerIcons.tsx) | `AnswerIcon` — the tick, cross and question-mark glyphs for Ok, Not Ok and Okeish, drawn from rotated `View`s. Used on the Study screen's answer buttons, in the `MasteryBar`, `MasteryRing` and `SessionResultsBar` legends, as the tick in a completed session's status pill, as the Review badge's done tick, as the Review summary's all-fixed tick, as the tick in a ticked Session setup dialog checkbox, and as the tick on a selected Colour picker swatch (on a light disc on the Custom colour swatch) and a selected Category picker tile. Hidden from accessibility; the containing button or panel carries the name. |
| [`AppMenu.tsx`](../../src/components/AppMenu.tsx) | The header kebab menu. The one component that calls a service. Passes an optional `variant` through to its `KebabMenu`, and takes optional `extraItems` — screen-specific `MenuItem`s shown before Export sample deck and Settings — so a screen can add an item without `AppMenu` reading the store. **Export sample deck** opens the **Export sample deck dialog**, which says the sample is saved as two files, CSV and JSON, with a save dialog for each that can be cancelled to skip it, and describes both formats. Its **Export** button shows a spinner while `exportSampleDeck` runs and then the alert `describeSampleDeckExport` builds; the dialog closes when at least one file was saved, stays open after a failure with nothing saved, and stays open with no alert when both were cancelled. |
| [`CategoryIcon.tsx`](../../src/components/CategoryIcon.tsx) | A **Category icon**: an `Image` of the Android vector drawable for an icon key, tinted with `tintColor`, at an explicit `size` (default 24) because a drawable has no intrinsic size. Holds the one `require` map from icon key to `.xml` file — the defaults' icons and the extras alike — typed as a `Record` over `CategoryIcon`, so a key with no drawable entry fails `npm run typecheck`; typecheck does not see the `require` path, so a path naming a missing file fails only when Metro bundles ([ADR-0013](decisions/0013-category-icons-are-android-vector-drawables.md) Amendment 2). Hidden from accessibility. The only icon not drawn from `View`s — [ADR-0013](decisions/0013-category-icons-are-android-vector-drawables.md). |
| [`CategoryTile.tsx`](../../src/components/CategoryTile.tsx) | A **Category tile**: a square filled with the category's colour, its `CategoryIcon` tinted `colors.background` on top ([ADR-0013](decisions/0013-category-icons-are-android-vector-drawables.md) Amendment 1), and the name beneath in two lines at most. Fills the width its parent gives it. Pressable only when `onPress` is given; `nameDimmed` greys the name for the New category screen's placeholder. `selected` makes a pressable tile a radio, ringed and ticked when true, as the Category picker uses it; `none` draws the **No category choice** instead — a dashed square with a `close` `MenuIcon` and no category colour or icon. |
| [`CategorySquare.tsx`](../../src/components/CategorySquare.tsx) | A **Category square**: a small rounded square (32 points by default, or the optional `size`) in the category's colour with its `CategoryIcon` tinted `colors.background`. Shown on the Deck card, the Session card, the Deck stats card and in the Category field, at 28 points before the title of the Deck options menu and Session options menu sheets, and at 24 points in the Deck statistics screen's Category pill; an image for accessibility, labelled with the category's name, with no press behaviour. |
| [`CategoryField.tsx`](../../src/components/CategoryField.tsx) | The **Category field** on the Edit deck and New deck screens: a labelled row in `FormField`'s style with the `CategorySquare` and name, or a dimmed `No category`, and a chevron. A button that only calls `onPress`; the screen holds the draft and opens the picker. |
| [`CategoryPicker.tsx`](../../src/components/CategoryPicker.tsx) | The **Category picker**: a centred `Modal` with a scrolling three-column radio grid of `CategoryTile`s — the No category choice first, then the `categories` it is given — and a Cancel button. Picking calls `onSelect` then `onClose`; the backdrop, Back and Cancel close it unchanged. Controlled. |
| [`CategoryColorPicker.tsx`](../../src/components/CategoryColorPicker.tsx) | The **Colour picker**: a radio group of one swatch per colour of the `palette` prop, then the **Custom colour swatch**, six to a row. It measures its own width and sizes the boxes to share it exactly, up to a maximum size, laying them out in explicit rows with one gap used both between boxes and between rows. A palette swatch is selected when it equals `value` ignoring case; the Custom colour swatch — a hue-spectrum gradient from `hueSpectrumStops`, not a colour of its own — is selected when `value` is not a palette colour (`isPaletteColor`). The selected box is bordered and carries a tick `AnswerIcon`, on a light disc on the Custom colour swatch. Pressing the Custom colour swatch only calls `onCustomPress`; the screen opens the dialog ([ADR-0012](decisions/0012-custom-categories-third-storage-key.md) Amendment 3). Controlled. |
| [`CustomColorDialog.tsx`](../../src/components/CustomColorDialog.tsx) | The **Custom colour dialog**: a centred `Modal` titled `Custom colour`, with a **Hue**, a **Saturation** and a **Brightness** `ColorSlider` and the **Colour preview** in a scroll view, then **Use colour** and **Cancel**. Holds the draft as an `Hsv`, reset from the `color` prop each time it opens, and derives the hex with `hsvToHex`, the saturation and brightness tracks with `saturationStops` and `brightnessStops`, and readability with `meetsCategoryContrast` against `colors.background`. While the draft is not readable, **Use colour** is disabled and a message replaces the hex beside the preview; otherwise it calls `onUse` with the lowercase `#rrggbb`. Cancel, the backdrop and Back call `onCancel`; the caller closes the dialog either way. The scroll view stops scrolling while a slider is held ([ADR-0012](decisions/0012-custom-categories-third-storage-key.md) Amendment 3). |
| [`ColorSlider.tsx`](../../src/components/ColorSlider.tsx) | One slider of the Custom colour dialog: a label and value line above a track painted with the `stops` it is given, and a thumb. It is one `adjustable` element carrying the name and value; a drag moves it through the responder system and refuses to hand the gesture to the scroll view, reporting `onSlidingChange` from touch down until release, and TalkBack's increment and decrement move it by `step`. Controlled. Also exports `linearGradient`, which builds the CSS gradient string that the track and the Custom colour swatch pass to the `backgroundImage` style. |
| [`CategoryIconPicker.tsx`](../../src/components/CategoryIconPicker.tsx) | The **Icon picker**: a radio group of every `CATEGORY_ICONS` key as a `CategoryIcon`, in `CATEGORY_ICONS` order, in a plain wrapping grid six to a row — not virtualised and not scrolling on its own, so it grows the New category screen's scroll view. Each option's accessibility label is `getCategoryIconLabel`. Controlled. |

`AppMenu` is the exception to "components take plain props": it calls `exportSampleDeck` directly
because it has no screen to belong to — the Decks, Learn and Statistics screens mount it inside
`HeaderToolbar`, and the Categories screen mounts it directly (see §4).
`HeaderToolbar` therefore reaches a service too, but only through `AppMenu`. The Learn screen passes **Clear
completed sessions** to `HeaderToolbar` as a `menuItems` entry, which reaches `AppMenu` as
`extraItems`; the callback is the screen's, so neither component knows anything of the store.

### `src/assets/category-icons/` — the category drawables

One Android XML vector drawable per `CategoryIcon` key, named after the key, from Google's Material
Symbols. A default category's icon is named after its category (`computer_science.xml`) and filled
`#FFFFFF`; an extra icon keeps its Material Symbols name without `_24px` (`rocket_launch.xml`) and
its supplied `@android:color/white` fill. No file carries an `android:tint` attribute, so
`tintColor` recolours the whole glyph
([ADR-0013](decisions/0013-category-icons-are-android-vector-drawables.md) and its Amendment 2).
`__tests__/categories.test.ts` reads this directory to check that the file names are exactly
`CATEGORY_ICONS` and that no file contains `android:tint`. AAPT compiles the drawables into the APK
at build time, so Metro cannot serve a change to them. A `NOTICE` file beside them carries the
attribution and the Apache-2.0 licence notice for every icon in the directory, the extras included
by inference rather than by a stated source; it is not bundled into the APK. Nothing else lives
under `src/assets/`.

### App entry points

- [`index.js`](../../index.js) — calls `keepLayoutLeftToRight()` from `services/deviceLocale.ts`,
  then `AppRegistry.registerComponent`. The only `.js` file in the source.
- [`App.tsx`](../../App.tsx) — `SafeAreaProvider` → `I18nProvider` → `DecksProvider` → `RootNavigator`.
  `I18nProvider` wraps the navigator, so every screen, component and navigator option can read
  the language with `useT()`; the store does not read it
  ([ADR-0020](decisions/0020-ui-text-translated-through-typed-catalogue.md)).

---

## 4. Navigation

One bottom tab navigator, one native stack inside each tab. There is no drawer, no modal stack, and
no deep linking.

```
RootNavigator  (NavigationContainer, dark theme built from src/theme.ts, direction="ltr")
└── Tab.Navigator          initialRouteName = active session ? 'LearnTab' : 'DecksTab'
    ├── DecksTab   → DecksNavigator  → DecksList     (DecksScreen)
    │                                → EditDeck      (EditDeckScreen)   param: deckId
    │                                → NewDeck       (EditDeckScreen)   no params
    ├── LearnTab   → LearnNavigator  → LearnList     (LearnScreen)
    │                                → Study         (StudyScreen)      params: sessionId, mode?: 'review'
    ├── CategoriesTab → CategoriesNavigator → CategoriesList (CategoriesScreen)
    │                                      → NewCategory    (NewCategoryScreen)
    └── StatsTab   → StatsNavigator  → StatsOverview (StatsScreen)
                                     → DeckStats     (DeckStatsScreen)  param: deckId
```

Param lists live in [`src/navigation/types.ts`](../../src/navigation/types.ts), one per stack plus
`RootTabParamList`. Tab icons are in
[`src/navigation/TabIcons.tsx`](../../src/navigation/TabIcons.tsx), drawn from `View`s —
`CategoriesIcon` is a two-by-two grid of outlined squares. `DecksIcon` is also the icon of the
Statistics screen's `Decks` Stat tile, the one use of a tab icon outside the navigator. The
Categories tab never becomes the launch tab.

**The navigator does not mount until the store has loaded.** `RootNavigator` reads `isLoading` from
`useDecks()` and renders an activity indicator until it is false. This is not a loading nicety: a
navigator's `initialRouteName` is read once, so choosing the launch tab from the persisted sessions
requires those sessions to already be in memory —
[ADR-0006](decisions/0006-launch-on-the-tab-with-unfinished-work.md).

**The Study screen is a route in the Learn stack, not a tab.** Starting a session from the Decks
screen therefore navigates across tabs:
`navigation.navigate('LearnTab', { screen: 'Study', params: { sessionId } })`. The Session summary
uses `replace` for both of its actions that open a study — **Study the whole deck again** to the
new session, and **Review the missed or unsure cards** to the same `sessionId` with
`mode: 'review'` — so the finished summary does not pile up on the back stack; its **Back to
sessions**, like the Review summary's, goes back. On the Learn screen the **Review errors button**
navigates to `Study` with `mode: 'review'`; Resume, Replay and Start a new session navigate without
it. Review mode applies only to a completed session: with an active, missing or deckless session
the Study screen shows its *Nothing to study* state.

**The Statistics screen's timeframe is not navigation state.** It is local state of
`StatsScreen`, not a route param, and the `DeckStats` route carries only `deckId`, so the Deck
statistics screen is always all time
([ADR-0015](decisions/0015-answers-carry-a-timestamp-under-v2-keys.md)).

**Two routes share one screen component.** `EditDeck` and `NewDeck` both render
`EditDeckScreen`, under the titles *Edit deck* and *New deck*; the component picks its mode from
`route.name`. `NewDeck` has no params, because a new deck has no id until `addDeck` mints one, and
saving it goes back to `DecksList` rather than on to the new deck
([ADR-0011](decisions/0011-deck-editing-is-one-action.md) Amendment 4).

The navigator sets no `headerRight`. Each tab's root screen sets its own with
`navigation.setOptions` in a `useLayoutEffect` and restyles the header (background colour and a
larger title). On the Decks, Learn and Statistics screens that is the **Header toolbar**, which
renders the App menu after the Search button; the Learn screen's also passes **Clear completed sessions** to that App menu as an extra item. The Categories
screen sets the App menu alone, boxed. Detail screens carry no App menu; the New category screen's
`headerRight` is its **Save** button, as the Edit deck and New deck screens' is.

---

## 5. Persistence

One AsyncStorage key per module in `src/storage/`. Nothing else writes storage.

| Key | Holds | Module |
|---|---|---|
| `@easy-flashcards/decks/v2` | `Deck[]`, each with its `description` ([ADR-0011](decisions/0011-deck-editing-is-one-action.md)), its `categoryId` ([ADR-0014](decisions/0014-deck-belongs-to-one-category.md)), and its `Card[]` and their counters; the shape is the one `/v1` held ([ADR-0015](decisions/0015-answers-carry-a-timestamp-under-v2-keys.md)) | [`decksStorage.ts`](../../src/storage/decksStorage.ts) |
| `@easy-flashcards/sessions/v2` | `Session[]` — active, completed, and cleared ([ADR-0008](decisions/0008-clear-completed-sessions.md)), each with its `fixedCardIds` ([ADR-0009](decisions/0009-error-review-marks-cards-fixed.md)), its direction, `inverted` ([ADR-0010](decisions/0010-inverted-sessions.md)), and every result's `answeredAt` ([ADR-0015](decisions/0015-answers-carry-a-timestamp-under-v2-keys.md)) | [`sessionsStorage.ts`](../../src/storage/sessionsStorage.ts) |
| `@easy-flashcards/categories/v1` | `Category[]` — the user's own categories only; the built-in ones are code ([ADR-0012](decisions/0012-custom-categories-third-storage-key.md)). A `color` is a palette colour or a custom `#rrggbb`, in the same shape (ADR-0012 Amendment 3) | [`categoriesStorage.ts`](../../src/storage/categoriesStorage.ts) |

**The `/v1` decks and sessions keys are orphaned.** Decks and sessions moved to `/v2` because each
result gained a required `answeredAt` that no older record has a true value for, and the deck
counters had to start from the same empty log as the sessions
([ADR-0015](decisions/0015-answers-carry-a-timestamp-under-v2-keys.md),
[ADR-0004](decisions/0004-versioned-defensive-storage.md) Amendment 4). Nothing reads, converts or
deletes `@easy-flashcards/decks/v1` or `@easy-flashcards/sessions/v1`: the owner waived the
conversion step for a greenfield app, so upgrading showed an empty library, and the old data stays
on the device, unread, for as long as the app is installed. The waiver is not a precedent. The
categories key did not move, so custom categories survived the upgrade.

**Every key is loaded once**, in parallel, by a mount effect in `DecksProvider`, and if any one
load rejects the whole load fails. A corrupt or
non-array key reads as `[]` (`parseStoredArray`), so only a failure of AsyncStorage itself rejects.
That sets `error` and clears `isLoading`; the app starts empty rather than not at all, and the
Decks screen shows the catalogue's generic load-error message, not the detail `error` holds
([ADR-0020](decisions/0020-ui-text-translated-through-typed-catalogue.md) Amendment 1).

**Every key is written together**, as whole arrays, by a second effect watching `state.decks`,
`state.sessions` and `state.categories`. A `hasLoaded` ref suppresses the write that would otherwise fire immediately
after hydration, and **nothing is written while `error` is set**: after a failed load the state is
empty, and saving it would overwrite the data the read could not reach. A failed write is caught
and discarded, deliberately: a storage error must not take down a session in progress.

**Reads normalise and never throw.** Each loader drops malformed rows — a card with no `id`,
`question` or `answer`; a session whose `cardIds` is not an array — defaults missing timestamps to
now, clamps `results` to `cardIds.length`, reads a missing or non-numeric card counter as `0`,
preserves an answer of `'ok'`, `'okeish'` or `'notOk'`, and coerces any other answer to `'ok'`. A
result's `answeredAt` is kept when it is a finite number and otherwise read as its session's
`startedAt`, so a damaged answer lands at its session's start rather than in every window — unless
the session's `startedAt` is missing too, in which case both read as the time of loading. A
session's `clearedAt` is kept only when it is a finite number **and** the session is completed;
otherwise it is read as `null`, so an active session can never be hidden. A session's
`fixedCardIds` goes through `normalizeFixedCardIds` in `stats.ts`: a missing or non-array value is
`[]`; only strings that are missed or unsure in the session's normalised, clamped `results` are
kept, first occurrence winning; and an active session always reads back `[]`. A session's
`inverted` is read as `true` only when the stored value is exactly `true` (`readInverted` in
`utils/cardFaces.ts`); missing or any other value is `false`, for active and completed sessions
alike. A deck's `description` is read as `''` when missing or not a string. A deck's `categoryId` is
kept as stored when it is a non-empty string — not checked against the categories, because each
loader reads only its own key — and read as `null` otherwise
([ADR-0014](decisions/0014-deck-belongs-to-one-category.md)). A stored category is dropped
when its `id` is not a string or its `name` is not a non-empty string, and a later row repeating an
earlier row's `id` is dropped; a `color` that is not a hex colour string (`isHexColor` in
`utils/categories.ts`) reads as the first palette colour, while any well-formed hex is kept, palette
or not — which is how a custom colour reads back, and the contrast rule is not re-applied on read
([ADR-0012](decisions/0012-custom-categories-third-storage-key.md) Amendment 3); an `icon` that is not in `CATEGORY_ICONS` —
the defaults' icons and the extras — reads as `FALLBACK_CATEGORY_ICON`, a default category's icon
([ADR-0012](decisions/0012-custom-categories-third-storage-key.md) Amendment 2), and a non-numeric
`createdAt` as now. The name rule is not re-applied on
read ([ADR-0012](decisions/0012-custom-categories-third-storage-key.md)). The cost is silent data loss on a corrupt record; the alternative is an app that cannot start
([ADR-0004](decisions/0004-versioned-defensive-storage.md)).

**The version suffix is the migration mechanism.** A shape change the normaliser cannot absorb takes
a new key and converts from the old one on first read; decks and sessions took `/v2` that way, with
the conversion waived (above). Nothing rewrites what a version means. A new
field whose default is the *true* value for every older record is absorbed under `/v1` instead —
[ADR-0004 Amendment 1](decisions/0004-versioned-defensive-storage.md); a card's Okeish counter is
the first such field ([ADR-0007](decisions/0007-okeish-third-answer.md)), a session's `clearedAt`
the second ([ADR-0008](decisions/0008-clear-completed-sessions.md)), a session's `fixedCardIds` the
third, absent on every older record and read there as `[]`
([ADR-0009](decisions/0009-error-review-marks-cards-fixed.md)), and a session's `inverted` the
fourth, absent on every older record and read there as `false`
([ADR-0010](decisions/0010-inverted-sessions.md)), a deck's `description` the fifth, absent on
every older record and read there as `''` ([ADR-0011](decisions/0011-deck-editing-is-one-action.md)),
and a deck's `categoryId` the sixth, absent on every older record and read there as `null`
([ADR-0014](decisions/0014-deck-belongs-to-one-category.md)).
The `/v2` keys kept all six fields and their read defaults.
The opposite direction is not covered, though since `/v2` it no longer reaches this build's decks
and sessions: a build older than the `/v2` keys reads and writes only the `/v1` ones, so after a
downgrade it shows the library as it was before the upgrade, and reinstalling this build shows the
`/v2` library again; the two never merge (ADR-0004 Amendment 4). Among the builds that share the
`/v1` keys, an older
build reading data a newer one wrote loses the Okeish data, drops `clearedAt` so every cleared
session — every replayed original included — reappears in its Learn list, drops `fixedCardIds` so
every reviewed session's count returns to its full number of missed or unsure cards, and drops
`inverted` so every inverted session becomes a normal one — an active one resumed there shows the
question first — on its first save. These losses are permanent; reinstalling the newer build does
not restore them. No answer or counter is lost to the `fixedCardIds` or `inverted` drop, because a
review never wrote one and both directions record them the same way. It also drops a deck's
`description` and its `categoryId`, so every deck comes back uncategorised. The categories key is the
exception: an older build neither reads nor writes it, so custom categories survive a downgrade and
reappear when the newer build is reinstalled, with no deck assigned to them
([ADR-0004](decisions/0004-versioned-defensive-storage.md) Amendment 3). That holds only for a
build that predates the key. A build that has categories but predates the extra icons reads a
custom category's extra icon as the fallback icon, and its first state change of any kind writes
that back, so the icon choice is lost for good; the category's id, name, colour and `createdAt`, and
every deck's assignment to it, survive
([ADR-0012](decisions/0012-custom-categories-third-storage-key.md) Amendment 2). A custom colour is
not lost that way: every build that has the key keeps a well-formed hex outside its palette, so an
older build shows it and writes it back unchanged (ADR-0012 Amendment 3).

**Ids are generated, not derived**: `createId(prefix)` in `DecksContext` returns
`` `${prefix}_${Date.now().toString(36)}_${random}` ``. Deck ids, card ids, session ids and custom
category ids all come from it; a built-in category's id is the constant `default_<icon key>`, which
no minted `category_` id can take. Card ids are minted at import, so re-importing the same file produces a second deck
with different cards rather than merging.

---

## 6. HTML on a card

Both sides of a card are HTML, because that is how the source CSVs are written. The app parses and
renders it itself — [ADR-0001](decisions/0001-own-the-html-renderer.md).

- [`utils/html.ts`](../../src/utils/html.ts) turns a string into `HtmlNode[]`. It is tolerant by
  design: an unclosed tag is closed at the end of input, an unclosed `<li>` or `<p>` is closed when
  the next one opens (an `<li>` never across a nested list, a `<p>` never across a block tag), a
  stray closing tag is dropped, and nothing throws. The input is an imported CSV or JSON file, so malformed
  markup is expected rather than exceptional.
- [`components/RichText.tsx`](../../src/components/RichText.tsx) renders those nodes as **nested
  `<Text>` elements**, mapping each tag through a `TAG_STYLES` table. `<br>` becomes a newline,
  `<hr>` a run of box-drawing characters, `<li>` a bullet or a number, and a block tag gets a
  leading newline when it is not first.

The consequence of being all `<Text>`: **there is no block layout**. A list is a line per item with
a bullet glyph, not an indented list; a `<blockquote>` is italic muted text, not an inset block;
there is no `<img>` and no `<table>`. That is the accepted cost of rendering a card's two faces
inside a single scrollable, line-clampable text node.

Unsupported tags are not an error — an unknown tag renders its children with no style.

---

## 7. Tech stack

| Concern | Choice |
|---|---|
| UI | React Native primitives — no component library, no icon font; `react-native-svg` for data charts only ([ADR-0018](decisions/0018-react-native-svg-draws-charts.md)) |
| Icons | drawn from nested `View`s, except the category icons: Android vector drawables in `src/assets/category-icons/`, rendered with `Image` by `CategoryIcon` ([ADR-0013](decisions/0013-category-icons-are-android-vector-drawables.md)); never SVG, though the package is installed ([ADR-0013](decisions/0013-category-icons-are-android-vector-drawables.md) Amendment 3) |
| Charts | `react-native-svg`, today for the Session history chart only. Imported only from `src/components/`; the geometry is pure TypeScript in `src/utils/historyChart.ts`, measured with `onLayout` and drawn in dp; every label is React Native `Text`, never SVG text; no SVG filters; the svg is hidden from accessibility ([ADR-0018](decisions/0018-react-native-svg-draws-charts.md)) |
| Styling | `StyleSheet.create` against the tokens in [`src/theme.ts`](../../src/theme.ts), including `categoryPalette`; the only `View` gradients — the Custom colour dialog's slider tracks and the Custom colour swatch — use React Native's `backgroundImage` style with a CSS `linear-gradient()` string, not a gradient library; a chart's gradient fills are SVG `LinearGradient`s |
| Navigation | React Navigation — bottom tabs + native stack, with `react-native-screens` and `react-native-safe-area-context` |
| State | React Context over `useReducer` |
| Persistence | `@react-native-async-storage/async-storage` |
| CSV | PapaParse — reading wrapped by `src/utils/csv.ts`, writing (`Papa.unparse`) by `src/utils/deckExport.ts` |
| JSON deck files | the built-in `JSON` object, no library — read by `src/utils/deckImport.ts`, written by `src/utils/deckExport.ts` |
| File picking and saving | `@react-native-documents/picker` |
| File reading, and writing to the cache | `@dr.pogodin/react-native-fs` |
| HTML | owned in-repo — `src/utils/html.ts` + `src/components/RichText.tsx` |
| UI text and languages | owned in-repo, no library — the typed catalogue in `src/locales/`, the engine in `src/utils/i18n.ts`, a read-only `I18nProvider` with `useT()` in `src/i18n/`, the device language read by `src/services/deviceLocale.ts`, which also keeps the layout left-to-right for a right-to-left language (ADR-0020 Amendment 3); plurals by per-language rule functions, because Hermes has no `Intl.PluralRules`; an ESLint `no-restricted-syntax` override in `.eslintrc.js` flags new literals in screens, components and navigation ([ADR-0020](decisions/0020-ui-text-translated-through-typed-catalogue.md) and its Amendment 1) |
| Animation | the React Native `Animated` API, with `PanResponder` for the Study screen's swipe |
| Tests | Jest with `@react-native/jest-preset` — pure logic, the catalogue, the reducer, and the storage loaders with AsyncStorage mocked by `jest.mock`; nothing renders |
| Lint / format | ESLint extending `@react-native`, which carries Prettier |

Versions are in [`package.json`](../../package.json); Android SDK levels in
[`android/build.gradle`](../../android/build.gradle). Hermes and the New Architecture are both
enabled in `android/gradle.properties`.

Two entries on that list exist because the obvious choice failed, and both are worth knowing before
proposing a change:

- `react-native-render-html` sets `defaultProps` on function components, which this React version
  ignores. It fails at render, not at install. It must not be reintroduced.
- `react-native-document-picker` is deprecated in favour of `@react-native-documents/picker`, whose
  API is different. A snippet written for the old one will not work.

One more needs care on every upgrade, though it works: `react-native-svg` is a native package —
installing or upgrading it needs a native rebuild, not a Metro reload — and its peer ranges are
`react: *` and `react-native: *`, so npm never warns when a React Native upgrade leaves the
versions it supports. Check its supported React Native versions by hand. It brings `css-tree`,
`css-select` and their dependencies, JavaScript only, for its XML and CSS entry points, which the
app does not use. It merged no Android permission into the built APK — the packaged permissions
were checked unchanged when it landed — and every upgrade of it needs that check again
([ADR-0018](decisions/0018-react-native-svg-draws-charts.md)).

---

## 8. Known debt

- **No component tests.** `react-test-renderer` is a dev dependency and nothing imports it, and
  there is no `@testing-library/react-native`. The suite covers `src/utils/`, the reducer in
  `src/state/reducer.ts`, and the storage loaders; nothing renders. A screen or a component can
  break with the whole suite green, and so can the wiring in `DecksContext.tsx` — `createSession`,
  `addCategory`'s trim and id, the timestamps each function passes, and the load and save effects,
  including that every key is loaded and saved. The Categories and New category screens, the
  category components, and the name validation the New category screen relies on before calling
  `addCategory` are all untested. So are the Colour picker's measured layout and its Custom colour
  swatch, and the Custom colour dialog and its `ColorSlider`s — the drag, TalkBack's increment and
  decrement, the scroll lock while a slider is held, the reset to the current colour on each
  opening, and **Use colour**'s disabled state; only the colour maths in `utils/color.ts` beneath
  them is tested. Nothing that shows a deck's category is tested either: the Category
  square on the Deck and Session cards, in their Menu sheet titles and on the Deck stats card, the
  Deck statistics screen's Category pill, the Category field and picker, the Learn screen's session →
  deck → category resolution, the delete confirmation's deck count, and `updateDeck` passing the
  edit's `categoryId` through `DecksContext`. Only `findCategory`, `countDecksInCategory`,
  `isDeckEditChanged`, `applyDeckEdit`, the icon keys and labels, the drawable file names, the
  reducer cases and the loader rule are tested. On the Statistics screen only the derivations are
  tested — `answerShares`, `describeAnswerShares`, `allocateRingSegments`, the session summaries,
  `timeframeStart` and the `*Since` functions; the Mastery ring, the Stat tiles, the Deck stats card
  and the Timeframe chips are not, and neither is the screen's wiring — which figure follows the
  timeframe and which stays all time, the window cut from `Date.now()`, the chips hidden when there
  are no decks. The Learn screen's Discard confirmation, which says the answers leave Statistics, is
  untested too. On the Deck statistics screen only `rateBand`, `cardStatus`, `countCardStatuses`,
  `sortCards`, `lastAnsweredAtByCard`, `getSessionHistory`, `rateChangeSinceLastSession`,
  `cardSearchText` and `htmlToPlainText` are tested, with the Session history chart's geometry in
  `utils/historyChart.ts`; `DeckIdentityRow`, `DeckMasteryCard`,
  `MasteryTrack`, `SessionHistoryChart` — the svg drawn from that geometry, its gradients, band
  lines and markers, the Y axis labels and Session labels lined up under it, the Latest session
  badge, the legend's Unanswered swatch and the plot hidden from accessibility —
  `CardSearchField`, `CardStatusChips`, `CardStatsRow`, the
  `selected` rows of `MenuSheet` and the `sort` `MenuIcon` are not, and neither is the screen's
  wiring — which figure reads the counters and which the answer log, the status filter applied
  before the query so the chips' counts ignore it, the three empty states and their actions, the
  header element that keeps the Card search field focused across keystrokes, the Sort button and
  the Reset statistics confirmation. Of exporting a deck only `utils/deckExport.ts` is tested; `services/exportDeck.ts`
  — the cache write, the save dialog, cancellation and the cache file's deletion — the Custom
  separator dialog, and the Decks screen's chain of menus, its in-flight guard and its deleted-deck
  alert are not. Export was checked on a device; exporting a categorised deck and a deck with no
  cards, and the Custom separator dialog's spinner, were not. Of exporting the sample deck only
  `utils/sampleDeck.ts` is tested — the shipped files against the serialiser, their import, and
  every alert text; `services/exportSampleDeck.ts` — the two dialogs in sequence, and a cancel or
  failure on one file not stopping the other — and `AppMenu`'s handler, which decides whether the
  dialog closes, are not (see *Export sample deck* below). Of importing a deck only the parsers
  in `utils/csv.ts` and `utils/deckImport.ts`, `detectDeckFormat`, and the reducer's `addDeck` case
  are tested; `services/importDeck.ts` — the MIME list, the cache copy, the read, handing the
  detected format to the right parser, choosing the deck's name from the file's title or its file
  name, cancellation — the Decks screen's handler and alerts,
  including handing the file's `categoryRef` to `addDeck` as its `categoryId`, and
  `addDeck` in `DecksContext.tsx` — the fresh ids, the zero counters, and passing `description` and
  `categoryId` through — are not, and rest on one device run. On SM-G781B (2026-11-05), after the
  Import format menu was removed ([ADR-0017](decisions/0017-deck-import-reads-exported-formats.md)
  Amendment 1), **Import deck from file** opened the system picker directly; a CSV file, a JSON
  file and a JSON file renamed `.txt` each imported, the format detected from the content; a binary
  file got the `Import failed` alert; and cancelling the picker showed nothing. Format version 2
  ([ADR-0019](decisions/0019-deck-file-format-version-2.md)) was built into a release APK and
  installed, but its import and export — a categorised deck's category coming back from a CSV
  file, a custom category matching by name — were not observed on a device, and no device run is
  recorded for a CSV's title and description being read (ADR-0019 Amendment 1). Adding a
  component-test setup is a dependency change and needs approval.
- **A CSV file that starts with `{` or `[` is read as JSON.** `detectDeckFormat` looks only at the
  first character after a BOM and whitespace, so a CSV whose first non-blank character is `{` or
  `[` — an unquoted first column name starting with one, with no comment line above the header — is
  rejected as *not an Easy Flashcards deck file*. This is accepted, not pending: no CSV the app
  exports does it, because every one starts with a `# format:` line, and quoting that column name or
  adding any comment line above the header makes such a file import
  ([ADR-0017](decisions/0017-deck-import-reads-exported-formats.md) Amendment 1).
- **`deleteSession` deletes whatever it is given.** The rule that it is only for discarding an
  active session lives in the Learn screen, not the reducer; a future caller that deletes a
  completed session silently removes its answers from every statistic and lowers its deck's card
  counters, because `deleteSession` withdraws them
  ([ADR-0008](decisions/0008-clear-completed-sessions.md) Amendment 2).
- **Study review mode can only be checked on a device.** The pass snapshot, the pass's local
  answers, the frontier switching between `session.results` and the pass, the reset on a change of
  `(sessionId, mode)`, the empty pass that goes straight to the Review summary, and the rule that a
  review answer goes to `recordReviewAnswer` rather than `recordAnswer` all live in `StudyScreen`;
  the Learn screen's choice of `replaySession` for Replay and of review mode for the Review errors
  button lives in `LearnScreen`. Neither is tested. A review that recorded into the session would
  pass `npm test` and silently move every statistic
  ([ADR-0009](decisions/0009-error-review-marks-cards-fixed.md)).
- **Direction and the default card order are not covered by any test that renders.** `cardFaces`
  is tested, but nothing checks
  that the Study screen passes it the session's `inverted`, or that every path creating a session
  from another passes the source's flag. A card shown the wrong way round passes `npm test`; only a
  device run catches it ([ADR-0010](decisions/0010-inverted-sessions.md)). Likewise `shuffle` is
  tested but the Decks screen's use of it is not: a Start session button back in deck order, or a
  Session setup dialog opening with **Shuffle** unticked, passes `npm test` (ADR-0010 Amendment 1).
- **A downgrade shows a different library, and between older builds it still loses data.** A build
  older than the `/v2` keys reads and writes only the `/v1` decks and sessions keys, so a downgrade
  from this build shows the library as it was before the upgrade and never touches the `/v2` data;
  reinstalling this build shows the `/v2` library again, and the two never merge
  ([ADR-0015](decisions/0015-answers-carry-a-timestamp-under-v2-keys.md)). Between builds that share
  the `/v1` keys a downgrade silently loses Okeish data, un-clears every cleared session, forgets
  every fixed card, un-inverts every inverted session, and drops every deck's description and
  category; and because the categories key did not move, a build older than the extra icons can
  still replace a custom category's icon. An
  older APK drops the card's Okeish counter, reads every `'okeish'` answer as `'ok'`, drops each
  session's `clearedAt`, `fixedCardIds` and `inverted`, and drops each deck's `description` and
  `categoryId`, and its first save makes all of that permanent. No session statistic is lost — the
  cleared sessions were still counted, a review never wrote a statistic, and an inverted answer is
  recorded like any other — but cleared sessions (replayed originals included) return to the Learn
  list, every reviewed session's count returns to its full number, the older build's Replay missed
  button creates counted sessions again, and an active inverted session resumes showing the
  question first. The custom categories themselves survive a build that predates their key,
  because it never touches it; a build that has categories but predates the extra icons rewrites
  every custom category with an extra icon to the fallback icon on its first save (see §5). Nothing
  blocks it: `versionCode`
  in [`android/app/build.gradle`](../../android/app/build.gradle) has never been bumped and release
  builds share the debug keystore. Accepted in ADR-0007, ADR-0008, ADR-0009, ADR-0010, ADR-0011,
  [ADR-0014](decisions/0014-deck-belongs-to-one-category.md),
  [ADR-0012](decisions/0012-custom-categories-third-storage-key.md) Amendment 2 and ADR-0015, not
  mitigated.
- **An error review is invisible to Statistics and cannot be undone.** A card fixed in a review
  keeps the rate its sessions gave it; Okeish and Not ok answers in a review are recorded nowhere;
  an accidental Ok removes the card from that session's later passes, and only a Replay or a new
  session — both counted — drills it again. A fixed id whose card later leaves the deck stays
  stored until *Delete deck* or *Reset statistics*. Accepted in
  [ADR-0009](decisions/0009-error-review-marks-cards-fixed.md).
- **Statistics cannot tell the directions apart, and shuffling is not recorded.** A card has one
  set of counters for both directions, so a card known one way and not the other shows one blended
  rate, and Hardest first cannot say which direction is hard. Whether a session was shuffled is
  visible only in its `cardIds` order, and since the Start session button shuffles, that is now
  most sessions; it is also why **Study the whole deck again** cannot follow its source's order and
  always starts in deck order. Accepted in
  [ADR-0010](decisions/0010-inverted-sessions.md) and its Amendment 1.
- **Cleared sessions are kept forever and cannot be restored from the UI.** Clearing removes
  nothing, so the sessions key only grows — by one session per Replay, since a replay clears rather
  than replaces its original; only *Delete deck* and *Reset statistics* shrink it. There is no
  *restore* and no *show cleared*: a session cleared by mistake stays hidden though its data is
  intact, and its review state is hidden with it. Accepted in
  [ADR-0008](decisions/0008-clear-completed-sessions.md).
- **The card counters and the answer log are two records, kept equal only by the reducer.** The
  Statistics screen reads session results and skips a removed card's answers, and Discard withdraws
  its answers from the counters, so after a card removal or a discard the Statistics screen at All
  time and the Deck statistics screen agree; that half of the former *a deck's statistics can fall
  out of step with its sessions'* entry is resolved
  ([ADR-0015](decisions/0015-answers-carry-a-timestamp-under-v2-keys.md)). What remains: removing a
  card still deletes its counters for good while every session that included it keeps its answers,
  so the Learn screen's Session cards (`getSessionTally`) still count them, and a completed session
  may list card ids that no longer exist
  ([ADR-0011](decisions/0011-deck-editing-is-one-action.md)). And nothing outside the reducer holds
  the equality: a future action that changes counters or results without the other, a row one
  loader drops while the other key keeps its counterpart, or a failed write of one key while the
  other succeeds leaves the Statistics screen disagreeing with the Deck statistics screen and the
  Decks screen's Mastery bar, silently. A reducer test catches the first; nothing detects or repairs
  the others. Deriving everything from the log is the recorded way out (ADR-0015 *Alternatives
  Considered*).
- **The Deck statistics screen's Session history chart and its headline can disagree.** A
  session's bands, markers and Session label are built from the session's own snapshot
  (`getSessionHistory`): they count every answer in the session, including answers on cards since
  removed from the deck. The Success rate
  headline, the Answer tiles and the `Reviews` figure read the card counters, which a removed card
  took with it, and the Mastery change chip counts only cards still in the deck. After a card
  removal the chart can therefore show answers the headline does not, and the `Sessions` figure
  still counts a session whose every answered card is gone. Accepted with
  [ADR-0015](decisions/0015-answers-carry-a-timestamp-under-v2-keys.md) Amendments 2 and 3: a
  session in the chart is a record of that session, not of the deck as it is now.
- **The Session history chart's curves between sessions are visual only.** Nothing was measured
  between two sessions; the curves join them so the bands read as one shape, and only the markers
  at the sessions carry values. The X axis is session order, not time, so a gap of months and a gap
  of minutes look alike. Each curve has a horizontal tangent at both sessions, which keeps stacked
  edges from crossing but flattens the shape near every session. Nothing on a curve may be given a
  value, tooltip or label (ADR-0015 Amendment 3).
- **The Latest session badge can cover the latest session's markers, not only its Ok marker.** The
  badge is centred `HISTORY_BADGE_OFFSET` above the latest Ok marker but never above
  `HISTORY_BADGE_MIN_Y`, so it stays inside the plot. When the latest Ok share is at or near 100%,
  that clamp puts it over the upper part of the Ok marker. Seen on a device and accepted as a
  design note: the badge then carries the same session's Ok count the marker stands for. The badge
  can also hide the latest session's upper-band markers — Okeish and Not ok — whenever their band
  tops sit a little above the Ok top, which includes an answered share at or near 100%: with Ok 95%
  and Not ok 5%, the Not ok marker is at the top of the plot, under the badge. Those markers stand
  for counts the badge does not show. This second case is computed from the constants in
  `historyChart.ts` and the badge box in `SessionHistoryChart.tsx`, not observed on a device.
- **`react-native-svg`'s React Native support is checked by hand.** Its peer ranges are `*`, so a
  React Native upgrade installs cleanly whether or not the package supports the new version; the
  failure would come at build or at render. Every React Native upgrade must check its supported
  versions, and installing or upgrading it needs a native rebuild — codegen and a CMake build — not
  a Metro reload ([ADR-0018](decisions/0018-react-native-svg-draws-charts.md)).
- **Jest cannot load a chart component as configured.** `@react-native/jest-preset`'s
  `transformIgnorePatterns` exempts only `react-native` itself and the `@react-native/` and
  `@react-native-community/` scopes from being left untransformed, not `react-native-svg`, so the
  first component test that imports
  `SessionHistoryChart`, directly or through `DeckStatsScreen`, needs the pattern widened and the
  package mocked. No test imports a component today, so nothing fails now (ADR-0018).
- **The chart's native views show in tooling.** A uiautomator dump of the Deck statistics screen
  lists `com.horcrux.svg.*` nodes — all non-focusable with an empty content description, so the
  plot is hidden as intended, and one focusable `Session on …` node per Session label. A TalkBack
  pass is not recorded. Rendering it logs dozens of `ViewManagerPropertyUpdater: Could not find
  generated setter` warnings for `com.horcrux.svg.*` classes; they are benign — nothing fails to
  draw and nothing crashes — but they are noise in which a real warning can hide.
- **The Session history chart was seen on a device, except one case.** On a phone: the smooth
  stacked bands with their gradient fills, the band lines and their shadows, the dashed grid and
  guides, the markers, the Latest session badge, the empty state with no sessions, and the single
  bar with an Unanswered band for one session, at a 1.3x font scale and at a narrower screen width
  as well. Not seen: an **active session part-way through, among completed ones** — the Unanswered
  band joined by curves to sessions that have none. Only the geometry tests cover it.
- **Amber means several things, and the card status thresholds are borrowed.** `cardStatus` reads
  the card's Ok-only rate through `rateBand`, the bands that coloured the Session summary's
  `SuccessBar` — 70 and above, 40 and above, below — so *Mastered*, *Learning* and *Needs review*
  are the success-rate colour bands renamed, not thresholds chosen for card mastery. No screen
  colours a rate by them any more, but `SuccessBar` still maps them to colours, so changing one
  moves the other. `colors.warning` is at once the Okeish answer (every `MasteryTrack` segment,
  Answer tile and legend) and the *Learning* status (its Card status badge even uses Okeish's
  question-mark glyph) — and the Review errors button besides, on the Learn screen and as the
  Session summary's and Review summary's **Review the missed or unsure cards** Summary button. A card answered only Okeish
  is shown in amber segments with a red *Needs review* badge.
  Nothing tests what the colours mean; only a device run shows them.
- **The Card search re-parses every card on every keystroke.** `filterByTitle` calls
  `cardSearchText` for every card each time the query, the status filter or the sort changes while
  a query is typed, and `cardSearchText` runs `htmlToPlainText` — a full `parseHtml` — on both
  sides. Nothing caches the plain text per card; `CardStatsRow` memoises its own copy for its
  accessibility label, which the search does not reuse. Fine at hand-imported deck sizes, and
  untested at larger ones.
- **The `/v1` decks and sessions keys are orphaned bytes.** Upgrading to the `/v2` keys showed an
  empty library; the old data stays on the device, and nothing reads, converts or deletes it (§5).
  The conversion step was waived for a greenfield app, and the next new key needs it again
  ([ADR-0004](decisions/0004-versioned-defensive-storage.md) Amendment 4).
- **Timeframes follow the device clock and time zone.** Each `answeredAt` is the device time when
  the answer was given, and a window is cut in local time from `Date.now()` when the Statistics
  screen derives its figures. A time-zone change or a clock set back moves answers between windows,
  an answer stamped in the future counts in every window, and a wrong clock at study time is stored
  for good. The screen left open across midnight or into a new month keeps its old window until the
  selection or the data changes, because the cut is memoised with them. The selection is not
  remembered across launches, there are no custom ranges, and the Deck statistics screen is always
  all time (ADR-0015 *Not decided here*).
- **Editing a deck cannot reorder cards.** The Edit deck screen has no way to move a card, so an
  exported deck's cards are in the order the deck already had.
- **An exported deck comes back only as far as its format carries it.** Every file the app exports
  imports again, in both formats and with every separator
  ([ADR-0017](decisions/0017-deck-import-reads-exported-formats.md)), but:
  - **A custom category travels only by name.** Both files name a custom category by its name, and
    the import matches it against this device's custom categories ignoring case, so it resolves
    only where a custom category of that name exists; otherwise the deck imports with no category,
    without telling the user it had one. No category is created. A custom category named exactly
    like a built-in id, e.g. `default_law`, exports as that string and comes back as the built-in
    category; `validateCategoryName` does not forbid such a name
    ([ADR-0019](decisions/0019-deck-file-format-version-2.md)).
  - **A version 1 CSV's built-in category is not recovered.** A version 1 CSV wrote a built-in
    category's English display name, and a built-in is never matched by name, so such a deck
    imports uncategorised, as every CSV import did before version 2 (ADR-0019). Its title and
    description, which version 1 wrote too, are read (ADR-0019 Amendment 1).
  - **Version 2 JSON files are refused by older builds.** A build from before format version 2
    refuses a version 2 JSON file as *made by a newer version*; it still imports a version 2 CSV
    file, skipping its comment lines, so the deck is named after the file, with no description and
    no category (ADR-0019 and its Amendment 1).
  - **Progress does not travel.** No ids, counters or sessions are exported, and none are read, so
    every imported card starts unreviewed ([ADR-0016](decisions/0016-deck-export-file-formats.md)).
  - **Whitespace is trimmed.** Both importers trim each card side, the title and the description,
    while the export writes them untrimmed, so a round trip is exact only modulo leading and
    trailing whitespace. A CSV title or description is trimmed before it is unescaped, so an escaped
    line break at either end of one in a hand-edited file survives as a line feed (ADR-0019
    Amendment 1).
  - **An exported empty deck does not import.** The export writes a deck with no cards; both
    importers reject a file with no usable card.
- **A CSV export is written for this app's convention, not for spreadsheets.** A field beginning
  with `=`, `+`, `-` or `@` is written as is, and a spreadsheet may evaluate it; most spreadsheets
  show the `#` lines as data rows; and another tool reads a comment line's `\n` and `\\` escapes
  literally. Accepted in ADR-0016.
- **Export sample deck takes two save dialogs, can half-succeed, and is unchecked on a device.**
  Android's `saveDocuments` saves one file per call, so the sample's CSV and JSON each get their
  own save dialog, one after the other, and the user picks a place twice. Each can be cancelled or
  fail on its own, so the export can end with one file saved and the other not; the alert says
  which, and nothing retries the missing file — the user exports both again. With nothing saved
  the Export sample deck dialog stays open, with no alert when both were cancelled. The dialog's
  text is longer than before and the dialog does not scroll. Decks imported from the old
  hand-written sample keep the answer it broke, `Buenos d&iacute`, because nothing rewrites an
  imported card, and the old export's cache file `sample-deck.csv` stays on a device until the
  system clears the cache. `samples/` has to be regenerated whenever the sample, a serialiser or
  the deck file version changes; `sampleDeck.test.ts` fails until it is, by design. Since format
  version 2 a file carries no category colour
  ([ADR-0019](decisions/0019-deck-file-format-version-2.md)). **Nothing of it has been seen on a device** — none was attached when the work landed:
  the dialog's text and whether it clips, including at a 1.3x font scale, the two save dialogs in
  sequence, the alerts for both saved, one cancelled and both cancelled, and the contents of the
  saved files are all outstanding ([ADR-0016](decisions/0016-deck-export-file-formats.md)
  Amendment 3).
- **The Edit deck and New deck screens are not covered by any test that renders.** `deckEdit.ts`
  — `isNewDeckDraftBlank` and `newDeckInputOf` included — and the reducer cases are tested; the
  screen's draft state, the Save button's enabled state, the discard prompt, the remove
  confirmation, the Category field and picker, and the comparison against the deck's resolved
  category are not. Nor is its new-deck mode: the choice of mode from `route.name`, the blank
  start, Save calling `addDeck` rather than `updateDeck`, the `saved` ref that stops a double-tapped
  Save creating two decks, and the Add deck menu's navigation to it. A regression in any of them
  passes `npm test`; only a device run catches it.
- **Category icons are Android-only.** `Image` renders an XML vector drawable only on Android; on
  iOS every Category icon would be blank — on a Category tile, in the Category picker, and in every
  Category square (Deck and Session cards, their Menu sheet titles, the Deck stats card, the Deck
  statistics screen's Category pill, the Category field) alike. The
  tile and the square paint their own background in the category's colour, so a categorised deck
  would still show a coloured square, just with no glyph. Read from the code, not observed. An iOS
  build would need another source for the icons
  ([ADR-0013](decisions/0013-category-icons-are-android-vector-drawables.md),
  [ADR-0014](decisions/0014-deck-belongs-to-one-category.md) Amendments 1 and 2).
- **Adding or renaming a category icon needs a native rebuild, and a shipped icon key can never be
  renamed or removed.** The drawables are compiled by AAPT into the APK, so a change under
  `src/assets/category-icons/` is not picked up by a Metro reload. A custom category stores its
  icon's key, so renaming or removing one reads every category that used it as the fallback icon,
  and the next save keeps that; only a label can change freely (ADR-0013 Amendment 2). Every
  drawable ships in the APK whether or not anyone picks it.
- **Category icons are verified in the release build only.** The default categories' icons were
  seen rendering and tinted in a release APK on a device; whether a debug build served by Metro
  shows them has not been checked (ADR-0013). For the extra icons, a release build bundled all
  106 drawables into its drawable resources with no AAPT errors, and on a phone running it the New
  category screen's Icon picker rendered every glyph, none blank, missing or clipped; selecting an
  extra icon marked its cell and updated the preview, and a custom category saved with one showed
  on the Categories tab and survived a force-stop and relaunch. Not checked: TalkBack, a large font
  scale, and the accessibility labels beyond the cells visible at the time.
- **The icon licence does not reach the APK, and the extra icons' source is inferred.**
  `src/assets/category-icons/NOTICE` carries the attribution and the Apache-2.0 notice in the
  repository for every icon there, but it is not bundled, and the app shows no licence or
  attribution anywhere (ADR-0013 Amendment 1). The extra icons are treated as Material Symbols from
  their names and format; the owner has not stated their source, and an icon found not to be one
  must leave that directory (ADR-0013 Amendment 2).
- **The Icon picker is one long grid inside the New category form.** It offers every icon in a
  plain wrapping grid, not virtualised, inside the screen's one scroll view, so scrolling down to
  pick an icon takes the preview Category tile and the Name field out of view. Accepted when the
  extra icons landed.
- **Two `isHexColor`s, with different rules.** The categories loader's, in `utils/categories.ts`,
  accepts `#rgb`, `#rgba`, `#rrggbb` and `#rrggbbaa` in either case; the one in `utils/color.ts`
  accepts only `#rrggbb`. The app writes only lowercase `#rrggbb`, so the difference reaches only
  hand-edited or foreign data, which the loader keeps and displays — short, upper-case or
  translucent, and unchecked for contrast (ADR-0012 Amendment 3). Importing the wrong one is silent:
  the strict check in the loader would read every such colour as the first palette colour, and the
  next save would keep that.
- **A custom category can only be added or deleted.** There is no rename, recolour or icon change,
  and no undo for a delete beyond creating it again, which mints a new id — so the decks the delete
  detached stay uncategorised. Defaults cannot be changed, hidden or deleted
  ([ADR-0012](decisions/0012-custom-categories-third-storage-key.md)).
- **A deck's category is chosen only on the deck form, and only displayed.** The Category field of
  the Edit deck screen, and of the New deck screen when a deck is created by hand
  ([ADR-0014](decisions/0014-deck-belongs-to-one-category.md) Amendment 5), is the only place a
  user picks one. Beyond that, only
  an import sets one, from either file, and only when the file's category reference resolves on
  this device ([ADR-0019](decisions/0019-deck-file-format-version-2.md)). It shows as a
  Category square on the Deck card, the Session card, their Menu sheet titles, the Category field,
  the Statistics screen's Deck stats card
  ([ADR-0014](decisions/0014-deck-belongs-to-one-category.md) Amendment 2) and the Category pill
  of the Deck statistics screen's Deck identity row (ADR-0014 Amendment 6); nothing groups or
  filters by it, and only the delete confirmation counts it. There is no deck count ("N entries") on a Category tile, no filtering
  of the Decks or Learn screen by category — and no control for it: the Header toolbar's
  placeholder **Filter button** was removed (ADR-0014 Amendment 7) — and no
  per-category aggregation or filter in Statistics. Each is an open follow-up (ADR-0014 *Not decided here*
  and Amendments 2 and 8). The default ids
  `default_<icon key>` are now stored on decks and written into every exported deck file, and must
  never change; withdrawing a default needs a rule for the decks and files that use it (ADR-0012,
  ADR-0014, ADR-0019).
- **The Category picker opens scrolled to the top.** A selected category further down the
  alphabetical grid is off-screen until the user scrolls, so the picker does not show at a glance
  what the deck has.
- **A session shows its deck's category now, not the one it was studied under.** Sessions store no
  category, so re-categorising a deck changes the square on all its sessions, cleared ones
  included, and nothing records which category a deck had when a session was studied
  ([ADR-0002](decisions/0002-sessions-are-snapshots.md) Amendment 6).
- **A stored `categoryId` that resolves to nothing stays stored.** It displays as no category but is
  not rewritten on load. Only a Save on the Edit deck screen, which writes `null`, clears it — and
  the screen does not count such an id as a change, so Save stays disabled until something else
  changes. It arises only when the category it named is gone without the app deleting it — a
  corrupt categories key read as `[]`, or a foreign write — because the app's own delete detaches
  decks (ADR-0014).
- **`FormField` has no error, `maxLength` or `onBlur` prop.** The New category screen cuts its name
  input to the length limit by hand and renders its own helper line beneath the field; the next
  form that needs either will have to do the same or extend `FormField`.
- **Some menu entries are placeholders.** *Settings* shows a "not available yet" alert. It is a
  deliberate stub, not a bug. *Add deck manually* was one and now opens the New deck screen
  ([ADR-0011](decisions/0011-deck-editing-is-one-action.md) Amendment 4). The Header toolbar's
  **Filter button**, a stub on the Decks and Learn screens, was removed rather than built
  ([ADR-0014](decisions/0014-deck-belongs-to-one-category.md) Amendment 7).
  The Import format menu, which once listed XML and JSONL placeholders beside CSV and JSON, is gone:
  the placeholders were removed (ADR-0017) and then the menu itself, because the format is now
  detected from the file's content (ADR-0017 Amendment 1). XML and JSONL are not to come back as
  stubs.
- **The whole store is written on every change.** Every key is serialised and written as a full
  array for a single answer — the categories key included, though an answer never changes it. At
  the volumes a hand-imported CSV produces this costs nothing; it does not scale
  to a large library, and nothing currently bounds deck size or the number of kept sessions,
  cleared ones included.
- **A re-import is always a new deck.** Card ids are minted at import, so importing an updated
  version of a file produces a second deck and a second set of counters rather than updating the
  first. There is no identity for a card beyond its generated id.
- **iOS is unbuilt and unverified.** The `ios/` project exists and the dependency list is
  cross-platform, but everything here has been built and run on Android only. Category icons are
  known not to render there (see above), and `react-native-svg` would need a `pod install`
  (ADR-0018). Treat an iOS claim as
  unverified unless someone ran it.
- **No error surface for a failed write.** `saveDecks` / `saveSessions` / `saveCategories` failures
  are caught and discarded so a session is not interrupted. The user is told nothing, and the loss
  is only discovered on the next launch.
- **After a failed load, nothing done in that run is saved.** Saving is blocked while `error` is set
  so the empty state cannot overwrite the stored data. A deck imported or a session studied before
  the next successful launch is lost, and the only sign is the error line on the Decks screen
  ([ADR-0004](decisions/0004-versioned-defensive-storage.md) Amendment 2). Any one key failing to
  load is enough, so an unreadable categories key also stops decks and sessions being saved
  ([ADR-0012](decisions/0012-custom-categories-third-storage-key.md)).
- **The translated UI has not been seen on a device in any language.** The migration to the
  catalogue changed text on every screen and component, none of which a test renders; English,
  the pseudo-language and every translation are unchecked on a phone. Only the device's locale reading was checked,
  before the migration
  ([ADR-0020](decisions/0020-ui-text-translated-through-typed-catalogue.md) Amendment 1).
- **The translations are machine-written and unreviewed.** No native speaker has read them, and
  how their longer text fits — at large font sizes especially — has not been checked on a device.
  Portuguese is Brazilian wording only, registered as `pt`. French, Spanish, Italian and
  Portuguese have no CLDR `many` form for exact millions, deliberately, so such a count reads with
  the `other` form (ADR-0020 Amendment 2). Chinese is Simplified only, registered as `zh-CN`:
  Traditional tags (`zh-TW`, `zh-Hant-TW`, `zh-HK`) fall back to English deliberately, and by the
  same matching rule so do a Simplified tag with another region, such as `zh-SG`, and a bare `zh`
  (ADR-0020 Amendment 3).
- **The pseudo-language cannot be selected on the test phone as designed.** It answers only to the
  tag `en-XA`, and the Samsung test phone ignores a per-app `en-XA`; seeing it there needs a
  throwaway build that registers it under a tag the phone honours, such as `de`
  (ADR-0020 Amendment 1, `AGENTS.md` *Dependency traps*).
- **The lint guard is a net with holes.** The `no-restricted-syntax` override in `.eslintrc.js`
  covers `src/screens/`, `src/components/` and `src/navigation/` only, and does not see text built
  by concatenation, by a helper function, or passed as a plain function argument. A literal in
  pure code or a service, or one the guard misses, shows in English in every language and no test
  fails (ADR-0020 Amendment 1).
- **The language is read once per run.** `I18nProvider` reads the device tag when it mounts;
  whether a language change made while the app runs is followed is unknown, so assume it needs a
  restart. There is no in-app language picker — it would be a stored setting
  ([ADR-0020](decisions/0020-ui-text-translated-through-typed-catalogue.md)).
- **Right-to-left text is shown in a left-to-right layout.** A right-to-left translation's text
  runs right to left within each line, but nothing is mirrored: the hand-drawn icons, the Study
  screen's swipe direction and every row keep their left-to-right design, and by React Native's
  text code a text with no `textAlign` is aligned to the left. Real mirroring, or another
  right-to-left language, needs asking (ADR-0020 Amendment 3).
- **The first launch on a right-to-left device can still be mirrored once.**
  `keepLayoutLeftToRight()` sets a preference React Native reads when it creates the root view,
  so it holds from the second cold start; clearing the app's data makes the next launch a first
  launch again. `I18nManager.getConstants().isRTL` stays `true` for that first run.
  `android:supportsRtl="false"` in `android/app/src/main/AndroidManifest.xml` would close this, but
  the manifest still says `"true"` and changing it needs the owner's approval, which has not been
  given (ADR-0020 Amendment 3). Neither behaviour has been observed on a device.
- **Some text stays English in every language.** The error details native code supplies — after
  a translated lead-in in the *Import failed* alert and the sample deck export, and on their own
  as the *Export failed* alert's message — the sample deck, and the Android app name. A failed
  load shows only the catalogue's generic message; its detail stays in `State.error` and is not
  shown at all (ADR-0020 Amendment 1).
- **Text and formats can disagree.** Dates and numbers keep the device's regional format whatever
  the text language, so a language with no catalogue shows English text with local dates, and
  percentages are not localised. A deck imported with no usable title or file name keeps the
  default name of the language active at import. Plural rules are hand-written per language;
  `locales.test.ts` checks that every form a rule returns exists and that each rule gives the CLDR
  form for a handful of integers, so a rule wrong only for an untested count still passes
  (ADR-0020, Amendment 3).
- **A custom category can collide with a built-in name in another language.**
  `validateCategoryName` compares a new name with the built-ins' names in the current language and
  in English only, so a name that is a built-in's name in a third language is accepted, and two
  tiles read the same once the device switches to that language. With translations registered,
  this can now happen.
