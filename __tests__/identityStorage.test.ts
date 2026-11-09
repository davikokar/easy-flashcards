import { loadAuthorUuid, saveAuthorUuid } from '../src/storage/identityStorage';

const mockGetItem = jest.fn();
const mockSetItem = jest.fn();

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: (key: string) => mockGetItem(key),
    setItem: (key: string, value: string) => mockSetItem(key, value),
  },
}));

const UUID = '7c1d2e3f-4a5b-4c6d-8e7f-9a0b1c2d3e4f';

describe('loadAuthorUuid', () => {
  it('reads the identity key', async () => {
    mockGetItem.mockResolvedValue(null);

    expect(await loadAuthorUuid()).toBeNull();
    expect(mockGetItem).toHaveBeenCalledWith('@easy-flashcards/identity/v1');
  });

  it('reads a stored uuid', async () => {
    mockGetItem.mockResolvedValue(JSON.stringify({ authorUuid: UUID }));

    expect(await loadAuthorUuid()).toBe(UUID);
  });

  it('reads a corrupt or wrongly shaped value as no identity', async () => {
    for (const raw of ['{', 'null', '[]', '"x"', '{}', '{"authorUuid":7}', '{"authorUuid":"abc"}']) {
      mockGetItem.mockResolvedValue(raw);

      expect(await loadAuthorUuid()).toBeNull();
    }
  });
});

describe('saveAuthorUuid', () => {
  it('writes the whole object under the identity key', async () => {
    await saveAuthorUuid(UUID);

    expect(mockSetItem).toHaveBeenCalledWith(
      '@easy-flashcards/identity/v1',
      JSON.stringify({ authorUuid: UUID }),
    );
  });
});
