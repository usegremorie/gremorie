'use client';

import { Message, MessageContent, MessageResponse } from '@gremorie/rx-ai';

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
