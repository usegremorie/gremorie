---
'@gremorie/color': minor
'@gremorie/rx-forms': minor
'@gremorie/ng-forms': minor
---

ColorPicker in both editions.

- New `ColorPicker` (rx-forms) and `gr-color-picker` (ng-forms) with the same parts: area, channel sliders for hue, alpha, lightness and chroma, a text field in oklch, hex, rgb or hsl, format select, eye dropper where the browser has one, swatches and saved colours. Popover or `inline`; the Angular edition also works with `formControl` and `ngModel`.
- Values stay in OKLCH while editing, so a colour keeps its hue at chroma 0 and wide-gamut choices are not lost; hex, rgb and hsl print the closest sRGB colour.
- New `@gremorie/color` package with the shared logic (colour model, keyboard steps, area geometry, saved colours), installed with the component.
