import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrnHoverCardContent } from '@spartan-ng/brain/hover-card';

import {
  Context,
  ContextCacheUsage,
  ContextContent,
  ContextContentBody,
  ContextContentFooter,
  ContextContentHeader,
  ContextInputUsage,
  ContextOutputUsage,
  ContextReasoningUsage,
  ContextTrigger,
} from './context';

/**
 * Context — a token-usage meter that hovers into a usage/cost breakdown.
 * Mirrors React `Context` from `@gremorie/rx-ai`. The content lives in a
 * `<ng-template brnHoverCardContent>` (brain idiom).
 */
const meta: Meta<Context> = {
  title: 'AI/Chatbot/Context',
  component: Context,
  tags: ['autodocs'],
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [
        Context,
        ContextTrigger,
        ContextContent,
        ContextContentHeader,
        ContextContentBody,
        ContextContentFooter,
        ContextInputUsage,
        ContextOutputUsage,
        ContextReasoningUsage,
        ContextCacheUsage,
        BrnHoverCardContent,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<Context>;

const usage = {
  inputTokens: 8200,
  outputTokens: 1400,
  reasoningTokens: 600,
  cachedInputTokens: 2000,
};

/**
 * Workbench — fixed-width preview frame matching the catalog convention.
 * Hover the meter to reveal the breakdown.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  render: () => ({
    props: { usage },
    template: `
      <div style="width: 320px;">
        <context [usedTokens]="12200" [maxTokens]="200000" [usage]="usage" modelId="anthropic/claude-3-5-sonnet">
          <context-trigger />
          <ng-template brnHoverCardContent>
            <context-content>
              <context-content-header />
              <context-content-body>
                <context-input-usage />
                <context-output-usage />
                <context-reasoning-usage />
                <context-cache-usage />
              </context-content-body>
              <context-content-footer />
            </context-content>
          </ng-template>
        </context>
      </div>
    `,
  }),
};

/**
 * Near limit — the ring and progress bar reflect a high used-percentage.
 */
export const NearLimit: Story = {
  render: () => ({
    props: { usage },
    template: `
      <context [usedTokens]="184000" [maxTokens]="200000" [usage]="usage" modelId="anthropic/claude-3-5-sonnet">
        <context-trigger />
        <ng-template brnHoverCardContent>
          <context-content>
            <context-content-header />
            <context-content-body>
              <context-input-usage />
              <context-output-usage />
            </context-content-body>
            <context-content-footer />
          </context-content>
        </ng-template>
      </context>
    `,
  }),
};
