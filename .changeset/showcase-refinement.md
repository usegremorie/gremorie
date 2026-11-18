---
'@gremorie/tokens': minor
'@gremorie/rx-ai': minor
'@gremorie/rx-artifacts': minor
'@gremorie/rx-data': minor
'@gremorie/rx-display': minor
'@gremorie/rx-feedback': minor
'@gremorie/rx-forms': minor
'@gremorie/rx-navigation': minor
'@gremorie/rx-overlays': minor
'@gremorie/ng-ai': minor
'@gremorie/ng-artifacts': minor
'@gremorie/ng-core': minor
'@gremorie/ng-data': minor
'@gremorie/ng-display': minor
'@gremorie/ng-feedback': minor
'@gremorie/ng-forms': minor
'@gremorie/ng-navigation': minor
'@gremorie/ng-overlays': minor
---

Visual refinement across the system, in both editions.

- Surfaces: menus, selects, popovers and hover cards are translucent by default (`bg-popover-surface`, opt out with `<html data-menu="solid">`); cards drop the border for a 1px ring with a shadow (lighter in light mode); the Assistant reads on `--background` with cards in white.
- Controls: 32px default height, filled inputs and textareas, softer secondary foreground, hover changes the background only, no negative letter-spacing.
- Switch: 20x44 / 16x28 with 2px around a round white thumb; new `switch-checked` token (primary by default, foreground 60% in the neutral dark, each colour theme's own primary).
- PromptInput: `layout="inline"` (one row with a "+" menu), tools collapse into an overflow menu (`collapse`, `PromptInputToolsExpanded` / `Collapsed`), action menu submenus, radio, checkbox, switch and separator parts, `PromptInputSubmit` `label`. Angular: the action menu is now a compound (`ariaLabel` and `tooltip` live on `prompt-input-action-menu-trigger`).
- Assistant: `composerLayout`, `toolsCollapse`; the conversation reads in a centred column of at most 768px.
- Charts and artifacts: `BarChart` `maxBarSize` (default 48); the chart in `ChartArtifact` keeps 16:9 up to 288px and drops its own frame; `CodeBlockCopyButton` `tooltip`; code blocks show scrollbars on hover; the artifact view toggle shows its selected state.
- Fixes: Toggle shows its on state under a Tooltip; Angular `Label` no longer draws a passed box twice; Angular `RadioGroupItem` keeps its 16px size in flex rows; React gains `PromptInputActionMenuSeparator`.
