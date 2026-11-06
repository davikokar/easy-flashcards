import { DEFAULT_SETTINGS, loadSettings, saveSettings } from '../src/storage/settingsStorage';

const mockGetItem = jest.fn();
const mockSetItem = jest.fn();

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: (key: string) => mockGetItem(key),
    setItem: (key: string, value: string) => mockSetItem(key, value),
  },
}));

describe('loadSettings', () => {
  it('reads the settings key', async () => {
    mockGetItem.mockResolvedValue(null);

    await loadSettings();

    expect(mockGetItem).toHaveBeenCalledWith('@easy-flashcards/settings/v1');
  });

  it('follows the device when nothing is stored', async () => {
    mockGetItem.mockResolvedValue(null);

    expect(await loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('reads a stored language code', async () => {
    mockGetItem.mockResolvedValue(JSON.stringify({ language: 'de' }));

    expect(await loadSettings()).toEqual({ language: 'de' });
  });

  it('reads a stored null as following the device', async () => {
    mockGetItem.mockResolvedValue(JSON.stringify({ language: null }));

    expect(await loadSettings()).toEqual({ language: null });
  });

  it('falls back to the defaults for a corrupt or wrongly shaped value', async () => {
    for (const raw of ['{', 'null', '[]', '"de"', '{"language":7}', '{"language":""}', '{}']) {
      mockGetItem.mockResolvedValue(raw);

      expect(await loadSettings()).toEqual(DEFAULT_SETTINGS);
    }
  });
});

describe('saveSettings', () => {
  it('writes the whole object under the settings key', async () => {
    await saveSettings({ language: 'ja' });

    expect(mockSetItem).toHaveBeenCalledWith(
      '@easy-flashcards/settings/v1',
      JSON.stringify({ language: 'ja' }),
    );
  });
});
