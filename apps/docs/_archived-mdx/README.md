# Archived MDX content

These MDX pages depend on React components from `@kalvner/kds` (the legacy KDS
React package from the Bridge monorepo). They were archived during the Phase 2
migration of Fumadocs into the Gremorie monorepo.

When `@gremorie/react-*` is delivered in Phase 5 (registry + React generation),
this content can be rewritten against the Gremorie React packages and moved back
into `content/`.

## What's here

- `ai/` — chatbot / code / utilities / workflow component pages (each MDX imports
  demo components that consume `@kalvner/kds/...`).
- `ui/` — containers / data / display / feedback / forms / navigation / overlays
  component pages.
- `blocks/` — the blocks landing page (imports KDS card primitives).
- `tokens-primitive/colors.mdx` — primitive colour token page (imports
  `@kalvner/kds/tokens`).

## What was deleted

The React demo components in `apps/docs/components/` (`ai-*-demos.tsx`,
`chart-demos.tsx`, `navigation-demos.tsx`, `overlay-demos.tsx`) were removed
because they have no value without the underlying KDS React package. They will
be re-authored against `@gremorie/react-*` in Phase 5.

`components/token-tables.tsx` and `components/chart-scheme-swatches.tsx`
survived because they are pure presentational helpers with no KDS imports.
