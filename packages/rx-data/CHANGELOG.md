# @gremorie/rx-data

## 0.3.0

### Minor Changes

- Charts, artifacts, tooltips and token refinements.

  **Charts (`@gremorie/rx-data`)**
  - The cartesian charts (`BarChart`, `AreaChart`, `LineChart`, `ScatterChart`)
    gain a `yAxis` prop (default on) — the numeric value axis is part of the
    primitive and consumers decide whether to show it.
  - Stacked bars round only the outer corners of the stack (internal divisions
    read as one bar, not stacked pills).
  - Chart tooltip radius `rounded-lg` → `rounded-sm` (6px via `--radius-sm`).

  **Chart artifact (`@gremorie/rx-artifacts`)**
  - `ChartArtifact` now supports every chart type via a `type` prop
    (`bar | area | line | pie | radar | radial | scatter`), each with a working
    chart ⇄ table toggle and downloads (previously bar-only).
  - `valueKey` accepts a string (single series) or an array of
    `{ key, label?, color? }` (multi-series). The table is wide — one column per
    series — so multi-series charts keep every value.
  - Header polish: card surface uses `--card`; header shares the card surface
    (no grey band); the featured icon is a fixed 40px square aligned to the
    heading (no longer overlaps the title); the dropdown menus drop their
    heading; header actions are responsive to the card width via a container
    query (toggle always visible; primary actions collapse into a single More
    menu below 448px and expand above it). New `ArtifactActionsExpanded` /
    `ArtifactActionsCollapsed` helpers.

  **UI tooltip (`@gremorie/rx-overlays`)**
  - `Tooltip` adopts the modern, non-inverted HoverCard/Popover surface
    (`bg-popover` + `text-popover-foreground` + border + shadow) — light on
    light, dark on dark, never inverted.

  **Tokens (`@gremorie/rx-core`)**
  - Add a `--color-gray-0` primitive (pure white). `--card` and `--popover` point
    at it on light, so elevated surfaces read as raised by color over the
    off-white (`gray-50`) page. Dark mode unchanged.

## 0.2.0

## 0.1.0

### Minor Changes

- Initial public release of Gremorie — the AI-native design system, React and Angular editions.

  Highlights since the pre-release groundwork:
  - **Angular Carousel** (`@gremorie/ng-display`) — Embla-backed slide region (gn-carousel + content + item + previous + next), mirroring the React `Carousel` (shadcn pattern).
  - **Angular InlineCitation** (`@gremorie/ng-ai`) — footnote citation with a `@spartan-ng/brain` hover-card, `gn-badge` trigger and a `gn-carousel` for multi-source detail. Mirrors the React `InlineCitation`.
  - **React Storybook** for the `rx-*` packages, with stories across every shared AI primitive (Message, Conversation, Reasoning, PromptInput family, Sources, Suggestion, Task, Tool, ChainOfThought, CodeBlock, Toolbar, InlineCitation).
  - Registry items added for `ng-carousel` and `ng-inline-citation` (installable via `gremorie add`).
