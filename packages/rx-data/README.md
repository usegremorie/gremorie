# @gremorie/rx-data

React data visualization primitives for Gremorie, an AI native design system. Tokenized charts (area, line, bar, scatter, pie, radar, radial) built on the shadcn chart primitive.

Full documentation lives at [gremorie.com](https://gremorie.com).

## Install

```bash
npm i @gremorie/rx-data @gremorie/rx-core
```

Requires React 18 or 19 and Tailwind CSS v4 in the host project. The charts are
powered by recharts, which ships bundled as a dependency, so there is nothing
extra to install.

## Styles

Import the pre compiled token stylesheet once, at your app entry. It ships the
design tokens (colors, radius, light and dark themes) as plain CSS variables, so
you do not need to wire Tailwind `@theme` yourself.

```css
@import 'tailwindcss';
@import '@gremorie/react/styles.css';
```

## Usage

```tsx
import { AreaChart, type ChartConfig } from '@gremorie/rx-data';

const data = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
];

const config = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--chart-2)' },
} satisfies ChartConfig;

export function Example() {
  return <AreaChart data={data} config={config} xKey="month" stacked />;
}
```

## Components

- `ChartContainer` and tooltip primitives (the shadcn chart foundation)
- `AreaChart`
- `LineChart`
- `BarChart`
- `ScatterChart`
- `PieChart`
- `RadarChart`
- `RadialChart`

Each chart reads its series colors from the `config` map, so colors stay tied to
the design tokens.

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).
