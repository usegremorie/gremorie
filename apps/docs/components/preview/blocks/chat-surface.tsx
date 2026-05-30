"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  Conversation,
  ConversationContent,
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardTrigger,
  InlineCitationText,
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
  type ChatStatus,
  type PromptInputMessage,
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

type Turn = { id: number; role: "user" | "assistant"; body: ReactNode };

/**
 * Interactive demo of the chat-surface block. Unlike the canonical
 * copy-paste code (shown in the page's "Code" tab, which leaves onSubmit
 * for you to wire to the AI SDK / Hashbrown), this preview ships a local
 * MOCK so the surface is testable end to end: type -> the user turn
 * appears -> a faked "streaming" assistant reply lands, complete with a
 * Reasoning collapsible and an InlineCitation hover card. No backend.
 */
const SEED: Turn[] = [
  {
    id: 0,
    role: "user",
    body: <MessageContent>What did the team ship this week?</MessageContent>,
  },
  {
    id: 1,
    role: "assistant",
    body: (
      <>
        <Reasoning isStreaming={false} duration={2}>
          <ReasoningTrigger />
          <ReasoningContent>{REASONING_TEXT}</ReasoningContent>
        </Reasoning>
        <MessageContent>{ASSISTANT_TEXT}</MessageContent>
      </>
    ),
  },
];

function mockReply(userText: string, id: number): Turn {
  return {
    id,
    role: "assistant",
    body: (
      <>
        <Reasoning isStreaming={false} duration={1}>
          <ReasoningTrigger />
          <ReasoningContent>
            Parsing the request, then pulling the most relevant entry from
            the corpus before drafting a grounded answer.
          </ReasoningContent>
        </Reasoning>
        <MessageContent>
          <p className="text-sm leading-relaxed">
            Mock answer to &ldquo;{userText}&rdquo; — wire{" "}
            <code>onSubmit</code> to the AI SDK to make this real. Gremorie
            ships components, a registry, and an MCP server
            <InlineCitation>
              <InlineCitationText> [1]</InlineCitationText>
              <InlineCitationCard>
                <InlineCitationCardTrigger
                  sources={["https://gremorie.com"]}
                />
                <InlineCitationCardBody>
                  <p className="text-sm font-semibold">Gremorie docs</p>
                  <p className="text-xs text-muted-foreground">
                    gremorie.com/docs
                  </p>
                </InlineCitationCardBody>
              </InlineCitationCard>
            </InlineCitation>
            , for React and Angular.
          </p>
        </MessageContent>
      </>
    ),
  };
}

export function ChatSurface() {
  const [turns, setTurns] = useState<Turn[]>(SEED);
  const [status, setStatus] = useState<ChatStatus>("ready");
  const nextId = useRef(SEED.length);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSubmit = (message: PromptInputMessage) => {
    const text = message.text.trim();
    if (!text || status !== "ready") return;

    const userId = nextId.current++;
    setTurns((prev) => [
      ...prev,
      { id: userId, role: "user", body: <MessageContent>{text}</MessageContent> },
    ]);
    setStatus("submitted");

    // Fake a short "thinking -> streaming -> done" cycle so the surface is
    // testable without a real endpoint.
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setStatus("streaming");
      const replyId = nextId.current++;
      setTurns((prev) => [...prev, mockReply(text, replyId)]);
      timer.current = setTimeout(() => setStatus("ready"), 600);
    }, 700);
  };

  return (
    <div className="flex h-[560px] w-full flex-col overflow-hidden rounded-lg border bg-card">
      <Conversation>
        <ConversationContent className="px-4 py-6">
          {turns.map((turn) => (
            <Message key={turn.id} from={turn.role}>
              {turn.body}
            </Message>
          ))}
        </ConversationContent>
      </Conversation>
      <div className="border-t bg-background p-3">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea placeholder="Ask anything..." />
            <PromptInputFooter>
              <PromptInputTools />
              <PromptInputSubmit status={status} />
            </PromptInputFooter>
          </PromptInputBody>
        </PromptInput>
      </div>
    </div>
  );
}
