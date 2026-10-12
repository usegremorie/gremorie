import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { compareCss, type IntentionalChange } from '../pipeline/compare.ts';
import { PACKAGE_ROOT, REFERENCE_DIR } from './support/paths.ts';

const read = (p: string) => readFileSync(p, 'utf8');
const cssFiles = (dir: string) =>
  readdirSync(dir)
    .filter((f) => f.endsWith('.css'))
    .sort();

/** Themes created after 0.8.0: nothing to regress, so they may be extra. */
const NEW_THEMES: string[] = [];

const intentional = JSON.parse(
  read(join(PACKAGE_ROOT, 'reference', 'intentional-changes.json')),
) as IntentionalChange[];
const styles = join(PACKAGE_ROOT, 'styles');
const referenceThemes = cssFiles(join(REFERENCE_DIR, 'themes'));

describe('zero regression against the 0.8.0 CSS', () => {
  it('theme.css keeps every selector, token value and non-token rule', () => {
    expect(
      compareCss(
        'theme.css',
        read(join(REFERENCE_DIR, 'theme.css')),
        read(join(styles, 'theme.css')),
        {
          allowExtraImports: NEW_THEMES.map((t) => `./themes/${t}.css`),
          intentional,
        },
      ),
    ).toEqual([]);
  });

  it.each(referenceThemes)('themes/%s keeps every token value', (file) => {
    expect(
      compareCss(
        `themes/${file}`,
        read(join(REFERENCE_DIR, 'themes', file)),
        read(join(styles, 'themes', file)),
        { intentional },
      ),
    ).toEqual([]);
  });

  it('ships every 0.8.0 theme file, plus only the new themes', () => {
    expect(cssFiles(join(styles, 'themes'))).toEqual(
      [...referenceThemes, ...NEW_THEMES.map((t) => `${t}.css`)].sort(),
    );
  });
});
