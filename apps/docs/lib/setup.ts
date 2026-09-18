/**
 * Single source of truth for the per-edition styling prerequisites.
 *
 * The two editions are asymmetric and the asymmetry is the whole point:
 *
 * - **React** ships a pre-compiled stylesheet (tokens + every component's
 *   styles). One import and you are done — no Tailwind in the consumer project.
 * - **Angular** emits Tailwind utility classes and ships no compiled CSS, so
 *   the consumer needs Tailwind v4 *and* an `@source` line pointing at the
 *   `@gremorie` packages. Tailwind v4 skips `node_modules` by default, so
 *   without that line none of the components' classes reach the compiled CSS
 *   and every component renders completely unstyled.
 *
 * That `@source` line is the single most common way an Angular install fails,
 * and it is invisible from the component source alone — which is why this
 * module feeds all three consumer-facing surfaces rather than living as prose
 * in one of them:
 *
 * - the `<AngularSetup />` MDX component on every Angular component page,
 * - the `llms.txt` install section,
 * - the MCP `get_setup` tool.
 *
 * Change the setup here and all three follow.
 */

export type Edition = 'rx' | 'ng';

export interface EditionSetup {
  /** Human label for the edition. */
  label: string;
  /** File the snippet belongs in, shown as the code block's title. */
  file: string;
  /** Language tag for syntax highlighting. */
  lang: string;
  /** The snippet the consumer must add. */
  code: string;
  /** One-line summary, used as the lead in docs and as the MCP summary. */
  summary: string;
  /** Extra requirements worth stating outright (empty for React). */
  requirements: readonly string[];
}

export const SETUP: Record<Edition, EditionSetup> = {
  rx: {
    label: 'React',
    file: 'app/layout.tsx (Next.js) or src/main.tsx (Vite)',
    lang: 'tsx',
    code: `// Once, in your app entry. Ships tokens + every component's styles,
// so you do NOT need Tailwind, @theme or @source in your project.
import '@gremorie/react/styles.css';`,
    summary:
      'React ships a pre-compiled stylesheet — import it once in your app entry and no Tailwind setup is required.',
    requirements: [],
  },
  ng: {
    label: 'Angular',
    file: 'src/styles.css',
    lang: 'css',
    code: `@import 'tailwindcss';
@import '@gremorie/tokens/theme.css';

/* Required. Tailwind v4 skips node_modules by default, so without this line
   the components' utility classes never reach your compiled CSS and every
   Gremorie component renders unstyled. */
@source '../node_modules/@gremorie';`,
    summary:
      'Angular components emit Tailwind utility classes and ship no compiled CSS, so the consumer project needs Tailwind CSS v4, the tokens theme, and an @source line covering the @gremorie packages.',
    requirements: [
      'Tailwind CSS v4 in the consumer project.',
      "The `@source '../node_modules/@gremorie'` line — without it Tailwind ignores node_modules and the component renders with no styles at all.",
      'Adjust the relative path in `@source` if your stylesheet is not at `src/styles.css`.',
    ],
  },
};

/** Plain-text rendering of an edition's setup, for llms.txt and MCP. */
export function setupAsText(edition: Edition): string {
  const s = SETUP[edition];
  const lines = [
    `${s.label} setup — ${s.summary}`,
    '',
    `File: ${s.file}`,
    '',
    '```' + s.lang,
    s.code,
    '```',
  ];
  if (s.requirements.length > 0) {
    lines.push('', 'Requirements:');
    for (const r of s.requirements) lines.push(`- ${r}`);
  }
  return lines.join('\n');
}
