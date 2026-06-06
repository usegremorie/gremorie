'use client';

import { Reasoning, ReasoningContent, ReasoningTrigger } from '@gremorie/rx-ai';

export function ReasoningStreamingPreview() {
  return (
    <Reasoning isStreaming defaultOpen>
      <ReasoningTrigger />
      <ReasoningContent>
        Considering whether to recommend rx-tool or rx-task for this case...
      </ReasoningContent>
    </Reasoning>
  );
}
