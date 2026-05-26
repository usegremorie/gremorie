import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { getLayoutTabs } from "fumadocs-ui/layouts/shared";
import { House } from "lucide-react";

import type { ReactNode } from "react";

import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

/**
 * Fumadocs auto-hides the sidebar tabs dropdown when no tab is
 * active for the current pathname. Visiting `/docs` (Welcome) matches
 * none of the 5 roots (Foundations/Tokens/UI/AI/Blocks) — so the
 * dropdown disappears. Surfacing Welcome as a tab keeps the dropdown
 * always rendered with a valid selected entry, and the navigation
 * affordance becomes consistent across every docs page.
 */
const tabs = [
  {
    title: "Welcome",
    description: "Visão geral do KDS",
    url: "/docs",
    icon: <House />
  },
  ...getLayoutTabs(source.pageTree)
];

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
