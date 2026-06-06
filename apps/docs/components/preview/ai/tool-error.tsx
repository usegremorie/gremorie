'use client';

import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from '@gremorie/rx-ai';

export function ToolErrorPreview() {
  return (
    <Tool defaultOpen>
      <ToolHeader type="tool-search" state="output-error" />
      <ToolContent>
        <ToolInput input={{ query: 'missing-item' }} />
        <ToolOutput
          output={undefined}
          errorText="Registry returned 404. Item does not exist."
        />
      </ToolContent>
    </Tool>
  );
}
