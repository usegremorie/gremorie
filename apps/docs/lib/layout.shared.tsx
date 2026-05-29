import { Github, Sparkles } from "lucide-react";

import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

/**
 * Shared layout options consumed by both HomeLayout (route group `(home)`)
 * and DocsLayout (route group `(docs)`). Wires the same navbar across the
 * landing and the docs: brand title, primary nav links, GitHub external.
 *
 * Keeping this in one place is what guarantees the chrome (logo, links,
 * search dialog, theme toggle) stays consistent when navigating between
 * `/` and `/components/*`.
 *
 * Notes:
 * - The GitHub link is declared as an explicit icon entry in `links[]`
 *   instead of via `githubUrl`. The Fumadocs `githubUrl` shortcut renders
 *   a raw SVG with `role="img"` but no inner `<title>` or `aria-label`,
 *   which axe-core flags as `svg-img-alt` (serious WCAG violation). The
 *   parent `<a aria-label="GitHub">` provides the accessible name; the
 *   Lucide icon carries `aria-hidden="true"` so the SVG is exposed as
 *   decorative — no inner title needed.
 * - `searchToggle.enabled` is set explicitly so the search trigger is
 *   guaranteed to render on both HomeLayout and DocsLayout navbars.
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2 font-semibold">
          <Sparkles className="size-4" aria-hidden="true" />
          Gremorie
        </span>
      ),
      url: "/"
    },
    links: [
      { text: "Components", url: "/components/overview" },
      { text: "Blocks", url: "/blocks/overview" },
      { text: "Corpus", url: "/corpus" },
      { text: "Tokens", url: "/tokens" },
      {
        type: "icon",
        label: "GitHub",
        text: "GitHub",
        icon: <Github aria-hidden="true" />,
        url: "https://github.com/usegremorie/gremorie",
        external: true
      }
    ],
    searchToggle: {
      enabled: true
    }
  };
}
