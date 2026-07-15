import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

/**
 * Tooltip — short non-essential context on hover/focus.
 *
 * Mirrors React `Tooltip`. Behavior delegated to spartan brain `BrnTooltip`
 * (a single directive on the trigger). The compound Provider/Root/Trigger/
 * Content parts are kept for API parity; `TooltipProvider` is a pass-through
 * (brain has no shared delay context — delay lives per `gr-tooltip`).
 */
const meta: Meta<Tooltip> = {
  title: 'Interaction/Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [Tooltip, TooltipProvider, TooltipTrigger, TooltipContent],
    }),
  ],
  argTypes: {
    side: {
      control: 'inline-radio',
      options: ['top', 'bottom', 'left', 'right'],
    },
    delayDuration: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<Tooltip>;

/** Workbench — hover the button to reveal a label. */
export const Workbench: Story = {
  args: { side: 'top', delayDuration: 0 },
  render: (args) => ({
    props: args,
    template: `
      <gr-tooltip-provider>
        <gr-tooltip [side]="side" [delayDuration]="delayDuration">
          <gr-tooltip-trigger>
            <button type="button" class="rounded-md border px-3 py-1.5 text-sm">Hover</button>
          </gr-tooltip-trigger>
          <gr-tooltip-content>Add to library</gr-tooltip-content>
        </gr-tooltip>
      </gr-tooltip-provider>
    `,
  }),
};

/** Positioned below the trigger. */
export const Bottom: Story = {
  render: () => ({
    template: `
      <gr-tooltip-provider>
        <gr-tooltip side="bottom">
          <gr-tooltip-trigger>
            <button type="button" class="rounded-md border px-3 py-1.5 text-sm">More info</button>
          </gr-tooltip-trigger>
          <gr-tooltip-content>Shown beneath the trigger</gr-tooltip-content>
        </gr-tooltip>
      </gr-tooltip-provider>
    `,
  }),
};
