'use client';

import { Button } from '@gremorie/rx-forms';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@gremorie/rx-overlays';

export function HoverCardPreview() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@gremorie</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="text-sm">
          <strong>Gremorie</strong>
          <p className="mt-1 text-muted-foreground">
            AI-native design system. Registry + MCP first.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
