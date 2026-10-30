// Whitespace plus the separators deck names keep from file names (german-work-words).
const WORD_SEPARATORS = /[\s\-_.]+/;

// Lower-cased, de-duplicated words of a query. Empty for a blank query.
export function splitSearchWords(query: string): string[] {
  const words = query
    .toLowerCase()
    .split(WORD_SEPARATORS)
    .filter(word => word.length > 0);
  return [...new Set(words)];
}

// Every word must occur in the title, in any order. Literal substring match, never a pattern.
export function titleMatchesWords(title: string, words: readonly string[]): boolean {
  const lowerTitle = title.toLowerCase();
  return words.every(word => lowerTitle.includes(word));
}

// Returns `items` itself, not a copy, when the query has no words, so memoised lists stay stable.
export function filterByTitle<T>(items: T[], query: string, getTitle: (item: T) => string): T[] {
  const words = splitSearchWords(query);
  if (words.length === 0) {
    return items;
  }
  return items.filter(item => titleMatchesWords(getTitle(item), words));
}
