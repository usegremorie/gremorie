import type { Meta, StoryObj } from '@storybook/angular';

import { PromptInputActionMenu } from './prompt-input-action-menu';

const meta: Meta<PromptInputActionMenu> = {
  title: 'PromptInput/ActionMenu',
  component: PromptInputActionMenu,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    ariaLabel: { control: 'text' },
  },
  args: {
    disabled: false,
    ariaLabel: 'More actions',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 4rem 1rem;">
        <prompt-input-action-menu [disabled]="disabled" [ariaLabel]="ariaLabel">
          <button type="button" style="display:flex; width:100%; padding:.375rem .5rem; font-size:.875rem; text-align:left; border-radius:.125rem;">Take a photo</button>
          <button type="button" style="display:flex; width:100%; padding:.375rem .5rem; font-size:.875rem; text-align:left; border-radius:.125rem;">Record voice</button>
          <button type="button" style="display:flex; width:100%; padding:.375rem .5rem; font-size:.875rem; text-align:left; border-radius:.125rem;">Connect tool…</button>
        </prompt-input-action-menu>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<PromptInputActionMenu>;
export const Default: Story = { name: 'Trigger + 3 items' };
export const Disabled: Story = { args: { disabled: true } };
