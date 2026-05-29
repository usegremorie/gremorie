import { HomeLayout } from "fumadocs-ui/layouts/home";

import type { ReactNode } from "react";

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
export default function Layout({ children }: { children: ReactNode }) {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
