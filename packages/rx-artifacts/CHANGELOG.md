# @gremorie/rx-artifacts

## 0.5.1

### Patch Changes

- Security and packaging hardening.
  - **ng-ai**: fix a stored XSS in `MessageResponse` — model markdown was rendered
    through `marked` and `bypassSecurityTrustHtml`, bypassing Angular's sanitizer.
    Output is now sanitized. (GHSA-6546-2p2g-rxhq)
  - **rx-core**: remove React and Storybook from runtime `dependencies` so
    consumers no longer get a duplicate React install.
  - **rx-data**: validate series color/key before interpolating into the chart
    `<style>` block, closing a CSS/HTML injection vector on model-supplied data.
  - **rx-artifacts / ng-artifacts**: drop `allow-same-origin` from the WebPreview
    iframe sandbox and validate iframe/citation URL schemes.
  - **rx-ai**: scheme-validate citation `href`s (blocks `javascript:`).
  - **ng-ai / ng-artifacts / ng-data / ng-navigation**: remove build-only tooling
    (`vite`, `@nx/vite`, `@analogjs/*`, `@angular/compiler`) from
    `peerDependencies`; consumers no longer see spurious unmet-peer warnings.

## 0.4.0

### Minor Changes

- rx-ai AI Elements fidelity reimport, theming fixes (named themes in light mode, clay scale on the Claude brand), Fumadocs AI section + Storybook regroup, the component-docs audit, and the tabbed Preview/Code docs surface (ComponentPreview with build-time source extraction) on every component page.

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
