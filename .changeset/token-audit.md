---
'@gremorie/tokens': minor
'@gremorie/rx-ai': patch
'@gremorie/ng-ai': patch
'@gremorie/rx-artifacts': patch
'@gremorie/ng-artifacts': patch
'@gremorie/rx-containers': patch
'@gremorie/rx-data': patch
'@gremorie/ng-data': patch
'@gremorie/rx-display': patch
'@gremorie/ng-display': patch
'@gremorie/rx-feedback': patch
'@gremorie/rx-forms': patch
'@gremorie/ng-forms': patch
'@gremorie/rx-navigation': patch
'@gremorie/ng-navigation': patch
'@gremorie/rx-overlays': patch
'@gremorie/ng-overlays': patch
---

Components in both editions style with tokens instead of hard-coded values.

- New tokens: `--radius-xs` (`calc(var(--radius-base) * 0.2)`, `rounded-xs`), `--text-2xs` (0.625rem, `text-2xs`), `--animate-pop-in` and `--animate-fade-in`.
- Checkbox corners use `rounded-xs` (2px at the default base, was 4px). Chart-artifact legend swatches go from 3px to `rounded-xs`.
- InputGroup addon `kbd`, InputGroup `xs`/`icon-xs` buttons and the Angular PromptInput header/footer referenced an undefined `--radius`, which rendered square corners; they now use `rounded-sm`.
- The Toaster (Sonner) set `--border-radius: var(--radius)`, an undefined token, so toasts had square corners; both editions now use `var(--radius-md)`, like Popover and DropdownMenu.
- The outline SidebarMenuButton wrapped its oklch border token in `hsl()`, which dropped the outline; it now uses the token directly.
- Pixel values moved to the spacing scale with the same rendered size (`ring-3`, `min-w-32`, `w-60`, `text-2xs`, ...); InputGroup negative offsets snap to the scale (under 1px of difference).
