# Easy Flashcards — Architecture

Easy Flashcards is a React Native flashcards app, built and tested on Android. The user imports a
deck from a local CSV file, studies it card by card, and the app records how well each card is
known. It has no account, no network calls, and no backend. Everything it owns is two AsyncStorage
keys on the device; the only times it leaves the app are to pick a file to import and to save the
sample deck out.

- **App id / namespace:** `com.easyflashcards`
- **Language:** TypeScript · **UI:** React Native primitives, no component library
- **Versions:** [`package.json`](../../package.json) owns every dependency version;
  [`android/build.gradle`](../../android/build.gradle) owns the SDK levels. Do not restate one
  here; it will rot.
- **Data:** two AsyncStorage keys. No database, no files of its own, no cloud. See §5.
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

The app has **three tabs** carrying **five screens**. These names are canonical; the full
vocabulary is in
[.github/instructions/ui-vocabulary.instructions.md](../../.github/instructions/ui-vocabulary.instructions.md).

| Tab | Canonical name | What it shows | Implementation |
|---|---|---|---|
| Decks | **Decks screen** | Every imported deck as a **Deck card**: its card count, a **Mastery bar** splitting its reviews into Ok / Okeish / Not ok, its session and active-session counts, and its last session date. Where a deck is imported, started (in deck order or shuffled), and deleted. | `DecksScreen`, route `DecksList` |
| Learn | **Learn screen** | Every listed session — active, or completed and not cleared — unfinished ones first. Where a session is resumed or restarted, an active one discarded (a real delete), and a completed one cleared, singly or all at once (hidden from the list but still counted — [ADR-0008](decisions/0008-clear-completed-sessions.md)). | `LearnScreen`, route `LearnList` |
| Learn | **Study screen** | One session: the flip card, the icon-only answer buttons (Not Ok, Okeish, Ok — [ADR-0007](decisions/0007-okeish-third-answer.md)), the answered-so-far strip, and the end-of-session summary, which offers to replay the missed or unsure cards. | `StudyScreen`, route `Study` (param `sessionId`) |
| Statistics | **Statistics screen** | Totals across every deck, then one row per deck. | `StatsScreen`, route `StatsOverview` |
| Statistics | **Deck statistics screen** | One deck's totals and every card in it, hardest first. | `DeckStatsScreen`, route `DeckStats` (param `deckId`) |

Two of the five are detail screens reached by pushing onto their tab's stack: **Study** from the
Learn screen or from starting a deck, **Deck statistics** from the Statistics screen. The other
three are the roots of their tabs and are reached only by switching tab.

There are no modal screens. Transient UI is either an `Alert` or the **Menu sheet**
(`MenuSheet`), a bottom sheet rendered in a `Modal` and opened from a **Kebab menu**
(`KebabMenu`). The **App menu** (`AppMenu`) in the header is one of those kebab menus; on the
Decks screen it sits at the end of the **Decks toolbar** (`DecksToolbar`), after the **Search
button** and **Filter button**, and on the Learn screen it carries **Clear completed sessions**
ahead of its common items.

---

## 2. Data flow

```
AsyncStorage                              Device (SAF)
  @easy-flashcards/decks/v1                 @react-native-documents/picker
  @easy-flashcards/sessions/v1              @dr.pogodin/react-native-fs
        │                                           │
  decksStorage.ts                           services/importDeck.ts
  sessionsStorage.ts                        services/exportSampleDeck.ts
   (load / save / normalise)                        │
        │                                     utils/csv.ts (PapaParse)
        └───────────────┬─────────────────────────┘
                        │
              DecksContext  (useReducer)
              state: decks, sessions, isLoading, error
              api:   addDeck, deleteDeck, renameDeck, startSession,
                     recordAnswer, deleteSession, clearCompletedSessions,
                     clearSession, resetDeckStats, getDeck, getSession
                        │
                   useDecks()
                        │
              *Screen components  ← the only consumers of the store
                        │   (derive with utils/stats.ts inside useMemo)
                        │
              Components (Button, FlipCard, RichText, SuccessBar,
                          MasteryBar, DeckCard, DecksToolbar,
                          HistoryStrip, EmptyState, KebabMenu, MenuSheet)
                        ← plain props + callbacks, no store access
```

The loop is one-way: a screen calls a function on the context, the reducer produces a new state
object, React re-renders, and a `useEffect` watching `state.decks` and `state.sessions` writes both
keys back. No screen writes storage, and no storage module knows about React.

**Nothing derived is stored.** Success rates, session progress, orderings, and difficulty rankings
are computed from the raw counters by pure functions in
[`src/utils/stats.ts`](../../src/utils/stats.ts), called from a `useMemo` in the screen that needs
them. The only persisted tallies are a card's per-answer counters — one for each `Answer` in
[`src/types.ts`](../../src/types.ts) — and they are raw. Okeish counts as a review but earns no
credit in any success rate ([ADR-0007](decisions/0007-okeish-third-answer.md)).

**Decks and sessions meet only in the reducer.** A `Session` holds a `deckId`, a snapshot of
`deckName`, and a frozen `cardIds` array; it never holds a `Card`. Resolving a session back to its
deck is the Study screen's job, through `getDeck(session.deckId)` —
[ADR-0002](decisions/0002-sessions-are-snapshots.md).

**Clearing a session archives it; it does not delete it.** `clearCompletedSessions` and
`clearSession` stamp `clearedAt` on completed sessions, which hides them from the Learn screen and
leaves every session statistic unchanged. `deleteSession` still removes a record outright and is
used only to discard an active session; `deleteDeck` and `resetDeckStats` remove a deck's sessions,
cleared ones included — [ADR-0008](decisions/0008-clear-completed-sessions.md).

---

## 3. Layers

### `src/utils/` — pure TypeScript

Nothing here imports from `react` or `react-native`, and that is the property that makes it
testable under Jest with no renderer and no mocks. Every file in `__tests__/` tests one of these.

| File | Role |
|---|---|
| [`csv.ts`](../../src/utils/csv.ts) | `parseFlashcardsCsv` — wraps PapaParse, detects the delimiter, matches the `Question` / `Answer` headers case-insensitively, skips incomplete rows and counts them, throws `CsvImportError` on a file it cannot use. Also `deckNameFromFileName`. |
| [`html.ts`](../../src/utils/html.ts) | A tolerant HTML parser: `parseHtml` to `HtmlNode[]`, `decodeEntities`, `htmlToPlainText`, and the `BLOCK_TAGS` set. It never throws — unclosed and stray tags are absorbed. |
| [`stats.ts`](../../src/utils/stats.ts) | Every derived number in the app: `successRate`, `answerShares`, `getDeckStats`, `getGlobalStats`, `getSessionTally`, `getSessionStats`, `getMissedOrUnsureCardIds`, `summarizeSessions`, `summarizeSessionsByDeck` (with `EMPTY_SESSION_SUMMARY` for a deck that has none), `isSessionActive`, `isSessionCleared`, `listedSessions` (the sessions the Learn screen shows), `clearableSessionCount` (completed sessions not yet cleared), `clearCompletedSessionsAt` and `clearSessionAt` (the transforms the reducer applies to clear sessions, returning the same array when nothing qualifies), `previousReviewIndex` (where a review swipe right on the Study screen lands — one answered card back, wrapping from the oldest round to the frontier), `sortSessions`, `sortCardsByDifficulty`, `cardReviewCount`, and the `formatRate` / `formatDate` display helpers. |
| [`fileUri.ts`](../../src/utils/fileUri.ts) | `fileUriToPath` and `pathToFileUri` — the percent-encoding boundary between a `file://` URI and a path. |
| [`shuffle.ts`](../../src/utils/shuffle.ts) | `shuffle(items, random = Math.random)` — Fisher-Yates over a copy; the input is never mutated. `random` is injectable so tests are deterministic. The Decks screen uses it to order the `cardIds` it passes to `startSession`. |

`isSessionActive` is the single definition of "active": `completedAt === null`. Do not write that
comparison anywhere else. `isSessionCleared` is the same for "cleared": `clearedAt !== null`. Only
a completed session can be cleared, so a session is active, completed and listed, or completed and
cleared. `summarizeSessions`, `summarizeSessionsByDeck` and the Statistics screen's Sessions tile
count cleared sessions deliberately, and a test pins it
([ADR-0008](decisions/0008-clear-completed-sessions.md)).

The same goes for counting answers. `successRate(ok, okeish, notOk)` credits only Ok, so a card
answered only Okeish is 0%, not `--`. `getSessionTally` is the one three-way count of a session's
results, and `getMissedOrUnsureCardIds` (every card not answered Ok, once each) is what the replay
starts from. `answerShares(tally)` is the display split — each answer's percentage of all
reviews, or `null` when nothing has been reviewed — and is what the Mastery bar draws; it is not a
success rate and does not replace one. Code that computes Not Ok as "everything that is not Ok" silently counts Okeish as
Not Ok — [ADR-0007](decisions/0007-okeish-third-answer.md).

### `src/types.ts` — the shapes

`Card`, `Deck`, `Answer`, `SessionResult` and `Session` are what is persisted. The derived
`DeckStats`, `SessionSummary`, `SessionStats` and `AnswerTally` are what `stats.ts` returns and are
never stored.

### `src/storage/` — the AsyncStorage boundary

One module per key, each owning `load*`, `save*`, `clear*`, and the normalisation that read applies.
See §5.

### `src/state/` — the store

[`DecksContext.tsx`](../../src/state/DecksContext.tsx) holds the whole store: the `State` shape,
the reducer and its actions, the `DecksProvider` with the load and save effects, the `createId`
helper, and the `useDecks()` hook that throws if used outside the provider. The two clear actions
delegate to `clearCompletedSessionsAt` and `clearSessionAt` in `stats.ts`, so their guard rules are
tested even though the reducer is not.
[ADR-0003](decisions/0003-single-context-reducer-store.md) keeps it the only store.

### `src/services/` — the device boundary

| File | Role |
|---|---|
| [`importDeck.ts`](../../src/services/importDeck.ts) | `pickAndParseCsv` — opens the system picker, copies the chosen file into the app cache, reads it, parses it, and returns `{ deckName, fileName, parsed }`. Throws `ImportCancelledError` when the user backs out. |
| [`exportSampleDeck.ts`](../../src/services/exportSampleDeck.ts) | `exportSampleDeck` — writes the built-in `SAMPLE_DECK_CSV` to the cache and opens the system save dialog. Throws `ExportCancelledError` on cancel. |

A cancelled picker is a normal outcome, not an error, which is why each service has its own
cancellation error type for the caller to catch and ignore.

### `src/screens/` — the stateful half

One file per screen. Each calls `useDecks()` and `useNavigation()`, derives what it needs with
`stats.ts` inside a `useMemo`, and renders a `FlatList` of components. `DecksScreen` and
`StudyScreen` also hold local UI state — import-in-flight and which menu is open for the first,
the flip and the viewed card index for the second.

### `src/components/` — the stateless half

| File | Role |
|---|---|
| [`Button.tsx`](../../src/components/Button.tsx) | The only button. Variants `primary`, `secondary`, `success`, `danger`, `warning`; handles `disabled` and `loading`. Takes an optional `icon` render function, passed the foreground colour for the variant; with no `label` it is icon-only, and its type then requires an `accessibilityLabel`. |
| [`FlipCard.tsx`](../../src/components/FlipCard.tsx) | The study card. Two faces, a `rotateY` interpolation, and a scrollable body. Owns the animation, not the flip state. |
| [`RichText.tsx`](../../src/components/RichText.tsx) | Renders `parseHtml` output as nested `<Text>`. See §6. |
| [`SuccessBar.tsx`](../../src/components/SuccessBar.tsx) | The one visual encoding of a success rate. Used on every screen except the Decks screen, which shows a `MasteryBar` instead. An optional `color` overrides the rate-based colours for a bar that is not a success rate — the Study screen's session progress bar passes `colors.text`. |
| [`MasteryBar.tsx`](../../src/components/MasteryBar.tsx) | The Ok / Okeish / Not ok split of a deck's reviews: a segmented track plus a legend giving each answer's `AnswerIcon` (tick, question mark, cross, in the answer's colour) followed by its percentage. Takes the output of `answerShares`; with `null` it draws an empty track, grey icons, and `--` for each share. The panel carries one accessibility label summarising all three shares. |
| [`DeckCard.tsx`](../../src/components/DeckCard.tsx) | One deck on the Decks screen: a header with the name, card count and the **Deck options menu** (a `KebabMenu`), a `MasteryBar`, and a footer with the session counts, the last-session date and the **Start session button**. Takes display-ready values and callbacks; derives nothing. |
| [`DecksToolbar.tsx`](../../src/components/DecksToolbar.tsx) | The Decks screen's `headerRight`: the **Search button** and **Filter button**, then the `AppMenu` in its `boxed` variant. The two buttons only call the callbacks they are given. |
| [`HistoryStrip.tsx`](../../src/components/HistoryStrip.tsx) | The answered-so-far tiles on the Study screen, coloured per answer; auto-scrolls to the current card. |
| [`EmptyState.tsx`](../../src/components/EmptyState.tsx) | Every list's `ListEmptyComponent`. |
| [`KebabMenu.tsx`](../../src/components/KebabMenu.tsx) | The three-dot control; opens a `MenuSheet`. Owns the open/closed state. An optional `variant="boxed"` draws the trigger as a bordered rounded square, matching the Decks toolbar's buttons; the default is `plain`. |
| [`MenuSheet.tsx`](../../src/components/MenuSheet.tsx) | The bottom sheet, in a `Modal`. Defines the shared `MenuItem` type. |
| [`MenuIcons.tsx`](../../src/components/MenuIcons.tsx) | `MenuIcon` — every menu icon, drawn from nested `View`s on a 20-point grid. Also carries the `search`, `filter` and `clock` glyphs, which are used outside menus (the Decks toolbar and the Deck card). An optional `size` scales the grid about its centre. |
| [`AnswerIcons.tsx`](../../src/components/AnswerIcons.tsx) | `AnswerIcon` — the tick, cross and question-mark glyphs for Ok, Not Ok and Okeish, drawn from rotated `View`s. Used on the Study screen's answer buttons and in the `MasteryBar` legend. Hidden from accessibility; the containing button or panel carries the name. |
| [`AppMenu.tsx`](../../src/components/AppMenu.tsx) | The header kebab menu. The one component that calls a service. Passes an optional `variant` through to its `KebabMenu`, and takes optional `extraItems` — screen-specific `MenuItem`s shown before Export sample deck and Settings — so a screen can add an item without `AppMenu` reading the store. |

`AppMenu` is the exception to "components take plain props": it calls `exportSampleDeck` directly
because it has no screen to belong to — it is mounted by the navigator as `headerRight`, or, on the
Decks screen, inside `DecksToolbar`. `DecksToolbar` therefore reaches a service too, but only
through `AppMenu`. The Learn screen mounts its own `AppMenu` with an `extraItems` entry for
**Clear completed sessions**, whose callback is the screen's; `AppMenu` itself still knows nothing
of the store.

### App entry points

- [`index.js`](../../index.js) — `AppRegistry.registerComponent`. The only `.js` file in the source.
- [`App.tsx`](../../App.tsx) — `SafeAreaProvider` → `DecksProvider` → `RootNavigator`.

---

## 4. Navigation

One bottom tab navigator, three tabs, one native stack inside each. There is no drawer, no modal
stack, and no deep linking.

```
RootNavigator  (NavigationContainer, dark theme built from src/theme.ts)
└── Tab.Navigator          initialRouteName = active session ? 'LearnTab' : 'DecksTab'
    ├── DecksTab   → DecksNavigator  → DecksList     (DecksScreen)
    ├── LearnTab   → LearnNavigator  → LearnList     (LearnScreen)
    │                                → Study         (StudyScreen)      param: sessionId
    └── StatsTab   → StatsNavigator  → StatsOverview (StatsScreen)
                                     → DeckStats     (DeckStatsScreen)  param: deckId
```

Param lists live in [`src/navigation/types.ts`](../../src/navigation/types.ts), one per stack plus
`RootTabParamList`. Tab icons are in
[`src/navigation/TabIcons.tsx`](../../src/navigation/TabIcons.tsx), drawn from `View`s.

**The navigator does not mount until the store has loaded.** `RootNavigator` reads `isLoading` from
`useDecks()` and renders an activity indicator until it is false. This is not a loading nicety: a
navigator's `initialRouteName` is read once, so choosing the launch tab from the persisted sessions
requires those sessions to already be in memory —
[ADR-0006](decisions/0006-launch-on-the-tab-with-unfinished-work.md).

**The Study screen is a route in the Learn stack, not a tab.** Starting a session from the Decks
screen therefore navigates across tabs:
`navigation.navigate('LearnTab', { screen: 'Study', params: { sessionId } })`. Starting another
session from the end-of-session summary uses `replace`, so the finished session does not pile up on
the back stack.

Each root screen carries the **App menu** as `headerRight`, set in `RootNavigator`. Two root
screens override their own `headerRight` with `navigation.setOptions` in a `useLayoutEffect`: the
Decks screen replaces it with the **Decks toolbar**, which renders the App menu after the Search
and Filter buttons, and the Learn screen replaces it with an App menu carrying **Clear completed
sessions** as an extra item. Only the Statistics screen uses the navigator's default. Detail
screens carry no App menu.

---

## 5. Persistence

Two AsyncStorage keys, each owned by one module. Nothing else writes storage.

| Key | Holds | Module |
|---|---|---|
| `@easy-flashcards/decks/v1` | `Deck[]`, each with its `Card[]` and their counters | [`decksStorage.ts`](../../src/storage/decksStorage.ts) |
| `@easy-flashcards/sessions/v1` | `Session[]` — active, completed, and cleared ([ADR-0008](decisions/0008-clear-completed-sessions.md)) | [`sessionsStorage.ts`](../../src/storage/sessionsStorage.ts) |

**Both are loaded once**, in parallel, by a mount effect in `DecksProvider`. A failure of either
sets `error` and clears `isLoading`; the app starts empty rather than not at all.

**Both are written together**, as whole arrays, by a second effect watching `state.decks` and
`state.sessions`. A `hasLoaded` ref suppresses the write that would otherwise fire immediately
after hydration. A failed write is caught and discarded, deliberately: a storage error must not
take down a session in progress.

**Reads normalise and never throw.** Each loader drops malformed rows — a card with no `id`,
`question` or `answer`; a session whose `cardIds` is not an array — defaults missing timestamps to
now, clamps `results` to `cardIds.length`, reads a missing or non-numeric card counter as `0`,
preserves an answer of `'ok'`, `'okeish'` or `'notOk'`, and coerces any other answer to `'ok'`. A
session's `clearedAt` is kept only when it is a finite number **and** the session is completed;
otherwise it is read as `null`, so an active session can never be hidden. The
cost is silent data loss on a corrupt record; the alternative is an app that cannot start
([ADR-0004](decisions/0004-versioned-defensive-storage.md)).

**The `/v1` suffix is the migration mechanism.** A shape change the normaliser cannot absorb takes
a new key and converts from the old one on first read. Nothing rewrites what `/v1` means. A new
field whose default is the *true* value for every older record is absorbed under `/v1` instead —
[ADR-0004 Amendment 1](decisions/0004-versioned-defensive-storage.md); a card's Okeish counter is
the first such field ([ADR-0007](decisions/0007-okeish-third-answer.md)) and a session's
`clearedAt` the second ([ADR-0008](decisions/0008-clear-completed-sessions.md)). The opposite
direction is not covered: an older build reading data this one wrote loses the Okeish data, and
drops `clearedAt` so every cleared session reappears in its Learn list, on its first save. Both
losses are permanent; reinstalling the newer build does not restore them.

**Ids are generated, not derived**: `createId(prefix)` in `DecksContext` returns
`` `${prefix}_${Date.now().toString(36)}_${random}` ``. Deck ids, card ids and session ids all come
from it, and card ids are minted at import, so re-importing the same file produces a second deck
with different cards rather than merging.

---

## 6. HTML on a card

Both sides of a card are HTML, because that is how the source CSVs are written. The app parses and
renders it itself — [ADR-0001](decisions/0001-own-the-html-renderer.md).

- [`utils/html.ts`](../../src/utils/html.ts) turns a string into `HtmlNode[]`. It is tolerant by
  design: an unclosed tag is closed at the end of input, a stray closing tag is dropped, and
  nothing throws. The input is a user's CSV file, so malformed markup is expected rather than
  exceptional.
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
| UI | React Native primitives only — no component library, no icon font, no SVG |
| Styling | `StyleSheet.create` against the tokens in [`src/theme.ts`](../../src/theme.ts) |
| Navigation | React Navigation — bottom tabs + native stack, with `react-native-screens` and `react-native-safe-area-context` |
| State | React Context over `useReducer` |
| Persistence | `@react-native-async-storage/async-storage` |
| CSV | PapaParse, wrapped by `src/utils/csv.ts` |
| File picking and saving | `@react-native-documents/picker` |
| File reading | `@dr.pogodin/react-native-fs` |
| HTML | owned in-repo — `src/utils/html.ts` + `src/components/RichText.tsx` |
| Animation | the React Native `Animated` API, with `PanResponder` for the Study screen's swipe |
| Tests | Jest with `@react-native/jest-preset` — pure-logic only |
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
  there is no `@testing-library/react-native`. Every test is a pure-logic test of `src/utils/`.
  A screen, a component, or a storage normaliser can break with the whole suite green. Adding a
  component-test setup is a dependency change and needs approval.
- **The reducer is untested.** It is the most behaviour-dense code in the app — cascading deletes,
  auto-completion, counter updates — and it lives in a `.tsx` file next to the provider, so testing
  it means rendering. Extracting the reducer into a `.ts` file would make it testable today; that
  has not been done. The clear actions are the partial exception: their transforms live in
  `stats.ts` and are tested, but the dispatch wiring around them is not.
- **`deleteSession` deletes whatever it is given.** The rule that it is only for discarding an
  active session lives in the Learn screen, not the reducer; a future caller that deletes a
  completed session silently changes the session statistics
  ([ADR-0008](decisions/0008-clear-completed-sessions.md)).
- **The storage normalisers are untested**, and they are the code that runs against data the app
  did not write. Since [ADR-0007](decisions/0007-okeish-third-answer.md) that includes the Okeish
  paths: a sessions loader that coerced `'okeish'` to `'ok'` would still type-check, and would
  silently rewrite every Okeish answer on the next launch. Since
  [ADR-0008](decisions/0008-clear-completed-sessions.md) it includes the `clearedAt` rule: dropping
  the "completed only" check also type-checks, and would let a corrupt record hide an active
  session.
- **A downgrade silently loses Okeish data and un-clears every cleared session.** An older APK
  drops the card's Okeish counter, reads every `'okeish'` answer as `'ok'`, and drops each session's
  `clearedAt`, and its first save makes all of that permanent. No session statistic is lost — the
  cleared sessions were still counted — but they return to the Learn list and stay there. Nothing
  blocks it: `versionCode` in [`android/app/build.gradle`](../../android/app/build.gradle) has never
  been bumped and release builds share the debug keystore. Accepted in ADR-0007 and ADR-0008, not
  mitigated.
- **Cleared sessions are kept forever and cannot be restored from the UI.** Clearing removes
  nothing, so the sessions key only grows; only *Delete deck* and *Reset statistics* shrink it.
  There is no *restore* and no *show cleared*: a session cleared by mistake stays hidden though its
  data is intact. Accepted in [ADR-0008](decisions/0008-clear-completed-sessions.md).
- **`renameDeck` is dead code.** The store exposes it, the reducer implements it including the
  rename of every session's `deckName` snapshot, and nothing calls it. The *Edit deck* menu item
  alerts instead.
- **Several menu entries and buttons are placeholders.** *Edit deck*, *Add deck manually*, the
  XML / JSON / JSONL import formats, *Settings*, and the Decks toolbar's **Search button** and
  **Filter button** all show a "not available yet" alert. They are deliberate stubs, not bugs.
- **`README.md` describes two tabs.** The app has had three since the Learn tab landed, and the
  README's feature list and project-structure table were not updated with it.
- **The whole store is written on every change.** Two full arrays are serialised and written for a
  single answer. At the volumes a hand-imported CSV produces this costs nothing; it does not scale
  to a large library, and nothing currently bounds deck size or the number of kept sessions,
  cleared ones included.
- **A re-import is always a new deck.** Card ids are minted at import, so importing an updated
  version of a file produces a second deck and a second set of counters rather than updating the
  first. There is no identity for a card beyond its generated id.
- **iOS is unbuilt and unverified.** The `ios/` project exists and the dependency list is
  cross-platform, but everything here has been built and run on Android only. Treat an iOS claim as
  unverified unless someone ran it.
- **No error surface for a failed write.** `saveDecks` / `saveSessions` failures are caught and
  discarded so a session is not interrupted. The user is told nothing, and the loss is only
  discovered on the next launch.
