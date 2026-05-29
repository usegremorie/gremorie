"use client";

import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
  MessageToolbar,
} from "@gremorie/rx-ai";
import { Copy, RefreshCw, ThumbsDown, ThumbsUp } from "lucide-react";

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

export function MessageUserPreview() {
  return (
    <Message from="user">
      <MessageContent>
        Can you summarize the latest Gremorie release notes in three bullet
        points?
      </MessageContent>
    </Message>
  );
}

const richMarkdown = `Here's the breakdown:

1. **Speed** — caching layer responds in under 50ms.
2. **Coverage** — 100 primitives shipped across 9 packages.
3. **DX** — \`npx gremorie add rx-message\` is the single entry point.

> The registry is now the source of truth.

\`\`\`ts
import { Message } from "@gremorie/rx-ai";
\`\`\``;

export function MessageMarkdownPreview() {
  return (
    <Message from="assistant">
      <MessageContent>
        <MessageResponse>{richMarkdown}</MessageResponse>
      </MessageContent>
    </Message>
  );
}

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
