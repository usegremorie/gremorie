import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrnHoverCardContent } from '@spartan-ng/brain/hover-card';

import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';

/**
 * HoverCard — preview pane shown on hover (non-interactive).
 *
 * Mirrors React `HoverCard`. Behavior delegated to spartan brain
 * `BrnHoverCard` (CDK overlay). Brain renders content from a
 * `<ng-template brnHoverCardContent>` referenced by the trigger via
 * `[brnHoverCardTriggerFor]` — the documented divergence from Radix's portal
 * model.
 */
const meta: Meta<HoverCard> = {
  title: 'Overlays/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [
        HoverCard,
        HoverCardTrigger,
        HoverCardContent,
        BrnHoverCardContent,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<HoverCard>;

/** Workbench — hover the trigger to reveal a profile preview. */
export const Workbench: Story = {
  render: () => ({
    template: `
      <gn-hover-card>
        <gn-hover-card-trigger [brnHoverCardTriggerFor]="content" class="underline">&#64;gremorie</gn-hover-card-trigger>
        <ng-template #content="brnHoverCardContent" brnHoverCardContent>
          <gn-hover-card-content>
            <div class="text-sm font-semibold">Gremorie</div>
            <p class="text-sm text-muted-foreground">An AI native design system.</p>
          </gn-hover-card-content>
        </ng-template>
      </gn-hover-card>
    `,
  }),
};

/** Link preview — a teaser card for an external resource. */
export const LinkPreview: Story = {
  render: () => ({
    template: `
      <gn-hover-card>
        <gn-hover-card-trigger [brnHoverCardTriggerFor]="content" class="underline">gremorie.com</gn-hover-card-trigger>
        <ng-template #content="brnHoverCardContent" brnHoverCardContent>
          <gn-hover-card-content>
            <p class="text-sm">Full documentation, components and tokens.</p>
          </gn-hover-card-content>
        </ng-template>
      </gn-hover-card>
    `,
  }),
};
