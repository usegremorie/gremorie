import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Hct, SchemeContent } from '@material/material-color-utilities';
import { argbOf, fromArgb } from './color.ts';
import { aliasPath, isAlias, type DtcgColor } from './model.ts';
import type { Run } from './run.ts';

/** Compose lightColorScheme/darkColorScheme parameters, in order. */
export const M3_ROLES = [
  'primary',
  'onPrimary',
  'primaryContainer',
  'onPrimaryContainer',
  'inversePrimary',
  'secondary',
  'onSecondary',
  'secondaryContainer',
  'onSecondaryContainer',
  'tertiary',
  'onTertiary',
  'tertiaryContainer',
  'onTertiaryContainer',
  'background',
  'onBackground',
  'surface',
  'onSurface',
  'surfaceVariant',
  'onSurfaceVariant',
  'surfaceTint',
  'inverseSurface',
  'inverseOnSurface',
  'error',
  'onError',
  'errorContainer',
  'onErrorContainer',
  'outline',
  'outlineVariant',
  'scrim',
  'surfaceBright',
  'surfaceContainer',
  'surfaceContainerHigh',
  'surfaceContainerHighest',
  'surfaceContainerLow',
  'surfaceContainerLowest',
  'surfaceDim',
  'primaryFixed',
  'primaryFixedDim',
  'onPrimaryFixed',
  'onPrimaryFixedVariant',
  'secondaryFixed',
  'secondaryFixedDim',
  'onSecondaryFixed',
  'onSecondaryFixedVariant',
  'tertiaryFixed',
  'tertiaryFixedDim',
  'onTertiaryFixed',
  'onTertiaryFixedVariant',
] as const;
export type M3Role = (typeof M3_ROLES)[number];
export type RoleSource =
  { kind: 'semantic'; token: string } | { kind: 'derived' };
export type RoleMap = Record<M3Role, RoleSource>;

/** Content on its container: each must reach 4.5:1. */
export const M3_ON_PAIRS: readonly (readonly [M3Role, M3Role])[] = [
  ['primary', 'onPrimary'],
  ['primaryContainer', 'onPrimaryContainer'],
  ['secondary', 'onSecondary'],
  ['secondaryContainer', 'onSecondaryContainer'],
  ['tertiary', 'onTertiary'],
  ['tertiaryContainer', 'onTertiaryContainer'],
  ['error', 'onError'],
  ['errorContainer', 'onErrorContainer'],
  ['background', 'onBackground'],
  ['surface', 'onSurface'],
  ['surfaceVariant', 'onSurfaceVariant'],
  ['inverseSurface', 'inverseOnSurface'],
  ['surfaceContainerLowest', 'onSurface'],
  ['surfaceContainerLow', 'onSurface'],
  ['surfaceContainer', 'onSurface'],
  ['surfaceContainerHigh', 'onSurface'],
  ['surfaceContainerHighest', 'onSurface'],
  ['primaryFixed', 'onPrimaryFixed'],
  ['primaryFixedDim', 'onPrimaryFixed'],
  ['secondaryFixed', 'onSecondaryFixed'],
  ['secondaryFixedDim', 'onSecondaryFixed'],
  ['tertiaryFixed', 'onTertiaryFixed'],
  ['tertiaryFixedDim', 'onTertiaryFixed'],
];

/** Derived roles that come from the primary palette, so share its hue. */
export const PRIMARY_FAMILY: readonly M3Role[] = [
  'primaryContainer',
  'onPrimaryContainer',
  'inversePrimary',
  'primaryFixed',
  'primaryFixedDim',
  'onPrimaryFixed',
  'onPrimaryFixedVariant',
];

export function parseRoleMap(json: unknown): RoleMap {
  const roles = (json as { roles?: Record<string, unknown> }).roles ?? {};
  for (const name of Object.keys(roles)) {
    if (!(M3_ROLES as readonly string[]).includes(name)) {
      throw new Error(`roles.json: unknown role ${name}`);
    }
  }
  const map = {} as RoleMap;
  for (const role of M3_ROLES) {
    const value = roles[role];
    if (value === undefined) {
      throw new Error(`roles.json: missing role ${role}`);
    }
    if (value === 'derived') map[role] = { kind: 'derived' };
    else if (isAlias(value)) {
      map[role] = { kind: 'semantic', token: aliasPath(value).join('.') };
    } else {
      throw new Error(`roles.json: ${role} must be an alias or "derived"`);
    }
  }
  return map;
}

export const loadRoleMap = (root: string): RoleMap =>
  parseRoleMap(
    JSON.parse(
      readFileSync(
        join(root, 'tokens', 'platform', 'm3', 'roles.json'),
        'utf8',
      ),
    ),
  );

/** Every M3 role from an MCU SchemeContent seeded with `seed`. */
export function deriveScheme(
  seed: DtcgColor,
  dark: boolean,
): Record<M3Role, DtcgColor> {
  const scheme = new SchemeContent(Hct.fromInt(argbOf(seed)), dark, 0);
  const argb = scheme as unknown as Record<M3Role, unknown>;
  const out = {} as Record<M3Role, DtcgColor>;
  for (const role of M3_ROLES) {
    const value = argb[role];
    if (typeof value !== 'number') throw new Error(`MCU has no role ${role}`);
    out[role] = fromArgb(value);
  }
  return out;
}

/** The 48 roles of a theme and mode: mapped from semantics, else derived. */
export function m3For(run: Run, roles: RoleMap): Record<M3Role, DtcgColor> {
  const color = (token: string): DtcgColor => {
    const t = run.byName.get(`--${token}`);
    if (!t || t.type !== 'color') {
      throw new Error(`${run.theme}/${run.mode}: --${token} is not a colour`);
    }
    return t.value as DtcgColor;
  };
  const derived = deriveScheme(color('primary'), run.mode === 'dark');
  const out = {} as Record<M3Role, DtcgColor>;
  for (const role of M3_ROLES) {
    const source = roles[role];
    out[role] =
      source.kind === 'semantic' ? color(source.token) : derived[role];
  }
  return out;
}
