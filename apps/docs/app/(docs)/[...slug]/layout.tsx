import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
  BookOpen,
  Component,
  Layout as LayoutIcon,
  Palette,
  Rocket,
  Sparkles,
  Wrench
} from "lucide-react";

import type { ReactNode } from "react";

import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

/**
 * Seven tabs in inheritance order: Get Started -> Corpus -> Tokens ->
 * Components -> Blocks -> Artifacts -> Platform. Each tab corresponds
 * to a content root folder (marked `root: true` in its meta.json).
 *
 * The sidebar tabs are declared explicitly (instead of using
 * `getLayoutTabs(source.pageTree)`) so the order and descriptions
 * match the proposta v4 information architecture exactly.
 *
 * The home page (`/`) is still served by `content/index.mdx` for now.
 * In Phase 2 it becomes a standalone landing at `app/page.tsx`.
 */
const tabs = [
  {
    title: "Get Started",
    description: "Setup e primeiros passos",
    url: "/get-started",
    icon: <Rocket />
  },
  {
    title: "Corpus",
    description: "Knowledge layer canônico",
    url: "/corpus",
    icon: <BookOpen />
  },
  {
    title: "Tokens",
    description: "Design tokens",
    url: "/tokens",
    icon: <Palette />
  },
  {
    title: "Components",
    description: "Primitivos do registry",
    url: "/components",
    icon: <Component />
  },
  {
    title: "Blocks",
    description: "Composições prontas",
    url: "/blocks",
    icon: <LayoutIcon />
  },
  {
    title: "Artifacts",
    description: "AI generative outputs",
    url: "/artifacts",
    icon: <Sparkles />
  },
  {
    title: "Platform",
    description: "CLI, registry, MCP",
    url: "/platform",
    icon: <Wrench />
  }
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
