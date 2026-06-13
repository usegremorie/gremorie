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
  MessageAttachment,
  MessageAttachments,
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
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
  Suggestion,
  Suggestions,
  type ChatStatus,
  type PromptInputMentionsItem,
  type PromptInputMessage,
} from '@gremorie/rx-ai';
import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactContent,
  ArtifactDescription,
  ArtifactFeaturedIcon,
  ArtifactHeader,
  ArtifactHeading,
  ArtifactTitle,
} from '@gremorie/rx-artifacts';
import { Button } from '@gremorie/rx-forms';
import { ClaudeIcon, GeminiIcon, OpenAiIcon } from '@gremorie/rx-icons';
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
  DownloadIcon,
  EllipsisIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  GlobeIcon,
  LibraryIcon,
  ListChecksIcon,
  MessageCircleQuestionIcon,
  MessagesSquareIcon,
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

const SAMPLE_IMG =
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop';

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

const ANSWER_FULL = `Here is the board one-pager. **Q3 revenue landed at $4.2M, up 18% QoQ** and 6% ahead of forecast, driven by net expansion in the enterprise tier.

**Headline KPIs**
- ARR: $16.8M (+18% QoQ)
- Net revenue retention: 114%
- Gross margin: 78%

**Watch item:** enterprise pipeline coverage for Q4 sits at 2.9x, below the 3.2x target. The full one-pager is attached below.`;

const ANSWER_CONCISE = `**Q3 revenue: $4.2M, +18% QoQ**, 6% ahead of forecast. ARR $16.8M, NRR 114%, gross margin 78%. One risk: Q4 enterprise pipeline coverage at 2.9x vs 3.2x target. One-pager attached below.`;

const ONE_PAGER_PREVIEW = `**Q3 closed at $4.2M, up 18% QoQ** and 6% ahead of forecast.

| Metric | Q3 | QoQ |
| --- | --- | --- |
| Revenue | $4.2M | +18% |
| ARR | $16.8M | +18% |
| NRR | 114% | +3pp |`;

const ASSISTANT_SOURCES = [
  { href: 'https://gremorie.com', title: 'Finance warehouse — Q3 close' },
  { href: 'https://gremorie.com', title: 'Q2 board deck' },
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
      {/* Generated artifact, inline in the conversation */}
      <Artifact className="mt-1">
        <ArtifactHeader>
          <ArtifactFeaturedIcon icon={FileTextIcon} />
          <ArtifactHeading>
            <ArtifactTitle>Q3 one-pager</ArtifactTitle>
            <ArtifactDescription>
              Document · generated just now
            </ArtifactDescription>
          </ArtifactHeading>
          <ArtifactActions>
            <ArtifactAction icon={CopyIcon} tooltip="Copy" />
            <ArtifactAction icon={DownloadIcon} tooltip="Download" />
          </ArtifactActions>
        </ArtifactHeader>
        <ArtifactContent>
          <MessageResponse className="text-sm">
            {ONE_PAGER_PREVIEW}
          </MessageResponse>
        </ArtifactContent>
      </Artifact>
      <Sources>
        <SourcesTrigger count={ASSISTANT_SOURCES.length} />
        <SourcesContent>
          {ASSISTANT_SOURCES.map((s) => (
            <Source href={s.href} key={s.title} title={s.title} />
          ))}
        </SourcesContent>
      </Sources>
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
export function Assistant() {
  const [status, setStatus] = useState<ChatStatus>('ready');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text.trim() || status !== 'ready') return;
    setStatus('submitted');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setStatus('streaming');
      timer.current = setTimeout(() => setStatus('ready'), 900);
    }, 600);
  };

  return (
    <TooltipProvider>
      <div className="mx-auto flex h-[680px] w-full max-w-3xl flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
        {/* AssistantHeader */}
        <header className="flex items-center justify-between gap-2 border-b px-3 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2 font-medium" size="sm" variant="ghost">
                <MessagesSquareIcon className="size-4 text-muted-foreground" />
                <span className="max-w-[14rem] truncate">Q3 board review</span>
                <ChevronDownIcon className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel>Recent chats</DropdownMenuLabel>
              {THREADS.map((thread) => (
                <DropdownMenuItem key={thread}>{thread}</DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
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
                <DropdownMenuItem className="text-destructive">
                  <Trash2Icon className="mr-2 size-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* AssistantContent - the conversation */}
        <Conversation className="flex-1">
          <ConversationContent className="gap-6 px-4 py-6">
            <Message from="user">
              <MessageAttachments>
                <MessageAttachment
                  data={{
                    type: 'file',
                    url: SAMPLE_IMG,
                    mediaType: 'image/jpeg',
                    filename: 'q3-revenue.jpg',
                  }}
                />
              </MessageAttachments>
              <MessageContent>
                Summarize our Q3 revenue and draft a one-pager I can share with
                the board.
              </MessageContent>
            </Message>

            <Message from="assistant">
              <MessageBranch defaultBranch={0}>
                <MessageBranchContent>
                  {[
                    <AssistantAnswer key="full" text={ANSWER_FULL} />,
                    <AssistantAnswer key="concise" text={ANSWER_CONCISE} />,
                  ]}
                </MessageBranchContent>
                <MessageToolbar>
                  <MessageActions>
                    <MessageAction tooltip="Copy">
                      <CopyIcon className="size-4" />
                    </MessageAction>
                    <MessageAction tooltip="Regenerate">
                      <RefreshCwIcon className="size-4" />
                    </MessageAction>
                    <MessageAction tooltip="Good response">
                      <ThumbsUpIcon className="size-4" />
                    </MessageAction>
                    <MessageAction tooltip="Bad response">
                      <ThumbsDownIcon className="size-4" />
                    </MessageAction>
                    <MessageAction tooltip="Share">
                      <Share2Icon className="size-4" />
                    </MessageAction>
                  </MessageActions>
                  <MessageBranchSelector from="assistant">
                    <MessageBranchPrevious />
                    <MessageBranchPage />
                    <MessageBranchNext />
                  </MessageBranchSelector>
                </MessageToolbar>
              </MessageBranch>
            </Message>
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* AssistantComposer (floating) + AssistantDisclaimer */}
        <div className="space-y-2 border-t bg-background px-3 pt-3 pb-2">
          <Suggestions>
            <Suggestion suggestion="Add a revenue chart" />
            <Suggestion suggestion="Make it more concise" />
            <Suggestion suggestion="Translate to Portuguese" />
            <Suggestion suggestion="Draft the email to the board" />
          </Suggestions>
          <Composer onSubmit={handleSubmit} status={status} />
          <p className="text-center text-xs text-muted-foreground">
            Gremorie can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
}
