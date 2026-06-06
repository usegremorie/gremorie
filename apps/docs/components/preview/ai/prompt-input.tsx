'use client';

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
} from '@gremorie/rx-ai';
import { GlobeIcon, MicIcon } from 'lucide-react';

const MODELS: { id: string; label: string; disabled?: boolean }[] = [
  { id: 'claude-opus-4-7', label: 'Claude Opus 4.7' },
  { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
  { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5' },
  { id: 'gpt-5', label: 'GPT-5', disabled: true },
];

export function PromptInputPreview() {
  return (
    <PromptInput
      className="mx-auto max-w-xl"
      globalDrop
      multiple
      onSubmit={() => {
        // demo: wire onSubmit to the AI SDK to make this real
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
        <PromptInputSubmit status="ready" />
      </PromptInputFooter>
    </PromptInput>
  );
}
