import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { RadioGroup, RadioGroupItem } from './radio-group';

/**
 * RadioGroup — single-select group of mutually-exclusive options. Angular
 * parity port of React `RadioGroup` from `@gremorie/rx-forms` (wraps
 * `@radix-ui/react-radio-group`; Angular composes the spartan brain
 * `BrnRadioGroup` + `brn-radio`).
 *
 * Compound API: `gn-radio-group` (Root) + `gn-radio-group-item` (option).
 * Roving tabindex and arrow-key navigation are handled by the brain.
 */
const meta: Meta<RadioGroup> = {
  title: 'Inputs/Selection/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [RadioGroup, RadioGroupItem] })],
};

export default meta;
type Story = StoryObj<RadioGroup>;

/** Interactive workbench — pick a default value, toggle disabled. */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  args: {
    value: 'comfortable',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <gn-radio-group [value]="value" [disabled]="disabled">
        <label class="flex items-center gap-2 text-sm">
          <gn-radio-group-item value="default" id="r-default" /> Default
        </label>
        <label class="flex items-center gap-2 text-sm">
          <gn-radio-group-item value="comfortable" id="r-comfortable" /> Comfortable
        </label>
        <label class="flex items-center gap-2 text-sm">
          <gn-radio-group-item value="compact" id="r-compact" /> Compact
        </label>
      </gn-radio-group>
    `,
  }),
};

/** With a pre-selected value. */
export const Checked: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gn-radio-group value="pro">
        <label class="flex items-center gap-2 text-sm">
          <gn-radio-group-item value="free" id="c-free" /> Free
        </label>
        <label class="flex items-center gap-2 text-sm">
          <gn-radio-group-item value="pro" id="c-pro" /> Pro
        </label>
      </gn-radio-group>
    `,
  }),
};

/** Disabled — the whole group (or a single item) opts out of interaction. */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gn-radio-group value="a" [disabled]="true">
        <label class="flex items-center gap-2 text-sm">
          <gn-radio-group-item value="a" id="d-a" /> Selected, disabled
        </label>
        <label class="flex items-center gap-2 text-sm">
          <gn-radio-group-item value="b" id="d-b" /> Unselected, disabled
        </label>
      </gn-radio-group>
    `,
  }),
};
