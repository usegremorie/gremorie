import type { Meta, StoryObj } from '@storybook/react';

import type { ChartConfig } from '../chart/chart';
import type { ChartDatum } from '../chart/types';
import { ScatterChart } from './scatter-chart';

/**
 * # ScatterChart
 *
 * A recharts scatter chart wired to Gremorie's design tokens through the shadcn
 * `chart` primitive (`ChartContainer`). Each `config` entry is a numeric Y
 * series plotted against the numeric `xKey`.
 *
 * ## Anatomy
 *
 * ```text
 * ChartContainer                      responsive frame + injects --color-<key>
 * └─ ScatterChart                     recharts scatter plot area
 *    ├─ CartesianGrid                 full grid
 *    ├─ XAxis                         numeric X (linear)
 *    ├─ YAxis                         numeric Y (linear)
 *    ├─ ChartTooltip                  hover card
 *    │  └─ ChartTooltipContent        styled tooltip body
 *    └─ Scatter                       one set of dots per series
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `data` * | `ChartDatum[]` | — | Tabular rows (numeric X + Y). |
 * | `config` * | `ChartConfig` | — | Field → `{ label, color }`. One entry = one Y series. |
 * | `xKey` * | `string` | — | Numeric X field. |
 * | `tooltip` | `boolean` | `true` | Hover tooltip. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--chart-1` … `--chart-5` | Dot colors |
 * | `--border` | Grid lines |
 * | `--muted-foreground` | Axis labels |
 * | `--background` / `--foreground` | Tooltip surface + text |
 */
const meta = {
  title: 'Layout & display/Data/Scatter',
  component: ScatterChart,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    yAxis: { control: 'boolean' },
    tooltip: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="w-[28rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScatterChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const BODY: ChartDatum[] = [
  { weight: 60, height: 165, max: 175 },
  { weight: 65, height: 170, max: 180 },
  { weight: 70, height: 174, max: 186 },
  { weight: 75, height: 178, max: 192 },
  { weight: 80, height: 180, max: 198 },
  { weight: 85, height: 182, max: 200 },
  { weight: 90, height: 184, max: 204 },
];

const SINGLE: ChartConfig = {
  height: { label: 'Height (cm)', color: 'var(--chart-1)' },
};
const MULTI: ChartConfig = {
  height: { label: 'Median', color: 'var(--chart-1)' },
  max: { label: 'Max', color: 'var(--chart-2)' },
};

/** A single series. */
export const Default: Story = {
  args: { data: BODY, config: SINGLE, xKey: 'weight' },
};

/** Two series against the same X. */
export const Multiple: Story = {
  args: { data: BODY, config: MULTI, xKey: 'weight' },
};
