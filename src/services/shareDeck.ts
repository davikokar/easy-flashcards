import type { Category, Deck } from '../types';
import { categoryReference } from '../utils/categories';
import { buildCommunityPayload } from '../utils/communityDeck';
import { CommunityError, publishCommunityDeck } from './communityDecks';
import { getOrCreateAuthorUuid, newCommunityDeckId } from './identity';

/**
 * Publishes a deck, or updates its published copy. `linkDeck` is called with the deck's community id
 * before the request, so a retry after a timeout updates the same file instead of creating another.
 */
export async function shareDeckToCommunity(
  deck: Deck,
  category: Category | null,
  linkDeck: (communityId: string) => void,
): Promise<void> {
  const authorUuid = await getOrCreateAuthorUuid();
  const communityId = deck.communityId ?? newCommunityDeckId();
  const payload = buildCommunityPayload(deck, communityId, authorUuid, categoryReference(category));
  if (payload.title === '' || payload.cards.length === 0) {
    throw new CommunityError('invalid', 'The deck has no title or no complete card.');
  }
  if (deck.communityId === undefined) {
    linkDeck(communityId);
  }
  await publishCommunityDeck(payload);
}
