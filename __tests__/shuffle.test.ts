import { shuffle } from '../src/utils/shuffle';

describe('shuffle', () => {
  it('returns a permutation of the input', () => {
    const input = ['a', 'b', 'c', 'd', 'e'];

    const result = shuffle(input);

    expect(result).toHaveLength(input.length);
    expect([...result].sort()).toEqual(input);
  });

  it('does not mutate its input', () => {
    const input = [1, 2, 3, 4];

    const result = shuffle(input, () => 0);

    expect(input).toEqual([1, 2, 3, 4]);
    expect(result).not.toBe(input);
  });

  it('is deterministic for a given random source', () => {
    const result = shuffle([1, 2, 3, 4], () => 0);

    expect(result).toEqual([2, 3, 4, 1]);
  });

  it('leaves the order alone when the random source always picks the last index', () => {
    const result = shuffle([1, 2, 3, 4], () => 0.999);

    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('returns an empty array for an empty input', () => {
    expect(shuffle([])).toEqual([]);
  });

  it('returns a single item unchanged', () => {
    expect(shuffle(['only'])).toEqual(['only']);
  });
});
