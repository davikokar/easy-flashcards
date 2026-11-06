---
description: Testing conventions for Easy Flashcards.
applyTo: "__tests__/**/*.ts, __tests__/**/*.tsx"
---

# Test conventions

> **Maintenance — owner: Planner. Mode: routed.**
> If a convention or tool here is wrong or missing, say so in your report and name the section;
> do not edit it yourself. Conventions bind every test in the repo, so they change deliberately.

These rules apply only to test files. They complement the project-wide rules in
[AGENTS.md](../../AGENTS.md).

## What is tested here, and what is not

**Read this before concluding that a green suite means a working change.**

The suite is **unit tests, and nothing renders**. It covers:

- the pure logic in `src/utils/`, including the translation engine `src/utils/i18n.ts` in
  `__tests__/i18n.test.ts`;
- the UI text catalogue in `src/locales/`, in `__tests__/locales.test.ts`: every registered
  language has English's keys, placeholders and plural messages, every form its plural rule
  returns for 0 to 1000, the CLDR form its rule gives for a few known integers, no empty message,
  keys that follow ADR-0020's naming rules, and a label
  for every category icon and built-in category. It checks the catalogue's shape, not that a
  screen uses it — a literal left in a component passes;
- the reducer in `src/state/reducer.ts`, called directly with a state and an action;
- the storage loaders, one test file per module in `src/storage/`, with
  `@react-native-async-storage/async-storage` replaced by a `jest.mock` in each test file. That is
  the only mock in the suite;
- the category drawables in `src/assets/category-icons/`, read as text by
  `__tests__/categories.test.ts`: their file names must be exactly `CATEGORY_ICONS`, and none may
  contain `android:tint`. That checks the files against the key list, not that they render — a
  drawable AAPT rejects or draws wrongly still passes.

There are no component tests and no end-to-end tests. Specifically:

- `react-test-renderer` is a dev dependency and **nothing imports it**.
- There is no `@testing-library/react-native` and no `jest-native`.
- Nothing mocks the document picker or the filesystem, so `src/services/` is untested.

So a screen, a component, a service, or the wiring in `DecksContext.tsx` — the provider's effects
and the functions it exposes — can break with the whole suite green. When your change is in one of
those, the gate that catches a regression is `npm run typecheck` plus running it on a device — not
`npm test`. Say which you did.

**Adding a component-test setup is a dependency change and needs the user's approval**
(see *What to ask before doing* in [AGENTS.md](../../AGENTS.md)). Do not install one mid-task to
make a brief easier.

## Layout and naming

- Tests live in [`__tests__/`](../../__tests__/) at the repository root, **not** beside the source.
  One file per module under test, named after it: `csv.ts` → `__tests__/csv.test.ts`.
- Use `describe` per exported function, `it` per behaviour, both in plain English:
  `` it('skips rows missing a question or an answer') ``. The describe block names the symbol; the
  `it` names what it does, not what it is called.
- One behaviour per test. Prefer several small tests to one that asserts six things.
- Follow Arrange / Act / Assert, separated by blank lines.

## Writing a unit test

- **Build the input literally in the test.** No fixture files, no shared `beforeEach` setup object.
  A small builder per shape (`card()`, `deck()`, `session()`) is fine when it takes its varying
  values as arguments. A test reads a file from disk only when it exists to check that a shipped
  file matches the code, and only these do: the two sample deck files, `samples/sample-deck.csv`
  and `samples/sample-deck.json`, in `sampleDeck.test.ts`, each checked to equal what
  `serializeDeck` writes for `SAMPLE_DECK` (line endings aside) and to import as its cards, the
  JSON also as its title, description and category; and the drawables in
  `src/assets/category-icons/`, in `categories.test.ts`, against `CATEGORY_ICONS`. All read with
  Node's `fs` and mock nothing. Never read a file to supply a test's input.
- **Assert on returned values**, never on how a function got there.
- Test the failure path as well as the happy one. `parseFlashcardsCsv` and `parseDeckJson` throw
  `DeckImportError` on a file they cannot use, and that is part of their contract — assert on the
  throw and its `code`, which is what the Decks screen turns into a message. The English `message`
  is for diagnostics only
  ([ADR-0017](../../docs/architecture/decisions/0017-deck-import-reads-exported-formats.md)
  Amendment 4); a test may still assert it, but the code is the contract.
- A round trip is built literally too: `csv.test.ts` and `deckImport.test.ts` serialise a deck
  built in the test with `deckExport.ts` and parse the result, rather than reading an exported file.
- Test the tolerance that is deliberate. `parseHtml` absorbing an unclosed tag and
  `fileUriToPath` leaving a stray `%` alone are both decisions, and a test is what stops the next
  person "fixing" them.
- Do not assert a literal for anything locale-sensitive. `formatDate` goes through
  `toLocaleDateString`, and Jest cannot change the default locale, so compare it with
  `new Date(timestamp).toLocaleDateString()` for the same value.

## Text and translation

- **A function that takes `t` is called with `englishT`** from `src/locales/index.ts`, and the
  test asserts the English the app shows. Do not build a translator of your own for that, and do
  not stub `t`: `englishT` is the real catalogue, so a test also catches a message that changed.
- **To test the engine itself, build a small `Language` literally in the test**, as
  `i18n.test.ts` does — including one with a plural form English lacks — rather than leaning on
  the English catalogue's current wording.
- **Type-level rules are tested with `// @ts-expect-error`.** `i18n.test.ts` proves that an
  unknown key, a missing value and an extra value fail to compile, over a sample catalogue typed
  with `CatalogueKey` / `CatalogueArgs` and over `englishT`. Jest strips types and never sees
  these; `npm run typecheck` does, because `tsconfig.json` includes `__tests__/`. An
  `@ts-expect-error` line that stops erroring fails typecheck, which is the point. Keep each one
  on its own call and give it a reason.
- A new language needs one test entry: its plural rule's CLDR forms for a few integers in the
  `EXPECTED` table of `locales.test.ts`'s *plural rules* block, which fails until every code in
  `LANGUAGES` is listed there. Every other check runs over each entry of `LANGUAGES` unchanged.

## Which modules a test may import

`src/utils/`, `src/locales/`, `src/types.ts`, `src/theme.ts`, `src/state/reducer.ts`, and the
modules in `src/storage/` with AsyncStorage mocked. Nothing else loads cleanly: `src/i18n/`,
`src/services/` (including `deviceLocale.ts`), `src/state/DecksContext.tsx`, screens and
components import `react-native` or a native module. `useT()` and the device-language reading are
therefore untested.

## What is testable, and where new logic belongs

`src/utils/`, `src/locales/`, `src/types.ts` and `src/state/reducer.ts` import nothing from
`react` or `react-native`. That is the property that makes them testable under Jest with no
renderer and no mocks, and it is deliberate.

- **New pure logic goes in `src/utils/` and gets a test.** A derived number, a sort, a format, a
  parse — all of it. If you find yourself writing a calculation inside a screen, that is the signal
  to move it.
- A new store operation is a new case in `src/state/reducer.ts` and gets a test in
  `__tests__/reducer.test.ts`. A new normaliser rule in `src/storage/` gets a test in that module's
  test file, through the mocked AsyncStorage.
- A function that needs the picker, the filesystem, or a React hook belongs in `src/services/` or
  the component, and is currently untestable here. Say so in your report rather than leaving it
  unsaid.
- Do not add a `react-native` import to a `src/utils/` file to save a few lines. It makes the whole
  module untestable, and the failure is a confusing module-resolution error rather than an obvious
  one.

## Running them

```bash
cd /c/git/easy-flashcards && npm test
```

- Always prefix with the `cd`. A leftover working directory makes the command fail in a way a
  grep-filtered pipeline reports as a pass.
- `npm test -- csv` runs one file. Use it while iterating; run the whole suite before reporting.
- Treat empty output as suspicious, not as success. Report the counts Jest printed, not "tests
  pass".

## If you add the first component test

Not approved, and not yet done — but if it is ever approved, these are the constraints that will
apply, recorded now so they are not rediscovered:

- Drive components, not screens. Components in `src/components/` take plain props and callbacks and
  read neither the store nor the navigator; screens do both. The component layer is the testable
  one, and keeping that line is why.
- Resolve controls by accessibility label. The app has **no `testID` anywhere** — every control is
  found by its `accessibilityLabel` or its text. The existing labels are listed in
  [the UI vocabulary](ui-vocabulary.instructions.md); use them rather than adding a parallel set of
  test ids. They are catalogue messages now, so render under no `I18nProvider` (`useT()` then
  returns English) or look the label up with `englishT` rather than copying the English text.
- `FlipCard`, `HistoryStrip` and `MenuSheet` use `Animated`, `ScrollView.scrollTo` and `Modal`
  respectively. Each needs its own handling under a test renderer, and none of it exists yet.
- `CategoryIcon` `require`s `.xml` vector drawables, and `@react-native/jest-preset` has no
  transform for `.xml`, so anything that imports it, directly or through another component, fails
  to load until one is mapped
  ([ADR-0013](../../docs/architecture/decisions/0013-category-icons-are-android-vector-drawables.md)).
  Since decks carry a category, that reaches well beyond the Categories tab: `CategoryTile`,
  `CategoryIconPicker`, `CategorySquare`, `CategoryField`, `CategoryPicker`, `DeckCard` and
  `SessionCard`, and every screen that renders one of them. Check a component's imports before
  assuming it loads. Logic that a test needs belongs in `src/utils/categories.ts`, which imports no
  drawable.
- `SessionHistoryChart` imports `react-native-svg`, which the preset's `transformIgnorePatterns`
  does not exempt, so it — and `DeckStatsScreen`, which renders it — will not load until the
  pattern is widened and the package mocked
  ([ADR-0018](../../docs/architecture/decisions/0018-react-native-svg-draws-charts.md)). Its
  geometry is already tested in `__tests__/historyChart.test.ts`; test the drawing, not the
  arithmetic again.
