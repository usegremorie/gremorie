import "../global.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Geist, Geist_Mono } from "next/font/google";

import type { ReactNode } from "react";

import { provider } from "@/lib/layout.shared";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans"
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono"
});

/**
 * Per-locale root layout. Owns <html lang> + <body> + the shared providers.
 * The actual root (app/layout.tsx) is a thin passthrough so the [lang] segment
 * can resolve the locale before rendering. The i18n UI provider feeds the
 * translated UI strings + the language switcher.
 */
export default async function LangLayout({
  params,
  children
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;

  return (
    <html
      lang={lang}
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
        <RootProvider
          i18n={provider(lang)}
          search={{
            enabled: true,
            options: {
              type: "fetch",
              api: "/api/search"
            }
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
