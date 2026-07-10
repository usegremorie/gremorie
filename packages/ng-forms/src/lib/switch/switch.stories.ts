import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Switch } from './switch';

/**
 * Switch — immediate-effect toggle. Angular parity port of React `Switch` from
 * `@gremorie/rx-forms` (wraps `@radix-ui/react-switch`; Angular wraps the
 * spartan brain `BrnSwitch` + `BrnSwitchThumb`).
 *
 * Two sizes — `sm` and `default` — exposed via the `size` input and surfaced as
 * `data-size` on the host, which the track and thumb consume via
 * `group-data-[size]/switch`.
 */
const meta: Meta<Switch> = {
  title: 'Inputs/Selection/Switch',
  component: Switch,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [Switch] })],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'default'] },
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Switch>;

/** Interactive workbench — drive every prop from the controls panel. */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  args: {
    checked: false,
    size: 'default',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <gn-switch
        [checked]="checked"
        [size]="size"
        [disabled]="disabled"
      />
    `,
  }),
};

/** Checked. */
export const Checked: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<gn-switch [checked]="true" />`,
  }),
};

/** Both sizes side by side. */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex items-center gap-6">
        <label class="flex items-center gap-2 text-sm">
          <gn-switch size="sm" [checked]="true" /> Small
        </label>
        <label class="flex items-center gap-2 text-sm">
          <gn-switch size="default" [checked]="true" /> Default
        </label>
      </div>
    `,
  }),
};

/** Disabled (off and on). */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex items-center gap-6">
        <gn-switch [disabled]="true" />
        <gn-switch [disabled]="true" [checked]="true" />
      </div>
    `,
  }),
};
