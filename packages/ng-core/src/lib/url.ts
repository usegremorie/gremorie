const SAFE_PROTOCOLS = new Set(['http:', 'https:']);

/**
 * Validate a URL that originates from untrusted input — a model citation, a
 * generated preview target, a user-typed address bar.
 *
 * Returns the normalized URL when it is an **absolute** `http:`/`https:` URL,
 * and `undefined` otherwise.
 *
 * Two classes of input are rejected:
 *
 * 1. **Dangerous schemes.** `javascript:`, `data:`, `blob:`, `vbscript:` and
 *    friends. Angular's own sanitizer covers `[href]`/`[src]` bindings, but
 *    not values passed through `DomSanitizer.bypassSecurityTrust*`, which an
 *    `<iframe src>` requires.
 * 2. **Relative URLs.** `new URL(url)` without a base throws on them, so
 *    `/admin` or `//evil.example` never validate. This matters for
 *    `<iframe>`: a same-origin frame with `allow-scripts` can reach `parent`
 *    and strip its own sandbox.
 *
 * @example
 * safeHttpUrl('https://example.com')            // 'https://example.com/'
 * safeHttpUrl('javascript:alert(1)')            // undefined
 * safeHttpUrl('/admin')                         // undefined
 */
export function safeHttpUrl(
  url: string | null | undefined,
): string | undefined {
  if (!url) return undefined;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return undefined;
  }

  return SAFE_PROTOCOLS.has(parsed.protocol) ? parsed.href : undefined;
}
