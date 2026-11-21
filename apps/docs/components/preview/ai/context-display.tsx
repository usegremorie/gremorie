'use client';

import {
  Context,
  ContextContent,
  ContextContentHeader,
  ContextTrigger,
} from '@gremorie/rx-ai';

const meter = (display: 'full' | 'compact' | 'auto') => (
  <Context maxTokens={200_000} usedTokens={62_600}>
    <ContextTrigger display={display} />
    <ContextContent>
      <ContextContentHeader />
    </ContextContent>
  </Context>
);

export function ContextDisplayPreview() {
  return (
    <div className="flex flex-col gap-4 text-sm">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <code className="text-xs text-muted-foreground">full</code>
          {meter('full')}
        </div>
        <div className="flex items-center gap-2">
          <code className="text-xs text-muted-foreground">compact</code>
          {meter('compact')}
        </div>
      </div>
      {/* `auto` reads its container: the PromptInput in a real composer. */}
      <div className="flex flex-col gap-2">
        <code className="text-xs text-muted-foreground">auto</code>
        <div className="@container flex w-full max-w-md items-center justify-between rounded-md border px-3 py-1">
          <span className="text-muted-foreground">Wide composer</span>
          {meter('auto')}
        </div>
        <div className="@container flex w-full max-w-60 items-center justify-between rounded-md border px-3 py-1">
          <span className="text-muted-foreground">Narrow</span>
          {meter('auto')}
        </div>
      </div>
    </div>
  );
}
