'use client';

import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from '@gremorie/rx-ai';

export function PromptInputMinimalPreview() {
  return (
    <PromptInput
      className="mx-auto max-w-xl"
      onSubmit={() => {
        // demo: wire onSubmit to the AI SDK to make this real
      }}
    >
      <PromptInputBody>
        <PromptInputTextarea placeholder="Ask anything..." />
      </PromptInputBody>
      <PromptInputFooter>
        <span />
        <PromptInputSubmit status="ready" />
      </PromptInputFooter>
    </PromptInput>
  );
}
