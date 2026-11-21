'use client';

import { useEffect } from 'react';

import { rgbaToHex } from '@/lib/pwa';

/**
 * Keeps the browser and installed-app bar in the color of the page, following
 * the site's theme switch and not only the system scheme. The layout's
 * per-scheme theme-color tags cover the first paint; once the page runs, every
 * theme change (the `class` and `data-theme` of <html>) repaints the bar with
 * the resolved `--background` token, sampled from a pixel so any color space
 * comes out as sRGB hex.
 */
export function ThemeColorSync() {
  useEffect(() => {
    const root = document.documentElement;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const sync = () => {
      ctx.clearRect(0, 0, 1, 1);
      // The page color sits on <body> or, when that is transparent, <html>.
      const body = getComputedStyle(document.body).backgroundColor;
      ctx.fillStyle =
        body === 'transparent' || body === 'rgba(0, 0, 0, 0)'
          ? getComputedStyle(root).backgroundColor
          : body;
      ctx.fillRect(0, 0, 1, 1);
      const color = rgbaToHex(Array.from(ctx.getImageData(0, 0, 1, 1).data));
      document
        .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
        .forEach((meta) => {
          meta.content = color;
        });
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  return null;
}
