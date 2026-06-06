'use client';

import { Message, MessageContent, MessageResponse } from '@gremorie/rx-ai';

export function MessagePairPreview() {
  return (
    <div className="flex flex-col gap-4">
      <Message from="user">
        <MessageContent>What is Gremorie?</MessageContent>
      </Message>
      <Message from="assistant">
        <MessageContent>
          <MessageResponse>
            Gremorie is an AI-native design system distributed via registry and
            MCP. It ships React and Angular primitives that AI agents can pull
            on demand.
          </MessageResponse>
        </MessageContent>
      </Message>
    </div>
  );
}
