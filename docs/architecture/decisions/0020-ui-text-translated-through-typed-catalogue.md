# ADR-0020: UI text is translated through an in-repo typed catalogue, and the language follows the device

- Status: Active
- Date: 2026-11-05
- Decision makers: Project owner
- Recorded ahead of the work it governs.

## Context

The owner wants the app to be multi-language: every label the user sees must be translatable.
Today the app is English-only, and `AGENTS.md` says so as a rule: user-facing strings are literals
in the component that shows them, and no translation framework is introduced without asking. This
record is that asking, answered. **The owner approved every decision below on 2026-11-05**,
including the answers to the eleven questions the plan put (Q1–Q11, cited where they apply).

What exists:

- **About 400 messages** in 46 files, counted with a throwaway syntax-tree scan of `src/` and
  checked by hand (a heuristic, not exact): every screen, 27 of the components, the navigator's
  tab and header titles, the store's load-error fallback, two services, and seven modules in
  `src/utils/` — `categories.ts` alone holds 21 built-in category names and 85 icon labels.
- **Pure code builds English text.** `describeAnswerShares`, `describeSampleDeckExport`,
  `formatDate` and `formatShortDate` (`'Never'`) return sentences; `TIMEFRAMES`,
  `SEPARATOR_PRESETS` and `CARD_STATUS_LABELS` carry labels; `DeckImportError.message` is shown
  as-is in the *Import failed* alert; `deckNameFromFileName` falls back to `Imported deck`.
- **Precedent for the other way round**: `validateCategoryName` and `validateCustomSeparator`
  return reason codes, and the screen maps each code to English.
- **Several sentences are assembled from fragments** — `card${s}`-style plurals, two local
  `plural` helpers, the category deletion alert, the Deck statistics filter note — which no
  language but English can be translated from.
- **Deck files are already language-neutral.** A built-in category travels by its permanent id,
  not its display name, so that files stay valid once the app is translated
  ([ADR-0019](0019-deck-file-format-version-2.md)).

The forces:

- **The dependency list is short on purpose** (`AGENTS.md`). The mainstream route — i18next with
  react-i18next — is three packages here, not two: **Hermes, this app's JavaScript engine, has no
  `Intl.PluralRules`**, and i18next's own documentation makes a polyfill mandatory on React Native
  for plurals. Hermes does provide `Intl.DateTimeFormat`, `Intl.NumberFormat` and `localeCompare`,
  which the app already uses for dates.
- **Reading the device language needs no new native module.** React Native's own
  `I18nManager.getConstants().localeIdentifier` (an optional string in Java `Locale.toString()`
  form, such as `en_US` or `sr_RS_#Latn`) and `Intl.DateTimeFormat().resolvedOptions().locale`
  are both available; neither has been checked on the device yet.
- **There is one store and no second provider** ([ADR-0003](0003-single-context-reducer-store.md)).
  A language is not app data, but it is read by every screen and every component.
- **Nothing persisted may change without an ADR and approval**
  ([ADR-0004](0004-versioned-defensive-storage.md)). An in-app language choice would be a stored
  setting.
- **Pure logic is testable only while it imports nothing from React** (`AGENTS.md`), and the only
  tested layers are `src/utils/`, the reducer and the storage loaders. A translation mechanism
  that lives in components would be untestable from the start.
- **Nothing renders in the test suite**, so a missed literal on a screen can only be found by
  looking at it — which needs a language other than English to look at before any real
  translation exists.

## Decision

### The mechanism: an in-repo typed catalogue (Q1)

- **No new dependency, no native module, no new Android permission.** Translation is done by this
  repo's own code, as HTML rendering is ([ADR-0001](0001-own-the-html-renderer.md)).
- **The pure engine is [`src/utils/i18n.ts`](../../../src/utils/i18n.ts)**: message lookup,
  `{placeholder}` substitution, plural selection, `formatParts`, `resolveLanguage` and
  `pseudoLocalize`. It imports nothing from `react` or `react-native`, and it is tested.
- **The English catalogue is the source of truth for keys.** It is a nested object written
  `as const` under `src/locales/en/`, split into one file per area so that work running in
  parallel never edits the same file. Its type yields every valid key, and the placeholders each
  message needs are read from the English text by the type system, so **an unknown key, a missing
  value and a value passed to a message with no placeholders all fail `npm run typecheck`.**
- **Plurals are per-language rule functions.** A plural message is an object of forms
  (`{ one: '…', other: '…' }`), and each language supplies a short `(count) => form` function,
  because Hermes cannot choose a form itself. The engine does not use `Intl.PluralRules`, even
  where it might exist.
- **Sentences are whole messages.** A sentence is one message with placeholders; translated
  fragments are never joined into a sentence, because word order differs between languages.

### The language follows the device (Q3, Q4)

- **The language is the device's.** There is no in-app language picker, no new storage key and
  **no storage change at all**: nothing persisted changes shape or meaning.
- **The device tag is read by [`src/services/deviceLocale.ts`](../../../src/services/deviceLocale.ts)**,
  first from `Intl.DateTimeFormat().resolvedOptions().locale`, then from
  `I18nManager.getConstants().localeIdentifier`, else nothing. It is the only file that touches a
  device API for this.
- **Lookup falls back: full tag, then base language, then English.** `pt-BR` tries `pt-BR`, then
  `pt`, then `en`. A Java-form tag is normalised first (`_` to `-`, a `#Script` suffix moved
  after the language subtag). A tag that is empty, missing or unparseable reads as English.
- **The tag is read once, when the provider mounts.** Whether the UI follows a language change
  made while the app is running is unverified; until a device check says otherwise, a change
  takes effect when the app is next started.

### A second React Context, read-only and never persisted (Q2)

- **[`src/i18n/I18nProvider.tsx`](../../../src/i18n/I18nProvider.tsx)** holds `I18nProvider` and
  the `useT()` hook. [`App.tsx`](../../../App.tsx) nests it as
  `SafeAreaProvider > I18nProvider > DecksProvider > RootNavigator`.
- **It is configuration, not a store.** Its value is a `Translator` derived from the device tag.
  It has no reducer, no actions, no dispatch, no load or save effect, and nothing in it is
  persisted. The reducer never reads it and the store never holds text
  ([ADR-0003](0003-single-context-reducer-store.md) Amendment 8).
- **`useT()` falls back to English when no provider is mounted**, rather than throwing as
  `useDecks()` does, so a component rendered on its own — by a future component test, say —
  still shows English text.

### Completeness and fallback (Q5)

- **Strict.** Every language other than English is typed as the **full catalogue**, so a missing
  key fails `npm run typecheck`. A language therefore ships complete or not at all.
- **English stays as the runtime safety net.** A message missing at runtime — only reachable by
  bypassing the types — shows the English message; a key missing from English too shows the key
  itself. A placeholder with no value is left visible as `{name}`.
- **Adding a language is one module plus one registry line**: `src/locales/<code>.ts` (or a
  folder `src/locales/<code>/` mirroring `en/`), typed as the full catalogue with its own plural
  rule, and its entry in `src/locales/index.ts`.

### Formats are not translated (Q6)

- **Dates and numbers keep the device's regional format** even when the text falls back to
  English: `formatDate` and `formatShortDate` keep calling `toLocaleDateString` with the device
  locale, and the catalogue language is not passed to them as a locale.
- **Number values are inserted as `String(value)`**, exactly as today's template literals insert
  them. **`formatRate` is unchanged** (`NN%`, `--` for no reviews). Formatting numbers and
  percentages by locale is a possible later step, not part of this decision.

### What is never translated (Q7, Q11)

- **User data**: card text, deck names and descriptions, custom category names, a session's
  `deckName` copy. They are shown exactly as stored.
- **Everything in a deck file**: every JSON key, every `# key:` comment line, the `format` value,
  the CSV header names `question` and `answer`, category ids and references
  ([ADR-0019](0019-deck-file-format-version-2.md)); and the export's fallback file name `deck`.
- **The sample deck**: its content and its file names, which `__tests__/sampleDeck.test.ts`
  checks against `samples/`.
- **Identifiers**: storage keys, ids, icon keys, route names.
- **Developer-facing text**: thrown `Error` messages, `DeckImportError.message`, the
  `useDecks must be used inside a DecksProvider` guard, `console` output.
- **Error details from native code** (storage, the picker, the file system), which arrive in
  English: they are shown after a translated lead-in, not replaced.
- **The Android app name** `app_name` (`EasyFlashcards`), which is the brand.

Accessibility labels and hints **are** translated: they are text the user hears.

### Pure code returns codes or takes a `Translator`

- **Code under `src/utils/`, `src/services/`, `src/state/` and `src/storage/` never looks up a
  message by itself.** It either returns a code that the screen maps to a message, or takes a
  `Translator` as a parameter. It never imports a translator, so no English can hide in it.
- **Errors carry codes.** `DeckImportError` gains a `code`; its `message` stays English, for
  diagnostics only ([ADR-0017](0017-deck-import-reads-exported-formats.md) Amendment 4).
- **Label lists lose their labels.** `TIMEFRAMES`, `SEPARATOR_PRESETS`, `CARD_STATUS_LABELS` and
  the Deck statistics sort options keep only their keys; the text is looked up where it is shown.
- **Sentence builders take `t`** — `formatDate`, `formatShortDate`, `describeAnswerShares`,
  `describeSampleDeckExport` — so their logic stays tested.
- **Built-in category names and icon labels are catalogue messages**
  ([ADR-0012](0012-custom-categories-third-storage-key.md) Amendment 4,
  [ADR-0013](0013-category-icons-are-android-vector-drawables.md) Amendment 4). Ids, icon keys,
  colours and the order that gives each built-in its colour do not change.
- **Tests pass the English translator**, so they assert the same English the app shows today.

### A pseudo-language ships (Q8)

- **`en-XA`, Android's developer pseudo-locale, selects a pseudo-language** built from the
  English catalogue by `pseudoLocalize()`: letters swapped for accented look-alikes, the text
  lengthened by about a third and wrapped in brackets, `{placeholders}` left intact. It uses the
  English plural rule.
- **It is in release builds too**, because device checks use the release APK. It is selected only
  by the exact `en-XA` tag; no user sees it unless they choose that developer locale.
- It exists so that a missed literal, a joined fragment or a label too long for its box is visible
  on a device before any real translation exists. **The owner approved switching the attached
  phone to `en-XA` for this app during verification, and restoring it afterwards** (Q9).

### Not in this work (Q10)

- **No right-to-left support.** Mirroring the layout — the hand-drawn icons, the Study screen's
  swipe direction, `I18nManager.forceRTL` — is separate work and is not planned. An RTL device
  language falls back to English by the rule above unless an RTL catalogue is added, and adding
  one without that work would show a left-to-right layout with right-to-left text.

## The contract for implementers

This section is binding on the migration so that tasks working in parallel agree without
coordinating. Names and signatures are exact; bodies are the implementer's.

### Engine: `src/utils/i18n.ts`

```ts
// Pure. Imports nothing from react or react-native; may `import type` the English catalogue.
export type PluralCategory = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';
export type PluralRule = (count: number) => PluralCategory;
export type PluralMessage = Readonly<Partial<Record<PluralCategory, string>> & { other: string }>;
export type MessageValue = string | number;

/** The English catalogue's shape, every string widened to string and every plural object to PluralMessage. */
export type Catalogue = /* derived from typeof en */;
/** Every dot-path from the catalogue root to a message, e.g. 'decks.deleteDeckAlert.title'. */
export type MessageKey = /* derived from typeof en */;
/** One entry per {placeholder} in the English message (all its forms, for a plural), plus `count: number` for a plural. */
export type MessageValues<K extends MessageKey> = /* derived from typeof en */;
/** [] for a message with no placeholders that is not plural; otherwise [values: MessageValues<K>]. */
export type MessageArgs<K extends MessageKey> = /* derived */;

export type MessagePart = { readonly text: string; readonly placeholder: string | null };

export interface Translator {
  <K extends MessageKey>(key: K, ...args: MessageArgs<K>): string;
  parts<K extends MessageKey>(key: K, ...args: MessageArgs<K>): MessagePart[];
}

export type Language = {
  readonly code: string; // BCP 47: 'en', 'en-XA', 'de', 'pt-BR'
  readonly plural: PluralRule;
  readonly messages: Catalogue;
};

export function createTranslator(language: Language, fallback: Language): Translator;
export function formatMessage(template: string, values?: Readonly<Record<string, MessageValue>>): string;
export function formatParts(template: string, values?: Readonly<Record<string, MessageValue>>): MessagePart[];
export function resolveLanguage(tag: string | null | undefined, codes: readonly string[], fallback: string): string;
export function pseudoLocalize(text: string): string;
export function pseudoLocalizeCatalogue(messages: Catalogue): Catalogue;
```

- **`t(key)`** for a message with no placeholders; **`t(key, { name: value })`** for one with
  placeholders. Passing values to a message that has none, or omitting one it needs, fails
  typecheck.
- **A plural message is called with `count`**: `t('learn.sessionCard.cardCount', { count: n })`.
  `count` is a required `number`; the language's rule picks the form, `other` stands in for a form
  the message lacks, and `{count}` in the text is replaced like any other placeholder.
- **`t.parts(key, values)`** returns the same text as `t(key, values)`, split in order into
  literal runs (`placeholder: null`) and one part per placeholder occurrence (`placeholder:
  '<name>'`, `text` its value). Empty literal runs are omitted; joining every `text` gives
  `t(key, values)`. It is how a value inside a sentence gets its own style:

  ```tsx
  const t = useT();
  <Text style={styles.line}>
    {t.parts('decks.deckCard.cardCount', { count: deck.cards.length }).map((part, index) => (
      <Text key={index} style={part.placeholder === 'count' ? styles.strong : undefined}>
        {part.text}
      </Text>
    ))}
  </Text>
  ```

- `formatMessage` and `formatParts` are the pure primitives behind `t` and `t.parts`, exported for
  tests; screens and components call `t` and `t.parts`.
- **Placeholders** are `{name}`, where `name` matches `[A-Za-z][A-Za-z0-9]*`. Catalogue text
  contains no other `{` or `}`. Values are inserted ready to display: a date through `formatDate`,
  a rate through `formatRate`, a number as `String(value)`.

### Registry: `src/locales/index.ts`

```ts
export const ENGLISH: Language;        // code 'en', messages en, plural englishPlural
export const PSEUDO: Language;         // code 'en-XA', messages pseudoLocalizeCatalogue(en), plural englishPlural
export const LANGUAGES: readonly Language[]; // ENGLISH, PSEUDO, then each translation
export const englishT: Translator;     // createTranslator(ENGLISH, ENGLISH)
export function translatorForTag(tag: string | null | undefined): Translator;
```

### English catalogue: `src/locales/en/`

```ts
// src/locales/en/<area>.ts — one exported const per file, named after the file
export const decks = { /* nested groups and messages */ } as const;

// src/locales/en/index.ts
export const en = {
  common, navigation, answers, importExport, categoryNames,
  shell, decks, editDeck, learn, study, categories, stats, deckStats,
} as const;
export const englishPlural: PluralRule; // n === 1 ? 'one' : 'other'
```

### Device and React: `src/services/deviceLocale.ts`, `src/i18n/I18nProvider.tsx`

```ts
// src/services/deviceLocale.ts
export function getDeviceLocaleTag(): string | null;

// src/i18n/I18nProvider.tsx
export function I18nProvider(props: { children: React.ReactNode }): React.JSX.Element;
export function useT(): Translator; // englishT when no provider is mounted
```

### Keys

- **`<area>.<owner>.<element>`**, with further segments only for the parts of one thing
  (`.title`, `.message`, `.confirm`). Examples: `decks.deleteDeckAlert.title`,
  `decks.deckCard.optionsA11yLabel`, `common.actions.cancel`,
  `categoryNames.builtIn.computer_science`.
  - **area** is the catalogue file the key lives in.
  - **owner** is the screen, component, alert, dialog or menu that shows it, in camelCase from
    its name in the [UI vocabulary](../../../.github/instructions/ui-vocabulary.instructions.md)
    (`deckCard`, `sessionSetupDialog`, `deleteDeckAlert`). In `common`, `answers`,
    `importExport` and `categoryNames` it names a group instead (`actions`, `importErrors`,
    `icons`).
  - **element** names the text: a control (`startButton`), a part (`title`), or an
    accessibility string, suffixed `A11yLabel` or `A11yHint`.
- **A segment matches `[a-z][A-Za-z0-9_]*`.** Underscores appear only where a segment is a
  domain key used verbatim — an icon key, as in `categoryNames.icons.rocket_launch`.
- **`zero`, `one`, `two`, `few`, `many` and `other` are reserved** for the forms inside a plural
  message; no group has a member with one of those names.
- **A key is written as a literal at the call site**, or as a template literal over a union type
  whose every member is a key (`` `categoryNames.icons.${icon}` ``), so typecheck proves it
  exists. A key is never assembled from a runtime string.
- **Text is stored as it is displayed today.** A label shown in capitals is stored in capitals;
  changing that to a style is a Designer decision outside this work. Quotation marks and
  punctuation belong inside the message.

### Who edits which catalogue file

| File | Written in | After that |
|---|---|---|
| `src/locales/index.ts`, `src/locales/en/index.ts` | Phase 1 (foundation) | Not edited by any later phase |
| `src/locales/en/common.ts` | Phase 1 | Read-only in Phases 2 and 3; Phase 4, which runs alone, may move duplicated messages into it |
| `src/locales/en/navigation.ts` | Phase 1 | — |
| `src/locales/en/{answers,importExport,categoryNames}.ts` | Phase 2 (pure code and its callers) | Read-only in Phase 3 |
| `src/locales/en/{shell,decks,editDeck,learn,study,categories,stats,deckStats}.ts` | Created empty (`{} as const`) in Phase 1 | Each filled by exactly one Phase 3 task |

- **A Phase 3 migration task edits only its own catalogue file** and its own source files. It may
  **use** keys from `common`, `navigation`, `answers`, `importExport` and `categoryNames`, which
  exist before it starts, but never keys from another Phase 3 area, which may not exist yet.
- **A message a task needs that is not in `common.ts` goes into its own area file**, even if
  another area has the same words. Phase 4 removes the duplicates.
- A file with UI text that no task owns is reported, not taken.

### Callers that are not React components

- **They take `t: Translator` as their last parameter**, supplied by the screen from `useT()`, or
  by a test as `englishT`. Phase 2 lands these signatures:

  ```ts
  // src/utils/stats.ts
  export function formatDate(timestamp: number | null, t: Translator): string;
  export function formatShortDate(timestamp: number | null, t: Translator): string;
  export function describeAnswerShares(shares: AnswerShares | null, t: Translator): string;
  // src/utils/sampleDeck.ts
  export function describeSampleDeckExport(
    outcomes: readonly SampleDeckExportOutcome[],
    t: Translator,
  ): { title: string; message: string } | null;
  // src/utils/categories.ts
  export function categoryDisplayName(category: Category, t: Translator): string;
  export function getCategoryIconLabel(icon: CategoryIcon, t: Translator): string;
  export function validateCategoryName(input: string, customs: readonly Category[], t: Translator): CategoryNameResult;
  export function sortCategoriesByName(categories: readonly Category[], t: Translator): Category[];
  export function getAllCategories(customs: readonly Category[], t: Translator): Category[];
  // src/utils/timeframe.ts
  export const TIMEFRAMES: readonly Timeframe[];
  // src/utils/deckExport.ts
  export type SeparatorPreset = { key: 'comma' | 'semicolon' | 'tab'; value: string };
  // src/utils/deckImport.ts
  export type DeckImportErrorCode =
    | 'emptyFile' | 'notADeck' | 'newerVersion' | 'noCards' | 'noHeader' | 'noUsableRows' | 'unreadable';
  export class DeckImportError extends Error {
    readonly code: DeckImportErrorCode;
    constructor(code: DeckImportErrorCode, message: string);
  }
  // src/utils/csv.ts
  export function deckNameFromFileName(fileName: string | null | undefined): string | null;
  ```

- **`formatRate` keeps its signature.** No `src/state/` or `src/storage/` function takes a
  `Translator`, and `DecksContextValue` does not change: `State.error` keeps the raw diagnostic
  text, which the screen shows after a translated lead-in.

### The guard

After the migration, `.eslintrc.js` gains ESLint's built-in `no-restricted-syntax` rule — no
plugin — flagging JSX text containing letters, and string or template literals passed as
`accessibilityLabel`, `accessibilityHint`, `placeholder`, `title` or `label`, or to
`Alert.alert`. It is a net for literals added later, not proof that none remain.

### Tests

- `__tests__/i18n.test.ts`: substitution (missing and repeated values), plural selection with
  English and with a test-only language that has a `few` form, the English fallback,
  `resolveLanguage` over every tag form above including `en-XA`, `formatParts`, `pseudoLocalize`
  keeping placeholders intact, and `@ts-expect-error` lines proving that an unknown key, a missing
  value and an extra value fail typecheck (`tsconfig.json` includes the tests).
- `__tests__/locales.test.ts`, for every registered language: the same keys as English, the same
  placeholders per message, every plural form its rule returns for 0–1000 present, no empty
  string, no reserved name used as a group member; and an English label for every
  `CATEGORY_ICONS` key and every built-in category.
- Existing tests of changed functions pass `englishT` and keep asserting today's English, and
  assert `DeckImportError.code` rather than the message.

## Alternatives Considered

- **i18next + react-i18next + `intl-pluralrules`.** Mature, with ICU message syntax,
  translation-platform tooling, and type-safe keys through `CustomTypeOptions`. Rejected: three
  new packages for an app that keeps its list short on purpose, a polyfill that must load before
  anything else because Hermes lacks plural rules, and a larger bundle — all to do what about 400
  messages and a handful of rule functions need. Worth revisiting only if a translation service
  is adopted.
- **Adding `react-native-localize` for the device language**, with either mechanism. Rejected: it
  is a native module, which needs a native rebuild and a check of what it merges into the
  manifest, to read a value React Native and Hermes already expose.
- **A module-level `t()` fixed at startup, with no provider.** The smallest change, and usable in
  navigator options without a hook. Rejected: it is a global singleton, which `AGENTS.md` rules
  out, and following a language change would mean remounting the whole tree rather than changing
  one context value.
- **English text as the key** (gettext style). No key naming to agree on. Rejected: correcting an
  English typo changes the key in every language, two identical English strings with different
  meanings collide, and the placeholders a message needs cannot be typed from it.
- **Android string resources** (`strings.xml`). The platform's own mechanism, translated by
  standard tools. Rejected: JavaScript cannot read them without native code, and it would split
  the text from the components that show it.
- **Loose completeness** — a missing key shows English. Rejected for a shipped language: half a
  translation reads worse than none. English remains the runtime fallback anyway.
- **An in-app language picker.** Rejected for now: it needs a stored setting, which is a new
  storage key, an ADR and approval. Android 13's per-app language setting is another later route;
  it needs a manifest and `res/xml` change, which also needs approval, but no stored setting.
- **No pseudo-language.** Rejected: no check on a device could tell a translated label from a
  missed one until a real translation exists.

## Consequences

### Positive

- No dependency, no native module, no permission, no storage change: nothing a user can lose, and
  nothing that needs a native rebuild.
- A wrong key, a missing value and an incomplete language fail `npm run typecheck`; the engine and
  the catalogue's consistency are tested in Jest.
- Pure logic stays pure and tested: it returns codes or takes `t`, and its tests assert the same
  English as before.
- The catalogue is split by area, so the migration can run as parallel tasks that share no file.
- The pseudo-language makes missed text and long labels visible on a device.

### Negative

- **The type machinery is the most complex TypeScript in the repo**: recursive key paths and
  placeholder extraction from string literal types. It may slow `tsc`, and its error messages are
  harder to read than a plain lookup's.
- **Plural rules are hand-written per language**, and a wrong one picks the wrong form silently;
  `locales.test.ts` checks only that every form a rule returns exists.
- **The language is fixed for a run** until a device check shows a change is followed; a user who
  switches language may need to restart the app.
- **Text and formats can disagree**: an unsupported language shows English text with the device's
  regional dates. Numbers and percentages are not localised.
- **A deck imported with no usable title or file name is named in the language active at import**,
  and keeps that name: it is data from then on.
- **Native error details stay English** after a translated lead-in.
- **The sample deck is English** in every language.
- **No right-to-left support.**
- **Device-check notes that find controls by their English accessibility labels** stop matching
  under another language.
- **The pseudo-language ships** in every build, a small amount of code and computed text that no
  ordinary user sees.
- **About 400 call sites change**, mostly in screens and components that no test renders; only a
  device run can confirm they read as before.

## Amendment 1 — 2026-11-05

The migration landed. What it found and how it differs in detail from the record above; the
decision itself stands.

- **The per-app `en-XA` pseudo-locale is ignored by the test phone.** On the Samsung test phone
  (Android 13), `adb shell cmd locale set-app-locales com.easyflashcards --locales en-XA` left the
  app on `en-US`, so the pseudo-language cannot be selected there that way. A per-app `de-DE` does
  reach the app: after a relaunch it is what `Intl.DateTimeFormat().resolvedOptions().locale`
  returns, which confirms `Intl` as the first source `deviceLocale.ts` reads. To see the
  pseudo-language on that phone, build with `PSEUDO.code` in `src/locales/index.ts` temporarily
  set to `de`, set the app's locale to `de-DE`, then revert the code and restore the app locale
  with `--locales ""`. The pseudo-language can be selected only through a locale tag the device
  honours, so on this phone that route replaces the approved switch to `en-XA` described under
  *A pseudo-language ships*.
- **The engine exports more than the contract listed.** `normalizeLocaleTag(tag)` is exported
  and used by `deviceLocale.ts` to normalise both sources; `CatalogueKey<C>`,
  `CatalogueValues<C, K>` and `CatalogueArgs<C, K>` are the key and placeholder derivations over
  any catalogue, which `MessageKey`, `MessageValues` and `MessageArgs` apply to English and the
  tests apply to a small sample catalogue.
- **Language matching is case-insensitive, and the fallback order is longer.** `resolveLanguage`
  tries, in order, the full normalised tag, language and script, language and region, the
  language alone, then the fallback. `pt-BR` still tries `pt-BR`, `pt`, then `en`; `sr-Latn-RS`
  tries `sr-Latn-RS`, `sr-Latn`, `sr-RS`, `sr`.
- **The lint guard covers more than *The guard* listed, and misses some things.** The
  `no-restricted-syntax` override in `.eslintrc.js` applies to `src/screens/`, `src/components/`
  and `src/navigation/` only. It flags JSX text with letters, and a string or template literal
  with letters given — directly or through up to two levels of `?:`, `&&`, `||` or `??` — to a
  text prop or an object key of the same name (the list in the file: `accessibilityLabel`,
  `accessibilityHint`, `title`, `label`, `placeholder`, `message`, `actionLabel`, `searchLabel`,
  `inputLabel`, `description`, `caption`, `subtitle`, `text`), to a JSX expression child, or to
  `Alert.alert`. It does not see text built by concatenation, text built by a helper function, a
  literal passed as a plain function argument, or anything outside those three folders.
- **`common.ts` holds more than actions.** Besides `common.actions.*`, it holds `common.search.*`
  (the Search bar's no-match texts) and `common.counts.*` (the shared card, session and review
  counts), moved there when duplicates were removed.
- **File-format names live in code, not in the catalogue.** `JSON` and `CSV` are
  `EXPORT_FORMAT_NAMES` in `src/utils/deckExport.ts`, because a file-format name is never
  translated (*What is never translated*).
- **The store's load error is not shown after a lead-in.** The Decks screen shows the catalogue
  message `decks.decksScreen.loadError` whenever `State.error` is set, and does not show the raw
  detail; `State.error` still holds it, unchanged, for diagnostics. This differs from *Callers
  that are not React components*, which says the screen shows that detail after a translated
  lead-in.
- **The *Export failed* alert shows the export error's own message**, with no lead-in, when the
  thrown value is an `Error`, and `importExport.exportAlert.failedFallback` otherwise. That detail
  is native and English. The *Import failed* alert and the sample deck export do put native
  detail after a translated lead-in.
- **No device verification.** The migrated UI has not been seen on a device in any language,
  English and the pseudo-language included; only the locale reading above was checked on the
  phone, before the migration. Whether a language change made while the app runs is followed is
  still unknown.

## Amendment 2 — 2026-11-06

Translations landed under this decision, unchanged: each is one module in `src/locales/` with a
hand-written plural rule, registered in `LANGUAGES` after English and the pseudo-language. They
are machine-written and not reviewed by native speakers, and none has been seen on a device.
Portuguese is Brazilian wording registered as `pt`. French, Spanish, Italian and Portuguese do not
implement the CLDR `many` form for exact millions, deliberately; such a count uses `other`.

## Amendment 3 — 2026-11-06

Seven more translations landed, the first right-to-left language among them. The decision
stands; this records what they changed in detail, and one statement of the record above that the
owner reversed.

- **Seven more languages**, registered in `LANGUAGES` after the first nine translations, each one
  module in `src/locales/` with its own plural rule as Amendment 2 describes: Arabic (`ar`),
  Indonesian (`id`), Vietnamese (`vi`), Thai (`th`), Japanese (`ja`), Simplified Chinese
  (`zh-CN`) and Korean (`ko`). The same caveats hold: they are machine-written, not reviewed by
  native speakers, and none has been seen on a device — none was attached when they landed.
- **Plural rules.** Indonesian, Vietnamese, Thai, Japanese, Chinese and Korean have only `other`.
  Arabic has all six forms — `zero`, `one`, `two`, `few` (last two digits 3 to 10), `many` (last
  two digits 11 to 99) and `other` — and its plural messages carry each of them.
  `locales.test.ts` now also checks every registered language's rule against the CLDR form of
  known integers, from a table that must list every code in `LANGUAGES`.
- **Chinese is Simplified only, registered as `zh-CN`**, in `src/locales/zhHans.ts`. The code is
  `zh-CN` rather than `zh-Hans` because `resolveLanguage` tries the full tag, language and script,
  language and region, then the language alone: a device reporting `zh_CN` or `zh-CN`, with no
  script, would never reach `zh-Hans`, while `zh-Hans-CN` still reaches `zh-CN`. The Traditional
  tags `zh-TW`, `zh-Hant-TW` and `zh-HK` fall back to English, deliberately, rather than showing
  Simplified characters. By the same rule a Simplified tag with another region (`zh-SG`,
  `zh-Hans-SG`) or a bare `zh` also falls back to English; no test covers those.
- **Right-to-left text is supported; the layout is never mirrored.** This reverses *Not in this
  work*, which said right-to-left support was not planned and that an RTL catalogue without
  mirroring "would show a left-to-right layout with right-to-left text". The owner asked for
  Arabic "if possible without the mirroring UI", so that combination is now the intended result:
  - `keepLayoutLeftToRight()` in `src/services/deviceLocale.ts`, called from `index.js` before
    `AppRegistry.registerComponent`, calls `I18nManager.allowRTL(false)` and
    `I18nManager.forceRTL(false)`.
  - `NavigationContainer` in `src/navigation/RootNavigator.tsx` is given `direction="ltr"`.
  - Each text takes its run direction from its own content: React Native's Android
    `TextLayoutManager` uses `TextDirectionHeuristics.FIRSTSTRONG_LTR`, so Arabic reads right to
    left within its lines. The paragraph direction stays left-to-right, so by that code a text
    with no `textAlign` is aligned to the left, as in English. This is read from React Native's
    source, not observed.
  - The hand-drawn icons, the Study screen's swipe direction and the order of every row keep
    their left-to-right design.
- **The setters take effect from the second launch.** On Android, `allowRTL` and `forceRTL` write
  a preference in React Native's own `SharedPreferences` (`I18nUtil` — not AsyncStorage, and no
  user data), which React Native reads when the root view is created, before `index.js` runs. The
  **first launch on an Arabic-language device can therefore still be laid out right-to-left
  once**, with `I18nManager.getConstants().isRTL` cached `true` for that run; from the second cold
  start the layout stays left-to-right. Clearing the app's data clears that preference, so the
  next launch is a first launch again. This follows from React Native's source; it has not been
  observed.
- **The fully reliable fix is not made.** `I18nUtil.isRTL` is `false` whenever the application
  does not declare RTL support, so `android:supportsRtl="false"` in
  `android/app/src/main/AndroidManifest.xml` would keep the layout left-to-right from the first
  launch. The manifest says `"true"`, the React Native template's value, and changing it needs the
  owner's approval (`AGENTS.md` *What to ask before doing*), which has not been given. It would
  also change what Android itself draws for the app, such as `Alert` dialogs, which presumably
  follow the device's direction today; that is unobserved.
- **Another right-to-left language, or real mirroring, still needs asking.** The approval covered
  Arabic shown without mirroring. Hebrew, Persian, Urdu or any other RTL language would get the
  same unmirrored layout, and mirroring the layout — the icons, the swipe, `forceRTL(true)` — is
  still the separate, unplanned work *Not in this work* describes.
- **Legacy language codes.** `normalizeLocaleTag` maps the pre-1989 ISO 639 primary subtags that
  Java's `Locale` still reports — `in` to `id`, `iw` to `he`, `ji` to `yi` — so an Indonesian
  device read through `I18nManager.getConstants().localeIdentifier` selects Indonesian. Hebrew and
  Yiddish have no catalogue; for them the mapping only makes the tag correct.

## References

- [ADR-0003](0003-single-context-reducer-store.md) — one store; the read-only i18n context is not
  one (Amendment 8)
- [ADR-0012](0012-custom-categories-third-storage-key.md) — built-in category names become display
  text, and the name rule (Amendment 4)
- [ADR-0013](0013-category-icons-are-android-vector-drawables.md) — icon labels move to the
  catalogue; `EXTRA_CATEGORY_ICONS` becomes an explicit list (Amendment 4)
- [ADR-0017](0017-deck-import-reads-exported-formats.md) — the *Import failed* alert shows a
  translated message chosen by error code (Amendment 4)
- [ADR-0019](0019-deck-file-format-version-2.md) — deck files already name a built-in category by
  its language-neutral id; unchanged
- [ADR-0001](0001-own-the-html-renderer.md) — card HTML is user data and is not translated;
  unchanged
- [ADR-0004](0004-versioned-defensive-storage.md) — unchanged; an in-app language choice would
  need a new key under it
- [ADR-0007](0007-okeish-third-answer.md) — stored answer values are unchanged; only their labels
  are translated
- [`App.tsx`](../../../App.tsx), [`src/utils/i18n.ts`](../../../src/utils/i18n.ts),
  [`src/locales/`](../../../src/locales/),
  [`src/services/deviceLocale.ts`](../../../src/services/deviceLocale.ts),
  [`src/i18n/I18nProvider.tsx`](../../../src/i18n/I18nProvider.tsx) — created or changed by the
  work
- [AGENTS.md](../../../AGENTS.md) — *Tech stack*, *State ownership*, *Strings and formatting*
- [ARCHITECTURE.md](../ARCHITECTURE.md) — links this record from the sections the work changed,
  since the work landed (Amendment 1)
