import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Checkbox } from './checkbox';

/**
 * Checkbox — binary or indeterminate selection control. Angular parity port of
 * React `Checkbox` from `@gremorie/rx-forms` (wraps `@radix-ui/react-checkbox`;
 * Angular wraps the spartan brain `BrnCheckbox`).
 *
 * Supports the three canonical states — unchecked, checked, indeterminate —
 * and renders a hand-inlined lucide `check` icon as the indicator.
 */
const meta: Meta<Checkbox> = {
  title: 'Inputs/Selection/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [Checkbox] })],
  argTypes: {
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    ariaInvalid: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Checkbox>;

/** Interactive workbench — drive every prop from the controls panel. */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  args: {
    checked: false,
    indeterminate: false,
    disabled: false,
    required: false,
    ariaInvalid: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <gn-checkbox
        ariaLabel="Accept terms"
        [checked]="checked"
        [indeterminate]="indeterminate"
        [disabled]="disabled"
        [required]="required"
        [ariaInvalid]="ariaInvalid"
      />
    `,
  }),
};

/** Checked. */
export const Checked: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<gn-checkbox ariaLabel="Checked" [checked]="true" />`,
  }),
};

/** Disabled (both unchecked and checked). */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex items-center gap-4">
        <gn-checkbox ariaLabel="Disabled unchecked" [disabled]="true" />
        <gn-checkbox ariaLabel="Disabled checked" [disabled]="true" [checked]="true" />
      </div>
    `,
  }),
};

/**
 * States — the full matrix on one canvas: unchecked, checked, indeterminate.
 * Useful for regression when adjusting the indicator gating or `data-state`
 * classes.
 */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex items-center gap-6">
        <label class="flex items-center gap-2 text-sm">
          <gn-checkbox ariaLabel="Unchecked" /> Unchecked
        </label>
        <label class="flex items-center gap-2 text-sm">
          <gn-checkbox ariaLabel="Checked" [checked]="true" /> Checked
        </label>
        <label class="flex items-center gap-2 text-sm">
          <gn-checkbox ariaLabel="Indeterminate" [indeterminate]="true" /> Indeterminate
        </label>
      </div>
    `,
  }),
};
