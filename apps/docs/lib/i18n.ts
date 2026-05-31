import { defineI18n } from "fumadocs-core/i18n";

/**
 * i18n configuration for the docs.
 *
 * - English is the default and stays at the root URL (hideLocale hides the
 *   `/en` prefix); Portuguese lives under `/pt`.
 * - `fallbackLanguage: "en"` means any page without a `*.pt.mdx` translation
 *   transparently serves the English version — so /pt is fully navigable from
 *   day one and translations can land incrementally.
 */
export const i18n = defineI18n({
  defaultLanguage: "en",
  languages: ["en", "pt"],
  hideLocale: "default-locale",
  fallbackLanguage: "en",
});
