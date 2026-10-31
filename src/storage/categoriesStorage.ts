import AsyncStorage from '@react-native-async-storage/async-storage';
import { categoryPalette } from '../theme';
import { Category } from '../types';
import { FALLBACK_CATEGORY_ICON, isCategoryIcon, isHexColor } from '../utils/categories';
import { parseStoredArray } from '../utils/storedArray';

const CATEGORIES_KEY = '@easy-flashcards/categories/v1';

/** Drops a row with no usable id or name; repairs a bad colour, icon or timestamp. */
function normalizeCategory(value: unknown): Category | null {
  const row = value as Record<string, unknown> | null;
  if (
    !row ||
    typeof row.id !== 'string' ||
    typeof row.name !== 'string' ||
    row.name.trim() === ''
  ) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    color: isHexColor(row.color) ? row.color : categoryPalette[0],
    icon: isCategoryIcon(row.icon) ? row.icon : FALLBACK_CATEGORY_ICON,
    createdAt: typeof row.createdAt === 'number' ? row.createdAt : Date.now(),
  };
}

export async function loadCategories(): Promise<Category[]> {
  const raw = await AsyncStorage.getItem(CATEGORIES_KEY);
  const seen = new Set<string>();
  const categories: Category[] = [];
  for (const row of parseStoredArray(raw)) {
    const category = normalizeCategory(row);
    // The first row with an id wins.
    if (category && !seen.has(category.id)) {
      seen.add(category.id);
      categories.push(category);
    }
  }
  return categories;
}

export async function saveCategories(categories: Category[]): Promise<void> {
  await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}
