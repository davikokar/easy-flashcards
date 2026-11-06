# ADR-0021: A Settings screen holds a stored language choice, the app's links, and a one-off tip purchase

- Status: Active
- Date: 2026-11-06
- Decision makers: Owner (approved the stored language setting and `react-native-iap`), Planner

## Context

The App menu's *Settings* item was a placeholder that showed an alert. The owner asked for the
screen behind it, in four sections:

- **General** — *Change language*, among the languages the app is translated into.
- **App** — *Share app*, *Rate app*, *Customer support* (a mail to a fixed address with a fixed
  subject) and *About* (the app's name and version).
- **Community and support** — *Buy me a coffee*, an in-app purchase.
- **Legal** — *Privacy policy* and *Terms*, links to files hosted on GitHub.

Four of these collide with standing rules:

1. [ADR-0020](0020-ui-text-translated-through-typed-catalogue.md) makes the language the device's,
   read once, and [ADR-0003](0003-single-context-reducer-store.md) Amendment 8 says an in-app
   language choice is not allowed in the i18n context and needs a storage key, an ADR and approval.
2. A stored language is persisted state, the one class of change the user cannot recover from if
   it is wrong ([ADR-0004](0004-versioned-defensive-storage.md)).
3. A purchase needs Google Play Billing, which is a native dependency; the dependency list is short
   on purpose.
4. The navigation is one tab navigator with one stack per tab; the App menu is shown by every tab
   root, so the screen cannot belong to one tab's stack.

The owner approved the stored language setting and the dependency when asked.

## Decision

**1. Settings is a screen above the tabs.** `RootNavigator` wraps the tab navigator in one native
stack with two routes, `Tabs` (header hidden) and `Settings`. Every tab root opens it from the App
menu through `useOpenSettings()` and the `onOpenSettings` prop of `AppMenu`, so `AppMenu` and
`HeaderToolbar` stay free of navigation and the tab bar is not shown on Settings.

**2. The language choice is a fourth storage key, `@easy-flashcards/settings/v1`**, owned by
`src/storage/settingsStorage.ts`. It holds one object, `{ "language": string | null }`, where
`null` means *follow the device* and a string is the `code` of a language in `LANGUAGES`. The
loader never throws: a missing, corrupt or wrongly shaped value reads as `null`. A code that no
language registers reads as `null` at use, not at load, so a build with fewer languages falls
back to the device language rather than to English.

**3. `I18nProvider` owns that setting, not `DecksContext`.** The provider loads the key when it
mounts, renders nothing until the read settles (it settles on failure too), and exposes the
translator plus `languageChoice` and `setLanguageChoice` through `useLanguage()`. A choice
replaces the translator at once, so every screen re-renders in the new language without a restart,
and is written whole to the key at that moment — no save effect, so a failed load cannot make it
overwrite anything. A failed write is swallowed, like the other keys: the choice still holds for
the run. The pseudo-language is never offered in the picker. This keeps the rule that
`DecksContext` is the only store for **app data**: the language is configuration, loaded before
the store, and the provider gains no reducer.

**3a. The picker names each language in itself** (`LANGUAGE_NAMES` in `src/locales/index.ts`:
*Deutsch*, *Français*, …), so it can be read whatever language the app is in. Those names are
data, not catalogue messages. The first row, *System default*, is a catalogue message and means
`null`.

**4. The purchase is one consumable Google Play product, `tip_coffee`, bought through
`react-native-iap`** (with its required peer `react-native-nitro-modules`). `src/services/tipJar.ts`
is the only importer: it opens the store connection, asks the store for the product, starts the
purchase, and finishes the transaction as consumable so the same person can tip again. It grants
nothing and stores nothing — a tip is a thank-you, not an entitlement — so there is no receipt
verification and nothing persisted. If the store, the connection or the product is unavailable the
screen says so; the product itself is created in the Play Console and until it exists and the
build is installed from Play, the row reports it unavailable. Merging the library adds the
`com.android.vending.BILLING` permission to the packaged manifest; that is the approved
dependency's, and no source manifest line changes.

**5. The other rows use React Native alone.** *Share app* is `Share.share`, *Rate app* opens the
store listing with `Linking`, *Customer support* opens a `mailto:` link, and the legal rows open a
URL. No dependency is added for these. *About* shows the app's name and its version; the version
is `version` in `package.json`, which `android/app/build.gradle` now also reads for `versionName`,
so there is one number.

**6. The store link, the privacy policy link and the terms link are placeholders** in
`src/utils/appLinks.ts` until the owner supplies real ones. The store link is the listing URL
built from the package id, which is right once the app is published; the two legal links point at
a placeholder GitHub path. Each placeholder is named as one in that file, and the owner replaces
them there.

## Alternatives Considered

- **Android per-app locale** (as the Ballooner app does): the OS stores the choice and Settings >
  Languages stays in sync. It needs a custom native module in a project with none, applies on API
  33 and up only, and the test phone already ignores one per-app locale (`en-XA`). Not chosen; the
  stored key is portable and testable.
- **Putting the setting in `DecksContext`**: one store, one load. It would load languages after the
  spinner, mix configuration into app data, and tie a language change to the decks save effect.
  Not chosen.
- **Rendering the previous language until the key loads**: avoids a blank frame but shows a flash
  of the wrong language, which is the thing the setting is for. Not chosen.
- **Placeholder purchase row with no library**: the owner chose the library.
- **`react-native-device-info` for the version**: a new native dependency for one string. Not
  chosen.
- **A stub dependency-free tip** (open a Buy Me a Coffee web link): not an in-app purchase, which
  is what was asked for.

## Consequences

### Positive

- The language can be changed while the app runs, and survives a restart.
- A new key is isolated, tiny, and defensively read, so it cannot stop the app starting.
- `AppMenu` and `HeaderToolbar` stay navigation-free.
- The tip purchase touches no stored data and no statistic.

### Negative

- The i18n context is no longer read-only; it carries one persisted setting. ADR-0003 Amendment 9
  and ADR-0020 Amendment 4 record that.
- The app shows nothing for the few milliseconds the settings key takes to read at launch.
- `react-native-iap` and `react-native-nitro-modules` are two native dependencies, they add the
  BILLING permission to the packaged manifest, and the first build after installing them compiles
  native code. The tip cannot be tested end to end until the Play Console product exists and the
  app is installed from a Play test track.
- The translations of the new messages are machine-written and not reviewed by native speakers,
  like the rest of the catalogue.

## References

- [ADR-0003](0003-single-context-reducer-store.md) — Amendment 9: the provider's setting
- [ADR-0004](0004-versioned-defensive-storage.md) — the defensive read rule the new key follows
- [ADR-0020](0020-ui-text-translated-through-typed-catalogue.md) — Amendment 4: language choice
- [`src/storage/settingsStorage.ts`](../../../src/storage/settingsStorage.ts),
  [`src/i18n/I18nProvider.tsx`](../../../src/i18n/I18nProvider.tsx),
  [`src/screens/SettingsScreen.tsx`](../../../src/screens/SettingsScreen.tsx),
  [`src/services/tipJar.ts`](../../../src/services/tipJar.ts),
  [`src/utils/appLinks.ts`](../../../src/utils/appLinks.ts) — created or changed by the work
