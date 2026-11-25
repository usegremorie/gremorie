/**
 * Background role guard. A component paints each part with ONE semantic token
 * of the right role, and the theme picks that token's value per mode. This
 * module finds the classes that break that contract, so the drift gate in
 * `background-roles.spec.ts` can fail with file:line:
 *
 * - `dark:` swapping a background, ring or input border: the token layer owns
 *   the dark value, not the component;
 * - `--foreground` (text and icons) used as a background or ring colour;
 * - hover by opacity on a fill (`hover:bg-primary/90`): it lightens on a light
 *   page instead of darkening. Use the derived `*-hover` utilities;
 * - `bg-input/NN`: the field fill is `bg-field` (input at 30%, both modes);
 * - a component redefining `--accent` or `--muted`.
 */

export interface BackgroundRoleFinding {
  /** 1-based line number. */
  line: number;
  /** The offending class, as written. */
  value: string;
  /** Why it is not allowed. */
  reason: string;
}

/** Split a class at its top-level `:` into variants and the utility. */
function parts(cls: string): { variants: string[]; utility: string } {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of cls) {
    if (ch === '[' || ch === '(') depth++;
    if (ch === ']' || ch === ')') depth--;
    if (ch === ':' && depth === 0) {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  return { variants: out, utility: cur };
}

const HOVER_LIKE =
  /^(hover|aria-expanded|data-\[state=open\]|focus|focus-visible|active)$/;

/** Why a class breaks the background roles, or null when it is fine. */
export function backgroundRoleViolation(cls: string): string | null {
  const { variants, utility } = parts(cls.replace(/^!/, ''));
  const u = utility.replace(/^!/, '');
  if (
    variants.includes('dark') &&
    (/^bg-/.test(u) ||
      /^ring-(?!offset|\d|inset)/.test(u) ||
      u === 'border-input')
  )
    return 'dark: swaps a token inside the component: the token layer sets the dark value';
  if (/^bg-foreground(\/|$)/.test(u))
    return 'foreground is text and icon colour, not a background';
  if (/^ring-foreground(\/|$)/.test(u))
    return 'foreground is text and icon colour, not a contour: use ring-edge';
  // A light wash (destructive/10 on a focused menu item) is a tint, not a
  // fill's hover; a fill's own colour at 50% or more is.
  const fill = /^bg-(primary|secondary|destructive)\/(\d+)$/.exec(u);
  if (fill && Number(fill[2]) >= 50 && variants.some((v) => HOVER_LIKE.test(v)))
    return 'hover by opacity lightens on a light page: use the *-hover utility';
  if (/^bg-input\/\d+$/.test(u))
    return 'field fill is bg-field (input at 30% in both modes)';
  return null;
}

const CLASS_TOKEN = /[^\s'"`,{}()<>]+(?:\([^)\s]*\))?[^\s'"`,{}<>]*/g;

/**
 * Scan one source file for background role violations. Comment lines are
 * skipped.
 */
export function findBackgroundRoleViolations(
  source: string,
): BackgroundRoleFinding[] {
  const findings: BackgroundRoleFinding[] = [];
  source.split('\n').forEach((text, idx) => {
    const trimmed = text.trim();
    if (
      trimmed.startsWith('//') ||
      trimmed.startsWith('*') ||
      trimmed.startsWith('/*') ||
      trimmed.startsWith('<!--')
    )
      return;
    const line = idx + 1;
    for (const m of text.matchAll(/--(accent|muted):/g))
      findings.push({
        line,
        value: m[0],
        reason: 'components must not redefine a semantic token',
      });
    for (const m of text.matchAll(CLASS_TOKEN)) {
      const reason = backgroundRoleViolation(m[0]);
      if (reason) findings.push({ line, value: m[0], reason });
    }
  });
  return findings;
}
