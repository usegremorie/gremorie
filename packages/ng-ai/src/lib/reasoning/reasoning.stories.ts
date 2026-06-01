import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Reasoning } from './reasoning';
import { ReasoningContent } from './reasoning-content';
import { ReasoningTrigger } from './reasoning-trigger';

/**
 * Reasoning — collapsible "Thinking…" block.
 *
 * Stories validate the streaming → done transition (shimmered label,
 * duration label, auto-close), the manual-control mode via `[(open)]`,
 * and the override of the trigger via projected content.
 */
type ReasoningArgs = {
  isStreaming: boolean;
  defaultOpen: boolean;
  open: boolean;
  duration: number | undefined;
};

const meta: Meta<ReasoningArgs> = {
  title: 'AI/Reasoning',
  component: Reasoning,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [Reasoning, ReasoningTrigger, ReasoningContent],
    }),
  ],
  argTypes: {
    isStreaming: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
    open: { control: 'boolean' },
    duration: { control: { type: 'number', min: 0, max: 60, step: 1 } },
  },
};

export default meta;
type Story = StoryObj<ReasoningArgs>;

export const Streaming: Story = {
  args: {
    isStreaming: true,
    defaultOpen: true,
    open: true,
    duration: undefined,
  },
  render: (args) => ({
    props: args,
    template: `
      <reasoning [isStreaming]="isStreaming" [defaultOpen]="defaultOpen">
        <reasoning-trigger />
        <reasoning-content text="Analyzing the data… looking up references… composing the response." />
      </reasoning>
    `,
  }),
};

export const Done: Story = {
  args: { isStreaming: false, defaultOpen: false, open: false, duration: 4 },
  render: (args) => ({
    props: args,
    template: `
      <reasoning [isStreaming]="isStreaming" [defaultOpen]="defaultOpen" [duration]="duration">
        <reasoning-trigger />
        <reasoning-content text="Considered three approaches, picked the second one because it composed better with the existing handlers." />
      </reasoning>
    `,
  }),
};

/**
 * Done unknown — `duration` undefined renders the "a few seconds" fallback.
 */
export const DoneUnknownDuration: Story = {
  name: 'Done (unknown duration)',
  args: {
    isStreaming: false,
    defaultOpen: true,
    open: true,
    duration: undefined,
  },
  render: (args) => ({
    props: args,
    template: `
      <reasoning [isStreaming]="isStreaming" [defaultOpen]="defaultOpen">
        <reasoning-trigger />
        <reasoning-content text="Quick thought." />
      </reasoning>
    `,
  }),
};

/**
 * Manual control — bind `[(open)]` to drive open/close from the host
 * component. `defaultOpen=false` keeps the auto-open / auto-close logic
 * out of the way.
 */
export const ManualControl: Story = {
  name: 'Manual control',
  args: { isStreaming: false, defaultOpen: false, open: true, duration: 12 },
  render: (args) => ({
    props: args,
    template: `
      <reasoning [(open)]="open" [defaultOpen]="defaultOpen" [duration]="duration">
        <reasoning-trigger />
        <reasoning-content text="Two-way bound to a host signal — toggle the 'open' control to drive it." />
      </reasoning>
    `,
  }),
};

/**
 * Custom trigger — project content into `<reasoning-trigger>` to fully
 * replace the default brain-icon + shimmer + chevron.
 */
export const CustomTrigger: Story = {
  name: 'Custom trigger',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <reasoning [isStreaming]="false" [defaultOpen]="true" [duration]="3">
        <reasoning-trigger>
          <button class="text-sm font-medium underline-offset-4 hover:underline">
            Show reasoning ↓
          </button>
        </reasoning-trigger>
        <reasoning-content text="Detailed reasoning content goes here." />
      </reasoning>
    `,
  }),
};
