import type { Meta, StoryObj } from '@storybook/react';
import { CalendarDays } from 'lucide-react';

import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';
import { Button } from '@gremorie/rx-forms';

/**
 * # HoverCard
 *
 * A non-interactive preview pane shown on hover — a faithful shadcn port over
 * Radix HoverCard. Use it to *preview* content the user can fully open with a
 * click (profile cards on `@mentions`, link previews, image teasers). Never put
 * critical info or controls inside it — those belong in a `Popover`.
 *
 * ## Anatomy
 *
 * ```text
 * HoverCard                  Radix root managing hover open/close timing
 * ├─ HoverCardTrigger        element that reveals the card on hover/focus
 * └─ HoverCardContent        portalled preview surface (align, sideOffset)
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `openDelay` | `number` | `700` | Hover delay before opening (ms). |
 * | `closeDelay` | `number` | `300` | Delay before closing (ms). |
 * | `open` | `boolean` | — | Controlled open state. |
 * | `onOpenChange` | `(open: boolean) => void` | — | Open-state callback. |
 *
 * `HoverCardContent` adds `align` (default `"center"`) and `sideOffset` (default `4`).
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `HoverCardTrigger` | Hover/focus anchor. |
 * | `HoverCardContent` | Preview surface. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--popover` / `--popover-foreground` | Card surface |
 * | `--border` | Card border |
 * | `--muted-foreground` | Secondary text |
 */
const meta = {
  title: 'Interaction/Overlays/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Workbench — hover the trigger to reveal a profile preview. */
export const Workbench: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@gremorie</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="text-sm font-semibold">Gremorie</div>
        <p className="text-sm text-muted-foreground">
          An AI native design system.
        </p>
      </HoverCardContent>
    </HoverCard>
  ),
};

/** A user profile preview revealed on hover. */
export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@gremorie</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-sm font-medium">
            GR
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@gremorie</h4>
            <p className="text-sm">
              An AI-native design system — components, tokens, and patterns.
            </p>
            <div className="flex items-center pt-2 text-xs text-muted-foreground">
              <CalendarDays className="mr-2 size-4" />
              Joined December 2024
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

/** Aligned to the start edge of the trigger. */
export const AlignStart: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="outline">Hover for details</Button>
      </HoverCardTrigger>
      <HoverCardContent align="start" className="w-64">
        <p className="text-sm">
          This preview is anchored to the left edge of the trigger.
        </p>
      </HoverCardContent>
    </HoverCard>
  ),
};
