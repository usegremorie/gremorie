# @gremorie/tokens

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

- 5e43998: The four remaining chart schemes, and a Brand ramp

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

### Patch Changes

- 5e43998: Nudge `amber-500` inside the chart lightness band

  `oklch(76.9% …)` quantises to L 0.7724 in 8-bit sRGB, just over the 0.77
  ceiling a categorical chart slot has to sit under — so the colour on screen
  failed a check the declared value appeared to pass. 76.6% lands at 0.7682 with
  margin. The shift is one step in the blue channel (`#fe9a00` → `#fc9900`), and
  `--warning`, the only other token on this step, keeps 9.14:1 against its
  foreground where the floor is 4.5.

  With this the categorical scale passes every check in both modes.

## 0.7.0

### Minor Changes

- b6ca882: Badge: add `warning` (amber) and `success` (green) status variants

  The Badge now ships the full trio of status fills — `destructive` (error),
  `warning` (attention) and `success` (ok) — so a state chip (e.g. a 50/30/20
  budget "Ok / Attention / Over" indicator) no longer has to fall back to
  `secondary`/`default`. Both editions get the variants (React
  `@gremorie/rx-display`, Angular `@gremorie/ng-display`); the shared Badge
  contract is updated to match.

  Tokens: adds semantic `--warning` / `--warning-foreground` (amber, bound to the
  `amber-500`/`amber-400` primitives) and rebinds `--success` to the `green-700`
  (light) / `green-400` (dark) primitives so the solid fill clears **WCAG AA
  4.5:1** for small text in both themes — the previous hand-tuned `--success`
  value failed contrast in light mode. `FeaturedIcon`'s `success` variant
  inherits the fix.

## 0.6.0

### Minor Changes

- ae4db57: Consistent, themed scrollbars across both editions.

  - **`@gremorie/tokens`**: adds a scrollbar baseline (`scrollbar-width: thin` +
    `scrollbar-color` on the `--border` token). Every scroll area in both the React
    and Angular editions inherits a thin, themed bar automatically — no
    per-component wiring — and it re-themes in light and dark.
  - **`@gremorie/ng-containers`**: `ScrollArea` is now a real component,
    `<gr-scroll-area>`, at name, anatomy and behaviour parity with React's
    `<ScrollArea>`. It renders its own overlay scrollbar (the bar floats over the
    content, takes no layout space, fades in on hover) with a draggable thumb and
    click-to-jump on the track.

    **Breaking (surface):** the previous `ng-scrollbar[gremorie]` directive is
    gone — use `<gr-scroll-area class="h-64 w-56 rounded-md border">` instead. The
    `ngx-scrollbar` peer dependency was removed (it has no Angular 21 release and
    never initialised, so the overlay never actually rendered).

## 0.5.1
