# Gremorie — agent working agreement

Read this before writing code or docs. It is loaded by Claude Code, Cursor and
any agent that respects `AGENTS.md`. The user's explicit instructions always win
over this file; this file wins over an agent's defaults.

## The one rule that keeps getting broken: reference-first, not local-first

Gremorie is a portfolio-grade product. The bar is the **market reference**, not
"whatever is already in the repo".

When a component, doc, or pattern has a canonical implementation in the
ecosystem, **match that reference**:

- UI components → [Vercel AI Elements](https://elements.ai-sdk.dev),
  [shadcn/ui](https://ui.shadcn.com), [Radix Primitives](https://www.radix-ui.com/primitives)
- Component docs → AI Elements / shadcn docs (tabbed **Preview | Code**, real
  source, copyable)
- Interaction / a11y → [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines), WCAG 2.2 AA

**Do NOT copy the local convention when it is below the reference.** If the
existing code does something weaker than the reference, that is a bug to fix,
not a pattern to propagate. Stop, say so, and propose upgrading to the reference
— never silently spread the inferior pattern to new files.

> This rule exists because the repeated failure mode here has been: an agent
> looks at the existing (weaker) pattern, calls it "the established convention",
> and replicates it — instead of comparing against AI Elements/shadcn and
> matching the better bar. Treating "consistency with existing code" as the
> ceiling is the mistake. Consistency is for details; the reference is the bar.

## Definition of Done

A task is done when it reaches **parity with the reference**, not when the build
is green. Green build is the floor, not the finish line.

Before claiming something is done:

1. **Compare against the reference implementation** (feature + UX parity). If
   the result is below it, it is not done — flag the gap.
2. **Run the production build**, not just the dev server. `next dev` skips
   `tsc`; only `next build` (or `nx build`) catches type errors. For the docs:
   `cd apps/docs && npx next build` must be green (compiled + static pages, zero
   new warnings).
3. **Verify behaviour**, not just compilation — screenshot the rendered result
   for UI work.
4. **Proactively flag** anywhere the local pattern is below the reference, even
   if it is outside the immediate task. Do not make the user discover it.

## Concrete standards (current)

- **Component docs (`apps/docs`)**: every component page shows an interactive
  **Preview | Code** tabbed surface via `<ComponentPreview name="…">`
  (`apps/docs/components/component-preview.tsx`). The Code tab shows the REAL
  source of the rendered example, read from disk at build time — never a
  hand-duplicated snippet (that drifts). Each example is a self-contained file
  under `apps/docs/components/preview/<area>/<component>.tsx`. This mirrors the
  AI Elements / shadcn pattern. A `## Preview` that only renders, with the code
  in a separate hand-written section, is below the bar.
- **rx-ai / AI components**: faithful to the official AI Elements source (names,
  subcomponents, variants, behaviour), adapted to Gremorie primitives + tokens.
- **Storybook**: titles mirror the docs nav (`<Section>/<Category>/<Name>`).
- **No em dashes** in written content. **Never push to `main`. Never publish**
  (the user runs publishes). Branch off `develop`. Install with
  `npm install --legacy-peer-deps`.

## Where the deeper standards live

- Binary docs checklist + template: `apps/docs/content/platform/internal/documentation-standard.mdx`
- Vault (source of truth): `missions/kal/gremorie/guidelines/` in the Kalvnor vault.
