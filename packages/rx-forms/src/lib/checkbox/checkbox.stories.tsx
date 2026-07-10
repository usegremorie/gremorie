import type { Meta, StoryObj } from '@storybook/react';

import { Label } from '../label/label';
import { Checkbox } from './checkbox';

/**
 * # Checkbox
 *
 * Binary (or indeterminate) selection control, a faithful shadcn/Radix port.
 * Supports the three canonical states — unchecked, checked, indeterminate — via
 * the Radix `checked` prop (`true | false | "indeterminate"`). The indicator is
 * a lucide `CheckIcon`.
 *
 * Use Checkbox when the value is part of a form to be submitted; reach for
 * `Switch` when the change takes effect immediately.
 *
 * ## Anatomy
 *
 * ```text
 * Checkbox   4×4 rounded box; renders the check glyph when checked
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `checked` | `boolean \| "indeterminate"` | — | Controlled checked state. |
 * | `defaultChecked` | `boolean` | — | Uncontrolled initial state. |
 * | `onCheckedChange` | `(checked) => void` | — | Change handler. |
 * | `disabled` | `boolean` | `false` | Disable interaction. |
 * | ...`Checkbox.Root` | `React.ComponentProps<typeof CheckboxPrimitive.Root>` | — | All Radix Checkbox props. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--primary` / `--primary-foreground` | checked fill + check glyph |
 * | `--input` | unchecked border |
 * | `--ring` | focus ring |
 * | `--destructive` | `aria-invalid` state |
 */
const meta = {
  title: 'Inputs/Selection/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Workbench preset: renders the IDENTICAL use case as the Angular `Workbench`
 * story in `ng-forms`. Keep both datasets in sync.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  args: {
    checked: false,
    disabled: false,
    required: false,
    'aria-invalid': false,
    'aria-label': 'Accept terms',
  },
};

/** Uncontrolled, unchecked by default. */
export const Default: Story = {};

/** Checked. */
export const Checked: Story = { args: { defaultChecked: true } };

/** Indeterminate — the "some but not all" parent state. */
export const Indeterminate: Story = { args: { checked: 'indeterminate' } };

/** Disabled, in both unchecked and checked states. */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-4">
      <Checkbox disabled />
      <Checkbox disabled defaultChecked />
    </div>
  ),
};

/** Paired with a clickable Label via shared `id`. */
export const WithLabel: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

/** All states side by side. */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Checkbox />
        <span className="text-xs text-muted-foreground">Unchecked</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox defaultChecked />
        <span className="text-xs text-muted-foreground">Checked</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox checked="indeterminate" />
        <span className="text-xs text-muted-foreground">Indeterminate</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox disabled defaultChecked />
        <span className="text-xs text-muted-foreground">Disabled</span>
      </div>
    </div>
  ),
};
