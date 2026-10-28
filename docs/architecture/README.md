# Architecture

This directory holds the architectural documentation for Easy Flashcards.

[ARCHITECTURE.md](ARCHITECTURE.md) describes the current system: the three tabs and five screens,
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
> ARCHITECTURE.md links to it now that the work has landed.

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
