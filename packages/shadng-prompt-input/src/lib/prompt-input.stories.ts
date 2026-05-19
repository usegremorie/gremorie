import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { PromptInput } from './prompt-input';
import { PromptInputSubmit } from './prompt-input-submit';
import { PromptInputTextarea } from './prompt-input-textarea';
import { PromptInputToolbar } from './prompt-input-toolbar';
import { PromptInputTools } from './prompt-input-tools';

const meta: Meta<PromptInput> = {
  title: 'PromptInput/Container',
  component: PromptInput,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        PromptInputTextarea,
        PromptInputToolbar,
        PromptInputTools,
        PromptInputSubmit,
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'PromptInput is the container for AI prompt entry. It owns the state machine ' +
          '(ready → submitted → streaming → error), keyboard shortcuts, and attachment validation. ' +
          'Compose with PromptInputTextarea, PromptInputToolbar, PromptInputSubmit and others.',
      },
    },
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['ready', 'submitted', 'streaming', 'error'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'ghost', 'bordered'],
    },
    disabled: { control: 'boolean' },
    submitOnEnter: { control: 'boolean' },
  },
  args: {
    state: 'ready',
    size: 'md',
    variant: 'default',
    disabled: false,
    submitOnEnter: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <prompt-input [state]="state" [size]="size" [variant]="variant"
                    [disabled]="disabled" [submitOnEnter]="submitOnEnter"
                    style="max-width: 32rem;">
        <prompt-input-textarea placeholder="Ask anything…"></prompt-input-textarea>
        <prompt-input-toolbar>
          <prompt-input-tools></prompt-input-tools>
          <prompt-input-submit></prompt-input-submit>
        </prompt-input-toolbar>
      </prompt-input>
    `,
  }),
};

export default meta;

type Story = StoryObj<PromptInput>;

export const Ready: Story = { args: { state: 'ready' } };
export const Submitted: Story = { args: { state: 'submitted' } };
export const Streaming: Story = { args: { state: 'streaming' } };
export const Error: Story = { args: { state: 'error' } };

export const SizeSmall: Story = {
  name: 'Size · sm',
  args: { size: 'sm' },
};

export const SizeLarge: Story = {
  name: 'Size · lg',
  args: { size: 'lg' },
};

export const VariantGhost: Story = {
  name: 'Variant · ghost',
  args: { variant: 'ghost' },
};

export const Disabled: Story = { args: { disabled: true } };
