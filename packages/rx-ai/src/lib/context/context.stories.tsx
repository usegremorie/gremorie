import type { Meta, StoryObj } from "@storybook/react";
import type { LanguageModelUsage } from "ai";

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
} from "./context";

/**
 * # Context
 *
 * A faithful port of the Vercel AI Elements **Context** primitive — a token-
 * usage hovercard. The trigger shows the percentage of the model's context
 * window consumed (with a tiny ring gauge); hovering reveals a breakdown of
 * input / output / reasoning / cache tokens and the estimated cost. Cost is
 * derived from `modelId` + `usage` via the `tokenlens` package.
 *
 * ## Anatomy
 *
 * - **Context** — provider holding `usedTokens`, `maxTokens`, `usage`, `modelId`;
 *   wraps a `HoverCard`.
 * - **ContextTrigger** — the percentage + ring gauge button.
 * - **ContextContent** — the hovercard popover.
 * - **ContextContentHeader** — percentage, used/total and a progress bar.
 * - **ContextContentBody** — wraps the per-category usage rows.
 * - **ContextContentFooter** — total cost row (secondary background).
 * - **ContextInputUsage / OutputUsage / ReasoningUsage / CacheUsage** — one row
 *   each; auto-hidden when that token count is zero.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `usedTokens` | `number` | — | Tokens consumed in the context window. |
 * | `maxTokens` | `number` | — | Total context window size. |
 * | `usage` | `LanguageModelUsage` | — | Per-category token usage from the AI SDK. |
 * | `modelId` | `string` | — | Model id used by `tokenlens` for pricing. |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `ContextTrigger` | Percentage + ring gauge trigger button. |
 * | `ContextContent` | Hovercard popover container. |
 * | `ContextContentHeader` | Percentage, used/total, progress bar. |
 * | `ContextContentBody` | Wrapper for the usage rows. |
 * | `ContextContentFooter` | Total cost row. |
 * | `ContextInputUsage` | Input tokens + cost. |
 * | `ContextOutputUsage` | Output tokens + cost. |
 * | `ContextReasoningUsage` | Reasoning tokens + cost. |
 * | `ContextCacheUsage` | Cached input tokens + cost. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--muted` | Progress bar track. |
 * | `--secondary` | Footer background. |
 * | `--muted-foreground` | Row labels and meta text. |
 */
const meta = {
  title: "AI/Context",
  component: Context,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    usedTokens: { control: "number" },
    maxTokens: { control: "number" },
    modelId: { control: "text" },
  },
} satisfies Meta<typeof Context>;

export default meta;
type Story = StoryObj<typeof meta>;

const usage: LanguageModelUsage = {
  inputTokens: 48_213,
  outputTokens: 1_842,
  reasoningTokens: 920,
  cachedInputTokens: 12_000,
  totalTokens: 50_975,
  inputTokenDetails: {
    noCacheTokens: 36_213,
    cacheReadTokens: 12_000,
    cacheWriteTokens: 0,
  },
  outputTokenDetails: {
    textTokens: 1_842,
    reasoningTokens: 920,
  },
};

/**
 * Default usage hovercard. The trigger shows the consumed percentage; hover it
 * (it opens instantly) to see the full breakdown.
 */
export const Default: Story = {
  args: {
    usedTokens: 50_975,
    maxTokens: 200_000,
    usage,
    modelId: "anthropic:claude-3-5-sonnet",
  },
  render: (args) => (
    <Context {...args}>
      <ContextTrigger />
      <ContextContent>
        <ContextContentHeader />
        <ContextContentBody>
          <div className="space-y-1">
            <ContextInputUsage />
            <ContextOutputUsage />
            <ContextReasoningUsage />
            <ContextCacheUsage />
          </div>
        </ContextContentBody>
        <ContextContentFooter />
      </ContextContent>
    </Context>
  ),
};

/** Near the limit — the gauge and progress bar fill almost completely. */
export const NearLimit: Story = {
  args: {
    usedTokens: 188_400,
    maxTokens: 200_000,
    usage: {
      inputTokens: 180_000,
      outputTokens: 8_400,
      totalTokens: 188_400,
      inputTokenDetails: {
        noCacheTokens: 180_000,
        cacheReadTokens: 0,
        cacheWriteTokens: 0,
      },
      outputTokenDetails: {
        textTokens: 8_400,
        reasoningTokens: 0,
      },
    },
    modelId: "anthropic:claude-3-5-sonnet",
  },
  render: (args) => (
    <Context {...args}>
      <ContextTrigger />
      <ContextContent>
        <ContextContentHeader />
        <ContextContentBody>
          <div className="space-y-1">
            <ContextInputUsage />
            <ContextOutputUsage />
            <ContextReasoningUsage />
            <ContextCacheUsage />
          </div>
        </ContextContentBody>
        <ContextContentFooter />
      </ContextContent>
    </Context>
  ),
};
