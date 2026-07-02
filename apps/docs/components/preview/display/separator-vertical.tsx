'use client';

import { Separator } from '@gremorie/rx-display';

export function SeparatorVerticalPreview() {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span>Docs</span>
      <Separator orientation="vertical" className="h-4" />
      <span>Registry</span>
      <Separator orientation="vertical" className="h-4" />
      <span>MCP</span>
    </div>
  );
}
