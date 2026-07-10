import type { Meta, StoryObj } from '@storybook/angular';

import {
  ChartTooltipContent,
  type ChartTooltipRow,
} from './chart-tooltip-content';

/**
 * ChartTooltipContent — the floating card the cartesian charts show on hover,
 * as a standalone component (parity with React `ChartTooltipContent`). These
 * stories render it directly with mock rows so every variant is visible without
 * a chart. Variants: `indicator` (dot / line / dashed), `hideLabel`,
 * `hideIndicator`.
 */
const ROWS: ChartTooltipRow[] = [
  { key: 'desktop', label: 'Desktop', color: 'var(--chart-1)', value: '305' },
  { key: 'mobile', label: 'Mobile', color: 'var(--chart-2)', value: '200' },
];
const ONE: ChartTooltipRow[] = [ROWS[0]];

const meta: Meta<ChartTooltipContent> = {
  title: 'Layout & display/Data/Tooltip',
  component: ChartTooltipContent,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    indicator: { control: 'inline-radio', options: ['dot', 'line', 'dashed'] },
    hideLabel: { control: 'boolean' },
    hideIndicator: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<ChartTooltipContent>;

/** Default — dot indicator, with the category header. */
export const Dot: Story = {
  render: () => ({
    props: { rows: ROWS },
    template: `<div class="relative inline-block"><chart-tooltip-content label="February" [rows]="rows" /></div>`,
  }),
};

/** Line indicator. */
export const Line: Story = {
  render: () => ({
    props: { rows: ROWS },
    template: `<div class="relative inline-block"><chart-tooltip-content label="February" indicator="line" [rows]="rows" /></div>`,
  }),
};

/** Dashed indicator. */
export const Dashed: Story = {
  render: () => ({
    props: { rows: ROWS },
    template: `<div class="relative inline-block"><chart-tooltip-content label="February" indicator="dashed" [rows]="rows" /></div>`,
  }),
};

/** Single series with the header hidden (the categorical look). */
export const HideLabel: Story = {
  render: () => ({
    props: { one: ONE },
    template: `<div class="relative inline-block"><chart-tooltip-content [hideLabel]="true" [rows]="one" /></div>`,
  }),
};

/** No swatch — text-only rows. */
export const HideIndicator: Story = {
  render: () => ({
    props: { rows: ROWS },
    template: `<div class="relative inline-block"><chart-tooltip-content label="February" [hideIndicator]="true" [rows]="rows" /></div>`,
  }),
};

/** Workbench — a single args-driven instance the dual-framework workbench drives
 * via its controls (indicator / hideLabel / hideIndicator). */
export const Workbench: Story = {
  args: { indicator: 'dot', hideLabel: false, hideIndicator: false },
  render: (args) => ({
    props: { ...args, rows: ROWS },
    template: `<div class="relative inline-block"><chart-tooltip-content label="February" [indicator]="indicator" [hideLabel]="hideLabel" [hideIndicator]="hideIndicator" [rows]="rows" /></div>`,
  }),
};
