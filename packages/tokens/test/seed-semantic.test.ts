import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { seedSemantic } from '../pipeline/seed/from-css.ts';
import { REFERENCE_DIR } from './support/paths.ts';

const { light, dark } = seedSemantic(
  readFileSync(join(REFERENCE_DIR, 'theme.css'), 'utf8'),
);

describe('seedSemantic', () => {
  it('turns var() into DTCG aliases, flat by property name', () => {
    expect(light.background).toEqual({
      $type: 'color',
      $value: '{color.gray.50}',
      $description: '2. SEMANTICS',
    });
    expect(light['card-foreground']).toMatchObject({
      $type: 'color',
      $value: '{foreground}',
    });
    expect(light['chart-status-success']).toMatchObject({
      $value: '{success}',
    });
  });

  it('leaves the shadows to primitive/shadow.json', () => {
    expect(Object.keys(light).some((k) => k.startsWith('shadow'))).toBe(false);
  });

  it('keeps only what .dark remaps, with literal translucent colours', () => {
    expect(dark.border).toEqual({
      $type: 'color',
      $value: { colorSpace: 'oklch', components: [1, 0, 0], alpha: 0.1 },
    });
    expect(dark['chart-status-success']).toBeUndefined();
    expect(Object.keys(dark).length).toBeLessThan(Object.keys(light).length);
  });
});
