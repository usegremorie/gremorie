'use client';

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
} from '@gremorie/rx-ai';
import { CodeBlock } from '@gremorie/rx-artifacts';
import { cn } from '@gremorie/rx-core';
import { Badge, Card, Separator } from '@gremorie/rx-display';
import { Button, Input, Label, Switch } from '@gremorie/rx-forms';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gremorie/rx-navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/rx-overlays';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useState } from 'react';

/**
 * Landing showcase: a mini, live "playground" for ONE component - the Assistant
 * (the Gremorie chat surface, composed from rx-ai Conversation / Message /
 * Reasoning / PromptInput). Three side-by-side panels, all visible at once:
 *
 *   1. Properties - controls that drive the other two panels in lockstep.
 *   2. Code       - React | Angular tabs showing the real consumer-usage code,
 *                   generated live from the controls, plus install commands.
 *   3. Preview    - the REAL React Assistant rendered (no Storybook iframe),
 *                   with a dark/light toggle that re-themes just the preview.
 *
 * Dogfood: Card, Badge, Separator (rx-display); Tabs (rx-navigation); Input,
 * Label, Switch, Button (rx-forms); Tooltip (rx-overlays); CodeBlock
 * (rx-artifacts); the chat surface itself from rx-ai.
 */
const REASONING_TEXT =
  'Generating a 4-card KPI grid with revenue, orders, AOV, and conversion, then binding the trend line to a Chart artifact.';
const ASSISTANT_TEXT =
  'Here is a dashboard with 4 KPI cards and a 12-month revenue chart, each using semantic color tokens.';

function reactCode(prompt: string, reasoning: boolean): string {
  return `import {
  Conversation, ConversationContent,
  Message, MessageContent,${
    reasoning ? '\n  Reasoning, ReasoningTrigger, ReasoningContent,' : ''
  }
  PromptInput, PromptInputTextarea,
  PromptInputFooter, PromptInputTools, PromptInputSubmit,
} from '@gremorie/rx-ai';

<Conversation>
  <ConversationContent>
    <Message from="user">
      <MessageContent>${prompt}</MessageContent>
    </Message>${
      reasoning
        ? `
    <Reasoning defaultOpen>
      <ReasoningTrigger />
      <ReasoningContent>{reasoning}</ReasoningContent>
    </Reasoning>`
        : ''
    }
    <Message from="assistant">
      <MessageContent>{response}</MessageContent>
    </Message>
  </ConversationContent>
  <PromptInput onSubmit={onSubmit}>
    <PromptInputTextarea placeholder="Ask anything..." />
    <PromptInputFooter>
      <PromptInputTools />
      <PromptInputSubmit status="ready" />
    </PromptInputFooter>
  </PromptInput>
</Conversation>`;
}

function angularCode(prompt: string, reasoning: boolean): string {
  return `<!-- imports: ConversationComponent, MessageComponent,${
    reasoning ? ' ReasoningComponent,' : ''
  } PromptInput* from '@gremorie/ng-ai' -->
<conversation>
  <conversation-content>
    <message from="user">
      <message-content>${prompt}</message-content>
    </message>${
      reasoning
        ? `
    <reasoning [defaultOpen]="true">
      <reasoning-trigger />
      <reasoning-content>{{ reasoning }}</reasoning-content>
    </reasoning>`
        : ''
    }
    <message from="assistant">
      <message-content>{{ response }}</message-content>
    </message>
  </conversation-content>
  <prompt-input (submitted)="onSubmit()">
    <prompt-input-textarea placeholder="Ask anything..." />
    <prompt-input-footer>
      <prompt-input-tools />
      <prompt-input-submit status="ready" />
    </prompt-input-footer>
  </prompt-input>
</conversation>`;
}

export function AssistantShowcase() {
  const [prompt, setPrompt] = useState('Show me a sales dashboard');
  const [reasoning, setReasoning] = useState(true);
  const [previewDark, setPreviewDark] = useState(false);

  return (
    <TooltipProvider>
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">
            Live showcase
          </Badge>
          <h2 className="text-balance font-bold text-2xl text-foreground tracking-tight sm:text-3xl">
            One component, both editions, live
          </h2>
          <p className="mt-2 text-balance text-muted-foreground">
            Tweak the props - the usage code and the rendered component update
            together. This is the Assistant chat surface, the same in React and
            Angular.
          </p>
        </div>

        <Card className="grid gap-0 overflow-hidden p-0 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)_minmax(0,1.1fr)]">
          {/* Panel 1 - Properties */}
          <div className="flex flex-col gap-4 border-b p-5 lg:border-r lg:border-b-0">
            <h3 className="font-semibold text-sm">Properties</h3>
            <div className="space-y-1.5">
              <Label htmlFor="showcase-prompt" className="text-xs">
                User message
              </Label>
              <Input
                id="showcase-prompt"
                className="h-8"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="showcase-reasoning" className="text-xs">
                Show reasoning
              </Label>
              <Switch
                id="showcase-reasoning"
                checked={reasoning}
                onCheckedChange={setReasoning}
              />
            </div>
            <Separator />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              The Assistant is a block composed from the AI primitives -
              Conversation, Message, Reasoning and PromptInput.
            </p>
          </div>

          {/* Panel 2 - Code (React | Angular) + install */}
          <div className="flex min-w-0 flex-col border-b lg:border-r lg:border-b-0">
            <Tabs
              defaultValue="react"
              className="flex min-h-0 flex-1 flex-col gap-0"
            >
              <div className="flex h-12 shrink-0 items-center justify-between border-b px-4">
                <span className="font-semibold text-sm">Code</span>
                <TabsList className="h-8">
                  <TabsTrigger value="react" className="text-xs">
                    React
                  </TabsTrigger>
                  <TabsTrigger value="angular" className="text-xs">
                    Angular
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent
                value="react"
                className="m-0 min-h-0 flex-1 overflow-auto p-3"
              >
                <CodeBlock code={reactCode(prompt, reasoning)} language="tsx" />
              </TabsContent>
              <TabsContent
                value="angular"
                className="m-0 min-h-0 flex-1 overflow-auto p-3"
              >
                <CodeBlock
                  code={angularCode(prompt, reasoning)}
                  language="html"
                />
              </TabsContent>
            </Tabs>
            <Separator />
            <div className="space-y-1 p-3 font-mono text-[11px] text-muted-foreground">
              <div>$ npx gremorie add rx-assistant</div>
              <div>$ npx gremorie add ng-assistant</div>
            </div>
          </div>

          {/* Panel 3 - live Preview + theme bar */}
          <div className="flex min-w-0 flex-col">
            <div className="flex h-12 shrink-0 items-center justify-between border-b px-4">
              <span className="font-semibold text-sm">Preview</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() => setPreviewDark((d) => !d)}
                    aria-label={
                      previewDark
                        ? 'Switch preview to light'
                        : 'Switch preview to dark'
                    }
                  >
                    {previewDark ? (
                      <SunIcon className="size-4" />
                    ) : (
                      <MoonIcon className="size-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-xs">
                  {previewDark ? 'Light' : 'Dark'}
                </TooltipContent>
              </Tooltip>
            </div>
            <div
              className={cn(
                'flex-1 bg-background p-4 text-foreground',
                previewDark && 'dark',
              )}
            >
              <div className="flex h-[340px] flex-col rounded-lg border bg-card">
                <Conversation className="flex-1">
                  <ConversationContent className="space-y-4 p-4">
                    <Message from="user">
                      <MessageContent>
                        {prompt || 'Ask anything...'}
                      </MessageContent>
                    </Message>
                    {reasoning && (
                      <Reasoning defaultOpen duration={2}>
                        <ReasoningTrigger />
                        <ReasoningContent>{REASONING_TEXT}</ReasoningContent>
                      </Reasoning>
                    )}
                    <Message from="assistant">
                      <MessageContent>{ASSISTANT_TEXT}</MessageContent>
                    </Message>
                  </ConversationContent>
                </Conversation>
                <div className="border-t p-3">
                  <PromptInput onSubmit={() => undefined}>
                    <PromptInputTextarea
                      placeholder="Ask anything..."
                      aria-label="Showcase prompt input"
                    />
                    <PromptInputFooter>
                      <PromptInputTools />
                      <PromptInputSubmit status="ready" />
                    </PromptInputFooter>
                  </PromptInput>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </TooltipProvider>
  );
}
