'use client';

import {
  Context,
  ContextContent,
  ContextContentBody,
  ContextContentHeader,
  ContextTrigger,
} from '@gremorie/rx-ai';
import { Button } from '@gremorie/rx-forms';

export function ContextPreview() {
  return (
    <Context usedTokens={4321} maxTokens={8000}>
      <ContextTrigger>
        <Button variant="outline" size="sm">
          4.3k / 8k tokens
        </Button>
      </ContextTrigger>
      <ContextContent>
        <ContextContentHeader>
          <p className="text-sm font-medium">Context window</p>
        </ContextContentHeader>
        <ContextContentBody>
          <p className="text-xs text-muted-foreground">
            54 percent used. Detail token breakdown would render here.
          </p>
        </ContextContentBody>
      </ContextContent>
    </Context>
  );
}
