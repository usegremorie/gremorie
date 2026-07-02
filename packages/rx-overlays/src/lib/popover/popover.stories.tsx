import type { Meta, StoryObj } from '@storybook/react';

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './popover';
import { Button, Input, Label } from '@gremorie/rx-forms';

/**
 * # Popover
 *
 * An anchored, click-triggered interactive content overlay — a faithful shadcn
 * port over Radix Popover. Hosts interactive content (mini forms, pickers, share
 * menus). Distinct from `Tooltip` (hover-only label) and `HoverCard` (hover-only
 * preview). When the content grows long or warrants blocking, escalate to
 * `Dialog` or `Sheet`.
 *
 * ## Anatomy
 *
 * ```text
 * Popover                       Radix root holding open state
 * ├─ PopoverTrigger             opens the popover on click
 * ├─ PopoverAnchor              alternate positioning anchor
 * └─ PopoverContent             portalled surface (align, sideOffset)
 *    └─ PopoverHeader           wraps title + description
 *       ├─ PopoverTitle         heading
 *       └─ PopoverDescription   supporting text
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `open` | `boolean` | — | Controlled open state. |
 * | `defaultOpen` | `boolean` | `false` | Uncontrolled initial state. |
 * | `onOpenChange` | `(open: boolean) => void` | — | Open-state callback. |
 * | `modal` | `boolean` | `false` | Block outside interaction while open. |
 *
 * `PopoverContent` adds `align` (default `"center"`) and `sideOffset` (default `4`).
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `PopoverTrigger` | Opens the popover. |
 * | `PopoverContent` | Surface. |
 * | `PopoverHeader` | Header wrapper. |
 * | `PopoverTitle` | Heading. |
 * | `PopoverDescription` | Supporting text. |
 * | `PopoverAnchor` | Positioning anchor. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--popover` / `--popover-foreground` | Surface |
 * | `--border` | Border |
 * | `--muted-foreground` | Description text |
 */
const meta = {
  title: 'Interaction/Overlays/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A small inline settings form inside a popover. */
export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open dimensions</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the dimensions for the layer.
          </PopoverDescription>
        </PopoverHeader>
        <div className="mt-3 grid gap-2">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="width">Width</Label>
            <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="height">Height</Label>
            <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

/** Aligned to the start edge. */
export const AlignStart: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Share</Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72">
        <PopoverHeader>
          <PopoverTitle>Share link</PopoverTitle>
          <PopoverDescription>
            Anyone with the link can view.
          </PopoverDescription>
        </PopoverHeader>
        <Input
          className="mt-3 h-8"
          readOnly
          value="https://gremorie.dev/p/42"
        />
      </PopoverContent>
    </Popover>
  ),
};
