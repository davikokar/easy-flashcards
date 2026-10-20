import { fileUriToPath, pathToFileUri } from '../src/utils/fileUri';

describe('fileUriToPath', () => {
  it('strips the file scheme', () => {
    expect(fileUriToPath('file:///data/user/0/app/cache/deck.csv')).toBe(
      '/data/user/0/app/cache/deck.csv',
    );
  });

  it('decodes escaped spaces', () => {
    expect(fileUriToPath('file:///cache/german%20words.csv')).toBe('/cache/german words.csv');
  });

  it('decodes multi-byte sequences', () => {
    expect(fileUriToPath('file:///cache/w%C3%B6rter.csv')).toBe('/cache/wörter.csv');
  });

  it('leaves a stray percent sign untouched', () => {
    expect(fileUriToPath('/cache/100%.csv')).toBe('/cache/100%.csv');
  });
});

describe('pathToFileUri', () => {
  it('adds the file scheme and keeps the separators', () => {
    expect(pathToFileUri('/data/user/0/app/cache/deck.csv')).toBe(
      'file:///data/user/0/app/cache/deck.csv',
    );
  });

  it('percent-encodes the segments', () => {
    expect(pathToFileUri('/cache/german words.csv')).toBe('file:///cache/german%20words.csv');
  });
});
