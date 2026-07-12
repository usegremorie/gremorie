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
      <gr-popover [align]="align" [sideOffset]="sideOffset">
        <gr-popover-trigger [content]="content">Open popover</gr-popover-trigger>
        <ng-template #content brnPopoverContent>
          <gr-popover-content>
            <gr-popover-header>
              <gr-popover-title>Dimensions</gr-popover-title>
              <gr-popover-description>Set the layout dimensions.</gr-popover-description>
            </gr-popover-header>
          </gr-popover-content>
        </ng-template>
      </gr-popover>
    `,
  }),
};

/** Aligned to the start edge of the trigger. */
export const AlignStart: Story = {
  render: () => ({
    template: `
      <gr-popover align="start">
        <gr-popover-trigger [content]="content">Start aligned</gr-popover-trigger>
        <ng-template #content brnPopoverContent>
          <gr-popover-content>
            <gr-popover-header>
              <gr-popover-title>Aligned start</gr-popover-title>
              <gr-popover-description>The content hugs the start edge.</gr-popover-description>
            </gr-popover-header>
          </gr-popover-content>
        </ng-template>
      </gr-popover>
    `,
  }),
};
