'use client';

import { CodeBlock } from '@gremorie/rx-artifacts';
import { cn } from '@gremorie/rx-core';
import { Card, Separator } from '@gremorie/rx-display';
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
import { MoonIcon, PaletteIcon, SunIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

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

// Gremorie brand themes (token sets activated via data-theme on the root, from
// @gremorie/tokens/styles/themes/*). 'default' = the neutral base.
const THEMES = [
  { value: 'default', label: 'Default' },
  { value: 'claude', label: 'Claude' },
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'perplexity', label: 'Perplexity' },
  { value: 'mistral', label: 'Mistral' },
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
  theme: string;
};

function reactCode({
  view,
  placeholder,
  mode,
  model,
  theme,
}: ShowcaseProps): string {
  // The theme is a token set activated on the app root, not a component prop.
  const shell =
    theme !== 'default'
      ? `// Activate the theme on your app root:\n// <html data-theme="${theme}">\n\n`
      : '';
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

  return `${shell}import { Assistant } from '@/components/gremorie/blocks/assistant';

export function Chat() {
  return ${tag};
}`;
}

function angularCode({
  view,
  placeholder,
  mode,
  model,
  theme,
}: ShowcaseProps): string {
  // The Angular edition exposes the same composer config as real inputs on the
  // <ai-assistant> element (initialView / placeholder / defaultMode / defaultModel),
  // so the snippet mirrors the React tab one-to-one.
  const shell =
    theme !== 'default'
      ? `<!-- Activate the theme on your app root: <html data-theme="${theme}"> -->\n`
      : '';
  const attrs: string[] = [];
  if (view === 'empty') attrs.push('initialView="empty"');
  if (placeholder !== DEFAULTS.placeholder)
    attrs.push(`placeholder="${placeholder}"`);
  if (mode !== DEFAULTS.mode) attrs.push(`defaultMode="${mode}"`);
  if (model !== DEFAULTS.model) attrs.push(`defaultModel="${model}"`);
  const tag =
    attrs.length === 0
      ? '<ai-assistant />'
      : `<ai-assistant\n  ${attrs.join('\n  ')}\n/>`;

  return `${shell}<!-- import { Assistant } from '@gremorie/ng-ai' -->

${tag}`;
}

export function AssistantShowcase() {
  const [view, setView] = useState<AssistantView>('filled');
  const [placeholder, setPlaceholder] = useState(DEFAULTS.placeholder);
  const [mode, setMode] = useState(DEFAULTS.mode);
  const [model, setModel] = useState(DEFAULTS.model);
  const [theme, setTheme] = useState('default');
  const [previewDark, setPreviewDark] = useState(false);

  // Brand themes are token sets scoped to the root element (`:root[data-theme]`),
  // so a selection re-themes the document; cleaned up on unmount/restore.
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.dataset.theme;
    if (theme === 'default') {
      delete root.dataset.theme;
    } else {
      root.dataset.theme = theme;
    }
    return () => {
      if (previous) root.dataset.theme = previous;
      else delete root.dataset.theme;
    };
  }, [theme]);

  const props: ShowcaseProps = { view, placeholder, mode, model, theme };

  return (
    <TooltipProvider>
      <section className="mx-auto max-w-[88rem] px-6 pb-20">
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
              <div className="flex items-center gap-2">
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger
                    aria-label="Preview theme"
                    className="h-8 w-[8.5rem] gap-1.5 text-xs"
                  >
                    <PaletteIcon className="size-3.5 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {THEMES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
