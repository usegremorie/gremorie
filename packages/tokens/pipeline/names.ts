const NESTED_GROUPS = ['radius', 'font', 'tracking'] as const;

/**
 * Maps a CSS custom property to its DTCG path. Colour primitives nest by
 * ramp and step; radius, font and tracking nest one level; everything else
 * (semantics, shadows, spacing) is a flat token whose name is the property.
 */
export function cssNameToPath(prop: string): string[] {
  if (!prop.startsWith('--')) {
    throw new Error(`Not a custom property: ${prop}`);
  }
  const name = prop.slice(2);
  if (name.startsWith('color-')) {
    const rest = name.slice('color-'.length);
    const cut = rest.lastIndexOf('-');
    return ['color', rest.slice(0, cut), rest.slice(cut + 1)];
  }
  for (const group of NESTED_GROUPS) {
    if (name.startsWith(`${group}-`)) {
      return [group, name.slice(group.length + 1)];
    }
  }
  return [name];
}

export const pathToCssName = (path: readonly string[]): string =>
  `--${path.join('-')}`;
