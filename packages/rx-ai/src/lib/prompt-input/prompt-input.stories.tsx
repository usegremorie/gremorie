import type { Meta, StoryObj } from '@storybook/react';
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
  MicIcon,
  NotebookTextIcon,
  TelescopeIcon,
} from 'lucide-react';

import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
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
  type ChatStatus,
} from './prompt-input';
import {
  PromptInputContext,
  type PromptInputContextItem,
} from './prompt-input-context';
import { Context, ContextTrigger } from '../context';
import { Tooltip, TooltipContent, TooltipTrigger } from '@gremorie/rx-overlays';

type ModelOption = {
  id: string;
  label: string;
  disabled?: boolean;
};

const MODELS: readonly ModelOption[] = [
  { id: 'claude-opus-4-7', label: 'Claude Opus 4.7' },
  { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
  { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5' },
  { id: 'gpt-5', label: 'GPT-5', disabled: true },
];

/**
 * The full composed PromptInput, used as the story component so the `status`
 * control is a real prop. Mirrors the official AI Elements composed example.
 */
const IntegratedPromptInput = ({ status }: { status: ChatStatus }) => (
  <PromptInput
    className="max-w-xl"
    globalDrop
    multiple
    onSubmit={() => {
      /* noop demo, wire onSubmit to the AI SDK to make this real */
    }}
  >
    <PromptInputBody>
      <PromptInputAttachments>
        {(attachment) => <PromptInputAttachment data={attachment} />}
      </PromptInputAttachments>
      <PromptInputTextarea placeholder="Ask anything..." />
    </PromptInputBody>
    <PromptInputFooter>
      <PromptInputTools>
        <PromptInputActionMenu>
          <PromptInputActionMenuTrigger aria-label="More actions" />
          <PromptInputActionMenuContent>
            <PromptInputActionAddAttachments />
            <PromptInputActionMenuItem>
              <MicIcon className="mr-2 size-4" /> Record voice
            </PromptInputActionMenuItem>
          </PromptInputActionMenuContent>
        </PromptInputActionMenu>
        <PromptInputButton aria-label="Search the web">
          <GlobeIcon className="size-4" />
          <span>Search</span>
        </PromptInputButton>
        <PromptInputSelect defaultValue="claude-sonnet-4-6">
          <PromptInputSelectTrigger>
            <PromptInputSelectValue placeholder="Select model" />
          </PromptInputSelectTrigger>
          <PromptInputSelectContent>
            {MODELS.map((model) => (
              <PromptInputSelectItem
                disabled={model.disabled}
                key={model.id}
                value={model.id}
              >
                {model.label}
              </PromptInputSelectItem>
            ))}
          </PromptInputSelectContent>
        </PromptInputSelect>
      </PromptInputTools>
      <PromptInputSubmit status={status} />
    </PromptInputFooter>
  </PromptInput>
);

/**
 * PromptInput is the full container for AI prompt entry (React edition),
 * faithful to the official AI Elements PromptInput. It owns the form, the
 * keyboard shortcuts, and attachment validation, and composes from Gremorie
 * primitives (InputGroup, Button, Select from rx-forms; DropdownMenu, HoverCard,
 * Command from rx-overlays).
 *
 * This single integrated story composes the real surface: an attachments row,
 * the textarea, a tools row with an action menu (add photos or files), a web
 * search toggle and a model select, plus the submit button. Drive the `status`
 * control to walk the canonical states ready, submitted, streaming and error.
 */
const meta = {
  title: 'AI/Chatbot/PromptInput',
  component: IntegratedPromptInput,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    status: {
      control: 'select',
      options: ['ready', 'submitted', 'streaming', 'error'],
      description: 'Request lifecycle state surfaced by the submit button.',
    },
  },
  args: {
    status: 'ready',
  },
} satisfies Meta<typeof IntegratedPromptInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Playground - the full composed PromptInput. Use the `status` control to walk
 * ready, submitted, streaming and error.
 */
export const Playground: Story = {};

/** Ready - idle, the submit button shows the enter affordance. */
export const Ready: Story = {
  args: { status: 'ready' },
  parameters: { controls: { disable: true } },
};

/** Submitted - the request was sent, the submit button shows a spinner. */
export const Submitted: Story = {
  args: { status: 'submitted' },
  parameters: { controls: { disable: true } },
};

/** Streaming - the response is streaming, the submit button shows stop. */
export const Streaming: Story = {
  args: { status: 'streaming' },
  parameters: { controls: { disable: true } },
};

/** Error - the request failed, the submit button shows the error affordance. */
export const Error: Story = {
  args: { status: 'error' },
  parameters: { controls: { disable: true } },
};

// ============================================================================
// B2B (Gremorie standard) - a business-oriented composition
// ============================================================================

const B2B_MODES = [
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

const B2B_MODELS = [
  { id: 'claude-opus-4-8', label: 'Claude Opus 4.8' },
  { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
  { id: 'gpt-5', label: 'GPT-5' },
  { id: 'gemini-2-5-pro', label: 'Gemini 2.5 Pro' },
];

// Example context catalogue for the "@ Add context" command palette.
const B2B_CONTEXT: PromptInputContextItem[] = [
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

// A tiny inline PNG so the image attachment chip renders a real thumbnail.
const SAMPLE_IMG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAKklEQVR4nGNITvtIU8QwasGoBaMWjFowasGoBaMWjFowasGoBaMWDBULAMgi6FsP9QbPAAAAAElFTkSuQmCC';

// Outlined trigger to match the Button "outline" variant - the default
// PromptInputSelectTrigger is borderless/ghost, so re-add the border. The fill
// stays transparent so the control sits flush on the card surface (--card,
// white) instead of showing --background (#fafafa), which reads as a faint grey
// pill on the white card.
const OUTLINE_TRIGGER =
  'border border-input border-solid bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent';

const B2BPromptInput = ({
  withAttachments,
  selectedContext,
}: {
  withAttachments?: boolean;
  selectedContext?: string[];
}) => (
  <PromptInput
    className="mx-auto max-w-2xl"
    globalDrop
    multiple
    onSubmit={() => undefined}
  >
    <PromptInputHeader>
      <PromptInputContext items={B2B_CONTEXT} defaultValue={selectedContext} />
      <Context maxTokens={200000} usedTokens={62600}>
        <ContextTrigger className="ml-auto" />
      </Context>
    </PromptInputHeader>
    <PromptInputBody>
      {withAttachments ? (
        <div className="flex w-full flex-wrap gap-1.5 px-3">
          <PromptInputAttachment
            data={{
              id: 'img',
              url: SAMPLE_IMG,
              mediaType: 'image/png',
              filename: 'dashboard.png',
            }}
          />
          <PromptInputAttachment
            data={{
              id: 'json',
              url: '',
              mediaType: 'application/json',
              filename: 'analytics.json',
            }}
          />
          <PromptInputAttachment
            data={{
              id: 'pdf',
              url: '',
              mediaType: 'application/pdf',
              filename: 'q3-report.pdf',
            }}
          />
        </div>
      ) : null}
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
            {B2B_MODES.map((mode) => (
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
            {B2B_MODELS.map((model) => (
              <PromptInputSelectItem key={model.id} value={model.id}>
                {model.label}
              </PromptInputSelectItem>
            ))}
          </PromptInputSelectContent>
        </PromptInputSelect>
      </PromptInputTools>
      <PromptInputTools>
        <PromptInputButton aria-label="Search the web" tooltip="Search the web">
          <GlobeIcon className="size-4" />
        </PromptInputButton>
        <PromptInputActionMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <PromptInputActionMenuTrigger aria-label="Add attachment" />
            </TooltipTrigger>
            <TooltipContent>Attach files</TooltipContent>
          </Tooltip>
          <PromptInputActionMenuContent>
            <PromptInputActionAddAttachments />
            <PromptInputActionMenuItem>
              <MicIcon className="mr-2 size-4" /> Record voice
            </PromptInputActionMenuItem>
          </PromptInputActionMenuContent>
        </PromptInputActionMenu>
        <PromptInputSpeechButton tooltip="Voice input" />
        <PromptInputSubmit status="ready" tooltip="Send">
          <ArrowUpIcon className="size-4" />
        </PromptInputSubmit>
      </PromptInputTools>
    </PromptInputFooter>
  </PromptInput>
);

/**
 * B2B (Gremorie standard) - the business-oriented composition: an @-context
 * command palette and a context-window gauge in the header, a Mode selector
 * (Ask / Analyze / Research / Plan) and a Model selector in the tools row, plus
 * web, attachment and voice actions. Every action carries a tooltip.
 */
export const B2B: Story = {
  parameters: { controls: { disable: true } },
  render: () => <B2BPromptInput />,
};

/**
 * B2B with attachments - the same business surface seeded with example
 * attachment chips (an image plus files) alongside the context gauge.
 */
export const B2BWithAttachments: Story = {
  name: 'B2B with attachments',
  parameters: { controls: { disable: true } },
  render: () => <B2BPromptInput withAttachments />,
};

/**
 * B2B filled - the fully populated surface: selected context (the trigger
 * collapses to an icon-only "@" button with removable chips), attachment chips,
 * the context gauge, plus Mode and Model selectors. One screen with everything
 * active.
 */
export const B2BFilled: Story = {
  name: 'B2B filled',
  parameters: { controls: { disable: true } },
  render: () => (
    <B2BPromptInput
      selectedContext={['q3-revenue', 'notion-roadmap']}
      withAttachments
    />
  ),
};
