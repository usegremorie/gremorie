import type { MetadataRoute } from "next";

/**
 * Site-wide robots.txt.
 *
 * gremorie.com is live and launch-ready, so crawlers and AI agents are
 * allowed in — this is what lets an assistant fetch the docs / llms.txt
 * when a user hands it only the domain.
 *
 * NOTE: search-engine *indexing* is still suppressed via the
 * `X-Robots-Tag: noindex` header in `vercel.json` (soft launch). That
 * header does not block AI agents that fetch a page on purpose. Remove it
 * when you want Google to index the site (full SEO launch).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/"
      }
    ],
    host: "https://gremorie.com"
  };
}
