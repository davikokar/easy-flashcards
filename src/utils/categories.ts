import { categoryPalette } from '../theme';
import { Category, CategoryIcon, DefaultCategoryIcon, Deck, ExtraCategoryIcon } from '../types';
import type { Translator } from './i18n';

export const DEFAULT_CATEGORY_ICONS: readonly DefaultCategoryIcon[] = [
  'astronomy',
  'biology',
  'botany',
  'chemistry',
  'cinema',
  'computer_science',
  'economics',
  'gastronomy',
  'geography',
  'history',
  'languages',
  'law',
  'literature',
  'mathematics',
  'medicine',
  'music',
  'philosophy',
  'physics',
  'religion',
  'sport',
  'zoology',
];

// The extra icons in the order the Icon picker shows them, the same in every language. A key is permanent once shipped.
export const EXTRA_CATEGORY_ICONS: readonly ExtraCategoryIcon[] = [
  'plane_contrails',
  'anchor',
  'nutrition',
  'emergency',
  'microbiology',
  'finance',
  'sports_basketball',
  'neurology',
  'bug_report',
  'calendar_month',
  'photo_camera',
  'camera',
  'cannabis',
  'directions_car',
  'chess_pawn',
  'language_chinese_dayi',
  'location_city',
  'circle_circle',
  'restaurant',
  'database',
  'nest_heat_link_e',
  'engineering',
  'face',
  'face_3',
  'theaters',
  'flag_2',
  'science',
  'save',
  'sports_and_outdoors',
  'skillet',
  'sports_esports',
  'language',
  'diversity_3',
  'psychology',
  'headphones',
  'health_and_safety',
  'landscape_2',
  'hive',
  'hourglass_empty',
  'house',
  'icecream',
  'temp_preferences_eco',
  'electric_bolt',
  'wand_stars',
  'biotech',
  'mindfulness',
  'motorcycle',
  'music_note_2',
  'network_node',
  'import_contacts',
  'pan_tool',
  'pets',
  'stylus',
  'person',
  'history_edu',
  'radio',
  'raven',
  'rib_cage',
  'rocket_launch',
  'scatter_plot',
  'category',
  'interests',
  'shopping_cart',
  'functions',
  'skull',
  'emoji_language',
  'snowflake',
  'hotel_class',
  'mountain_flag',
  'sunny',
  'mixture_med',
  'temple_buddhist',
  'text_snippet',
  'theater_comedy',
  'nest_thermostat_gen_3',
  'translate',
  'nature',
  'fertile',
  'videocam',
  'coronavirus',
  'volcano',
  'warning',
  'water',
  'air',
  'build',
];

/** Every icon a custom category can choose: the defaults' icons first, then the extras. */
export const CATEGORY_ICONS: readonly CategoryIcon[] = [
  ...DEFAULT_CATEGORY_ICONS,
  ...EXTRA_CATEGORY_ICONS,
];

/** Shown for a stored icon key this build does not know. */
export const FALLBACK_CATEGORY_ICON: DefaultCategoryIcon = 'literature';

export const CATEGORY_NAME_MAX_LENGTH = 30;

// Alphabetical by name; ids are permanent because decks will refer to them.
const DEFAULT_CATEGORY_NAMES: readonly [string, DefaultCategoryIcon][] = [
  ['Astronomy', 'astronomy'],
  ['Biology', 'biology'],
  ['Botany', 'botany'],
  ['Chemistry', 'chemistry'],
  ['Cinema', 'cinema'],
  ['Computer science', 'computer_science'],
  ['Economics', 'economics'],
  ['Gastronomy', 'gastronomy'],
  ['Geography', 'geography'],
  ['History', 'history'],
  ['Languages', 'languages'],
  ['Law', 'law'],
  ['Literature', 'literature'],
  ['Mathematics', 'mathematics'],
  ['Medicine', 'medicine'],
  ['Music', 'music'],
  ['Philosophy', 'philosophy'],
  ['Physics', 'physics'],
  ['Religion', 'religion'],
  ['Sport', 'sport'],
  ['Zoology', 'zoology'],
];

export const DEFAULT_CATEGORIES: readonly Category[] = DEFAULT_CATEGORY_NAMES.map(
  ([name, icon], index) => ({
    id: `default_${icon}`,
    name,
    color: categoryPalette[index],
    icon,
    createdAt: 0,
  }),
);

export function isCategoryIcon(value: unknown): value is CategoryIcon {
  return typeof value === 'string' && (CATEGORY_ICONS as readonly string[]).includes(value);
}

function isDefaultCategoryIcon(icon: CategoryIcon): icon is DefaultCategoryIcon {
  return (DEFAULT_CATEGORY_ICONS as readonly CategoryIcon[]).includes(icon);
}

/**
 * What the app shows for a category's name: a built-in's translated name, a custom category's
 * stored name as it is. `DEFAULT_CATEGORIES[].name` is English and is never shown directly.
 */
export function categoryDisplayName(category: Category, t: Translator): string {
  return isDefaultCategoryId(category.id)
    ? t(`categoryNames.builtIn.${category.icon as DefaultCategoryIcon}`)
    : category.name;
}

/** A default icon is labelled with its category's name; an extra icon with what it shows. */
export function getCategoryIconLabel(icon: CategoryIcon, t: Translator): string {
  return isDefaultCategoryIcon(icon)
    ? t(`categoryNames.builtIn.${icon}`)
    : t(`categoryNames.icons.${icon}`);
}

/** #rgb, #rgba, #rrggbb or #rrggbbaa. */
export function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value);
}

export function isDefaultCategoryId(id: string): boolean {
  return DEFAULT_CATEGORIES.some(category => category.id === id);
}

/** The default or custom category with this id; null for no id or an id that matches neither. */
export function findCategory(id: string | null, customs: readonly Category[]): Category | null {
  if (id === null) {
    return null;
  }
  return [...DEFAULT_CATEGORIES, ...customs].find(category => category.id === id) ?? null;
}

/** What a deck file names a category by: a built-in's id (language-neutral), a custom category's name. */
export function categoryReference(category: Category | null): string | null {
  if (category === null) {
    return null;
  }
  return isDefaultCategoryId(category.id) ? category.id : category.name;
}

/**
 * The category a file's reference names: a built-in id, then a custom id, then a custom name
 * (ignoring case and surrounding whitespace). A built-in's name never matches.
 */
export function resolveCategoryReference(
  reference: string | null,
  customs: readonly Category[],
): Category | null {
  const trimmed = reference?.trim() ?? '';
  if (trimmed === '') {
    return null;
  }
  const lower = trimmed.toLowerCase();
  return (
    findCategory(trimmed, []) ??
    customs.find(category => category.id === trimmed) ??
    customs.find(category => category.name.trim().toLowerCase() === lower) ??
    null
  );
}

export function countDecksInCategory(
  decks: readonly Pick<Deck, 'categoryId'>[],
  categoryId: string,
): number {
  return decks.filter(deck => deck.categoryId === categoryId).length;
}

export type CategoryNameResult =
  | { ok: true; name: string }
  | { ok: false; reason: 'empty' | 'tooLong' | 'duplicate' };

/**
 * Checks a new category's name against the custom categories and the built-ins, whose names are
 * compared in the current language and in English (the name kept in code).
 */
export function validateCategoryName(
  input: string,
  customs: readonly Category[],
  t: Translator,
): CategoryNameResult {
  const name = input.trim();
  if (name === '') {
    return { ok: false, reason: 'empty' };
  }
  if (name.length > CATEGORY_NAME_MAX_LENGTH) {
    return { ok: false, reason: 'tooLong' };
  }
  const lower = name.toLowerCase();
  const takenNames = [
    ...DEFAULT_CATEGORIES.flatMap(category => [categoryDisplayName(category, t), category.name]),
    ...customs.map(category => category.name),
  ];
  const taken = takenNames.some(candidate => candidate.trim().toLowerCase() === lower);
  return taken ? { ok: false, reason: 'duplicate' } : { ok: true, name };
}

/** A new array ordered by display name, ignoring case; equal names keep their order. */
export function sortCategoriesByName(categories: readonly Category[], t: Translator): Category[] {
  return [...categories].sort((a, b) =>
    categoryDisplayName(a, t).localeCompare(categoryDisplayName(b, t), undefined, {
      sensitivity: 'base',
    }),
  );
}

/** Every category the app shows, defaults and customs together, ordered by display name. */
export function getAllCategories(customs: readonly Category[], t: Translator): Category[] {
  return sortCategoriesByName([...DEFAULT_CATEGORIES, ...customs], t);
}
