'use client';

import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from '@gremorie/rx-ai';

export function ToolCompletedPreview() {
  return (
    <Tool defaultOpen>
      <ToolHeader type="tool-search" state="output-available" />
      <ToolContent>
        <ToolInput input={{ query: 'gremorie registry' }} />
        <ToolOutput
          output={
            <pre className="text-xs">
              {JSON.stringify(
                { found: 100, hits: ['rx-message', 'rx-conversation'] },
                null,
                2,
              )}
            </pre>
          }
          errorText={undefined}
        />
      </ToolContent>
    </Tool>
  );
}
