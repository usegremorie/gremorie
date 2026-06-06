'use client';

import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  Message,
  MessageContent,
  MessageResponse,
  Plan,
  PlanContent,
  PlanDescription,
  PlanHeader,
  PlanTitle,
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
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
  Shimmer,
  Sources,
  SourcesContent,
  SourcesTrigger,
  Source,
  Suggestion,
  Suggestions,
  Task,
  TaskContent,
  TaskItem,
  TaskItemFile,
  TaskTrigger,
} from '@gremorie/rx-ai';
import {
  CheckCircle2,
  FileSearch,
  GlobeIcon,
  MessageCircleQuestion,
  MicIcon,
  Search,
} from 'lucide-react';

// ---------- PromptInput ----------

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
        /* demo: wire onSubmit to the AI SDK to make this real */
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

// ---------- Shimmer ----------

export function ShimmerPreview() {
  return <Shimmer>Buscando referencias nos docs...</Shimmer>;
}

// ---------- Suggestion ----------

const SUGGESTIONS = [
  'Explain the registry architecture',
  'Show me a Plan example',
  'How do I add a new primitive?',
  'What is the MCP server for?',
  'Compare Angular and React editions',
];

export function SuggestionPreview() {
  return (
    <Suggestions>
      {SUGGESTIONS.map((s) => (
        <Suggestion key={s} suggestion={s} onClick={() => undefined} />
      ))}
    </Suggestions>
  );
}

// ---------- Conversation ----------

export function ConversationPreview() {
  return (
    <div className="h-[320px] rounded-lg border">
      <Conversation>
        <ConversationContent>
          <Message from="user">
            <MessageContent>What is Gremorie?</MessageContent>
          </Message>
          <Message from="assistant">
            <MessageContent>
              <MessageResponse>
                Gremorie is an AI-native design system: registry + MCP first,
                React and Angular bindings second.
              </MessageResponse>
            </MessageContent>
          </Message>
          <Message from="user">
            <MessageContent>How do I install a primitive?</MessageContent>
          </Message>
          <Message from="assistant">
            <MessageContent>
              <MessageResponse>
                Use `npx gremorie add rx-message`. The registry resolves
                dependencies and writes source files into your project.
              </MessageResponse>
            </MessageContent>
          </Message>
        </ConversationContent>
      </Conversation>
    </div>
  );
}

export function ConversationEmptyPreview() {
  return (
    <div className="h-[240px] rounded-lg border">
      <Conversation>
        <ConversationContent>
          <ConversationEmptyState
            icon={<MessageCircleQuestion className="size-8" />}
            title="Start a conversation"
            description="Ask anything about Gremorie primitives, tokens, or the registry."
          />
        </ConversationContent>
      </Conversation>
    </div>
  );
}

// ---------- Reasoning ----------

const REASONING_TEXT = `The user wants to add a registry item. I need to:

1. Confirm the package the primitive lives in.
2. Check registry.json for the existing schema.
3. Add the item with registryDependencies pointing at its peers.`;

export function ReasoningPreview() {
  return (
    <Reasoning isStreaming={false} defaultOpen>
      <ReasoningTrigger />
      <ReasoningContent>{REASONING_TEXT}</ReasoningContent>
    </Reasoning>
  );
}

export function ReasoningStreamingPreview() {
  return (
    <Reasoning isStreaming defaultOpen>
      <ReasoningTrigger />
      <ReasoningContent>
        Considering whether to recommend rx-tool or rx-task for this case...
      </ReasoningContent>
    </Reasoning>
  );
}

export function ReasoningExpandedPreview() {
  return (
    <Reasoning isStreaming={false} defaultOpen>
      <ReasoningTrigger />
      <ReasoningContent>{REASONING_TEXT}</ReasoningContent>
    </Reasoning>
  );
}

// ---------- Plan ----------

export function PlanCollapsedPreview() {
  return (
    <Plan defaultOpen={false}>
      <PlanHeader>
        <PlanTitle>Generate landing page</PlanTitle>
        <PlanDescription>3 steps - 12s estimated</PlanDescription>
      </PlanHeader>
      <PlanContent>
        Hero, features, CTA section composed from rx-display and rx-forms.
      </PlanContent>
    </Plan>
  );
}

export function PlanExpandedPreview() {
  return (
    <Plan defaultOpen>
      <PlanHeader>
        <PlanTitle>Generate landing page</PlanTitle>
        <PlanDescription>3 steps - 12s estimated</PlanDescription>
      </PlanHeader>
      <PlanContent>
        Hero, features, CTA section composed from rx-display and rx-forms.
      </PlanContent>
    </Plan>
  );
}

export function PlanStreamingPreview() {
  return (
    <Plan defaultOpen isStreaming>
      <PlanHeader>
        <PlanTitle>Composing the layout</PlanTitle>
        <PlanDescription>Streaming response from the model...</PlanDescription>
      </PlanHeader>
      <PlanContent>
        Resolving primitives required for this composition.
      </PlanContent>
    </Plan>
  );
}

// ---------- ChainOfThought ----------

export function ChainOfThoughtPreview() {
  return (
    <ChainOfThought defaultOpen>
      <ChainOfThoughtHeader>Researching the answer</ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        <ChainOfThoughtStep
          icon={Search}
          label="Searching docs"
          status="complete"
        />
        <ChainOfThoughtStep
          icon={FileSearch}
          label="Reading 3 registry entries"
          status="complete"
        />
        <ChainOfThoughtStep
          icon={CheckCircle2}
          label="Drafting response"
          status="active"
        />
      </ChainOfThoughtContent>
    </ChainOfThought>
  );
}

export function ChainOfThoughtSearchPreview() {
  return (
    <ChainOfThought defaultOpen>
      <ChainOfThoughtHeader>Searching the registry</ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        <ChainOfThoughtStep
          icon={Search}
          label="Querying for 'rx-tool'"
          status="complete"
        />
        <ChainOfThoughtStep
          icon={FileSearch}
          label="Found 4 candidate entries"
          status="complete"
        />
      </ChainOfThoughtContent>
    </ChainOfThought>
  );
}

// ---------- Task ----------

export function TaskCollapsedPreview() {
  return (
    <Task defaultOpen={false}>
      <TaskTrigger title="Generate component scaffold" />
      <TaskContent>
        <TaskItem>Reading registry.json...</TaskItem>
        <TaskItem>
          Wrote <TaskItemFile>src/lib/my-component.tsx</TaskItemFile>
        </TaskItem>
        <TaskItem>
          Wrote <TaskItemFile>src/lib/my-component/index.ts</TaskItemFile>
        </TaskItem>
      </TaskContent>
    </Task>
  );
}

export function TaskExpandedPreview() {
  return (
    <Task defaultOpen>
      <TaskTrigger title="Generate component scaffold" />
      <TaskContent>
        <TaskItem>Reading registry.json...</TaskItem>
        <TaskItem>
          Wrote <TaskItemFile>src/lib/my-component.tsx</TaskItemFile>
        </TaskItem>
        <TaskItem>
          Wrote <TaskItemFile>src/lib/my-component/index.ts</TaskItemFile>
        </TaskItem>
        <TaskItem>Updating package exports...</TaskItem>
      </TaskContent>
    </Task>
  );
}

// ---------- Sources ----------

export function SourcesPreview() {
  return (
    <Sources>
      <SourcesTrigger count={3} />
      <SourcesContent>
        <Source href="#" title="Registry README">
          Registry README
        </Source>
        <Source href="#" title="Migration guide">
          Migration guide
        </Source>
        <Source href="#" title="Phase 5 release notes">
          Phase 5 release notes
        </Source>
      </SourcesContent>
    </Sources>
  );
}
