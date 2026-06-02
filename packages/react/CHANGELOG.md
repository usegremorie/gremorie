# @gremorie/react

## 0.3.0

### Patch Changes

- Updated dependencies
  - @gremorie/rx-data@0.3.0
  - @gremorie/rx-overlays@0.3.0
  - @gremorie/rx-core@0.3.0
  - @gremorie/rx-ai@0.3.0
  - @gremorie/rx-display@0.3.0
  - @gremorie/rx-forms@0.3.0
  - @gremorie/rx-feedback@0.3.0
  - @gremorie/rx-containers@0.3.0
  - @gremorie/rx-navigation@0.3.0

## 0.2.0

### Minor Changes

- 2944b9d: Ship pre-compiled, self-contained CSS so components are styled on `npm i`.

  The token theme is authored as Tailwind v4 `@theme`, but a consumer app's
  bundler (Next 16 / Turbopack, Vite) does not reliably process `@theme` from an
  imported `node_modules` stylesheet — and the documented token import used a
  monorepo-relative path that 404'd in a published package. Result: components
  rendered with no brand color or radius. This release fixes that at the source.
  - **`@gremorie/react` now exports `./styles.css`** — a pre-compiled stylesheet
    carrying the design tokens (as plain `:root` custom properties) **and** every
    component's utility classes. Import it once in your app entry:
    `import "@gremorie/react/styles.css";`. No Tailwind, `@theme`, or `@source`
    config required in the consumer.
  - **`@gremorie/rx-core/styles/globals.css` is now pre-compiled too**, so the
    per-category install path is styled out of the box and no longer 404s on the
    old `../../../ng-core/styles/theme.css` relative import.
  - CSS files are marked side-effectful (`sideEffects: ["**/*.css"]`) so bundlers
    don't tree-shake the stylesheet import.

  Docs and `llms.txt` updated to the single-import flow, plus a note that
  Gremorie components are Client Components (`"use client"` in Next.js App Router).

### Patch Changes

- Updated dependencies [2944b9d]
  - @gremorie/rx-core@0.2.0
  - @gremorie/rx-ai@0.2.0
  - @gremorie/rx-display@0.2.0
  - @gremorie/rx-forms@0.2.0
  - @gremorie/rx-overlays@0.2.0
  - @gremorie/rx-feedback@0.2.0
  - @gremorie/rx-containers@0.2.0
  - @gremorie/rx-data@0.2.0
  - @gremorie/rx-navigation@0.2.0

## 0.1.0

### Patch Changes

- Updated dependencies []:
  - @gremorie/rx-core@0.1.0
  - @gremorie/rx-ai@0.1.0
  - @gremorie/rx-display@0.1.0
  - @gremorie/rx-forms@0.1.0
  - @gremorie/rx-overlays@0.1.0
  - @gremorie/rx-feedback@0.1.0
  - @gremorie/rx-containers@0.1.0
  - @gremorie/rx-data@0.1.0
  - @gremorie/rx-navigation@0.1.0
