"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  Message,
  MessageContent,
  PromptInput,
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
 *
 * Accessibility (Bug 3 fix from Odo audit):
 * - Respects prefers-reduced-motion: reduce via usePrefersReducedMotion
 * - When reduced motion is on, the animation cycle is skipped entirely
 *   and the final "done" state is rendered statically (full user message,
 *   collapsed-ish reasoning, full assistant message), no typing.
 */
const USER_MESSAGE = "Show me a sales dashboard";
const REASONING_TEXT =
  "Generating a 4-card KPI grid with revenue, orders, AOV, and conversion. Using semantic tokens and the chart artifact for the trend line.";
const ASSISTANT_TEXT =
  "Here is a dashboard with 4 KPI cards and a 12-month revenue chart. Each card uses the Card primitive with semantic color tokens. The chart is a Chart artifact bound to your data schema.";

type Phase = "idle" | "reasoning" | "assistant" | "done";

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReduce(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return reduce;
}

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
  const reducedMotion = usePrefersReducedMotion();
  // When reducedMotion is true, lock the phase to "done" so all final
  // content renders statically with no animation cycle.
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    // Reduced motion: skip animation cycle, render done state directly.
    if (reducedMotion) {
      timers.current.forEach((t) => clearTimeout(t));
      timers.current = [];
      setPhase("done");
      return;
    }

    function run() {
      // Clear any pending timers from a previous cycle.
      timers.current.forEach((t) => clearTimeout(t));
      timers.current = [];

      // Phase timings tuned so the FIRST visible moment is "reasoning"
      // text streaming, not a long "Thinking..." idle. idle -> reasoning
      // shortened from 600ms to 250ms, and reasoning -> assistant from
      // 3200ms to 2100ms so the cycle reaches assistant copy faster on
      // first paint - casual visitors no longer see a stuck idle.
      setPhase("idle");
      timers.current.push(setTimeout(() => setPhase("reasoning"), 250));
      timers.current.push(setTimeout(() => setPhase("assistant"), 2100));
      timers.current.push(setTimeout(() => setPhase("done"), 6800));
      timers.current.push(setTimeout(run, 10500));
    }
    run();
    return () => {
      timers.current.forEach((t) => clearTimeout(t));
    };
  }, [reducedMotion]);

  const animatedReasoning = useTypewriter(
    REASONING_TEXT,
    !reducedMotion && phase === "reasoning",
    14,
  );
  const animatedAssistant = useTypewriter(
    ASSISTANT_TEXT,
    !reducedMotion && (phase === "assistant" || phase === "done"),
    18,
  );

  // When reducedMotion is true, show full text instantly with no streaming.
  const reasoningOut = reducedMotion ? REASONING_TEXT : animatedReasoning;
  const assistantOut = reducedMotion ? ASSISTANT_TEXT : animatedAssistant;

  const showReasoning =
    reducedMotion ||
    phase === "reasoning" ||
    phase === "assistant" ||
    phase === "done";
  const isReasoningStreaming = !reducedMotion && phase === "reasoning";
  const showAssistant =
    reducedMotion || phase === "assistant" || phase === "done";

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

        {/*
          Prompt input (cosmetic, disabled submit).

          Bug-1 fix from Odo audit: PromptInputBody renders a wrapper with
          `display: contents` so its children "disappear" in layout. But
          the parent InputGroup uses `:has(> [data-align=block-end])` and
          `:has(> textarea)` direct-child selectors to switch to flex-col
          + h-auto. `display: contents` does NOT bypass the DOM-level `>`
          combinator, so those selectors never matched and the textarea
          was forced into a 36px-tall row-flex slot - placeholder rendered
          one character per line (24px wide, 192px tall).

          Skipping PromptInputBody here makes PromptInputTextarea and
          PromptInputFooter real direct children of InputGroup, the
          selectors match, the placeholder reads "Ask anything..." on
          one line.
        */}
        <div className="border-t border-border/60 p-3">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              placeholder="Ask anything..."
              disabled
              aria-label="Demo prompt input (disabled)"
            />
            <PromptInputFooter>
              <PromptInputTools />
              <PromptInputSubmit disabled status="ready" />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </Card>
  );
}
