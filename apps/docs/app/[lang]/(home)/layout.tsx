import { HomeLayout } from "fumadocs-ui/layouts/home";

import type { LinkItemType } from "fumadocs-ui/layouts/shared";
import type { ReactNode } from "react";

import { FlagLanguageSwitch } from "@/components/flag-language-switch";
import { baseOptions } from "@/lib/layout.shared";

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
  children
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;
  const options = baseOptions(lang);
  // Flag language switch on the right of the navbar, beside search/theme.
  // (Docs surface gets it via the sidebar banner instead.) We drop the
  // `i18n` prop so Fumadocs' default text toggle doesn't double up.
  const languageSwitch: LinkItemType = {
    type: "custom",
    secondary: true,
    children: <FlagLanguageSwitch />
  };
  return (
    <HomeLayout
      i18n={false}
      {...options}
      links={[...(options.links ?? []), languageSwitch]}
    >
      {children}
    </HomeLayout>
  );
}
