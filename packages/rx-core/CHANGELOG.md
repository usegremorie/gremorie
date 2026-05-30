# @gremorie/rx-core

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

## 0.1.0

### Minor Changes

- Initial public release of Gremorie — the AI-native design system, React and Angular editions.

  Highlights since the pre-release groundwork:
  - **Angular Carousel** (`@gremorie/ng-display`) — Embla-backed slide region (gn-carousel + content + item + previous + next), mirroring the React `Carousel` (shadcn pattern).
  - **Angular InlineCitation** (`@gremorie/ng-ai`) — footnote citation with a `@spartan-ng/brain` hover-card, `gn-badge` trigger and a `gn-carousel` for multi-source detail. Mirrors the React `InlineCitation`.
  - **React Storybook** for the `rx-*` packages, with stories across every shared AI primitive (Message, Conversation, Reasoning, PromptInput family, Sources, Suggestion, Task, Tool, ChainOfThought, CodeBlock, Toolbar, InlineCitation).
  - Registry items added for `ng-carousel` and `ng-inline-citation` (installable via `gremorie add`).
