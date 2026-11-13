import type { Category } from '../types';
import { resolveCategoryReference, sortCategoriesByName } from './categories';
import type { Translator } from './i18n';

/** The part of a community deck file the grouping reads; `CommunityDeckFile` fits. */
export type CommunityFileCategory = { category?: string | null };

/** One Category tile's decks. `category` is null for the Other group. */
export type CommunityGroup<F extends CommunityFileCategory = CommunityFileCategory> = {
  category: Category | null;
  files: F[];
};

/** A category id can never equal `{ kind: 'other' }`, so Other needs no reserved id. */
export type CommunityGroupSelection = { kind: 'category'; id: string } | { kind: 'other' };

export const OTHER_COMMUNITY_GROUP: CommunityGroupSelection = { kind: 'other' };

/**
 * Groups files under the category a download would get (ADR-0014 Amendment 9). Groups are ordered
 * by display name, empty groups are left out, and files that resolve to nothing form the last group.
 */
export function groupCommunityDecks<F extends CommunityFileCategory>(
  files: readonly F[],
  customs: readonly Category[],
  t: Translator,
): CommunityGroup<F>[] {
  const byCategoryId = new Map<string, F[]>();
  const categories = new Map<string, Category>();
  const other: F[] = [];

  for (const file of files) {
    const category = resolveCategoryReference(file.category ?? null, customs);
    if (category === null) {
      other.push(file);
      continue;
    }
    categories.set(category.id, category);
    const group = byCategoryId.get(category.id);
    if (group === undefined) {
      byCategoryId.set(category.id, [file]);
    } else {
      group.push(file);
    }
  }

  const groups: CommunityGroup<F>[] = sortCategoriesByName([...categories.values()], t).map(
    category => ({ category, files: byCategoryId.get(category.id) ?? [] }),
  );
  if (other.length > 0) {
    groups.push({ category: null, files: other });
  }
  return groups;
}

export function selectionOfCommunityGroup(group: Pick<CommunityGroup, 'category'>): CommunityGroupSelection {
  return group.category === null ? { kind: 'other' } : { kind: 'category', id: group.category.id };
}

/** The group a selection names; undefined when it has no files any more. */
export function findCommunityGroup<F extends CommunityFileCategory>(
  groups: readonly CommunityGroup<F>[],
  selection: CommunityGroupSelection,
): CommunityGroup<F> | undefined {
  return groups.find(group => {
    const own = selectionOfCommunityGroup(group);
    return own.kind === 'other'
      ? selection.kind === 'other'
      : selection.kind === 'category' && selection.id === own.id;
  });
}
