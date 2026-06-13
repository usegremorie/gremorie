'use client';

import { Button } from '@gremorie/rx-forms';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@gremorie/rx-overlays';
import { Progress } from '@gremorie/rx-feedback';
import { cn } from '@gremorie/rx-core';
import type { LanguageModelUsage } from 'ai';
import { type ComponentProps, createContext, useContext } from 'react';
import { getUsage } from 'tokenlens';

const PERCENT_MAX = 100;
const ICON_RADIUS = 10;
const ICON_VIEWBOX = 24;
const ICON_CENTER = 12;
const ICON_STROKE_WIDTH = 2;

// Clamp a fraction to [0, 1] so an over-budget context (usedTokens > maxTokens)
// never pushes the ring gauge or the progress bar past full.
const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

// Raw used fraction. Guards a zero/negative window (no NaN/Infinity); may still
// exceed 1 so the *number* can honestly read "107%" while the visuals clamp.
const usedFraction = (used: number, max: number) => (max > 0 ? used / max : 0);

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
});
const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
});
const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const formatPercent = (fraction: number) => percentFormatter.format(fraction);
const formatCompact = (value: number) => compactFormatter.format(value);
const formatUSD = (value: number) => usdFormatter.format(value);

type ModelId = string;

type ContextSchema = {
  usedTokens: number;
  maxTokens: number;
  usage?: LanguageModelUsage;
  modelId?: ModelId;
};

const ContextContext = createContext<ContextSchema | null>(null);

const useContextValue = () => {
  const context = useContext(ContextContext);

  if (!context) {
    throw new Error('Context components must be used within Context');
  }

  return context;
};

export type ContextProps = ComponentProps<typeof HoverCard> & ContextSchema;

export const Context = ({
  usedTokens,
  maxTokens,
  usage,
  modelId,
  ...props
}: ContextProps) => (
  <ContextContext.Provider
    value={{
      usedTokens,
      maxTokens,
      usage,
      modelId,
    }}
  >
    <HoverCard closeDelay={0} openDelay={0} {...props} />
  </ContextContext.Provider>
);

const ContextIcon = () => {
  const { usedTokens, maxTokens } = useContextValue();
  const circumference = 2 * Math.PI * ICON_RADIUS;
  const fraction = clamp01(usedFraction(usedTokens, maxTokens));
  const dashOffset = circumference * (1 - fraction);

  // Decorative: the consumed percentage is announced via the trigger's label.
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height="20"
      style={{ color: 'currentcolor' }}
      viewBox={`0 0 ${ICON_VIEWBOX} ${ICON_VIEWBOX}`}
      width="20"
    >
      <circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        fill="none"
        opacity="0.25"
        r={ICON_RADIUS}
        stroke="currentColor"
        strokeWidth={ICON_STROKE_WIDTH}
      />
      <circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        fill="none"
        opacity="1"
        r={ICON_RADIUS}
        stroke="currentColor"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        strokeWidth={ICON_STROKE_WIDTH}
        style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
      />
    </svg>
  );
};

export type ContextTriggerProps = ComponentProps<typeof Button>;

export const ContextTrigger = ({ children, ...props }: ContextTriggerProps) => {
  const { usedTokens, maxTokens } = useContextValue();
  const renderedPercent = formatPercent(usedFraction(usedTokens, maxTokens));
  const usageLabel = `Context window: ${renderedPercent} used (${formatCompact(
    usedTokens,
  )} of ${formatCompact(maxTokens)} tokens)`;

  return (
    <HoverCardTrigger asChild>
      {children ?? (
        <Button
          aria-label={usageLabel}
          type="button"
          variant="ghost"
          {...props}
        >
          <span className="font-medium text-muted-foreground">
            {renderedPercent}
          </span>
          <ContextIcon />
        </Button>
      )}
    </HoverCardTrigger>
  );
};

export type ContextContentProps = ComponentProps<typeof HoverCardContent>;

export const ContextContent = ({
  className,
  ...props
}: ContextContentProps) => (
  <HoverCardContent
    className={cn('min-w-60 divide-y overflow-hidden p-0', className)}
    {...props}
  />
);

export type ContextContentHeaderProps = ComponentProps<'div'>;

export const ContextContentHeader = ({
  children,
  className,
  ...props
}: ContextContentHeaderProps) => {
  const { usedTokens, maxTokens } = useContextValue();
  const fraction = usedFraction(usedTokens, maxTokens);
  const displayPct = formatPercent(fraction);
  const used = formatCompact(usedTokens);
  const total = formatCompact(maxTokens);

  return (
    <div className={cn('w-full space-y-2 p-3', className)} {...props}>
      {children ?? (
        <>
          <div className="flex items-center justify-between gap-3 text-xs">
            <p>{displayPct}</p>
            <p className="font-mono text-muted-foreground">
              {used} / {total}
            </p>
          </div>
          <div className="space-y-2">
            <Progress
              className="bg-muted"
              value={clamp01(fraction) * PERCENT_MAX}
            />
          </div>
        </>
      )}
    </div>
  );
};

export type ContextContentBodyProps = ComponentProps<'div'>;

export const ContextContentBody = ({
  children,
  className,
  ...props
}: ContextContentBodyProps) => (
  <div className={cn('w-full p-3', className)} {...props}>
    {children}
  </div>
);

export type ContextContentFooterProps = ComponentProps<'div'>;

export const ContextContentFooter = ({
  children,
  className,
  ...props
}: ContextContentFooterProps) => {
  const { modelId, usage } = useContextValue();
  const costUSD = modelId
    ? getUsage({
        modelId,
        usage: {
          input: usage?.inputTokens ?? 0,
          output: usage?.outputTokens ?? 0,
        },
      }).costUSD?.totalUSD
    : undefined;
  const totalCost = formatUSD(costUSD ?? 0);

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between gap-3 bg-secondary p-3 text-xs',
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <span className="text-muted-foreground">Total cost</span>
          <span>{totalCost}</span>
        </>
      )}
    </div>
  );
};

export type ContextInputUsageProps = ComponentProps<'div'>;

export const ContextInputUsage = ({
  className,
  children,
  ...props
}: ContextInputUsageProps) => {
  const { usage, modelId } = useContextValue();
  const inputTokens = usage?.inputTokens ?? 0;

  if (children) {
    return children;
  }

  if (!inputTokens) {
    return null;
  }

  const inputCost = modelId
    ? getUsage({
        modelId,
        usage: { input: inputTokens, output: 0 },
      }).costUSD?.totalUSD
    : undefined;

  return (
    <div
      className={cn('flex items-center justify-between text-xs', className)}
      {...props}
    >
      <span className="text-muted-foreground">Input</span>
      <TokensWithCost
        costText={formatUSD(inputCost ?? 0)}
        tokens={inputTokens}
      />
    </div>
  );
};

export type ContextOutputUsageProps = ComponentProps<'div'>;

export const ContextOutputUsage = ({
  className,
  children,
  ...props
}: ContextOutputUsageProps) => {
  const { usage, modelId } = useContextValue();
  const outputTokens = usage?.outputTokens ?? 0;

  if (children) {
    return children;
  }

  if (!outputTokens) {
    return null;
  }

  const outputCost = modelId
    ? getUsage({
        modelId,
        usage: { input: 0, output: outputTokens },
      }).costUSD?.totalUSD
    : undefined;

  return (
    <div
      className={cn('flex items-center justify-between text-xs', className)}
      {...props}
    >
      <span className="text-muted-foreground">Output</span>
      <TokensWithCost
        costText={formatUSD(outputCost ?? 0)}
        tokens={outputTokens}
      />
    </div>
  );
};

export type ContextReasoningUsageProps = ComponentProps<'div'>;

export const ContextReasoningUsage = ({
  className,
  children,
  ...props
}: ContextReasoningUsageProps) => {
  const { usage, modelId } = useContextValue();
  const reasoningTokens = usage?.reasoningTokens ?? 0;

  if (children) {
    return children;
  }

  if (!reasoningTokens) {
    return null;
  }

  const reasoningCost = modelId
    ? getUsage({
        modelId,
        usage: { reasoningTokens },
      }).costUSD?.totalUSD
    : undefined;

  return (
    <div
      className={cn('flex items-center justify-between text-xs', className)}
      {...props}
    >
      <span className="text-muted-foreground">Reasoning</span>
      <TokensWithCost
        costText={formatUSD(reasoningCost ?? 0)}
        tokens={reasoningTokens}
      />
    </div>
  );
};

export type ContextCacheUsageProps = ComponentProps<'div'>;

export const ContextCacheUsage = ({
  className,
  children,
  ...props
}: ContextCacheUsageProps) => {
  const { usage, modelId } = useContextValue();
  const cacheTokens = usage?.cachedInputTokens ?? 0;

  if (children) {
    return children;
  }

  if (!cacheTokens) {
    return null;
  }

  const cacheCost = modelId
    ? getUsage({
        modelId,
        usage: { cacheReads: cacheTokens, input: 0, output: 0 },
      }).costUSD?.totalUSD
    : undefined;

  return (
    <div
      className={cn('flex items-center justify-between text-xs', className)}
      {...props}
    >
      <span className="text-muted-foreground">Cache</span>
      <TokensWithCost
        costText={formatUSD(cacheCost ?? 0)}
        tokens={cacheTokens}
      />
    </div>
  );
};

const TokensWithCost = ({
  tokens,
  costText,
}: {
  tokens?: number;
  costText?: string;
}) => (
  <span>
    {tokens === undefined ? '—' : formatCompact(tokens)}
    {costText ? (
      <span className="ml-2 text-muted-foreground">• {costText}</span>
    ) : null}
  </span>
);
