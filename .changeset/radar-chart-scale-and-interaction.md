---
'@gremorie/rx-data': minor
'@gremorie/ng-data': minor
---

Radar chart: a pinned scale, a radius axis, and interaction at parity

The Angular tooltip only fired with the pointer almost exactly on a vertex,
because it hung invisible targets off each spoke that the series polygons then
painted over. The active spoke now comes from the pointer's angle across the
whole plot, the way recharts' axis-mode tooltip works, so the target is the
entire wedge. Both editions mark the hovered spoke with a dot, and the tooltip
is placed beside its anchor and flipped near an edge rather than parked on the
axis label, where it covered the very dots it describes.

New props, both editions:

- `max` pins the top of the radial scale, defaulting to 100. **This changes
  rendering for charts whose data goes above 100** — raise `max`, or the
  polygons draw outside the outer ring. It exists because a scale derived from
  the data makes a top score of 70 fill the plot exactly like a top score of
  100, so two reports stop being comparable.
- `ticks` sets the number of grid rings, and `radiusAxis` labels each one.
- `labelWidth` wraps spoke labels on word boundaries; Angular also anchors each
  label by the side of the circle it sits on.
- `dots` draws a dot at every vertex, off by default. The hovered spoke's dot
  is larger either way.
- `fill` (`auto` | `on` | `off`) replaces behaviour that was inferred from the
  series count. `auto` keeps what React did and brings Angular to it.

Fixes that reach every chart in the Angular edition: a row missing a series'
key produced `NaN` in the path and the shape vanished, and number formatting
moved to `Intl` so both editions print a value identically — which also
corrected `compact`, where `0.125` rendered as `125M`.

Both editions stop reusing a categorical hue past the fifth series; the
overflow falls back to a muted neutral instead of repeating the first colour.
