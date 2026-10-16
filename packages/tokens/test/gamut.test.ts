import Color from 'colorjs.io';
import { describe, expect, it } from 'vitest';
import { toColorJs, toHex } from '../pipeline/color.ts';
import type { DtcgColor } from '../pipeline/model.ts';
import { runTheme } from '../pipeline/run.ts';
import { loadSource } from '../pipeline/source.ts';
import { PACKAGE_ROOT } from './support/paths.ts';

const hueShift = (a: number, b: number) =>
  Math.abs(((a - b + 540) % 360) - 180);
const back = (hex: string) => new Color(hex).to('oklch');
const clipped = (c: DtcgColor) =>
  back(
    toColorJs(c)
      .to('srgb')
      .toGamut({ method: 'clip' })
      .toString({ format: 'hex' }),
  );

const { run } = await runTheme(loadSource(PACKAGE_ROOT), 'default', 'light');
const outside = run.tokens.filter(
  (t) =>
    t.layer === 'primitive' &&
    t.type === 'color' &&
    !toColorJs(t.value as DtcgColor).inGamut('srgb'),
);

describe('gamut mapping for sRGB outputs', () => {
  it('finds primitives wider than sRGB to map', () => {
    expect(outside.length).toBeGreaterThan(50);
  });

  it.each(outside.map((t) => [t.name, t.value as DtcgColor] as const))(
    '%s stays close and never shifts hue more than plain clipping',
    (_name, color) => {
      const mapped = back(toHex(color));
      expect(mapped.deltaE(toColorJs(color), 'OK')).toBeLessThan(0.03);
      if (color.components[1] < 0.05) return;
      const ours = hueShift(mapped.coords[2] ?? 0, color.components[2]);
      const clip = hueShift(clipped(color).coords[2] ?? 0, color.components[2]);
      expect(ours).toBeLessThanOrEqual(clip + 0.01);
    },
  );

  it.each([
    [0.8, 0.3, 90],
    [0.7, 0.35, 145],
    [0.55, 0.35, 300],
  ] as const)(
    'keeps the hue of a far out-of-gamut oklch(%s %s %s)',
    (l, c, h) => {
      const color: DtcgColor = { colorSpace: 'oklch', components: [l, c, h] };
      const mapped = back(toHex(color));
      expect(hueShift(mapped.coords[2] ?? 0, h)).toBeLessThan(3);
      expect(Math.abs((mapped.coords[0] ?? 0) - l)).toBeLessThan(0.01);
    },
  );

  it('beats plain clipping where it matters: a saturated yellow', () => {
    const yellow: DtcgColor = {
      colorSpace: 'oklch',
      components: [0.8, 0.3, 90],
    };
    expect(hueShift(clipped(yellow).coords[2] ?? 0, 90)).toBeGreaterThan(10);
    expect(hueShift(back(toHex(yellow)).coords[2] ?? 0, 90)).toBeLessThan(3);
  });
});
