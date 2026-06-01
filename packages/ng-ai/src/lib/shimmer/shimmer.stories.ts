import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Shimmer } from './shimmer';

/**
 * Shimmer — animated text-gradient sweep directive.
 *
 * Applied as `[ngShimmer]` on any element with text content. Stories show
 * the directive in isolation + paused state + custom duration.
 */
const meta: Meta<Shimmer> = {
  title: 'AI/Shimmer',
  component: Shimmer,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [Shimmer],
    }),
  ],
  argTypes: {
    shimmerDuration: {
      control: { type: 'number', min: 0.5, max: 6, step: 0.5 },
    },
    shimmerSpread: { control: { type: 'number', min: 0.5, max: 6, step: 0.5 } },
    shimmerDisabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Shimmer>;

export const Default: Story = {
  args: { shimmerDuration: 2, shimmerSpread: 2, shimmerDisabled: false },
  render: (args) => ({
    props: args,
    template: `
      <span
        ngShimmer
        [shimmerDuration]="shimmerDuration"
        [shimmerSpread]="shimmerSpread"
        [shimmerDisabled]="shimmerDisabled"
        class="text-base"
      >
        Thinking…
      </span>
    `,
  }),
};

export const Paused: Story = {
  args: { shimmerDuration: 2, shimmerSpread: 2, shimmerDisabled: true },
  render: (args) => ({
    props: args,
    template: `
      <span
        ngShimmer
        [shimmerDuration]="shimmerDuration"
        [shimmerSpread]="shimmerSpread"
        [shimmerDisabled]="shimmerDisabled"
      >
        Animation paused
      </span>
    `,
  }),
};

export const Fast: Story = {
  args: { shimmerDuration: 1, shimmerSpread: 2, shimmerDisabled: false },
  render: (args) => ({
    props: args,
    template: `
      <span
        ngShimmer
        [shimmerDuration]="shimmerDuration"
        [shimmerSpread]="shimmerSpread"
        class="text-base"
      >
        Streaming response…
      </span>
    `,
  }),
};

export const Slow: Story = {
  args: { shimmerDuration: 4, shimmerSpread: 2, shimmerDisabled: false },
  render: (args) => ({
    props: args,
    template: `
      <span
        ngShimmer
        [shimmerDuration]="shimmerDuration"
        [shimmerSpread]="shimmerSpread"
        class="text-base"
      >
        Calmly considering options
      </span>
    `,
  }),
};

/**
 * Inline — Shimmer next to a static icon, common pattern inside Reasoning
 * trigger.
 */
export const Inline: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex items-center gap-2 text-muted-foreground text-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true">
          <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
        </svg>
        <span ngShimmer [shimmerDuration]="1">Thinking…</span>
      </div>
    `,
  }),
};
