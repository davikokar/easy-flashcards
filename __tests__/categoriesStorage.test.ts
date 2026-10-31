import { loadCategories } from '../src/storage/categoriesStorage';
import { categoryPalette } from '../src/theme';
import { FALLBACK_CATEGORY_ICON } from '../src/utils/categories';

const mockGetItem = jest.fn();

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: { getItem: (key: string) => mockGetItem(key), setItem: jest.fn() },
}));

function stored(rows: unknown): void {
  mockGetItem.mockResolvedValue(JSON.stringify(rows));
}

const good = { id: 'category_a', name: 'Chess', color: '#123456', icon: 'sport', createdAt: 5 };

describe('loadCategories', () => {
  it('reads the categories key', async () => {
    stored([]);

    await loadCategories();

    expect(mockGetItem).toHaveBeenCalledWith('@easy-flashcards/categories/v1');
  });

  it('returns [] when nothing is stored or the value is corrupt', async () => {
    mockGetItem.mockResolvedValue(null);
    expect(await loadCategories()).toEqual([]);

    mockGetItem.mockResolvedValue('[{');
    expect(await loadCategories()).toEqual([]);

    mockGetItem.mockResolvedValue('{"id":"category_a"}');
    expect(await loadCategories()).toEqual([]);
  });

  it('keeps a well-formed row as stored', async () => {
    stored([good]);

    expect(await loadCategories()).toEqual([good]);
  });

  it('drops rows with no string id or an empty name', async () => {
    stored([
      null,
      { ...good, id: undefined },
      { ...good, id: 7 },
      { ...good, id: 'category_b', name: '' },
      { ...good, id: 'category_c', name: '   ' },
      { ...good, id: 'category_d', name: 4 },
      good,
    ]);

    const categories = await loadCategories();

    expect(categories.map(c => c.id)).toEqual(['category_a']);
  });

  it('keeps the first of two rows with the same id', async () => {
    stored([good, { ...good, name: 'Second' }]);

    const categories = await loadCategories();

    expect(categories).toEqual([good]);
  });

  it('keeps an extra icon key as stored', async () => {
    stored([{ ...good, icon: 'rocket_launch' }]);

    expect((await loadCategories())[0].icon).toBe('rocket_launch');
  });

  it('reads a bad colour as the first palette colour', async () => {
    stored([{ ...good, color: 'red' }, { ...good, id: 'category_b', color: 5 }]);

    const categories = await loadCategories();

    expect(categories.map(c => c.color)).toEqual([categoryPalette[0], categoryPalette[0]]);
  });

  it('keeps a hex colour that is not in the palette', async () => {
    stored([{ ...good, color: '#abcdef' }]);

    expect((await loadCategories())[0].color).toBe('#abcdef');
  });

  it('reads an unknown icon as the fallback icon', async () => {
    stored([{ ...good, icon: 'rocket' }, { ...good, id: 'category_b', icon: undefined }]);

    const categories = await loadCategories();

    expect(categories.map(c => c.icon)).toEqual([FALLBACK_CATEGORY_ICON, FALLBACK_CATEGORY_ICON]);
  });

  it('reads a missing or non-numeric createdAt as now', async () => {
    const before = Date.now();
    stored([{ ...good, createdAt: undefined }, { ...good, id: 'category_b', createdAt: 'x' }]);

    const categories = await loadCategories();

    expect(categories.every(c => c.createdAt >= before && c.createdAt <= Date.now())).toBe(true);
  });

  it('keeps names that collide ignoring case or are too long', async () => {
    const long = 'a'.repeat(40);
    stored([good, { ...good, id: 'category_b', name: 'CHESS' }, { ...good, id: 'category_c', name: long }]);

    const categories = await loadCategories();

    expect(categories.map(c => c.name)).toEqual(['Chess', 'CHESS', long]);
  });

  it('rejects when AsyncStorage itself fails', async () => {
    mockGetItem.mockRejectedValue(new Error('disk'));

    await expect(loadCategories()).rejects.toThrow('disk');
  });
});
