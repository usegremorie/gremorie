'use client';

import {
  Context,
  ContextCacheUsage,
  ContextContent,
  ContextContentBody,
  ContextContentFooter,
  ContextContentHeader,
  ContextInputUsage,
  ContextOutputUsage,
  ContextReasoningUsage,
  ContextTrigger,
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  Message,
  MessageAction,
  MessageActions,
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
  MessageContent,
  MessageResponse,
  MessageToolbar,
  PromptInput,
  PromptInputAttachButton,
  PromptInputBody,
  PromptInputButton,
  PromptInputMentions,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSpeechButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
  type ChatStatus,
  type PromptInputMentionsItem,
  type PromptInputMessage,
} from '@gremorie/rx-ai';
import { ChartArtifact } from '@gremorie/rx-artifacts';
import { cn } from '@gremorie/rx-core';
import { Button } from '@gremorie/rx-forms';
import {
  ClaudeIcon,
  GeminiIcon,
  MessageCircle,
  OpenAiIcon,
} from '@gremorie/rx-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  TooltipProvider,
} from '@gremorie/rx-overlays';
import {
  ArchiveIcon,
  ArrowUpIcon,
  ChartColumnBigIcon,
  ChevronDownIcon,
  CopyIcon,
  EllipsisIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  GlobeIcon,
  LibraryIcon,
  ListChecksIcon,
  MessageCircleQuestionIcon,
  PenSquareIcon,
  RefreshCwIcon,
  Share2Icon,
  TelescopeIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
} from 'lucide-react';
import { useRef, useState } from 'react';

import type { LanguageModelUsage } from 'ai';

// ── B2B composer presets (the Gremorie standard) ────────────────────────────
const MODES = [
  {
    id: 'ask',
    label: 'Ask',
    icon: <MessageCircleQuestionIcon className="size-4" />,
  },
  {
    id: 'analyze',
    label: 'Analyze',
    icon: <ChartColumnBigIcon className="size-4" />,
  },
  {
    id: 'research',
    label: 'Research',
    icon: <TelescopeIcon className="size-4" />,
  },
  { id: 'plan', label: 'Plan', icon: <ListChecksIcon className="size-4" /> },
];

const MODELS = [
  {
    id: 'claude-opus-4-8',
    label: 'Claude Opus 4.8',
    icon: <ClaudeIcon className="size-4" />,
  },
  {
    id: 'claude-sonnet-4-6',
    label: 'Claude Sonnet 4.6',
    icon: <ClaudeIcon className="size-4" />,
  },
  { id: 'gpt-5', label: 'GPT-5', icon: <OpenAiIcon className="size-4" /> },
  {
    id: 'gemini-2-5-pro',
    label: 'Gemini 2.5 Pro',
    icon: <GeminiIcon className="size-4" />,
  },
];

const CONTEXT_ITEMS: PromptInputMentionsItem[] = [
  {
    id: 'q3-revenue',
    label: 'Q3 revenue.csv',
    group: 'Recent',
    icon: <FileSpreadsheetIcon />,
  },
  {
    id: 'board-deck',
    label: 'Board deck Q2',
    group: 'Recent',
    icon: <FileTextIcon />,
  },
  {
    id: 'finance-db',
    label: 'Finance warehouse',
    group: 'Workspace',
    icon: <ChartColumnBigIcon />,
  },
];

const THREADS = [
  'Q3 board review',
  'Pricing model v2',
  'Onboarding email copy',
  'Churn analysis — enterprise',
];

const OUTLINE_TRIGGER =
  'border border-input border-solid bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent';

// Per-category token usage powering the Context hovercard breakdown + cost.
const CONTEXT_USAGE: LanguageModelUsage = {
  inputTokens: 52_600,
  outputTokens: 6_400,
  reasoningTokens: 2_200,
  cachedInputTokens: 14_000,
  totalTokens: 61_200,
  inputTokenDetails: {
    noCacheTokens: 38_600,
    cacheReadTokens: 14_000,
    cacheWriteTokens: 0,
  },
  outputTokenDetails: {
    textTokens: 6_400,
    reasoningTokens: 2_200,
  },
};

// ── Mocked conversation content ─────────────────────────────────────────────
const REASONING = `Pulling Q3 revenue from the finance warehouse, comparing against Q2 and the forecast, then drafting a board-ready one-pager. Keeping it to headline, three KPIs, and one risk.`;

const ANSWER_FULL = `**Q3 revenue landed at $4.2M, up 18% QoQ** and 6% ahead of forecast, driven by net expansion in the enterprise tier.

**By region**
- North America carried the quarter at $2.18M (52% of total)
- EMEA followed at $1.12M, with APAC and LATAM rounding out the mix

The regional breakdown is charted below. Toggle to the table view for the exact figures, or download the data and image straight from the artifact.`;

const ANSWER_CONCISE = `**Q3 revenue: $4.2M, +18% QoQ**, 6% ahead of forecast. North America led at $2.18M, then EMEA at $1.12M. Full regional split is in the artifact below (chart or table).`;

// Q3 revenue split by region — powers the inline ChartArtifact (chart + table).
const REVENUE_BY_REGION = [
  { region: 'North America', revenue: 2_180_000 },
  { region: 'EMEA', revenue: 1_120_000 },
  { region: 'APAC', revenue: 640_000 },
  { region: 'LATAM', revenue: 260_000 },
];

// ── Composer (the floating B2B PromptInput) ─────────────────────────────────
function Composer({
  status,
  onSubmit,
}: {
  status: ChatStatus;
  onSubmit: (message: PromptInputMessage) => void;
}) {
  return (
    <PromptInput className="rounded-xl shadow-lg" multiple onSubmit={onSubmit}>
      <PromptInputHeader>
        <PromptInputMentions items={CONTEXT_ITEMS} />
        <Context
          maxTokens={200_000}
          modelId="anthropic:claude-3-5-sonnet"
          usage={CONTEXT_USAGE}
          usedTokens={62_600}
        >
          <ContextTrigger className="ml-auto" />
          <ContextContent>
            <ContextContentHeader />
            <ContextContentBody>
              <div className="space-y-1">
                <ContextInputUsage />
                <ContextOutputUsage />
                <ContextReasoningUsage />
                <ContextCacheUsage />
              </div>
            </ContextContentBody>
            <ContextContentFooter />
          </ContextContent>
        </Context>
      </PromptInputHeader>
      <PromptInputBody>
        <PromptInputTextarea placeholder="Ask anything, or pick a mode..." />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools className="gap-2">
          <PromptInputSelect defaultValue="research">
            <PromptInputSelectTrigger
              aria-label="Select mode"
              className={OUTLINE_TRIGGER}
              size="sm"
            >
              <PromptInputSelectValue placeholder="Mode" />
            </PromptInputSelectTrigger>
            <PromptInputSelectContent>
              {MODES.map((mode) => (
                <PromptInputSelectItem key={mode.id} value={mode.id}>
                  {mode.icon}
                  {mode.label}
                </PromptInputSelectItem>
              ))}
            </PromptInputSelectContent>
          </PromptInputSelect>
          <PromptInputSelect defaultValue="claude-sonnet-4-6">
            <PromptInputSelectTrigger
              aria-label="Select model"
              className={OUTLINE_TRIGGER}
              size="sm"
            >
              <PromptInputSelectValue placeholder="Model" />
            </PromptInputSelectTrigger>
            <PromptInputSelectContent>
              {MODELS.map((model) => (
                <PromptInputSelectItem key={model.id} value={model.id}>
                  {model.icon}
                  {model.label}
                </PromptInputSelectItem>
              ))}
            </PromptInputSelectContent>
          </PromptInputSelect>
        </PromptInputTools>
        <PromptInputTools className="gap-2">
          <PromptInputTools>
            <PromptInputButton
              aria-label="Search the web"
              tooltip="Search the web"
            >
              <GlobeIcon className="size-4" />
            </PromptInputButton>
            <PromptInputAttachButton tooltip="Attach files" />
            <PromptInputSpeechButton tooltip="Voice input" />
          </PromptInputTools>
          <PromptInputSubmit status={status} tooltip="Send">
            <ArrowUpIcon className="size-4" />
          </PromptInputSubmit>
        </PromptInputTools>
      </PromptInputFooter>
    </PromptInput>
  );
}

// ── The assistant answer (used as a branch body) ────────────────────────────
function AssistantAnswer({ text }: { text: string }) {
  return (
    <MessageContent>
      <Reasoning duration={3} isStreaming={false}>
        <ReasoningTrigger />
        <ReasoningContent>{REASONING}</ReasoningContent>
      </Reasoning>
      <MessageResponse>{text}</MessageResponse>
      {/* Generated artifact, inline in the conversation: a real chart with a
          working chart <-> table toggle and live Image (PNG) / Data (CSV)
          downloads, all client-side, so they work right here in the preview. */}
      <ChartArtifact
        className="mt-1"
        title="Q3 revenue by region"
        description="Chart · generated just now"
        data={REVENUE_BY_REGION}
        type="bar"
        categoryKey="region"
        valueKey="revenue"
        categoryLabel="Region"
        valueLabel="Revenue"
        numberFormat={{
          style: 'currency',
          currency: 'USD',
          notation: 'compact',
          maximumFractionDigits: 1,
        }}
        fileName="q3-revenue-by-region"
      />
    </MessageContent>
  );
}

/**
 * Assistant - the Gremorie standard chat block. Anatomy (market-standard parts):
 *
 *   AssistantHeader   - thread/history switcher (left), primary actions + an
 *                       overflow menu of secondary actions (right)
 *   AssistantContent  - the conversation: messages with reasoning, an inline
 *                       generated artifact, sources, response branches + actions
 *   AssistantComposer - the floating PromptInput (B2B: context, mode, model)
 *   AssistantDisclaimer
 *
 * Ships a local mock so it is testable end to end - wire `onSubmit` to your AI
 * SDK to make it real.
 */
/** Which surface the block shows: a live conversation, or the new-chat start. */
export type AssistantView = 'filled' | 'empty';

export function Assistant({
  initialView = 'filled',
}: {
  /** Start in a live conversation (`filled`) or the empty new-chat state. */
  initialView?: AssistantView;
} = {}) {
  const [view, setView] = useState<AssistantView>(initialView);
  const [status, setStatus] = useState<ChatStatus>('ready');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reveal the conversation scrollbar only while the user is scrolling, then
  // fade it back out a beat after they stop (the ScrollArea behaviour, applied
  // to the stick-to-bottom scroll element the Conversation owns).
  const [scrolling, setScrolling] = useState(false);
  const scrollHide = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleConvScroll = () => {
    setScrolling(true);
    if (scrollHide.current) clearTimeout(scrollHide.current);
    scrollHide.current = setTimeout(() => setScrolling(false), 700);
  };

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text.trim() || status !== 'ready') return;
    // Sending from the new-chat state drops you into the conversation.
    setView('filled');
    setStatus('submitted');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setStatus('streaming');
      timer.current = setTimeout(() => setStatus('ready'), 900);
    }, 600);
  };

  return (
    <TooltipProvider>
      <div className="relative mx-auto flex h-[680px] w-full max-w-3xl flex-col overflow-hidden rounded-[16px] border bg-card text-card-foreground shadow-sm">
        {/* AssistantHeader */}
        <header className="flex items-center justify-between gap-2 px-3 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2 font-medium" size="sm" variant="ghost">
                <MessageCircle className="size-4 text-muted-foreground" />
                <span className="max-w-[14rem] truncate">
                  {view === 'empty' ? 'New chat' : 'Q3 board review'}
                </span>
                <ChevronDownIcon className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel>Recent chats</DropdownMenuLabel>
              {THREADS.map((thread) => (
                <DropdownMenuItem
                  key={thread}
                  onSelect={() => setView('filled')}
                >
                  {thread}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setView('empty')}>
                <PenSquareIcon className="mr-2 size-4" /> New chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-1">
            <Button className="gap-2" size="sm" variant="ghost">
              <LibraryIcon className="size-4" /> Sources
            </Button>
            <Button aria-label="Share" size="icon-sm" variant="ghost">
              <Share2Icon className="size-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="More actions"
                  size="icon-sm"
                  variant="ghost"
                >
                  <EllipsisIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <ArchiveIcon className="mr-2 size-4" /> Archive
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CopyIcon className="mr-2 size-4" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <Trash2Icon className="mr-2 size-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {view === 'empty' ? (
          // AssistantStart - the new-chat state: a centered welcome, the
          // composer, and quick-start chips (the Claude home pattern).
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4">
            <h2 className="text-center font-semibold text-2xl tracking-tight">
              How can I help you today?
            </h2>
            <div className="w-full max-w-2xl">
              <Composer onSubmit={handleSubmit} status={status} />
            </div>
          </div>
        ) : (
          <>
            {/* AssistantContent - the conversation. Wrapped so a top gradient
                can dissolve the scrolling content into the header. */}
            <div className="relative flex-1 overflow-hidden">
              <Conversation
                className="h-full"
                onScrollCapture={handleConvScroll}
              >
                {/* ScrollArea-style auto-hide: the thumb is transparent at rest and
                only paints while the user is actively scrolling (state below). */}
                <ConversationContent
                  className="gap-6 px-4 pt-6 pb-80"
                  scrollClassName={cn(
                    '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:transition-colors [&::-webkit-scrollbar-track]:bg-transparent',
                    scrolling
                      ? '[&::-webkit-scrollbar-thumb]:bg-border'
                      : '[&::-webkit-scrollbar-thumb]:bg-transparent',
                  )}
                >
                  <Message from="user">
                    <MessageContent>
                      How did Q3 revenue break down by region? Give me a chart
                      plus the underlying table I can drop straight into the
                      board deck.
                    </MessageContent>
                    <MessageToolbar className="mt-1 justify-end opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                      <MessageActions className="ml-auto">
                        <MessageAction tooltip="Copy">
                          <CopyIcon className="size-4" />
                        </MessageAction>
                        <MessageAction tooltip="Edit">
                          <PenSquareIcon className="size-4" />
                        </MessageAction>
                      </MessageActions>
                    </MessageToolbar>
                  </Message>

                  <Message from="assistant">
                    <MessageBranch defaultBranch={0}>
                      <MessageBranchContent>
                        {[
                          <AssistantAnswer key="full" text={ANSWER_FULL} />,
                          <AssistantAnswer
                            key="concise"
                            text={ANSWER_CONCISE}
                          />,
                        ]}
                      </MessageBranchContent>
                      <MessageToolbar>
                        {/* Left: feedback, then copy / regenerate / share. */}
                        <MessageActions>
                          <MessageAction tooltip="Good response">
                            <ThumbsUpIcon className="size-4" />
                          </MessageAction>
                          <MessageAction tooltip="Bad response">
                            <ThumbsDownIcon className="size-4" />
                          </MessageAction>
                          <MessageAction tooltip="Copy">
                            <CopyIcon className="size-4" />
                          </MessageAction>
                          <MessageAction tooltip="Regenerate">
                            <RefreshCwIcon className="size-4" />
                          </MessageAction>
                          <MessageAction tooltip="Share">
                            <Share2Icon className="size-4" />
                          </MessageAction>
                        </MessageActions>
                        {/* Right: Sources sits just before the branch nav. The list
                        opens in a modal in the host app, so the demo trigger is
                        intentionally inert. */}
                        <div className="flex items-center gap-1">
                          <Button
                            className="gap-1.5 text-muted-foreground"
                            size="sm"
                            variant="ghost"
                          >
                            <LibraryIcon className="size-4" /> Sources
                          </Button>
                          <MessageBranchSelector from="assistant">
                            <MessageBranchPrevious />
                            <MessageBranchPage />
                            <MessageBranchNext />
                          </MessageBranchSelector>
                        </div>
                      </MessageToolbar>
                    </MessageBranch>
                  </Message>
                </ConversationContent>
                <ConversationScrollButton />
              </Conversation>
              {/* Top fade: content dissolves into the header as it scrolls up. */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-card to-transparent" />
            </div>

            {/* AssistantComposer - floats over the conversation; the response
                scrolls behind it, fading out through the gradient. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
              <div className="h-8 bg-gradient-to-t from-card to-transparent" />
              <div className="pointer-events-auto space-y-2 bg-card/80 px-3 pb-3 backdrop-blur-sm">
                <Composer onSubmit={handleSubmit} status={status} />
                <p className="text-center text-xs text-muted-foreground">
                  Gremorie can make mistakes. Check important info.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}
