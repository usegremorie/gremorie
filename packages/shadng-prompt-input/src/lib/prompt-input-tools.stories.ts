import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { PromptInputButton } from './prompt-input-button';
import { PromptInputTools } from './prompt-input-tools';

const meta: Meta<PromptInputTools> = {
  title: 'PromptInput/Tools',
  component: PromptInputTools,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [PromptInputButton] })],
  render: () => ({
    template: `
      <prompt-input-tools>
        <prompt-input-button ariaLabel="A">A</prompt-input-button>
        <prompt-input-button ariaLabel="B">B</prompt-input-button>
        <prompt-input-button ariaLabel="C">C</prompt-input-button>
      </prompt-input-tools>
    `,
  }),
};

export default meta;
type Story = StoryObj<PromptInputTools>;
export const Default: Story = {};
