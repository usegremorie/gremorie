import type { Meta, StoryObj } from '@storybook/angular';
import { ChartArtifact } from './chart-artifact';

const REVENUE = [
  { month: 'Jan', revenue: 1860 },
  { month: 'Feb', revenue: 3050 },
  { month: 'Mar', revenue: 2370 },
  { month: 'Apr', revenue: 1730 },
  { month: 'May', revenue: 2090 },
  { month: 'Jun', revenue: 2640 },
];

const BROWSERS = [
  { browser: 'Chrome', visitors: 2750 },
  { browser: 'Safari', visitors: 2000 },
  { browser: 'Firefox', visitors: 1870 },
  { browser: 'Edge', visitors: 1730 },
  { browser: 'Other', visitors: 900 },
];

const TRAFFIC = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 173, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 264, mobile: 140 },
];

const SKILLS = [
  { trait: 'Speed', you: 120, team: 110 },
  { trait: 'Reliability', you: 98, team: 130 },
  { trait: 'Comfort', you: 86, team: 130 },
  { trait: 'Safety', you: 99, team: 100 },
  { trait: 'Efficiency', you: 85, team: 90 },
];

const SCATTER = [
  { size: 120, price: 250 },
  { size: 200, price: 460 },
  { size: 180, price: 410 },
  { size: 320, price: 720 },
  { size: 90, price: 180 },
  { size: 260, price: 590 },
];

// Shared with the React `Workbench` story (rx-artifacts) - keep byte-identical
// so the dual-framework workbench renders the same use case on both sides.
const RATINGS = [
  { department: 'Marketing', rating: 4.37 },
  { department: 'Product', rating: 4.12 },
  { department: 'Support', rating: 3.94 },
  { department: 'Sales', rating: 3.76 },
  { department: 'Finance', rating: 3.72 },
  { department: 'Ops', rating: 3.58 },
];

const meta: Meta<ChartArtifact> = {
  title: 'Artifacts/ChartArtifact',
  component: ChartArtifact,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 640px;">
        <chart-artifact
          [title]="title"
          [description]="description"
          [data]="data"
          [type]="type"
          [categoryKey]="categoryKey"
          [valueKey]="valueKey"
          [defaultView]="defaultView"
          [accent]="accent"
          [fileName]="fileName"
        />
      </div>
    `,
  }),
  args: {
    title: 'Monthly revenue',
    description: 'Net new revenue per month',
    data: REVENUE,
    type: 'bar',
    categoryKey: 'month',
    valueKey: 'revenue',
    defaultView: 'chart',
    accent: 'primary',
    fileName: 'chart',
  },
};

export default meta;
type Story = StoryObj<ChartArtifact>;

export const Bar: Story = {};

export const Area: Story = {
  args: {
    title: 'Traffic over time',
    description: 'Sessions per month',
    type: 'area',
    data: REVENUE,
    categoryKey: 'month',
    valueKey: 'revenue',
  },
};

export const Line: Story = {
  args: {
    title: 'Revenue trend',
    type: 'line',
    data: REVENUE,
    categoryKey: 'month',
    valueKey: 'revenue',
  },
};

export const Pie: Story = {
  args: {
    title: 'Visitors by browser',
    description: 'Share of total sessions',
    type: 'pie',
    data: BROWSERS,
    categoryKey: 'browser',
    valueKey: 'visitors',
  },
};

export const Radar: Story = {
  args: {
    title: 'Skill comparison',
    description: 'You vs. team average',
    type: 'radar',
    data: SKILLS,
    categoryKey: 'trait',
    valueKey: [
      { key: 'you', label: 'You', color: 'var(--chart-1)' },
      { key: 'team', label: 'Team', color: 'var(--chart-2)' },
    ],
  },
};

export const Radial: Story = {
  args: {
    title: 'Visitors by browser',
    type: 'radial',
    data: BROWSERS,
    categoryKey: 'browser',
    valueKey: 'visitors',
  },
};

export const Scatter: Story = {
  args: {
    title: 'Price vs. size',
    description: 'Listings sample',
    type: 'scatter',
    data: SCATTER,
    categoryKey: 'size',
    valueKey: 'price',
  },
};

export const MultiSeries: Story = {
  args: {
    title: 'Desktop vs. mobile',
    description: 'Sessions by platform',
    type: 'line',
    data: TRAFFIC,
    categoryKey: 'month',
    valueKey: [
      { key: 'desktop', label: 'Desktop', color: 'var(--chart-1)' },
      { key: 'mobile', label: 'Mobile', color: 'var(--chart-2)' },
    ],
  },
};

export const TableDefault: Story = {
  args: {
    title: 'Monthly revenue',
    description: 'Opens in the table view',
    data: REVENUE,
    type: 'bar',
    categoryKey: 'month',
    valueKey: 'revenue',
    defaultView: 'table',
  },
};

/**
 * Workbench preset: the canonical departments dataset, top-aligned at a fixed
 * 26rem width so the dual-framework workbench renders the IDENTICAL use case as
 * the React `Workbench` story. Keep both in sync.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 100%;">
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
          [fileName]="fileName"
          [accent]="accent"
        />
      </div>
    `,
  }),
  args: {
    title: 'Average rating by department',
    description: 'Q3 review scores across six departments.',
    data: RATINGS,
    type: 'bar',
    categoryKey: 'department',
    valueKey: 'rating',
    valueLabel: 'Rating',
    defaultView: 'chart',
    numberFormat: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
    fileName: 'ratings-by-department',
    accent: 'primary',
  },
};

export const Accents: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: grid; gap: 16px; width: 640px;">
        <chart-artifact title="Primary accent" [data]="data" type="bar"
          categoryKey="month" valueKey="revenue" accent="primary" />
        <chart-artifact title="Gray accent" [data]="data" type="bar"
          categoryKey="month" valueKey="revenue" accent="gray" />
        <chart-artifact title="Success accent" [data]="data" type="bar"
          categoryKey="month" valueKey="revenue" accent="success" />
        <chart-artifact title="Error accent" [data]="data" type="bar"
          categoryKey="month" valueKey="revenue" accent="error" />
      </div>
    `,
  }),
  args: { data: REVENUE },
};
