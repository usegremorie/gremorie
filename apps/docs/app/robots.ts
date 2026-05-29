import type { MetadataRoute } from "next";

/**
 * Site-wide robots.txt (layer 2 of 3).
 *
 * Blocks every crawler from every path while the Gremorie docs site is
 * deployed publicly on Vercel without a custom domain. Pair this with
 * `metadata.robots` in `app/layout.tsx` and the `X-Robots-Tag` header in
 * `vercel.json` for defense in depth.
 *
 * When `gremorie.com` is bought and the content is launch-ready, switch
 * this back to `allow: "/"` and remove the `metadata.robots` block plus
 * the `X-Robots-Tag` header from `vercel.json`.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: "/"
      }
    ]
  };
}
