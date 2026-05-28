"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";

/**
 * Live demo card for the hero. Loops through a fake AI conversation so
 * visitors see streaming reasoning + assistant response without needing
 * a real AI SDK / backend running on the docs deploy.
 *
 * Why typing animation instead of real AI:
 *   - Zero runtime cost (no key, no network, no streaming infra)
 *   - Deterministic visual demo for screenshots / Core Web Vitals
 *   - Real chat surface lives at /components/ai/* with full code
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

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm">
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
        <div className="flex-1 space-y-4 overflow-hidden p-4">
          {/* User message */}
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-lg bg-secondary px-3.5 py-2 text-sm text-secondary-foreground">
              {USER_MESSAGE}
            </div>
          </div>

          {/* Reasoning */}
          {(phase === "reasoning" ||
            phase === "assistant" ||
            phase === "done") && (
            <div className="max-w-[90%]">
              <div className="mb-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className={`size-1.5 rounded-full ${
                    phase === "reasoning"
                      ? "animate-pulse bg-primary"
                      : "bg-muted-foreground/50"
                  }`}
                  aria-hidden="true"
                />
                <span>
                  {phase === "reasoning" ? "Thinking…" : "Thought for 2.6s"}
                </span>
              </div>
              {phase === "reasoning" && (
                <div className="rounded-md border border-dashed border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                  {reasoningOut}
                  <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-muted-foreground/60 align-middle" />
                </div>
              )}
            </div>
          )}

          {/* Assistant response */}
          {(phase === "assistant" || phase === "done") && (
            <div className="max-w-[90%]">
              <div className="text-sm leading-relaxed text-foreground">
                {assistantOut}
                {phase === "assistant" &&
                  assistantOut.length < ASSISTANT_TEXT.length && (
                    <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-foreground/70 align-middle" />
                  )}
              </div>
            </div>
          )}
        </div>

        {/* Prompt input (cosmetic) */}
        <div className="border-t border-border/60 p-3">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
            <input
              type="text"
              placeholder="Ask anything…"
              disabled
              aria-label="Demo prompt input (disabled)"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="button"
              disabled
              aria-label="Send (demo)"
              className="inline-flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground opacity-70"
            >
              <Send className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
