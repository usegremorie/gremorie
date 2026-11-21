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
  type ContextCostResolver,
} from './context';

// Demo pricing (USD per million tokens) so the rows show their cost, as in
// React. Real apps pass their own resolver.
const demoCost: ContextCostResolver = (_model, u) =>
  ((u.inputTokens ?? 0) * 3 +
    (u.outputTokens ?? 0) * 15 +
    (u.reasoningTokens ?? 0) * 15 +
    (u.cachedInputTokens ?? 0) * 0.3) /
  1_000_000;

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
        <gr-context [usedTokens]="12200" [maxTokens]="200000" [usage]="usage" modelId="anthropic/claude-3-5-sonnet">
          <gr-context-trigger />
          <ng-template brnHoverCardContent>
            <gr-context-content>
              <gr-context-content-header />
              <gr-context-content-body>
                <gr-context-input-usage />
                <gr-context-output-usage />
                <gr-context-reasoning-usage />
                <gr-context-cache-usage />
              </gr-context-content-body>
              <gr-context-content-footer />
            </gr-context-content>
          </ng-template>
        </gr-context>
      </div>
    `,
  }),
};

/**
 * Near limit — the ring and progress bar reflect a high used-percentage.
 */
export const NearLimit: Story = {
  render: () => ({
    props: { usage, demoCost },
    template: `
      <gr-context [usedTokens]="184000" [maxTokens]="200000" [usage]="usage" modelId="anthropic/claude-3-5-sonnet" [costResolver]="demoCost">
        <gr-context-trigger />
        <ng-template brnHoverCardContent>
          <gr-context-content>
            <gr-context-content-header />
            <gr-context-content-body>
              <gr-context-input-usage />
              <gr-context-output-usage />
            </gr-context-content-body>
            <gr-context-content-footer />
          </gr-context-content>
        </ng-template>
      </gr-context>
    `,
  }),
};

/**
 * Display — the three ways the trigger shows usage. `compact` keeps only the
 * ring; the percentage stays in the accessible name and the hover card.
 * `auto` drops the number once its container (here a 20rem frame standing in
 * for a narrow PromptInput) is under 24rem.
 */
export const Display: Story = {
  render: () => ({
    props: { usage, demoCost, fixed: ['full', 'compact'], frames: [32, 20] },
    template: `
      <div class="flex flex-col gap-4">
        @for (display of fixed; track display) {
          <div class="flex items-center gap-3">
            <code class="w-20 text-xs text-muted-foreground">{{ display }}</code>
            <gr-context [usedTokens]="62600" [maxTokens]="200000" [usage]="usage" modelId="anthropic/claude-3-5-sonnet" [costResolver]="demoCost">
              <gr-context-trigger [display]="display" />
              <ng-template brnHoverCardContent>
                <gr-context-content>
                  <gr-context-content-header />
                  <gr-context-content-footer />
                </gr-context-content>
              </ng-template>
            </gr-context>
          </div>
        }
        @for (rem of frames; track rem) {
          <div class="flex items-center gap-3">
            <code class="w-20 text-xs text-muted-foreground">auto {{ rem }}rem</code>
            <div class="@container flex justify-end rounded-md border p-1" [style.width.rem]="rem">
              <gr-context [usedTokens]="62600" [maxTokens]="200000" [usage]="usage" modelId="anthropic/claude-3-5-sonnet" [costResolver]="demoCost">
                <gr-context-trigger display="auto" />
                <ng-template brnHoverCardContent>
                  <gr-context-content>
                    <gr-context-content-header />
                    <gr-context-content-footer />
                  </gr-context-content>
                </ng-template>
              </gr-context>
            </div>
          </div>
        }
      </div>
    `,
  }),
};
