import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible';

/**
 * Collapsible — single-section expandable region.
 *
 * Mirrors React `Collapsible`. Behavior delegated to spartan brain
 * `BrnCollapsible`. Three parts: root / trigger / content.
 */
const meta: Meta<Collapsible> = {
  title: 'Display/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [Collapsible, CollapsibleTrigger, CollapsibleContent],
    }),
  ],
};

export default meta;
type Story = StoryObj<Collapsible>;

/** Workbench — a "show more" disclosure inside a fixed-width card. */
export const Workbench: Story = {
  render: () => ({
    template: `
      <gn-collapsible class="w-80 space-y-2" [defaultOpen]="true">
        <div class="flex items-center justify-between gap-4 rounded-md border px-4 py-2">
          <span class="text-sm font-semibold">@peduarte starred 3 repositories</span>
          <gn-collapsible-trigger>
            <span class="inline-flex size-8 items-center justify-center rounded-md hover:bg-accent">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true">
                <path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/>
              </svg>
            </span>
          </gn-collapsible-trigger>
        </div>
        <div class="rounded-md border px-4 py-2 font-mono text-sm">@radix-ui/primitives</div>
        <gn-collapsible-content class="space-y-2">
          <div class="rounded-md border px-4 py-2 font-mono text-sm">@radix-ui/colors</div>
          <div class="rounded-md border px-4 py-2 font-mono text-sm">@stitches/react</div>
        </gn-collapsible-content>
      </gn-collapsible>
    `,
  }),
};

/** Closed by default — content hidden until the trigger is clicked. */
export const ClosedByDefault: Story = {
  render: () => ({
    template: `
      <gn-collapsible class="w-80 space-y-2">
        <gn-collapsible-trigger>
          <span class="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">Show details</span>
        </gn-collapsible-trigger>
        <gn-collapsible-content>
          <p class="rounded-md border px-4 py-2 text-sm text-muted-foreground">
            These extra details only appear once expanded.
          </p>
        </gn-collapsible-content>
      </gn-collapsible>
    `,
  }),
};
