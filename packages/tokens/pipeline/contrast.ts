import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { contrastRatio } from './color.ts';
import type { DtcgColor, Mode, ThemeId } from './model.ts';
import type { Run } from './run.ts';

/** Text on a fill: WCAG 2.2 1.4.3, 4.5:1. */
export const TEXT_PAIRS = [
  ['background', 'foreground'],
  ['card', 'card-foreground'],
  ['popover', 'popover-foreground'],
  ['primary', 'primary-foreground'],
  ['secondary', 'secondary-foreground'],
  ['muted', 'muted-foreground'],
  ['accent', 'accent-foreground'],
  ['destructive', 'destructive-foreground'],
  ['success', 'success-foreground'],
  ['warning', 'warning-foreground'],
  ['sidebar', 'sidebar-foreground'],
  ['sidebar-primary', 'sidebar-primary-foreground'],
  ['sidebar-accent', 'sidebar-accent-foreground'],
  ['background', 'muted-foreground'],
  ['card', 'muted-foreground'],
] as const;

/** A component boundary on the page: WCAG 2.2 1.4.11, 3:1. */
export const GRAPHIC_PAIRS = [['background', 'ring']] as const;

export interface ContrastResult {
  theme: ThemeId;
  mode: Mode;
  background: string;
  foreground: string;
  kind: 'text' | 'graphic';
  ratio: number;
  min: number;
}

export interface Deviation {
  theme: string;
  mode: Mode;
  background: string;
  foreground: string;
  ratio: number;
  reason: string;
  /** 'm3' for a Material role pair; absent for a semantic pair. */
  scheme?: 'm3';
}

export function checkContrast(run: Run): ContrastResult[] {
  const color = (name: string): DtcgColor => {
    const t = run.byName.get(`--${name}`);
    if (!t || t.type !== 'color') {
      throw new Error(`${run.theme}/${run.mode}: --${name} is not a colour`);
    }
    return t.value as DtcgColor;
  };
  const page = color('background');
  const measure = (
    pairs: readonly (readonly [string, string])[],
    kind: 'text' | 'graphic',
    min: number,
  ): ContrastResult[] =>
    pairs.map(([background, foreground]) => ({
      theme: run.theme,
      mode: run.mode,
      background,
      foreground,
      kind,
      ratio: Number(
        contrastRatio(color(foreground), color(background), page).toFixed(2),
      ),
      min,
    }));
  return [
    ...measure(TEXT_PAIRS, 'text', 4.5),
    ...measure(GRAPHIC_PAIRS, 'graphic', 3),
  ];
}

export function loadDeviations(root: string): Deviation[] {
  const file = JSON.parse(
    readFileSync(join(root, 'contrast-deviations.json'), 'utf8'),
  ) as { deviations: Deviation[] };
  return file.deviations;
}

export const matches = (
  d: Deviation,
  r: { theme: string; mode: Mode; background: string; foreground: string },
): boolean =>
  d.theme === r.theme &&
  d.mode === r.mode &&
  d.background === r.background &&
  d.foreground === r.foreground;
