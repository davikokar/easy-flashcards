import { Card, Deck, Session } from '../src/types';
import {
  applyDeckEdit,
  draftsOf,
  firstIncompleteCard,
  isDeckEditChanged,
  reconcileSession,
  removedCardIds,
} from '../src/utils/deckEdit';

function card(id: string): Card {
  return { id, question: `q${id}`, answer: `a${id}`, okCount: 1, okeishCount: 0, notOkCount: 0, lastReviewedAt: 5 };
}

function deck(cardIds: string[]): Deck {
  return {
    id: 'd',
    name: 'Deck',
    description: 'About',
    categoryId: null,
    sourceFileName: null,
    createdAt: 0,
    lastStudiedAt: null,
    cards: cardIds.map(card),
  };
}

function session(overrides: Partial<Session> = {}): Session {
  return {
    id: 's',
    deckId: 'd',
    deckName: 'Deck',
    cardIds: ['a', 'b', 'c'],
    results: [],
    startedAt: 1,
    updatedAt: 1,
    completedAt: null,
    clearedAt: null,
    fixedCardIds: [],
    inverted: false,
    ...overrides,
  };
}

describe('isDeckEditChanged', () => {
  const unchanged = () => ({
    name: 'Deck',
    description: 'About',
    categoryId: null as string | null,
    cards: draftsOf(deck(['a', 'b'])),
  });

  it('is false for an edit that matches the deck', () => {
    expect(isDeckEditChanged(deck(['a', 'b']), unchanged())).toBe(false);
  });

  it('is true when the title or description differs', () => {
    expect(isDeckEditChanged(deck(['a', 'b']), { ...unchanged(), name: 'Other' })).toBe(true);
    expect(isDeckEditChanged(deck(['a', 'b']), { ...unchanged(), description: '' })).toBe(true);
  });

  it('is true when only the category differs, in either direction or to another id', () => {
    const uncategorised = deck(['a', 'b']);
    const categorised = { ...uncategorised, categoryId: 'category_a' };

    expect(isDeckEditChanged(uncategorised, { ...unchanged(), categoryId: 'category_a' })).toBe(true);
    expect(isDeckEditChanged(categorised, { ...unchanged(), categoryId: null })).toBe(true);
    expect(isDeckEditChanged(categorised, { ...unchanged(), categoryId: 'default_law' })).toBe(true);
  });

  it('is false when the category is the same', () => {
    const categorised = { ...deck(['a', 'b']), categoryId: 'category_a' };

    expect(isDeckEditChanged(categorised, { ...unchanged(), categoryId: 'category_a' })).toBe(false);
  });

  it('is true when a card is edited, added, removed or reordered', () => {
    const base = unchanged();
    const edited = { ...base, cards: [{ ...base.cards[0], answer: 'x' }, base.cards[1]] };
    const added = { ...base, cards: [...base.cards, { id: null, question: '', answer: '' }] };
    const removed = { ...base, cards: [base.cards[0]] };
    const reordered = { ...base, cards: [base.cards[1], base.cards[0]] };

    expect([edited, added, removed, reordered].map(edit => isDeckEditChanged(deck(['a', 'b']), edit))).toEqual([
      true,
      true,
      true,
      true,
    ]);
  });
});

describe('removedCardIds', () => {
  it('lists the deck cards the edit no longer has, ignoring new cards', () => {
    const result = removedCardIds(deck(['a', 'b', 'c']), [{ id: 'b' }, { id: null }]);

    expect(result).toEqual(['a', 'c']);
  });
});

describe('firstIncompleteCard', () => {
  it('returns the 1-based position of the first card missing a side', () => {
    const cards = [
      { id: 'a', question: 'q', answer: 'a' },
      { id: null, question: 'q', answer: '   ' },
      { id: null, question: '', answer: 'a' },
    ];

    expect(firstIncompleteCard(cards)).toBe(2);
  });

  it('returns null when every card is complete, and for no cards', () => {
    expect(firstIncompleteCard([{ id: 'a', question: 'q', answer: 'a' }])).toBeNull();
    expect(firstIncompleteCard([])).toBeNull();
  });
});

describe('applyDeckEdit', () => {
  it('keeps an existing card’s counters, zeroes a new card’s, and follows the given order', () => {
    const result = applyDeckEdit(deck(['a', 'b']), 'New', 'Desc', 'default_law', [
      { id: 'n', question: 'nq', answer: 'na' },
      { id: 'b', question: 'edited', answer: 'ab' },
    ]);

    expect(result.cards.map(c => c.id)).toEqual(['n', 'b']);
    expect(result.cards[0]).toMatchObject({ okCount: 0, lastReviewedAt: null });
    expect(result.cards[1]).toMatchObject({ question: 'edited', okCount: 1, lastReviewedAt: 5 });
    expect(result).toMatchObject({
      name: 'New',
      description: 'Desc',
      categoryId: 'default_law',
      id: 'd',
    });
  });

  it('writes a null category', () => {
    const categorised = { ...deck(['a']), categoryId: 'category_a' };

    const result = applyDeckEdit(categorised, 'Deck', 'About', null, [
      { id: 'a', question: 'qa', answer: 'aa' },
    ]);

    expect(result.categoryId).toBeNull();
    expect(result.cards[0]).toMatchObject({ okCount: 1, lastReviewedAt: 5 });
  });
});

describe('reconcileSession', () => {
  it('only renames a completed session whose cards were removed', () => {
    const done = session({ completedAt: 5, cardIds: ['a', 'b'] });

    const result = reconcileSession(done, 'New', ['a'], 9);

    expect(result).toEqual({ ...done, deckName: 'New' });
  });

  it('returns the same session when nothing changes', () => {
    const active = session();

    expect(reconcileSession(active, 'Deck', [], 9)).toBe(active);
    expect(reconcileSession(active, 'Deck', ['zzz'], 9)).toBe(active);
  });

  it('keeps the answered prefix even when its card was removed', () => {
    const active = session({ results: [{ cardId: 'a', answer: 'ok' }] });

    const result = reconcileSession(active, 'Deck', ['a', 'b'], 9);

    expect(result?.cardIds).toEqual(['a', 'c']);
    expect(result?.updatedAt).toBe(9);
    expect(result?.completedAt).toBeNull();
  });

  it('completes an active session whose unanswered cards are all removed', () => {
    const active = session({ results: [{ cardId: 'a', answer: 'ok' }] });

    const result = reconcileSession(active, 'Deck', ['b', 'c'], 9);

    expect(result?.cardIds).toEqual(['a']);
    expect(result?.completedAt).toBe(9);
  });

  it('deletes an active session left with no cards and no answers', () => {
    expect(reconcileSession(session(), 'Deck', ['a', 'b', 'c'], 9)).toBeNull();
  });
});
