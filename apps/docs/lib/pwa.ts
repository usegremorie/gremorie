/**
 * Shared constants for the service worker and the page that registers it.
 *
 * This module is bundled into the service worker (app/sw.ts) by esbuild, so it
 * must stay free of imports: anything pulled in here ships inside sw.js.
 */

/** Where the worker is served: app/serwist/[path]/route.ts builds it. */
export const SW_URL = '/serwist/sw.js';

/** The scope the worker controls (the route sends Service-Worker-Allowed: /). */
export const SW_SCOPE = '/';

/**
 * Locales with an offline page precached. Only English is served today (see
 * lib/i18n.ts: `/pt/*` redirects to `/en/*`), so precaching `/pt/~offline`
 * would store a redirect. Add `'pt'` here the day Portuguese comes back; the
 * page itself already carries both languages.
 */
export const OFFLINE_LOCALES = ['en'] as const;

export const offlinePath = (lang: string) => `/${lang}/~offline`;

/** The Sonner toaster that carries the update notice, kept apart from demos. */
export const PWA_TOASTER_ID = 'pwa';

/**
 * What the worker downloads at install, before any page is opened: the
 * build's stylesheets and fonts, the app icons and (added in the route) the
 * offline page. About 0.7 MB raw. JavaScript stays out: each page's chunks are
 * cached the first time that page is opened (runtime cache, cache-first for
 * hashed files), so a visited page still works offline without making the
 * first visit download every chunk of the site (~15 MB).
 */
export const PRECACHE_GLOBS = [
  '.next/static/**/*.{css,woff2}',
  'public/icon-*.png',
] as const;

/**
 * A pixel sampled from the page background, as the hex a theme-color meta
 * tag takes. Sampling (instead of reading the computed color) turns any
 * color space the token uses, oklch included, into sRGB.
 */
export function rgbaToHex([r, g, b]: readonly number[]): string {
  return `#${[r, g, b].map((v) => (v ?? 0).toString(16).padStart(2, '0')).join('')}`;
}
