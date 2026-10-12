import {
  Hct,
  SchemeContent,
  type TonalPalette,
} from '@material/material-color-utilities';
import { describe, expect, it } from 'vitest';
import { argbOf, contrastRatio, fromArgb, toHex } from '../pipeline/color.ts';
import { loadDeviations, matches } from '../pipeline/contrast.ts';
import {
  deriveScheme,
  loadRoleMap,
  M3_GRAPHIC_PAIRS,
  M3_ON_PAIRS,
  M3_ROLES,
  m3For,
  parseRoleMap,
  PRIMARY_FAMILY,
  type M3Role,
} from '../pipeline/m3.ts';
import type { DtcgColor } from '../pipeline/model.ts';
import { runAll, type Run } from '../pipeline/run.ts';
import { loadSource } from '../pipeline/source.ts';
import { PACKAGE_ROOT } from './support/paths.ts';

const COMPOSE_ROLES =
  'primary onPrimary primaryContainer onPrimaryContainer inversePrimary secondary onSecondary secondaryContainer onSecondaryContainer tertiary onTertiary tertiaryContainer onTertiaryContainer background onBackground surface onSurface surfaceVariant onSurfaceVariant surfaceTint inverseSurface inverseOnSurface error onError errorContainer onErrorContainer outline outlineVariant scrim surfaceBright surfaceContainer surfaceContainerHigh surfaceContainerHighest surfaceContainerLow surfaceContainerLowest surfaceDim primaryFixed primaryFixedDim onPrimaryFixed onPrimaryFixedVariant secondaryFixed secondaryFixedDim onSecondaryFixed onSecondaryFixedVariant tertiaryFixed tertiaryFixedDim onTertiaryFixed onTertiaryFixedVariant'.split(
    ' ',
  );

const roles = loadRoleMap(PACKAGE_ROOT);
const runs = await runAll(loadSource(PACKAGE_ROOT));

const tokenValue = (run: Run, name: string) => {
  const token = run.byName.get(`--${name}`);
  if (!token) throw new Error(`${run.theme}/${run.mode}: no --${name}`);
  return token.value;
};

describe('the role list', () => {
  it('is the 48 parameters of Compose lightColorScheme, in order', () => {
    expect([...M3_ROLES]).toEqual(COMPOSE_ROLES);
  });

  it('maps exactly 12 roles to semantics and derives the other 36', () => {
    const mapped = M3_ROLES.filter((r) => roles[r].kind === 'semantic');
    expect(mapped).toEqual([
      'primary',
      'onPrimary',
      'secondaryContainer',
      'onSecondaryContainer',
      'background',
      'onBackground',
      'surface',
      'onSurface',
      'surfaceVariant',
      'surfaceTint',
      'error',
      'onError',
    ]);
  });

  it('refuses a map that misses a role or names an unknown one', () => {
    expect(() => parseRoleMap(null)).toThrow(/^roles\.json: /);
    expect(() => parseRoleMap([])).toThrow(/^roles\.json: /);
    expect(() => parseRoleMap({ roles: { primary: '{primary}' } })).toThrow(
      /missing/,
    );
    expect(() =>
      parseRoleMap({
        roles: {
          ...Object.fromEntries(M3_ROLES.map((r) => [r, 'derived'])),
          shadow: 'derived',
        },
      }),
    ).toThrow(/unknown/);
    expect(() =>
      parseRoleMap({
        roles: {
          ...Object.fromEntries(M3_ROLES.map((r) => [r, 'derived'])),
          primary: 'primary',
        },
      }),
    ).toThrow(/alias or "derived"/);
  });
});

describe('ARGB round trip', () => {
  it('keeps the 8-bit colour', () => {
    const argb = 0xff850aff;
    expect(argbOf(fromArgb(argb)) >>> 0).toBe(argb);
    expect(toHex(fromArgb(argb))).toBe('#850aff');
  });
});

describe('derivation from the theme primary', () => {
  const purple: DtcgColor = {
    colorSpace: 'oklch',
    components: [0.5379, 0.2912, 295.26],
  };

  it.each([
    [false, 90, 10],
    [true, 30, 90],
  ] as const)(
    'takes containers at the M3 baseline tones (dark %s: %i, content %i)',
    (dark, container, content) => {
      const scheme = deriveScheme(purple, dark);
      const mcu = new SchemeContent(Hct.fromInt(argbOf(purple)), dark, 0);
      const tone = (palette: TonalPalette, t: number) =>
        toHex(fromArgb(palette.tone(t)));
      const families = [
        ['primary', mcu.primaryPalette],
        ['secondary', mcu.secondaryPalette],
        ['tertiary', mcu.tertiaryPalette],
        ['error', mcu.errorPalette],
      ] as const;
      for (const [family, palette] of families) {
        const on = `on${family[0]?.toUpperCase()}${family.slice(1)}Container`;
        expect(toHex(scheme[`${family}Container`]), family).toBe(
          tone(palette, container),
        );
        expect(toHex(scheme[on as M3Role]), on).toBe(tone(palette, content));
      }
    },
  );

  it('fills every role from MCU SchemeContent', () => {
    const scheme = deriveScheme(
      { colorSpace: 'oklch', components: [0.5379, 0.2912, 295.26] },
      false,
    );
    for (const role of M3_ROLES) expect(scheme[role].colorSpace).toBe('oklch');
  });

  for (const [key, run] of runs) {
    it(`${key}: 48 roles, mapped ones equal to their semantic token`, () => {
      const m3 = m3For(run, roles);
      expect(Object.keys(m3).sort()).toEqual([...M3_ROLES].sort());
      for (const role of M3_ROLES) {
        const source = roles[role];
        if (source.kind === 'semantic') {
          expect(m3[role], role).toEqual(tokenValue(run, source.token));
        }
      }
    });

    it(`${key}: no container repeats its accent colour`, () => {
      const m3 = m3For(run, roles);
      for (const family of ['primary', 'tertiary', 'error'] as const) {
        expect(toHex(m3[`${family}Container`]), family).not.toBe(
          toHex(m3[family]),
        );
      }
    });

    it(`${key}: the primary family keeps the hue of the theme primary`, () => {
      const m3 = m3For(run, roles);
      const seed = Hct.fromInt(argbOf(tokenValue(run, 'primary') as DtcgColor));
      if (seed.chroma < 8) return; // a gray primary has no hue to keep
      for (const role of PRIMARY_FAMILY) {
        const hct = Hct.fromInt(argbOf(m3[role]));
        if (hct.chroma < 8) continue; // near-white or near-black content has no hue to keep
        const diff = Math.abs(((hct.hue - seed.hue + 540) % 360) - 180);
        expect(diff, `${role} hue ${hct.hue} vs seed ${seed.hue}`).toBeLessThan(
          5,
        );
      }
    });
  }
});

describe('M3 contrast (each onX reaches AA on X)', () => {
  const deviations = loadDeviations(PACKAGE_ROOT);
  const toSemantic = (role: M3Role) => {
    const s = roles[role];
    return s.kind === 'semantic' ? s.token : null;
  };
  const listed = (run: Run, container: M3Role, content: M3Role) =>
    deviations.some((d) =>
      matches(d, {
        theme: run.theme,
        mode: run.mode,
        background: toSemantic(container) ?? container,
        foreground: toSemantic(content) ?? content,
      }),
    );
  const groups = [
    ['text', M3_ON_PAIRS, 4.5],
    ['graphic', M3_GRAPHIC_PAIRS, 3],
  ] as const;

  it('guards the surfaces, the fixed roles and the inverse roles', () => {
    const has = (pairs: typeof M3_ON_PAIRS, a: M3Role, b: M3Role) =>
      pairs.some(([x, y]) => x === a && y === b);
    for (const level of [
      'surfaceContainerLowest',
      'surfaceContainerLow',
      'surfaceContainer',
      'surfaceContainerHigh',
      'surfaceContainerHighest',
    ] as const) {
      expect(has(M3_ON_PAIRS, level, 'onSurface'), level).toBe(true);
      expect(has(M3_ON_PAIRS, level, 'onSurfaceVariant'), level).toBe(true);
    }
    for (const family of ['primary', 'secondary', 'tertiary'] as const) {
      const f = `${family.charAt(0).toUpperCase()}${family.slice(1)}`;
      for (const fill of [`${family}Fixed`, `${family}FixedDim`]) {
        for (const on of [`on${f}Fixed`, `on${f}FixedVariant`]) {
          expect(has(M3_ON_PAIRS, fill as M3Role, on as M3Role), on).toBe(true);
        }
      }
    }
    expect(has(M3_ON_PAIRS, 'inverseSurface', 'inverseOnSurface')).toBe(true);
    expect(has(M3_ON_PAIRS, 'surfaceBright', 'onSurface')).toBe(true);
    expect(has(M3_ON_PAIRS, 'surfaceDim', 'onSurface')).toBe(true);
    expect(has(M3_GRAPHIC_PAIRS, 'inverseSurface', 'inversePrimary')).toBe(
      true,
    );
    expect(has(M3_GRAPHIC_PAIRS, 'surface', 'outline')).toBe(true);
  });

  for (const [key, run] of runs) {
    it(`${key}: every pair reaches its minimum or is a listed deviation`, () => {
      const m3 = m3For(run, roles);
      const page = m3.background;
      for (const [kind, pairs, min] of groups) {
        for (const [container, content] of pairs) {
          const ratio = contrastRatio(m3[content], m3[container], page);
          if (ratio >= min) continue;
          expect(
            listed(run, container, content),
            `${key} ${kind} ${content} on ${container} is ${ratio.toFixed(3)}:1`,
          ).toBe(true);
        }
      }
    });
  }

  it('purple has no Material-only deviation', () => {
    expect(
      deviations.filter((d) => d.theme === 'purple' && d.scheme === 'm3'),
    ).toEqual([]);
  });
});
