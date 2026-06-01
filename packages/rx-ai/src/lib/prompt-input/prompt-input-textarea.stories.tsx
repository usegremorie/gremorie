import type { Meta, StoryObj } from '@storybook/react';

import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
} from './prompt-input';

/**
 * PromptInputTextarea - the auto-growing prompt field (React edition).
 *
 * Mirrors the ng-ai PromptInput/Textarea stories. The textarea grows with its
 * content (field-sizing-content) up to a max height, submits on Enter, and
 * supports paste-to-attach. It must live inside a PromptInput.
 */
const meta = {
  title: 'AI/PromptInput/Textarea',
  component: PromptInputTextarea,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PromptInputTextarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Ask anything...' },
  render: (args) => (
    <PromptInput className="max-w-lg" onSubmit={() => {}}>
      <PromptInputBody>
        <PromptInputTextarea {...args} />
      </PromptInputBody>
    </PromptInput>
  ),
};

/**
 * Short max height - constrain the auto-grow ceiling so a long prompt scrolls
 * internally instead of pushing the layout.
 */
export const ShortMaxHeight: Story = {
  args: { placeholder: 'Ask anything...' },
  render: (args) => (
    <PromptInput className="max-w-lg" onSubmit={() => {}}>
      <PromptInputBody>
        <PromptInputTextarea className="max-h-20" {...args} />
      </PromptInputBody>
    </PromptInput>
  ),
};

/**
 * Taller starting rows - start with multiple visible rows via the native
 * `rows` attribute before the field grows to fit content.
 */
export const TallStartingRows: Story = {
  args: { placeholder: 'Ask anything...' },
  render: (args) => (
    <PromptInput className="max-w-lg" onSubmit={() => {}}>
      <PromptInputBody>
        <PromptInputTextarea rows={4} {...args} />
      </PromptInputBody>
    </PromptInput>
  ),
};
