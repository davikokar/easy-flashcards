# ADR-0004: Versioned storage keys, normalised defensively on read

- Status: Active
- Date: 2026-10-26
- Decision makers: Project owner
- Recorded retrospectively: the choice was made when persistence was added.

## Context

Everything the app owns is on the device, in AsyncStorage, and there is no copy anywhere else. A
user's decks are the result of work they did — importing files, and then answering every card in
them, repeatedly. Losing that is the worst thing this app can do, and there is no way back from it.

AsyncStorage has no schema. It stores a string, and what comes back is whatever was written,
possibly by an older version of the app, possibly truncated, possibly written by a build that
crashed halfway through a feature. `JSON.parse` on it succeeds or throws, and the object it returns
is `any` — TypeScript guarantees nothing about data that crossed a storage boundary.

So the shape read back can be wrong in two different ways, and they need different answers:

1. **Wrong in detail** — a missing timestamp, a card with no answer, a `results` array longer than
   its `cardIds`. Recoverable.
2. **Wrong in kind** — the app now expects a shape the stored data was never written in.
   Not recoverable by guessing.

## Decision

Two mechanisms, one per failure mode.

**Normalise defensively on read, and never throw.** Each loader in
[`src/storage/`](../../../src/storage/) validates what it got and repairs or discards per item:

- a card missing `id`, `question` or `answer` is dropped;
- a deck missing `id`, `name` or a `cards` array is dropped;
- a missing or non-numeric timestamp defaults to `Date.now()`;
- `results` is clamped to `cardIds.length`;
- an `answer` that is not `'ok'` or `'notOk'` is coerced.

A parse failure of the whole key resolves to an empty array rather than rejecting. One bad record
costs that record, not the app.

**Version the key.** Both keys carry a `/v1` suffix — `@easy-flashcards/decks/v1`,
`@easy-flashcards/sessions/v1`. A shape change the normaliser cannot absorb takes a **new key**,
reads the old one once, converts, and writes the new. Nothing rewrites what `/v1` means.

Each key is owned by exactly one module, which owns reading, writing and normalising it. Nothing
else calls AsyncStorage.

## Alternatives Considered

- **Trust the stored shape and cast.** What `JSON.parse` invites. Rejected: a single malformed
  record makes the app unable to start, and the user has no way to fix it short of clearing app
  data, which destroys everything.
- **Validate strictly and throw, showing an error screen.** Honest, and tells the user something is
  wrong. Rejected because the realistic cause is one bad row out of hundreds, and refusing to start
  over it is a worse outcome than losing the row.
- **A schema validation library (`zod`, `io-ts`).** Would make the shapes declarative and the
  normalisers shorter. Rejected as a dependency for two object shapes, and because the interesting
  behaviour here is *repair*, which a validator expresses less directly than the hand-written code
  does.
- **A `schemaVersion` field inside the stored document rather than in the key.** Equivalent in
  power and arguably tidier. Rejected because reading the version requires parsing the document,
  which is the step that can fail; a versioned key is readable without trusting the contents.
- **Migrations on write rather than on read.** Rejected because the app may be launched after
  several versions were skipped, and a read-time path handles that without a chain.

## Consequences

### Positive

- The app starts. A corrupt or outdated record costs that record and nothing else.
- Every assumption about stored data is in one file per key, where it can be read and changed
  together.
- A future incompatible change has a defined route that cannot destroy the old data, because the
  old key is still there until the conversion succeeds.
- The normalisers are pure functions over parsed JSON, so they are testable without a device.

### Negative

- **Data loss is silent.** A dropped card is not reported to the user or logged anywhere. The only
  evidence is a deck that is shorter than it was.
- The normalisers duplicate the type definitions in [`src/types.ts`](../../../src/types.ts), and
  nothing checks that the two agree. Adding a field to a type without adding it to the normaliser
  compiles.
- **They are untested.** They are the code that runs against data the app did not write, and there
  is no test for them — recorded in [ARCHITECTURE.md §8](../ARCHITECTURE.md).
- A write failure is caught and discarded so it cannot interrupt a session, which means the user is
  told nothing and finds out at the next launch.

## Amendment 1 — 2026-10-26

[ADR-0007](0007-okeish-third-answer.md) adds a third answer, `'okeish'`, and is the first shape
change since this record. The decision above still stands; two details of it moved.

**An additive field stays under `/v1`.** The boundary between *wrong in detail* and *wrong in kind*
is now stated rather than implied: a new field whose default is the **true** value for every
record written before it — not merely a plausible one — is absorbed by the normaliser under the
existing key, with no new key and no conversion. Card `okeishCount` qualifies, because no record
written before ADR-0007 can contain an Okeish answer, so a missing count is exactly zero. A field
whose missing value would have to be guessed still takes a new key.

**The normaliser rules change accordingly:**

- a missing or non-numeric `okeishCount` on a card is read as `0`;
- an `answer` of `'okeish'` is preserved; any value that is not `'ok'`, `'okeish'` or `'notOk'` is
  still coerced to `'ok'`.

**A consequence this record did not consider: downgrades.** Everything above assumes a newer app
reading data an older app wrote. ADR-0007 creates the opposite case — an older APK reading `/v1`
data that a newer one wrote — and the result is silent, permanent loss: the older decks loader
drops `okeishCount`, the older sessions loader turns every `'okeish'` into `'ok'`, and the first
save the older app makes writes that back. Versioning the key does not prevent this; it only
changes what is lost. The owner accepted it for ADR-0007, and nothing blocks a downgrade today,
because `versionCode` has never been bumped. The details are in ADR-0007's *Consequences*.

## Amendment 2 — 2026-10-30

The decision above is unchanged. Three details moved:

- **A parse failure of the whole key now really resolves to `[]`.** The decision said so, but both
  loaders called `JSON.parse` unguarded, so a corrupt key rejected the whole load. Both now read
  through `parseStoredArray` in [`src/utils/storedArray.ts`](../../../src/utils/storedArray.ts).
- **A failed load blocks every save for that run.** If the load rejects anyway — AsyncStorage itself
  failing — the store starts empty with `error` set, and the save effect in `DecksProvider` writes
  nothing while `error` is set. Before this, the first change after a failed load wrote the empty
  state over both keys, which is the data loss this record exists to prevent. The cost: anything
  done in that run is not saved (ARCHITECTURE.md §8).
- **The normalisers are tested.** `__tests__/decksStorage.test.ts` and
  `__tests__/sessionsStorage.test.ts` mock AsyncStorage and drive both loaders, so the *Negative*
  consequence "they are untested" no longer holds. The unused `clearDecks` and `clearSessions` were
  removed; each module now owns `load*`, `save*` and its normalisation.

## References

- [`src/storage/decksStorage.ts`](../../../src/storage/decksStorage.ts),
  [`src/storage/sessionsStorage.ts`](../../../src/storage/sessionsStorage.ts)
- [`src/utils/storedArray.ts`](../../../src/utils/storedArray.ts)
- [`src/types.ts`](../../../src/types.ts)
- [ADR-0003](0003-single-context-reducer-store.md) — the store that drives these writes
- [ADR-0007](0007-okeish-third-answer.md) — the first shape change under `/v1` (Amendment 1)
- [ARCHITECTURE.md §5](../ARCHITECTURE.md)
- [AGENTS.md](../../../AGENTS.md) — *Storage keys*, and *What to ask before doing*
