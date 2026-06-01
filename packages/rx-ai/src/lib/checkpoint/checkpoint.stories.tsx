import type { Meta, StoryObj } from '@storybook/react';
import { TooltipProvider } from '@gremorie/rx-overlays';
import { GitBranchIcon, RotateCcwIcon } from 'lucide-react';

import { Checkpoint, CheckpointIcon, CheckpointTrigger } from './checkpoint';

/**
 * # Checkpoint
 *
 * A faithful port of the Vercel AI Elements **Checkpoint** — a timeline marker
 * shown in a conversation to let the user rewind/branch from a saved point. It
 * renders an icon, a trigger button and a trailing separator that fills the
 * remaining row width.
 *
 * ## Anatomy
 *
 * - **Checkpoint** — the row: an inline-flex container holding the children and
 *   a trailing `Separator`.
 * - **CheckpointIcon** — the marker icon (defaults to a bookmark); pass
 *   `children` to swap it.
 * - **CheckpointTrigger** — the clickable label/button; pass `tooltip` to wrap
 *   it in a `Tooltip`.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `className` | `string` | — | Extra classes on the `Checkpoint` row. |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `CheckpointIcon` | Marker icon; `children` overrides the default bookmark. |
 * | `CheckpointTrigger` | Button label; `tooltip?: string` adds a hover tooltip. Forwards `Button` `variant`/`size` (defaults `ghost`/`sm`). |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--muted-foreground` | Row text/icon color. |
 * | `--border` | Trailing separator. |
 */
const meta = {
  title: 'AI/Checkpoint',
  component: Checkpoint,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Checkpoint>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default bookmark marker with a plain trigger. */
export const Default: Story = {
  render: () => (
    <Checkpoint>
      <CheckpointIcon />
      <CheckpointTrigger>Checkpoint</CheckpointTrigger>
    </Checkpoint>
  ),
};

/** Trigger with a hover tooltip explaining the action. */
export const WithTooltip: Story = {
  render: () => (
    <Checkpoint>
      <CheckpointIcon />
      <CheckpointTrigger tooltip="Restore the conversation to this point">
        Restore checkpoint
      </CheckpointTrigger>
    </Checkpoint>
  ),
};

/** Custom icon passed as `children` to `CheckpointIcon`. */
export const CustomIcon: Story = {
  render: () => (
    <Checkpoint>
      <CheckpointIcon>
        <GitBranchIcon className="size-4 shrink-0" />
      </CheckpointIcon>
      <CheckpointTrigger tooltip="Branch a new conversation from here">
        Branch from here
      </CheckpointTrigger>
    </Checkpoint>
  ),
};

/** A trigger with a leading icon inside the button. */
export const WithButtonIcon: Story = {
  render: () => (
    <Checkpoint>
      <CheckpointIcon />
      <CheckpointTrigger tooltip="Undo to this checkpoint">
        <RotateCcwIcon className="size-3.5" />
        Rewind
      </CheckpointTrigger>
    </Checkpoint>
  ),
};
