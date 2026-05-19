import type { Meta, StoryObj } from '@storybook/angular';

import { PromptInputButton } from './prompt-input-button';

const meta: Meta<PromptInputButton> = {
  title: 'PromptInput/Button',
  component: PromptInputButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['ghost', 'subtle'] },
    size: { control: 'select', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
    pressed: { control: 'select', options: [null, true, false] },
  },
  args: {
    ariaLabel: 'Attach',
    title: 'Attach',
    variant: 'ghost',
    size: 'md',
    disabled: false,
    pressed: null,
  },
  render: (args) => ({
    props: args,
    template: `
      <prompt-input-button
        [ariaLabel]="ariaLabel"
        [title]="title"
        [variant]="variant"
        [size]="size"
        [disabled]="disabled"
        [pressed]="pressed"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 17.93 8.8l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
        </svg>
      </prompt-input-button>
    `,
  }),
};

export default meta;
type Story = StoryObj<PromptInputButton>;

export const Ghost: Story = { args: { variant: 'ghost' } };
export const Subtle: Story = { args: { variant: 'subtle' } };
export const Small: Story = { args: { size: 'sm' } };
export const Pressed: Story = { args: { pressed: true } };
export const Disabled: Story = { args: { disabled: true } };
