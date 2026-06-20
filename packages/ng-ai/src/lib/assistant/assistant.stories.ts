import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Assistant } from './assistant';

/**
 * Assistant — the flagship composed AI chat surface.
 *
 * Composes Conversation + Message + Reasoning + PromptInput into a single
 * fixed-height surface, at parity with the React `chat-surface` block. The
 * Default story renders the same canned conversation as the React block so the
 * two read identically.
 */
const meta: Meta<Assistant> = {
  title: 'AI/Assistant',
  component: Assistant,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [Assistant],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The flagship Gremorie AI surface: a stick-to-bottom conversation log ' +
          'with a user turn, an assistant turn carrying a collapsible reasoning ' +
          'step, and a PromptInput composer at the bottom. Wire `(submit)` to the ' +
          'AI SDK or any streaming endpoint.',
      },
    },
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['ready', 'submitted', 'streaming', 'error'],
    },
    isStreaming: { control: 'boolean' },
    disabled: { control: 'boolean' },
    reasoningDuration: { control: { type: 'number', min: 0, max: 60, step: 1 } },
  },
  args: {
    state: 'ready',
    isStreaming: false,
    disabled: false,
    reasoningDuration: 2,
  },
};

export default meta;
type Story = StoryObj<Assistant>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="mx-auto max-w-3xl p-6">
        <ai-assistant
          [state]="state"
          [isStreaming]="isStreaming"
          [disabled]="disabled"
          [reasoningDuration]="reasoningDuration"
        />
      </div>
    `,
  }),
};

/**
 * Streaming — the reasoning panel stays open with a shimmered "Thinking…"
 * label and the submit button becomes a stop/cancel affordance.
 */
export const Streaming: Story = {
  args: { state: 'streaming', isStreaming: true, reasoningDuration: undefined },
  render: (args) => ({
    props: args,
    template: `
      <div class="mx-auto max-w-3xl p-6">
        <ai-assistant
          [state]="state"
          [isStreaming]="isStreaming"
          [disabled]="disabled"
          [reasoningDuration]="reasoningDuration"
        />
      </div>
    `,
  }),
};
