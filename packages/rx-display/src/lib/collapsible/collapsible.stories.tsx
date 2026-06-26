import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@gremorie/rx-forms';
import { ChevronsUpDown } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible';

/**
 * # Collapsible
 *
 * A single-section expandable region — the minimal building block for any
 * "show more" toggle, wrapping Radix Collapsible. Use it when you have *one*
 * thing that expands (a card's "more details", a sidebar group). For multiple
 * coordinated sections use `Accordion`, which is built on this primitive.
 *
 * ## Anatomy
 *
 * ```text
 * Collapsible                  the Radix Root (holds open / onOpenChange)
 * ├─ CollapsibleTrigger        the toggle (pass asChild to use your own button)
 * └─ CollapsibleContent        the region revealed when open
 * ```
 *
 * ## Props
 *
 * The root forwards Radix `Collapsible.Root` props:
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled). |
 * | `open` / `onOpenChange` | `boolean` / `(open) => void` | — | Controlled open state. |
 * | `disabled` | `boolean` | `false` | Prevents toggling. |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `CollapsibleTrigger` | Toggles the open state. |
 * | `CollapsibleContent` | The revealed region. |
 *
 * ## Variables (design tokens)
 *
 * Collapsible ships unstyled — visuals come from the consumer (here `--border`,
 * `--muted` via composed primitives).
 */
const meta = {
  title: 'Layout & display/Display/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    defaultOpen: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Trigger + content — a "show more" disclosure. */
export const Default: Story = {
  render: () => (
    <Collapsible className="w-72 space-y-2">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium">@gremorie starred 3 repos</span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="size-7">
            <ChevronsUpDown />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-3 py-2 font-mono text-sm">
        @gremorie/rx-display
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-3 py-2 font-mono text-sm">
          @gremorie/rx-containers
        </div>
        <div className="rounded-md border px-3 py-2 font-mono text-sm">
          @gremorie/rx-forms
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
};

/** Open on first render via `defaultOpen`. */
export const DefaultOpen: Story = {
  render: () => (
    <Collapsible defaultOpen className="w-72 space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-between">
          Details
          <ChevronsUpDown className="size-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="text-muted-foreground rounded-md border px-3 py-2 text-sm">
        This content is visible because the collapsible starts open.
      </CollapsibleContent>
    </Collapsible>
  ),
};
