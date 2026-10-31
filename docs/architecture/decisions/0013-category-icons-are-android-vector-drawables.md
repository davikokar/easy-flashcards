# ADR-0013: Category icons are Android vector drawables rendered with Image

- Status: Active
- Date: 2026-10-30
- Decision makers: Project owner
- Recorded ahead of the work it governs.

## Context

Every icon in the app today is drawn from nested `View`s — the menu glyphs, the answer glyphs and
the tab icons — and `AGENTS.md` states it as a rule: no UI component library, no icon font. That
works because those glyphs are geometric: a tick, a cross, a magnifier, three dots.

Categories ([ADR-0012](0012-custom-categories-third-storage-key.md)) need 21 subject pictograms —
a telescope, a flask, a film reel, a leaf. These are detailed vector shapes. They exist as Google
**Material Symbols** SVGs, licensed under the **Apache License 2.0**, and the owner chose them.
Drawing them from `View`s is not realistic, and React Native renders no SVG out of the box.

Since React Native 0.78, the `Image` component on Android renders **Android XML drawables**,
including vector drawables, from a `require`d `.xml` file
([React Native 0.78 release notes](https://reactnative.dev/blog/2025/02/19/react-native-0.78)). This
project's React Native version is above that ([`package.json`](../../../package.json)). Metro's
default asset extensions include `xml`, so no Metro configuration is needed. The release notes
state the limits that matter here:

- the drawables are compiled by AAPT at **Android build time** and cannot be served by Metro, so
  adding or renaming one needs a rebuild;
- they have **no intrinsic size** and render at 0×0 without an explicit width and height;
- only the **size and the overall tint** can be changed at runtime;
- they are **Android only**.

## Decision

- The 21 Material Symbols SVGs are converted to **Android XML vector drawables**, one file per icon,
  under **`src/assets/category-icons/`**, each named by its **category icon key in snake_case** —
  `mathematics.xml`, `botany.xml`, `gastronomy.xml`, `computer_science.xml` and so on. The file
  name is the key, not the Material Symbols name.
- Every path is filled **white**, and the drawable carries **no `android:tint` theme attribute**
  (Google's own Android exports add `?attr/colorControlNormal`). `Image`'s `tintColor` then
  recolours the whole icon to the category's colour.
- Icons are rendered with **`Image` and `source={require('…/<key>.xml')}`**, always with an
  explicit `width` and `height`.
- **The `require` map lives in one component** in [`src/components/`](../../../src/components/),
  never in `src/utils/`, `src/storage/` or `src/types.ts`. **The list of icon keys is plain
  TypeScript** in `src/utils/` (or `src/types.ts`), so the loader and the name rule can validate an
  icon key without importing a `.xml` file. The map is typed against that list, so a key with no
  drawable fails `npm run typecheck`.
- **This is a limited exception to the "every icon is drawn from nested `View`s" rule, for category
  icons only.** Every other icon in the app stays as it is, and a new non-category icon is still
  drawn from `View`s.
- **The licence is recorded here**: the icons are Material Symbols by Google, Apache License 2.0.
  Converting them to vector drawables does not change their licence.

## Alternatives Considered

- **`react-native-svg`.** Renders the SVGs as they are, on both platforms, and allows per-path
  colour. Rejected: it is a new native dependency, which this repo adds only when nothing else
  works, and nothing here needs more than one tint.
- **PNG exports.** Works on every platform with no conversion step. Rejected: 21 icons at five
  densities is about 105 files, each icon blurs at sizes it was not exported for, and a tinted PNG
  needs a white source anyway.
- **Draw them from nested `View`s.** Consistent with every other icon. Rejected: the shapes are
  pictograms with curves, not geometry; the result would be poor and very long.
- **An icon font.** One asset, tintable by text colour. Rejected: it needs a font build and native
  linking step, and `AGENTS.md` rules an icon font out.

## Consequences

### Positive

- No new dependency and no native module.
- Vector at any density from one file per icon, which keeps the APK small.
- One tint per category colour at runtime, with no per-colour asset.
- Drawables are inflated off the main thread, so a list of category icons does not drop frames.

### Negative

- **Android only.** On iOS a category icon renders nothing. The iOS
  project is not built today, so this costs nothing now, but an iOS build would need another
  source for these icons.
- **Adding or renaming an icon needs a native rebuild.** A change to `src/assets/category-icons/`
  is not picked up by Metro's reload.
- **The `require` map cannot be imported by anything Jest runs.** `@react-native/jest-preset`
  transforms images such as `.png` and `.svg` but not `.xml`, so a test that reached the map would
  fail to load it. This is why the map is confined to one component and the key list is separate.
- **Rendering under a debug build with Metro is unverified.** The drawables are compiled into the
  APK at build time; whether a debug APK served by Metro shows them has not been checked. A release
  build is the reference until it has.
- **The app now has two icon mechanisms.** "Where does this icon come from?" has two answers, and
  the rule in `AGENTS.md` needs its exception stated where the rule is.
- **One colour per icon.** A drawable can only be tinted as a whole; a two-tone category icon would
  need a second drawable.
- **Apache-2.0 asks that a copy of the licence accompany redistribution.** The repository carries
  the attribution and the licence notice in `src/assets/category-icons/NOTICE`; the APK carries
  neither, and the app shows no attribution (Amendment 1).

## Amendment 1 — 2026-10-30

Recorded when the work landed, for the two places where it differs from the decision above. The
decision itself stands.

**The icon is tinted for contrast, not with the category's colour.** The mechanism is as decided —
one white drawable, recoloured as a whole by `Image`'s `tintColor` — but the category's colour
fills the **Category tile**'s square instead, and the icon on it is tinted `colors.background`. The
Icon picker tints its icons with neutral text colours. Nothing tints an icon with a category's
colour today. That keeps the icon legible on every palette colour, and it means a change of
palette is a change of tile background, not of icon.

**What the licence consequence now is, precisely.** `src/assets/category-icons/NOTICE` is in the
repository beside the drawables. It names the icons as Material Symbols by Google, converted to
Android vector drawables, states `Copyright Google LLC`, and carries the standard Apache-2.0 notice,
which points to the licence by URL; it is **not** the full licence text. It has no file extension
and nothing `require`s it, so Metro does not bundle it and it is **not in the APK** — checked by
listing a release APK built from this change, which contains other libraries' `LICENSE.txt` and
`NOTICE` files but not this one. The app shows no licence or attribution screen. So the repository
attributes the icons, and a user who installs the APK receives no copy of the licence or of the
notice. Closing that gap — an in-app notice, or packaging the licence text — is not done and is
recorded in [ARCHITECTURE.md §8](../ARCHITECTURE.md).

The consequence on debug builds is unchanged: the icons have been seen rendering in a release build
on a device, and a debug build served by Metro is still unchecked.

## Amendment 2 — 2026-10-31

Recorded ahead of the work it governs. The owner asked for more icons to choose from when creating
a custom category, and supplied 85 more drawables. The decision above stands — same mechanism, same
folder, one `require` map — and four details move.

**The icon set is no longer the defaults' icons.** It is the 21 icons the default categories use
**plus the extra icons**, which belong to no default category. A custom category chooses from the
whole set ([ADR-0012](0012-custom-categories-third-storage-key.md) Amendment 2). The default
categories, their ids, icons, colours and order do not change.

**The conversion rules apply unchanged; for the extras they reduce to two steps.** The supplied
files are already Android vector drawables in the shape of Google's Android download — a 24dp
`<vector>` on a 960×960 viewport, one `<path>`, no group, transform or stroke, filled
`@android:color/white` — and each carries `android:tint="?attr/colorControlNormal"`. So each extra
icon is added by **stripping that `android:tint` attribute** and **renaming the file to its key**,
and nothing else: the path data is copied as it is, so the glyph stays exactly what was supplied.

**An extra icon's key is its Material Symbols name with `_24px` removed** — `rocket_launch_24px.xml`
becomes `rocket_launch.xml`, key `rocket_launch`. The 21 are named after their category because
each belongs to one; an extra icon belongs to none, so it keeps the name of what it depicts. A key
is lower-case snake_case, starts with a letter, and never equals another key: when this was
recorded, no extra name, once `_24px` was removed, equalled one of the 21, and no two files shared
path data.

**Every icon key, once shipped, is permanent.** A custom category stores its icon's key, so
renaming or removing a key is not a cosmetic change: the loader reads every custom category that
used it as the fallback icon, and the next save writes that back
([ADR-0012](0012-custom-categories-third-storage-key.md), *Defensive read*). This was already true
of the 21; it now covers every key, and it is why an extra icon keeps its supplied name rather than
a friendlier one — the friendly name is a label, kept in code, and can change freely.

Still as decided: the key lists are plain TypeScript in
[`src/utils/categories.ts`](../../../src/utils/categories.ts), with the union in
[`src/types.ts`](../../../src/types.ts); the one `require` map stays in
[`src/components/CategoryIcon.tsx`](../../../src/components/CategoryIcon.tsx), typed as a `Record`
over the full union, so an extra key with no drawable entry fails `npm run typecheck`. Typecheck
does not see the `require` path itself, so a path naming a missing file fails only when Metro
bundles, which the release build does.

**What is known about the licence of the extra icons.** Their names are Material Symbols names —
several exist only there, such as `nest_heat_link_e` and `language_chinese_dayi` — and their file
names, viewport and theme tint are exactly the format of Google's Material Symbols Android download.
The owner has not stated their source, and the files carry no licence text. On that evidence they
are treated as **Material Symbols by Google, Apache License 2.0**, and the existing
`src/assets/category-icons/NOTICE`, which says the icons in that directory are Material Symbols,
covers them **unchanged**. Any icon later found not to be a Material Symbol must not sit in that
directory under that notice. The gap Amendment 1 records — the APK carries neither the licence nor
the notice — is unchanged, and now covers more icons.

Consequences of this amendment:

- **More rebuilds, slightly larger APK.** Every extra drawable is compiled by AAPT, so adding one
  needs a native rebuild, as before. Each is a single small path, so the size added is small, but
  it is not zero and it ships whether or not anyone picks the icon.
- **A downgrade loses an extra icon choice.** A build that has categories but predates this
  amendment does not know an extra key; its loader reads such a category as the fallback icon and
  its next save keeps that. ADR-0012 Amendment 2 states it precisely.
- **The Icon picker grows.** The layout, the order and the accessibility labels are UI decisions
  and are not made here.

## References

- [ADR-0001](0001-own-the-html-renderer.md) — the precedent for owning a rendering path rather than
  adding a library
- [ADR-0012](0012-custom-categories-third-storage-key.md) — the categories these icons belong to;
  its Amendment 2 lets a custom category choose from the full icon set (Amendment 2 here)
- [React Native 0.78 release notes — Android XML drawables](https://reactnative.dev/blog/2025/02/19/react-native-0.78)
- [Material Symbols](https://fonts.google.com/icons) — source of the icons, Apache License 2.0
- [`src/assets/category-icons/`](../../../src/assets/category-icons/) — the drawables and their
  `NOTICE`
- [`src/components/CategoryIcon.tsx`](../../../src/components/CategoryIcon.tsx) — the one
  `require` map; [`src/utils/categories.ts`](../../../src/utils/categories.ts) — the icon keys
  (`CATEGORY_ICONS`), with the `CategoryIcon` type in [`src/types.ts`](../../../src/types.ts)
- [ARCHITECTURE.md §3, §7, §8](../ARCHITECTURE.md)
- [`src/components/MenuIcons.tsx`](../../../src/components/MenuIcons.tsx),
  [`src/components/AnswerIcons.tsx`](../../../src/components/AnswerIcons.tsx),
  [`src/navigation/TabIcons.tsx`](../../../src/navigation/TabIcons.tsx) — the `View`-drawn icons
  this record makes an exception to
- [AGENTS.md](../../../AGENTS.md) — *Tech stack*, *What to ask before doing*
