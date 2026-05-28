"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
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
import { Card } from "@gremorie/rx-display";

/**
 * Live demo card for the hero. Loops through a fake AI conversation so
 * visitors see streaming reasoning + assistant response without needing
 * a real AI SDK / backend running on the docs deploy.
 *
 * Dogfood: composed with rx-display Card + rx-ai Conversation, Message,
 * Reasoning, PromptInput primitives. Typing animation is preserved via
 * a small useTypewriter hook that feeds the actual rx-ai primitives -
 * the primitives are streaming-aware (Reasoning has isStreaming prop;
 * Message renders streamed text natively).
 *
 * Cycle: idle -> reasoning -> assistant typing -> done -> reset.
 */
const USER_MESSAGE = "Show me a sales dashboard";
const REASONING_TEXT =
  "Generating a 4-card KPI grid with revenue, orders, AOV, and conversion. Using semantic tokens and the chart artifact for the trend line.";
const ASSISTANT_TEXT =
  "Here is a dashboard with 4 KPI cards and a 12-month revenue chart. Each card uses the Card primitive with semantic color tokens. The chart is a Chart artifact bound to your data schema.";

type Phase = "idle" | "reasoning" | "assistant" | "done";

function useTypewriter(text: string, active: boolean, speed = 22) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!active) {
      setOut("");
      return;
    }
    let i = 0;
    setOut("");
    const id = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, active, speed]);
  return out;
}

export function HeroDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    function run() {
      // Clear any pending timers from a previous cycle.
      timers.current.forEach((t) => clearTimeout(t));
      timers.current = [];

      setPhase("idle");
      timers.current.push(setTimeout(() => setPhase("reasoning"), 600));
      timers.current.push(setTimeout(() => setPhase("assistant"), 3200));
      timers.current.push(setTimeout(() => setPhase("done"), 7800));
      timers.current.push(setTimeout(run, 11000));
    }
    run();
    return () => {
      timers.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const reasoningOut = useTypewriter(
    REASONING_TEXT,
    phase === "reasoning",
    14
  );
  const assistantOut = useTypewriter(
    ASSISTANT_TEXT,
    phase === "assistant" || phase === "done",
    18
  );

  const showReasoning =
    phase === "reasoning" || phase === "assistant" || phase === "done";
  const isReasoningStreaming = phase === "reasoning";
  const showAssistant = phase === "assistant" || phase === "done";

  // Cosmetic no-op handler. The submit button is permanently disabled.
  const handleSubmit = () => {
    // demo only, no real submission
  };

  return (
    <Card className="relative gap-0 overflow-hidden py-0 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="size-3.5" aria-hidden="true" />
          <span>Gremorie chat surface</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-muted" />
          <span className="size-2 rounded-full bg-muted" />
          <span className="size-2 rounded-full bg-muted" />
        </div>
      </div>

      <div className="flex h-[360px] flex-col">
        <Conversation className="flex-1">
          <ConversationContent className="space-y-4 p-4">
            {/* User message */}
            <Message from="user">
              <MessageContent>{USER_MESSAGE}</MessageContent>
            </Message>

            {/* Reasoning block (streaming-aware via isStreaming prop) */}
            {showReasoning && (
              <Reasoning
                isStreaming={isReasoningStreaming}
                defaultOpen
                duration={2}
              >
                <ReasoningTrigger />
                <ReasoningContent>{reasoningOut}</ReasoningContent>
              </Reasoning>
            )}

            {/* Assistant response */}
            {showAssistant && (
              <Message from="assistant">
                <MessageContent>{assistantOut}</MessageContent>
              </Message>
            )}
          </ConversationContent>
        </Conversation>

        {/* Prompt input (cosmetic, disabled submit) */}
        <div className="border-t border-border/60 p-3">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea
                placeholder="Ask anything…"
                disabled
                aria-label="Demo prompt input (disabled)"
              />
              <PromptInputFooter>
                <PromptInputTools />
                <PromptInputSubmit disabled status="ready" />
              </PromptInputFooter>
            </PromptInputBody>
          </PromptInput>
        </div>
      </div>
    </Card>
  );
}
