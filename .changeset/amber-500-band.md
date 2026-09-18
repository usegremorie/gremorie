---
'@gremorie/tokens': patch
---

Nudge `amber-500` inside the chart lightness band

`oklch(76.9% …)` quantises to L 0.7724 in 8-bit sRGB, just over the 0.77
ceiling a categorical chart slot has to sit under — so the colour on screen
failed a check the declared value appeared to pass. 76.6% lands at 0.7682 with
margin. The shift is one step in the blue channel (`#fe9a00` → `#fc9900`), and
`--warning`, the only other token on this step, keeps 9.14:1 against its
foreground where the floor is 4.5.

With this the categorical scale passes every check in both modes.
