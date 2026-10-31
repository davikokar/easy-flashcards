# Easy Flashcards — Architecture

Easy Flashcards is a React Native flashcards app, built and tested on Android. The user imports a
deck from a local CSV file, studies it card by card, and the app records how well each card is
known. It has no account, no network calls, and no backend. Everything it stores is in AsyncStorage
on the device, one key per module in `src/storage/` (§5); the only times it leaves the app are to
pick a file to import and to save the sample deck out.

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
| Decks | **Decks screen** | Every imported deck as a **Deck card**: its **Category square** at the top left, and again before the title of its **Deck options menu**, when the deck has a category ([ADR-0014](decisions/0014-deck-belongs-to-one-category.md) Amendment 1), its card count, a **Mastery bar** splitting its reviews into Ok / Okeish / Not ok, its session and active-session counts, and its last session date. Where a deck is imported, started, edited, and deleted. A deck's description, when it has one, shows under its card count. The **Start session button** starts in deck order and not inverted; the Deck options menu's **Start session with options** opens the **Session setup dialog**, where **Inverted** and **Shuffle** are chosen independently ([ADR-0010](decisions/0010-inverted-sessions.md)). | `DecksScreen`, route `DecksList` |
| Decks | **Edit deck screen** | One deck's title, description, category and cards in editable fields: add a card, remove a card, edit a card's question and answer. The **Category field** under the description opens the **Category picker**, which offers the **No category choice** and then every default and custom category in one alphabetical grid ([ADR-0014](decisions/0014-deck-belongs-to-one-category.md)). Nothing is written until **Save**, which commits the whole edit in one action ([ADR-0011](decisions/0011-deck-editing-is-one-action.md)); leaving with unsaved changes asks first. | `EditDeckScreen`, route `EditDeck` (param `deckId`) |
| Learn | **Learn screen** | Every listed session — active, or completed and not cleared — as a **Session card**, active ones first and most recently touched first within each group. A card shows the **Category square** of its deck's category as it is now, and again before the title of its **Session options menu** — none when the deck has no category or no longer exists, because a session stores no category ([ADR-0014](decisions/0014-deck-belongs-to-one-category.md), Amendment 1) — a **Session status pill** (followed by an **Inverted pill** on an inverted session), a **Session results bar** splitting the session's cards into answered Ok / Okeish / Not ok and unanswered, and a footer with the start date and icon-only buttons: **Resume** on an active session; on a completed one the **Review errors button** — shown while the session has missed or unsure cards that still exist in its deck, with a **Review badge** giving how many are outstanding, or a tick and the button disabled once every one is fixed — then the **Replay button**. Where a session is resumed; replayed — a new session over the original's cards that still exist, in its order, which **also clears the original** ([ADR-0008](decisions/0008-clear-completed-sessions.md) Amendment 1); restarted over the whole deck with **Start a new session**, which leaves the original untouched; its errors reviewed, which opens the Study screen in review mode and creates no session ([ADR-0009](decisions/0009-error-review-marks-cards-fixed.md)); an active one discarded (a real delete); and a completed one cleared, singly or all at once (hidden from the list but still counted — ADR-0008). Every session started from a session keeps its `inverted`. | `LearnScreen`, route `LearnList` |
| Learn | **Study screen** | One session, in its direction — an inverted session shows each card's answer first and an **Inverted pill** in the Progress header ([ADR-0010](decisions/0010-inverted-sessions.md)): the flip card, the icon-only answer buttons (Not Ok, Okeish, Ok — [ADR-0007](decisions/0007-okeish-third-answer.md)), the answered-so-far strip, and the **Session summary**, which offers **Review the {n} missed or unsure** (switching to review mode over the same session) and **Study the whole deck again** (a new session in the same direction). With `mode: 'review'` on a completed session it is in **review mode** instead: **Review passes** over the session's outstanding missed or unsure cards, each pass a snapshot shown once per card in the session's direction, ending on the **Review summary**. Only an Ok given in a review writes anything, and all it writes is that the card is fixed ([ADR-0009](decisions/0009-error-review-marks-cards-fixed.md)). | `StudyScreen`, route `Study` (params `sessionId`, optional `mode: 'review'`) |
| Categories | **Categories screen** | Two sections of **Category tiles** — a coloured square with the category's **Category icon**, and its name beneath. The **Custom categories section** lists the user's own categories by name, ignoring case, or a hint when there are none; the **Default categories section** lists the built-in ones, which are constants in code and never stored ([ADR-0012](decisions/0012-custom-categories-third-storage-key.md)). A custom tile opens the **Category options menu**, whose only item is **Delete category**; a default tile does nothing. The **New category button** sits in a footer below the scrolling content. Deleting a custom category detaches it from every deck that uses it, and the confirmation says how many decks will have no category ([ADR-0014](decisions/0014-deck-belongs-to-one-category.md)). A tile shows no deck count. | `CategoriesScreen`, route `CategoriesList` |
| Categories | **New category screen** | A preview **Category tile**, the **Name field**, the **Colour picker** and the **Icon picker**. **Save** stays disabled until the name passes `validateCategoryName`, then adds the category and goes back; leaving with unsaved changes asks first. There is no screen for editing a category. | `NewCategoryScreen`, route `NewCategory` |
| Statistics | **Statistics screen** | Totals across every deck, then one row per deck. A search narrows the rows and leaves the totals. | `StatsScreen`, route `StatsOverview` |
| Statistics | **Deck statistics screen** | One deck's totals and every card in it, hardest first. | `DeckStatsScreen`, route `DeckStats` (param `deckId`) |

The detail screens are reached by pushing onto their tab's stack: **Edit deck** from the Decks
screen's Deck options menu, **Study** from the Learn screen (Resume, Replay, Review errors, Start a
new session) or from starting a deck, **New category** from the Categories screen's New category
button, and **Deck statistics** from the Statistics screen. The other screens are the roots of
their tabs and are reached only by switching tab.

There are no modal screens. Transient UI is an `Alert`, the **Menu sheet** (`MenuSheet`), a
bottom sheet rendered in a `Modal` and opened from a **Kebab menu** (`KebabMenu`), or a centred
`Modal` dialog: the **Export sample deck dialog** inside `AppMenu`, the **Session setup dialog**
(`SessionSetupDialog`) that the Decks screen opens, and the **Category picker** (`CategoryPicker`)
that the Edit deck screen's Category field opens. The Category options menu is a
Menu sheet too, opened by the Categories screen rather than by a Kebab menu. The **App menu**
(`AppMenu`) in the header is one of those kebab menus; on the Decks, Learn and Statistics screens
it sits at the end of the **Header toolbar** (`HeaderToolbar`), after the **Search button** and —
on Decks and Learn only — the **Filter button**, and on the Learn screen it carries **Clear
completed sessions** ahead of its common items. The Categories screen has no Header toolbar and
no search; its header carries the App menu alone. The Search button opens
the **Search bar** (`SearchBar`) above the screen's list, which narrows the list by deck name as
the user types; see §3 for how a title matches.

---

## 2. Data flow

```
AsyncStorage                              Device (SAF)
  @easy-flashcards/decks/v1                 @react-native-documents/picker
  @easy-flashcards/sessions/v1              @dr.pogodin/react-native-fs
  @easy-flashcards/categories/v1                    │
        │                                           │
  decksStorage.ts                           services/importDeck.ts
  sessionsStorage.ts                        services/exportSampleDeck.ts
  categoriesStorage.ts                              │
   (load / save / normalise)                        │
        │                                     utils/csv.ts (PapaParse)
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
                        │    utils/search.ts and utils/categories.ts
                        │    inside useMemo)
                        │
              Components (see §3 for the list)
                        ← plain props + callbacks, no store access
```

The loop is one-way: a screen calls a function on the context, the reducer produces a new state
object, React re-renders, and a `useEffect` watching `state.decks`, `state.sessions` and
`state.categories` writes every key back. No screen writes storage, and no storage module knows
about React.

**Nothing derived is stored.** Success rates, session progress, orderings, and difficulty rankings
are computed from the raw counters by pure functions in
[`src/utils/stats.ts`](../../src/utils/stats.ts), called from a `useMemo` in the screen that needs
them. The only persisted tallies are a card's per-answer counters — one for each `Answer` in
[`src/types.ts`](../../src/types.ts) — and they are raw. Okeish counts as a review but earns no
credit in any success rate ([ADR-0007](decisions/0007-okeish-third-answer.md)).

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
`Session` the existing actions carry. Only the Decks screen chooses a direction: the **Start
session button** passes `false`, the **Session setup dialog** passes the user's choice. A session
created from an existing one — the Learn screen's **Replay button** (`replaySession`) and **Start a
new session** (`startSession` over the whole deck), and the Session summary's **Study the whole
deck again** (`startSession`) — passes the source session's `inverted`, and a review pass shows its
session's cards in that session's direction. Which face is shown first comes only from `cardFaces`
in `utils/cardFaces.ts`; answers, card counters and every `stats.ts` function ignore direction —
[ADR-0010](decisions/0010-inverted-sessions.md).

**Clearing a session archives it; it does not delete it.** `clearCompletedSessions` and
`clearSession` stamp `clearedAt` on completed sessions, which hides them from the Learn screen and
leaves every session statistic unchanged. `deleteSession` still removes a record outright and is
used only to discard an active session; `deleteDeck` and `resetDeckStats` remove a deck's sessions,
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
`categoryId` — `null` for none, and `null` on every imported deck — and nothing checks it on load.
`findCategory(id, customs)` is the one resolution: the default or stored custom category with that
id, or `null`. The reducer and every screen that shows a category go through it, so an id that
resolves to neither displays as no category everywhere. A session stores no category; the Learn
screen resolves it through `session.deckId` → `deck.categoryId`, so re-categorising a deck changes
the square on its existing sessions, cleared ones included, and a session whose deck is gone shows
none ([ADR-0002](decisions/0002-sessions-are-snapshots.md) Amendment 6).
`addCategory({ name, color, icon })` trims the name, mints a `category_` id with `createId`,
dispatches `addCategory` and returns the new category; it does not validate the name — the New
category screen calls `validateCategoryName` first and keeps Save disabled until it passes.
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
| [`csv.ts`](../../src/utils/csv.ts) | `parseFlashcardsCsv` — wraps PapaParse, detects the delimiter, matches the `Question` / `Answer` headers case-insensitively, skips incomplete rows and counts them, throws `CsvImportError` on a file it cannot use. Also `deckNameFromFileName`. |
| [`html.ts`](../../src/utils/html.ts) | A tolerant HTML parser: `parseHtml` to `HtmlNode[]`, `decodeEntities`, and the `BLOCK_TAGS` set. It never throws — unclosed and stray tags are absorbed, and an unclosed `<li>` or `<p>` is closed when its next sibling opens. |
| [`stats.ts`](../../src/utils/stats.ts) | Every derived number in the app: `successRate`, `answerShares`, `sessionProgressShares` (each answer's share of a session's cards rather than of its reviews, scaled down together if the results ever outnumber the cards), `resolvableCardIds` (the given card ids that still exist in a deck, in the given order — what the Learn screen's Replay passes to `replaySession`, and what every review derivation filters through), `getDeckStats`, `getGlobalStats`, `getSessionTally`, `canRecordAnswer` (the reducer's guard for `recordAnswer`: only an active session's next unanswered card is accepted, so a repeated or out-of-order answer is a no-op), `getMissedOrUnsureCardIds`, `getReviewableCardIds`, `getOutstandingReviewCardIds` and `getReviewState` (the error review's derived values — see below), `normalizeFixedCardIds` (the sessions loader's rule for `fixedCardIds`), `applyReviewAnswer` (the transform behind `recordReviewAnswer`, returning the same array when nothing changes), `prependSessionClearing` (the transform behind `replaySession`: the new session first, its source cleared with `clearSessionAt` semantics), `summarizeSessions`, `summarizeSessionsByDeck` (with `EMPTY_SESSION_SUMMARY` for a deck that has none), `isSessionActive`, `isSessionCleared`, `listedSessions` (the sessions the Learn screen shows), `clearableSessionCount` (completed sessions not yet cleared), `clearCompletedSessionsAt` and `clearSessionAt` (the transforms the reducer applies to clear sessions, returning the same array when nothing qualifies), `previousReviewIndex` (where a review swipe right on the Study screen lands — one answered card back, wrapping from the oldest round to the frontier), `sortSessions`, `sortCardsByDifficulty`, `cardReviewCount`, and the `formatRate` / `formatDate` display helpers. |
| [`fileUri.ts`](../../src/utils/fileUri.ts) | `fileUriToPath` and `pathToFileUri` — the percent-encoding boundary between a `file://` URI and a path. |
| [`search.ts`](../../src/utils/search.ts) | The title search behind the Search bar. `splitSearchWords` lower-cases a query, splits it on whitespace, `-`, `_` and `.`, and drops empty and repeated words; `titleMatchesWords` is true when every word occurs in the title as a literal substring, in any order; `filterByTitle(items, query, getTitle)` combines the two, and returns `items` itself — not a copy — for a query with no words, so a memoised list keeps its identity. |
| [`shuffle.ts`](../../src/utils/shuffle.ts) | `shuffle(items, random = Math.random)` — Fisher-Yates over a copy; the input is never mutated. `random` is injectable so tests are deterministic. The Decks screen uses it to order the `cardIds` it passes to `startSession` when **Shuffle** is ticked in the Session setup dialog. Shuffling is not stored; the order is the `cardIds` themselves. |
| [`cardFaces.ts`](../../src/utils/cardFaces.ts) | `cardFaces(card, inverted)` — the session's direction applied to a card: `{ front, back }`, the `question` then the `answer`, swapped when `inverted`. The single place a direction is applied; the card itself is never rewritten. Also `readInverted(value)`, the sessions loader's rule for the stored flag: `true` only for an exact `true` ([ADR-0010](decisions/0010-inverted-sessions.md)). |
| [`storedArray.ts`](../../src/utils/storedArray.ts) | `parseStoredArray(raw)` — the rows of a stored JSON array; `[]` for a missing, unparseable or non-array value. Every loader reads through it, so a corrupt key never throws. |
| [`sampleDeck.ts`](../../src/utils/sampleDeck.ts) | `SAMPLE_DECK_CSV` and `SAMPLE_DECK_FILE_NAME` — the built-in sample deck that `exportSampleDeck` writes out. Raw assets are not bundled, so it is a copy of `samples/sample-deck.csv`; a test checks that the two parse the same. |
| [`deckEdit.ts`](../../src/utils/deckEdit.ts) | The pure side of editing a deck ([ADR-0011](decisions/0011-deck-editing-is-one-action.md)). `CardDraft` / `DeckEdit` are the editor's shapes — a `DeckEdit` carries the `categoryId` beside the title, description and cards; `draftsOf`, `isDeckEditChanged` (what the Save button and the discard prompt rest on; a different `categoryId` counts as a change), `removedCardIds` and `firstIncompleteCard` serve the Edit deck screen. `applyDeckEdit(deck, name, description, categoryId, cards)` is the transform behind `updateDeck` — it writes the category id it is given, which the reducer has already resolved; existing cards keep their counters, new ones start at zero, the list's order becomes the deck's — and `reconcileSession` applies the edit to a session: the new `deckName`, and for an active session the removed cards dropped from its unanswered part, which can complete it or, left with no cards and no answers, delete it (`null`). |
| [`categories.ts`](../../src/utils/categories.ts) | The pure side of categories ([ADR-0012](decisions/0012-custom-categories-third-storage-key.md)). The icon keys are plain TypeScript — no `.xml` is imported here, so Jest can load it ([ADR-0013](decisions/0013-category-icons-are-android-vector-drawables.md)). `DEFAULT_CATEGORY_ICONS` are the default categories' icons; `EXTRA_CATEGORY_ICON_LABELS` maps each extra icon, which belongs to no default category, to a label saying what it shows, and its key order — by label, ignoring case — is the order of `EXTRA_CATEGORY_ICONS`; `CATEGORY_ICONS` is the full set a custom category chooses from, the defaults' icons first, then the extras (ADR-0012 Amendment 2, ADR-0013 Amendment 2). Every key is permanent once shipped; a label is not. `getCategoryIconLabel` is a default icon's category name, or an extra icon's label. `FALLBACK_CATEGORY_ICON`, typed as a default icon, is the key the loader substitutes for an unknown one, which the New category screen also starts on. `DEFAULT_CATEGORIES` are the built-in categories, alphabetical, each coloured by its position in `categoryPalette`, with `createdAt: 0`. `validateCategoryName(input, customs)` is the name rule — trimmed, non-empty, at most `CATEGORY_NAME_MAX_LENGTH`, unique ignoring case across defaults and customs — returning the trimmed name or a reason (`empty`, `tooLong`, `duplicate`). `isCategoryIcon` (over the full set) and `isHexColor` are the loader's checks. `sortCategoriesByName` orders by name ignoring case; the Categories screen uses it for the custom section. `findCategory(id, customs)` resolves a deck's `categoryId` to the default or custom category with that id, or `null` for `null` or an id that matches neither — the one resolution behind `updateDeck` and every screen that shows a category ([ADR-0014](decisions/0014-deck-belongs-to-one-category.md)). `countDecksInCategory(decks, id)` is how many decks a delete detaches. `getAllCategories` (defaults and customs together, sorted) is the Category picker's list. `isDefaultCategoryId` is tested but not called from `src/`. |

`isSessionActive` is the single definition of "active": `completedAt === null`. Do not write that
comparison anywhere else. `isSessionCleared` is the same for "cleared": `clearedAt !== null`. Only
a completed session can be cleared, so a session is active, completed and listed, or completed and
cleared. `summarizeSessions`, `summarizeSessionsByDeck` and the Statistics screen's Sessions tile
count cleared sessions deliberately, and a test pins it
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
draws. `sessionProgressShares(tally, cardCount)` is the same split over a session's cards instead,
so its shares sum to the answered fraction, and is what the Session results bar draws. Neither is a
success rate and neither replaces one. Code that computes Not Ok as "everything that is not Ok" silently counts Okeish as
Not Ok — [ADR-0007](decisions/0007-okeish-third-answer.md).

### `src/types.ts` — the shapes

`Card`, `Deck`, `Answer`, `SessionResult` and `Session` are what is persisted; a `Deck` carries
`description` and `categoryId` (a category id, not checked against the categories, or `null`), and
a `Session` carries `clearedAt`, `fixedCardIds` and `inverted` beside its snapshot, and no category. The derived `DeckStats`,
`SessionSummary`, `AnswerTally`, `AnswerShares` and `ReviewState` are what
`stats.ts` returns and are never stored. `Category` (`id`, `name`, `color`, `icon`, `createdAt`) is
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
provider. `recordAnswer` is guarded by `canRecordAnswer`, and the two clear actions,
`replaySession` and `recordReviewAnswer` delegate to `clearCompletedSessionsAt`, `clearSessionAt`,
`prependSessionClearing` and `applyReviewAnswer` — all in `stats.ts`. One private `createSession`
helper in `DecksContext.tsx` builds the session for both `startSession` and `replaySession`, with
`clearedAt: null`, `fixedCardIds: []` and the `inverted` it is given. `addDeck` builds an imported
deck with `categoryId: null`. `addCategory` and `deleteCategory` are the two category actions, and
`deleteCategory` also detaches the category from every deck that uses it; `updateDeck` resolves the
edit's `categoryId` against `state.categories` with `findCategory` (see §2). `State.categories`
holds custom categories only.
[ADR-0003](decisions/0003-single-context-reducer-store.md) keeps it the only store.

### `src/services/` — the device boundary

| File | Role |
|---|---|
| [`importDeck.ts`](../../src/services/importDeck.ts) | `pickAndParseCsv` — opens the system picker, copies the chosen file into the app cache, reads it, parses it, and returns `{ deckName, fileName, parsed }`. Throws `ImportCancelledError` when the user backs out. |
| [`exportSampleDeck.ts`](../../src/services/exportSampleDeck.ts) | `exportSampleDeck` — writes the built-in `SAMPLE_DECK_CSV` (from `utils/sampleDeck.ts`) to the cache and opens the system save dialog. Throws `ExportCancelledError` on cancel. |

A cancelled picker is a normal outcome, not an error, which is why each service has its own
cancellation error type for the caller to catch and ignore.

### `src/screens/` — the stateful half

One file per screen. Each calls `useDecks()` and `useNavigation()`, derives what it needs with
`stats.ts` inside a `useMemo`, and renders a `FlatList` of components. Some also hold local UI
state, which is neither in the store nor persisted. `DecksScreen`, `LearnScreen` and `StatsScreen`
each hold whether the Search bar is open and the query, and filter their list with `filterByTitle`
in a `useMemo`; closing the bar clears the query. The Decks and Statistics screens match on the
deck's `name`; the Learn screen matches on the session's `deckName` snapshot and searches only
`listedSessions`, so a cleared session never appears; the Statistics screen filters only its deck
rows, and its global totals still cover every deck. `DecksScreen` also holds import-in-flight,
which menu is open, and the Session setup dialog's deck, visibility, and **Inverted** and
**Shuffle** choices, which reset to unticked each time the dialog opens, and resolves each deck's
category with `findCategory` as it renders the Deck card; `LearnScreen` derives each listed
session's `getReviewState` in a `useMemo`, and in another each session's category, through its deck
(none when the deck is gone). `StudyScreen` holds the flip, the viewed card
index, and which card's answer has been revealed, and in review mode the current pass: a snapshot
of the outstanding card ids taken when the pass starts, the pass's own answers, and a pass number.
Its frontier is the length of whichever results apply — `session.results` in a session, the pass's
answers in review mode — and it resets all of that local state when `(sessionId, mode)` changes,
because a navigation to the mounted Study route updates its params rather than remounting it.
`EditDeckScreen` holds the draft of one deck — title, description, a category id and a list of card
drafts, each with a key that is stable while editing — initialised once from the stored deck, and
whether the Category picker is open. It resolves both the draft's category id and the deck's stored
one with `findCategory`, so a category deleted elsewhere mid-edit, or a stored id that resolves to
nothing, reads as no category and does not by itself count as a change; it derives whether anything
changed with `isDeckEditChanged` against the deck with its resolved category, passes the picker
`getAllCategories`, and intercepts leaving with the navigator's `beforeRemove` event until the edit
is saved. `CategoriesScreen` sorts the stored custom categories
with `sortCategoriesByName` in a `useMemo`, renders `DEFAULT_CATEGORIES` as they are, holds which
category the Category options menu is for and whether it is open, and counts the decks a delete
will detach with `countDecksInCategory` when the confirmation opens. `NewCategoryScreen` holds the
draft — name, colour (the first palette colour to start) and icon (`FALLBACK_CATEGORY_ICON` to
start) — and whether the name has been typed in yet, derives `validateCategoryName` in a `useMemo`,
and intercepts leaving with `beforeRemove` while the draft differs from that starting state and is
unsaved. Because `FormField` takes no `maxLength`, error or `onBlur`, the screen cuts the typed
name to `CATEGORY_NAME_MAX_LENGTH` itself and renders its own helper line — the error, once the
name has been typed in, and a character count.

### `src/components/` — the stateless half

| File | Role |
|---|---|
| [`Button.tsx`](../../src/components/Button.tsx) | The only button. Variants `primary`, `secondary`, `success`, `danger`, `warning`; handles `disabled` and `loading`. Takes an optional `icon` render function, passed the foreground colour for the variant; with no `label` it is icon-only, and its type then requires an `accessibilityLabel`. |
| [`FlipCard.tsx`](../../src/components/FlipCard.tsx) | The study card. Two faces, a `rotateY` interpolation, and a scrollable body. Owns the animation, not the flip state. Takes `front` and `back` — roles, not card fields: the Study screen fills them from `cardFaces`, so in an inverted session `front` is the card's answer. The `QUESTION` / `ANSWER` side labels stay positional. |
| [`RichText.tsx`](../../src/components/RichText.tsx) | Renders `parseHtml` output as nested `<Text>`. See §6. |
| [`SuccessBar.tsx`](../../src/components/SuccessBar.tsx) | The one visual encoding of a success rate. Used on the Study, Statistics and Deck statistics screens; the Decks screen shows a `MasteryBar` and the Learn screen a `SessionResultsBar` instead. An optional `color` overrides the rate-based colours for a bar that is not a success rate — the Study screen's session progress bar passes `colors.text`. |
| [`MasteryBar.tsx`](../../src/components/MasteryBar.tsx) | The Ok / Okeish / Not ok split of a deck's reviews: a segmented track plus a legend giving each answer's `AnswerIcon` (tick, question mark, cross, in the answer's colour) followed by its percentage. Takes the output of `answerShares`; with `null` it draws an empty track, grey icons, and `--` for each share. The panel carries one accessibility label summarising all three shares. |
| [`DeckCard.tsx`](../../src/components/DeckCard.tsx) | One deck on the Decks screen: a header with the **Category square** when given a `category` (no square and no gap otherwise), the name, card count and the **Deck options menu** (a `KebabMenu`), a `MasteryBar`, and a footer with the session counts, the last-session date and the **Start session button**. Takes display-ready values and callbacks; derives nothing. |
| [`HeaderToolbar.tsx`](../../src/components/HeaderToolbar.tsx) | The `headerRight` of the Decks, Learn and Statistics screens: the **Search button**, the **Filter button**, then the `AppMenu` in its `boxed` variant. The Filter button renders only when both `onFilter` and `filterLabel` are given, which the Statistics screen does not. `searchActive` tints the Search button and marks it expanded while the Search bar is open. Takes optional `menuItems` that it passes to `AppMenu` as `extraItems`. The buttons only call the callbacks they are given. It was `DecksToolbar` until the Learn screen used it. |
| [`SearchBar.tsx`](../../src/components/SearchBar.tsx) | The **Search bar**: a search glyph, an auto-focused `TextInput`, and the **Close search button**. Controlled — the screen owns the query and whether the bar is shown, and passes `value`, `onChangeText`, `onClose` and the placeholder. |
| [`SessionCard.tsx`](../../src/components/SessionCard.tsx) | One session on the Learn screen: a header with the **Category square** when given a `category` (no square and no gap otherwise), the deck name, the **Session status pill**, the neutral **Inverted pill** when `inverted` is set, and the **Session options menu** (a `KebabMenu`), a `SessionResultsBar`, and a footer with the start date and the icon-only **Resume**, **Review errors** and **Replay** buttons. Resume shows only on an active session and only when `onResume` is given; on a completed one, the Review errors button shows only when a `review` prop (`{ count, done, onPress }`) is given and the Replay button only when `onReplay` is. The Review errors button is the `warning` variant with a **Review badge** — a sibling of the button, so a disabled button's dimming does not fade it, and hidden from accessibility — showing the count (capped at `99+`), or a tick with the button disabled when `done`; the button's accessibility label states the count or that every card is fixed. The pills wrap, so the Inverted pill drops below the status pill on a narrow card. Takes display-ready values and callbacks; derives nothing. |
| [`SessionSetupDialog.tsx`](../../src/components/SessionSetupDialog.tsx) | The **Session setup dialog**: a centred `Modal` with the deck name, two independent checkbox rows — **Inverted** and **Shuffle** — and **Start** / **Cancel**. Controlled: the Decks screen owns the visibility and both choices, and starts the session in `onStart`. The backdrop and Back cancel. |
| [`SessionResultsBar.tsx`](../../src/components/SessionResultsBar.tsx) | A session's answered part: a segmented track whose Ok / Okeish / Not ok segments are each sized by their share of the session's cards, so the unfilled remainder is the unanswered part, plus a legend giving each answer's `AnswerIcon` and count, the icons grey while nothing is answered. Takes the output of `sessionProgressShares`, the tally and the card count. The panel carries one accessibility label. Not a success rate. |
| [`HistoryStrip.tsx`](../../src/components/HistoryStrip.tsx) | The answered-so-far tiles on the Study screen, coloured per answer — in review mode, the pass's answers; auto-scrolls to the current card. |
| [`EmptyState.tsx`](../../src/components/EmptyState.tsx) | Every list's `ListEmptyComponent`. |
| [`FormField.tsx`](../../src/components/FormField.tsx) | A labelled `TextInput`, single- or multi-line. Controlled; takes an optional `accessibilityLabel` that replaces the visible label as the accessible name. |
| [`CardEditor.tsx`](../../src/components/CardEditor.tsx) | One card on the Edit deck screen: a `Card {n}` header with a **Remove card button**, and a **Question** and an **Answer** `FormField`. `React.memo`'d, and takes `cardKey`-addressed callbacks so a keystroke re-renders only the card being typed in. |
| [`KebabMenu.tsx`](../../src/components/KebabMenu.tsx) | The three-dot control; opens a `MenuSheet`. Owns the open/closed state. An optional `variant="boxed"` draws the trigger as a bordered rounded square, matching the Header toolbar's buttons; the default is `plain`. Passes its optional `title` and `category` through to the sheet. |
| [`MenuSheet.tsx`](../../src/components/MenuSheet.tsx) | The bottom sheet, in a `Modal`. Defines the shared `MenuItem` type. An optional `title` heads the sheet above a separator; with an optional `category` as well, a 28-point `CategorySquare` sits before the title on the same row (no square and no gap without one; a category without a title shows nothing). Only the Deck card's and Session card's `KebabMenu`s pass a category. |
| [`MenuIcons.tsx`](../../src/components/MenuIcons.tsx) | `MenuIcon` — every menu icon, drawn from nested `View`s on a 20-point grid. Also carries glyphs used outside menus: `search` and `filter` in the Header toolbar, `search` and `close` in the Search bar, `close` on the Category picker's No category choice, `clock` in the Deck card and Session card footers, and `replay` on the Session card's Review errors and Replay buttons. An optional `size` scales the grid about its centre. |
| [`AnswerIcons.tsx`](../../src/components/AnswerIcons.tsx) | `AnswerIcon` — the tick, cross and question-mark glyphs for Ok, Not Ok and Okeish, drawn from rotated `View`s. Used on the Study screen's answer buttons, in the `MasteryBar` and `SessionResultsBar` legends, as the tick in a completed session's status pill, as the Review badge's done tick, as the Review summary's all-fixed tick, as the tick in a ticked Session setup dialog checkbox, and as the tick on a selected Colour picker swatch and a selected Category picker tile. Hidden from accessibility; the containing button or panel carries the name. |
| [`AppMenu.tsx`](../../src/components/AppMenu.tsx) | The header kebab menu. The one component that calls a service. Passes an optional `variant` through to its `KebabMenu`, and takes optional `extraItems` — screen-specific `MenuItem`s shown before Export sample deck and Settings — so a screen can add an item without `AppMenu` reading the store. |
| [`CategoryIcon.tsx`](../../src/components/CategoryIcon.tsx) | A **Category icon**: an `Image` of the Android vector drawable for an icon key, tinted with `tintColor`, at an explicit `size` (default 24) because a drawable has no intrinsic size. Holds the one `require` map from icon key to `.xml` file — the defaults' icons and the extras alike — typed as a `Record` over `CategoryIcon`, so a key with no drawable entry fails `npm run typecheck`; typecheck does not see the `require` path, so a path naming a missing file fails only when Metro bundles ([ADR-0013](decisions/0013-category-icons-are-android-vector-drawables.md) Amendment 2). Hidden from accessibility. The only icon not drawn from `View`s — [ADR-0013](decisions/0013-category-icons-are-android-vector-drawables.md). |
| [`CategoryTile.tsx`](../../src/components/CategoryTile.tsx) | A **Category tile**: a square filled with the category's colour, its `CategoryIcon` tinted `colors.background` on top ([ADR-0013](decisions/0013-category-icons-are-android-vector-drawables.md) Amendment 1), and the name beneath in two lines at most. Fills the width its parent gives it. Pressable only when `onPress` is given; `nameDimmed` greys the name for the New category screen's placeholder. `selected` makes a pressable tile a radio, ringed and ticked when true, as the Category picker uses it; `none` draws the **No category choice** instead — a dashed square with a `close` `MenuIcon` and no category colour or icon. |
| [`CategorySquare.tsx`](../../src/components/CategorySquare.tsx) | A **Category square**: a small rounded square (32 points by default, or the optional `size`) in the category's colour with its `CategoryIcon` tinted `colors.background`. Shown on the Deck card, the Session card and in the Category field, and at 28 points before the title of the Deck options menu and Session options menu sheets; an image for accessibility, labelled with the category's name, with no press behaviour. |
| [`CategoryField.tsx`](../../src/components/CategoryField.tsx) | The **Category field** on the Edit deck screen: a labelled row in `FormField`'s style with the `CategorySquare` and name, or a dimmed `No category`, and a chevron. A button that only calls `onPress`; the screen holds the draft and opens the picker. |
| [`CategoryPicker.tsx`](../../src/components/CategoryPicker.tsx) | The **Category picker**: a centred `Modal` with a scrolling three-column radio grid of `CategoryTile`s — the No category choice first, then the `categories` it is given — and a Cancel button. Picking calls `onSelect` then `onClose`; the backdrop, Back and Cancel close it unchanged. Controlled. |
| [`CategoryColorPicker.tsx`](../../src/components/CategoryColorPicker.tsx) | The **Colour picker**: a radio group of swatches, six to a row, one per colour of the `palette` prop; the selected one is bordered and carries a tick `AnswerIcon`. Controlled. |
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

- [`index.js`](../../index.js) — `AppRegistry.registerComponent`. The only `.js` file in the source.
- [`App.tsx`](../../App.tsx) — `SafeAreaProvider` → `DecksProvider` → `RootNavigator`.

---

## 4. Navigation

One bottom tab navigator, one native stack inside each tab. There is no drawer, no modal stack, and
no deep linking.

```
RootNavigator  (NavigationContainer, dark theme built from src/theme.ts)
└── Tab.Navigator          initialRouteName = active session ? 'LearnTab' : 'DecksTab'
    ├── DecksTab   → DecksNavigator  → DecksList     (DecksScreen)
    │                                → EditDeck      (EditDeckScreen)   param: deckId
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
`CategoriesIcon` is a two-by-two grid of outlined squares. The Categories tab never becomes the
launch tab.

**The navigator does not mount until the store has loaded.** `RootNavigator` reads `isLoading` from
`useDecks()` and renders an activity indicator until it is false. This is not a loading nicety: a
navigator's `initialRouteName` is read once, so choosing the launch tab from the persisted sessions
requires those sessions to already be in memory —
[ADR-0006](decisions/0006-launch-on-the-tab-with-unfinished-work.md).

**The Study screen is a route in the Learn stack, not a tab.** Starting a session from the Decks
screen therefore navigates across tabs:
`navigation.navigate('LearnTab', { screen: 'Study', params: { sessionId } })`. The Session summary
uses `replace` for both of its actions — **Study the whole deck again** to the new session, and
**Review the {n} missed or unsure** to the same `sessionId` with `mode: 'review'` — so the finished
summary does not pile up on the back stack. On the Learn screen the **Review errors button**
navigates to `Study` with `mode: 'review'`; Resume, Replay and Start a new session navigate without
it. Review mode applies only to a completed session: with an active, missing or deckless session
the Study screen shows its *Nothing to study* state.

The navigator sets no `headerRight`. Each tab's root screen sets its own with
`navigation.setOptions` in a `useLayoutEffect` and restyles the header (background colour and a
larger title). On the Decks, Learn and Statistics screens that is the **Header toolbar**, which
renders the App menu after the Search button and, on Decks and Learn, the Filter button; the Learn
screen's also passes **Clear completed sessions** to that App menu as an extra item. The Categories
screen sets the App menu alone, boxed. Detail screens carry no App menu; the New category screen's
`headerRight` is its **Save** button, as the Edit deck screen's is.

---

## 5. Persistence

One AsyncStorage key per module in `src/storage/`. Nothing else writes storage.

| Key | Holds | Module |
|---|---|---|
| `@easy-flashcards/decks/v1` | `Deck[]`, each with its `description` ([ADR-0011](decisions/0011-deck-editing-is-one-action.md)), its `categoryId` ([ADR-0014](decisions/0014-deck-belongs-to-one-category.md)), and its `Card[]` and their counters | [`decksStorage.ts`](../../src/storage/decksStorage.ts) |
| `@easy-flashcards/sessions/v1` | `Session[]` — active, completed, and cleared ([ADR-0008](decisions/0008-clear-completed-sessions.md)), each with its `fixedCardIds` ([ADR-0009](decisions/0009-error-review-marks-cards-fixed.md)) and its direction, `inverted` ([ADR-0010](decisions/0010-inverted-sessions.md)) | [`sessionsStorage.ts`](../../src/storage/sessionsStorage.ts) |
| `@easy-flashcards/categories/v1` | `Category[]` — the user's own categories only; the built-in ones are code ([ADR-0012](decisions/0012-custom-categories-third-storage-key.md)) | [`categoriesStorage.ts`](../../src/storage/categoriesStorage.ts) |

**Every key is loaded once**, in parallel, by a mount effect in `DecksProvider`, and if any one
load rejects the whole load fails. A corrupt or
non-array key reads as `[]` (`parseStoredArray`), so only a failure of AsyncStorage itself rejects.
That sets `error` and clears `isLoading`; the app starts empty rather than not at all, and the
Decks screen shows the message.

**Every key is written together**, as whole arrays, by a second effect watching `state.decks`,
`state.sessions` and `state.categories`. A `hasLoaded` ref suppresses the write that would otherwise fire immediately
after hydration, and **nothing is written while `error` is set**: after a failed load the state is
empty, and saving it would overwrite the data the read could not reach. A failed write is caught
and discarded, deliberately: a storage error must not take down a session in progress.

**Reads normalise and never throw.** Each loader drops malformed rows — a card with no `id`,
`question` or `answer`; a session whose `cardIds` is not an array — defaults missing timestamps to
now, clamps `results` to `cardIds.length`, reads a missing or non-numeric card counter as `0`,
preserves an answer of `'ok'`, `'okeish'` or `'notOk'`, and coerces any other answer to `'ok'`. A
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
earlier row's `id` is dropped; a `color` that is not a hex colour string reads as the first palette
colour (a well-formed hex outside the palette is kept), an `icon` that is not in `CATEGORY_ICONS` —
the defaults' icons and the extras — reads as `FALLBACK_CATEGORY_ICON`, a default category's icon
([ADR-0012](decisions/0012-custom-categories-third-storage-key.md) Amendment 2), and a non-numeric
`createdAt` as now. The name rule is not re-applied on
read ([ADR-0012](decisions/0012-custom-categories-third-storage-key.md)). The cost is silent data loss on a corrupt record; the alternative is an app that cannot start
([ADR-0004](decisions/0004-versioned-defensive-storage.md)).

**The `/v1` suffix is the migration mechanism.** A shape change the normaliser cannot absorb takes
a new key and converts from the old one on first read. Nothing rewrites what `/v1` means. A new
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
The opposite direction is not covered: an older
build reading data this one wrote loses the Okeish data, drops `clearedAt` so every cleared
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
([ADR-0012](decisions/0012-custom-categories-third-storage-key.md) Amendment 2).

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
  stray closing tag is dropped, and nothing throws. The input is a user's CSV file, so malformed
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
| UI | React Native primitives only — no component library, no icon font, no SVG library |
| Icons | drawn from nested `View`s, except the category icons: Android vector drawables in `src/assets/category-icons/`, rendered with `Image` by `CategoryIcon` ([ADR-0013](decisions/0013-category-icons-are-android-vector-drawables.md)) |
| Styling | `StyleSheet.create` against the tokens in [`src/theme.ts`](../../src/theme.ts), including `categoryPalette` |
| Navigation | React Navigation — bottom tabs + native stack, with `react-native-screens` and `react-native-safe-area-context` |
| State | React Context over `useReducer` |
| Persistence | `@react-native-async-storage/async-storage` |
| CSV | PapaParse, wrapped by `src/utils/csv.ts` |
| File picking and saving | `@react-native-documents/picker` |
| File reading | `@dr.pogodin/react-native-fs` |
| HTML | owned in-repo — `src/utils/html.ts` + `src/components/RichText.tsx` |
| Animation | the React Native `Animated` API, with `PanResponder` for the Study screen's swipe |
| Tests | Jest with `@react-native/jest-preset` — pure logic, the reducer, and the storage loaders with AsyncStorage mocked by `jest.mock`; nothing renders |
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

---

## 8. Known debt

- **No component tests.** `react-test-renderer` is a dev dependency and nothing imports it, and
  there is no `@testing-library/react-native`. The suite covers `src/utils/`, the reducer in
  `src/state/reducer.ts`, and the storage loaders; nothing renders. A screen or a component can
  break with the whole suite green, and so can the wiring in `DecksContext.tsx` — `createSession`,
  `addCategory`'s trim and id, the timestamps each function passes, and the load and save effects,
  including that every key is loaded and saved. The Categories and New category screens, the
  category components, and the name validation the New category screen relies on before calling
  `addCategory` are all untested. So is everything that shows a deck's category: the Category
  square on the Deck and Session cards and in their Menu sheet titles, the Category field and picker, the Learn screen's session →
  deck → category resolution, the delete confirmation's deck count, and `updateDeck` passing the
  edit's `categoryId` through `DecksContext`. Only `findCategory`, `countDecksInCategory`,
  `isDeckEditChanged`, `applyDeckEdit`, the icon keys and labels, the drawable file names, the
  reducer cases and the loader rule are tested. Adding a
  component-test setup is a dependency change and needs approval.
- **`deleteSession` deletes whatever it is given.** The rule that it is only for discarding an
  active session lives in the Learn screen, not the reducer; a future caller that deletes a
  completed session silently changes the session statistics
  ([ADR-0008](decisions/0008-clear-completed-sessions.md)).
- **Study review mode can only be checked on a device.** The pass snapshot, the pass's local
  answers, the frontier switching between `session.results` and the pass, the reset on a change of
  `(sessionId, mode)`, the empty pass that goes straight to the Review summary, and the rule that a
  review answer goes to `recordReviewAnswer` rather than `recordAnswer` all live in `StudyScreen`;
  the Learn screen's choice of `replaySession` for Replay and of review mode for the Review errors
  button lives in `LearnScreen`. Neither is tested. A review that recorded into the session would
  pass `npm test` and silently move every statistic
  ([ADR-0009](decisions/0009-error-review-marks-cards-fixed.md)).
- **Direction is not covered by any test that renders.** `cardFaces` is tested, but nothing checks
  that the Study screen passes it the session's `inverted`, or that every path creating a session
  from another passes the source's flag. A card shown the wrong way round passes `npm test`; only a
  device run catches it ([ADR-0010](decisions/0010-inverted-sessions.md)).
- **A downgrade silently loses Okeish data, un-clears every cleared session, forgets every fixed
  card, un-inverts every inverted session, drops every deck's description and category, and can
  replace a custom category's icon.** An
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
  [ADR-0014](decisions/0014-deck-belongs-to-one-category.md) and
  [ADR-0012](decisions/0012-custom-categories-third-storage-key.md) Amendment 2, not mitigated.
- **An error review is invisible to Statistics and cannot be undone.** A card fixed in a review
  keeps the rate its sessions gave it; Okeish and Not ok answers in a review are recorded nowhere;
  an accidental Ok removes the card from that session's later passes, and only a Replay or a new
  session — both counted — drills it again. A fixed id whose card later leaves the deck stays
  stored until *Delete deck* or *Reset statistics*. Accepted in
  [ADR-0009](decisions/0009-error-review-marks-cards-fixed.md).
- **Statistics cannot tell the directions apart, and shuffling is not recorded.** A card has one
  set of counters for both directions, so a card known one way and not the other shows one blended
  rate, and Hardest first cannot say which direction is hard. Whether a session was shuffled is
  visible only in its `cardIds` order. Accepted in
  [ADR-0010](decisions/0010-inverted-sessions.md).
- **Cleared sessions are kept forever and cannot be restored from the UI.** Clearing removes
  nothing, so the sessions key only grows — by one session per Replay, since a replay clears rather
  than replaces its original; only *Delete deck* and *Reset statistics* shrink it. There is no
  *restore* and no *show cleared*: a session cleared by mistake stays hidden though its data is
  intact, and its review state is hidden with it. Accepted in
  [ADR-0008](decisions/0008-clear-completed-sessions.md).
- **A deck's statistics can fall out of step with its sessions'.** Removing a card in the Edit deck
  screen deletes its counters for good, but every session that included it keeps its answers, so a
  deck's totals can be lower than the sum over its sessions. A completed session may also list card
  ids that no longer exist. Accepted in
  [ADR-0011](decisions/0011-deck-editing-is-one-action.md).
- **Editing a deck cannot reorder cards, and exporting a deck is not built.** The title and
  description are not part of the CSV format, and no path writes a deck back to CSV; how they
  would be exported is deliberately left open. A re-import still creates a second deck.
- **The Edit deck screen is not covered by any test that renders.** `deckEdit.ts` and the reducer
  case are tested; the screen's draft state, the Save button's enabled state, the discard prompt,
  the remove confirmation, the Category field and picker, and the comparison against the deck's
  resolved category are not.
- **Category icons are Android-only.** `Image` renders an XML vector drawable only on Android; on
  iOS every Category icon would be blank — on a Category tile, in the Category picker, and in every
  Category square (Deck and Session cards, their Menu sheet titles, the Category field) alike. The
  tile and the square paint their own background in the category's colour, so a categorised deck
  would still show a coloured square, just with no glyph. Read from the code, not observed. An iOS
  build would need another source for the icons
  ([ADR-0013](decisions/0013-category-icons-are-android-vector-drawables.md),
  [ADR-0014](decisions/0014-deck-belongs-to-one-category.md) Amendment 1).
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
- **A custom category can only be added or deleted.** There is no rename, recolour or icon change,
  and no undo for a delete beyond creating it again, which mints a new id — so the decks the delete
  detached stay uncategorised. Defaults cannot be changed, hidden or deleted
  ([ADR-0012](decisions/0012-custom-categories-third-storage-key.md)).
- **A deck's category is set only on the Edit deck screen, and nothing else uses it.** There is no
  deck count ("N entries") on a Category tile, no filtering of the Decks or Learn screen by
  category — the **Filter button** stays a placeholder — no category in Statistics, and no category
  column in the CSV format, so an imported deck always starts with none. Each is an open follow-up
  ([ADR-0014](decisions/0014-deck-belongs-to-one-category.md) *Not decided here*). The default ids
  `default_<icon key>` are now stored on decks and must never change; withdrawing a default needs a
  rule for the decks that use it (ADR-0012, ADR-0014).
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
- **Several menu entries and buttons are placeholders.** *Add deck manually*, the
  XML / JSON / JSONL import formats, *Settings*, and the Header toolbar's **Filter button** — on
  both the Decks screen and the Learn screen — all show a "not available yet" alert. They are deliberate stubs, not bugs.
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
  known not to render there (see above). Treat an iOS claim as
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
