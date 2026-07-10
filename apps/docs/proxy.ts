import { createI18nMiddleware } from 'fumadocs-core/i18n/middleware';
import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from 'next/server';

import { i18n } from '@/lib/i18n';

/**
 * Combined proxy: Fumadocs i18n routing + AI-onboarding telemetry.
 *
 * (Renamed from the deprecated `middleware` file convention to `proxy` in
 * Next.js 16; behaviour is unchanged.)
 *
 * - i18n: every doc/home request is routed through Fumadocs' locale middleware
 *   (default English stays at `/`, Portuguese under `/pt`, missing translations
 *   fall back to English). Language-agnostic routes (/api, /r, /llms.txt,
 *   /robots.txt) skip i18n and pass straight through.
 * - Telemetry: one structured JSON log line per high-signal request (the
 *   machine-readable index, registry fetches, MCP/search, onboarding docs),
 *   tagged with whether the caller looks like an AI agent. Read in Vercel
 *   Observability / `vercel logs`. Layer 2 of the onboarding monitoring loop
 *   (Kalvnor vault: missions/kal/gremorie/onboarding-evals).
 */

const AI_UA =
  /(claude|anthropic|gptbot|chatgpt|oai-searchbot|openai|perplexity|cohere|google-extended|bytespider|ccbot|claudebot|amazonbot|youbot|diffbot)/i;

const i18nMiddleware = createI18nMiddleware(i18n);

/** Routes that are not localized — telemetry only, never i18n-rewritten. */
function isAgnostic(pathname: string): boolean {
  return (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/r/') ||
    pathname === '/llms.txt' ||
    pathname === '/llms-full.txt' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  );
}

export default function proxy(req: NextRequest, event: NextFetchEvent) {
  const { pathname, search } = req.nextUrl;
  const ua = req.headers.get('user-agent') ?? '';

  // Telemetry on the high-signal paths.
  if (
    pathname === '/llms.txt' ||
    pathname === '/llms-full.txt' ||
    pathname.startsWith('/r/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('/get-started')
  ) {
    const kind =
      pathname === '/llms.txt' || pathname === '/llms-full.txt'
        ? 'llms'
        : pathname.startsWith('/r/')
          ? 'registry'
          : pathname.startsWith('/api/')
            ? 'api'
            : 'docs';
    console.log(
      JSON.stringify({
        evt: 'gremorie.telemetry',
        kind,
        path: pathname + (search ?? ''),
        ai: AI_UA.test(ua),
        ref: req.headers.get('referer'),
        country: req.headers.get('x-vercel-ip-country'),
        ua: ua.slice(0, 180),
        ts: new Date().toISOString(),
      }),
    );
  }

  if (isAgnostic(pathname)) return NextResponse.next();

  // Localizable pages (docs + landing) → Fumadocs locale routing.
  return i18nMiddleware(req, event);
}

export const config = {
  // Run on everything except Next internals and static asset files.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpe?g|gif|svg|ico|webp|avif|woff2?|ttf|otf)$).*)',
  ],
};
