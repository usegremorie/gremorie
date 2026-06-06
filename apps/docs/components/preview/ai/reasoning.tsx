'use client';

import { Reasoning, ReasoningContent, ReasoningTrigger } from '@gremorie/rx-ai';

const REASONING_TEXT = `The user wants to add a registry item. I need to:

1. Confirm the package the primitive lives in.
2. Check registry.json for the existing schema.
3. Add the item with registryDependencies pointing at its peers.`;

export function ReasoningPreview() {
  return (
    <Reasoning isStreaming={false} defaultOpen>
      <ReasoningTrigger />
      <ReasoningContent>{REASONING_TEXT}</ReasoningContent>
    </Reasoning>
  );
}
