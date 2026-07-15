# ChartArtifact — fixed anatomy

The **Chart preset of the artifact shell**. React: `@gremorie/rx-artifacts`
(`ChartArtifact`). Angular target: a new `@gremorie/ng-artifacts` package with
the same surface. It embeds any of the 7 chart primitives inside the generic
`Artifact` shell, with a working **chart ⇄ table** toggle and PNG / CSV
downloads. Because it embeds the chart primitives, fixing a chart fixes the
artifact.

## Anatomy tree (shared)

```
<chart-artifact>
└─ <artifact>                              the generic shell (own anatomy below)
   ├─ <artifact-header>
   │  ├─ <artifact-featured-icon>          accent-colored icon chip
   │  ├─ <artifact-heading>
   │  │  ├─ <artifact-title>
   │  │  └─ <artifact-description>         (optional, truncates)
   │  └─ <artifact-actions>
   │     ├─ <artifact-view-toggle>         chart / table segmented control
   │     ├─ <artifact-actions-expanded>    ≥448px: Download menu + More menu
   │     │  ├─ <artifact-menu icon=Download> Image (PNG) · Data (CSV)
   │     │  └─ <artifact-menu icon=More>     Copy values · Save · Regenerate
   │     └─ <artifact-actions-collapsed>   <448px: single More menu (all actions)
   └─ <artifact-content>
      ├─ chart view → one of the 7 chart primitives (by `type`)
      └─ table view → wide table, one column per value series
```

The generic `Artifact` shell parts (must exist in `ng-artifacts` too):
`Artifact`, `ArtifactHeader`, `ArtifactFeaturedIcon`, `ArtifactHeading`,
`ArtifactTitle`, `ArtifactDescription`, `ArtifactActions`,
`ArtifactActionsExpanded`, `ArtifactActionsCollapsed`, `ArtifactViewToggle`,
`ArtifactMenu`, `ArtifactContent`.

## Public surface (prop ⇄ input parity)

| Prop (React)    | Type                                                         | Default      | Angular                                |
| --------------- | ------------------------------------------------------------ | ------------ | -------------------------------------- |
| `title`         | `string`                                                     | required     | `input.required<string>()`             |
| `description`   | `string`                                                     | —            | `input<string>()`                      |
| `data`          | `ChartArtifactDatum[]` (`Record<string, string \| number>`)  | required     | `input.required`                       |
| `type`          | `'bar'\|'area'\|'line'\|'pie'\|'radar'\|'radial'\|'scatter'` | `'bar'`      | `input<ChartArtifactType>('bar')`      |
| `categoryKey`   | `string`                                                     | required     | `input.required`                       |
| `valueKey`      | `string \| ChartArtifactSeries[]`                            | required     | `input.required`                       |
| `categoryLabel` | `string`                                                     | title-cased  | `input<string>()`                      |
| `valueLabel`    | `string`                                                     | title-cased  | `input<string>()`                      |
| `defaultView`   | `'chart' \| 'table'`                                         | `'chart'`    | `input<ChartArtifactView>('chart')`    |
| `numberFormat`  | `Intl.NumberFormatOptions`                                   | —            | `input<Intl.NumberFormatOptions>()`    |
| `fileName`      | `string`                                                     | `'chart'`    | `input('chart')`                       |
| `icon`          | icon component                                               | chart-column | `input<...>()` (`@ng-icons/lucide`)    |
| `accent`        | `'primary'\|'gray'\|'success'\|'error'`                      | `'primary'`  | `input<ChartArtifactColor>('primary')` |
| `className`     | `string`                                                     | —            | host `class`                           |
| `onRegenerate`  | `() => void`                                                 | —            | `regenerate = output<void>()`          |
| `onSave`        | `() => void`                                                 | —            | `save = output<void>()`                |

```ts
interface ChartArtifactSeries {
  key: string;
  label?: string;
  color?: string;
}
type ChartArtifactType =
  'bar' | 'area' | 'line' | 'pie' | 'radar' | 'radial' | 'scatter';
type ChartArtifactView = 'chart' | 'table';
type ChartArtifactColor = 'primary' | 'gray' | 'success' | 'error';
```

## Behaviour parity

- **valueKey normalization**: a `string` → single series (categorical); a
  `ChartArtifactSeries[]` → multi-series. Each series → one table column. Labels
  default to title-cased keys; colors default to the cycling palette.
- **Categorical types** (`bar`, `pie`, `radial`) with a single series color each
  **row** from the palette via a per-row `fill`. The table then shows a leading
  color swatch per row; multi-series shows a swatch per column header.
- **Chart mapping** (matches React `renderChart`): `area`/`line` pass
  `yAxis={false}`; `bar` passes `yAxis={false}` and per-row fill for single
  categorical; `pie` uses `donut`; `pie`/`radial` pass `nameKey`+`dataKey`.
- **Downloads**: PNG via SVG-clone + `getComputedStyle` inlining → canvas (2×
  scale); CSV from the series columns. "Copy values" writes TSV to the
  clipboard. If the view is `table` when "Download image" is chosen, flip to
  `chart`, wait a tick, then rasterize.
- **Responsive actions**: ≥448px shows the expanded Download + More menus;
  <448px collapses to one More menu carrying every action. (React uses
  `ArtifactActionsExpanded`/`Collapsed`; Angular uses a container query or a
  `ResizeObserver`.)

## Angular dependency note

`ng-display` has no Table primitive yet. The Angular `ChartArtifact` renders the
table view with a token-styled semantic `<table>` inline (same markup the charts
already use for their `sr-only` tables, promoted to visible). This avoids
blocking on a full `ng-display` Table port; if/when that lands, swap it in.
