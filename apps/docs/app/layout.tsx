import "./global.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Geist, Geist_Mono } from "next/font/google";

import type { Metadata } from "next";
import type { ReactNode } from "react";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans"
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono"
});

/**
 * Site-wide noindex (layer 1 of 3).
 *
 * The Gremorie docs site is deployed publicly on Vercel but must NOT be
 * indexed by search engines until the domain (gremorie.com) is owned and
 * the content is ready for launch.
 *
 * Noindex enforcement happens at three layers:
 *   1. `metadata.robots` here -> emits `<meta name="robots">` in every page.
 *   2. `app/robots.ts`        -> blocks crawlers via /robots.txt.
 *   3. `vercel.json` headers  -> emits `X-Robots-Tag: noindex, nofollow`
 *      for every response (including JSON, MCP, /r/*).
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

/**
 * Root layout for the Gremorie docs site.
 *
 * Phase 2 note: removed `<TooltipProvider>` and `<Toaster>` from
 * `@kalvner/kds/overlays/*` — those primitives belong to the legacy Bridge
 * KDS React package which has not been migrated yet. When
 * `@gremorie/react-overlays` ships in Phase 5, restore the providers here.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="flex flex-col min-h-screen font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-md focus:outline-2 focus:outline-ring"
        >
          Skip to main content
        </a>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
