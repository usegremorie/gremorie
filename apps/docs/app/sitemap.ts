import type { MetadataRoute } from 'next';

import { i18n } from '@/lib/i18n';
import { source } from '@/lib/source';

/**
 * Site-wide sitemap at /sitemap.xml (Next App Router metadata route).
 *
 * Derives the page list from the same Fumadocs source loader the app renders
 * with (lib/source.ts), so every docs page - /components/*, /blocks/*,
 * /tokens/*, /corpus/*, /get-started/*, /artifacts/*, /platform/* - is listed
 * without a hand-maintained URL list. The landing page is added per locale.
 *
 * Every URL carries its locale prefix, because `hideLocale` is `'never'`
 * (lib/i18n.ts). This used to emit `/` for English, which now only redirects
 * to `/en` - a sitemap should list the destination, not the hop.
 *
 * Referenced by app/robots.ts (sitemap: https://www.gremorie.com/sitemap.xml).
 */
const baseUrl = 'https://www.gremorie.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const urls = new Set<string>();

  // Default language only. Portuguese is written but not served (lib/i18n.ts),
  // and /pt redirects to /en - a sitemap lists destinations, not redirects.
  for (const lang of [i18n.defaultLanguage]) {
    // Landing page per locale.
    urls.add(`/${lang}`);

    // Every docs page known to the source loader, per locale. The loader
    // returns URLs already prefixed with the locale.
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
