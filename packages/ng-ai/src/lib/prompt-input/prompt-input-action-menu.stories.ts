import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { PromptInput } from './prompt-input';
import {
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputActionMenuSwitchItem,
  PromptInputActionMenuTrigger,
} from './prompt-input-action-menu';

const meta: Meta<PromptInputActionMenu> = {
  title: 'AI/Chatbot/PromptInput/ActionMenu',
  component: PromptInputActionMenu,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        PromptInput,
        PromptInputActionMenu,
        PromptInputActionMenuTrigger,
        PromptInputActionMenuContent,
        PromptInputActionMenuItem,
        PromptInputActionMenuSwitchItem,
        PromptInputActionAddAttachments,
      ],
    }),
  ],
  render: () => ({
    props: { web: true },
    template: `
      <div style="padding: 1rem 1rem 14rem; max-width: 32rem;">
        <prompt-input>
          <prompt-input-action-menu>
            <prompt-input-action-menu-trigger ariaLabel="More tools" tooltip="More tools" />
            <prompt-input-action-menu-content>
              <prompt-input-action-menu-switch-item [(checked)]="web">
                Search the web
              </prompt-input-action-menu-switch-item>
              <prompt-input-action-add-attachments />
              <prompt-input-action-menu-item>Record voice</prompt-input-action-menu-item>
            </prompt-input-action-menu-content>
          </prompt-input-action-menu>
        </prompt-input>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<PromptInputActionMenu>;
export const Default: Story = { name: 'Trigger + items' };
