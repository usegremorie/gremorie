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
