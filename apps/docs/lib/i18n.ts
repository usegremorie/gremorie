import { defineI18n } from 'fumadocs-core/i18n';

/**
 * i18n configuration for the docs.
 *
 * - Every locale carries its prefix: English at `/en`, Portuguese at `/pt`.
 *
 *   `hideLocale` used to be `'default-locale'`, which dropped `/en` from public
 *   URLs. That broke hydration on every English page: the route is
 *   `app/[lang]/...`, so a page prerenders at `/en/tokens/x` and `usePathname()`
 *   returns that, while the browser (after the proxy rewrite) sees
 *   `/tokens/x`. Fumadocs resolves the active sidebar item by matching that
 *   pathname against the page tree, whose English URLs also had no prefix - so
 *   the match failed at build time and succeeded in the browser, and the whole
 *   sidebar rendered a different shape on each side. React threw #418 and
 *   re-rendered the tree on the client, on every English page.
 *
 *   `'never'` is Fumadocs' own default (`i18n?.hideLocale ?? "never"` in
 *   `createGetUrl`) and what their i18n example ships. Route, public URL and
 *   page-tree URL are then the same string, so there is nothing to reconcile.
 * - `fallbackLanguage: "en"` means any page without a `*.pt.mdx` translation
 *   transparently serves the English version — so /pt is fully navigable from
 *   day one and translations can land incrementally.
 */
export const i18n = defineI18n({
  defaultLanguage: 'en',
  languages: ['en', 'pt'],
  hideLocale: 'never',
  fallbackLanguage: 'en',
});
