import "./global.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Geist, Geist_Mono } from "next/font/google";

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
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
