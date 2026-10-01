import { defineI18n } from 'fumadocs-core/i18n';

/**
 * i18n configuration for the docs.
 *
 * **English only, on purpose.** Portuguese is written and on disk - the
 * `*.pt.mdx` pages and the `meta.pt.json` navigation files are all still here,
 * and the nav guard in `content-nav.spec.ts` keeps them honest - but it is not
 * served. Kal's call, 2026-09-30: the site answers in English, there is no
 * language control in the UI, and a visitor's browser language is not
 * negotiated.
 *
 * Portuguese stays registered here on purpose. Dropping it from `languages`
 * makes Fumadocs stop reading `*.pt.mdx` as a translation and start treating
 * each one as an ordinary English page named `assistant.pt` - ~150 bogus URLs
 * in the sitemap, and the content pipeline broken. The locale is disabled at
 * the edge instead, where it belongs:
 *
 *   - `proxy.ts` never negotiates `Accept-Language`; anything without a prefix
 *     goes to `/en`.
 *   - `next.config.mjs` redirects `/pt/*` to `/en/*`, temporarily.
 *   - the layouts already pass `i18n={false}`, so no language control renders.
 *
 * To bring Portuguese back: delete the `/pt` redirect and the negotiation
 * bypass. Nothing was removed.
 *
 * `hideLocale` stays `'never'` - every locale carries its prefix. It was
 * `'default-locale'` once, which dropped `/en` from public URLs while the route
 * stayed `app/[lang]/...`. A page then prerendered at `/en/tokens/x` with
 * `usePathname()` returning that, while the browser saw `/tokens/x`. Fumadocs
 * resolves the active sidebar item by matching that pathname against the page
 * tree, whose English URLs had also lost the prefix, so the match failed at
 * build time and succeeded in the browser: the sidebar rendered a different
 * shape on each side and React threw #418 on every English page. `'never'` is
 * Fumadocs' own default and makes route, public URL and page-tree URL the same
 * string.
 *
 * `fallbackLanguage` is kept for the day Portuguese returns: a page with no
 * `*.pt.mdx` serves the English one rather than 404ing, so translations can
 * land incrementally.
 */
export const i18n = defineI18n({
  defaultLanguage: 'en',
  languages: ['en', 'pt'],
  hideLocale: 'never',
  fallbackLanguage: 'en',
});
