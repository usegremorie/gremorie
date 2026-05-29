import { Github, Sparkles } from "lucide-react";

import type {
  BaseLayoutProps,
  LinkItemType
} from "fumadocs-ui/layouts/shared";

/**
 * Shared layout options consumed by both HomeLayout (route group `(home)`)
 * and DocsLayout (route group `(docs)`). Wires the same navbar across the
 * landing and the docs: brand title, primary nav links, GitHub external.
 *
 * Structure follows the Fumadocs official pattern (apps/docs/components/
 * layouts/shared.tsx on the dev repo): `logo` and `linkItems` are
 * exported individually so each layout can subset/extend them. DocsLayout
 * filters to icon-only entries; HomeLayout uses the full list.
 */

export const logo = (
  <span className="inline-flex items-center gap-2 font-semibold">
    <Sparkles className="size-4" aria-hidden="true" />
    Gremorie
  </span>
);

/**
 * Primary navbar entries.
 *
 * The GitHub link is declared as an explicit icon entry (not via
 * `githubUrl`). The Fumadocs `githubUrl` shortcut renders a raw SVG with
 * `role="img"` but no inner `<title>` or `aria-label`, which axe-core
 * flags as `svg-img-alt`. The parent `<a aria-label="GitHub">` plus the
 * `aria-hidden` Lucide icon expose the link as a labeled action with a
 * decorative graphic.
 */
export const linkItems: LinkItemType[] = [
  {
    text: "Components",
    url: "/components/overview",
    active: "nested-url"
  },
  {
    text: "Blocks",
    url: "/blocks/overview",
    active: "nested-url"
  },
  {
    text: "Corpus",
    url: "/corpus",
    active: "nested-url"
  },
  {
    text: "Tokens",
    url: "/tokens",
    active: "nested-url"
  },
  {
    type: "icon",
    label: "GitHub",
    text: "GitHub",
    icon: <Github aria-hidden="true" />,
    url: "https://github.com/usegremorie/gremorie",
    external: true
  }
];

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: logo,
      url: "/"
    },
    links: linkItems,
    searchToggle: {
      enabled: true
    }
  };
}
