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
  title: 'Charts/Tooltip',
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

/** Workbench — every variant stacked, so the dual-framework workbench shows the
 * full set on both editions. */
export const Workbench: Story = {
  render: () => ({
    props: { rows: ROWS, one: ONE },
    template: `
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <span class="text-[10px] uppercase tracking-wider text-muted-foreground">Dot</span>
          <chart-tooltip-content class="w-fit" label="February" [rows]="rows" />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-[10px] uppercase tracking-wider text-muted-foreground">Line</span>
          <chart-tooltip-content class="w-fit" label="February" indicator="line" [rows]="rows" />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-[10px] uppercase tracking-wider text-muted-foreground">Dashed</span>
          <chart-tooltip-content class="w-fit" label="February" indicator="dashed" [rows]="rows" />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-[10px] uppercase tracking-wider text-muted-foreground">Hide label</span>
          <chart-tooltip-content class="w-fit" [hideLabel]="true" [rows]="one" />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-[10px] uppercase tracking-wider text-muted-foreground">Hide indicator</span>
          <chart-tooltip-content class="w-fit" label="February" [hideIndicator]="true" [rows]="rows" />
        </div>
      </div>
    `,
  }),
};
