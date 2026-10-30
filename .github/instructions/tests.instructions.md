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

- the pure logic in `src/utils/`;
- the reducer in `src/state/reducer.ts`, called directly with a state and an action;
- the two storage loaders, with `@react-native-async-storage/async-storage` replaced by a
  `jest.mock` in each test file. That is the only mock in the suite.

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
  values as arguments. The one file read from disk is `samples/sample-deck.csv`, in
  `sampleDeck.test.ts`, because the test exists to check that the shipped copy matches it.
- **Assert on returned values**, never on how a function got there.
- Test the failure path as well as the happy one. `parseFlashcardsCsv` throws `CsvImportError` on
  a file it cannot use, and that is part of its contract — assert on the throw, not just on the
  parse.
- Test the tolerance that is deliberate. `parseHtml` absorbing an unclosed tag and
  `fileUriToPath` leaving a stray `%` alone are both decisions, and a test is what stops the next
  person "fixing" them.
- Do not assert a literal for anything locale-sensitive. `formatDate` goes through
  `toLocaleDateString`, and Jest cannot change the default locale, so compare it with
  `new Date(timestamp).toLocaleDateString()` for the same value.

## What is testable, and where new logic belongs

`src/utils/`, `src/types.ts` and `src/state/reducer.ts` import nothing from `react` or
`react-native`. That is the property that makes them testable under Jest with no renderer and no
mocks, and it is deliberate.

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
  test ids.
- `FlipCard`, `HistoryStrip` and `MenuSheet` use `Animated`, `ScrollView.scrollTo` and `Modal`
  respectively. Each needs its own handling under a test renderer, and none of it exists yet.
