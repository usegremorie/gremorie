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
  const entries = new Map<string, Date | undefined>();

  // Default language only. Portuguese is written but not served (lib/i18n.ts),
  // and /pt redirects to /en - a sitemap lists destinations, not redirects.
  for (const lang of [i18n.defaultLanguage]) {
    // Landing page per locale. It is built from code, not an MDX file, so it
    // has no single source date and carries no <lastmod>.
    entries.set(`/${lang}`, undefined);

    // Every docs page known to the source loader, per locale. The loader
    // returns URLs already prefixed with the locale. `lastModified` is the
    // last git commit of the page's MDX file (fumadocs-mdx last-modified
    // plugin, see source.config.ts).
    for (const page of source.getPages(lang)) {
      entries.set(page.url, page.data.lastModified);
    }
  }

  const home = `/${i18n.defaultLanguage}`;

  // A page with no known date omits <lastmod> rather than claiming "now":
  // Google stops trusting lastmod on a site where it always moves.
  return [...entries].map(
    ([url, lastModified]): MetadataRoute.Sitemap[number] => ({
      url: `${baseUrl}${url}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: 'weekly',
      priority: url === home ? 1 : 0.7,
    }),
  );
}
