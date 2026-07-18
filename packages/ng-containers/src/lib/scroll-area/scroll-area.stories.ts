import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ScrollArea } from './scroll-area';

/**
 * ScrollArea — a themeable scroll container with consistent, cross-OS
 * scrollbar styling. Mirrors React `ScrollArea` from `@gremorie/rx-containers`.
 *
 * A relative box wrapping a scrollable viewport (`data-slot="scroll-area-viewport"`).
 * The visible bar comes from the DS scrollbar baseline in `@gremorie/tokens`
 * (thin, `--border`-colored thumb) — no third-party scrollbar lib.
 */
const meta: Meta<ScrollArea> = {
  title: 'Layout & display/Containers/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [moduleMetadata({ imports: [ScrollArea] })],
};

export default meta;
type Story = StoryObj<ScrollArea>;

const TAGS = Array.from({ length: 40 }, (_, i) => `v1.2.0-beta.${40 - i}`);

/** Workbench — vertical overflow: a long, fixed-height list. */
export const Workbench: Story = {
  render: () => ({
    props: { tags: TAGS },
    template: `
      <gr-scroll-area class="h-72 w-56 rounded-md border">
        <div class="p-4">
          <h4 class="mb-3 text-sm font-medium">Tags</h4>
          @for (tag of tags; track tag) {
            <div class="border-border border-b last:border-b-0">
              <div class="py-1.5 font-mono text-sm">{{ tag }}</div>
            </div>
          }
        </div>
      </gr-scroll-area>
    `,
  }),
};
