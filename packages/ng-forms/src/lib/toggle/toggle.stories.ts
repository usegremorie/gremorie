import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Toggle } from './toggle';

/**
 * Toggle — single button with on/off state. Angular parity port of React
 * `Toggle` from `@gremorie/rx-forms` (Radix Toggle / spartan `BrnToggle`).
 *
 * A two-state button (`aria-pressed`) for stateful actions — bold/italic, view
 * switches, filter chips. `variant` and `size` mirror the React cva.
 */
const meta: Meta<Toggle> = {
  title: 'Inputs/Buttons/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [Toggle] })],
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'outline'] },
    size: { control: 'inline-radio', options: ['default', 'sm', 'lg'] },
    disabled: { control: 'boolean' },
    pressed: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Toggle>;

export const Workbench: Story = {
  parameters: { layout: 'padded' },
  args: {
    variant: 'default',
    size: 'default',
    disabled: false,
    pressed: false,
    ariaLabel: 'Toggle italic',
  },
  render: (args) => ({
    props: args,
    template: `
      <gn-toggle
        [variant]="variant"
        [size]="size"
        [disabled]="disabled"
        [pressed]="pressed"
        [ariaLabel]="ariaLabel"
      >
        <span class="italic font-serif">I</span>
      </gn-toggle>
    `,
  }),
};

/** Outline variant — bordered surface for toolbars on busy backgrounds. */
export const Outline: Story = {
  parameters: { layout: 'padded' },
  render: () => ({
    template: `
      <gn-toggle variant="outline" ariaLabel="Toggle bold">
        <span class="font-bold">B</span>
      </gn-toggle>
    `,
  }),
};
