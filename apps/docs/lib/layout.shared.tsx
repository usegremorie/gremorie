import { defineI18nUI } from 'fumadocs-ui/i18n';
import { Github } from 'lucide-react';

import type { BaseLayoutProps, LinkItemType } from 'fumadocs-ui/layouts/shared';

import { i18n } from '@/lib/i18n';

/**
 * UI translations + the per-locale provider for RootProvider.
 * English uses Fumadocs' built-in strings (only the display name is set);
 * Portuguese overrides the visible UI labels. Page CONTENT is translated via
 * `*.pt.mdx` files, not here.
 */
export const { provider } = defineI18nUI(i18n, {
  translations: {
    en: { displayName: 'English' },
    pt: {
      displayName: 'Português',
      search: 'Buscar',
      searchNoResult: 'Nenhum resultado',
      toc: 'Nesta página',
      tocNoHeadings: 'Sem títulos',
      lastUpdate: 'Última atualização',
      chooseLanguage: 'Idioma',
      nextPage: 'Próximo',
      previousPage: 'Anterior',
      chooseTheme: 'Tema',
      editOnGithub: 'Editar no GitHub',
    },
  },
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

// Plain text wordmark. The provisional icon mark was removed on purpose:
// Kal is designing the real Gremorie logo, and until it lands the brand is
// the wordmark alone (no placeholder glyph).
export const logo = (
  <span className="inline-flex items-center gap-2 font-semibold">Gremorie</span>
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
// Primary destinations (home redesign, section 0): Components, Blocks,
// Tokens, Corpus. Declared with `on: 'nav'` so they render in the top navbar
// (home + docs) but stay OUT of the docs sidebar menu — the earlier hardcoded
// sidebar subset rendered inside every tab's sidebar and read as "Blocks mixed
// into Corpus"; the sidebar keeps its auto-generated `root: true` tabs.
// Workbench is intentionally absent: the app has no public deployment URL yet
// (docs/workbench.md still says "<set by your Vercel project>"). Add it here
// once the workbench ships publicly.
export const linkItems: LinkItemType[] = [
  { text: 'Components', url: '/components', on: 'nav' },
  { text: 'Blocks', url: '/blocks', on: 'nav' },
  { text: 'Tokens', url: '/tokens', on: 'nav' },
  { text: 'Corpus', url: '/corpus', on: 'nav' },
  {
    type: 'icon',
    label: 'GitHub',
    text: 'GitHub',
    icon: <Github aria-hidden="true" />,
    url: 'https://github.com/usegremorie/gremorie',
    external: true,
  },
];

export function baseOptions(lang?: string): BaseLayoutProps {
  const home = lang && lang !== i18n.defaultLanguage ? `/${lang}` : '/';
  return {
    nav: {
      title: logo,
      url: home,
    },
    links: linkItems,
    searchToggle: {
      enabled: true,
    },
  };
}
