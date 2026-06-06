'use client';

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from '@gremorie/rx-ai';
import { MessageCircleQuestion } from 'lucide-react';

export function ConversationEmptyPreview() {
  return (
    <div className="h-[240px] rounded-lg border">
      <Conversation>
        <ConversationContent>
          <ConversationEmptyState
            icon={<MessageCircleQuestion className="size-8" />}
            title="Start a conversation"
            description="Ask anything about Gremorie primitives, tokens, or the registry."
          />
        </ConversationContent>
      </Conversation>
    </div>
  );
}
