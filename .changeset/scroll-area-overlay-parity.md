---
'@gremorie/ng-containers': minor
'@gremorie/tokens': minor
---

Consistent, themed scrollbars across both editions.

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
