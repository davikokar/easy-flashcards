import { parseStoredArray } from '../src/utils/storedArray';

describe('parseStoredArray', () => {
  it('returns the rows of a stored array', () => {
    expect(parseStoredArray('[{"id":"a"},1]')).toEqual([{ id: 'a' }, 1]);
  });

  it('returns [] for a missing value', () => {
    expect(parseStoredArray(null)).toEqual([]);
    expect(parseStoredArray('')).toEqual([]);
  });

  it('returns [] for invalid JSON instead of throwing', () => {
    expect(parseStoredArray('[{"id":')).toEqual([]);
  });

  it('returns [] when the value is not an array', () => {
    expect(parseStoredArray('{"id":"a"}')).toEqual([]);
    expect(parseStoredArray('"text"')).toEqual([]);
  });
});
