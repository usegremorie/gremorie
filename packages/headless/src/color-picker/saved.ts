import { parseColor, sameColor } from './color';

/**
 * Adds a colour to a saved list: newest first, one entry per colour (an
 * equivalent spelling replaces the old one), at most `max` entries. Invalid
 * text leaves the list untouched.
 */
export function addSavedColor(
  list: readonly string[],
  value: string,
  max = 16,
): string[] {
  const color = parseColor(value);
  if (!color) return list as string[];
  const rest = list.filter((item) => {
    const other = parseColor(item);
    return !other || !sameColor(other, color);
  });
  return [value, ...rest].slice(0, Math.max(0, max));
}

/** Removes a colour (and any equivalent spelling) from a saved list. */
export function removeSavedColor(
  list: readonly string[],
  value: string,
): string[] {
  const color = parseColor(value);
  if (!color) return [...list];
  return list.filter((item) => {
    const other = parseColor(item);
    return !other || !sameColor(other, color);
  });
}
