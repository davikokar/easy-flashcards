import { categoryPalette } from '../theme';
import { Category, CategoryIcon, DefaultCategoryIcon, Deck, ExtraCategoryIcon } from '../types';

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

// What each extra icon shows, sorted by label (ignoring case). A key is permanent once shipped; a label is not.
export const EXTRA_CATEGORY_ICON_LABELS: Record<ExtraCategoryIcon, string> = {
  plane_contrails: 'Aeroplane',
  anchor: 'Anchor',
  nutrition: 'Apple',
  emergency: 'Asterisk',
  microbiology: 'Bacterium',
  finance: 'Bar chart',
  sports_basketball: 'Basketball',
  neurology: 'Brain',
  bug_report: 'Bug',
  calendar_month: 'Calendar',
  photo_camera: 'Camera',
  camera: 'Camera aperture',
  cannabis: 'Cannabis leaf',
  directions_car: 'Car',
  chess_pawn: 'Chess pawn',
  language_chinese_dayi: 'Chinese and Latin letters',
  location_city: 'City',
  circle_circle: 'Concentric circles',
  restaurant: 'Cutlery',
  database: 'Database',
  nest_heat_link_e: 'Dot in a circle',
  engineering: 'Engineer',
  face: 'Face',
  face_3: 'Face with hair',
  theaters: 'Film strip',
  flag_2: 'Flag',
  science: 'Flask',
  save: 'Floppy disk',
  sports_and_outdoors: 'Football',
  skillet: 'Frying pan',
  sports_esports: 'Game controller',
  language: 'Globe',
  diversity_3: 'Group of people',
  psychology: 'Head with cog',
  headphones: 'Headphones',
  health_and_safety: 'Health shield',
  landscape_2: 'Hills',
  hive: 'Honeycomb',
  hourglass_empty: 'Hourglass',
  house: 'House',
  icecream: 'Ice cream',
  temp_preferences_eco: 'Leaves',
  electric_bolt: 'Lightning bolt',
  wand_stars: 'Magic wand',
  biotech: 'Microscope',
  mindfulness: 'Mindfulness',
  motorcycle: 'Motorcycle',
  music_note_2: 'Musical note',
  network_node: 'Network',
  import_contacts: 'Open book',
  pan_tool: 'Open hand',
  pets: 'Paw',
  stylus: 'Pencil',
  person: 'Person',
  history_edu: 'Quill and paper',
  radio: 'Radio',
  raven: 'Raven',
  rib_cage: 'Rib cage',
  rocket_launch: 'Rocket',
  scatter_plot: 'Scatter plot',
  category: 'Shapes',
  interests: 'Shapes and heart',
  shopping_cart: 'Shopping cart',
  functions: 'Sigma',
  skull: 'Skull',
  emoji_language: 'Smiley and globe',
  snowflake: 'Snowflake',
  hotel_class: 'Star',
  mountain_flag: 'Summit flag',
  sunny: 'Sun',
  mixture_med: 'Syringe and pill',
  temple_buddhist: 'Temple',
  text_snippet: 'Text document',
  theater_comedy: 'Theatre masks',
  nest_thermostat_gen_3: 'Thermostat',
  translate: 'Translate',
  nature: 'Tree',
  fertile: 'Tulip',
  videocam: 'Video camera',
  coronavirus: 'Virus',
  volcano: 'Volcano',
  warning: 'Warning',
  water: 'Waves',
  air: 'Wind',
  build: 'Wrench',
};

export const EXTRA_CATEGORY_ICONS = Object.keys(EXTRA_CATEGORY_ICON_LABELS) as ExtraCategoryIcon[];

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

/** A default icon is labelled with its category's name; an extra icon with what it shows. */
export function getCategoryIconLabel(icon: CategoryIcon): string {
  const category = DEFAULT_CATEGORIES.find(candidate => candidate.icon === icon);
  return category ? category.name : EXTRA_CATEGORY_ICON_LABELS[icon as ExtraCategoryIcon];
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

export function countDecksInCategory(
  decks: readonly Pick<Deck, 'categoryId'>[],
  categoryId: string,
): number {
  return decks.filter(deck => deck.categoryId === categoryId).length;
}

export type CategoryNameResult =
  | { ok: true; name: string }
  | { ok: false; reason: 'empty' | 'tooLong' | 'duplicate' };

/** Checks a new category's name against the defaults and the given custom categories. */
export function validateCategoryName(
  input: string,
  customs: readonly Category[],
): CategoryNameResult {
  const name = input.trim();
  if (name === '') {
    return { ok: false, reason: 'empty' };
  }
  if (name.length > CATEGORY_NAME_MAX_LENGTH) {
    return { ok: false, reason: 'tooLong' };
  }
  const lower = name.toLowerCase();
  const taken = [...DEFAULT_CATEGORIES, ...customs].some(
    category => category.name.trim().toLowerCase() === lower,
  );
  return taken ? { ok: false, reason: 'duplicate' } : { ok: true, name };
}

/** A new array ordered by name, ignoring case; equal names keep their order. */
export function sortCategoriesByName(categories: readonly Category[]): Category[] {
  return [...categories].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
  );
}

/** Every category the app shows, defaults and customs together, ordered by name. */
export function getAllCategories(customs: readonly Category[]): Category[] {
  return sortCategoriesByName([...DEFAULT_CATEGORIES, ...customs]);
}
