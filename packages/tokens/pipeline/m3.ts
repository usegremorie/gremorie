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

const SURFACE_LEVELS = [
  'surfaceContainerLowest',
  'surfaceContainerLow',
  'surfaceContainer',
  'surfaceContainerHigh',
  'surfaceContainerHighest',
  'surfaceBright',
  'surfaceDim',
] as const;

const FIXED_PAIRS = (['primary', 'secondary', 'tertiary'] as const).flatMap(
  (family) => {
    const f = `${family.charAt(0).toUpperCase()}${family.slice(1)}`;
    return [`${family}Fixed`, `${family}FixedDim`].flatMap((fill) =>
      [`on${f}Fixed`, `on${f}FixedVariant`].map(
        (on) => [fill as M3Role, on as M3Role] as const,
      ),
    );
  },
);

/** Content on its container: each must reach 4.5:1 (WCAG 2.2 1.4.3). */
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
  ...SURFACE_LEVELS.map((level) => [level, 'onSurface'] as const),
  ...SURFACE_LEVELS.slice(0, 5).map(
    (level) => [level, 'onSurfaceVariant'] as const,
  ),
  ...FIXED_PAIRS,
];

/** A boundary or accent on its surface: each must reach 3:1 (1.4.11). */
export const M3_GRAPHIC_PAIRS: readonly (readonly [M3Role, M3Role])[] = [
  ['surface', 'outline'],
  ['inverseSurface', 'inversePrimary'],
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
  if (typeof json !== 'object' || json === null || Array.isArray(json)) {
    throw new Error('roles.json: expected an object with a "roles" map');
  }
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

/**
 * The accent families whose container roles sit at the Material 3 baseline
 * tones. SchemeContent places primaryContainer at the seed's own tone, so a
 * saturated mid-tone primary (purple's #850aff) came out as its own container.
 */
const CONTAINER_FAMILIES = [
  'primary',
  'secondary',
  'tertiary',
  'error',
] as const;
/** Container fill and content tones, light then dark (M3 baseline scheme). */
const CONTAINER_TONE = { light: 90, dark: 30 } as const;
const ON_CONTAINER_TONE = { light: 10, dark: 90 } as const;

/**
 * The accent families whose accent roles are derived (the theme maps primary
 * and error to its own tokens). SchemeContent can place these accents next to
 * the container content tone: purple dark tertiary came out as its own
 * onTertiaryContainer.
 */
const DERIVED_ACCENT_FAMILIES = ['secondary', 'tertiary'] as const;
/** Accent fill and content tones, light then dark (M3 baseline scheme). */
const ACCENT_TONE = { light: 40, dark: 80 } as const;
const ON_ACCENT_TONE = { light: 100, dark: 20 } as const;

/**
 * Every M3 role from an MCU SchemeContent seeded with `seed` (colour spec
 * 2021, contrast 0). The palettes keep the seed's hue and chroma; the
 * container roles are then read from those palettes at the baseline tones
 * (tone 90 with content at 10 in light, 30 with content at 90 in dark), so a
 * container is always a tint of its accent, never the accent itself. The
 * secondary and tertiary accents are read the same way (tone 40 with content
 * at 100 in light, 80 with content at 20 in dark), so an accent never repeats
 * its container content.
 */
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
  const mode = dark ? 'dark' : 'light';
  const palettes = {
    primary: scheme.primaryPalette,
    secondary: scheme.secondaryPalette,
    tertiary: scheme.tertiaryPalette,
    error: scheme.errorPalette,
  };
  for (const family of CONTAINER_FAMILIES) {
    const palette = palettes[family];
    const on = `on${family.charAt(0).toUpperCase()}${family.slice(1)}Container`;
    out[`${family}Container`] = fromArgb(palette.tone(CONTAINER_TONE[mode]));
    out[on as M3Role] = fromArgb(palette.tone(ON_CONTAINER_TONE[mode]));
  }
  for (const family of DERIVED_ACCENT_FAMILIES) {
    const palette = palettes[family];
    const on = `on${family.charAt(0).toUpperCase()}${family.slice(1)}`;
    out[family] = fromArgb(palette.tone(ACCENT_TONE[mode]));
    out[on as M3Role] = fromArgb(palette.tone(ON_ACCENT_TONE[mode]));
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
