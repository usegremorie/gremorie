/**
 * Hard-coded value guard. Component sources must style with tokens (the
 * Tailwind scale, theme utilities, CSS variables), not literal values. This
 * module finds the literals that slip in through Tailwind arbitrary values
 * (`rounded-[4px]`, `text-[10px]`) and inline color literals, so the drift gate
 * in `arbitrary-values.spec.ts` can fail with file:line.
 *
 * What counts as a violation inside an arbitrary value:
 * - a length literal in px/rem/em (except `0` and the `1px` hairline);
 * - a time literal in ms/s (use a motion token);
 * - a bare number (`z-[1]`: the scale utility exists);
 * - a color literal (#hex, rgb(), hsl(), oklch(), ...) or `hsl(var(...))`
 *   (tokens are oklch; wrapping them in hsl() is invalid CSS).
 *
 * Everything built from tokens passes: `var(--x)`, `--spacing(n)`, `calc()` over
 * those, `env(safe-area-inset-*)`, percentages, viewport and container units,
 * grid track lists, transition property lists and CSS keywords. Arbitrary
 * *variants* (`data-[state=open]:`, `[&_svg]:`, `has-[>kbd]:`) are selectors,
 * not values, and are ignored.
 */

export interface ArbitraryValueFinding {
  /** 1-based line number. */
  line: number;
  /** The offending class or literal, as written. */
  value: string;
  /** Why it is not allowed. */
  reason: string;
}

/**
 * Known literals with no token yet, by `file::value`. Each entry must say why.
 * Do NOT add entries to dodge the guard: add or reuse a token instead. This list
 * only shrinks.
 */
export const ARBITRARY_VALUE_ALLOWLIST = new Map<string, string>([]);

const LENGTH = /(?<![\w.-])-?(?:\d+\.?\d*|\.\d+)(px|rem|em)\b/g;
const TIME = /(?<![\w.-])(?:\d+\.?\d*|\.\d+)(ms|s)\b/;
const BARE_NUMBER = /^-?(?:\d+\.?\d*|\.\d+)$/;
const HEX = /(?<![&\w=])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/;
const COLOR_FN = /\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(\s*[\d.]/;
const HSL_VAR = /\bhsla?\(\s*var\(/;

/** Strip `--spacing(...)` calls, whose argument is a scale step, not a length. */
function stripSpacingCalls(v: string): string {
  return v.replace(/--spacing\([^()]*\)/g, '--spacing()');
}

/** Why an arbitrary value is not allowed, or null when it is token-built. */
export function arbitraryValueViolation(raw: string): string | null {
  // Tailwind writes spaces as underscores inside arbitrary values.
  const value = raw.replace(/_/g, ' ');
  if (HSL_VAR.test(value))
    return 'hsl() around a token: tokens are oklch, use var(--token) directly';
  if (HEX.test(value) || COLOR_FN.test(value))
    return 'color literal: use a theme color token';
  if (BARE_NUMBER.test(value))
    return 'bare number: use the scale utility (e.g. z-1, not z-[1])';
  const v = stripSpacingCalls(value);
  for (const m of v.matchAll(LENGTH)) {
    const lit = m[0].replace(/^-/, '');
    if (/^0+(\.0+)?(px|rem|em)$/.test(lit) || lit === '1px') continue;
    return `length literal ${m[0]}: use the spacing/radius/text scale or --spacing(n)`;
  }
  if (TIME.test(v)) return 'time literal: use a motion token';
  return null;
}

function closingBracket(s: string, open: number): number {
  let depth = 0;
  for (let j = open; j < s.length; j++) {
    if (s[j] === '[') depth++;
    else if (s[j] === ']' && --depth === 0) return j;
  }
  return -1;
}

/**
 * Scan one source file for arbitrary values and color literals that are not
 * token-built. Comment lines are skipped.
 */
export function findArbitraryValues(source: string): ArbitraryValueFinding[] {
  const findings: ArbitraryValueFinding[] = [];
  const lines = source.split('\n');
  lines.forEach((text, idx) => {
    const trimmed = text.trim();
    if (
      trimmed.startsWith('//') ||
      trimmed.startsWith('*') ||
      trimmed.startsWith('/*') ||
      trimmed.startsWith('<!--')
    )
      return;
    const line = idx + 1;

    for (let i = 0; i < text.length; i++) {
      if (text[i] !== '[') continue;
      const end = closingBracket(text, i);
      if (end < 0) break;
      // A trailing `/name` (group/peer name) may sit between `]` and `:`.
      let after = end + 1;
      const named = /^\/[\w-]+/.exec(text.slice(after));
      if (named) after += named[0].length;
      if (text[after] === ':') continue; // arbitrary variant: a selector, not a value

      let start = i;
      if (text[i - 1] === '-') {
        start = i - 1;
        while (start > 0 && /[a-z0-9-]/.test(text[start - 1] ?? '')) start--;
      }
      const utility = text.slice(start, i);
      const inner = text.slice(i + 1, end);
      const before = text[start - 1];
      const isUtilityValue = utility.length > 1 && utility.endsWith('-');
      const isArbitraryProperty =
        utility === '' &&
        (before === undefined || /[\s'"`:]/.test(before)) &&
        /^[a-z-]+:/.test(inner);
      if (isUtilityValue || isArbitraryProperty) {
        const value = isArbitraryProperty
          ? inner.slice(inner.indexOf(':') + 1)
          : inner;
        const reason = arbitraryValueViolation(value);
        if (reason)
          findings.push({ line, value: text.slice(start, end + 1), reason });
      }
      i = end;
    }

    // Color literals outside class strings (inline styles, computed strings).
    // Attribute selectors such as [stroke='#ccc'] match third-party markup and
    // are not styling values.
    const withoutAttrSelectors = text.replace(/\[[\w-]+=['"][^'"]*['"]\]/g, '');
    const hex = HEX.exec(withoutAttrSelectors);
    if (hex && !findings.some((f) => f.line === line))
      findings.push({
        line,
        value: hex[0],
        reason: 'color literal: use a theme color token',
      });
  });
  return findings;
}

/** Custom properties declared in a CSS file (`--name:`). */
export function declaredCustomProperties(css: string): Set<string> {
  return new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1] ?? ''));
}

/**
 * Custom properties a source file references (`var(--x)` or the Tailwind
 * shorthand `utility-(--x)`), and the ones it declares itself (style keys,
 * `[--x:...]` arbitrary properties, `[style.--x]` bindings): any `--name`
 * written outside a reference counts as a local declaration.
 */
export function customPropertyUsage(source: string): {
  references: { line: number; name: string }[];
  local: Set<string>;
} {
  const references: { line: number; name: string }[] = [];
  const local = new Set<string>();
  source.split('\n').forEach((text, idx) => {
    const trimmed = text.trim();
    if (
      trimmed.startsWith('//') ||
      trimmed.startsWith('*') ||
      trimmed.startsWith('/*')
    )
      return;
    const refRe = /(?:var\(\s*|[a-z0-9]-\()(--[\w-]+)/g;
    for (const m of text.matchAll(refRe))
    // `var(--chart-${i})`: a template prefix, not a full name.
    {
      const name = m[1] ?? '';
      if (!name.endsWith('-')) references.push({ line: idx + 1, name });
    }
    const stripped = text.replace(refRe, '');
    for (const m of stripped.matchAll(/(?<![\w-])(--[a-zA-Z][\w-]*)/g))
      local.add(m[1] ?? '');
  });
  return { references, local };
}

/** Prefixes owned by third parties or set at runtime, never by our tokens. */
export const EXTERNAL_CUSTOM_PROPERTY_PREFIXES = ['--radix-', '--tw-'];
