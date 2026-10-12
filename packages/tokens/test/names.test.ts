import { describe, expect, it } from 'vitest';
import { cssNameToPath, pathToCssName } from '../pipeline/names.ts';

describe('css names and DTCG paths', () => {
  it.each([
    ['--color-gray-50', ['color', 'gray', '50']],
    ['--color-gray-0', ['color', 'gray', '0']],
    ['--radius-base', ['radius', 'base']],
    ['--font-sans', ['font', 'sans']],
    ['--tracking-normal', ['tracking', 'normal']],
    ['--spacing', ['spacing']],
    ['--shadow-2xs', ['shadow-2xs']],
    ['--shadow', ['shadow']],
    ['--sidebar-primary-foreground', ['sidebar-primary-foreground']],
    ['--chart-cat-1', ['chart-cat-1']],
  ])('%s ↔ %j', (name, path) => {
    expect(cssNameToPath(name)).toEqual(path);
    expect(pathToCssName(path)).toBe(name);
  });

  it('rejects a name that is not a custom property', () => {
    expect(() => cssNameToPath('color')).toThrow(/custom property/);
  });
});
