---
'@gremorie/tokens': minor
'@gremorie/rx-data': minor
'@gremorie/ng-data': minor
---

A real categorical scale for charts: `--chart-cat-1..5`

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
