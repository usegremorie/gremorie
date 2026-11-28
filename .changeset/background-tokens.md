---
'@gremorie/tokens': minor
'@gremorie/rx-forms': patch
'@gremorie/rx-ai': patch
'@gremorie/rx-display': patch
'@gremorie/rx-navigation': patch
'@gremorie/rx-overlays': patch
'@gremorie/ng-core': patch
'@gremorie/ng-forms': patch
'@gremorie/ng-ai': patch
'@gremorie/ng-artifacts': patch
'@gremorie/ng-display': patch
'@gremorie/ng-navigation': patch
'@gremorie/ng-overlays': patch
---

Background tokens: every component part paints with one semantic token, and the theme sets its value per mode.

- Hover colours are derived from the fill itself: `bg-primary-hover`, `bg-secondary-hover`, `bg-destructive-hover` and `bg-field-hover` darken on light and lighten on dark, driven by `--hover-shift` and `--hover-opacity`. No hover token per colour.
- New `--selected` (the active tab on its track); Card and PromptInput draw their contour with `--border`, plus a black and white alpha scale (`--color-black-a*`, `--color-white-a*`).
- Fields, checkboxes, radios and input groups fill with `bg-field` (the input colour at 30%) in both modes.
- `--destructive-foreground` is near-black in dark mode, so text on the lighter red fill reads.
- PromptInput fills with `--card` in both modes. No component swaps a background or ring with `dark:` any more, and none paints a background with `--foreground`.
