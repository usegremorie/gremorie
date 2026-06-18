import type { Meta, StoryObj } from '@storybook/react';
import { Plus } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';
import { Button } from '@gremorie/rx-forms';

/**
 * # Tooltip
 *
 * Short, non-essential context shown on hover/focus — a faithful shadcn port over
 * Radix Tooltip. Reserve it for supporting hints (keyboard shortcuts, icon
 * labels). Touch users may never trigger it and keyboard users only see it on
 * focus, so critical info must stay visible in the layout. Wrap the app (or each
 * story) in `TooltipProvider` so tooltips share one delay timer.
 *
 * ## Anatomy
 *
 * ```text
 * TooltipProvider              shares one delay timer across all tooltips
 * └─ Tooltip                   Radix root for a single tooltip instance
 *    ├─ TooltipTrigger         the hover/focus anchor element
 *    └─ TooltipContent         portalled bubble with a built-in arrow
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `open` | `boolean` | — | Controlled open state. |
 * | `defaultOpen` | `boolean` | `false` | Uncontrolled initial state. |
 * | `delayDuration` | `number` | `0` | Hover delay (set on the Provider). |
 *
 * `TooltipContent` adds `sideOffset` (default `0`) and accepts Radix `side` / `align`.
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `TooltipProvider` | Shared delay timer. |
 * | `TooltipTrigger` | Hover/focus anchor. |
 * | `TooltipContent` | Bubble + arrow. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--foreground` | Bubble background + arrow |
 * | `--background` | Bubble text color |
 */
const meta = {
  title: 'Interaction/Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A simple label on an outline button. */
export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  ),
};

/** Labelling an icon-only button. */
export const IconButton: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" aria-label="New item">
          <Plus />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>New item</p>
      </TooltipContent>
    </Tooltip>
  ),
};

const SIDES = ['top', 'right', 'bottom', 'left'] as const;

/** All four placement sides. */
export const Sides: Story = {
  render: () => (
    <div className="flex gap-4">
      {SIDES.map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="outline" className="capitalize">
              {side}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>
            <p className="capitalize">{side}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};
