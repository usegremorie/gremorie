'use client';

import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
  MessageToolbar,
} from '@gremorie/rx-ai';
import { Copy, RefreshCw, ThumbsDown, ThumbsUp } from 'lucide-react';

const assistantMarkdown = `## How can I help?

I can answer questions, summarize documents, and walk through code with you. Pick a task:

- Explain a concept
- Refactor a function
- Draft an email

Just let me know what you need.`;

export function MessageAssistantPreview() {
  return (
    <div className="flex flex-col gap-2">
      <Message from="assistant">
        <MessageContent>
          <MessageResponse>{assistantMarkdown}</MessageResponse>
        </MessageContent>
        <MessageToolbar>
          <MessageActions>
            <MessageAction tooltip="Copy">
              <Copy />
            </MessageAction>
            <MessageAction tooltip="Regenerate">
              <RefreshCw />
            </MessageAction>
            <MessageAction tooltip="Good response">
              <ThumbsUp />
            </MessageAction>
            <MessageAction tooltip="Bad response">
              <ThumbsDown />
            </MessageAction>
          </MessageActions>
        </MessageToolbar>
      </Message>
    </div>
  );
}
