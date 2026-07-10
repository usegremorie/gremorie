import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { provideIcons } from '@ng-icons/core';
import { lucideActivity, lucideChartArea, lucideRadar } from '@ng-icons/lucide';

import { ChartArtifact } from './chart-artifact';

/**
 * ChartArtifact - every chart type (parity with the React `AI/Code/Chart types`
 * gallery). The real `ChartArtifact` (not a mock shell) embedding each chart
 * primitive: every type has the working chart / table toggle, the Download menu
 * and the responsive header. The table is wide - one column per value series -
 * so multi-series types (line, area, radar, scatter) keep every value when you
 * flip to the table.
 *
 * Pass `type` to pick the chart, and `valueKey` as a string (single series) or
 * an array of `{ key, label, color }` (multi-series).
 */

// ── shared mock data (byte-identical with the React chart-types stories) ─────

const MONTHS = [
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

const RATINGS = [
  { dept: 'Marketing', rating: 4.37 },
  { dept: 'Product', rating: 4.12 },
  { dept: 'Support', rating: 3.94 },
  { dept: 'Sales', rating: 3.76 },
  { dept: 'Finance', rating: 3.58 },
];

const BROWSERS = [
  { browser: 'Chrome', visitors: 275 },
  { browser: 'Safari', visitors: 200 },
  { browser: 'Firefox', visitors: 187 },
  { browser: 'Edge', visitors: 173 },
  { browser: 'Other', visitors: 90 },
];

const BODY = [
  { weight: 60, height: 165 },
  { weight: 65, height: 170 },
  { weight: 70, height: 174 },
  { weight: 75, height: 178 },
  { weight: 80, height: 180 },
  { weight: 85, height: 182 },
  { weight: 90, height: 184 },
];

const meta: Meta<ChartArtifact> = {
  title: 'AI/Code/Chart types',
  component: ChartArtifact,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      // The artifact shell registers ARTIFACT_ICONS; the gallery headers need
      // three more lucide glyphs (area / radar / radial).
      providers: [
        provideIcons({ lucideActivity, lucideChartArea, lucideRadar }),
      ],
    }),
  ],
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 26rem; max-width: 100%;">
        <chart-artifact
          [title]="title"
          [description]="description"
          [data]="data"
          [type]="type"
          [categoryKey]="categoryKey"
          [valueKey]="valueKey"
          [valueLabel]="valueLabel"
          [defaultView]="defaultView"
          [numberFormat]="numberFormat"
          [icon]="icon"
        />
      </div>
    `,
  }),
  args: { defaultView: 'chart' },
};

export default meta;
type Story = StoryObj<ChartArtifact>;

// ── one story per chart type (each with a working chart / table toggle) ──────

/** Bar - categorical single series. Table: category + value with a row swatch. */
export const Bar: Story = {
  args: {
    type: 'bar',
    icon: 'lucideChartColumn',
    title: 'Average rating by department',
    description: 'Q3 review scores across departments.',
    data: RATINGS,
    categoryKey: 'dept',
    valueKey: 'rating',
    valueLabel: 'Rating',
    numberFormat: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  },
};

/** Area - two stacked series. Table: one column per series. */
export const Area: Story = {
  args: {
    type: 'area',
    icon: 'lucideChartArea',
    title: 'Visitors over time',
    description: 'Sessions by device across six months.',
    data: MONTHS,
    categoryKey: 'month',
    valueKey: TWO_SERIES,
  },
};

/** Line - two series trend. Table keeps both columns. */
export const Line: Story = {
  args: {
    type: 'line',
    icon: 'lucideChartLine',
    title: 'Engagement trend',
    description: 'Desktop vs. mobile, month over month.',
    data: MONTHS,
    categoryKey: 'month',
    valueKey: TWO_SERIES,
  },
};

/** Pie / donut - share of total. Table: category + value with row swatches. */
export const Pie: Story = {
  args: {
    type: 'pie',
    icon: 'lucideChartPie',
    title: 'Browser share',
    description: 'Sessions by browser, last 30 days.',
    data: BROWSERS,
    categoryKey: 'browser',
    valueKey: 'visitors',
    valueLabel: 'Visitors',
  },
};

/** Radar - a few series across shared spokes, with the toggle + table. */
export const Radar: Story = {
  args: {
    type: 'radar',
    icon: 'lucideRadar',
    title: 'Capability profile',
    description: 'Desktop vs. mobile across six metrics.',
    data: MONTHS,
    categoryKey: 'month',
    valueKey: TWO_SERIES,
  },
};

/** Radial - concentric bars. Table: category + value with row swatches. */
export const Radial: Story = {
  args: {
    type: 'radial',
    icon: 'lucideActivity',
    title: 'Browser share (radial)',
    description: 'Concentric bars, one per browser.',
    data: BROWSERS,
    categoryKey: 'browser',
    valueKey: 'visitors',
    valueLabel: 'Visitors',
  },
};

/** Scatter - two numeric axes. Table: X + Y columns. */
export const Scatter: Story = {
  args: {
    type: 'scatter',
    icon: 'lucideChartScatter',
    title: 'Height vs. weight',
    description: 'Correlation across a small sample.',
    data: BODY,
    categoryKey: 'weight',
    valueKey: [
      { key: 'height', label: 'Height (cm)', color: 'var(--chart-1)' },
    ],
  },
};

/** Opens on the table view - flip the toggle to see the radar chart. */
export const RadarTableFirst: Story = {
  name: 'Radar (table first)',
  args: { ...Radar.args, defaultView: 'table' },
};
