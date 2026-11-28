---
'@gremorie/tokens': minor
'@gremorie/rx-overlays': minor
'@gremorie/ng-overlays': minor
'@gremorie/rx-navigation': patch
---

Appearance presets and a responsive drawer.

- Tokens: three optional attributes on `<html>`. `data-accent` (neutral, violet, blue, teal, green, orange, rose, red or `custom` with your own `--seed`) moves primary, ring and the checked switch onto the colour's scale (`--seed-50` to `--seed-950`); `data-translucency` switches floating surfaces between `solid`, `subtle` (default) and `immersive` (page on the colour, translucent surfaces); `data-tonal="on"` tints the neutral semantics with the colour's hue. `data-menu="solid"` stays as an alias.
- `useIsMobile()` (rx-overlays) and `injectIsMobile()` (ng-overlays) to open a menu as a popover on desktop and a bottom drawer on a phone; the Drawer page documents the pattern.
- Angular Drawer now drags to dismiss, built on the brain Drawer. Breaking for Angular: set `direction` on `gr-drawer` (was `side`) and render the panel from `<ng-template brnDrawerContent>`.
- The React sidebar uses the shared `useIsMobile`.
