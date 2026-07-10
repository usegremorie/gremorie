import type { MetadataRoute } from 'next';

import { i18n } from '@/lib/i18n';
import { source } from '@/lib/source';

/**
 * Site-wide sitemap at /sitemap.xml (Next App Router metadata route).
 *
 * Derives the page list from the same Fumadocs source loader the app renders
 * with (lib/source.ts), so every docs page - /components/*, /blocks/*,
 * /tokens/*, /corpus/*, /get-started/*, /artifacts/*, /platform/* - is listed
 * without a hand-maintained URL list. The landing page is added per locale
 * ('/' for English, '/pt' for Portuguese; hideLocale keeps the default
 * language at the root).
 *
 * Referenced by app/robots.ts (sitemap: https://www.gremorie.com/sitemap.xml).
 */
const baseUrl = 'https://www.gremorie.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const urls = new Set<string>();

  for (const lang of i18n.languages) {
    // Landing page per locale.
    urls.add(lang === i18n.defaultLanguage ? '/' : `/${lang}`);

    // Every docs page known to the source loader, per locale. The loader
    // already applies hideLocale, so English URLs come back unprefixed and
    // Portuguese URLs come back under /pt.
    for (const page of source.getPages(lang)) {
      urls.add(page.url);
    }
  }

  return [...urls].map((url): MetadataRoute.Sitemap[number] => ({
    url: `${baseUrl}${url === '/' ? '' : url}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: url === '/' ? 1 : 0.7,
  }));
}
