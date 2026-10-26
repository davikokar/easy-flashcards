# AGENTS.md

Guidance for AI agents working in this repository.

## Project

**Easy Flashcards** is a React Native flashcards app, built and tested on Android. The user
imports a deck from a local CSV file, studies it card by card, and the app records how well each
card is known. It has no account, no network calls, and no backend: everything the app owns lives
in two AsyncStorage keys on the device. Both sides of a card carry a small subset of HTML, which
the app parses and renders itself. Prefer clear, conventional code over clever abstractions, and
explain non-obvious decisions in short commit messages.

## Tech stack

- **Language:** TypeScript, strict via `@react-native/typescript-config`
- **Framework:** React Native with React. **Versions live in
  [package.json](package.json) — read it rather than restating one here.**
- **UI:** plain React Native primitives (`View`, `Text`, `Pressable`, `FlatList`, `Modal`,
  `Animated`). There is **no UI component library and no icon font** — every icon in the app is
  drawn from nested `View`s in [src/components/MenuIcons.tsx](src/components/MenuIcons.tsx),
  [src/components/AnswerIcons.tsx](src/components/AnswerIcons.tsx) and
  [src/navigation/TabIcons.tsx](src/navigation/TabIcons.tsx).
- **Navigation:** React Navigation — one bottom tab navigator, one native stack per tab.
- **State:** one React Context over `useReducer`, in
  [src/state/DecksContext.tsx](src/state/DecksContext.tsx). No Redux, no Zustand, no MobX
  ([ADR-0003](docs/architecture/decisions/0003-single-context-reducer-store.md)).
- **Persistence:** AsyncStorage, two keys, written whole on every state change. See *Storage keys*
  below.
- **Dependency injection:** none. Modules import each other directly, and pure logic is kept in
  Android-free files so it can be tested without mocking anything.
- **CSV:** PapaParse, wrapped by [src/utils/csv.ts](src/utils/csv.ts).
- **File access:** `@react-native-documents/picker` to choose and save files, and
  `@dr.pogodin/react-native-fs` to read the picked `content://` URI. See *Dependency traps* below.
- **HTML:** parsed and rendered in-repo — [src/utils/html.ts](src/utils/html.ts) and
  [src/components/RichText.tsx](src/components/RichText.tsx)
  ([ADR-0001](docs/architecture/decisions/0001-own-the-html-renderer.md)).
- **Build:** Gradle for Android (`android/`), CocoaPods for iOS (`ios/`). SDK levels are in
  [android/build.gradle](android/build.gradle); app config in
  [android/app/build.gradle](android/app/build.gradle).
- **Tests:** Jest with `@react-native/jest-preset`. Pure-logic unit tests only, under
  [__tests__/](__tests__/). There are no component or end-to-end tests — see *Known gaps*.

## Project layout

```
App.tsx                 # SafeAreaProvider > DecksProvider > RootNavigator
index.js                # AppRegistry entry point
src/
  types.ts              # Deck, Card, Session, Answer, and the derived stats types
  theme.ts              # colors / spacing / radius tokens — the whole design system
  state/                # DecksContext: the single store
  storage/              # AsyncStorage read/write + normalisation, one file per key
  navigation/           # RootNavigator, per-tab stacks, param lists, tab icons
  screens/              # One file per screen
  components/           # Reusable presentational components
  services/             # Device-boundary operations: picking and saving files
  utils/                # Pure TypeScript: csv, html, fileUri, stats
__tests__/              # Jest unit tests for src/utils only
docs/                   # Architecture, decisions, and the original requirements
samples/                # Example CSV decks
```

`src/utils/` and `src/types.ts` import nothing from `react-native`. That is deliberate and it is
what makes them testable under Jest without a renderer or a mock. Keep new pure logic there; keep
anything that touches a device API in `src/services/` or `src/storage/`.

**Which files are in which directory is owned by
[docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md) §3** — this file deliberately
does not list them, because two copies of a file list drift apart the first time the list grows.

## Documentation

This project carries a fair amount of documentation and it is only useful while it is true. Every
document below has an owner and a maintenance mode, so that keeping it current is somebody's job
rather than nobody's.

| Document | Owner | Mode | Update when |
|---|---|---|---|
| [AGENTS.md](AGENTS.md) | Planner | routed | a convention, dependency, or project fact changes |
| [docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md) | Planner | routed | the structure it describes changes — see its trigger list |
| [docs/architecture/README.md](docs/architecture/README.md) | Planner | routed | an ADR is added, or one changes status |
| [docs/architecture/decisions/](docs/architecture/decisions/) | Planner | routed | never edited; superseded by a new ADR, or amended in place when only a detail changed |
| [docs/requirements/flashcards_app_requirements.md](docs/requirements/flashcards_app_requirements.md) | — | **frozen** | never. It is the original brief, kept as history — see below |
| [README.md](README.md) | Planner | routed | a user-facing feature, the CSV format, or a setup step changes |
| [.github/instructions/ui-vocabulary.instructions.md](.github/instructions/ui-vocabulary.instructions.md) | Designer | **in-change** | you add, rename, or remove a named screen, tab, area, or control |
| [.github/instructions/tests.instructions.md](.github/instructions/tests.instructions.md) | Planner | routed | a test convention or tool changes |
| [.github/instructions/architecture-docs.instructions.md](.github/instructions/architecture-docs.instructions.md) | Planner | routed | the documentation process itself changes |
| [.github/prompts/docs-audit.prompt.md](.github/prompts/docs-audit.prompt.md) | Planner | routed | the audit's scope or categories change |
| `.github/agents/*.agent.md` | Planner | routed | an agent's role, tools, or required reading changes |
| `/memories/repo/easy-flashcards.md` | anyone | append-only | you learn something that would have saved you time |

**Routed** means the owner edits it. If your work makes one of those documents wrong, say so in
your report and name the section — do not fix it yourself. The Orchestrator assigns the edit.

**In-change** means you update it yourself, in the same change, because waiting would leave it
wrong while someone else works from it. The UI vocabulary is the only one, and only for
*additions*: naming something you just built is yours, but **renaming, removing, or resolving a
collision between existing terms is routed to the Designer**, because those need the whole
vocabulary in view.

**Frozen** means exactly one thing: `docs/requirements/flashcards_app_requirements.md` is the
brief the app was built from, and it is kept **unchanged** as a record of what was asked for. It is
not a description of the app and it is not maintained. Where it and the code disagree, the code
wins and nothing needs fixing. Do not cite it as a current fact, and do not update it; new intent
goes into an ADR or a design document, not into history.

When a project-wide fact changes, **this table is the checklist** — walk every row.
`.github/agents/*.agent.md` is the row most easily missed, and the costliest: an agent definition
is injected before the agent reads anything else, so a stale fact there is believed rather than
discovered.

### Two rules that matter more than the table

- **Do not write a fact that something else already owns.** A dependency version copied from
  `package.json`, a count of screens, a line count — each is a future lie, because nothing checks
  it. Link to the source instead.
- **Record why, not only what.** A decision stripped of its reasoning gets reversed by the next
  person who sees only its cost. If you reverse one, say that you did and why.

## Conventions

- Before introducing a significant architectural choice, read the
  [architecture and design documentation instructions](.github/instructions/architecture-docs.instructions.md)
  and the existing [architecture decisions](docs/architecture/README.md). Every ADR marked
  `Active` is binding.
- The system overview is [docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md).
  Read it before changing the store, the navigation shape, or how a screen gets its data. It is
  **maintained, not just read**: if your change adds a screen, a store action, a storage key, a
  `src/utils/` module, or a dependency, update it in the same change. The owner, the trigger list,
  and the timing are defined in the
  [architecture documentation instructions](.github/instructions/architecture-docs.instructions.md).
  An ADR is written *before* the work; the overview is updated *after*, so it describes what
  actually landed.
- For UI work or references to named screens, tabs, and controls, read
  [the UI vocabulary](.github/instructions/ui-vocabulary.instructions.md).
- For tests, follow [the test conventions](.github/instructions/tests.instructions.md).
- **TypeScript, not JavaScript.** `index.js` is the only `.js` file in the source and it exists
  because `AppRegistry` wants it. Everything else is `.ts` or `.tsx`.
- Run `npm run lint` rather than arguing about formatting. ESLint extends `@react-native`, which
  carries Prettier; the repo's settings are in `.eslintrc.js` and `.prettierrc.js`.
- There is no `.gitattributes`. Match the line endings of the file you are editing. If
  `git diff --stat` reports far more changed lines than you touched, your editor converted the
  whole file; check against `git diff --ignore-all-space` before committing.

### State ownership

- **`DecksContext` is the only store.** It holds `decks`, `sessions`, `isLoading` and `error`, and
  it exposes one function per operation. There is no second provider and no global singleton; do
  not add one ([ADR-0003](docs/architecture/decisions/0003-single-context-reducer-store.md)).
- **A new operation is a new reducer action**, not a mutation written by a screen. Screens call
  `useDecks()` and invoke an exposed function; they never reach into state and write it back.
- **Derived values are computed, never stored.** Success rates, session progress, orderings and
  difficulty rankings all live as pure functions in [src/utils/stats.ts](src/utils/stats.ts) and
  are called from a `useMemo` in the screen. Putting a derived number into the stored shape means
  persisting something that can go stale; the counters on a `Card` are the only stored tallies, and
  they are raw — one per `Answer`. Okeish is a review that earns no credit in a success rate
  ([ADR-0007](docs/architecture/decisions/0007-okeish-third-answer.md)); count answers with the
  three-way helpers in `stats.ts`, never as "Ok, else Not Ok".
- **Screens are the stateful half; components are the stateless half.** A `*Screen` calls
  `useDecks()` and `useNavigation()`; a component in `src/components/` takes plain props and
  callbacks and reads neither. Keep that line — it is what would make the components testable the
  day component tests are added.
- **A `Session` snapshots its deck.** It stores `deckId`, a copy of `deckName`, and a frozen
  `cardIds` array, so changing the deck afterwards does not rewrite history
  ([ADR-0002](docs/architecture/decisions/0002-sessions-are-snapshots.md)). A session is **active**
  while `completedAt === null`; nothing else means active.
- **An answer is recorded the moment it is given**, not at the end of a session: `recordAnswer`
  appends to `session.results` and bumps the card's counters in one dispatch
  ([ADR-0005](docs/architecture/decisions/0005-answers-recorded-immediately.md)). Leaving the Study
  screen mid-session is therefore not a loss of data, and nothing needs an "on exit" save.

### Storage keys

Each key is owned by exactly one module under `src/storage/`, and that module owns reading,
writing, and normalising it.

| Key | Holds | Module |
|---|---|---|
| `@easy-flashcards/decks/v1` | every `Deck`, each with its `Card[]` and their counters | [src/storage/decksStorage.ts](src/storage/decksStorage.ts) |
| `@easy-flashcards/sessions/v1` | every `Session`, active and completed | [src/storage/sessionsStorage.ts](src/storage/sessionsStorage.ts) |

- **Reads are defensive and never throw on bad data.** Each loader drops rows it cannot make sense
  of and fills in defaults for missing timestamps, because the alternative is an app that will not
  start after one corrupt write
  ([ADR-0004](docs/architecture/decisions/0004-versioned-defensive-storage.md)).
- **The `/v1` suffix is the migration mechanism.** A shape change that the normaliser cannot absorb
  takes a new key, with the old one read once and converted. Do not change what `/v1` means. A new
  field whose default is the *true* value for every older record stays under `/v1`
  ([ADR-0004](docs/architecture/decisions/0004-versioned-defensive-storage.md) Amendment 1) — but
  still needs an ADR and approval, and an older build reading it loses it on its first save.
- Both keys are written together, as whole arrays, by one `useEffect` in `DecksContext`. There is
  no partial write and no write queue, and a failed write is swallowed deliberately so it cannot
  break a running session.
- Adding a third key means a new module in `src/storage/`, a row in this table, and an entry in
  the overview's persistence section. Say so in your report.

### Strings and formatting

- **The app is English-only and there is no i18n layer.** User-facing strings are literals in the
  component that shows them. Do not introduce a translation framework without asking; do not scatter
  a half-built one.
- Dates shown to the user go through `formatDate` in [src/utils/stats.ts](src/utils/stats.ts),
  which uses the device locale and returns `'Never'` for a null timestamp. Rates go through
  `formatRate`, which returns `'--'` when nothing has been reviewed. Use them rather than
  formatting inline — a bare `0%` and "never reviewed" mean different things and the app
  distinguishes them.
- Timestamps are `Date.now()` numbers everywhere, in state and in storage. Do not store a
  `Date` or an ISO string.

## Definition of done

Before claiming a task is complete:

1. Types check: `npm run typecheck`
2. Lint passes: `npm run lint`
3. Tests pass: `npm test`
4. The Android app **builds**, if your change could affect it: `cd android && ./gradlew assembleDebug`.
   A change confined to `src/utils/` does not need it; anything touching native modules, the
   dependency list, or `android/` does.
5. **Behaviour verified on a device, if one is attached.** `adb devices` settles it. If one is
   listed, run the app and check the behaviour you changed, and say what you observed. If none is,
   say that instead — and never report a UI behaviour as observed when it was only compiled.
6. New logic has at least one test, where it is testable. Pure logic in `src/utils/` always is.
   See *Known gaps* for what currently is not.

Steps 4 and 5 are conditional on purpose. Whether a device is plugged in is a property of the
machine, not of the change, so making them unconditional would leave the definition of done
unsatisfiable half the time — and a gate that cannot be met gets ignored rather than met. Steps 1
to 3 are unconditional, fast, and catch most of what breaks here.

All six are properties of the **change**, not of each agent's turn. Across a multi-agent run the
gate is run **once**, over the integrated change, by whoever the task brief names — and the brief
has to name someone. [.github/agents/orchestrator.agent.md](.github/agents/orchestrator.agent.md)
owns that rule; it is there to stop the suite being run twice for one change, not to let anyone
skip it.

### Running the toolchain

```bash
cd /c/git/easy-flashcards && npm run typecheck && npm run lint && npm test
```

- **Always prefix with `cd /c/git/easy-flashcards &&`.** A leftover `cd` makes the command fail in
  a way a grep-filtered pipeline reports as success. Treat empty output as suspicious, not as a
  pass.
- **`npm install` needs `--legacy-peer-deps` here.** The React Native and React versions in
  `package.json` sit outside some transitive peer ranges, and a plain `npm install` fails on peer
  resolution rather than on anything real.
- Gradle needs the Android SDK path, and **`android/local.properties` is git-ignored** — it exists
  on this machine and does not exist in a fresh clone. A build that reports "SDK location not
  found" is missing that file, not broken; write it with `sdk.dir=C:\\Users\\<user>\\AppData\\Local\\Android\\Sdk`.
- **`adb` is not on `PATH`.** Use `"$HOME/AppData/Local/Android/Sdk/platform-tools/adb.exe"`.
- **A debug APK contains no JS bundle.** Installing one and launching it without Metro, or without
  `adb reverse tcp:8081 tcp:8081`, gives "Unable to load script" — which reads like a build failure
  and is not one. For a standalone install, `cd android && ./gradlew assembleRelease` produces
  `android/app/build/outputs/apk/release/app-release.apk` with the bundle inside. It takes a long
  time. It is signed with the debug keystore, so `adb install -r` upgrades in place and keeps the
  user's decks.

## Dependency traps

These are not preferences. Each one cost a session.

- **`react-native-render-html` does not work on this React version** and must not be reintroduced.
  It sets `defaultProps` on function components, which React 19 ignores, so it fails at render
  rather than at install. The replacement is this repo's own parser and renderer —
  [ADR-0001](docs/architecture/decisions/0001-own-the-html-renderer.md).
- **`react-native-document-picker` is deprecated.** The successor is
  `@react-native-documents/picker`, which is what `src/services/` uses. Its API is not the old
  one; do not port a snippet across.
- **The picker returns a `content://` URI, not a path.** Reading it needs
  `@dr.pogodin/react-native-fs`, and [src/utils/fileUri.ts](src/utils/fileUri.ts) exists for the
  percent-decoding that step needs. Do not hand a `content://` URI to something expecting a path.

## Known gaps

Recorded here so they are not rediscovered as surprises. The full list, with reasoning, is in
[docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md) §8.

- **No component tests.** `react-test-renderer` is a dev dependency and nothing uses it; there is
  no `@testing-library/react-native`. Every test in `__tests__/` is a pure-logic test of
  `src/utils/`. A screen, a reducer, or a storage normaliser can therefore break without any test
  failing. Adding a component-test setup is a dependency change — ask first.
- **The store's reducer is untested**, for the same reason: it lives in a `.tsx` file alongside
  the provider, so testing it means rendering.
- **`renameDeck` is exposed by the store and called by nothing.** The deck kebab menu's *Edit deck*
  item shows a "not available yet" alert.
- **Several menu entries are placeholders** that alert rather than act: *Edit deck*, *Add deck
  manually*, the XML / JSON / JSONL import formats, and *Settings*. They are intentional stubs, not
  bugs — do not "fix" one into existence without being asked.

## What to ask before doing

- Adding a new third-party dependency, or upgrading one. This is a small dependency list on
  purpose, and two of the entries on it exist because the obvious library did not work.
- Adding a new Android permission or anything to `AndroidManifest.xml`. **A dependency can do this
  without the source manifest changing**, and approving the dependency is not approving the
  permissions it merges in. Check the merged manifest when a native dependency lands.
- Introducing a new architectural pattern not described above, or contradicting an active ADR —
  adding a second store, a navigation library, a styling system, or an i18n framework all qualify.
- Changing a storage key, its shape, or what `/v1` means. This is the one class of mistake here
  that the user cannot recover from: it loses their decks and their history rather than failing a
  build.

These do not need approval, but do need to be called out in your report because their blast radius
is wider than the diff looks:

- Changing the `DecksContextValue` shape. Every screen consumes it.
- Changing a `src/utils/stats.ts` signature. It is imported by four screens and the tests.
- Changing `theme.ts`. Nearly every component and screen imports it, and there is no second source
  of styling.

## Memory

Repository memory lives at `/memories/repo/easy-flashcards.md`. It is a short log of traps this
codebase has already cost someone a session: the React 19 `defaultProps` failure, the document
picker replacement, the SDK and `adb` paths, and the release-build route to a standalone install.
Read it **before** starting, and append a short note when you learn something that would have saved
you time.
