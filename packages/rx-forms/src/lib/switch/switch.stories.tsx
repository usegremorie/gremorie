import type { Meta, StoryObj } from '@storybook/react';

import { Label } from '../label/label';
import { Switch } from './switch';

/**
 * # Switch
 *
 * Immediate-effect toggle, a faithful shadcn/Radix port. Use Switch when
 * flipping it changes state right away (notifications, dark mode). For a checked
 * value submitted with a form, use `Checkbox` instead — Switch is for "now",
 * Checkbox for "on submit". Two sizes: `sm` and `default`.
 *
 * ## Anatomy
 *
 * ```text
 * Switch   pill track with a sliding thumb; toggles state on click
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `size` | `"sm" \| "default"` | `"default"` | Track/thumb size. |
 * | `checked` | `boolean` | — | Controlled state. |
 * | `defaultChecked` | `boolean` | — | Uncontrolled initial state. |
 * | `onCheckedChange` | `(checked: boolean) => void` | — | Change handler. |
 * | `disabled` | `boolean` | `false` | Disable interaction. |
 * | ...`Switch.Root` | `React.ComponentProps<typeof SwitchPrimitive.Root>` | — | All Radix props. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--primary` | checked track fill |
 * | `--input` | unchecked track fill |
 * | `--background` | thumb fill |
 * | `--ring` | focus ring |
 */
const meta = {
  title: 'Inputs/Selection/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'default'] },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Uncontrolled, off by default. */
export const Default: Story = {};

/** On. */
export const Checked: Story = { args: { defaultChecked: true } };

/** Small size. */
export const Small: Story = { args: { size: 'sm', defaultChecked: true } };

/** Disabled, off and on. */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-4">
      <Switch disabled />
      <Switch disabled defaultChecked />
    </div>
  ),
};

/** Both sizes side by side. */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-4">
      <Switch size="sm" defaultChecked />
      <Switch size="default" defaultChecked />
    </div>
  ),
};

/** Paired with a Label — the typical settings row. */
export const WithLabel: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="airplane" />
      <Label htmlFor="airplane">Airplane mode</Label>
    </div>
  ),
};
