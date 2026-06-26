import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ToggleGroup, ToggleGroupItem } from './toggle-group';

/**
 * ToggleGroup — coordinated set of Toggles. Angular parity port of React
 * `ToggleGroup` from `@gremorie/rx-forms` (Radix ToggleGroup / spartan
 * `BrnToggleGroup`).
 *
 * `type="single"` is radio-like, `type="multiple"` is checkbox-like. `variant`,
 * `size` and `spacing` propagate from the Root to items.
 */
// `type` is exposed via the BrnToggleGroup hostDirective, not a class input, so
// widen the story type to include it for the controls/args.
const meta: Meta<ToggleGroup & { type: 'single' | 'multiple' }> = {
  title: 'Forms/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ToggleGroup, ToggleGroupItem] })],
  argTypes: {
    type: { control: 'inline-radio', options: ['single', 'multiple'] },
    variant: { control: 'inline-radio', options: ['default', 'outline'] },
    size: { control: 'inline-radio', options: ['default', 'sm', 'lg'] },
    spacing: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<ToggleGroup & { type: 'single' | 'multiple' }>;

export const Workbench: Story = {
  parameters: { layout: 'padded' },
  args: {
    type: 'single',
    variant: 'outline',
    size: 'default',
    spacing: 0,
  },
  render: (args) => ({
    props: args,
    template: `
      <gn-toggle-group
        [type]="type"
        [variant]="variant"
        [size]="size"
        [spacing]="spacing"
      >
        <gn-toggle-group-item value="left" ariaLabel="Align left">L</gn-toggle-group-item>
        <gn-toggle-group-item value="center" ariaLabel="Align center">C</gn-toggle-group-item>
        <gn-toggle-group-item value="right" ariaLabel="Align right">R</gn-toggle-group-item>
      </gn-toggle-group>
    `,
  }),
};

/** Multiple selection — checkbox-like; any number of items can be pressed. */
export const Multiple: Story = {
  parameters: { layout: 'padded' },
  render: () => ({
    template: `
      <gn-toggle-group type="multiple" variant="outline">
        <gn-toggle-group-item value="bold" ariaLabel="Bold"><span class="font-bold">B</span></gn-toggle-group-item>
        <gn-toggle-group-item value="italic" ariaLabel="Italic"><span class="italic">I</span></gn-toggle-group-item>
        <gn-toggle-group-item value="underline" ariaLabel="Underline"><span class="underline">U</span></gn-toggle-group-item>
      </gn-toggle-group>
    `,
  }),
};
