import type { Meta, StoryObj } from '@storybook/react';
import { BrainIcon } from 'lucide-react';

import { Shimmer } from './shimmer';

/**
 * Shimmer - animated text-gradient sweep component (React edition).
 *
 * Wraps text content and sweeps a gradient highlight across it. Stories show
 * the component in isolation + custom durations + the inline pattern used
 * inside the Reasoning trigger.
 *
 * Note: the React edition has no "disabled/paused" prop (the Angular
 * `shimmerDisabled` input). The Angular "Paused" story is therefore mapped to
 * a "Slow" variant here instead.
 */
const meta = {
  title: 'AI/Chatbot/Shimmer',
  component: Shimmer,
  tags: ['autodocs'],
  argTypes: {
    duration: { control: { type: 'number', min: 0.5, max: 6, step: 0.5 } },
    spread: { control: { type: 'number', min: 0.5, max: 6, step: 0.5 } },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Shimmer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { duration: 2, spread: 2, children: 'Thinking...' },
  render: (args) => <Shimmer {...args} className="text-base" />,
};

export const Fast: Story = {
  args: { duration: 1, spread: 2, children: 'Streaming response...' },
  render: (args) => <Shimmer {...args} className="text-base" />,
};

export const Slow: Story = {
  args: { duration: 4, spread: 2, children: 'Calmly considering options' },
  render: (args) => <Shimmer {...args} className="text-base" />,
};

/**
 * Inline - Shimmer next to a static icon, common pattern inside Reasoning
 * trigger.
 */
export const Inline: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <BrainIcon className="size-4" aria-hidden="true" />
      <Shimmer duration={1}>Thinking...</Shimmer>
    </div>
  ),
};
