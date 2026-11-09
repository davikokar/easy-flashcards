# ADR-0022: Community decks are shared through a public GitHub repository and a Cloudflare Worker, with no accounts

- Status: Active
- Date: 2026-11-09
- Decision makers: Owner (approved the network calls, the identity key, the new deck field and the
  UUID dependencies), Planner

## Context

The owner asked for decks to be shared between users without accounts: a user publishes or updates
a deck from the Deck options menu and downloads other users' decks from the Add deck menu. Storage
is a public GitHub repository (`davikokar/community-decks`, one JSON file per deck under `decks/`)
and writes go through a Cloudflare Worker that holds the GitHub token, so no secret is shipped in
the app.

This collides with standing rules:

1. The app has had no network calls ([AGENTS.md](../../../AGENTS.md)). These are the first.
2. Ownership needs an identity that survives restarts, which is persisted state
   ([ADR-0004](0004-versioned-defensive-storage.md)), and `Deck` needs a field linking it to its
   published copy.
3. Hermes has no `crypto.randomUUID`, so a secure UUID needs a native random source.
4. Anything stored in a public repository is public.

## Decision

**1. The Worker is the only writer.** The app POSTs one JSON object to the Worker. The Worker
validates it, reads the deck's current file through the GitHub contents API, and creates or
updates `decks/<deck_id>.json`. Its source is in [worker/](../../../worker/); it reads
`GITHUB_TOKEN` and `GITHUB_REPO` (and optionally `GITHUB_BRANCH`) from its secrets. The app reads
the repository directly and anonymously: the contents API for the file list, then each file's
`download_url`.

**2. Ownership is a secret the file does not reveal.** The app generates `author_uuid` once, a
version 4 UUID, and sends it in the POST body. Because the repository is public, the Worker never
writes it: it stores `author_hash`, the SHA-256 of `author_uuid` in lower-case hex, and an update
is accepted only when the hash of the incoming `author_uuid` equals the stored `author_hash`; else
the Worker answers `403`. Storing the UUID itself would let anyone read it from GitHub and
overwrite any deck. `src/utils/sha256.ts` is pure TypeScript because Hermes has no
`crypto.subtle`; the Worker imports the same file, so both sides hash identically.

**3. One shared module defines the wire format.** `src/utils/communityDeck.ts` holds the payload,
the stored file shape, validation, the ownership check and the conversion to an import. It is pure,
tested under Jest, and imported by the Worker as well, so validation cannot drift between the two.
A published file is `{ deck_id, author_hash, title, description, category, cards: [{ question,
answer }] }`. `category` is a built-in category's id or a custom category's name, as in
[ADR-0019](0019-deck-file-format-version-2.md); card text is sent as the app holds it, HTML
included.

**4. A fifth storage key, `@easy-flashcards/identity/v1`**, owned by
`src/storage/identityStorage.ts`, holds `{ "authorUuid": string }`. It is created the first time
the user shares a deck, through a memoised promise so two taps cannot mint two identities. It is
not in `DecksContext` and not in `I18nProvider`: it is read by a service at the moment of sharing,
and no screen shows it. A missing or malformed value is replaced by a new identity; the old one is
unrecoverable, which only costs the right to update decks published under it.

**5. `Deck.communityId` links a deck to its published copy.** It is an optional string: the
`deck_id` of the file. It is absent on a deck never shared. It is written by one reducer action,
`setDeckCommunityId`, dispatched **before** the POST, so a request that times out and is retried
updates the same file instead of creating a second. `decksStorage` reads it defensively and the
key stays `@easy-flashcards/decks/v2`: a missing field is the true value for every older record
([ADR-0004](0004-versioned-defensive-storage.md) Amendment 1). `updateDeck` keeps it, so editing a
shared deck and sharing it again updates it.

**6. Importing from the community adds a copy.** A downloaded deck goes through `addDeck` like any
import, so a deck already in the library is never replaced. The copy keeps `communityId` only when
the file's `author_hash` equals the hash of this device's `author_uuid`, i.e. the user's own deck
downloaded again; for anyone else's deck it is absent, so it cannot be pushed back. The category
reference is resolved by the reducer, and no category is created from a file.

**7. Listing.** The list screen asks the contents API for `decks/`, then fetches up to a fixed
number of files with bounded concurrency, and drops any file that does not parse. Nothing is
cached; the screen asks again on open and on **Try again**. Sharing asks for confirmation first,
because it publishes the deck's text to a public repository.

**8. Dependencies.** `react-native-get-random-values` (native; a rebuild is needed) and `uuid`.
Only `src/services/identity.ts` imports them, so Jest never loads them. `INTERNET` is already in
the manifest; no permission is added.

## Alternatives Considered

- **Write the author's UUID into the public file, as first specified.** Rejected: the identifier
  would be public, so the ownership check would stop nobody.
- **Sign payloads with a key pair.** Stronger, but needs a native crypto dependency and a
  verification step in the Worker; the hash gives the same property for this threat model
  (nobody can update a deck without the UUID the app never publishes).
- **The Worker keeps an index file.** Would make listing one request, but every publish becomes
  two commits that can conflict. Deferred; the list is fetched per file for now.
- **Reuse the local deck id as `deck_id`.** Local ids are not UUIDs and a downloaded copy has a
  different local id than its published one, so a separate field is needed anyway.
- **Replace a local deck that shares a `deck_id`.** Rejected by the owner: a download is a copy.
- **`Math.random` UUIDs, no dependency.** Rejected by the owner: `author_uuid` is the only
  ownership secret, so it needs a secure random source.

## Consequences

### Positive

- No account, no secret in the app, and an update needs the UUID that only the author's device holds.
- The wire format and the ownership rule are one tested module used by both sides.
- Reading is anonymous and cannot be broken by Worker downtime.

### Negative

- **Losing the identity (clearing app data, a new phone) loses the right to update every deck
  shared from it.** There is no backup or recovery.
- The ownership secret lives in AsyncStorage, unencrypted, like everything else.
- Listing costs one request per published deck and the contents API caps unauthenticated calls per
  IP. It will not scale to a large catalogue; an index file is the next step.
- A published deck cannot be deleted from the app; removal is done in the repository.
- The Worker has no rate limit or abuse filtering beyond size and shape checks; anyone can publish
  any text.
- A deck's text is public and permanent in Git history once shared.

## References

- [ADR-0003](0003-single-context-reducer-store.md), [ADR-0004](0004-versioned-defensive-storage.md),
  [ADR-0017](0017-deck-import-reads-exported-formats.md),
  [ADR-0019](0019-deck-file-format-version-2.md), [ADR-0020](0020-ui-text-translated-through-typed-catalogue.md)
- Source: `src/utils/communityDeck.ts`, `src/utils/sha256.ts`, `src/storage/identityStorage.ts`,
  `src/services/communityDecks.ts`, `src/services/identity.ts`, `src/screens/CommunityDecksScreen.tsx`,
  `worker/src/index.ts`
