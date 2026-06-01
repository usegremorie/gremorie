import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Progress } from "./progress";

/**
 * # Progress
 *
 * A determinate progress indicator (0–100), wrapping Radix Progress. Use it when
 * the percentage complete is known — uploads, multi-step forms, batch jobs. For
 * unknown durations use a `Skeleton` or spinner instead. Always pair the bar with
 * a numeric value or label so the state is never silent.
 *
 * ## Anatomy
 *
 * - **Progress** — a rounded track containing a filled indicator translated by `value`%.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `value` | `number \| null` | — | Completion percentage (0–100). `null`/omitted renders empty. |
 * | `max` | `number` | `100` | Maximum value. |
 * | `className` | `string` | — | Sizing / color overrides. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--primary` | Indicator fill |
 * | `--primary` (at 20%) | Track background |
 */
const meta = {
  title: "Interaction/Feedback/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive — drag the `value` control. */
export const Default: Story = {
  args: { value: 60 },
  render: (args) => <Progress {...args} className="w-80" />,
};

/** A range of fixed completion values. */
export const Values: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      {[0, 25, 50, 75, 100].map((v) => (
        <div key={v} className="flex items-center gap-3">
          <Progress value={v} className="w-full" />
          <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
            {v}%
          </span>
        </div>
      ))}
    </div>
  ),
};

/** Animated — value climbs over time, mimicking a live upload. */
export const Animated: Story = {
  render: () => {
    const [value, setValue] = React.useState(13);
    React.useEffect(() => {
      const id = setInterval(() => {
        setValue((v) => (v >= 100 ? 0 : v + 7));
      }, 600);
      return () => clearInterval(id);
    }, []);
    return <Progress value={value} className="w-80" />;
  },
};

/** Empty track — `value={0}` (or omitted) for not-yet-started states. */
export const Empty: Story = {
  args: { value: 0 },
  render: (args) => <Progress {...args} className="w-80" />,
};
