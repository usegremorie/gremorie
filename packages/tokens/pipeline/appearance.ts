/**
 * Generated half of the appearance presets (the hand-written half lives in
 * styles/partials/appearance.css):
 *
 *   - one rule per accent mapping the seed scale (--seed-50…950) onto that
 *     colour's primitive scale, plus a `custom` rule that derives the scale
 *     from a consumer-provided --seed;
 *   - the tonal rules: every neutral semantic token (one that points at a
 *     gray primitive) is rebuilt from the seed hue at the gray's own
 *     lightness, with chroma scaled by --tone. Primitives never change.
 */
import type { DtcgColor, DtcgGroup, DtcgToken } from './model.ts';
import { PRIMITIVE_FILES, SEMANTIC_FILES } from './model.ts';
import { formatColor } from './css-value.ts';
import type { TokenSource } from './source.ts';

export const ACCENTS = [
  'violet',
  'blue',
  'teal',
  'green',
  'orange',
  'rose',
  'red',
] as const;

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

/** Lightness and chroma factor of each step of a scale built from --seed. */
const CUSTOM: Record<(typeof STEPS)[number], [number, number]> = {
  50: [0.975, 0.12],
  100: [0.95, 0.22],
  200: [0.9, 0.42],
  300: [0.82, 0.65],
  400: [0.72, 0.9],
  500: [0.64, 1],
  600: [0.56, 1],
  700: [0.46, 0.85],
  800: [0.33, 0.6],
  900: [0.25, 0.45],
  950: [0.19, 0.35],
};

const TONAL = "[data-tonal='on']:not([data-accent='neutral'])";

const colorFile = (source: TokenSource) => {
  const key = Object.keys(PRIMITIVE_FILES).find((k) => k.endsWith('color.json'));
  const file = source.files[key!] as DtcgGroup;
  return ((file as Record<string, unknown>).color ?? file) as Record<
    string,
    Record<string, DtcgToken>
  >;
};

const grayStep = (value: unknown) =>
  typeof value === 'string' ? /^\{color\.gray\.(\d+)\}$/.exec(value)?.[1] : undefined;

/** CSS for a semantic value: a reference becomes var(), a colour is printed. */
const cssOf = (value: unknown): string =>
  typeof value === 'string'
    ? `var(--${value.slice(1, -1).replace(/^color\./, 'color-').replace(/\./g, '-')})`
    : formatColor(value as DtcgColor);

export function appearanceRules(source: TokenSource): string {
  const palette = colorFile(source);
  const gray = palette.gray!;
  const L = (step: string) =>
    ((gray[step]!.$value as DtcgColor).components[0] as number).toString();
  const tint = (step: string) =>
    `oklch(from var(--seed) ${L(step)} calc(c * var(--tone)) h)`;

  const out: string[] = [];
  for (const accent of ACCENTS) {
    out.push(
      `:root[data-accent='${accent}'] {`,
      ...STEPS.map((n) => `  --seed-${n}: var(--color-${accent}-${n});`),
      '  --seed: var(--seed-500);',
      '}',
    );
  }
  out.push(
    ":root[data-accent='custom'] {",
    ...STEPS.map(
      (n) =>
        `  --seed-${n}: oklch(from var(--seed) ${CUSTOM[n][0]} calc(c * ${CUSTOM[n][1]}) h);`,
    ),
    '}',
  );

  const light = source.files[SEMANTIC_FILES.light] as Record<string, DtcgToken>;
  const dark = source.files[SEMANTIC_FILES.dark] as Record<string, DtcgToken>;
  const lightProps = Object.entries(light).filter(([, t]) => grayStep(t.$value));
  out.push(`:root:where(${TONAL}) {`, '  --tone: 0.06;');
  for (const [name, t] of lightProps) {
    out.push(`  --${name}: ${tint(grayStep(t.$value)!)};`);
  }
  out.push('}');

  // In dark the light rule still matches, so the dark rule redeclares every
  // token it set: tinted when dark also points at a gray, its own dark value
  // otherwise.
  const darkNames = new Set([
    ...lightProps.map(([n]) => n),
    ...Object.entries(dark)
      .filter(([, t]) => grayStep(t.$value))
      .map(([n]) => n),
  ]);
  out.push(`.dark:where(${TONAL}) {`);
  for (const name of darkNames) {
    const value = (dark[name] ?? light[name])!.$value;
    const step = grayStep(value);
    out.push(`  --${name}: ${step ? tint(step) : cssOf(value)};`);
  }
  out.push('}');
  return out.join('\n');
}
