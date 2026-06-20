import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import type { DateRange } from 'react-day-picker';

import { Calendar } from './calendar';

/**
 * # Calendar
 *
 * Date picker grid built on `react-day-picker` v10, styled with KDS semantic
 * tokens. Supports three selection modes via `mode`: `single`, `range` and
 * `multiple`. Use it standalone in spacious layouts, or wrap it in a Popover to
 * build a compact `DatePicker`.
 *
 * ## Anatomy
 *
 * ```text
 * Calendar   self-contained DayPicker grid (caption + nav, weekday header, day buttons)
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `mode` | `"single" \| "range" \| "multiple"` | — | Selection behavior. |
 * | `selected` | `Date \| Date[] \| DateRange` | — | Controlled selection (shape depends on `mode`). |
 * | `onSelect` | `(value) => void` | — | Selection change handler. |
 * | `showOutsideDays` | `boolean` | `true` | Render trailing/leading days from adjacent months. |
 * | `numberOfMonths` | `number` | `1` | How many month grids to show side-by-side. |
 * | `disabled` | `Matcher \| Matcher[]` | — | Days that cannot be selected. |
 * | ...`DayPicker` | `React.ComponentProps<typeof DayPicker>` | — | All react-day-picker props. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--primary` / `--primary-foreground` | selected day fill |
 * | `--accent` / `--accent-foreground` | today highlight + day hover |
 * | `--muted-foreground` | weekday header + outside days |
 * | `--ring` | focus ring on nav buttons |
 */
const meta = {
  title: 'Inputs/Date/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Single-date selection (controlled). */
export const Single: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    );
  },
};

/** Range selection across two months (faixa de datas). */
export const Range: Story = {
  render: () => {
    const today = new Date();
    const [range, setRange] = React.useState<DateRange | undefined>({
      from: today,
      to: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
    });
    return (
      <Calendar
        mode="range"
        numberOfMonths={2}
        selected={range}
        onSelect={setRange}
        className="rounded-md border"
      />
    );
  },
};

/** Multiple independent dates. */
export const Multiple: Story = {
  render: () => {
    const [dates, setDates] = React.useState<Date[] | undefined>([]);
    return (
      <Calendar
        mode="multiple"
        selected={dates}
        onSelect={setDates}
        className="rounded-md border"
      />
    );
  },
};

/** Disabled days — here, all weekends are blocked. */
export const WithDisabledDays: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>();
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={(day) => day.getDay() === 0 || day.getDay() === 6}
        className="rounded-md border"
      />
    );
  },
};
