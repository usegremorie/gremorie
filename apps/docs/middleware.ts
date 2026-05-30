import { NextResponse, type NextRequest } from "next/server";

/**
 * AI-onboarding telemetry.
 *
 * Emits one structured JSON log line per high-signal request to the Vercel
 * runtime logs (read them in the project's Observability tab, via
 * `vercel logs <deployment-url>`, or pipe to a Log Drain). This is layer 2 of
 * the monitoring loop documented in the Kalvnor vault
 * (missions/kal/gremorie/onboarding-evals) — it complements the hand-written
 * onboarding-eval logs with passive, at-scale signal.
 *
 * Signals captured (see `matcher` below):
 *   - /llms.txt          an agent discovering the machine-readable index
 *   - /r/*               which registry items get fetched; a 404 here means an
 *                        agent asked for a component name that doesn't exist —
 *                        the single most useful signal for fixing docs/naming.
 *                        (Cross-reference the path against the live registry, or
 *                        filter logs by HTTP 404 status, to find the misses.)
 *   - /api/*             MCP (/api/[transport]) + search calls
 *   - /get-started/*     install / onboarding doc reads
 *
 * Each line tags whether the caller looks like a known AI agent (by UA), so you
 * can split human vs. agent traffic. No PII is logged (UA is truncated; only a
 * coarse country code from Vercel's edge header is kept).
 *
 * To turn it off, delete this file (or narrow the `matcher`). The matcher is
 * scoped to four path groups, so it does NOT run on page/asset requests.
 */

const AI_UA =
  /(claude|anthropic|gptbot|chatgpt|oai-searchbot|openai|perplexity|cohere|google-extended|bytespider|ccbot|claudebot|amazonbot|youbot|diffbot)/i;

export function middleware(req: NextRequest): NextResponse {
  const { pathname, search } = req.nextUrl;
  const ua = req.headers.get("user-agent") ?? "";

  const kind = pathname === "/llms.txt"
    ? "llms"
    : pathname.startsWith("/r/")
      ? "registry"
      : pathname.startsWith("/api/")
        ? "api"
        : "docs";

  console.log(
    JSON.stringify({
      evt: "gremorie.telemetry",
      kind,
      path: pathname + (search ?? ""),
      ai: AI_UA.test(ua),
      ref: req.headers.get("referer"),
      country: req.headers.get("x-vercel-ip-country"),
      ua: ua.slice(0, 180),
      ts: new Date().toISOString(),
    }),
  );

  return NextResponse.next();
}

export const config = {
  matcher: ["/llms.txt", "/r/:path*", "/api/:path*", "/get-started/:path*"],
};
