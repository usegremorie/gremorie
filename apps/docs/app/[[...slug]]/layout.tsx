import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { getLayoutTabs } from "fumadocs-ui/layouts/shared";
import { House } from "lucide-react";

import type { ReactNode } from "react";

import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

/**
 * Fumadocs auto-hides the sidebar tabs dropdown when no tab is
 * active for the current pathname. Visiting `/` (Welcome) matches
 * none of the content roots (Foundations/Tokens/Components) — so
 * the dropdown would disappear. Surfacing Welcome as a tab keeps
 * the dropdown always rendered with a valid selected entry, and
 * the navigation affordance becomes consistent across every page.
 */
const tabs = [
  {
    title: "Welcome",
    description: "Visão geral do Gremorie",
    url: "/",
    icon: <House />
  },
  ...getLayoutTabs(source.pageTree)
];

/**
 * Catch-all layout. Fumadocs is served from the root (`/`,
 * `/components/ai/prompt-input`) instead of the legacy `/docs/*`
 * prefix. Route handlers under `app/api/*` are siblings and are
 * not wrapped by this layout.
 */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      sidebar={{
        collapsible: true,
        defaultOpenLevel: 1,
        tabMode: "auto",
        tabs
      }}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
