import { HomeLayout } from 'fumadocs-ui/layouts/home';

import type { ReactNode } from 'react';

import { SiteHeader } from '@/components/site-header';
import { baseOptions } from '@/lib/layout.shared';

/**
 * Route group `(home)` wraps the public landing in the Fumadocs HomeLayout,
 * mirroring the `(docs)` group which uses DocsLayout. Both layouts consume
 * the same `baseOptions()` so the navbar (wordmark, primary links, search
 * dialog, theme toggle) stays consistent between `/` and the docs pages.
 *
 * HomeLayout provides the navbar; it does NOT provide a rich footer, so
 * the landing keeps rendering its custom 3-column footer inside `children`.
 *
 * `i18n={false}` hides Fumadocs' built-in language toggle. There is NO
 * visible language selector by design: English is the default locale and
 * `/pt` remains reachable by direct URL (the i18n plumbing in RootProvider
 * is untouched).
 */
export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;
  const base = baseOptions(lang);
  // The top bar is our own (logo left, icon nav centred,
  // actions right; border and translucent surface only once scrolled). It
  // keeps the 56px of Fumadocs' header, so nothing else shifts.
  return (
    <HomeLayout
      i18n={false}
      {...base}
      nav={{ ...base.nav, component: <SiteHeader lang={lang} /> }}
    >
      {children}
    </HomeLayout>
  );
}
