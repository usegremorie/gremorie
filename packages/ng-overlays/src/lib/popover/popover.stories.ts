import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';

import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './popover';

/**
 * Popover — anchored interactive content overlay.
 *
 * Mirrors React `Popover`. Behavior delegated to spartan brain `BrnPopover`
 * (CDK overlay). Brain renders content from a `<ng-template brnPopoverContent>`
 * referenced by the trigger via `[content]` — the documented divergence from
 * Radix's portal model.
 */
const meta: Meta<Popover> = {
  title: 'Interaction/Overlays/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [
        Popover,
        PopoverTrigger,
        PopoverContent,
        PopoverAnchor,
        PopoverHeader,
        PopoverTitle,
        PopoverDescription,
        BrnPopoverContent,
      ],
    }),
  ],
  argTypes: {
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    sideOffset: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<Popover>;

/** Workbench — a small form inside the popover surface. */
export const Workbench: Story = {
  args: { align: 'center', sideOffset: 4 },
  render: (args) => ({
    props: args,
    template: `
      <gn-popover [align]="align" [sideOffset]="sideOffset">
        <gn-popover-trigger [content]="content">Open popover</gn-popover-trigger>
        <ng-template #content brnPopoverContent>
          <gn-popover-content>
            <gn-popover-header>
              <gn-popover-title>Dimensions</gn-popover-title>
              <gn-popover-description>Set the layout dimensions.</gn-popover-description>
            </gn-popover-header>
          </gn-popover-content>
        </ng-template>
      </gn-popover>
    `,
  }),
};

/** Aligned to the start edge of the trigger. */
export const AlignStart: Story = {
  render: () => ({
    template: `
      <gn-popover align="start">
        <gn-popover-trigger [content]="content">Start aligned</gn-popover-trigger>
        <ng-template #content brnPopoverContent>
          <gn-popover-content>
            <gn-popover-header>
              <gn-popover-title>Aligned start</gn-popover-title>
              <gn-popover-description>The content hugs the start edge.</gn-popover-description>
            </gn-popover-header>
          </gn-popover-content>
        </ng-template>
      </gn-popover>
    `,
  }),
};
