import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Thin root layout. The real <html>/<body> + providers live in
 * app/[lang]/layout.tsx, so the [lang] segment can resolve the locale first
 * (Fumadocs i18n pattern). This root only carries app-wide metadata and lets
 * the locale layouts (and the language-agnostic route handlers under /api,
 * /llms.txt, /robots) render their own output.
 *
 * Site-wide noindex (layer 1 of 3): emits `<meta name="robots">`. Also enforced
 * via app/robots.ts and the `X-Robots-Tag` header in vercel.json. Remove when
 * the site is ready for search-engine indexing (full SEO launch).
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true
    }
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
