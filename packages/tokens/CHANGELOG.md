# @gremorie/tokens

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
