import type { Meta, StoryObj } from '@storybook/react';
import { GlobeIcon, MicIcon } from 'lucide-react';

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
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type ChatStatus,
} from './prompt-input';

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
