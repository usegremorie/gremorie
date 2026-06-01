import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";

import { Stack } from "./stack";

/**
 * # Stack
 *
 * A Gremorie layout primitive — a `<div>` pre-configured as `flex flex-col`
 * with consistent `gap`, `align`, and `justify` props. Reach for Stack any time
 * items flow top-to-bottom: card contents, form sections, settings rows,
 * vertical menus. For rows use `Flex`; for two-axis grids use `Grid`; for a
 * one-off styled div use `Box`.
 *
 * ## Anatomy
 *
 * A single element: a flex column whose spacing and cross-/main-axis alignment
 * are driven entirely by props (no subcomponents).
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `gap` | `"none" \| "xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl"` | `"md"` | Spacing between children (0 / 4 / 8 / 16 / 24 / 32 / 48 px). |
 * | `align` | `"start" \| "center" \| "end" \| "stretch" \| "baseline"` | `"stretch"` | Cross-axis (`align-items`). |
 * | `justify` | `"start" \| "center" \| "end" \| "between" \| "around" \| "evenly"` | `"start"` | Main-axis (`justify-content`). |
 * | `ref` | `Ref<HTMLDivElement>` | — | Forwarded to the underlying `div`. |
 *
 * ## Variables (design tokens)
 *
 * Stack is structural and ships no token-driven visuals; the demo boxes below
 * use `--muted` / `--border` only for visibility.
 */
const meta = {
  title: "Layout & display/Containers/Stack",
  component: Stack,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    gap: {
      control: "inline-radio",
      options: ["none", "xs", "sm", "md", "lg", "xl", "2xl"],
    },
    align: {
      control: "inline-radio",
      options: ["start", "center", "end", "stretch", "baseline"],
    },
    justify: {
      control: "inline-radio",
      options: ["start", "center", "end", "between", "around", "evenly"],
    },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const Box = ({ children }: { children: ReactNode }) => (
  <div className="bg-muted flex h-10 items-center justify-center rounded-md border px-4 text-sm">
    {children}
  </div>
);

/** A default stack — `gap="md"`, stretched children. */
export const Default: Story = {
  render: (args) => (
    <Stack {...args} className="w-64">
      <Box>One</Box>
      <Box>Two</Box>
      <Box>Three</Box>
    </Stack>
  ),
};

/** Every `gap` step, side by side. */
export const Gaps: Story = {
  render: () => (
    <div className="flex items-start gap-8">
      {(["none", "sm", "md", "lg", "xl"] as const).map((gap) => (
        <div key={gap}>
          <div className="text-muted-foreground mb-2 text-xs">gap={gap}</div>
          <Stack gap={gap} className="w-24">
            <Box>1</Box>
            <Box>2</Box>
            <Box>3</Box>
          </Stack>
        </div>
      ))}
    </div>
  ),
};

/** Cross-axis `align` values (note the varying child widths). */
export const Align: Story = {
  render: () => (
    <div className="flex items-start gap-8">
      {(["start", "center", "end", "stretch"] as const).map((align) => (
        <div key={align}>
          <div className="text-muted-foreground mb-2 text-xs">align={align}</div>
          <Stack align={align} gap="sm" className="bg-card w-40 rounded-md border p-2">
            <Box>Short</Box>
            <Box>A longer item</Box>
          </Stack>
        </div>
      ))}
    </div>
  ),
};

/** Main-axis `justify` inside a fixed-height container. */
export const Justify: Story = {
  render: () => (
    <div className="flex items-start gap-8">
      {(["start", "center", "end", "between"] as const).map((justify) => (
        <div key={justify}>
          <div className="text-muted-foreground mb-2 text-xs">
            justify={justify}
          </div>
          <Stack
            justify={justify}
            className="bg-card h-48 w-28 rounded-md border p-2"
          >
            <Box>1</Box>
            <Box>2</Box>
            <Box>3</Box>
          </Stack>
        </div>
      ))}
    </div>
  ),
};
