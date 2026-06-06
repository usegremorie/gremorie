import type { Meta, StoryObj } from '@storybook/react';
import {
  Activity,
  ChartArea,
  ChartColumn,
  ChartLine,
  ChartPie,
  ChartScatter,
  Radar as RadarIcon,
} from 'lucide-react';

import { ChartArtifact, type ChartArtifactDatum } from './chart-artifact';

/**
 * # Chart artifact — every chart type
 *
 * The **real `ChartArtifact`** (not a mock shell) embedding each chart
 * primitive. Every type has the working **chart ⇄ table toggle**, the Download
 * menu and the responsive header. The table is **wide** — one column per value
 * series — so multi-series types (line, area, radar, scatter) keep every value
 * when you flip to the table.
 *
 * Pass `type` to pick the chart, and `valueKey` as a string (single series) or
 * an array of `{ key, label, color }` (multi-series).
 */
const meta = {
  title: 'AI/Code/Chart types',
  component: ChartArtifact,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-[26rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChartArtifact>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── shared mock data ─────────────────────────────────────────────────────────

const MONTHS: ChartArtifactDatum[] = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 173, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 214, mobile: 140 },
];
const TWO_SERIES = [
  { key: 'desktop', label: 'Desktop', color: 'var(--chart-1)' },
  { key: 'mobile', label: 'Mobile', color: 'var(--chart-2)' },
];

const RATINGS: ChartArtifactDatum[] = [
  { dept: 'Marketing', rating: 4.37 },
  { dept: 'Product', rating: 4.12 },
  { dept: 'Support', rating: 3.94 },
  { dept: 'Sales', rating: 3.76 },
  { dept: 'Finance', rating: 3.58 },
];

const BROWSERS: ChartArtifactDatum[] = [
  { browser: 'Chrome', visitors: 275 },
  { browser: 'Safari', visitors: 200 },
  { browser: 'Firefox', visitors: 187 },
  { browser: 'Edge', visitors: 173 },
  { browser: 'Other', visitors: 90 },
];

const BODY: ChartArtifactDatum[] = [
  { weight: 60, height: 165 },
  { weight: 65, height: 170 },
  { weight: 70, height: 174 },
  { weight: 75, height: 178 },
  { weight: 80, height: 180 },
  { weight: 85, height: 182 },
  { weight: 90, height: 184 },
];

// ── one story per chart type (each with a working chart ⇄ table toggle) ───────

/** Bar — categorical single series. Table: category + value with a row swatch. */
export const Bar: Story = {
  args: {
    type: 'bar',
    icon: ChartColumn,
    title: 'Average rating by department',
    description: 'Q3 review scores across departments.',
    data: RATINGS,
    categoryKey: 'dept',
    valueKey: 'rating',
    valueLabel: 'Rating',
    numberFormat: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  },
};

/** Area — two stacked series. Table: one column per series. */
export const Area: Story = {
  args: {
    type: 'area',
    icon: ChartArea,
    title: 'Visitors over time',
    description: 'Sessions by device across six months.',
    data: MONTHS,
    categoryKey: 'month',
    valueKey: TWO_SERIES,
  },
};

/** Line — two series trend. Table keeps both columns. */
export const Line: Story = {
  args: {
    type: 'line',
    icon: ChartLine,
    title: 'Engagement trend',
    description: 'Desktop vs. mobile, month over month.',
    data: MONTHS,
    categoryKey: 'month',
    valueKey: TWO_SERIES,
  },
};

/** Pie / donut — share of total. Table: category + value with row swatches. */
export const Pie: Story = {
  args: {
    type: 'pie',
    icon: ChartPie,
    title: 'Browser share',
    description: 'Sessions by browser, last 30 days.',
    data: BROWSERS,
    categoryKey: 'browser',
    valueKey: 'visitors',
    valueLabel: 'Visitors',
  },
};

/** Radar — the case from the bug report: now has the toggle + table. */
export const Radar: Story = {
  args: {
    type: 'radar',
    icon: RadarIcon,
    title: 'Capability profile',
    description: 'Desktop vs. mobile across six metrics.',
    data: MONTHS,
    categoryKey: 'month',
    valueKey: TWO_SERIES,
  },
};

/** Radial — concentric bars. Table: category + value with row swatches. */
export const Radial: Story = {
  args: {
    type: 'radial',
    icon: Activity,
    title: 'Browser share (radial)',
    description: 'Concentric bars, one per browser.',
    data: BROWSERS,
    categoryKey: 'browser',
    valueKey: 'visitors',
    valueLabel: 'Visitors',
  },
};

/** Scatter — two numeric axes. Table: X + Y columns. */
export const Scatter: Story = {
  args: {
    type: 'scatter',
    icon: ChartScatter,
    title: 'Height vs. weight',
    description: 'Correlation across a small sample.',
    data: BODY,
    categoryKey: 'weight',
    valueKey: [
      { key: 'height', label: 'Height (cm)', color: 'var(--chart-1)' },
    ],
  },
};

/** Opens on the table view — flip the toggle to see the radar chart. */
export const RadarTableFirst: Story = {
  name: 'Radar (table first)',
  args: { ...Radar.args, defaultView: 'table' },
};
