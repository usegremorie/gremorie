import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Slider } from './slider';

/**
 * Slider — continuous numeric input via draggable thumb. Angular parity port of
 * React `Slider` from `@gremorie/rx-forms` (Radix Slider under the hood, here
 * the spartan `BrnSlider` brain directive).
 *
 * Single thumb by default; a two-element `value` renders a range slider. Honors
 * `min`, `max`, `step`, `disabled` and `orientation`.
 */
const meta: Meta<Slider> = {
  title: 'Forms/Slider',
  component: Slider,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [Slider] })],
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    disabled: { control: 'boolean' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<Slider>;

export const Workbench: Story = {
  parameters: { layout: 'padded' },
  args: {
    value: [50],
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    orientation: 'horizontal',
    thumbAriaLabel: 'Value',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-80">
        <gn-slider
          [value]="value"
          [min]="min"
          [max]="max"
          [step]="step"
          [disabled]="disabled"
          [orientation]="orientation"
          [thumbAriaLabel]="thumbAriaLabel"
        />
      </div>
    `,
  }),
};

/** Range slider — two thumbs with independent accessible labels. */
export const Range: Story = {
  parameters: { layout: 'padded' },
  render: () => ({
    template: `
      <div class="w-80">
        <gn-slider [value]="[25, 75]" [thumbAriaLabel]="['Minimum', 'Maximum']" />
      </div>
    `,
  }),
};

/** Vertical orientation — useful for volume/level controls in tight layouts. */
export const Vertical: Story = {
  parameters: { layout: 'padded' },
  render: () => ({
    template: `
      <div class="h-44">
        <gn-slider [value]="[40]" orientation="vertical" thumbAriaLabel="Level" />
      </div>
    `,
  }),
};
