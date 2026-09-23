# @gremorie/rx-data

## 0.8.0

### Minor Changes

- 5e43998: A real categorical scale for charts: `--chart-cat-1..5`

  The `--chart-1..5` tokens were declared categorical, used as categorical, and
  built as neither. Measured against the data-viz palette checks they failed in
  both modes: `chart-3` read close to gray in light (chroma 0.07), `chart-4` and
  `chart-5` were two ambers a full-colour reader could barely tell apart (ΔE 7.4),
  and light and dark used entirely different hues — series 1 was orange in light
  and blue in dark, so a reader's colour memory died on a theme switch.

  `--chart-cat-1..5` replaces them: blue, amber, green, cyan, pink, one primitive
  family per slot, the same family in both modes with only the step changing
  (500 light, 600 dark). Every pair is checked for lightness band, chroma floor,
  separation under simulated protanopia and deuteranopia, separation for full
  colour vision, and contrast. `--chart-1..5` now alias the new scale, so nothing
  breaks.

  Five is where these ramps stop separating — a sixth family collapses against one
  of the five under colour-vision deficiency whichever one it is. Past the fifth
  series the scale repeats, which is what Notion's categorical scheme does and for
  the same reason.

  The scale is no longer themeable. Every theme was overriding it into a single
  hue family — three clay steps, five greens — which encodes order rather than
  identity and left two series differing only in lightness. Brand colour stays on
  the chrome.

- 29a979d: Radar chart: a pinned scale, a radius axis, and interaction at parity

  The Angular tooltip only fired with the pointer almost exactly on a vertex,
  because it hung invisible targets off each spoke that the series polygons then
  painted over. The active spoke now comes from the pointer's angle across the
  whole plot, the way recharts' axis-mode tooltip works, so the target is the
  entire wedge. Both editions mark the hovered spoke with a dot, and the tooltip
  is placed beside its anchor and flipped near an edge rather than parked on the
  axis label, where it covered the very dots it describes.

  New props, both editions:

  - `max` pins the top of the radial scale, defaulting to 100. **This changes
    rendering for charts whose data goes above 100** — raise `max`, or the
    polygons draw outside the outer ring. It exists because a scale derived from
    the data makes a top score of 70 fill the plot exactly like a top score of
    100, so two reports stop being comparable.
  - `ticks` sets the number of grid rings, and `radiusAxis` labels each one.
  - `labelWidth` wraps spoke labels on word boundaries; Angular also anchors each
    label by the side of the circle it sits on.
  - `dots` draws a dot at every vertex, off by default. The hovered spoke's dot
    is larger either way.
  - `fill` (`auto` | `on` | `off`) replaces behaviour that was inferred from the
    series count. `auto` keeps what React did and brings Angular to it.

  Fixes that reach every chart in the Angular edition: a row missing a series'
  key produced `NaN` in the path and the shape vanished, and number formatting
  moved to `Intl` so both editions print a value identically — which also
  corrected `compact`, where `0.125` rendered as `125M`.

  Both editions stop reusing a categorical hue past the fifth series; the
  overflow falls back to a muted neutral instead of repeating the first colour.

- db8ed7d: Radar chart: `max` accepts `'auto'`

  Pinning the scale is right when the data has a natural ceiling — a percentage,
  a 0-100 score — and wrong when it does not, where it silently draws anything
  above the top outside the outer ring. `max="auto"` follows the largest value in
  the data instead, which is what the chart did before the scale was pinned.

  The chart artifact now uses it, since it renders whatever range a model
  produced and cannot assume one.

## 0.7.0

## 0.6.0

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

### Minor Changes

- Initial public release of Gremorie — the AI-native design system, React and Angular editions.

  Highlights since the pre-release groundwork:
  - **Angular Carousel** (`@gremorie/ng-display`) — Embla-backed slide region (gn-carousel + content + item + previous + next), mirroring the React `Carousel` (shadcn pattern).
  - **Angular InlineCitation** (`@gremorie/ng-ai`) — footnote citation with a `@spartan-ng/brain` hover-card, `gn-badge` trigger and a `gn-carousel` for multi-source detail. Mirrors the React `InlineCitation`.
  - **React Storybook** for the `rx-*` packages, with stories across every shared AI primitive (Message, Conversation, Reasoning, PromptInput family, Sources, Suggestion, Task, Tool, ChainOfThought, CodeBlock, Toolbar, InlineCitation).
  - Registry items added for `ng-carousel` and `ng-inline-citation` (installable via `gremorie add`).
