/** The rows of a stored JSON array; [] for a missing, unparseable or non-array value. Never throws. */
export function parseStoredArray(raw: string | null): unknown[] {
  if (!raw) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
