# Cross-framework anatomy contract

> **Source of truth.** This directory defines the _fixed anatomy_ every Gremorie
> component must follow in **both** the React (`rx-*`) and Angular (`ng-*`)
> editions. The React edition is the reference; the Angular edition must reach
> **prop/input parity** with it, adapting only the mechanics each framework
> requires (signal inputs, content projection, host bindings).
>
> The bar is the reference implementation, not "whatever is already in the repo".
> If an existing Angular component is below this contract, that is a bug to fix,
> not a pattern to keep.

## What "fixed anatomy" means

For every component the contract pins down three things, identically across
frameworks:

1. **Anatomy tree** — the subcomponents / parts and how they nest.
2. **Public surface** — every prop (React) has a matching input (Angular) with
   the same name, the same default, and equivalent semantics. Every event /
   callback has a matching output. Nothing is silently dropped.
3. **Behaviour** — the same variants, states, and a11y affordances render on
   both sides.

Adaptation table (how a React concept maps to Angular):

| React (`rx-*`)               | Angular (`ng-*`)                                                        |
| ---------------------------- | ----------------------------------------------------------------------- |
| `prop?: T` with a default    | `prop = input<T>(default)`                                              |
| required `prop: T`           | `prop = input.required<T>()`                                            |
| `children` / composition     | `<ng-content>` content projection                                       |
| `onX?: (e) => void` callback | `x = output<E>()`                                                       |
| `className`                  | host `class` (card styling moves to the host so consumer classes merge) |
| `ReactNode` label            | `string` (or projected content) label                                   |
| imperative ref method        | public method on the component instance / `exportAs`                    |

## Shared data types (charts)

These types are identical in meaning on both sides. The Angular names are
aligned to the React names.

```ts
/** One row of chart data. The optional `fill` sets a per-row (per-bar / per-slice) color. */
type ChartDatum = Record<string, string | number> & { fill?: string };
// Angular alias kept for back-compat: `Datum` === `ChartDatum`.

/** Per-series label + color. Both optional — parity with the React primitive. */
interface ChartSeriesConfig {
  label?: string; // React allows ReactNode; Angular uses string/projected
  color?: string; // CSS color or token, e.g. 'var(--chart-1)'
  format?: string; // Angular-only extension: formatter preset ('compact' | 'percent' | 'currency:BRL')
}

/** Maps a data field name to its series config. JSON-serializable (generative-UI ready). */
type ChartConfig = Record<string, ChartSeriesConfig>;
```

### ChartConfig reconciliation (the one type that diverged)

The Angular `SeriesConfigEntry` previously **required** `label` and `color`,
while the React `ChartConfig` makes both optional. That broke "same props on
both sides": a config valid in React threw in Angular. The contract resolves
this by making the Angular entry's `label` and `color` **optional** too, keeping
`format?` as a documented Angular-only extension. Charts fall back to the
cycling palette (`--chart-1..5`) and a title-cased key when they are omitted —
exactly as React does.

## Files

- [`charts.md`](./charts.md) — the 7 chart primitives (area, bar, line, scatter, pie, radar, radial).
- [`chart-artifact.md`](./chart-artifact.md) — the Chart preset of the artifact shell.
- [`assistant.md`](./assistant.md) — the composed chat / assistant surface.

## Definition of done (per component, per framework)

- [ ] Every reference prop has a matching input with the same name + default.
- [ ] Every variant and visual state from the reference renders.
- [ ] Accessible: `role="img"` figure + `sr-only` data table for charts; ARIA
      roles for interactive parts; keyboard reachable.
- [ ] Unit spec covering inputs → rendered structure (vitest).
- [ ] Story per variant; renders in the shared Storybook.
- [ ] Production build green (`nx build <pkg>`), not just dev.
- [ ] Screenshotted and visually compared against the React reference.
