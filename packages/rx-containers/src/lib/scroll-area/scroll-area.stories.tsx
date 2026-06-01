import type { Meta, StoryObj } from "@storybook/react";

import { ScrollArea, ScrollBar } from "./scroll-area";

/**
 * # ScrollArea
 *
 * A themeable scroll container, wrapping Radix ScrollArea. Native scroll is
 * fine 99% of the time — reach for ScrollArea when you want consistent
 * scrollbar styling across OSs, or when the bar lives inside a rounded card and
 * the native one would bleed past the radius. The root mounts a vertical bar by
 * default; add `<ScrollBar orientation="horizontal" />` for sideways content.
 *
 * ## Anatomy
 *
 * - **ScrollArea** — root: viewport + a default vertical `ScrollBar` + corner.
 * - **ScrollBar** — a styled scrollbar; mount one explicitly per axis you need.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `className` | `string` | — | Constrain the viewport (set a fixed height/width to enable scrolling). |
 * | `orientation` (ScrollBar) | `"vertical" \| "horizontal"` | `"vertical"` | Which axis the bar tracks. |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `ScrollBar` | A per-axis styled scrollbar (thumb on `--border`). |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--border` | the scrollbar thumb fill |
 * | `--ring` | focus-visible ring on the viewport |
 */
const meta = {
  title: "Layout & display/Containers/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const TAGS = Array.from({ length: 40 }, (_, i) => `v1.2.0-beta.${40 - i}`);

/** Vertical overflow — a long, fixed-height list. */
export const Vertical: Story = {
  render: () => (
    <ScrollArea className="h-64 w-56 rounded-md border">
      <div className="p-4">
        <h4 className="mb-3 text-sm font-medium">Tags</h4>
        {TAGS.map((tag) => (
          <div key={tag} className="border-border border-b last:border-b-0">
            <div className="py-1.5 font-mono text-sm">{tag}</div>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

/** Horizontal overflow — wide content with an explicit horizontal `ScrollBar`. */
export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-80 rounded-md border whitespace-nowrap">
      <div className="flex w-max gap-4 p-4">
        {Array.from({ length: 12 }, (_, i) => (
          <figure key={i} className="shrink-0">
            <div className="bg-muted flex size-32 items-center justify-center rounded-md text-2xl font-semibold">
              {i + 1}
            </div>
            <figcaption className="text-muted-foreground pt-2 text-xs">
              Photo {i + 1}
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};
