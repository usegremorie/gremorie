import { describe, expect, it } from 'vitest';

import { PRECACHE_GLOBS, rgbaToHex } from './pwa';

describe('PRECACHE_GLOBS', () => {
  it('precaches the stylesheets and fonts of the build', () => {
    expect(PRECACHE_GLOBS).toContain('.next/static/**/*.{css,woff2}');
  });

  it('leaves JavaScript to the runtime cache', () => {
    expect(PRECACHE_GLOBS.some((glob) => glob.includes('js'))).toBe(false);
  });

  it('precaches only the app icons from public/', () => {
    expect(PRECACHE_GLOBS).toContain('public/icon-*.png');
    expect(PRECACHE_GLOBS).not.toContain('public/**/*');
  });
});

describe('rgbaToHex', () => {
  it('turns a sampled pixel into a theme-color hex', () => {
    expect(rgbaToHex([250, 250, 250, 255])).toBe('#fafafa');
    expect(rgbaToHex([10, 10, 10, 255])).toBe('#0a0a0a');
  });
});
