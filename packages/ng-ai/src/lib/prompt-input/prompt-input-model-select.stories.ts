import type { Meta, StoryObj } from '@storybook/angular';

import { PromptInputModelSelect } from './prompt-input-model-select';
import type { PromptInputModelOption } from './prompt-input.types';

const MODELS: readonly PromptInputModelOption[] = [
  {
    id: 'claude-opus-4-7',
    label: 'Claude Opus 4.7',
    description: 'Highest quality, slower',
    badge: 'flagship',
  },
  {
    id: 'claude-sonnet-4-6',
    label: 'Claude Sonnet 4.6',
    description: 'Balanced',
  },
  {
    id: 'claude-haiku-4-5',
    label: 'Claude Haiku 4.5',
    description: 'Fastest, cheapest',
  },
  { id: 'gpt-5', label: 'GPT-5', description: 'Coming soon', disabled: true },
];

const meta: Meta<PromptInputModelSelect> = {
  title: 'AI/Chatbot/PromptInput/ModelSelect',
  component: PromptInputModelSelect,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  args: {
    options: MODELS,
    value: 'claude-sonnet-4-6',
    disabled: false,
    placeholder: 'Choose model',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 4rem 1rem;">
        <prompt-input-model-select
          [options]="options"
          [value]="value"
          [disabled]="disabled"
          [placeholder]="placeholder"
        />
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<PromptInputModelSelect>;
export const Default: Story = { name: 'Sonnet 4.6 selected' };
export const Unselected: Story = { args: { value: null } };
export const Disabled: Story = { args: { disabled: true } };
