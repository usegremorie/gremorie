import { toHex } from '../color.ts';
import { formatColor } from '../css-value.ts';
import { round6 } from '../format-number.ts';
import { m3For, M3_ROLES, type M3Role, type RoleMap } from '../m3.ts';
import {
  MODES,
  type DtcgColor,
  type DtcgDimension,
  type Mode,
  type ThemeId,
} from '../model.ts';
import type { Run, RunToken } from '../run.ts';

export interface ColorOut {
  hex: string;
  oklch: string;
}
export interface ThemeOut {
  /** Semantic colours in camelCase (background, primaryForeground, chartCat1...). */
  colors: Record<string, ColorOut>;
  m3: Record<M3Role, ColorOut>;
  /** Pixels. */
  radius: Record<'base' | 'sm' | 'md' | 'lg' | 'xl', number>;
  fontFamily: Record<'sans' | 'serif' | 'mono', string[]>;
}
export interface PlatformModel {
  version: string;
  themeNames: ThemeId[];
  m3Roles: readonly M3Role[];
  /** The semantic CSS property a role takes ('--primary-foreground') or 'derived'. */
  m3Sources: Record<M3Role, string>;
  themes: Record<string, Record<Mode, ThemeOut>>;
}

export const camel = (kebab: string): string =>
  kebab.replace(/-([a-z0-9])/g, (_m, c: string) => c.toUpperCase());

const colorOut = (c: DtcgColor): ColorOut => ({
  hex: toHex(c),
  oklch: formatColor(c),
});

function tokenOf(run: Run, name: string): RunToken {
  const token = run.byName.get(name);
  if (!token) throw new Error(`${run.theme}/${run.mode}: no ${name}`);
  return token;
}

export function themeOut(run: Run, roles: RoleMap): ThemeOut {
  const colors: Record<string, ColorOut> = {};
  for (const t of run.tokens) {
    const [name] = t.path;
    if (t.type === 'color' && t.path.length === 1 && name !== undefined) {
      colors[camel(name)] = colorOut(t.value as DtcgColor);
    }
  }
  const m3 = m3For(run, roles);
  const m3Out = {} as Record<M3Role, ColorOut>;
  for (const role of M3_ROLES) m3Out[role] = colorOut(m3[role]);
  const px = (name: string) => {
    const d = tokenOf(run, name).value as DtcgDimension;
    return round6(d.unit === 'rem' ? d.value * 16 : d.value);
  };
  const font = (name: string) => [...(tokenOf(run, name).value as string[])];
  return {
    colors,
    m3: m3Out,
    radius: {
      base: px('--radius-base'),
      sm: px('--radius-sm'),
      md: px('--radius-md'),
      lg: px('--radius-lg'),
      xl: px('--radius-xl'),
    },
    fontFamily: {
      sans: font('--font-sans'),
      serif: font('--font-serif'),
      mono: font('--font-mono'),
    },
  };
}

/** Theme ids become Kotlin and Swift identifiers, so they must be one. */
const THEME_ID = /^[a-z][A-Za-z0-9]*$/;

export function buildPlatformModel(
  runs: Map<string, Run>,
  roles: RoleMap,
  themes: readonly ThemeId[],
  version: string,
): PlatformModel {
  const m3Sources = {} as Record<M3Role, string>;
  for (const role of M3_ROLES) {
    const s = roles[role];
    m3Sources[role] = s.kind === 'semantic' ? `--${s.token}` : 'derived';
  }
  const out: PlatformModel['themes'] = {};
  for (const theme of themes) {
    if (!THEME_ID.test(theme)) {
      throw new Error(
        `Theme id "${theme}" must match ${THEME_ID.source}: the Kotlin and Swift outputs use it as an identifier`,
      );
    }
    const byMode = {} as Record<Mode, ThemeOut>;
    for (const mode of MODES) {
      const run = runs.get(`${theme}/${mode}`);
      if (!run) throw new Error(`No run for ${theme}/${mode}`);
      byMode[mode] = themeOut(run, roles);
    }
    out[theme] = byMode;
  }
  return {
    version,
    themeNames: [...themes],
    m3Roles: M3_ROLES,
    m3Sources,
    themes: out,
  };
}

/** The light colours of the first theme: every theme carries the same names. */
export function colorNames(model: PlatformModel): string[] {
  const [first] = model.themeNames;
  const theme = first === undefined ? undefined : model.themes[first];
  if (!theme) throw new Error('The platform model has no theme');
  return Object.keys(theme.light.colors);
}

export function themeModes(
  model: PlatformModel,
  theme: string,
): Record<Mode, ThemeOut> {
  const modes = model.themes[theme];
  if (!modes) throw new Error(`The platform model has no theme ${theme}`);
  return modes;
}

/** A Kotlin or Swift identifier for a theme and mode: purpleDark. */
export const schemeId = (theme: string, mode: Mode): string =>
  `${theme}${mode.charAt(0).toUpperCase()}${mode.slice(1)}`;
