import type { Meta, StoryObj } from '@storybook/react';

import { Label } from '../label/label';
import { Slider } from './slider';

/**
 * # Slider
 *
 * Continuous numeric input via a draggable thumb, wrapping Radix Slider. Single
 * thumb by default; pass a two-value `defaultValue`/`value` for a range slider.
 * Honors `step`, `min`, `max` and `orientation="vertical"`. Adds a
 * `thumbAriaLabel` prop so each thumb has an accessible name (WCAG 4.1.2).
 *
 * ## Anatomy
 *
 * ```text
 * Slider                  Root; wraps Radix Slider.Root
 * ├─ Track                track background
 * │  └─ Range             filled portion of the track
 * └─ Thumb                one draggable handle per value
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `defaultValue` | `number[]` | `[min, max]` | Uncontrolled value(s); length sets thumb count. |
 * | `value` | `number[]` | — | Controlled value(s). |
 * | `min` | `number` | `0` | Minimum. |
 * | `max` | `number` | `100` | Maximum. |
 * | `step` | `number` | `1` | Step increment. |
 * | `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Axis. |
 * | `thumbAriaLabel` | `string \| string[]` | — | Accessible name(s) for the thumb(s). |
 * | `disabled` | `boolean` | `false` | Disable interaction. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--muted` | track background |
 * | `--primary` | filled range + thumb border |
 * | `--background` | thumb fill |
 * | `--ring` | thumb focus/hover ring |
 */
const meta = {
  title: 'Inputs/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Single thumb at 50%. */
export const Single: Story = {
  args: { defaultValue: [50], thumbAriaLabel: 'Value' },
  render: (args) => <Slider className="w-72" {...args} />,
};

/** Two thumbs defining a range (e.g. a price filter). */
export const Range: Story = {
  args: {
    defaultValue: [25, 75],
    thumbAriaLabel: ['Minimum', 'Maximum'],
  },
  render: (args) => <Slider className="w-72" {...args} />,
};

/** Stepped slider (steps of 10). */
export const Stepped: Story = {
  args: { defaultValue: [40], step: 10, thumbAriaLabel: 'Value' },
  render: (args) => <Slider className="w-72" {...args} />,
};

/** Disabled. */
export const Disabled: Story = {
  args: { defaultValue: [50], disabled: true, thumbAriaLabel: 'Value' },
  render: (args) => <Slider className="w-72" {...args} />,
};

/** Vertical orientation. */
export const Vertical: Story = {
  args: {
    defaultValue: [60],
    orientation: 'vertical',
    thumbAriaLabel: 'Value',
  },
  render: (args) => (
    <div className="h-44">
      <Slider {...args} />
    </div>
  ),
};

/** With a label + visible current value (always show the value). */
export const WithLabel: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label>Volume</Label>
        <span className="text-sm text-muted-foreground">70%</span>
      </div>
      <Slider defaultValue={[70]} thumbAriaLabel="Volume" />
    </div>
  ),
};
