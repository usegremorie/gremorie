import { defineI18nUI } from "fumadocs-ui/i18n";
import { Github, Sparkles } from "lucide-react";

import type {
  BaseLayoutProps,
  LinkItemType
} from "fumadocs-ui/layouts/shared";

import { i18n } from "@/lib/i18n";

/**
 * UI translations + the per-locale provider for RootProvider.
 * English uses Fumadocs' built-in strings (only the display name is set);
 * Portuguese overrides the visible UI labels. Page CONTENT is translated via
 * `*.pt.mdx` files, not here.
 */
export const { provider } = defineI18nUI(i18n, {
  translations: {
    en: { displayName: "English" },
    pt: {
      displayName: "Português",
      search: "Buscar",
      searchNoResult: "Nenhum resultado",
      toc: "Nesta página",
      tocNoHeadings: "Sem títulos",
      lastUpdate: "Última atualização",
      chooseLanguage: "Idioma",
      nextPage: "Próximo",
      previousPage: "Anterior",
      chooseTheme: "Tema",
      editOnGithub: "Editar no GitHub"
    }
  }
});

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
// Section navigation lives in the sidebar tab switcher (auto-generated from the
// `root: true` folders — Get Started, Corpus, Tokens, Components, Blocks,
// Artifacts, Platform). We intentionally do NOT duplicate those sections as
// navbar/sidebar links here: that hardcoded subset was incomplete (4 of 7) and
// rendered inside every tab's sidebar, which read as "Blocks mixed into Corpus".
// The navbar keeps brand + search + GitHub only.
export const linkItems: LinkItemType[] = [
  {
    type: "icon",
    label: "GitHub",
    text: "GitHub",
    icon: <Github aria-hidden="true" />,
    url: "https://github.com/usegremorie/gremorie",
    external: true
  }
];

export function baseOptions(lang?: string): BaseLayoutProps {
  const home = lang && lang !== i18n.defaultLanguage ? `/${lang}` : "/";
  return {
    nav: {
      title: logo,
      url: home
    },
    links: linkItems,
    searchToggle: {
      enabled: true
    }
  };
}
