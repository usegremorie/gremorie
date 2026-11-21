import { spawnSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

import { createSerwistRoute } from '@serwist/turbopack';

import { OFFLINE_LOCALES, offlinePath } from '@/lib/pwa';

/**
 * Builds and serves the service worker at /serwist/sw.js (plus its source
 * map). The route is static: the worker is bundled once, at `next build`,
 * from app/sw.ts with the precache manifest of `.next/static` and `public/`
 * injected. Nothing is written to `public/`, so there is no generated file to
 * ignore in git, and the Vercel build produces it like any other page.
 *
 * The response carries `Service-Worker-Allowed: /`, which is what lets a
 * worker living under /serwist/ control the whole site.
 */

/**
 * Version of the precached offline pages. It has to change whenever their
 * HTML can change, or a cached page would point at chunks the new precache
 * no longer holds. `.next/static` holds content-hashed chunks plus a folder
 * named after the build id, so hashing its listing yields a new revision on
 * every build (like the worker itself, whose manifest lists that folder).
 * Falls back to the commit when there is no build output to read.
 */
function revision(): string {
  const staticDir = path.join(process.cwd(), '.next', 'static');
  if (existsSync(staticDir)) {
    const files = readdirSync(staticDir, { recursive: true, encoding: 'utf8' })
      .sort()
      .join('\n');
    return createHash('sha256').update(files).digest('hex').slice(0, 16);
  }
  const git = spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf-8' });
  return (
    process.env.VERCEL_GIT_COMMIT_SHA || git.stdout?.trim() || randomUUID()
  );
}

const rev = revision();

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    swSrc: 'app/sw.ts',
    useNativeEsbuild: true,
    additionalPrecacheEntries: OFFLINE_LOCALES.map((lang) => ({
      url: offlinePath(lang),
      revision: rev,
    })),
    // The component registry (public/r, ~2.4 MB of JSON for the CLI) and the
    // JSON schemas are fetched by tools, not by the site, so they stay out of
    // the precache. Everything else in public/ is a few icons.
    globIgnores: ['public/r/**', 'public/schema/**'],
  });
