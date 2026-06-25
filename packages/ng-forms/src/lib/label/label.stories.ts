import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Input } from '../input/input';
import { Label } from './label';

/**
 * Label — accessible label primitive. Angular parity port of React `Label`
 * from `@gremorie/rx-forms` (Radix `Label.Root` → native `<label>`).
 *
 * Use it as the static label above or beside any control. When `for` matches a
 * control's `id`, clicking the label focuses (or toggles) the control. It also
 * dims automatically when a peer/`group` control is disabled.
 */
const meta: Meta<Label> = {
  title: 'Forms/Label',
  component: Label,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [Label, Input] })],
};

export default meta;
type Story = StoryObj<Label>;

/** Interactive workbench — a standalone label. */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  args: { for: '' },
  render: (args) => ({
    props: args,
    template: `<gn-label [for]="for">Email address</gn-label>`,
  }),
};

/** Associated with a text input (clicking the label focuses the field). */
export const WithInput: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex w-72 flex-col gap-2">
        <gn-label for="email">Email</gn-label>
        <gn-input id="email" type="email" placeholder="ada@example.com" />
      </div>
    `,
  }),
};

/** Dims automatically when the peer control is disabled. */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex items-center gap-2">
        <gn-input id="disabled-peer" class="peer" [disabled]="true" />
        <gn-label for="disabled-peer">Unavailable option</gn-label>
      </div>
    `,
  }),
};
