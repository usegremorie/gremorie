'use client';

import {
  Conversation,
  ConversationContent,
  Message,
  MessageContent,
  MessageResponse,
} from '@gremorie/rx-ai';

export function ConversationPreview() {
  return (
    <div className="h-[320px] rounded-lg border">
      <Conversation>
        <ConversationContent>
          <Message from="user">
            <MessageContent>What is Gremorie?</MessageContent>
          </Message>
          <Message from="assistant">
            <MessageContent>
              <MessageResponse>
                Gremorie is an AI-native design system: registry + MCP first,
                React and Angular bindings second.
              </MessageResponse>
            </MessageContent>
          </Message>
          <Message from="user">
            <MessageContent>How do I install a primitive?</MessageContent>
          </Message>
          <Message from="assistant">
            <MessageContent>
              <MessageResponse>
                Use `npx gremorie add rx-message`. The registry resolves
                dependencies and writes source files into your project.
              </MessageResponse>
            </MessageContent>
          </Message>
        </ConversationContent>
      </Conversation>
    </div>
  );
}
