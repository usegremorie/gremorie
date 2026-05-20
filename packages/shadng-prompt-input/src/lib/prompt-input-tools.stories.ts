import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Button } from '@shadng/core';

import { PromptInputTools } from './prompt-input-tools';

const meta: Meta<PromptInputTools> = {
  title: 'PromptInput/Tools',
  component: PromptInputTools,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [Button] })],
  render: () => ({
    template: `
      <prompt-input-tools>
        <ai-button variant="ghost" size="icon" ariaLabel="A">A</ai-button>
        <ai-button variant="ghost" size="icon" ariaLabel="B">B</ai-button>
        <ai-button variant="ghost" size="icon" ariaLabel="C">C</ai-button>
      </prompt-input-tools>
    `,
  }),
};

export default meta;
type Story = StoryObj<PromptInputTools>;
export const Default: Story = {};
