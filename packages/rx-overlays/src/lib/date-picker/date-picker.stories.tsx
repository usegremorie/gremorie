import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import { DatePicker } from './date-picker';

/**
 * # DatePicker
 *
 * The canonical composition of `Popover` + `Calendar` with Gremorie defaults —
 * not a single primitive, but the ready-to-use wrapper the registry ships so you
 * don't re-wire the boilerplate. Single-date selection by default; on mobile
 * prefer a `Drawer` + `Calendar` since popovers behave poorly on small screens.
 *
 * ## Anatomy
 *
 * ```text
 * DatePicker                       composite of Popover + Calendar with Gremorie defaults
 * ├─ Popover                       floating-surface root
 * │  ├─ PopoverTrigger             asChild wrapper around the outlined Button
 * │  │  └─ Button                  outlined trigger (formatted date or placeholder)
 * │  └─ PopoverContent             floating surface (w-auto p-0)
 * │     └─ Calendar                single-mode date grid
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `value` | `Date` | — | Controlled selected date. |
 * | `onValueChange` | `(date: Date \| undefined) => void` | — | Selection callback. |
 * | `placeholder` | `string` | `"Pick a date"` | Empty-state label. |
 * | `disabled` | `boolean` | `false` | Disables the trigger. |
 * | `className` | `string` | — | Extra trigger classes. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--muted-foreground` | Placeholder text |
 * | `--popover` | Calendar surface |
 * | `--border` | Trigger + popover border |
 */
const meta = {
  title: 'Inputs/Date/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    value: { control: false },
    onValueChange: { control: false },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Workbench preset: renders the IDENTICAL use case as the Angular `Workbench`
 * story in `ng-forms`. Keep both datasets in sync.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  args: { placeholder: 'Pick a date', disabled: false },
  render: (args) => {
    const [date, setDate] = React.useState<Date | undefined>();
    return <DatePicker {...args} value={date} onValueChange={setDate} />;
  },
};

/** Uncontrolled-feeling default with the placeholder visible. */
export const Default: Story = {
  render: (args) => {
    const [date, setDate] = React.useState<Date | undefined>();
    return <DatePicker {...args} value={date} onValueChange={setDate} />;
  },
};

/** Pre-selected date showing the `PP` formatted label. */
export const WithValue: Story = {
  render: (args) => {
    const [date, setDate] = React.useState<Date | undefined>(
      new Date(2025, 0, 15),
    );
    return <DatePicker {...args} value={date} onValueChange={setDate} />;
  },
};

/** Custom placeholder copy. */
export const CustomPlaceholder: Story = {
  args: { placeholder: 'Pick a delivery date' },
  render: (args) => {
    const [date, setDate] = React.useState<Date | undefined>();
    return <DatePicker {...args} value={date} onValueChange={setDate} />;
  },
};

/** Disabled trigger. */
export const Disabled: Story = {
  args: { disabled: true },
};
