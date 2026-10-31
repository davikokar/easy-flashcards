import fs from 'fs';
import path from 'path';
import { categoryPalette } from '../src/theme';
import { Category } from '../src/types';
import {
  CATEGORY_ICONS,
  CATEGORY_NAME_MAX_LENGTH,
  DEFAULT_CATEGORIES,
  DEFAULT_CATEGORY_ICONS,
  EXTRA_CATEGORY_ICONS,
  FALLBACK_CATEGORY_ICON,
  countDecksInCategory,
  findCategory,
  getAllCategories,
  getCategoryIconLabel,
  isCategoryIcon,
  isDefaultCategoryId,
  isHexColor,
  sortCategoriesByName,
  validateCategoryName,
} from '../src/utils/categories';

function custom(id: string, name: string): Category {
  return { id, name, color: '#ed6e6e', icon: 'history', createdAt: 1 };
}

describe('DEFAULT_CATEGORIES', () => {
  it('has 21 categories', () => {
    expect(DEFAULT_CATEGORIES).toHaveLength(21);
    expect(DEFAULT_CATEGORY_ICONS).toHaveLength(21);
  });

  it('is in alphabetical order by name', () => {
    expect(sortCategoriesByName(DEFAULT_CATEGORIES)).toEqual(DEFAULT_CATEGORIES);
  });

  it('has unique ids, names and icons', () => {
    expect(new Set(DEFAULT_CATEGORIES.map(c => c.id)).size).toBe(21);
    expect(new Set(DEFAULT_CATEGORIES.map(c => c.name)).size).toBe(21);
    expect(new Set(DEFAULT_CATEGORIES.map(c => c.icon)).size).toBe(21);
  });

  it('uses every icon key once and names each id after its icon', () => {
    expect(DEFAULT_CATEGORIES.map(c => c.icon).sort()).toEqual([...DEFAULT_CATEGORY_ICONS].sort());
    expect(DEFAULT_CATEGORIES.every(c => c.id === `default_${c.icon}`)).toBe(true);
  });

  it('uses every palette colour once, in palette order', () => {
    expect(DEFAULT_CATEGORIES.map(c => c.color)).toEqual(categoryPalette);
  });

  it('keeps the ids that decks will refer to', () => {
    const ids = DEFAULT_CATEGORIES.map(c => c.id);

    expect(ids).toContain('default_mathematics');
    expect(ids).toContain('default_botany');
    expect(ids).toContain('default_gastronomy');
    expect(ids).toContain('default_computer_science');
  });
});

describe('EXTRA_CATEGORY_ICONS and CATEGORY_ICONS', () => {
  it('shares no key with the default icons and has no repeats', () => {
    expect(EXTRA_CATEGORY_ICONS.filter(icon => (DEFAULT_CATEGORY_ICONS as readonly string[]).includes(icon))).toEqual([]);
    expect(new Set(EXTRA_CATEGORY_ICONS).size).toBe(EXTRA_CATEGORY_ICONS.length);
  });

  it('is sorted by label, ignoring case', () => {
    const labels = EXTRA_CATEGORY_ICONS.map(icon => getCategoryIconLabel(icon).toLowerCase());

    expect(labels).toEqual([...labels].sort());
  });

  it('offers the default icons first, then the extras', () => {
    expect(CATEGORY_ICONS).toEqual([...DEFAULT_CATEGORY_ICONS, ...EXTRA_CATEGORY_ICONS]);
  });

  it('uses lower-case snake_case keys', () => {
    expect(CATEGORY_ICONS.every(icon => /^[a-z][a-z0-9_]*$/.test(icon))).toBe(true);
  });

  it('has a default icon as the fallback', () => {
    expect(DEFAULT_CATEGORY_ICONS).toContain(FALLBACK_CATEGORY_ICON);
  });
});

describe('getCategoryIconLabel', () => {
  const labels = CATEGORY_ICONS.map(getCategoryIconLabel);

  it('is non-empty for every icon', () => {
    expect(labels.every(label => label.trim() !== '')).toBe(true);
  });

  it('is unique across all icons, ignoring case', () => {
    expect(new Set(labels.map(label => label.toLowerCase())).size).toBe(CATEGORY_ICONS.length);
  });

  it('is the category name for a default icon', () => {
    expect(DEFAULT_CATEGORIES.every(c => getCategoryIconLabel(c.icon) === c.name)).toBe(true);
  });

  it('never gives an extra icon the name of a default category', () => {
    const defaultNames = DEFAULT_CATEGORIES.map(c => c.name.toLowerCase());

    expect(EXTRA_CATEGORY_ICONS.map(icon => getCategoryIconLabel(icon).toLowerCase()).filter(label => defaultNames.includes(label))).toEqual([]);
  });
});

describe('category icon drawables', () => {
  const directory = path.join(__dirname, '..', 'src', 'assets', 'category-icons');
  const drawables = fs.readdirSync(directory).filter(name => name.endsWith('.xml'));

  it('has one file per icon key and no other drawable', () => {
    expect(drawables.map(name => name.slice(0, -'.xml'.length)).sort()).toEqual([...CATEGORY_ICONS].sort());
  });

  it('has no theme tint in any file', () => {
    const tinted = drawables.filter(name =>
      fs.readFileSync(path.join(directory, name), 'utf8').includes('android:tint'),
    );

    expect(tinted).toEqual([]);
  });
});

describe('isHexColor', () => {

  it('accepts 3, 4, 6 and 8 digit hex colours', () => {
    expect(['#fff', '#ffff', '#ed6e6e', '#ED6E6E80'].every(isHexColor)).toBe(true);
  });

  it('rejects anything else', () => {
    expect(['red', '#ed6e6', '#ggg', 'ed6e6e', '', 5, null, undefined].some(isHexColor)).toBe(false);
  });
});

describe('isCategoryIcon and isDefaultCategoryId', () => {
  it('recognises the icon keys and the fallback', () => {
    expect(isCategoryIcon('astronomy')).toBe(true);
    expect(isCategoryIcon(FALLBACK_CATEGORY_ICON)).toBe(true);
    expect(isCategoryIcon('rocket')).toBe(false);
    expect(isCategoryIcon(3)).toBe(false);
  });

  it('recognises an extra icon key', () => {
    expect(isCategoryIcon('rocket_launch')).toBe(true);
  });

  it('rejects a source file name that was not renamed to its key', () => {
    expect(isCategoryIcon('air_24px')).toBe(false);
  });

  it('recognises default ids only', () => {
    expect(isDefaultCategoryId('default_law')).toBe(true);
    expect(isDefaultCategoryId('category_x')).toBe(false);
  });
});

describe('validateCategoryName', () => {
  it('accepts a name and returns it trimmed', () => {
    expect(validateCategoryName('  Chess  ', [])).toEqual({ ok: true, name: 'Chess' });
  });

  it('rejects an empty or blank name', () => {
    expect(validateCategoryName('', [])).toEqual({ ok: false, reason: 'empty' });
    expect(validateCategoryName('   ', [])).toEqual({ ok: false, reason: 'empty' });
  });

  it('accepts exactly the maximum length and rejects one more', () => {
    const longest = 'a'.repeat(CATEGORY_NAME_MAX_LENGTH);

    expect(validateCategoryName(longest, [])).toEqual({ ok: true, name: longest });
    expect(validateCategoryName(`${longest}a`, [])).toEqual({ ok: false, reason: 'tooLong' });
  });

  it('measures the length after trimming', () => {
    const padded = ` ${'a'.repeat(CATEGORY_NAME_MAX_LENGTH)} `;

    expect(validateCategoryName(padded, []).ok).toBe(true);
  });

  it('rejects a default name, ignoring case', () => {
    expect(validateCategoryName('astronomy', [])).toEqual({ ok: false, reason: 'duplicate' });
    expect(validateCategoryName('COMPUTER SCIENCE', [])).toEqual({ ok: false, reason: 'duplicate' });
  });

  it('rejects a custom name, ignoring case and surrounding spaces', () => {
    const customs = [custom('category_a', 'Chess')];

    expect(validateCategoryName(' cHESS ', customs)).toEqual({ ok: false, reason: 'duplicate' });
  });
});

describe('sortCategoriesByName and getAllCategories', () => {
  it('sorts by name ignoring case without changing the input', () => {
    const input = [custom('1', 'banana'), custom('2', 'Apple'), custom('3', 'cherry')];

    const sorted = sortCategoriesByName(input);

    expect(sorted.map(c => c.name)).toEqual(['Apple', 'banana', 'cherry']);
    expect(input.map(c => c.name)).toEqual(['banana', 'Apple', 'cherry']);
  });

  it('merges defaults and customs in name order', () => {
    const all = getAllCategories([custom('category_a', 'Chess'), custom('category_b', 'Zen')]);

    expect(all).toHaveLength(23);
    expect(all.map(c => c.name).indexOf('Chess')).toBe(all.map(c => c.name).indexOf('Chemistry') + 1);
    expect(all[all.length - 1].name).toBe('Zoology');
    expect(all[all.length - 2].name).toBe('Zen');
  });
});

describe('findCategory', () => {
  const customs = [custom('category_a', 'Chess')];

  it('finds a default by id', () => {
    expect(findCategory('default_law', customs)?.name).toBe('Law');
  });

  it('finds a custom by id', () => {
    expect(findCategory('category_a', customs)).toBe(customs[0]);
  });

  it('returns null for null and for an unknown id', () => {
    expect(findCategory(null, customs)).toBeNull();
    expect(findCategory('category_zzz', customs)).toBeNull();
    expect(findCategory('', customs)).toBeNull();
  });

  it('returns null for a custom id once the category is gone', () => {
    expect(findCategory('category_a', [])).toBeNull();
  });
});

describe('countDecksInCategory', () => {
  const decks = [
    { categoryId: 'category_a' },
    { categoryId: null },
    { categoryId: 'category_a' },
    { categoryId: 'default_law' },
  ];

  it('counts the decks that use the category', () => {
    expect(countDecksInCategory(decks, 'category_a')).toBe(2);
    expect(countDecksInCategory(decks, 'default_law')).toBe(1);
  });

  it('is 0 for an unused id and for no decks', () => {
    expect(countDecksInCategory(decks, 'category_zzz')).toBe(0);
    expect(countDecksInCategory([], 'category_a')).toBe(0);
  });
});
