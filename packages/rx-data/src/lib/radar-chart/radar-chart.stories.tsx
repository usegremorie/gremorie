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
  parameters: { layout: 'centered' },
  argTypes: {
    gridType: { control: 'inline-radio', options: ['polygon', 'circle'] },
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

const METRICS: ChartDatum[] = [
  { metric: 'Speed', current: 120, target: 110 },
  { metric: 'Power', current: 98, target: 130 },
  { metric: 'Range', current: 86, target: 100 },
  { metric: 'Agility', current: 99, target: 90 },
  { metric: 'Armor', current: 85, target: 120 },
  { metric: 'Stealth', current: 65, target: 85 },
];

const SINGLE: ChartConfig = {
  current: { label: 'Current', color: 'var(--chart-1)' },
};
const MULTI: ChartConfig = {
  current: { label: 'Current', color: 'var(--chart-1)' },
  target: { label: 'Target', color: 'var(--chart-2)' },
};

/** A single filled polygon. */
export const Default: Story = {
  args: { data: METRICS, config: SINGLE, xKey: 'metric' },
};

/** Two series (outlined). */
export const Multiple: Story = {
  args: { data: METRICS, config: MULTI, xKey: 'metric' },
};

/** Circular grid. */
export const CircleGrid: Story = {
  args: { data: METRICS, config: SINGLE, xKey: 'metric', gridType: 'circle' },
};

// Shared with the Angular `Workbench` story (ng-data) — keep byte-identical so
// the dual-framework workbench renders the same use case on both sides.
const WORKBENCH_DATA: ChartDatum[] = [
  { trait: 'Speed', you: 120, team: 110 },
  { trait: 'Reliability', you: 98, team: 130 },
  { trait: 'Comfort', you: 86, team: 100 },
  { trait: 'Safety', you: 99, team: 90 },
  { trait: 'Efficiency', you: 85, team: 120 },
  { trait: 'Range', you: 65, team: 85 },
];

const WORKBENCH_CONFIG: ChartConfig = {
  you: { label: 'You', color: 'var(--chart-1)' },
  team: { label: 'Team', color: 'var(--chart-2)' },
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
      <div className="w-[28rem] max-w-full">
        <Story />
      </div>
    ),
  ],
  args: { data: WORKBENCH_DATA, config: WORKBENCH_CONFIG, xKey: 'trait' },
};
