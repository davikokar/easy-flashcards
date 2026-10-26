---
mode: agent
description: Audit the project's documentation for drift, contradictions, and claims that are no longer true.
---

# Documentation audit

Check every maintained document in this repository against the code, the build files, and each
other. Report findings; do not fix anything until the user says so.

The documentation map in [AGENTS.md](../../AGENTS.md) lists every document, its owner, and its
maintenance mode. That is the scope.

Two documents are **out of scope by rule**:
`docs/requirements/flashcards_app_requirements.md` is frozen history and is allowed to disagree
with the code, and `.artifacts/`-style run output, if any ever exists, is history rather than
documentation. Everything else in `docs/` and `.github/` is in scope, including the agent
definitions.

## Why this exists

Ownership and update triggers only catch the drift somebody anticipated. Everything else
accumulates silently until a document that agents are *required* to read is quietly wrong. This
audit is for the rest.

## What to check

### 1. Claims that duplicate a fact owned elsewhere

The most common failure of this kind of documentation, by a wide margin. Every one of these is a
future lie because nothing checks it:

- Counts of anything — screens, ADRs, tabs, tests, components, storage keys.
- Line counts and file sizes.
- Dependency and version lists that restate `package.json`.
- SDK levels and build settings that restate `android/build.gradle`,
  `android/app/build.gradle`, or `android/gradle.properties`.

For each: is it still true, and should it exist at all? Prefer deleting the claim and linking to
its source over correcting the number.

Counts that are **structural** — "three tabs", "five screens", "two storage keys" — are deliberate
and are allowed to exist, because they are the shape of the app rather than an incidental total.
Check them; do not recommend deleting them.

### 2. Statements contradicted by the code

Verify, do not assume. Particular things worth checking:

- Does `AGENTS.md`'s tech stack match `package.json`'s actual dependencies — both directions, a
  dependency present but undocumented as well as one documented but removed?
- Does `ARCHITECTURE.md` §3's file list match what is actually in `src/utils/`, `src/storage/`,
  `src/services/` and `src/components/`?
- Does the navigator tree in §4 match `src/navigation/RootNavigator.tsx` route for route, and the
  param lists in `src/navigation/types.ts`?
- Does §2's list of store actions match the reducer's `switch`, and the exposed API match
  `DecksContextValue`?
- Does the storage-key table match the keys in `src/storage/`?
- Does every screen, component, control and label named in the UI vocabulary still exist under
  that name and with that string? The vocabulary quotes real labels; a renamed button makes it
  wrong.
- Do the test conventions match what `__tests__/` actually does, and what `jest.config.js`
  configures? In particular: is the claim that there are **no component tests** still true?
- Does `README.md` describe the app that exists? It is known to describe two tabs; check whether
  that was fixed and whether anything else drifted with it.

### 3. Documents contradicting each other

Precedence is: an **active ADR** beats `ARCHITECTURE.md`, which beats a design document, which
beats prose in `AGENTS.md`, which beats `README.md`. Report any disagreement and say which one is
wrong under that rule.

Check the agent definitions in `.github/agents/` against `AGENTS.md` specifically. Each one
restates project context, the definition of done, and required reading, and a stale fact there is
injected before the agent reads anything else — so it is believed rather than discovered. This is
the highest-value check in the audit.

### 4. Dead and missing links

Every relative markdown link resolves. Every `applyTo` glob actually matches the files its
instructions are about — and does not match files they would mislead.

### 5. Epic progress honesty

For each design document under `docs/design/`, if any exist: does its progress table match
reality? Is any stage marked Complete whose exit criteria are not all met? That is a hard
violation, not a nit.

### 6. Orphaned documents

Anything in `docs/` or `.github/` not listed in the documentation map, and anything in the map that
no longer exists.

### 7. Known debt that is no longer true

`ARCHITECTURE.md` §8 and `AGENTS.md`'s *Known gaps* both list things that are wrong with the app.
A debt entry that has been fixed and not struck is as misleading as a false claim, and more likely
to stop someone doing useful work. Check each one against the code.

## How to report

Group by document. For each finding give the file and line, what is wrong, the evidence that it is
wrong — quote the code or the build file — and a recommendation: **delete the claim**, **correct
it**, or **route it to its owner**.

End with a count per document and the single worst finding overall.

Separate hard problems from nits. A document that is merely terse is not a finding. A document
that states something false is.

If a document is clean, say so plainly. Do not invent findings to look thorough.
