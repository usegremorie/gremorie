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
 * - **DatePicker** — outlined trigger button (shows the formatted date or placeholder) opening a popover that hosts a single-mode `Calendar`.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `value` | `Date` | — | Controlled selected date. |
 * | `onValueChange` | `(date: Date \| undefined) => void` | — | Selection callback. |
 * | `placeholder` | `string` | `"Selecione uma data"` | Empty-state label. |
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
  title: 'Interaction/Overlays/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    value: { control: false },
    onValueChange: { control: false },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

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
