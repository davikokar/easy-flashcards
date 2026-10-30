import { filterByTitle, splitSearchWords, titleMatchesWords } from '../src/utils/search';

type Item = { title: string };

const titleOf = (item: Item) => item.title;
const items = (...titles: string[]): Item[] => titles.map(title => ({ title }));
const search = (list: Item[], query: string) =>
  filterByTitle(list, query, titleOf).map(titleOf);

describe('splitSearchWords', () => {
  it('splits on whitespace', () => {
    expect(splitSearchWords('german  words\tlist')).toEqual(['german', 'words', 'list']);
  });

  it('splits on hyphens, underscores and dots', () => {
    expect(splitSearchWords('german-work_words.csv')).toEqual(['german', 'work', 'words', 'csv']);
  });

  it('lower-cases the words', () => {
    expect(splitSearchWords('German WORDS')).toEqual(['german', 'words']);
  });

  it('drops empty words and duplicates', () => {
    expect(splitSearchWords('  -a-- A  b a. ')).toEqual(['a', 'b']);
  });

  it('returns no words for an empty or whitespace-only query', () => {
    expect(splitSearchWords('')).toEqual([]);
    expect(splitSearchWords('  \t ')).toEqual([]);
    expect(splitSearchWords('-_.')).toEqual([]);
  });
});

describe('titleMatchesWords', () => {
  it('matches when every word is present', () => {
    expect(titleMatchesWords('Words in German', ['german', 'words'])).toBe(true);
  });

  it('does not match when one word is missing', () => {
    expect(titleMatchesWords('Words in German', ['german', 'french'])).toBe(false);
  });

  it('matches everything when there are no words', () => {
    expect(titleMatchesWords('Anything', [])).toBe(true);
  });
});

describe('filterByTitle', () => {
  it('finds "words in german" with "german words"', () => {
    const list = items('words in german', 'French verbs');

    expect(search(list, 'german words')).toEqual(['words in german']);
  });

  it('ignores case in the query and the title', () => {
    const list = items('German Words', 'french');

    expect(search(list, 'gERMAN')).toEqual(['German Words']);
  });

  it('matches partial words', () => {
    const list = items('German Words', 'Spanish');

    expect(search(list, 'germ wor')).toEqual(['German Words']);
  });

  it('matches a word anywhere inside a longer word', () => {
    const list = items('Biology', 'Chemistry');

    expect(search(list, 'olog')).toEqual(['Biology']);
  });

  it('excludes a title that lacks one of the words', () => {
    const list = items('German verbs', 'German words');

    expect(search(list, 'german words')).toEqual(['German words']);
  });

  it('returns nothing when no title matches', () => {
    expect(search(items('German words'), 'xyz')).toEqual([]);
  });

  it('matches every item for a whitespace-only query', () => {
    const list = items('a', 'b');

    expect(search(list, '   ')).toEqual(['a', 'b']);
  });

  it('treats regex metacharacters literally and never throws', () => {
    const list = items('Math (basics)', 'Math basics', 'a*b', 'back\\slash', 'plain');

    expect(search(list, '(basics')).toEqual(['Math (basics)']);
    expect(search(list, 'a*b')).toEqual(['a*b']);
    expect(search(list, '\\')).toEqual(['back\\slash']);
    expect(search(list, '[')).toEqual([]);
    expect(search(list, 'p.*')).toEqual([]);
  });

  it('matches a query separated by hyphens against a title with spaces', () => {
    const list = items('german words');

    expect(search(list, 'german-words')).toEqual(['german words']);
  });

  it('matches words of a title that keeps file-name separators', () => {
    const list = items('german-work-words', 'french-verbs');

    expect(search(list, 'words german')).toEqual(['german-work-words']);
    expect(search(list, 'work_words')).toEqual(['german-work-words']);
  });

  it('keeps the original order of the matches', () => {
    const list = items('b deck', 'a deck', 'c other');

    expect(search(list, 'deck')).toEqual(['b deck', 'a deck']);
  });

  it('returns the same array reference when the query has no words', () => {
    const list = items('a', 'b');

    expect(filterByTitle(list, '', titleOf)).toBe(list);
    expect(filterByTitle(list, '  -. ', titleOf)).toBe(list);
  });

  it('does not mutate its input', () => {
    const list = items('German words', 'French verbs');
    const snapshot = list.map(item => ({ ...item }));

    const result = filterByTitle(list, 'german', titleOf);

    expect(list).toEqual(snapshot);
    expect(result).not.toBe(list);
  });
});
