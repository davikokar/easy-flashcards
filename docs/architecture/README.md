# Architecture

This directory holds the architectural documentation for Easy Flashcards.

[ARCHITECTURE.md](ARCHITECTURE.md) describes the current system: the tabs and their screens,
the one-way data flow through the single store, the layer responsibilities, persistence, and the
HTML rendering path. Read it before changing how state is owned, how a screen gets its data, or
how anything is persisted. It is maintained by the Planner and updated in the same change as the
work it describes; the trigger list is in
[the architecture documentation instructions](../../.github/instructions/architecture-docs.instructions.md).

The original brief the app was built from is
[../requirements/flashcards_app_requirements.md](../requirements/flashcards_app_requirements.md).
It is **frozen history**, not a description of the app, and it is not maintained. Where it and the
code disagree, the code wins.

In-progress epics, when there are any, are specified under `../design/`. Those documents describe
work that may not exist yet; ARCHITECTURE.md describes only what has actually shipped.

## Architecture Decision Records

Architecture Decision Records (ADRs) live in [decisions/](decisions/) and capture choices with
lasting impact on system structure, dependencies, data ownership, deployment, security,
performance, platform support, or cross-feature conventions.

Records are never deleted or renumbered. When a decision stops governing the project, a new ADR is
created and the old one is marked `Disabled` with a link between the two.

See [the architecture documentation instructions](../../.github/instructions/architecture-docs.instructions.md)
for the required format and status rules.

> ADR-0001 to ADR-0006 were recorded **retrospectively**. Each documents a choice already visible
> in the code and already load-bearing, written down so it stops being rediscovered. Their dates
> are the dates they were recorded, not the dates the choices were made. ADR-0007 is the first
> recorded **ahead** of the work it governs; ADR-0004 and ADR-0005 carry amendments for it.
> ADR-0008 was also recorded ahead of its work; ADR-0002 carries an amendment for it, and
> ARCHITECTURE.md links to it now that the work has landed. ADR-0009 was recorded ahead of its
> work, together with amendments to ADR-0002, ADR-0005, ADR-0007 and ADR-0008, and
> ARCHITECTURE.md links to it now that the work has landed. ADR-0010 was recorded ahead of its
> work, together with Amendment 3 to ADR-0002, and ARCHITECTURE.md links to it now that the work
> has landed. ADR-0011 was recorded ahead of its work, together with Amendment 5 to ADR-0002, and
> ARCHITECTURE.md links to it now that the work has landed. ADR-0012 and ADR-0013 were recorded
> ahead of their work, together with Amendment 2 to ADR-0003 and Amendment 3 to ADR-0004, and
> ARCHITECTURE.md links to them now that the work has landed; ADR-0013 carries an amendment
> recording what landed differently. ADR-0014 was recorded ahead of its work, together with
> Amendment 6 to ADR-0002, Amendment 1 to ADR-0011 and Amendment 1 to ADR-0012, and
> ARCHITECTURE.md links to it now that the work has landed; ADR-0003 gained Amendment 3 when it
> did, and ADR-0014 carries Amendment 1 for the category in the options-menu titles and a corrected
> iOS consequence. ADR-0012 and ADR-0013 each carry an Amendment 2, recorded ahead of the work that
> adds the extra category icons; ARCHITECTURE.md links to them now that the work has landed.
> ADR-0014 carries an Amendment 2, recorded ahead of the Statistics screen redesign that shows a
> deck's Category square on its Deck stats card; ARCHITECTURE.md links to it now that the work
> has landed. ADR-0015 was recorded ahead of its work, together with Amendment 7 to ADR-0002,
> Amendment 4 to ADR-0004, Amendment 4 to ADR-0005 and Amendment 2 to ADR-0008; ARCHITECTURE.md
> links to it now that the work has landed, and ADR-0015 carries Amendment 1 for a corner of its
> loader rule found when it did. ADR-0012 carries an Amendment 3, recorded ahead of the work that
> adds the Custom colour swatch to the Colour picker, so a custom category can have any colour that
> meets the palette's contrast bar, under the same key and shape; ARCHITECTURE.md links to it now
> that the work has landed. ADR-0016 was recorded ahead of its work, together with Amendment 2 to
> ADR-0011 and Amendment 3 to ADR-0014; it changes nothing persisted, and ARCHITECTURE.md links to
> it now that the work has landed. ADR-0017 was recorded ahead of its work, together with
> Amendment 4 to ADR-0003, Amendment 3 to ADR-0011, Amendment 4 to ADR-0014 and Amendment 2 to
> ADR-0016; it changes nothing persisted, and ARCHITECTURE.md links to it now that the work has
> landed. ADR-0016 carries an Amendment 3, recorded ahead of the work that makes Export sample
> deck save the sample in both export formats, as two files; it changes nothing persisted, and
> ARCHITECTURE.md links to it now that the work has landed. ADR-0010 carries an Amendment 1,
> recorded ahead of the work that makes the Start session button start a shuffled session, together
> with Amendment 8 to ADR-0002; it changes nothing persisted, and ARCHITECTURE.md links to it now
> that the work has landed. ADR-0011 carries an Amendment 4, recorded ahead of the work that makes
> **Add deck manually** open the Edit deck form blank as the New deck screen and commit it through
> `addDeck`, together with Amendment 5 to ADR-0003 and Amendment 5 to ADR-0014; it changes no
> storage key and nothing persisted, and ARCHITECTURE.md links to it now that the work has landed.
> ADR-0014 carries an Amendment 6 and ADR-0015 an Amendment 2, both recorded ahead of the Deck
> statistics screen redesign: the deck's Category square and name in an identity row, and — with
> the screen still all time — a session history, each card's last-reviewed date and a change since
> the last session, derived from the answer log rather than the counters. They change no storage
> key and nothing persisted, and ARCHITECTURE.md links to them now that the work has landed.
> ADR-0018 was recorded ahead of its work, together with Amendment 3 to ADR-0015 and Amendment 3
> to ADR-0013: it adds `react-native-svg`, approved by the owner, to draw data charts, starting
> with the Deck statistics screen's Session history as a stacked area chart; icons and card HTML
> are not drawn with it. It changes no storage key and nothing persisted, and ARCHITECTURE.md
> links to it and to both amendments now that the work has landed. ADR-0014 carries an
> Amendment 7, recorded **after** the work it describes: the Header toolbar's placeholder Filter
> button was removed rather than kept, and filtering by category stays undecided. It changes
> nothing persisted, and ARCHITECTURE.md links to it. ADR-0017 carries an Amendment 1, recorded
> ahead of the work that removes the Import format menu: **Import deck from file** opens the
> picker directly and the importer chooses CSV or JSON from the file's content, reversing, with
> the owner's approval, ADR-0017's rule that the format is never sniffed. It changes nothing
> persisted, and ARCHITECTURE.md links to it now that the work has landed. ADR-0019 was recorded
> ahead of its work, together with Amendment 6 to ADR-0003, Amendment 8 to ADR-0014, Amendment 4
> to ADR-0016 and Amendment 2 to ADR-0017: deck files move to format version 2, the CSV gains
> `format` and `version` comment lines, both files name a category by one language-neutral
> reference — a built-in id or a custom name — and both importers resolve it. It changes nothing
> persisted, and ARCHITECTURE.md links to it now that the work has landed. ADR-0019 carries an
> Amendment 1, recorded after the work it describes, together with Amendment 7 to ADR-0003,
> Amendment 5 to ADR-0011, Amendment 5 to ADR-0016 and Amendment 3 to ADR-0017: a CSV import now
> reads its `# title:` and `# description:` lines, so the deck is named after the file's title in
> either format and keeps its description. It changes nothing persisted, and ARCHITECTURE.md links
> to it.

### Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [ADR-0001](decisions/0001-own-the-html-renderer.md) | The HTML renderer is owned in-repo | Active | 2026-10-26 |
| [ADR-0002](decisions/0002-sessions-are-snapshots.md) | A session is a snapshot, stored apart from its deck | Active | 2026-10-26 |
| [ADR-0003](decisions/0003-single-context-reducer-store.md) | One React Context reducer is the whole store | Active | 2026-10-26 |
| [ADR-0004](decisions/0004-versioned-defensive-storage.md) | Versioned storage keys, normalised defensively on read | Active | 2026-10-26 |
| [ADR-0005](decisions/0005-answers-recorded-immediately.md) | An answer is recorded when it is given | Active | 2026-10-26 |
| [ADR-0006](decisions/0006-launch-on-the-tab-with-unfinished-work.md) | The app launches on the tab with unfinished work | Active | 2026-10-26 |
| [ADR-0007](decisions/0007-okeish-third-answer.md) | A third answer, Okeish, stored under the existing v1 keys | Active | 2026-10-26 |
| [ADR-0008](decisions/0008-clear-completed-sessions.md) | Clearing a completed session archives it under the existing v1 key | Active | 2026-10-27 |
| [ADR-0009](decisions/0009-error-review-marks-cards-fixed.md) | Reviewing a session's errors marks cards fixed and changes no statistic | Active | 2026-10-30 |
| [ADR-0010](decisions/0010-inverted-sessions.md) | A session's direction is chosen at creation and stored on the session | Active | 2026-10-30 |
| [ADR-0011](decisions/0011-deck-editing-is-one-action.md) | A deck is edited by one action, and a deck gains a description under the existing v1 key | Active | 2026-10-30 |
| [ADR-0012](decisions/0012-custom-categories-third-storage-key.md) | Custom categories live under a third storage key | Active | 2026-10-30 |
| [ADR-0013](decisions/0013-category-icons-are-android-vector-drawables.md) | Category icons are Android vector drawables rendered with Image | Active | 2026-10-30 |
| [ADR-0014](decisions/0014-deck-belongs-to-one-category.md) | A deck belongs to at most one category, stored on the deck under the existing v1 key | Active | 2026-10-30 |
| [ADR-0015](decisions/0015-answers-carry-a-timestamp-under-v2-keys.md) | Each answer records when it was given, and statistics by timeframe are derived from session results under new v2 keys | Active | 2026-11-03 |
| [ADR-0016](decisions/0016-deck-export-file-formats.md) | A deck is exported to a JSON or CSV file in formats the app defines, carrying no progress data | Active | 2026-11-03 |
| [ADR-0017](decisions/0017-deck-import-reads-exported-formats.md) | Deck import reads the formats the app exports — CSV with any supported separator and leading comments, and the versioned JSON file | Active | 2026-11-04 |
| [ADR-0018](decisions/0018-react-native-svg-draws-charts.md) | react-native-svg draws charts | Active | 2026-11-04 |
| [ADR-0019](decisions/0019-deck-file-format-version-2.md) | Deck files move to format version 2 — CSV and JSON carry the same metadata, and the category as one language-neutral reference | Active | 2026-11-05 |
