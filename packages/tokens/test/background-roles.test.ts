import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import tailwind from '@tailwindcss/postcss';
import postcss from 'postcss';
import { describe, expect, it } from 'vitest';
import { PACKAGE_ROOT } from './support/paths.ts';

const css = readFileSync(join(PACKAGE_ROOT, 'styles', 'theme.css'), 'utf8');

/** Bodies of every top-level rule whose selector is exactly `selector`. */
function block(selector: string): string {
  const bodies: string[] = [];
  let from = 0;
  for (;;) {
    const start = css.indexOf(`\n${selector} {`, from);
    if (start < 0) break;
    const open = css.indexOf('{', start);
    let depth = 0;
    for (let i = open; i < css.length; i++) {
      if (css[i] === '{') depth++;
      if (css[i] === '}' && --depth === 0) {
        bodies.push(css.slice(open + 1, i));
        from = i;
        break;
      }
    }
  }
  if (!bodies.length) throw new Error(`no ${selector} block`);
  return bodies.join('\n');
}

const decl = (body: string, prop: string) =>
  new RegExp(`${prop}:\\s*([^;]+);`)
    .exec(body)?.[1]
    ?.replace(/\s+/g, ' ')
    .replace(/\( /g, '(')
    .replace(/ \)/g, ')')
    .trim();

const ALPHA_STEPS = [3, 5, 8, 10, 12, 15, 20, 30, 40, 60];

describe('background roles', () => {
  it('ships black and white alpha primitives', () => {
    const theme = block('@theme');
    for (const n of ALPHA_STEPS) {
      expect(decl(theme, `--color-black-a${n}`)).toBe(
        `oklch(0 0 0 / ${n / 100})`,
      );
      expect(decl(theme, `--color-white-a${n}`)).toBe(
        `oklch(1 0 0 / ${n / 100})`,
      );
    }
  });

  it('defines --selected: gray-0 light, gray-700 dark', () => {
    expect(decl(block(':root'), '--selected')).toBe('var(--color-gray-0)');
    expect(decl(block('.dark'), '--selected')).toBe('var(--color-gray-700)');
  });

  it('defines --edge: black-a5 light, white-a10 dark', () => {
    expect(decl(block(':root'), '--edge')).toBe('var(--color-black-a5)');
    expect(decl(block('.dark'), '--edge')).toBe('var(--color-white-a10)');
  });

  it('puts dark text on the light dark-mode destructive fill', () => {
    expect(decl(block(':root'), '--destructive-foreground')).toBe(
      'var(--color-gray-50)',
    );
    expect(decl(block('.dark'), '--destructive-foreground')).toBe(
      'var(--color-gray-950)',
    );
  });

  it('keeps solid neutral fills by default', () => {
    for (const t of ['secondary', 'muted', 'accent']) {
      expect(decl(block(':root'), `--${t}`)).toBe('var(--color-gray-100)');
      expect(decl(block('.dark'), `--${t}`)).toBe('var(--color-gray-800)');
    }
  });

  it('sets the hover math: darken on light, lighten on dark', () => {
    expect(decl(block('html'), '--hover-shift')).toBe('-0.05');
    expect(decl(block('html'), '--hover-opacity')).toBe('1.8');
    expect(decl(block(':is(.dark)'), '--hover-shift')).toBe('0.05');
  });

  it('wires derived hover colours and the field alias for Tailwind', () => {
    const wiring = block('@theme inline');
    for (const t of ['primary', 'secondary', 'destructive']) {
      expect(decl(wiring, `--color-${t}-hover`)).toBe(
        `oklch(from var(--${t}) calc(l + var(--hover-shift)) c h / calc(alpha * var(--hover-opacity)))`,
      );
    }
    expect(decl(wiring, '--color-field')).toBe(
      'color-mix(in oklab, var(--input) 30%, transparent)',
    );
    expect(decl(wiring, '--color-field-hover')).toBe(
      'oklch(from color-mix(in oklab, var(--input) 30%, transparent) calc(l + var(--hover-shift)) c h / calc(alpha * var(--hover-opacity)))',
    );
    expect(decl(wiring, '--color-selected')).toBe('var(--selected)');
    expect(decl(wiring, '--color-edge')).toBe('var(--edge)');
  });

  it('Tailwind keeps the derived hover colour as relative colour syntax', async () => {
    const source = `@import 'tailwindcss' source(none);
@import '${join(PACKAGE_ROOT, 'styles', 'theme.css')}';
@source inline("hover:bg-primary-hover hover:bg-field-hover bg-selected ring-edge");`;
    const out = (
      await postcss([tailwind()]).process(source, {
        from: join(PACKAGE_ROOT, 'test', 'fixtures', 'roles.css'),
      })
    ).css;
    expect(out).toMatch(/oklch\(\s*from var\(--primary\)/);
    expect(out).toMatch(/\.bg-selected/);
    expect(out).toMatch(/\.ring-edge/);
  });
});
