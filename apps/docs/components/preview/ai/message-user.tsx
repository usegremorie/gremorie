'use client';

import { Message, MessageContent } from '@gremorie/rx-ai';

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
