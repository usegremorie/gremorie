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
  PromptInput,
  PromptInputAttachButton,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputMentions,
  type PromptInputMentionsItem,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSpeechButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@gremorie/rx-ai';
import { ClaudeIcon, GeminiIcon, OpenAiIcon } from '@gremorie/rx-icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '@gremorie/rx-overlays';
import {
  ArrowUpIcon,
  BookOpenIcon,
  ChartColumnBigIcon,
  DatabaseIcon,
  FileSpreadsheetIcon,
  GitBranchIcon,
  GlobeIcon,
  LayersIcon,
  ListChecksIcon,
  MessageCircleQuestionIcon,
  NotebookTextIcon,
  TelescopeIcon,
} from 'lucide-react';

import type { LanguageModelUsage } from 'ai';

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

// Example context catalogue for the "@ Add context" command palette.
const CONTEXT_ITEMS: PromptInputMentionsItem[] = [
  {
    id: 'q3-revenue',
    label: 'Q3 revenue.csv',
    group: 'Recent',
    icon: <FileSpreadsheetIcon />,
  },
  {
    id: 'brand',
    label: 'Brand guidelines',
    group: 'Recent',
    icon: <BookOpenIcon />,
  },
  {
    id: 'onboarding-prd',
    label: 'Onboarding PRD',
    group: 'Recent',
    icon: <NotebookTextIcon />,
  },
  {
    id: 'notion-roadmap',
    label: 'Notion: Roadmap',
    group: 'Workspace',
    icon: <DatabaseIcon />,
  },
  {
    id: 'linear-sprint',
    label: 'Linear: Sprint 24',
    group: 'Workspace',
    icon: <LayersIcon />,
  },
  {
    id: 'github-app',
    label: 'GitHub: gremorie/app',
    group: 'Workspace',
    icon: <GitBranchIcon />,
  },
];

// Per-category token usage powering the context hovercard breakdown + cost.
const USAGE: LanguageModelUsage = {
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

// Outlined trigger to match the Button "outline" variant. The default
// PromptInputSelectTrigger is borderless/ghost, so re-add the border and keep
// the fill transparent so the control sits flush on the card surface.
const OUTLINE_TRIGGER =
  'border border-input border-solid bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent';

export function PromptInputB2BPreview() {
  return (
    <PromptInput
      className="mx-auto max-w-2xl"
      globalDrop
      multiple
      onSubmit={() => {
        // demo: wire onSubmit to the AI SDK to make this real
      }}
    >
      <PromptInputHeader>
        <PromptInputMentions items={CONTEXT_ITEMS} />
        <Context
          maxTokens={200_000}
          modelId="anthropic:claude-3-5-sonnet"
          usage={USAGE}
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
        <PromptInputTextarea placeholder="What would you like to know?" />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools className="gap-2">
          <PromptInputSelect defaultValue="research">
            <Tooltip>
              <TooltipTrigger asChild>
                <PromptInputSelectTrigger
                  aria-label="Select mode"
                  className={OUTLINE_TRIGGER}
                  size="sm"
                >
                  <PromptInputSelectValue placeholder="Mode" />
                </PromptInputSelectTrigger>
              </TooltipTrigger>
              <TooltipContent>Response mode</TooltipContent>
            </Tooltip>
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
            <Tooltip>
              <TooltipTrigger asChild>
                <PromptInputSelectTrigger
                  aria-label="Select model"
                  className={OUTLINE_TRIGGER}
                  size="sm"
                >
                  <PromptInputSelectValue placeholder="Model" />
                </PromptInputSelectTrigger>
              </TooltipTrigger>
              <TooltipContent>Model</TooltipContent>
            </Tooltip>
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
          <PromptInputSubmit status="ready" tooltip="Send">
            <ArrowUpIcon className="size-4" />
          </PromptInputSubmit>
        </PromptInputTools>
      </PromptInputFooter>
    </PromptInput>
  );
}
