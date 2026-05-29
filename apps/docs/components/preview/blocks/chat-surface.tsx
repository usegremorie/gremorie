"use client";

import {
  Conversation,
  ConversationContent,
  Message,
  MessageContent,
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@gremorie/rx-ai";

const REASONING_TEXT =
  "The user wants a quick weekly status summary. I'll group the work into 3 buckets: shipped, in-flight, and blockers. Each row stays short for skimmability.";

const ASSISTANT_TEXT = `Here is a quick weekly recap:

**Shipped**
- Auth flow with GitHub provider
- Dashboard analytics widget

**In flight**
- Settings form (3 sections)
- Empty state pattern

**Blockers**
- Waiting on API key for analytics provider`;

/**
 * Chat surface block: streaming conversation surface with reasoning
 * collapsible and a PromptInput composer. Demonstrates how rx-ai
 * primitives compose into a full AI surface.
 */
export function ChatSurface() {
  return (
    <div className="flex h-[560px] w-full flex-col overflow-hidden rounded-lg border bg-card">
      <Conversation>
        <ConversationContent className="px-4 py-6">
          <Message from="user">
            <MessageContent>What did the team ship this week?</MessageContent>
          </Message>
          <Message from="assistant">
            <Reasoning isStreaming={false} duration={2}>
              <ReasoningTrigger />
              <ReasoningContent>{REASONING_TEXT}</ReasoningContent>
            </Reasoning>
            <MessageContent>{ASSISTANT_TEXT}</MessageContent>
          </Message>
          <Message from="user">
            <MessageContent>
              Can you draft a Slack post from this?
            </MessageContent>
          </Message>
        </ConversationContent>
      </Conversation>
      <div className="border-t bg-background p-3">
        <PromptInput onSubmit={() => {}}>
          <PromptInputBody>
            <PromptInputTextarea placeholder="Ask anything..." />
            <PromptInputFooter>
              <PromptInputTools />
              <PromptInputSubmit disabled />
            </PromptInputFooter>
          </PromptInputBody>
        </PromptInput>
      </div>
    </div>
  );
}
