import type { Meta, StoryObj } from '@storybook/react';

import type { ChartConfig } from '../chart/chart';
import type { ChartDatum } from '../chart/types';
import { RadarChart } from './radar-chart';

/**
 * # RadarChart
 *
 * A recharts radar chart wired to Gremorie's design tokens through the shadcn
 * `chart` primitive (`ChartContainer`). One `<Radar>` polygon per `config` entry
 * over a shared angular axis (`xKey`).
 *
 * ## Anatomy
 *
 * ```text
 * RadarChart
 * └─ ChartContainer            responsive square frame + injects --color-<key>
 *    └─ RadarChart (recharts)  polar plot area over the angular axis (xKey)
 *       ├─ ChartTooltip        hover card (ChartTooltipContent)
 *       ├─ PolarAngleAxis      spoke labels (xKey)
 *       ├─ PolarGrid           polygon or circular grid (gridType)
 *       └─ Radar               one polygon per series
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `data` * | `ChartDatum[]` | — | One row per spoke. |
 * | `config` * | `ChartConfig` | — | Field → `{ label, color }`. One entry = one series. |
 * | `xKey` * | `string` | — | Spoke (angle) field. |
 * | `gridType` | `"polygon" \| "circle"` | `"polygon"` | Grid shape. |
 * | `tooltip` | `boolean` | `true` | Hover tooltip. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--chart-1` … `--chart-5` | Polygon fill + stroke |
 * | `--border` | Grid + spokes |
 * | `--muted-foreground` | Spoke labels |
 */
const meta = {
  title: 'Layout & display/Data/Radar Chart',
  component: RadarChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    gridType: { control: 'inline-radio', options: ['polygon', 'circle'] },
    fill: { control: 'inline-radio', options: ['auto', 'on', 'off'] },
    dots: { control: 'boolean' },
    tooltip: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="w-[22rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RadarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Values are set so no series dominates: each one leads on some spokes and
// trails on others, so the polygons cross instead of nesting. A radar whose
// series nest tells you nothing the same numbers in a table would not.
const METRICS: ChartDatum[] = [
  { metric: 'Speed', current: 120, target: 110, baseline: 86 },
  { metric: 'Power', current: 98, target: 130, baseline: 105 },
  { metric: 'Range', current: 86, target: 100, baseline: 128 },
  { metric: 'Agility', current: 99, target: 90, baseline: 118 },
  { metric: 'Armor', current: 85, target: 120, baseline: 95 },
  { metric: 'Stealth', current: 65, target: 85, baseline: 112 },
];

const SINGLE: ChartConfig = {
  current: { label: 'Current', color: 'var(--chart-1)' },
};
// Categorical slots in fixed order — chart-1, then 2, then 3. Never cycled and
// never reordered: a series keeps its hue when the set changes, so the reader's
// colour memory survives a filter.
const MULTI: ChartConfig = {
  current: { label: 'Current', color: 'var(--chart-1)' },
  target: { label: 'Target', color: 'var(--chart-2)' },
  baseline: { label: 'Baseline', color: 'var(--chart-3)' },
};

/** Three series (outlined), crossing on several spokes. */
export const Default: Story = {
  args: { data: METRICS, config: MULTI, xKey: 'metric' },
};

/** A single filled polygon — the one-series treatment (fill, no stroke). */
export const SingleSeries: Story = {
  args: { data: METRICS, config: SINGLE, xKey: 'metric' },
};

/** Three series with the fill forced on — lightened to 0.2 so the stack reads. */
export const Filled: Story = {
  args: { data: METRICS, config: MULTI, xKey: 'metric', fill: 'on' },
};

/** A dot on every vertex; the hovered spoke's grows. */
export const Dots: Story = {
  args: { data: METRICS, config: MULTI, xKey: 'metric', dots: true },
};

/** Circular grid. */
export const CircleGrid: Story = {
  args: { data: METRICS, config: MULTI, xKey: 'metric', gridType: 'circle' },
};

// Shared with the Angular `Workbench` story (ng-data) — keep byte-identical so
// the dual-framework workbench renders the same use case on both sides.
const WORKBENCH_DATA: ChartDatum[] = [
  { trait: 'Speed', you: 120, team: 110, fleet: 86 },
  { trait: 'Reliability', you: 98, team: 130, fleet: 105 },
  { trait: 'Comfort', you: 86, team: 100, fleet: 128 },
  { trait: 'Safety', you: 99, team: 90, fleet: 118 },
  { trait: 'Efficiency', you: 85, team: 120, fleet: 95 },
  { trait: 'Range', you: 65, team: 85, fleet: 112 },
];

const WORKBENCH_CONFIG: ChartConfig = {
  you: { label: 'You', color: 'var(--chart-1)' },
  team: { label: 'Team', color: 'var(--chart-2)' },
  fleet: { label: 'Fleet', color: 'var(--chart-3)' },
};

/**
 * Workbench preset: skill traits you vs. team across shared spokes, top-aligned
 * (layout `padded`) at a fixed 28rem width so the dual-framework workbench
 * renders the IDENTICAL use case as the Angular `Workbench` story. Keep in sync.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-full">
        <Story />
      </div>
    ),
  ],
  args: { data: WORKBENCH_DATA, config: WORKBENCH_CONFIG, xKey: 'trait' },
};
