# @gremorie/ng-artifacts

## 0.11.0

### Minor Changes

- 4a6e62f: Visual refinement across the system, in both editions.

  - Surfaces: menus, selects, popovers and hover cards are translucent by default (`bg-popover-surface`, opt out with `<html data-menu="solid">`); cards drop the border for a 1px ring with a shadow (lighter in light mode); the Assistant reads on `--background` with cards in white.
  - Controls: 32px default height, filled inputs and textareas, softer secondary foreground, hover changes the background only, no negative letter-spacing.
  - Switch: 20x44 / 16x28 with 2px around a round white thumb; new `switch-checked` token (primary by default, foreground 60% in the neutral dark, each colour theme's own primary).
  - PromptInput: `layout="inline"` (one row with a "+" menu), tools collapse into an overflow menu (`collapse`, `PromptInputToolsExpanded` / `Collapsed`), action menu submenus, radio, checkbox, switch and separator parts, `PromptInputSubmit` `label`. Angular: the action menu is now a compound (`ariaLabel` and `tooltip` live on `prompt-input-action-menu-trigger`).
  - Assistant: `composerLayout`, `toolsCollapse`; the conversation reads in a centred column of at most 768px.
  - Charts and artifacts: `BarChart` `maxBarSize` (default 48); the chart in `ChartArtifact` keeps 16:9 up to 288px and drops its own frame; `CodeBlockCopyButton` `tooltip`; code blocks show scrollbars on hover; the artifact view toggle shows its selected state.
  - Fixes: Toggle shows its on state under a Tooltip; Angular `Label` no longer draws a passed box twice; Angular `RadioGroupItem` keeps its 16px size in flex rows; React gains `PromptInputActionMenuSeparator`.

## 0.10.0

## 0.9.0

## 0.8.0

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
