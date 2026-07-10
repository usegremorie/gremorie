/**
 * Best-effort MDX -> plain-markdown stripper for /llms-full.txt.
 *
 * Keeps everything an LLM can use as-is (prose, headings, tables, lists,
 * fenced code blocks) and removes only the compile-time MDX machinery:
 *
 * - frontmatter (title/description are re-emitted by the route header)
 * - top-level `import` / `export` statements
 * - JSX component tags (`<ComponentPreview>`, `<Tabs>`, `<Tab>`, ...) while
 *   preserving their inner content
 * - MDX `{/* ... *\/}` comments
 *
 * Content inside fenced code blocks is never touched. Deterministic: pure
 * string transformation, no I/O.
 */

/** Matches a line that is nothing but one JSX component tag (open/close/self-closing). */
const PURE_JSX_TAG_LINE = /^<\/?[A-Z][\w.]*(\s[^>]*)?\/?>$/;

/** Matches capitalized JSX tags inline (for lines mixing tags and content). */
const INLINE_JSX_TAG = /<\/?[A-Z][\w.]*(\s[^>]*?)?\/?>/g;

/** A single-line fenced snippet (` ```bash foo``` `) left behind by inline tags. */
const SINGLE_LINE_FENCE = /^```[\w-]*\s+(.*?)\s*```$/;

/**
 * Apply `transform` only to the parts of a line OUTSIDE inline-code spans, so
 * prose like ``### `<Button>` `` keeps its backticked JSX examples intact.
 */
function outsideInlineCode(
  line: string,
  transform: (segment: string) => string,
): string {
  return line
    .split(/(`[^`]*`)/g)
    .map((seg) => (seg.startsWith('`') ? seg : transform(seg)))
    .join('');
}

/** Remove the leading `--- ... ---` frontmatter block. */
export function stripFrontmatter(raw: string): string {
  return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
}

/** Convert one MDX document body into readable plain markdown. */
export function mdxToText(raw: string): string {
  const body = stripFrontmatter(raw).replace(/\r\n/g, '\n');
  const out: string[] = [];
  let inFence = false;
  let inJsxOpenTag = false; // inside a multi-line JSX opening tag
  let inImport = false; // inside a multi-line import statement

  for (const line of body.split('\n')) {
    const trimmed = line.trim();

    // Fenced code: keep verbatim. A line that both opens and closes a fence
    // (single-line leftovers) is handled below and never toggles the state.
    if (trimmed.startsWith('```') && !SINGLE_LINE_FENCE.test(trimmed)) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence) {
      out.push(line);
      continue;
    }

    // Multi-line import statement: skip until the closing `from '...'` line.
    if (inImport) {
      if (/from\s+['"][^'"]+['"];?\s*$/.test(trimmed)) inImport = false;
      continue;
    }
    if (/^import\s/.test(trimmed)) {
      if (!/from\s+['"][^'"]+['"];?\s*$/.test(trimmed)) inImport = true;
      continue;
    }
    if (/^export\s/.test(trimmed)) continue;

    // Multi-line JSX opening tag: skip continuation lines until the `>`.
    if (inJsxOpenTag) {
      if (trimmed.includes('>')) inJsxOpenTag = false;
      continue;
    }
    if (/^<[A-Z][\w.]*(\s|$)/.test(trimmed) && !trimmed.includes('>')) {
      inJsxOpenTag = true;
      continue;
    }

    // A line that is exactly one component tag: drop it, keep the children.
    if (PURE_JSX_TAG_LINE.test(trimmed)) continue;

    // Mixed lines: strip inline component tags and MDX comments, keep text.
    // Inline-code spans (`...`) are preserved untouched.
    let text = outsideInlineCode(line, (seg) =>
      seg.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(INLINE_JSX_TAG, ''),
    ).trimEnd();
    if (text.trim() === '' && trimmed !== '') continue; // line was only tags

    // `<Tab>```bash cmd``` </Tab>` leftovers -> inline code.
    const single = SINGLE_LINE_FENCE.exec(text.trim());
    if (single?.[1]) text = `\`${single[1]}\``;

    out.push(text);
  }

  // Collapse runs of blank lines created by removed tags.
  return out
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
