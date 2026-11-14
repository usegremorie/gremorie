import Color from 'colorjs.io';
import { describe, expect, it } from 'vitest';
import { deltaEOK } from '../pipeline/color.ts';
import type { DtcgColor } from '../pipeline/model.ts';
import { runTheme, type Run, type RunToken } from '../pipeline/run.ts';
import { loadSource } from '../pipeline/source.ts';
import { PACKAGE_ROOT } from './support/paths.ts';

/** The Purple preset of Fumadocs (MIT), verbatim. */
const PRESET = {
  light: {
    background: 'hsl(256 100% 96%)',
    foreground: 'hsl(256 60% 26%)',
    primary: 'hsl(270 100% 52%)',
    'primary-foreground': 'hsl(270 100% 20%)',
    secondary: 'hsl(270 60% 90%)',
    'secondary-foreground': 'hsl(256 60% 10%)',
    muted: 'hsl(256 60% 94%)',
    'muted-foreground': 'hsl(256 50% 50%)',
    accent: 'hsl(270 40% 88%)',
    'accent-foreground': 'hsl(270 100% 20%)',
    card: 'hsl(256 60% 92%)',
    'card-foreground': 'hsl(256 100% 20%)',
    popover: 'hsl(256 60% 96%)',
    'popover-foreground': 'hsl(256 100% 20%)',
    border: 'hsl(270 40% 80% / 0.5)',
    ring: 'hsl(270 100% 52%)',
  },
  dark: {
    background: 'hsl(256 20% 6%)',
    foreground: 'hsl(256 60% 90%)',
    primary: 'hsl(270 100% 86%)',
    'primary-foreground': 'hsl(256 60% 6%)',
    secondary: 'hsl(270 23% 20%)',
    'secondary-foreground': 'hsl(256 60% 90%)',
    muted: 'hsl(256 23% 10%)',
    'muted-foreground': 'hsl(256 50% 75%)',
    accent: 'hsl(256 23% 22%)',
    'accent-foreground': 'hsl(270 40% 86%)',
    card: 'hsl(256 23% 10%)',
    'card-foreground': 'hsl(256 60% 90%)',
    popover: 'hsl(256 23% 6%)',
    'popover-foreground': 'hsl(256 60% 90%)',
    border: 'hsl(270 50% 40% / 0.3)',
    ring: 'hsl(270 100% 86%)',
  },
} as const;

/** The pair corrected on purpose for contrast; see the purple.json $description. */
const CORRECTED: Record<string, Record<string, string>> = {
  light: { 'primary-foreground': 'hsl(270 100% 98%)' },
};

const source = loadSource(PACKAGE_ROOT);

const token = (run: Run, name: string): RunToken => {
  const found = run.byName.get(name);
  if (!found) throw new Error(`${name} is missing from the run`);
  return found;
};

describe('purple matches the Fumadocs Purple preset', () => {
  for (const mode of ['light', 'dark'] as const) {
    it(`${mode}: every value within ΔE OK 0.005 of the preset`, async () => {
      const { run } = await runTheme(source, 'purple', mode);
      for (const [name, hsl] of Object.entries(PRESET[mode])) {
        const expected = CORRECTED[mode]?.[name] ?? hsl;
        const value = token(run, `--${name}`).value as DtcgColor;
        const reference = new Color(expected);
        expect(deltaEOK(value, reference), `${mode} ${name}`).toBeLessThan(
          0.005,
        );
        expect(value.alpha ?? 1).toBeCloseTo(Number(reference.alpha), 6);
      }
    });
  }

  it('fixes the dark destructive pair with gray-950', async () => {
    const { run } = await runTheme(source, 'purple', 'dark');
    const fg = token(run, '--destructive-foreground');
    expect(fg.layer).toBe('theme-dark');
    expect(fg.original).toBe('{color.gray.950}');
  });

  it('paints the sidebar from its own surfaces, not the gray base', async () => {
    const { run } = await runTheme(source, 'purple', 'light');
    expect(token(run, '--sidebar').value).toEqual(
      token(run, '--background').value,
    );
    expect(token(run, '--sidebar-primary').value).toEqual(
      token(run, '--primary').value,
    );
  });
});
