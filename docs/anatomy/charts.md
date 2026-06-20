# Chart primitives — fixed anatomy

Seven chart primitives. React (`@gremorie/rx-data`) is the reference; Angular
(`@gremorie/ng-data`) must match input-for-input. React renders with recharts
inside the shadcn `chart` primitive; Angular renders headless d3 geometry inside
a styled SVG. **The rendering engine differs; the public surface does not.**

Shared rules for all seven:

- **Card surface**: rounded `border bg-card` card with internal padding; the
  chart fills it via `aspect-video` (cartesian) or `aspect-square max-h-[250px]`
  (polar). React puts this on `ChartContainer`; Angular puts it on the host so
  `class` merges.
- **Colors**: each series key resolves to `var(--color-<key>)` from `config`,
  falling back to the cycling palette `--chart-1..5`. Per-row `fill` overrides
  for categorical single-series charts.
- **Tooltip**: hover tooltip on by default (`tooltip` input). Angular implements
  it with a pointer-tracking overlay (the React side gets it from recharts).
- **Accessibility**: `role="img"` + computed `aria-label`, plus an `sr-only`
  `<table>` mirroring the data. Both editions ship this.

## Anatomy tree (shared)

```
<area|bar|line|scatter-chart>           cartesian family
└─ figure (role="img")                  card surface, host on NG
   ├─ svg (chart frame)
   │  ├─ cartesian grid
   │  ├─ x axis (category or numeric)
   │  ├─ y axis (numeric, optional via `yAxis`)
   │  ├─ series geometry (area | bar | line | points), one per config key
   │  ├─ value labels (optional: bar/area `showLabels`)
   │  └─ dots (optional: line `dots`)
   ├─ tooltip overlay (optional via `tooltip`)
   ├─ legend (when config has >1 series)
   └─ sr-only data table

<pie|radial-chart>                       polar categorical family
└─ figure (role="img")
   ├─ svg
   │  ├─ slices | concentric bars (one per row, palette/`fill` colored)
   │  └─ slice labels (optional: pie `showLabels`)
   ├─ tooltip overlay (optional)
   ├─ legend
   └─ sr-only data table

<radar-chart>                            polar series family
└─ figure (role="img")
   ├─ svg
   │  ├─ polar grid (`gridType`: polygon | circle)
   │  ├─ angle axis (spokes from `xKey`)
   │  └─ radar polygon, one per config key
   ├─ tooltip overlay (optional)
   ├─ legend
   └─ sr-only data table
```

## Public surface (prop ⇄ input parity)

Defaults shown in parentheses. Angular column gives the signal-input signature.

### AreaChart

| Prop (React)             | Type                                            | Default     | Angular input                                  |
| ------------------------ | ----------------------------------------------- | ----------- | ---------------------------------------------- |
| `data`                   | `readonly ChartDatum[]`                         | required    | `data = input.required<readonly ChartDatum[]>()` |
| `config`                 | `ChartConfig`                                   | required    | `config = input.required<ChartConfig>()`       |
| `xKey`                   | `string`                                        | required    | `xKey = input.required<string>()`              |
| `stacked`                | `boolean`                                        | `false`     | `stacked = input(false)`                       |
| `type`                   | `'natural' \| 'monotone' \| 'linear' \| 'step'` | `'natural'` | `type = input<CurveType>('natural')`           |
| `yAxis`                  | `boolean`                                        | `true`      | `yAxis = input(true)`                          |
| `tooltip`                | `boolean`                                        | `true`      | `tooltip = input(true)`                        |
| `className`              | `string`                                         | —           | host `class`                                   |

### BarChart

| Prop         | Type                    | Default | Angular input                  |
| ------------ | ----------------------- | ------- | ------------------------------ |
| `data`       | `readonly ChartDatum[]` | req     | `input.required`               |
| `config`     | `ChartConfig`           | req     | `input.required`               |
| `xKey`       | `string`                | req     | `input.required`               |
| `stacked`    | `boolean`               | `false` | `input(false)`                 |
| `horizontal` | `boolean`               | `false` | `input(false)`                 |
| `yAxis`      | `boolean`               | `true`  | `input(true)`                  |
| `showLabels` | `boolean`               | `false` | `input(false)`                 |
| `tooltip`    | `boolean`               | `true`  | `input(true)`                  |
| `radius`     | `number`                | `8`     | `input(8)`                     |
| `className`  | `string`                | —       | host `class`                   |

### LineChart

| Prop        | Type                                            | Default     | Angular input                |
| ----------- | ----------------------------------------------- | ----------- | ---------------------------- |
| `data`      | `readonly ChartDatum[]`                         | req         | `input.required`             |
| `config`    | `ChartConfig`                                   | req         | `input.required`             |
| `xKey`      | `string`                                        | req         | `input.required`             |
| `type`      | `'natural' \| 'monotone' \| 'linear' \| 'step'` | `'natural'` | `input<CurveType>('natural')`|
| `dots`      | `boolean`                                        | `false`     | `input(false)`               |
| `yAxis`     | `boolean`                                        | `true`      | `input(true)`                |
| `tooltip`   | `boolean`                                        | `true`      | `input(true)`                |
| `className` | `string`                                         | —           | host `class`                 |

### ScatterChart

| Prop        | Type                    | Default | Angular input    |
| ----------- | ----------------------- | ------- | ---------------- |
| `data`      | `readonly ChartDatum[]` | req     | `input.required` |
| `config`    | `ChartConfig`           | req     | `input.required` |
| `xKey`      | `string`                | req     | `input.required` |
| `yAxis`     | `boolean`               | `true`  | `input(true)`    |
| `tooltip`   | `boolean`               | `true`  | `input(true)`    |
| `className` | `string`                | —       | host `class`     |

### PieChart

| Prop         | Type                    | Default | Angular input                   |
| ------------ | ----------------------- | ------- | ------------------------------- |
| `data`       | `readonly ChartDatum[]` | req     | `input.required`                |
| `nameKey`    | `string`                | req     | `input.required`                |
| `dataKey`    | `string`                | req     | `input.required` (was `valueKey` — **rename to `dataKey`**) |
| `config`     | `ChartConfig`           | `{}`    | `input<ChartConfig>({})`        |
| `donut`      | `boolean`               | `false` | `input(false)`                  |
| `showLabels` | `boolean`               | `false` | `input(false)`                  |
| `tooltip`    | `boolean`               | `true`  | `input(true)`                   |
| `className`  | `string`                | —       | host `class`                    |

### RadarChart

| Prop        | Type                    | Default     | Angular input                       |
| ----------- | ----------------------- | ----------- | ----------------------------------- |
| `data`      | `readonly ChartDatum[]` | req         | `input.required`                    |
| `config`    | `ChartConfig`           | req         | `input.required`                    |
| `xKey`      | `string`                | req         | `input.required`                    |
| `gridType`  | `'polygon' \| 'circle'` | `'polygon'` | `gridType = input<GridType>('polygon')` |
| `tooltip`   | `boolean`               | `true`      | `input(true)`                       |
| `className` | `string`                | —           | host `class`                        |

### RadialChart

| Prop        | Type                    | Default | Angular input                   |
| ----------- | ----------------------- | ------- | ------------------------------- |
| `data`      | `readonly ChartDatum[]` | req     | `input.required`                |
| `nameKey`   | `string`                | req     | `input.required`                |
| `dataKey`   | `string`                | req     | `input.required` (was `valueKey` — **rename to `dataKey`**) |
| `config`    | `ChartConfig`           | `{}`    | `input<ChartConfig>({})`        |
| `tooltip`   | `boolean`               | `true`  | `input(true)`                   |
| `className` | `string`                | —       | host `class`                    |

## Notes for the Angular implementation

- `CurveType = 'natural' | 'monotone' | 'linear' | 'step'`,
  `GridType = 'polygon' | 'circle'` — export these from `headless/types`.
- The **headless layer already exists** (`headless/{shape,bar,area,line,pie,
  radar,radial-bar,scatter,axis,scales,domain,polar,chart-frame,
  cartesian-grid,format}.ts`). Parity work is mostly: add curve interpolation to
  `shape.ts`, stacking to `bar`/`area`, a tooltip overlay, dots, per-row `fill`,
  `radius`, `gridType`, value labels — then wire each new input through the
  styled component.
- **Rename** the pie/radial `valueKey` input to `dataKey` to match React. Keep no
  alias — the Angular charts are pre-1.0 and unreleased.
- Tooltip: track pointer over the plotting area, snap to the nearest category /
  point, render a token-styled floating card listing each series value. Respect
  `prefers-reduced-motion`.
- Every styled chart keeps its `role="img"` figure + `sr-only` table.
