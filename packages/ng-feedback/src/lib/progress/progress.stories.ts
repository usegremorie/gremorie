import type { Meta, StoryObj } from '@storybook/angular';

import { Progress } from './progress';

/**
 * Progress — determinate bar (0–100) or indeterminate when value is null.
 *
 * Stories sweep the value scale and exercise the indeterminate state +
 * custom `max` from Spartan brain.
 */
type ProgressArgs = {
  value: number | null;
  max: number;
};

const meta: Meta<ProgressArgs> = {
  title: 'Interaction/Feedback/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    value: { control: { type: 'number', min: 0, max: 100, step: 1 } },
    max: { control: { type: 'number', min: 1, max: 100, step: 1 } },
  },
};

export default meta;
type Story = StoryObj<ProgressArgs>;

/** Workbench — determinate bar at a fixed width, driven by the value control. */
export const Workbench: Story = {
  args: { value: 60, max: 100 },
  render: (args) => ({
    props: args,
    template: `<div class="w-64"><gr-progress [value]="value" [max]="max" /></div>`,
  }),
};

export const Default: Story = {
  args: { value: 60, max: 100 },
  render: (args) => ({
    props: args,
    template: `<div class="w-64"><gr-progress [value]="value" [max]="max" /></div>`,
  }),
};

export const Zero: Story = {
  args: { value: 0, max: 100 },
  render: (args) => ({
    props: args,
    template: `<div class="w-64"><gr-progress [value]="value" [max]="max" /></div>`,
  }),
};

export const Quarter: Story = {
  args: { value: 25, max: 100 },
  render: (args) => ({
    props: args,
    template: `<div class="w-64"><gr-progress [value]="value" [max]="max" /></div>`,
  }),
};

export const Half: Story = {
  args: { value: 50, max: 100 },
  render: (args) => ({
    props: args,
    template: `<div class="w-64"><gr-progress [value]="value" [max]="max" /></div>`,
  }),
};

export const Complete: Story = {
  args: { value: 100, max: 100 },
  render: (args) => ({
    props: args,
    template: `<div class="w-64"><gr-progress [value]="value" [max]="max" /></div>`,
  }),
};

/**
 * Indeterminate — `value=null` reports `state="indeterminate"` from
 * Spartan brain. Bar stays at translateX(-100%) (no fill).
 */
export const Indeterminate: Story = {
  args: { value: null, max: 100 },
  render: (args) => ({
    props: args,
    template: `<div class="w-64"><gr-progress [value]="value" [max]="max" /></div>`,
  }),
};

/**
 * Custom max — `3/5` rendered as 60% fill. Useful for multi-step forms
 * or batch jobs where you want to expose the step count, not a percent.
 */
export const CustomMax: Story = {
  args: { value: 3, max: 5 },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-64 space-y-2">
        <gr-progress [value]="value" [max]="max" />
        <p class="text-xs text-muted-foreground">Step {{ value }} of {{ max }}</p>
      </div>
    `,
  }),
};

/**
 * Sweep — all key values in one canvas for regression checks.
 */
export const Sweep: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="w-64 space-y-3">
        <div>
          <p class="mb-1 text-xs text-muted-foreground">0%</p>
          <gr-progress [value]="0" />
        </div>
        <div>
          <p class="mb-1 text-xs text-muted-foreground">25%</p>
          <gr-progress [value]="25" />
        </div>
        <div>
          <p class="mb-1 text-xs text-muted-foreground">50%</p>
          <gr-progress [value]="50" />
        </div>
        <div>
          <p class="mb-1 text-xs text-muted-foreground">75%</p>
          <gr-progress [value]="75" />
        </div>
        <div>
          <p class="mb-1 text-xs text-muted-foreground">100%</p>
          <gr-progress [value]="100" />
        </div>
      </div>
    `,
  }),
};
