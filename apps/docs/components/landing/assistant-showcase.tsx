'use client';

import { CodeBlock } from '@gremorie/rx-artifacts';
import { cn } from '@gremorie/rx-core';
import { Badge, Card, Separator } from '@gremorie/rx-display';
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gremorie/rx-forms';
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

import {
  Assistant,
  type AssistantView,
} from '@/components/preview/blocks/assistant';

/**
 * Landing showcase: a mini live playground for the flagship block - the real
 * `Assistant` (the same one shipped at /blocks/assistant, rendered here, not a
 * Storybook iframe). Three side-by-side panels:
 *
 *   1. Properties - the block's real props: the starting view plus the
 *                   PromptInput composer config (placeholder, mode, model).
 *   2. Code       - React | Angular consumer code, generated live from the
 *                   controls, plus install commands.
 *   3. Preview    - the REAL `<Assistant />` rendered, with a dark/light toggle.
 *
 * Every control drives the code AND the preview together.
 */

// Composer presets, mirrored from the block (id <-> label) so the selects here
// and the generated code use the block's own option ids.
const MODES = [
  { value: 'ask', label: 'Ask' },
  { value: 'analyze', label: 'Analyze' },
  { value: 'research', label: 'Research' },
  { value: 'plan', label: 'Plan' },
];
const MODELS = [
  { value: 'claude-opus-4-8', label: 'Claude Opus 4.8' },
  { value: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
  { value: 'gpt-5', label: 'GPT-5' },
  { value: 'gemini-2-5-pro', label: 'Gemini 2.5 Pro' },
];

// Block defaults - a prop is emitted in the snippet only when it differs.
const DEFAULTS = {
  placeholder: 'Ask anything, or pick a mode...',
  mode: 'research',
  model: 'claude-sonnet-4-6',
};

type ShowcaseProps = {
  view: AssistantView;
  placeholder: string;
  mode: string;
  model: string;
};

function reactCode({ view, placeholder, mode, model }: ShowcaseProps): string {
  const props: string[] = [];
  if (view === 'empty') props.push('initialView="empty"');
  if (placeholder !== DEFAULTS.placeholder)
    props.push(`placeholder="${placeholder}"`);
  if (mode !== DEFAULTS.mode) props.push(`defaultMode="${mode}"`);
  if (model !== DEFAULTS.model) props.push(`defaultModel="${model}"`);

  const tag =
    props.length === 0
      ? '<Assistant />'
      : `<Assistant\n      ${props.join('\n      ')}\n    />`;

  return `import { Assistant } from '@/components/gremorie/blocks/assistant';

export function Chat() {
  return ${tag};
}`;
}

function angularCode({
  view,
  placeholder,
  mode,
  model,
}: ShowcaseProps): string {
  // The Angular edition ships the Assistant as the bare <ai-assistant> element
  // from @gremorie/ng-ai. The composer config (placeholder, mode, model) lives
  // in the copied block source, so the inputs surface as comments here.
  const notes: string[] = [];
  if (view === 'empty') notes.push('start on the new-chat screen');
  if (placeholder !== DEFAULTS.placeholder)
    notes.push(`placeholder: "${placeholder}"`);
  if (mode !== DEFAULTS.mode) notes.push(`mode: ${mode}`);
  if (model !== DEFAULTS.model) notes.push(`model: ${model}`);
  const comment = notes.length ? `<!-- ${notes.join(' · ')} -->\n` : '';

  return `// import { Assistant } from '@gremorie/ng-ai';

${comment}<ai-assistant />`;
}

export function AssistantShowcase() {
  const [view, setView] = useState<AssistantView>('filled');
  const [placeholder, setPlaceholder] = useState(DEFAULTS.placeholder);
  const [mode, setMode] = useState(DEFAULTS.mode);
  const [model, setModel] = useState(DEFAULTS.model);
  const [previewDark, setPreviewDark] = useState(false);

  const props: ShowcaseProps = { view, placeholder, mode, model };

  return (
    <TooltipProvider>
      <section className="mx-auto max-w-[88rem] px-6 pb-20">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">
            Flagship block
          </Badge>
          <h2 className="text-balance font-bold text-2xl text-foreground tracking-tight sm:text-3xl">
            The Assistant, live
          </h2>
          <p className="mt-2 text-balance text-muted-foreground">
            A complete chat surface in one import - streaming reasoning, an
            inline chart artifact, sources, and a B2B composer. Tweak the props;
            the code and the rendered block update together.
          </p>
        </div>

        <Card className="grid gap-0 overflow-hidden p-0 lg:grid-cols-[minmax(0,15rem)_minmax(0,22rem)_minmax(0,1fr)]">
          {/* Panel 1 - Properties */}
          <div className="flex flex-col gap-4 border-b p-5 lg:border-r lg:border-b-0">
            <h3 className="font-semibold text-sm">Properties</h3>

            <div className="space-y-1.5">
              <Label className="text-xs">Starting view</Label>
              <Tabs
                value={view}
                onValueChange={(v) => setView(v as AssistantView)}
              >
                <TabsList className="grid h-8 w-full grid-cols-2">
                  <TabsTrigger value="filled" className="text-xs">
                    Conversation
                  </TabsTrigger>
                  <TabsTrigger value="empty" className="text-xs">
                    New chat
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="showcase-placeholder" className="text-xs">
                Composer placeholder
              </Label>
              <Input
                id="showcase-placeholder"
                className="h-8"
                value={placeholder}
                onChange={(e) => setPlaceholder(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Mode</Label>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger className="h-8 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODES.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="h-8 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODELS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Assistant is a <strong>block</strong> - you own the source.{' '}
              <code className="text-[10px]">gremorie add block-assistant</code>{' '}
              copies it in; wire <code className="text-[10px]">onSubmit</code>{' '}
              to your endpoint to make the mock real.
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
                <CodeBlock code={reactCode(props)} language="tsx" />
              </TabsContent>
              <TabsContent
                value="angular"
                className="m-0 min-h-0 flex-1 overflow-auto p-3"
              >
                <CodeBlock code={angularCode(props)} language="html" />
              </TabsContent>
            </Tabs>
            <Separator />
            <div className="space-y-1 p-3 font-mono text-[11px] text-muted-foreground">
              <div>$ npx gremorie add block-assistant</div>
              <div>$ npm i @gremorie/ng-ai</div>
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
                'flex flex-1 items-center justify-center bg-background p-4 text-foreground',
                previewDark && 'dark',
              )}
            >
              {/* Remount on the props that seed initial/uncontrolled state
                  (view, mode, model) so the block resets to them; placeholder is
                  a live prop and updates without a remount. */}
              <Assistant
                key={`${view}-${mode}-${model}-${previewDark ? 'd' : 'l'}`}
                initialView={view}
                placeholder={placeholder}
                defaultMode={mode}
                defaultModel={model}
              />
            </div>
          </div>
        </Card>
      </section>
    </TooltipProvider>
  );
}
