import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from '@/lib/site';

/**
 * Thin root layout. The real <html>/<body> + providers live in
 * app/[lang]/layout.tsx, so the [lang] segment can resolve the locale first
 * (Fumadocs i18n pattern). This root only carries app-wide metadata and lets
 * the locale layouts (and the language-agnostic route handlers under /api,
 * /llms.txt, /robots) render their own output.
 *
 * Search indexing (production-only): the production deployment
 * (`VERCEL_ENV === 'production'`, i.e. www.gremorie.com) is indexable; every
 * other environment (preview/development) emits a `noindex` robots meta so
 * per-PR preview URLs never reach a search index. Vercel additionally sets its
 * own `X-Robots-Tag: noindex` on non-production deployments, so this is
 * defense-in-depth. `app/robots.ts` allows crawling in all environments (that
 * is what lets AI agents fetch the docs); indexing is gated here.
 *
 * Social metadata: metadataBase + openGraph/twitter live here so every route
 * inherits them. The images are Next metadata files next to this layout:
 * app/opengraph-image.png (share card), app/icon.svg (favicon, switches to
 * white in dark mode), app/favicon.ico, app/apple-icon.png and app/manifest.ts.
 */

const isProduction = process.env.VERCEL_ENV === 'production';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Every page declares itself as canonical on the production host. A URL
  // instance (not a string) makes Next resolve it with the current page's
  // pathname, so this one entry yields https://www.gremorie.com/en/components
  // on /en/components, without query strings, instead of one shared URL.
  alternates: {
    canonical: new URL(SITE_URL),
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: 'website',
    siteName: SITE_NAME,
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: isProduction
    ? { index: true, follow: true }
    : {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
        },
      },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
