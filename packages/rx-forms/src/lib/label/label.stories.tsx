import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from '../checkbox/checkbox';
import { Input } from '../input/input';
import { Label } from './label';

/**
 * # Label
 *
 * Accessible label primitive (Radix `Label.Root`), a faithful shadcn port. Use
 * it as the static label above or beside any control. When `htmlFor` matches a
 * control's `id`, clicking the label focuses (or toggles) the control. It also
 * dims automatically when a peer/`group` control is disabled.
 *
 * ## Anatomy
 *
 * ```text
 * Label   single Radix Label.Root row; small, medium-weight, non-selectable
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `htmlFor` | `string` | — | Associates the label with a control `id`. |
 * | ...`Label.Root` | `React.ComponentProps<typeof LabelPrimitive.Root>` | — | All Radix Label props. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--foreground` | label text |
 * | (peer/group `disabled`) | drives the 50% opacity dim |
 */
const meta = {
  title: 'Inputs/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { children: 'Email address' },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A standalone label. */
export const Default: Story = {};

/** Associated with a text input (clicking the label focuses the field). */
export const WithInput: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="ada@example.com" />
    </div>
  ),
};

/** Inline with a checkbox (clicking the label toggles it). */
export const WithCheckbox: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="newsletter" />
      <Label htmlFor="newsletter">Subscribe to the newsletter</Label>
    </div>
  ),
};

/** Dims automatically when the peer control is disabled. */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="disabled-peer" disabled className="peer" />
      <Label htmlFor="disabled-peer">Unavailable option</Label>
    </div>
  ),
};
