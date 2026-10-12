import { Hct } from '@material/material-color-utilities';
import { describe, expect, it } from 'vitest';
import { argbOf, contrastRatio, fromArgb, toHex } from '../pipeline/color.ts';
import { loadDeviations, matches } from '../pipeline/contrast.ts';
import {
  deriveScheme,
  loadRoleMap,
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

  it('maps exactly 15 roles to semantics and derives the other 33', () => {
    const mapped = M3_ROLES.filter((r) => roles[r].kind === 'semantic');
    expect(mapped).toEqual([
      'primary',
      'onPrimary',
      'secondary',
      'onSecondary',
      'tertiary',
      'onTertiary',
      'background',
      'onBackground',
      'surface',
      'onSurface',
      'surfaceVariant',
      'onSurfaceVariant',
      'surfaceTint',
      'error',
      'onError',
    ]);
  });

  it('refuses a map that misses a role or names an unknown one', () => {
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
  for (const [key, run] of runs) {
    it(`${key}: every on-pair reaches 4.5:1 or is a listed deviation`, () => {
      const m3 = m3For(run, roles);
      const page = m3.background;
      for (const [container, content] of M3_ON_PAIRS) {
        const ratio = Number(
          contrastRatio(m3[content], m3[container], page).toFixed(2),
        );
        if (ratio >= 4.5) continue;
        const background = toSemantic(container) ?? container;
        const foreground = toSemantic(content) ?? content;
        const listed = deviations.some((d) =>
          matches(d, {
            theme: run.theme,
            mode: run.mode,
            background,
            foreground,
          }),
        );
        expect(listed, `${key} ${content} on ${container} is ${ratio}:1`).toBe(
          true,
        );
      }
    });
  }

  it('purple has no M3 deviation', () => {
    expect(deviations.filter((d) => d.theme === 'purple')).toEqual([]);
  });
});
