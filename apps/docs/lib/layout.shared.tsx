import { Sparkles } from "lucide-react";

import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

/**
 * Shared layout options consumed by both HomeLayout (route group `(home)`)
 * and DocsLayout (route group `(docs)`). Wires the same navbar across the
 * landing and the docs: brand title, primary nav links, GitHub external.
 *
 * Keeping this in one place is what guarantees the chrome (logo, links,
 * search dialog, theme toggle) stays consistent when navigating between
 * `/` and `/components/*`.
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
      { text: "Tokens", url: "/tokens" }
    ],
    githubUrl: "https://github.com/usegremorie/gremorie"
  };
}
