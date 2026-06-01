import { HomeLayout } from 'fumadocs-ui/layouts/home';

import type { ReactNode } from 'react';

import { ThemeSwitchWithFlag } from '@/components/flag-language-switch';
import { baseOptions } from '@/lib/layout.shared';

/**
 * Route group `(home)` wraps the public landing in the Fumadocs HomeLayout,
 * mirroring the `(docs)` group which uses DocsLayout. Both layouts consume
 * the same `baseOptions()` so the navbar (logo, primary links, search
 * dialog, theme toggle) stays consistent between `/` and the docs pages.
 *
 * HomeLayout provides the navbar; it does NOT provide a rich footer, so
 * the landing keeps rendering its custom 3-column footer inside `children`.
 */
export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;
  // The flag language switch sits right before the theme toggle (navbar), via
  // the shared themeSwitch slot. `i18n={false}` hides Fumadocs' default text
  // toggle; the locale context still comes from RootProvider.
  return (
    <HomeLayout
      i18n={false}
      slots={{ themeSwitch: ThemeSwitchWithFlag }}
      {...baseOptions(lang)}
    >
      {children}
    </HomeLayout>
  );
}
