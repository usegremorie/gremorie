import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';

import {
  OpenIn,
  OpenInChatGPT,
  OpenInClaude,
  OpenInContent,
  OpenInCursor,
  OpenInLabel,
  OpenInScira,
  OpenInSeparator,
  OpenInT3,
  OpenInTrigger,
  OpenInv0,
} from './open-in-chat';

/**
 * OpenIn — open the current prompt in another chat app. Mirrors React `OpenIn`
 * from `@gremorie/rx-ai`. Built on `BrnPopover` (brain has no menu primitive),
 * so the menu body lives in a `<ng-template brnPopoverContent>`.
 */
const meta: Meta<OpenIn> = {
  title: 'AI/Utilities/OpenIn',
  component: OpenIn,
  tags: ['autodocs'],
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [
        OpenIn,
        OpenInTrigger,
        OpenInContent,
        OpenInLabel,
        OpenInSeparator,
        OpenInChatGPT,
        OpenInClaude,
        OpenInT3,
        OpenInScira,
        OpenInv0,
        OpenInCursor,
        BrnPopoverContent,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<OpenIn>;

/**
 * Workbench — fixed-width preview frame matching the catalog convention.
 * Click "Open in chat" to reveal the provider list.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  render: () => ({
    template: `
      <div style="width: 360px;">
        <open-in query="Explain monads with a code example">
          <open-in-trigger [content]="menu" />
          <ng-template #menu brnPopoverContent>
            <open-in-content>
              <open-in-label>Open in chat</open-in-label>
              <open-in-separator />
              <open-in-chatgpt />
              <open-in-claude />
              <open-in-t3 />
              <open-in-scira />
              <open-in-v0 />
              <open-in-cursor />
            </open-in-content>
          </ng-template>
        </open-in>
      </div>
    `,
  }),
};

/**
 * Subset of providers — only ChatGPT and Claude.
 */
export const Subset: Story = {
  render: () => ({
    template: `
      <open-in query="Refactor this function to be pure">
        <open-in-trigger [content]="menu" />
        <ng-template #menu brnPopoverContent>
          <open-in-content>
            <open-in-chatgpt />
            <open-in-claude />
          </open-in-content>
        </ng-template>
      </open-in>
    `,
  }),
};
