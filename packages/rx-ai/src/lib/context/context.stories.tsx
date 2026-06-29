import type { Meta, StoryObj } from '@storybook/react';
import type { LanguageModelUsage } from 'ai';
import { useEffect, useState } from 'react';

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
 * ```text
 * Context                      token-usage hovercard (HoverCard)
 * ├─ ContextTrigger            % + ring gauge button
 * └─ ContextContent
 *    ├─ ContextContentHeader    % + used/total + progress bar
 *    ├─ ContextContentBody
 *    │  ├─ ContextInputUsage
 *    │  ├─ ContextOutputUsage
 *    │  ├─ ContextReasoningUsage
 *    │  └─ ContextCacheUsage     (each auto-hidden when zero)
 *    └─ ContextContentFooter    total cost
 * ```
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
  title: 'AI/Chatbot/Context',
  component: Context,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    usedTokens: { control: 'number' },
    maxTokens: { control: 'number' },
    modelId: { control: 'text' },
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

// The full hovercard breakdown: header (percent + progress), the four usage
// rows (each auto-hides when its token count is zero), and the cost footer.
const Breakdown = () => (
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
);

/**
 * Default usage hovercard. The trigger shows the consumed percentage; hover it
 * (it opens instantly) to see the full breakdown.
 */
export const Default: Story = {
  args: {
    usedTokens: 50_975,
    maxTokens: 200_000,
    usage,
    modelId: 'anthropic:claude-3-5-sonnet',
  },
  render: (args) => (
    <Context {...args}>
      <ContextTrigger />
      <Breakdown />
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
    modelId: 'anthropic:claude-3-5-sonnet',
  },
  render: (args) => (
    <Context {...args}>
      <ContextTrigger />
      <Breakdown />
    </Context>
  ),
};

/**
 * Low usage — a fresh conversation. The gauge is nearly empty and the
 * reasoning/cache rows are absent (those categories are zero).
 */
export const LowUsage: Story = {
  args: {
    usedTokens: 5_200,
    maxTokens: 200_000,
    usage: {
      inputTokens: 4_800,
      outputTokens: 400,
      totalTokens: 5_200,
      inputTokenDetails: {
        noCacheTokens: 4_800,
        cacheReadTokens: 0,
        cacheWriteTokens: 0,
      },
      outputTokenDetails: {
        textTokens: 400,
        reasoningTokens: 0,
      },
    },
    modelId: 'anthropic:claude-3-5-sonnet',
  },
  render: (args) => (
    <Context {...args}>
      <ContextTrigger />
      <Breakdown />
    </Context>
  ),
};

/**
 * No `modelId` — pricing is unavailable, so every cost falls back to `$0.00`
 * while the token counts still render. Wire `modelId` to enable cost.
 */
export const WithoutCost: Story = {
  args: {
    usedTokens: 50_975,
    maxTokens: 200_000,
    usage,
  },
  render: (args) => (
    <Context {...args}>
      <ContextTrigger />
      <Breakdown />
    </Context>
  ),
};

/**
 * Over budget — usage exceeds the window. The number reads the true `107%`
 * while the ring gauge and progress bar clamp at full instead of overflowing
 * into a broken state.
 */
export const OverBudget: Story = {
  args: {
    usedTokens: 214_000,
    maxTokens: 200_000,
    usage: {
      inputTokens: 198_000,
      outputTokens: 16_000,
      totalTokens: 214_000,
      inputTokenDetails: {
        noCacheTokens: 198_000,
        cacheReadTokens: 0,
        cacheWriteTokens: 0,
      },
      outputTokenDetails: {
        textTokens: 16_000,
        reasoningTokens: 0,
      },
    },
    modelId: 'anthropic:claude-3-5-sonnet',
  },
  render: (args) => (
    <Context {...args}>
      <ContextTrigger />
      <Breakdown />
    </Context>
  ),
};

/**
 * Trigger only — the bare gauge as embedded in the PromptInput header. With no
 * `ContextContent` child, hovering reveals nothing; use this when the surface
 * has no room for the breakdown.
 */
export const TriggerOnly: Story = {
  args: {
    usedTokens: 62_600,
    maxTokens: 200_000,
  },
  render: (args) => (
    <Context {...args}>
      <ContextTrigger />
    </Context>
  ),
};

const STREAM_MAX = 200_000;
const STREAM_START = 8_000;
const STREAM_STEP = 6_000;
const STREAM_INTERVAL_MS = 700;

// Self-driving demo: `usedTokens` climbs on an interval to mimic tokens
// streaming in from a backend, then loops back to the start.
const StreamingDemo = () => {
  const [usedTokens, setUsedTokens] = useState(STREAM_START);

  useEffect(() => {
    const id = setInterval(() => {
      setUsedTokens((prev) => {
        const next = prev + STREAM_STEP;
        return next > STREAM_MAX ? STREAM_START : next;
      });
    }, STREAM_INTERVAL_MS);

    return () => clearInterval(id);
  }, []);

  const usage: LanguageModelUsage = {
    inputTokens: Math.round(usedTokens * 0.82),
    outputTokens: Math.round(usedTokens * 0.18),
    totalTokens: usedTokens,
    inputTokenDetails: {
      noCacheTokens: Math.round(usedTokens * 0.82),
      cacheReadTokens: 0,
      cacheWriteTokens: 0,
    },
    outputTokenDetails: {
      textTokens: Math.round(usedTokens * 0.18),
      reasoningTokens: 0,
    },
  };

  return (
    <Context
      maxTokens={STREAM_MAX}
      modelId="anthropic:claude-3-5-sonnet"
      usage={usage}
      usedTokens={usedTokens}
    >
      <ContextTrigger />
      <Breakdown />
    </Context>
  );
};

/**
 * Streaming (live data) — `usedTokens` is driven by component state on a timer
 * to mimic a real backend feeding usage in. Watch the ring gauge, percentage
 * and progress bar react in real time; hover to see the breakdown update too.
 * Wiring a real backend is identical: feed live `usedTokens` / `maxTokens` /
 * `usage` props and the component re-renders the same way.
 */
export const Streaming: Story = {
  args: {
    usedTokens: STREAM_START,
    maxTokens: STREAM_MAX,
  },
  parameters: { controls: { disable: true } },
  render: () => <StreamingDemo />,
};
