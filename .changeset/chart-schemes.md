---
'@gremorie/tokens': minor
---

The four remaining chart schemes, and a Brand ramp

`/tokens/chart/` documented five schemes and shipped none of them — the pages
described `--color-chart-seq-*`, `-div-*`, `-status-*` and `-cmp-*` tokens that
existed nowhere in the CSS. All four now exist, in light and dark.

- **Sequential** — one hue, light to dark, read by lightness so it survives
  colour-vision deficiency by construction. Steps 200/400/600/800/950: the
  documented 600→700 measured ΔL 0.058, under the 0.06 the eye needs.
- **Divergent** — blue against red around a neutral pivot, for data with a
  meaningful middle. Inner stops moved to 300; at 200 the three central values
  sat within ΔL 0.04 and the pivot read as a brightness spike.
- **Status** — success, warning and error alias the semantic tokens rather than
  restating them, so "green means ok" has one answer. Info and neutral are new.
- **Comparison** — one highlight over neutral backdrops. The highlight is the
  brand colour, and the backdrop inverts in dark mode, where a light grey would
  read as the highlight.

`--color-brand-50..950` is new: the consumer's own colour, shipped ready so a
brand can be applied by overriding eleven steps rather than by building a ramp
first. It defaults to indigo's values — a placeholder with a real value, far
enough from `--chart-cat-1` that the two do not read as the same blue before
anyone customises anything.
