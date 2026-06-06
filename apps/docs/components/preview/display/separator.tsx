'use client';

import { Separator } from '@gremorie/rx-display';

export function SeparatorPreview() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">Gremorie</p>
      <p className="text-xs text-muted-foreground">AI-native design system</p>
      <Separator className="my-2" />
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Docs</span>
        <Separator orientation="vertical" className="h-4" />
        <span>Registry</span>
        <Separator orientation="vertical" className="h-4" />
        <span>MCP</span>
      </div>
    </div>
  );
}
