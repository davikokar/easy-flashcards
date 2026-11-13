import { englishT, translatorForTag } from '../src/locales';
import { Category } from '../src/types';
import { categoryDisplayName } from '../src/utils/categories';
import { CommunityDeckFile } from '../src/utils/communityDeck';
import {
  CommunityGroup,
  findCommunityGroup,
  groupCommunityDecks,
  selectionOfCommunityGroup,
} from '../src/utils/communityGroups';

function custom(id: string, name: string): Category {
  return { id, name, color: '#ed6e6e', icon: 'history', createdAt: 1 };
}

function file(id: string, category: string | null): CommunityDeckFile {
  return {
    deck_id: id,
    author_hash: 'a'.repeat(64),
    title: id,
    description: '',
    category,
    cards: [{ question: 'q', answer: 'a' }],
  };
}

function ids(group: CommunityGroup<CommunityDeckFile>): string[] {
  return group.files.map(f => f.deck_id);
}

function categoryIds(groups: CommunityGroup<CommunityDeckFile>[]): (string | null)[] {
  return groups.map(group => group.category?.id ?? null);
}

describe('groupCommunityDecks', () => {
  it('groups a file under the built-in category its id names', () => {
    const groups = groupCommunityDecks([file('d1', 'default_history')], [], englishT);

    expect(categoryIds(groups)).toEqual(['default_history']);
    expect(ids(groups[0])).toEqual(['d1']);
  });

  it('groups a file under a custom category by its name, ignoring case and spaces', () => {
    const customs = [custom('category_a', 'Chess')];

    const groups = groupCommunityDecks([file('d1', ' cHESS ')], customs, englishT);

    expect(categoryIds(groups)).toEqual(['category_a']);
  });

  it('groups a file under a custom category by its id', () => {
    const customs = [custom('category_a', 'Chess')];

    const groups = groupCommunityDecks([file('d1', 'category_a')], customs, englishT);

    expect(categoryIds(groups)).toEqual(['category_a']);
  });

  it('puts an unknown name, no category and a built-in display name in Other', () => {
    const files = [file('d1', 'Gardening'), file('d2', null), file('d3', 'History')];

    const groups = groupCommunityDecks(files, [], englishT);

    expect(groups).toHaveLength(1);
    expect(groups[0].category).toBeNull();
    expect(ids(groups[0])).toEqual(['d1', 'd2', 'd3']);
  });

  it('treats a missing category like none', () => {
    const missing = { deck_id: 'd1' } as CommunityDeckFile;

    const groups = groupCommunityDecks([missing], [], englishT);

    expect(categoryIds(groups)).toEqual([null]);
  });

  it('leaves out categories that have no file', () => {
    const customs = [custom('category_a', 'Chess')];

    const groups = groupCommunityDecks([file('d1', 'default_law')], customs, englishT);

    expect(categoryIds(groups)).toEqual(['default_law']);
  });

  it('returns no groups for no files', () => {
    expect(groupCommunityDecks([], [], englishT)).toEqual([]);
  });

  it('orders groups by English display name', () => {
    const files = [
      file('d1', 'default_physics'),
      file('d2', 'default_law'),
      file('d3', 'default_history'),
      file('d4', 'default_chemistry'),
    ];

    const groups = groupCommunityDecks(files, [], englishT);

    expect(categoryIds(groups)).toEqual([
      'default_chemistry',
      'default_history',
      'default_law',
      'default_physics',
    ]);
  });

  it('orders groups by the display name in the current language', () => {
    const german = translatorForTag('de');
    const files = [
      file('d1', 'default_physics'),
      file('d2', 'default_law'),
      file('d3', 'default_history'),
      file('d4', 'default_chemistry'),
    ];

    const groups = groupCommunityDecks(files, [], german);

    const names = groups.map(group => categoryDisplayName(group.category as Category, german));
    expect(names).toEqual(['Chemie', 'Geschichte', 'Physik', 'Recht']);
    expect(categoryIds(groups)).toEqual([
      'default_chemistry',
      'default_history',
      'default_physics',
      'default_law',
    ]);
  });

  it('puts built-in and custom categories in one name order', () => {
    const customs = [custom('category_a', 'Chess')];
    const files = [file('d1', 'default_history'), file('d2', 'Chess'), file('d3', 'default_chemistry')];

    const groups = groupCommunityDecks(files, customs, englishT);

    expect(categoryIds(groups)).toEqual(['default_chemistry', 'category_a', 'default_history']);
  });

  it('puts Other last even when no category sorts after it', () => {
    const customs = [custom('category_a', 'Aardvark')];
    const files = [file('d1', 'Unknown'), file('d2', 'Aardvark'), file('d3', 'default_zoology')];

    const groups = groupCommunityDecks(files, customs, englishT);

    expect(categoryIds(groups)).toEqual(['category_a', 'default_zoology', null]);
  });

  it('keeps the input order of files inside a group', () => {
    const customs = [custom('category_a', 'Chess')];
    const files = [
      file('d1', 'default_law'),
      file('d2', 'Chess'),
      file('d3', 'default_law'),
      file('d4', 'category_a'),
      file('d5', 'default_law'),
    ];

    const groups = groupCommunityDecks(files, customs, englishT);

    expect(ids(groups[0])).toEqual(['d2', 'd4']);
    expect(ids(groups[1])).toEqual(['d1', 'd3', 'd5']);
  });

  it('does not change its input', () => {
    const files = [file('d2', 'default_law'), file('d1', 'default_history')];

    groupCommunityDecks(files, [], englishT);

    expect(files.map(f => f.deck_id)).toEqual(['d2', 'd1']);
  });
});

describe('selectionOfCommunityGroup', () => {
  it('names a category group by its id and the Other group as other', () => {
    const groups = groupCommunityDecks([file('d1', 'default_law'), file('d2', null)], [], englishT);

    expect(selectionOfCommunityGroup(groups[0])).toEqual({ kind: 'category', id: 'default_law' });
    expect(selectionOfCommunityGroup(groups[1])).toEqual({ kind: 'other' });
  });
});

describe('findCommunityGroup', () => {
  const groups = groupCommunityDecks(
    [file('d1', 'default_law'), file('d2', null)],
    [],
    englishT,
  );

  it('finds a category group by its selection', () => {
    expect(findCommunityGroup(groups, { kind: 'category', id: 'default_law' })).toBe(groups[0]);
  });

  it('finds the Other group', () => {
    expect(findCommunityGroup(groups, { kind: 'other' })).toBe(groups[1]);
  });

  it('returns undefined for a category that has no group', () => {
    expect(findCommunityGroup(groups, { kind: 'category', id: 'default_history' })).toBeUndefined();
  });

  it('returns undefined for Other when nothing is in Other', () => {
    const onlyLaw = groupCommunityDecks([file('d1', 'default_law')], [], englishT);

    expect(findCommunityGroup(onlyLaw, { kind: 'other' })).toBeUndefined();
  });

  it('never matches a category whose id is the word other to the Other group', () => {
    const customs = [custom('other', 'Gardening')];
    const mixed = groupCommunityDecks([file('d1', 'Gardening'), file('d2', null)], customs, englishT);

    expect(findCommunityGroup(mixed, { kind: 'other' })?.category).toBeNull();
    expect(findCommunityGroup(mixed, { kind: 'category', id: 'other' })?.category?.id).toBe('other');
  });
});
