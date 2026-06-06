'use client';

import { Tool, ToolContent, ToolHeader, ToolInput } from '@gremorie/rx-ai';

export function ToolRunningPreview() {
  return (
    <Tool defaultOpen>
      <ToolHeader type="tool-search" state="input-available" />
      <ToolContent>
        <ToolInput input={{ query: 'gremorie registry' }} />
      </ToolContent>
    </Tool>
  );
}
