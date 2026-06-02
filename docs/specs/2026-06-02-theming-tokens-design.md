# Theming and Tokens v2: neutral token package, shadcn/tweakcn vocabulary, multi-theme

Date: 2026-06-02
Status: approved design, ready for implementation plan

## Context

Gremorie ships a React edition (`rx-*`) and an Angular edition (`ng-*`) that
share one CSS token source. Today that source lives inside the Angular package
at `packages/ng-core/styles/theme.css`, and the React side imports into it
(`rx-core` does `@import '../../ng-core/styles/theme.css'`). It works, but the
token layer does not belong to a framework, so this coupling is wrong.

The token model already has good bones:

- The full Tailwind v4 palette is present as primitives (21 families, 50..950),
  plus four custom dessaturated families (taupe, mauve, olive, mist).
- Semantics reference primitives, and the file states the rule explicitly:
  "consume via semantics, components never read primitives directly."
- Radius is tokenized (`--radius-base` and derived steps).

Three gaps motivate this work:

1. A leftover `--brand*` accent layer (a violet palette plus four semantic
   tokens) sits on top of shadcn. It is consumed by exactly one component
   (`FeaturedIcon`, via the `brand` color variant) and the `Artifact` that uses
   it. We want shadcn-pure tokens. Brand color, when wanted, is applied the
   shadcn way: by changing `--primary`, `--accent`, and friends through a theme.
2. There is no multi-theme system. Only light and dark exist, via the `.dark`
   class. We want named themes (Claude, ChatGPT, and so on).
3. Fonts are not tokenized. There is no `--font-sans/serif/mono`, so a theme
   cannot change typography today.

## Goals

- Extract the token layer into a neutral, framework-free package
  `@gremorie/tokens`. React and Angular both consume it as equals. The token
  source no longer lives inside `ng-core`.
- Remove the `--brand*` layer; `FeaturedIcon` `brand` variant uses `--primary`.
- Adopt the shadcn plus tweakcn token vocabulary as the theme contract (we do
  not invent tokens). A theme may change colors, radius, fonts, shadows, and
  spacing/tracking.
- Keep the two-tier model the user requires: semantic tokens reference color
  primitives; components read semantics only.
- Ship six themes out of the box: Gremorie (default, mirrors Fumadocs in color
  and font), Claude, ChatGPT, Gemini, Perplexity, Mistral.
- One source of truth, consumed identically by `rx-*` and `ng-*`.

## Non-goals

- No component API changes beyond the `FeaturedIcon` `brand` variant rewiring.
- No theme editor UI in this work (the token-engine generating themes from data
  is a future evolution).
- No new npm release or production publish as part of this spec; that is a
  separate decision after implementation.

## Decisions (approved)

1. Neutral package `@gremorie/tokens`, framework-free, CSS only. It is the
   single source of truth. No `theme.css` remains inside `ng-core` (clean path,
   no compatibility shim).
2. Theme files are modular: one file per theme.
3. The default (Gremorie) mirrors the Fumadocs default theme in both color and
   font.
4. Remove `--brand*` and the `--color-brand-*` primitive palette.
5. Theme scope equals the tweakcn set: semantic colors, `--radius`,
   `--font-sans/serif/mono`, the `--shadow-*` set, and `--spacing`,
   `--tracking-normal`.
6. Brand-color strategy is pragmatic: create a custom 50..950 scale only when no
   close primitive exists (Claude clay). Other themes map to existing
   primitives.

## Architecture

### Package: @gremorie/tokens

A new package `packages/tokens` publishing pure CSS. No TypeScript, no build of
code. Proposed layout:

```
packages/tokens/
  package.json          name: @gremorie/tokens, exports "./theme.css" and "./themes/*"
  styles/
    theme.css           primitives + default semantics (:root/.dark) + @theme inline
    themes/
      claude.css
      chatgpt.css
      gemini.css
      perplexity.css
      mistral.css
```

`theme.css` is the entry: it defines all primitives, the default (Gremorie)
semantics in `:root` and `.dark`, the `@theme inline` map, the base layer, and
it imports the theme files from `themes/`.

Consumers import one path:

```css
@import '@gremorie/tokens/theme.css';
```

### Token layers

```
Primitive (Tailwind palette + customs)   Semantic (per theme)            Utility (@theme inline)
--color-orange-600: oklch(...)      ->   --primary: var(--color-...)  -> --color-primary: var(--primary)
```

Components consume semantics and utilities only. Primitives are never read by
components.

### Theme mechanism

- Default lives in `:root` (light) and `.dark` (dark), unchanged conceptually.
- Each named theme is a pair of blocks: `[data-theme="claude"]` (light) and
  `[data-theme="claude"].dark` (dark).
- The host turns a theme on with an attribute on the root element
  (`<html data-theme="claude">`) and dark mode with the existing `.dark` class.
  Identical in React and Angular.
- A theme block redefines the tweakcn set: semantic colors, `--radius`, the
  three font tokens, the shadow set, and spacing/tracking. Color values point at
  primitives.

### Theme scope (tweakcn contract)

Colors: `background`, `foreground`, `card(+foreground)`, `popover(+foreground)`,
`primary(+foreground)`, `secondary(+foreground)`, `muted(+foreground)`,
`accent(+foreground)`, `destructive(+foreground)`, `border`, `input`, `ring`,
`chart-1..5`, and the `sidebar-*` family.
Radius: `--radius`.
Typography: `--font-sans`, `--font-serif`, `--font-mono`.
Shadow: the `--shadow-*` set.
Spacing and tracking: `--spacing`, `--tracking-normal`.

Tokens missing today that we add: the three font tokens, and any of
`sidebar-*` / `--shadow-*` / `--spacing` / `--tracking-normal` not yet present.

## Removing the brand layer

- Delete the `--color-brand-50..950` primitive palette.
- Delete the semantic tokens `--brand`, `--brand-foreground`, `--brand-subtle`,
  `--brand-muted`, and their `@theme inline` mappings.
- `FeaturedIcon`: the `brand` color variant maps to `--primary` based utilities
  (`bg-primary/10 text-primary`, filled `bg-primary text-primary-foreground`,
  outline `border-primary/30 text-primary`). Visual parity is acceptable since
  in the default theme `--primary` is the neutral graphite, and themed builds
  recolor it for free.
- The `Artifact` keeps using `FeaturedIcon` and needs no change.

## The six themes

Exact brand values are confirmed against official sources during
implementation. Direction:

| Theme              | Light primary direction | Font                     | Custom scale     |
| ------------------ | ----------------------- | ------------------------ | ---------------- |
| Gremorie (default) | Fumadocs neutral        | Fumadocs font            | none             |
| Claude             | clay (coral terracotta) | serif display, sans body | `--color-clay-*` |
| ChatGPT            | emerald/graphite, flat  | neutral sans             | none (emerald)   |
| Gemini             | indigo                  | neutral sans             | none (indigo)    |
| Perplexity         | teal/petrol             | neutral sans             | none (teal)      |
| Mistral            | orange/flame            | neutral sans             | none (orange)    |

Only Claude introduces a new primitive family (`clay`), a full 50..950 OKLCH
scale in the same cadence as the existing customs. All other themes map to
primitives that already exist.

## Import migration (clean path)

`theme.css` exists only in `@gremorie/tokens`. Update every consumer:

- `packages/rx-core/styles/globals.src.css`: import `@gremorie/tokens/theme.css`
  (drop the `../../ng-core` relative import). The compiled `globals.css` output
  is unchanged in shape.
- `packages/react/styles/gremorie.css`: same swap.
- `packages/docs/src/styles.css` and `packages/playground/src/styles.css`: same.
- `packages/cli` `init`: inject `@import '@gremorie/tokens/theme.css';` and treat
  the old `@gremorie/ng-core/theme.css` line as legacy (still detected so an
  existing project is not double-imported).
- `ng-core`: drop `styles/theme.css` and the `./theme.css` export and the
  `ng-package.json` asset. `ng-core` becomes components only.
- Docs content that references the import path (`theme.page.ts`) updates to the
  new path.
- Add `@gremorie/tokens` as a dependency where the import resolution requires it
  (rx-core, ng-core peers, docs, playground).

## Single source for rx and ng

After this change, both editions import `@gremorie/tokens/theme.css`. Any theme
added to `@gremorie/tokens/themes/` is available to React and Angular with no
duplication. This is the core property the user asked for.

## Verification

- Build: `@gremorie/tokens` is published as static CSS; `rx-core` precompiles
  from it; `nx build` is green for affected projects.
- Visual: in Storybook and docs, switching `data-theme` plus `.dark` recolors
  primary/secondary/accent/border, changes radius, font, and shadow, with no
  component edits.
- Grep gate: no remaining references to `--brand`, `--color-brand-`, or
  `ng-core/theme.css` after migration.
- Lint, format, and test green across the monorepo.

## Risks and mitigations

- Brand-color fidelity: official hex values per brand are verified in
  implementation; the `clay` scale is tuned against Claude's real coral.
- Consumer breakage: this is pre 1.0 and we control consumers; the import path
  change is intentional and documented in the docs and CLI.
- tweakcn token completeness: we add the missing tokens (fonts, sidebar, shadow,
  spacing) so the contract is whole before authoring themes.

## Open implementation questions (resolved during planning, not blocking)

- Exact Fumadocs default color and font values for the Gremorie theme.
- Exact per-brand palettes and the `clay` scale ramp.
- Whether `sidebar-*` is consumed by any current component (the Sidebar lives in
  `rx-navigation`); confirm and wire its tokens.
