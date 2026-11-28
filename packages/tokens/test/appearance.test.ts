import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { contrastRatio } from '../pipeline/color.ts';
import type { DtcgColor } from '../pipeline/model.ts';
import { PACKAGE_ROOT } from './support/paths.ts';

const css = readFileSync(join(PACKAGE_ROOT, 'styles', 'theme.css'), 'utf8');
const primitives = JSON.parse(
  readFileSync(join(PACKAGE_ROOT, 'tokens', 'primitive', 'color.json'), 'utf8'),
);
const palette = (primitives.color ?? primitives) as Record<
  string,
  Record<string, { $value: DtcgColor }>
>;

/** Bodies of every top-level rule whose selector is exactly `selector`. */
function block(selector: string, source = css): string {
  const bodies: string[] = [];
  let from = 0;
  for (;;) {
    const start = source.indexOf(`\n${selector} {`, from);
    if (start < 0) break;
    const open = source.indexOf('{', start);
    let depth = 0;
    for (let i = open; i < source.length; i++) {
      if (source[i] === '{') depth++;
      if (source[i] === '}' && --depth === 0) {
        bodies.push(source.slice(open + 1, i));
        from = i;
        break;
      }
    }
  }
  if (!bodies.length) throw new Error(`no ${selector} block`);
  return bodies.join('\n');
}

const decl = (body: string, prop: string) =>
  new RegExp(`(?:^|[;{\\s])${prop}:\\s*([^;]+);`)
    .exec(body)?.[1]
    ?.replace(/\s+/g, ' ')
    .replace(/\( /g, '(')
    .replace(/ \)/g, ')')
    .trim();

const props = (body: string) =>
  [...body.matchAll(/(--[\w-]+):/g)].map((m) => m[1]!).sort();

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const ACCENTS = ['violet', 'blue', 'teal', 'green', 'orange', 'rose', 'red'];
const ACCENTED = ":root[data-accent]:not([data-accent='neutral'])";
const ACCENTED_DARK = ".dark[data-accent]:not([data-accent='neutral'])";
const IMMERSIVE = ":root[data-translucency='immersive']";
const IMMERSIVE_DARK = ".dark[data-translucency='immersive']";
const TONAL = ":root:where([data-tonal='on'][data-accent]:not([data-accent='neutral']))";
const TONAL_DARK = ".dark:where([data-tonal='on'][data-accent]:not([data-accent='neutral']))";

describe('appearance: accent', () => {
  it('maps each accent to its primitive scale', () => {
    for (const a of ACCENTS) {
      const body = block(`:root[data-accent='${a}']`);
      for (const n of STEPS) {
        expect(decl(body, `--seed-${n}`)).toBe(`var(--color-${a}-${n})`);
      }
      expect(decl(body, '--seed')).toBe('var(--seed-500)');
    }
  });

  it('builds a custom scale from --seed', () => {
    const body = block(":root[data-accent='custom']");
    expect(decl(body, '--seed-500')).toBe(
      'oklch(from var(--seed) 0.64 calc(c * 1) h)',
    );
    expect(decl(body, '--seed-950')).toBe(
      'oklch(from var(--seed) 0.19 calc(c * 0.35) h)',
    );
  });

  it('moves only primary and what follows it: 600 light, 500 dark', () => {
    const light = block(ACCENTED);
    expect(decl(light, '--primary')).toBe('var(--seed-600)');
    for (const p of ['--ring', '--switch-checked', '--sidebar-primary', '--sidebar-ring']) {
      expect(decl(light, p)).toBe('var(--primary)');
    }
    expect(decl(block(ACCENTED_DARK), '--primary')).toBe('var(--seed-500)');
    expect(css.indexOf(`\n${ACCENTED_DARK} {`)).toBeGreaterThan(
      css.indexOf(`\n${ACCENTED} {`),
    );
  });

  it('keeps primary text at 4.5:1 or more on every accent, both modes', () => {
    const fg = decl(block(ACCENTED), '--primary-foreground') ?? '';
    const threshold = Number(/clamp\(0, \(([\d.]+) - l\)/.exec(fg)?.[1]);
    expect(threshold).toBeGreaterThan(0);
    for (const a of ACCENTS) {
      for (const step of ['600', '500']) {
        const primary = palette[a]![step]!.$value;
        const l = primary.components[0] as number;
        const text: DtcgColor = {
          colorSpace: 'oklch',
          components: [l < threshold ? 1 : 0, 0, 0],
        };
        expect(
          contrastRatio(text, primary),
          `${a}-${step} with ${l < threshold ? 'white' : 'black'} text`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});

describe('appearance: neutral seed', () => {
  it('gives neutral (no data-accent) a gray seed scale, below every accent', () => {
    // Immersive and anything else reading --seed-* must never resolve to
    // nothing on the default accent.
    const body = block(':where(:root)');
    for (const n of STEPS) {
      expect(decl(body, `--seed-${n}`)).toBe(`var(--color-gray-${n})`);
    }
    expect(decl(body, '--seed')).toBe('var(--seed-500)');
  });
});

describe('appearance: translucency', () => {
  it('solid paints floating surfaces opaque, without blur', () => {
    const body = block(":root[data-translucency='solid']");
    expect(decl(body, '--surface-opacity')).toBe('100%');
    expect(decl(body, '--surface-backdrop')).toBe('none');
  });

  it('keeps data-menu="solid" as an alias', () => {
    expect(decl(block(":root[data-menu='solid']"), '--surface-opacity')).toBe(
      '100%',
    );
  });

  it('immersive dark: white 5% card, menu on the 950 step at 70%', () => {
    const body = block(IMMERSIVE_DARK);
    expect(decl(body, '--card')).toBe('var(--color-white-a5)');
    expect(decl(body, '--popover')).toBe('var(--seed-950)');
    expect(decl(body, '--surface-opacity')).toBe('70%');
    expect(decl(body, '--background')).toBe('var(--seed-900)');
    expect(decl(block(IMMERSIVE), '--background')).toBe('var(--seed-100)');
  });

  it('immersive dark redeclares every token immersive light sets', () => {
    const light = props(block(IMMERSIVE));
    const dark = props(block(IMMERSIVE_DARK));
    expect(light.filter((p) => !dark.includes(p))).toEqual([]);
  });

  it('reduced transparency wins over immersive', () => {
    const at = css.indexOf('@media (prefers-reduced-transparency: reduce)', css.indexOf(IMMERSIVE));
    expect(at).toBeGreaterThan(css.indexOf(`\n${IMMERSIVE_DARK} {`));
    expect(css.slice(at, at + 600)).toMatch(/--surface-opacity:\s*100%/);
  });
});

describe('appearance: tonal', () => {
  it('tints neutrals from the seed hue, keeping their lightness', () => {
    const gray50 = palette.gray!['50']!.$value.components[0];
    expect(decl(block(TONAL), '--background')).toBe(
      `oklch(from var(--seed) ${gray50} calc(c * var(--tone)) h)`,
    );
    expect(decl(block(TONAL), '--tone')).toBe('0.06');
  });

  it('never applies with the neutral accent, nor without an accent', () => {
    expect(css).not.toMatch(/\n:root\[data-tonal='on'\] \{/);
    for (const rule of css.matchAll(/\n([^\n{]*data-tonal[^\n{]*) \{/g)) {
      expect(rule[1]).toContain("[data-accent]:not([data-accent='neutral'])");
    }
  });

  it('dark tonal covers every token light tonal sets', () => {
    // --tone is set once: the light rule also matches in dark.
    const light = props(block(TONAL)).filter((p) => p !== '--tone');
    const dark = props(block(TONAL_DARK));
    expect(light.filter((p) => !dark.includes(p))).toEqual([]);
  });

  it('stays below immersive: lower specificity than the immersive rule', () => {
    // :root:where(...) is (0,1,0); the immersive rule is (0,2,0).
    expect(css).toContain(`\n${TONAL} {`);
  });
});

describe('appearance: primitives', () => {
  it('never redeclares a primitive inside an appearance rule', () => {
    const rules = [...css.matchAll(/\n([^\n{]*data-(?:accent|translucency|tonal)[^\n{]*) \{/g)];
    expect(rules.length).toBeGreaterThan(5);
    for (const [, selector] of rules) {
      const body = block(selector!);
      expect(props(body).filter((p) => p.startsWith('--color-'))).toEqual([]);
    }
  });
});
