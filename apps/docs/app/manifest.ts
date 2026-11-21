import type { MetadataRoute } from 'next';

import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/site';

/**
 * Web app manifest at /manifest.webmanifest (Next metadata route). Gives
 * Android and desktop installs the Gremorie app icon (white symbol on a black
 * rounded square); iOS reads app/apple-icon.png instead.
 *
 * - `id` is pinned to '/', the value browsers derived from the old
 *   start_url, so moving start_url does not turn existing installs into a
 *   different app.
 * - `start_url` is '/en', not '/': the bare root is a 308 to /en (proxy.ts),
 *   and a redirect is neither worth a round trip at launch nor something the
 *   service worker caches for offline launches.
 * - `theme_color`/`background_color` are the light page background
 *   (--background, gray-50). The per-scheme tint lives in the root layout's
 *   `viewport.themeColor`, which browsers prefer over the manifest.
 * - Maskable icons (Android adaptive shapes): the white symbol on a full-bleed
 *   black square, scaled so its farthest point stays inside the safe circle
 *   (80% of the side, radius 40%). Rendered from
 *   public/brand/gremorie-symbol-white.svg; 512px: symbol radius 193 of 205.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    id: '/',
    start_url: '/en',
    scope: '/',
    display: 'standalone',
    background_color: '#fafafa',
    theme_color: '#fafafa',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/icon-maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
