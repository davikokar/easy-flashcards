import { Answer, Card, Category, Deck, Session, SessionResult } from '../src/types';
import { Action, State, initialState, reducer } from '../src/state/reducer';
import { getDeckStats, getDeckStatsSince, getGlobalStats, getGlobalStatsSince } from '../src/utils/stats';

function card(id: string): Card {
  return { id, question: id, answer: id, okCount: 0, okeishCount: 0, notOkCount: 0, lastReviewedAt: null };
}

function deck(id: string, cardIds: string[]): Deck {
  return {
    id,
    name: id,
    description: '',
    categoryId: null,
    sourceFileName: null,
    createdAt: 0,
    lastStudiedAt: null,
    cards: cardIds.map(card),
  };
}

function session(id: string, deckId: string, overrides: Partial<Session> = {}): Session {
  return {
    id,
    deckId,
    deckName: deckId,
    cardIds: ['a', 'b'],
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

function category(id: string): Category {
  return { id, name: id, color: '#ed6e6e', icon: 'history', createdAt: 1 };
}

function stateOf(decks: Deck[], sessions: Session[], categories: Category[] = []): State {
  return { decks, sessions, categories, isLoading: false, error: null };
}

describe('reducer: loading', () => {
  it('replaces the state and clears the error on loaded', () => {
    const failed: State = { ...initialState, isLoading: false, error: 'boom' };

    const next = reducer(failed, {
      type: 'loaded',
      decks: [deck('d', ['a'])],
      sessions: [],
      categories: [category('c')],
    });

    expect(next).toEqual(stateOf([deck('d', ['a'])], [], [category('c')]));
  });

  it('keeps the empty data and records the message on loadFailed', () => {
    const next = reducer(initialState, { type: 'loadFailed', message: 'boom' });

    expect(next).toEqual({
      decks: [],
      sessions: [],
      categories: [],
      isLoading: false,
      error: 'boom',
    });
  });
});

describe('reducer: addDeck and deleteDeck', () => {
  it('puts a new deck first', () => {
    const state = stateOf([deck('old', ['a'])], []);

    const next = reducer(state, { type: 'addDeck', deck: deck('new', ['a']) });

    expect(next.decks.map(d => d.id)).toEqual(['new', 'old']);
  });

  it('adds a hand-made deck with no cards and no source file at the top', () => {
    const state = stateOf([deck('old', ['a'])], []);
    const byHand: Deck = { ...deck('new', []), description: 'About', sourceFileName: null };

    const next = reducer(state, { type: 'addDeck', deck: byHand });

    expect(next.decks.map(d => d.id)).toEqual(['new', 'old']);
    expect(next.decks[0].cards).toEqual([]);
    expect(next.decks[0].sourceFileName).toBeNull();
    expect(next.decks[0].description).toBe('About');
  });

  it('keeps the description and a default category id', () => {
    const imported: Deck = { ...deck('new', ['a']), description: 'About', categoryId: 'default_astronomy' };

    const next = reducer(stateOf([], []), { type: 'addDeck', deck: imported });

    expect(next.decks[0]).toEqual(imported);
  });

  it('keeps the id of a stored custom category', () => {
    const imported: Deck = { ...deck('new', ['a']), categoryId: 'category_a' };

    const next = reducer(stateOf([], [], [category('category_a')]), {
      type: 'addDeck',
      deck: imported,
    });

    expect(next.decks[0].categoryId).toBe('category_a');
  });

  it('stores no category for an id that matches no default or stored category', () => {
    const imported: Deck = { ...deck('new', ['a']), categoryId: 'category_gone' };

    const next = reducer(stateOf([], [], [category('category_a')]), {
      type: 'addDeck',
      deck: imported,
    });

    expect(next.decks[0]).toEqual({ ...imported, categoryId: null });
  });

  it('stores no category when none is requested', () => {
    const next = reducer(stateOf([], []), { type: 'addDeck', deck: deck('new', ['a']) });

    expect(next.decks[0].categoryId).toBeNull();
  });

  it('resolves a custom category name from a file to its stored id', () => {
    const customs = [{ ...category('category_a'), name: 'Chess' }];
    const imported: Deck = { ...deck('new', ['a']), categoryId: ' chess ' };

    const next = reducer(stateOf([], [], customs), { type: 'addDeck', deck: imported });

    expect(next.decks[0].categoryId).toBe('category_a');
  });

  it('does not resolve a built-in category by its name', () => {
    const imported: Deck = { ...deck('new', ['a']), categoryId: 'Astronomy' };

    const next = reducer(stateOf([], []), { type: 'addDeck', deck: imported });

    expect(next.decks[0].categoryId).toBeNull();
  });

  it('stores no category for a custom name once no stored category has it', () => {
    const imported: Deck = { ...deck('new', ['a']), categoryId: 'Chess' };

    const next = reducer(stateOf([], [], [category('category_a')]), {
      type: 'addDeck',
      deck: imported,
    });

    expect(next.decks[0].categoryId).toBeNull();
  });

  it('removes the deck and every session of it, cleared ones included', () => {
    const state = stateOf(
      [deck('d1', ['a']), deck('d2', ['a'])],
      [
        session('s1', 'd1'),
        session('s2', 'd1', { completedAt: 5, clearedAt: 6 }),
        session('s3', 'd2'),
      ],
    );

    const next = reducer(state, { type: 'deleteDeck', deckId: 'd1' });

    expect(next.decks.map(d => d.id)).toEqual(['d2']);
    expect(next.sessions.map(s => s.id)).toEqual(['s3']);
  });
});

describe('reducer: updateDeck', () => {
  const counted: Card = { ...card('a'), okCount: 2, notOkCount: 1, lastReviewedAt: 7 };
  const edited = (
    cards: { id: string; question: string; answer: string }[],
    categoryId: string | null = null,
  ) =>
    ({
      type: 'updateDeck',
      deckId: 'd',
      name: 'New',
      description: 'About',
      categoryId,
      cards,
      at: 100,
    }) as const;

  it('changes the title, description and card text and keeps the counters', () => {
    const state = stateOf([{ ...deck('d', []), cards: [counted, card('b')] }], []);

    const next = reducer(
      state,
      edited([
        { id: 'a', question: 'Q', answer: 'A' },
        { id: 'b', question: 'b', answer: 'b' },
      ]),
    );

    expect(next.decks[0]).toMatchObject({ name: 'New', description: 'About' });
    expect(next.decks[0].cards[0]).toEqual({ ...counted, question: 'Q', answer: 'A' });
  });

  it('adds a card with zero counters and removes one that is missing', () => {
    const state = stateOf([{ ...deck('d', []), cards: [counted, card('b')] }], []);

    const next = reducer(
      state,
      edited([
        { id: 'b', question: 'b', answer: 'b' },
        { id: 'n', question: 'new', answer: 'new' },
      ]),
    );

    expect(next.decks[0].cards.map(c => c.id)).toEqual(['b', 'n']);
    expect(next.decks[0].cards[1]).toEqual({
      id: 'n',
      question: 'new',
      answer: 'new',
      okCount: 0,
      okeishCount: 0,
      notOkCount: 0,
      lastReviewedAt: null,
    });
  });

  it('renames every session of the deck, cleared ones included, and no other', () => {
    const state = stateOf(
      [deck('d', ['a', 'b']), deck('e', ['a'])],
      [
        session('s1', 'd'),
        session('s2', 'd', { completedAt: 5, clearedAt: 6 }),
        session('s3', 'e'),
      ],
    );

    const next = reducer(
      state,
      edited([
        { id: 'a', question: 'a', answer: 'a' },
        { id: 'b', question: 'b', answer: 'b' },
      ]),
    );

    expect(next.sessions.map(s => s.deckName)).toEqual(['New', 'New', 'e']);
  });

  it('drops a removed card from the unanswered part of an active session only', () => {
    const state = stateOf(
      [deck('d', ['a', 'b', 'c'])],
      [
        session('active', 'd', {
          cardIds: ['a', 'b', 'c'],
          results: [{ cardId: 'a', answer: 'ok', answeredAt: 1 }],
        }),
        session('done', 'd', {
          cardIds: ['a', 'b', 'c'],
          results: [],
          completedAt: 5,
        }),
      ],
    );

    const next = reducer(state, edited([{ id: 'c', question: 'c', answer: 'c' }]));

    expect(next.sessions[0].cardIds).toEqual(['a', 'c']);
    expect(next.sessions[0].results).toEqual([{ cardId: 'a', answer: 'ok', answeredAt: 1 }]);
    expect(next.sessions[1].cardIds).toEqual(['a', 'b', 'c']);
  });

  it('returns the same state for an unknown deck', () => {
    const state = stateOf([deck('x', ['a'])], []);

    expect(reducer(state, edited([]))).toBe(state);
  });

  it('writes a default or stored custom category id, and null', () => {
    const state = stateOf([deck('d', ['a'])], [], [category('category_a')]);
    const cards = [{ id: 'a', question: 'a', answer: 'a' }];

    const withDefault = reducer(state, edited(cards, 'default_law'));
    const withCustom = reducer(state, edited(cards, 'category_a'));
    const cleared = reducer(withCustom, edited(cards, null));

    expect(withDefault.decks[0].categoryId).toBe('default_law');
    expect(withCustom.decks[0].categoryId).toBe('category_a');
    expect(cleared.decks[0].categoryId).toBeNull();
  });

  it('writes null for an id that is neither a default nor a stored custom category', () => {
    const state = stateOf([{ ...deck('d', ['a']), categoryId: 'category_a' }], [], []);

    const next = reducer(state, edited([{ id: 'a', question: 'a', answer: 'a' }], 'category_gone'));

    expect(next.decks[0].categoryId).toBeNull();
  });

  it('leaves sessions alone when only the category changes', () => {
    const s = session('s1', 'd', { deckName: 'New' });
    const state = stateOf([deck('d', ['a', 'b'])], [s], []);
    const cards = [
      { id: 'a', question: 'a', answer: 'a' },
      { id: 'b', question: 'b', answer: 'b' },
    ];

    const next = reducer(state, edited(cards, 'default_law'));

    expect(next.sessions[0]).toBe(s);
  });
});

describe('reducer: startSession and replaySession', () => {
  it('puts a started session first', () => {
    const state = stateOf([], [session('old', 'd')]);

    const next = reducer(state, { type: 'startSession', session: session('new', 'd') });

    expect(next.sessions.map(s => s.id)).toEqual(['new', 'old']);
  });

  it('adds the replay and clears its completed source in one step', () => {
    const source = session('src', 'd', { completedAt: 5 });
    const state = stateOf([], [source]);

    const next = reducer(state, {
      type: 'replaySession',
      session: session('new', 'd'),
      sourceSessionId: 'src',
      at: 100,
    });

    expect(next.sessions.map(s => s.id)).toEqual(['new', 'src']);
    expect(next.sessions[1].clearedAt).toBe(100);
  });

  it('leaves an active source uncleared', () => {
    const state = stateOf([], [session('src', 'd')]);

    const next = reducer(state, {
      type: 'replaySession',
      session: session('new', 'd'),
      sourceSessionId: 'src',
      at: 100,
    });

    expect(next.sessions[1].clearedAt).toBeNull();
  });
});

describe('reducer: recordAnswer', () => {
  const start = () => stateOf([deck('d', ['a', 'b'])], [session('s', 'd')]);

  it('appends the result and bumps only the matching counter', () => {
    const next = reducer(start(), {
      type: 'recordAnswer',
      sessionId: 's',
      cardId: 'a',
      answer: 'okeish',
      at: 50,
    });

    expect(next.sessions[0].results).toEqual([
      { cardId: 'a', answer: 'okeish', answeredAt: 50 },
    ]);
    expect(next.sessions[0].updatedAt).toBe(50);
    expect(next.decks[0].lastStudiedAt).toBe(50);
    expect(next.decks[0].cards[0]).toMatchObject({
      okCount: 0,
      okeishCount: 1,
      notOkCount: 0,
      lastReviewedAt: 50,
    });
    expect(next.decks[0].cards[1].lastReviewedAt).toBeNull();
  });

  it('stamps each result with the time of its own answer', () => {
    const afterFirst = reducer(start(), {
      type: 'recordAnswer',
      sessionId: 's',
      cardId: 'a',
      answer: 'ok',
      at: 10,
    });
    const afterSecond = reducer(afterFirst, {
      type: 'recordAnswer',
      sessionId: 's',
      cardId: 'b',
      answer: 'notOk',
      at: 25,
    });

    expect(afterSecond.sessions[0].results.map(r => r.answeredAt)).toEqual([10, 25]);
  });

  it('counts ok and not ok on their own counters', () => {
    const afterOk = reducer(start(), {
      type: 'recordAnswer',
      sessionId: 's',
      cardId: 'a',
      answer: 'ok',
      at: 1,
    });
    const afterNotOk = reducer(afterOk, {
      type: 'recordAnswer',
      sessionId: 's',
      cardId: 'b',
      answer: 'notOk',
      at: 2,
    });

    expect(afterNotOk.decks[0].cards.map(c => [c.okCount, c.notOkCount])).toEqual([
      [1, 0],
      [0, 1],
    ]);
  });

  it('completes the session on the last answer and not before', () => {
    const afterFirst = reducer(start(), {
      type: 'recordAnswer',
      sessionId: 's',
      cardId: 'a',
      answer: 'ok',
      at: 1,
    });
    const afterLast = reducer(afterFirst, {
      type: 'recordAnswer',
      sessionId: 's',
      cardId: 'b',
      answer: 'ok',
      at: 2,
    });

    expect(afterFirst.sessions[0].completedAt).toBeNull();
    expect(afterLast.sessions[0].completedAt).toBe(2);
  });

  it('ignores a repeated answer for the same card', () => {
    const once = reducer(start(), {
      type: 'recordAnswer',
      sessionId: 's',
      cardId: 'a',
      answer: 'ok',
      at: 1,
    });

    const twice = reducer(once, {
      type: 'recordAnswer',
      sessionId: 's',
      cardId: 'a',
      answer: 'ok',
      at: 2,
    });

    expect(twice).toBe(once);
  });

  it('ignores a card that is not next, an unknown session and a completed session', () => {
    const state = stateOf(
      [deck('d', ['a', 'b'])],
      [session('s', 'd'), session('done', 'd', { completedAt: 9, results: [] })],
    );

    expect(
      reducer(state, { type: 'recordAnswer', sessionId: 's', cardId: 'b', answer: 'ok', at: 1 }),
    ).toBe(state);
    expect(
      reducer(state, { type: 'recordAnswer', sessionId: 'x', cardId: 'a', answer: 'ok', at: 1 }),
    ).toBe(state);
    expect(
      reducer(state, { type: 'recordAnswer', sessionId: 'done', cardId: 'a', answer: 'ok', at: 1 }),
    ).toBe(state);
  });
});

describe('reducer: recordReviewAnswer', () => {
  const reviewed = () =>
    stateOf(
      [deck('d', ['a', 'b'])],
      [
        session('s', 'd', {
          completedAt: 5,
          updatedAt: 5,
          results: [
            { cardId: 'a', answer: 'ok', answeredAt: 1 },
            { cardId: 'b', answer: 'notOk', answeredAt: 2 },
          ],
        }),
      ],
    );

  it('marks the card fixed and changes no statistic', () => {
    const state = reviewed();

    const next = reducer(state, {
      type: 'recordReviewAnswer',
      sessionId: 's',
      cardId: 'b',
      answer: 'ok',
    });

    expect(next.sessions[0].fixedCardIds).toEqual(['b']);
    expect(next.sessions[0].results).toBe(state.sessions[0].results);
    expect(next.sessions[0].updatedAt).toBe(5);
    expect(next.sessions[0].completedAt).toBe(5);
    expect(next.decks).toBe(state.decks);
  });

  it('returns the same state for an answer that fixes nothing', () => {
    const state = reviewed();

    expect(
      reducer(state, {
        type: 'recordReviewAnswer',
        sessionId: 's',
        cardId: 'b',
        answer: 'notOk',
      }),
    ).toBe(state);
  });
});

describe('reducer: deleteSession and clearing', () => {
  it('deletes exactly the given session', () => {
    const state = stateOf([], [session('s1', 'd'), session('s2', 'd')]);

    const next = reducer(state, { type: 'deleteSession', sessionId: 's1' });

    expect(next.sessions.map(s => s.id)).toEqual(['s2']);
  });

  it('returns the same state for an unknown session', () => {
    const state = stateOf([deck('d', ['a'])], [session('s1', 'd')]);

    expect(reducer(state, { type: 'deleteSession', sessionId: 'zzz' })).toBe(state);
  });

  describe('withdrawing answers', () => {
    const counted = (id: string, okCount: number, okeishCount: number, notOkCount: number): Card => ({
      ...card(id),
      okCount,
      okeishCount,
      notOkCount,
      lastReviewedAt: 7,
    });
    const answered = (cardId: string, answer: Answer): SessionResult => ({
      cardId,
      answer,
      answeredAt: 5,
    });

    it('takes each of the discarded answers off its card counter', () => {
      const d: Deck = {
        ...deck('d', []),
        lastStudiedAt: 7,
        cards: [counted('a', 3, 1, 2), counted('b', 1, 1, 1)],
      };
      const state = stateOf(
        [d],
        [session('s', 'd', { results: [answered('a', 'ok'), answered('a', 'notOk'), answered('b', 'okeish')] })],
      );

      const next = reducer(state, { type: 'deleteSession', sessionId: 's' });

      expect(next.decks[0].cards.map(c => [c.okCount, c.okeishCount, c.notOkCount])).toEqual([
        [2, 1, 1],
        [1, 0, 1],
      ]);
    });

    it('never takes a counter below zero', () => {
      const d: Deck = { ...deck('d', []), cards: [counted('a', 0, 0, 1)] };
      const state = stateOf(
        [d],
        [session('s', 'd', { results: [answered('a', 'ok'), answered('a', 'notOk'), answered('a', 'notOk')] })],
      );

      const next = reducer(state, { type: 'deleteSession', sessionId: 's' });

      expect(next.decks[0].cards[0]).toMatchObject({ okCount: 0, okeishCount: 0, notOkCount: 0 });
    });

    it('skips an answer whose card was removed from the deck', () => {
      const d: Deck = { ...deck('d', []), cards: [counted('a', 2, 0, 0)] };
      const state = stateOf(
        [d],
        [session('s', 'd', { results: [answered('gone', 'ok'), answered('a', 'ok')] })],
      );

      const next = reducer(state, { type: 'deleteSession', sessionId: 's' });

      expect(next.decks[0].cards.map(c => c.okCount)).toEqual([1]);
    });

    it('leaves other decks, other sessions and the review dates alone', () => {
      const target: Deck = { ...deck('d1', []), lastStudiedAt: 7, cards: [counted('a', 1, 0, 0)] };
      const other: Deck = { ...deck('d2', []), cards: [counted('a', 1, 0, 0)] };
      const kept = session('keep', 'd2', { results: [answered('a', 'ok')] });
      const state = stateOf(
        [target, other],
        [session('s', 'd1', { results: [answered('a', 'ok')] }), kept],
      );

      const next = reducer(state, { type: 'deleteSession', sessionId: 's' });

      expect(next.decks[0]).toMatchObject({ lastStudiedAt: 7 });
      expect(next.decks[0].cards[0]).toMatchObject({ okCount: 0, lastReviewedAt: 7 });
      expect(next.decks[1]).toBe(other);
      expect(next.sessions).toEqual([kept]);
    });

    it('still deletes a session whose deck no longer exists', () => {
      const state = stateOf([], [session('s', 'gone', { results: [answered('a', 'ok')] })]);

      const next = reducer(state, { type: 'deleteSession', sessionId: 's' });

      expect(next.sessions).toEqual([]);
    });
  });

  it('clears every completed session and no active one', () => {
    const state = stateOf([], [session('active', 'd'), session('done', 'd', { completedAt: 5 })]);

    const next = reducer(state, { type: 'clearCompletedSessions', at: 9 });

    expect(next.sessions.map(s => s.clearedAt)).toEqual([null, 9]);
  });

  it('returns the same state when nothing is clearable', () => {
    const state = stateOf([], [session('active', 'd')]);

    expect(reducer(state, { type: 'clearCompletedSessions', at: 9 })).toBe(state);
    expect(reducer(state, { type: 'clearSession', sessionId: 'active', at: 9 })).toBe(state);
  });

  it('clears one completed session and leaves the rest', () => {
    const state = stateOf(
      [],
      [session('a', 'd', { completedAt: 5 }), session('b', 'd', { completedAt: 5 })],
    );

    const next = reducer(state, { type: 'clearSession', sessionId: 'a', at: 9 });

    expect(next.sessions.map(s => s.clearedAt)).toEqual([9, null]);
  });
});

describe('reducer: resetDeckStats', () => {
  it('zeroes the deck, drops its sessions and leaves other decks alone', () => {
    const counted: Card = { ...card('a'), okCount: 2, okeishCount: 1, notOkCount: 3, lastReviewedAt: 7 };
    const target: Deck = {
      ...deck('d1', []),
      cards: [counted],
      lastStudiedAt: 7,
      categoryId: 'category_a',
    };
    const other: Deck = { ...deck('d2', []), cards: [counted], lastStudiedAt: 7 };
    const state = stateOf([target, other], [session('s1', 'd1'), session('s2', 'd2')]);

    const next = reducer(state, { type: 'resetDeckStats', deckId: 'd1' });

    expect(next.decks[0].lastStudiedAt).toBeNull();
    expect(next.decks[0].categoryId).toBe('category_a');
    expect(next.decks[0].cards[0]).toMatchObject({
      okCount: 0,
      okeishCount: 0,
      notOkCount: 0,
      lastReviewedAt: null,
    });
    expect(next.decks[1]).toBe(other);
    expect(next.sessions.map(s => s.id)).toEqual(['s2']);
  });
});

describe('reducer: addCategory and deleteCategory', () => {
  it('appends a new custom category', () => {
    const state = stateOf([], [], [category('category_a')]);

    const next = reducer(state, { type: 'addCategory', category: category('category_b') });

    expect(next.categories.map(c => c.id)).toEqual(['category_a', 'category_b']);
  });

  it('removes a custom category by id and leaves the rest of the state alone', () => {
    const d = deck('d', ['a']);
    const state = stateOf([d], [], [category('category_a'), category('category_b')]);

    const next = reducer(state, { type: 'deleteCategory', categoryId: 'category_a' });

    expect(next.categories.map(c => c.id)).toEqual(['category_b']);
    expect(next.decks[0]).toBe(d);
  });

  it('returns the same state for an unknown id', () => {
    const state = stateOf([], [], [category('category_a')]);

    expect(reducer(state, { type: 'deleteCategory', categoryId: 'category_zzz' })).toBe(state);
  });

  it('returns the same state for a default id', () => {
    const state = stateOf([], [], [category('category_a')]);

    expect(reducer(state, { type: 'deleteCategory', categoryId: 'default_astronomy' })).toBe(state);
  });

  it('detaches only the decks that used the category and leaves sessions alone', () => {
    const users: Deck = { ...deck('d1', ['a']), categoryId: 'category_a' };
    const others: Deck = { ...deck('d2', ['a']), categoryId: 'category_b' };
    const none = deck('d3', ['a']);
    const sessions = [session('s1', 'd1'), session('s2', 'd2')];
    const state = stateOf([users, others, none], sessions, [
      category('category_a'),
      category('category_b'),
    ]);

    const next = reducer(state, { type: 'deleteCategory', categoryId: 'category_a' });

    expect(next.decks[0]).toEqual({ ...users, categoryId: null });
    expect(next.decks[1]).toBe(others);
    expect(next.decks[2]).toBe(none);
    expect(next.sessions).toBe(sessions);
  });

  it('returns the same state for a default or unknown id even when decks use a default id', () => {
    const state = stateOf(
      [{ ...deck('d1', ['a']), categoryId: 'default_astronomy' }],
      [],
      [category('category_a')],
    );

    expect(reducer(state, { type: 'deleteCategory', categoryId: 'default_astronomy' })).toBe(state);
    expect(reducer(state, { type: 'deleteCategory', categoryId: 'category_zzz' })).toBe(state);
  });
});

describe('reducer: counters and the answer log', () => {
  const answer = (sessionId: string, cardId: string, value: Answer, at: number): Action => ({
    type: 'recordAnswer',
    sessionId,
    cardId,
    answer: value,
    at,
  });

  it('stay equal after recording, discarding, editing and resetting', () => {
    const d1 = deck('d1', ['a', 'b', 'c']);
    const d2 = deck('d2', ['x', 'y']);
    const actions: Action[] = [
      { type: 'startSession', session: session('s1', 'd1', { cardIds: ['a', 'b', 'c'] }) },
      answer('s1', 'a', 'ok', 10),
      answer('s1', 'b', 'notOk', 11),
      answer('s1', 'c', 'okeish', 12),
      { type: 'startSession', session: session('s2', 'd1', { cardIds: ['a', 'b', 'c'] }) },
      answer('s2', 'a', 'okeish', 20),
      answer('s2', 'b', 'ok', 21),
      { type: 'startSession', session: session('s3', 'd2', { cardIds: ['x', 'y'] }) },
      answer('s3', 'x', 'ok', 30),
      { type: 'addDeck', deck: deck('d3', ['p']) },
      { type: 'deleteSession', sessionId: 's2' },
      {
        type: 'updateDeck',
        deckId: 'd1',
        name: 'd1',
        description: '',
        categoryId: null,
        cards: [
          { id: 'a', question: 'a', answer: 'a' },
          { id: 'b', question: 'b', answer: 'b' },
        ],
        at: 40,
      },
      { type: 'resetDeckStats', deckId: 'd2' },
      { type: 'startSession', session: session('s4', 'd1', { cardIds: ['a', 'b'] }) },
      answer('s4', 'a', 'ok', 50),
      { type: 'clearCompletedSessions', at: 60 },
    ];

    let state = stateOf([d1, d2], []);
    for (const action of actions) {
      state = reducer(state, action);

      const log = getDeckStatsSince(state.decks, state.sessions, null);
      state.decks.forEach(d => expect(log.get(d.id)).toEqual(getDeckStats(d)));
      expect(getGlobalStatsSince(state.decks, state.sessions, null)).toEqual(
        getGlobalStats(state.decks),
      );
    }

    expect(getGlobalStats(state.decks)).toMatchObject({ okCount: 2, okeishCount: 0, notOkCount: 1 });
  });
});
