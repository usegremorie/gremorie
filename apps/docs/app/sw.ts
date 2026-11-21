/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { defaultCache } from '@serwist/turbopack/worker';
import { Serwist, type PrecacheEntry, type SerwistGlobalConfig } from 'serwist';

import { OFFLINE_LOCALES, offlinePath } from '@/lib/pwa';

/**
 * The site's service worker, bundled by app/serwist/[path]/route.ts.
 *
 * - Precache: the build's stylesheets and fonts, the app icons and the
 *   offline page (PRECACHE_GLOBS in lib/pwa.ts), versioned by the manifest.
 * - Runtime: the recommended Next.js strategies. Pages (HTML and RSC
 *   payloads) are network-first, so a visited page is still there offline
 *   and an online visit always gets the fresh one; hashed static assets are
 *   cache-first; images and fonts stale-while-revalidate.
 * - Offline: a document request that fails with nothing cached gets the
 *   offline page of its locale.
 * - Updates: a new worker installs and then WAITS. The page shows a notice
 *   and only when the reader clicks "Update" does it post SKIP_WAITING, which
 *   Serwist answers with `self.skipWaiting()` (skipWaiting: false below). The
 *   worker never takes over an open tab on its own.
 */

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const localeOf = (url: string) => new URL(url).pathname.split('/')[1] ?? '';

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: false,
  // First install only: take control of the tab that registered the worker,
  // so offline works from the first visit. Later versions wait (see above).
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    // Most specific first: a locale's own page for its paths, then the
    // first locale's page as the catch-all for any other document.
    entries: [
      ...OFFLINE_LOCALES.slice(1).map((lang) => ({
        url: offlinePath(lang),
        matcher: ({ request }: { request: Request }) =>
          request.destination === 'document' && localeOf(request.url) === lang,
      })),
      {
        url: offlinePath(OFFLINE_LOCALES[0]),
        matcher: ({ request }: { request: Request }) =>
          request.destination === 'document',
      },
    ],
  },
});

serwist.addEventListeners();
