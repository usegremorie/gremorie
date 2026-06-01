import type { Meta, StoryObj } from "@storybook/react";
import { Bold, Italic, Underline } from "lucide-react";

import { Toggle } from "./toggle";

/**
 * # Toggle
 *
 * A two-state button (`aria-pressed`) for stateful actions outside of form
 * submission — bold/italic in an editor, view-mode switches, filter chips. A
 * faithful shadcn/Radix port driven by a CVA factory with two variants and three
 * sizes. For form-bound booleans use Checkbox or Switch; `ToggleGroup` is the
 * coordinated multi-button equivalent.
 *
 * ## Anatomy
 *
 * A single `Toggle.Root` styled by `toggleVariants`; `data-[state=on]` paints
 * the active (accent) look.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `variant` | `"default" \| "outline"` | `"default"` | Visual style. |
 * | `size` | `"default" \| "sm" \| "lg"` | `"default"` | Size preset. |
 * | `pressed` | `boolean` | — | Controlled pressed state. |
 * | `defaultPressed` | `boolean` | — | Uncontrolled initial state. |
 * | `onPressedChange` | `(pressed: boolean) => void` | — | Change handler. |
 * | `disabled` | `boolean` | `false` | Disable interaction. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--accent` / `--accent-foreground` | pressed (`data-[state=on]`) look |
 * | `--muted` / `--muted-foreground` | hover |
 * | `--input` | `outline` border |
 * | `--ring` | focus ring |
 */
const meta = {
  title: "Inputs/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { children: <Bold />, "aria-label": "Toggle bold" },
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "outline"] },
    size: { control: "inline-radio", options: ["default", "sm", "lg"] },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default, off. */
export const Default: Story = {};

/** Pressed (on). */
export const Pressed: Story = { args: { defaultPressed: true } };

/** Outline variant. */
export const Outline: Story = { args: { variant: "outline" } };

/** The three sizes. */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-3">
      <Toggle size="sm" aria-label="Bold">
        <Bold />
      </Toggle>
      <Toggle size="default" aria-label="Bold">
        <Bold />
      </Toggle>
      <Toggle size="lg" aria-label="Bold">
        <Bold />
      </Toggle>
    </div>
  ),
};

/** With text alongside the icon. */
export const WithText: Story = {
  args: { children: undefined },
  parameters: { controls: { disable: true } },
  render: () => (
    <Toggle aria-label="Italic">
      <Italic /> Italic
    </Toggle>
  ),
};

/** Disabled, off and on. */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-3">
      <Toggle disabled aria-label="Underline">
        <Underline />
      </Toggle>
      <Toggle disabled defaultPressed aria-label="Underline">
        <Underline />
      </Toggle>
    </div>
  ),
};
