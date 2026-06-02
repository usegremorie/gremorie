# @gremorie/ng-data

Data visualisation primitives for Angular: charts built on D3. Ships headless
building blocks plus styled presets (area, line, bar, scatter, pie, radar,
radial). Part of Gremorie, an AI native design system.

Full documentation lives at [gremorie.com](https://gremorie.com).

## Install

```bash
npm i @gremorie/ng-data @gremorie/ng-core d3-scale d3-shape d3-format
```

Requires Angular 21 (`@angular/core` and `@angular/compiler` ^21.2.0). Charts
are rendered as SVG using the D3 scale, shape, and format utilities.

## Styles

The charts pull their colors from the Gremorie design tokens, so import the
core theme once in your global `styles.css`:

```css
@import 'tailwindcss';
@import '@gremorie/ng-core/theme.css';
```

## Usage

```ts
import { Component } from '@angular/core';
import { AreaChart } from '@gremorie/ng-data';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [AreaChart],
  template: ` <area-chart [data]="data" [config]="config" xKey="month" /> `,
})
export class ExampleComponent {
  data = [
    { month: 'Jan', desktop: 186 },
    { month: 'Feb', desktop: 305 },
    { month: 'Mar', desktop: 237 },
  ];

  config = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  };
}
```

## Components

Styled chart presets (each a standalone component):

- `AreaChart` (selector: `area-chart`).
- `LineChart` (selector: `line-chart`).
- `BarChart` (selector: `bar-chart`).
- `ScatterChart` (selector: `scatter-chart`).
- `PieChart` (selector: `pie-chart`).
- `RadarChart` (selector: `radar-chart`).
- `RadialChart` (selector: `radial-chart`).

For full control, the package also exports headless primitives (chart frame,
cartesian grid, axes, and the area, line, bar, scatter, polar, pie, radar, and
radial-bar shapes) plus scale, shape, format, and domain helpers, so you can
assemble custom charts.

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).
