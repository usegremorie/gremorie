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
  PromptInputToolsExpanded,
  PromptInputToolsCollapsed,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuSwitchItem,
  PromptInputActionMenuContent,
  PromptInputActionMenu,
  PromptInputActionAddAttachments,
  PromptInputTextarea,
  PromptInputTools,
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
  type ChatStatus,
  type PromptInputMentionsItem,
  type PromptInputMessage,
  type PromptInputToolsCollapse,
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/rx-overlays';
import {
  ArchiveIcon,
  ArrowUpIcon,
  ChartColumnBigIcon,
  ChevronDownIcon,
  CopyIcon,
  CornerDownLeftIcon,
  EllipsisIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  GlobeIcon,
  LibraryIcon,
  ListChecksIcon,
  MessageCircleQuestionIcon,
  MessageCirclePlusIcon,
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

// ── Compact mode ──────────────────────────────────────────────────────────
// The Assistant is a size container (@container/assistant). Below 36rem of
// its OWN width (a card, a sidebar, a phone) it switches to compact: actions
// with a label become 32px icon buttons (the label stays for screen readers),
// select triggers show only their icon, and the new-chat composer docks to
// the bottom. Same classes in the Angular edition.
const COMPACT_ICON_BUTTON =
  '@max-xl/assistant:size-8 @max-xl/assistant:gap-0 @max-xl/assistant:p-0';
const COMPACT_LABEL = '@max-xl/assistant:sr-only';
const COMPACT_SELECT_TRIGGER =
  '@max-xl/assistant:size-8 @max-xl/assistant:justify-center @max-xl/assistant:px-0 @max-xl/assistant:[&_[data-slot=select-value-label]]:sr-only @max-xl/assistant:[&>svg:last-child]:hidden';

// ── Composer (the floating B2B PromptInput) ─────────────────────────────────
function Composer({
  status,
  onSubmit,
  placeholder = 'Ask anything, or pick a mode...',
  defaultMode = 'research',
  defaultModel = 'claude-sonnet-4-6',
  modeSelect = true,
  modelSelect = true,
  mentions = true,
  contextMeter = true,
  newChat = false,
  toolsCollapse = 'auto',
}: {
  status: ChatStatus;
  onSubmit: (message: PromptInputMessage) => void;
  /** Textarea placeholder. */
  placeholder?: string;
  /** Initially-selected composer mode (one of MODES' ids). */
  defaultMode?: string;
  /** Initially-selected model (one of MODELS' ids). */
  defaultModel?: string;
  /** Show the mode select in the footer. */
  modeSelect?: boolean;
  /** Show the model select in the footer. */
  modelSelect?: boolean;
  /** Show the @-mention trigger in the header. */
  mentions?: boolean;
  /** Show the context-window meter in the header. */
  contextMeter?: boolean;
  /**
   * New-chat composer: the send button reads "Chat" with the enter icon
   * (compact keeps the icon-only arrow). The conversation keeps the arrow.
   */
  newChat?: boolean;
  /** Tools inline, in the overflow menu, or switching by width (`auto`). */
  toolsCollapse?: PromptInputToolsCollapse;
}) {
  const [webSearch, setWebSearch] = useState(false);
  // The header exists only to carry the mentions trigger and the context
  // meter. With both off it would render as an empty strip above the
  // textarea, so it is dropped entirely rather than left hollow.
  // The context meter sits in the header beside the mentions trigger; with
  // mentions off it moves beside the textarea, so no row holds it alone.
  const showHeader = mentions;
  const meterInHeader = mentions && contextMeter;
  const meterInBody = !mentions && contextMeter;
  const contextMeterEl = (
    <Context
      maxTokens={200_000}
      modelId="anthropic:claude-3-5-sonnet"
      usage={CONTEXT_USAGE}
      usedTokens={62_600}
    >
      <ContextTrigger className={meterInHeader ? 'ml-auto' : undefined} />
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
  );
  return (
    <PromptInput multiple onSubmit={onSubmit}>
      {showHeader && (
        <PromptInputHeader>
          {mentions && (
            <PromptInputMentions items={CONTEXT_ITEMS} variant="secondary" />
          )}
          {meterInHeader && contextMeterEl}
        </PromptInputHeader>
      )}
      <PromptInputBody>
        {meterInBody ? (
          <div className="flex w-full items-start">
            <PromptInputTextarea className="flex-1" placeholder={placeholder} />
            <div className="shrink-0 pt-1.5 pr-3">{contextMeterEl}</div>
          </div>
        ) : (
          <PromptInputTextarea placeholder={placeholder} />
        )}
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools className="gap-2">
          {modeSelect && (
            <PromptInputSelect defaultValue={defaultMode}>
              <PromptInputSelectTrigger
                aria-label="Select mode"
                className={COMPACT_SELECT_TRIGGER}
                variant="secondary"
                size="sm"
              >
                <PromptInputSelectValue placeholder="Mode" />
              </PromptInputSelectTrigger>
              <PromptInputSelectContent>
                {MODES.map((mode) => (
                  <PromptInputSelectItem key={mode.id} value={mode.id}>
                    {mode.icon}
                    <span data-slot="select-value-label">{mode.label}</span>
                  </PromptInputSelectItem>
                ))}
              </PromptInputSelectContent>
            </PromptInputSelect>
          )}
          {modelSelect && (
            <PromptInputSelect defaultValue={defaultModel}>
              <PromptInputSelectTrigger
                aria-label="Select model"
                className={COMPACT_SELECT_TRIGGER}
                variant="secondary"
                size="sm"
              >
                <PromptInputSelectValue placeholder="Model" />
              </PromptInputSelectTrigger>
              <PromptInputSelectContent>
                {MODELS.map((model) => (
                  <PromptInputSelectItem key={model.id} value={model.id}>
                    {model.icon}
                    <span data-slot="select-value-label">{model.label}</span>
                  </PromptInputSelectItem>
                ))}
              </PromptInputSelectContent>
            </PromptInputSelect>
          )}
        </PromptInputTools>
        <PromptInputTools className="gap-2">
          {/* Ghost icon group: no gap between the icons; the outer gap-2
              separates the group from the send button. */}
          <PromptInputTools className="gap-0" collapse={toolsCollapse}>
            <PromptInputToolsExpanded>
              <PromptInputButton
                active={webSearch}
                aria-label="Search the web"
                onClick={() => setWebSearch((on) => !on)}
                tooltip="Search the web"
              >
                <GlobeIcon className="size-4" />
              </PromptInputButton>
              <PromptInputAttachButton tooltip="Attach files" />
            </PromptInputToolsExpanded>
            {/* Collapsed: web search and attachments move to the overflow
                menu; the mic, an input mode, stays at hand. */}
            <PromptInputToolsCollapsed>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger
                  aria-label="More tools"
                  tooltip="More tools"
                >
                  <EllipsisIcon className="size-4" />
                </PromptInputActionMenuTrigger>
                <PromptInputActionMenuContent>
                  <PromptInputActionMenuSwitchItem
                    checked={webSearch}
                    onCheckedChange={setWebSearch}
                  >
                    <GlobeIcon className="size-4" />
                    Search the web
                  </PromptInputActionMenuSwitchItem>
                  <PromptInputActionAddAttachments label="Attach files" />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
            </PromptInputToolsCollapsed>
            <PromptInputSpeechButton tooltip="Voice input" />
          </PromptInputTools>
          {newChat ? (
            <PromptInputSubmit
              aria-label="Chat"
              tooltip="Chat"
              className={cn(
                'gap-2 pr-2.5 pl-3 has-[>svg]:pr-2.5 has-[>svg]:pl-3 @max-xl/assistant:px-0!',
                COMPACT_ICON_BUTTON,
              )}
              size="sm"
              status={status}
            >
              <span className="@max-xl/assistant:hidden">Chat</span>
              <CornerDownLeftIcon className="size-4 @max-xl/assistant:hidden" />
              <ArrowUpIcon className="hidden size-4 @max-xl/assistant:block" />
            </PromptInputSubmit>
          ) : (
            <PromptInputSubmit status={status} tooltip="Send">
              <ArrowUpIcon className="size-4" />
            </PromptInputSubmit>
          )}
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

/**
 * The block's prop surface. Named and exported on purpose: the contract
 * drift gate introspects this interface by name, so an inline object type
 * would leave the block outside the gate - which is exactly how `onSubmit`
 * went missing here while the Angular edition had it.
 */
export interface AssistantProps {
  /** Start in a live conversation (`filled`) or the empty new-chat state. */
  initialView?: AssistantView;
  /** Composer textarea placeholder. */
  placeholder?: string;
  /** Initially-selected composer mode (Ask / Analyze / Research / Plan id). */
  defaultMode?: string;
  /** Initially-selected model (one of the MODELS ids). */
  defaultModel?: string;
  /** Show the mode select in the composer footer. */
  modeSelect?: boolean;
  /** Show the model select in the composer footer. */
  modelSelect?: boolean;
  /** Show the @-mention trigger in the composer header. */
  mentions?: boolean;
  /** Show the context-window meter in the composer header. */
  contextMeter?: boolean;
  /**
   * Composer tools: `auto` (default) shows them inline and moves web search
   * and attachments to an overflow menu when the composer is narrow;
   * `never` keeps them inline; `always` keeps the menu.
   */
  toolsCollapse?: PromptInputToolsCollapse;
  /**
   * Fires with the composed prompt when the user submits. Wire it to your AI
   * SDK; the canned state machine keeps running underneath so the surface
   * still animates while you build the real thing.
   */
  onSubmit?: (message: PromptInputMessage) => void;
}

export function Assistant({
  initialView = 'filled',
  placeholder,
  defaultMode,
  defaultModel,
  modeSelect = true,
  modelSelect = true,
  mentions = true,
  contextMeter = true,
  toolsCollapse = 'auto',
  onSubmit,
}: AssistantProps = {}) {
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
    // Hand the prompt to the consumer first, then run the canned states. The
    // Angular edition emits `submitted` at the same point; this is the React
    // side of that contract.
    onSubmit?.(message);
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
      <div className="@container/assistant relative mx-auto flex h-[680px] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-card text-card-foreground shadow-md ring-1 ring-foreground/10">
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
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Recent chats
              </DropdownMenuLabel>
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
                <MessageCirclePlusIcon className="size-4" /> New chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Header actions: ghost icon buttons, no gap between them. */}
          <div className="flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button aria-label="Sources" size="icon-sm" variant="ghost">
                  <LibraryIcon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sources</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button aria-label="Share" size="icon-sm" variant="ghost">
                  <Share2Icon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share</TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      aria-label="More actions"
                      size="icon-sm"
                      variant="ghost"
                    >
                      <EllipsisIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>More actions</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <ArchiveIcon className="size-4" /> Archive
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CopyIcon className="size-4" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <Trash2Icon className="size-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {view === 'empty' ? (
          // AssistantStart - the new-chat state: a centered welcome, the
          // composer, and quick-start chips (the Claude home pattern).
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 @max-xl/assistant:justify-end @max-xl/assistant:px-3 @max-xl/assistant:pb-3">
            <h2 className="text-center font-semibold text-2xl @max-xl/assistant:flex @max-xl/assistant:flex-1 @max-xl/assistant:items-center">
              How can I help you today?
            </h2>
            <div className="w-full max-w-2xl">
              <Composer
                newChat
                onSubmit={handleSubmit}
                status={status}
                placeholder={placeholder}
                defaultMode={defaultMode}
                defaultModel={defaultModel}
                modeSelect={modeSelect}
                modelSelect={modelSelect}
                mentions={mentions}
                contextMeter={contextMeter}
                toolsCollapse={toolsCollapse}
              />
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
                            className={cn(
                              'gap-1.5 text-muted-foreground',
                              COMPACT_ICON_BUTTON,
                            )}
                            size="sm"
                            variant="ghost"
                          >
                            <LibraryIcon className="size-4" />
                            <span className={COMPACT_LABEL}>Sources</span>
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
                <Composer
                  onSubmit={handleSubmit}
                  status={status}
                  placeholder={placeholder}
                  defaultMode={defaultMode}
                  defaultModel={defaultModel}
                  modeSelect={modeSelect}
                  modelSelect={modelSelect}
                  mentions={mentions}
                  contextMeter={contextMeter}
                  toolsCollapse={toolsCollapse}
                />
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
