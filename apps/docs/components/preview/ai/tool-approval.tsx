'use client';

import { Tool, ToolContent, ToolHeader, ToolInput } from '@gremorie/rx-ai';

export function ToolApprovalPreview() {
  return (
    <Tool defaultOpen>
      <ToolHeader type="tool-delete-file" state="approval-requested" />
      <ToolContent>
        <ToolInput input={{ path: 'src/old-component.tsx' }} />
      </ToolContent>
    </Tool>
  );
}
