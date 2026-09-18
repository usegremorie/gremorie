---
'@gremorie/rx-data': minor
'@gremorie/ng-data': minor
'@gremorie/rx-artifacts': patch
---

Radar chart: `max` accepts `'auto'`

Pinning the scale is right when the data has a natural ceiling — a percentage,
a 0-100 score — and wrong when it does not, where it silently draws anything
above the top outside the outer ring. `max="auto"` follows the largest value in
the data instead, which is what the chart did before the scale was pinned.

The chart artifact now uses it, since it renders whatever range a model
produced and cannot assume one.
