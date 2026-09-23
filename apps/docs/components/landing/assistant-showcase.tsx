'use client';

import { CodeBlock } from '@gremorie/rx-artifacts';
import { Card } from '@gremorie/rx-display';
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@gremorie/rx-forms';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gremorie/rx-navigation';
import { TooltipProvider } from '@gremorie/rx-overlays';
import { PaletteIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { CommandLine } from '@/components/landing/command-line';
import {
  Assistant,
  type AssistantView,
} from '@/components/preview/blocks/assistant';

/**
 * Landing showcase: a mini live playground for the flagship block - the real
 * `Assistant` (the same one shipped at /blocks/assistant, rendered here, not a
 * Storybook iframe). Three side-by-side panels:
 *
 *   1. Properties - the block's real props: the starting view, the composer
 *                   placeholder, and a switch per composer part.
 *   2. Code       - React | Angular consumer code, generated live from the
 *                   controls, plus install commands.
 *   3. Preview    - the REAL `<Assistant />` rendered, with a theme picker.
 *
 * Every control drives the code AND the preview together.
 */

// The four composer parts the block lets you strip, in the order they appear
// in the composer: header first (mentions, meter), then the footer selects.
// Labels match the contract prop names so the panel and the snippet agree.
const COMPOSER_PARTS = [
  { key: 'mentions', label: 'Mentions (@)' },
  { key: 'contextMeter', label: 'Context meter' },
  { key: 'modeSelect', label: 'Mode select' },
  { key: 'modelSelect', label: 'Model select' },
] as const;

type PartKey = (typeof COMPOSER_PARTS)[number]['key'];
type Parts = Record<PartKey, boolean>;

// Every part ships on; the panel strips them.
const ALL_ON: Parts = {
  mentions: true,
  contextMeter: true,
  modeSelect: true,
  modelSelect: true,
};

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
};

type ShowcaseProps = {
  view: AssistantView;
  placeholder: string;
  parts: Parts;
  theme: string;
};

function reactCode({ view, placeholder, parts, theme }: ShowcaseProps): string {
  // The theme is a token set activated on the app root, not a component prop.
  const shell =
    theme !== 'default'
      ? `// Activate the theme on your app root:\n// <html data-theme="${theme}">\n\n`
      : '';
  const props: string[] = [];
  if (view === 'empty') props.push('initialView="empty"');
  if (placeholder !== DEFAULTS.placeholder)
    props.push(`placeholder="${placeholder}"`);
  // Booleans default to true, so only the ones switched OFF earn a line.
  for (const part of COMPOSER_PARTS) {
    if (!parts[part.key]) props.push(`${part.key}={false}`);
  }

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
  parts,
  theme,
}: ShowcaseProps): string {
  // The Angular edition exposes the same props as real inputs on the
  // <ai-assistant> element, so the snippet mirrors the React tab one-to-one.
  const shell =
    theme !== 'default'
      ? `<!-- Activate the theme on your app root: <html data-theme="${theme}"> -->\n`
      : '';
  const attrs: string[] = [];
  if (view === 'empty') attrs.push('initialView="empty"');
  if (placeholder !== DEFAULTS.placeholder)
    attrs.push(`placeholder="${placeholder}"`);
  for (const part of COMPOSER_PARTS) {
    if (!parts[part.key]) attrs.push(`[${part.key}]="false"`);
  }
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
  const [parts, setParts] = useState<Parts>(ALL_ON);
  const [theme, setTheme] = useState('default');

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

  const props: ShowcaseProps = { view, placeholder, parts, theme };

  return (
    <TooltipProvider>
      {/* The hero's product shot: centered, slightly haloed, tucked right
          under the hero copy like a product screenshot. */}
      <section className="relative mx-auto max-w-[88rem] px-6 pb-20">
        <div
          aria-hidden="true"
          className="-z-10 pointer-events-none absolute inset-x-0 top-0 mx-auto size-[520px] rounded-full bg-primary/10 blur-[120px]"
        />
        <Card className="grid gap-0 overflow-hidden p-0 shadow-lg lg:grid-cols-[minmax(0,15rem)_minmax(0,22rem)_minmax(0,1fr)]">
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

            {/* Booleans, not value pickers. Choosing "Research" from a list
                only re-seeds a select the block already owns - the reader
                learns nothing about the API. Switching a part off changes the
                composer in front of them AND changes the snippet, which is
                what a props panel is for. */}
            <div className="space-y-2.5">
              <Label className="text-xs">Composer parts</Label>
              {COMPOSER_PARTS.map((part) => (
                <div
                  key={part.key}
                  className="flex items-center justify-between gap-3"
                >
                  <label
                    htmlFor={`showcase-${part.key}`}
                    className="text-muted-foreground text-xs"
                  >
                    {part.label}
                  </label>
                  <Switch
                    id={`showcase-${part.key}`}
                    size="sm"
                    checked={parts[part.key]}
                    onCheckedChange={(on) =>
                      setParts((p) => ({ ...p, [part.key]: on }))
                    }
                  />
                </div>
              ))}
            </div>
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
              {/* Install first, then the code it enables. The commands used to
                  sit at the foot of the panel, below a snippet that already
                  said `import { Assistant }` - reading it top to bottom asked
                  you to import something you had not installed yet. They are
                  the same CommandLine the hero uses, so a command looks and
                  copies the same way everywhere on the site. */}
              <div className="shrink-0 space-y-2 border-b p-3">
                <CommandLine
                  command="npx gremorie add rx-assistant"
                  label="React install command"
                />
                <CommandLine
                  command="npm i @gremorie/ng-ai"
                  label="Angular install command"
                />
              </div>
              {/* `h-full` on the CodeBlock, not just on the panel: the block is
                  w-full already but sizes its height to the snippet, so four
                  short lines left the rest of the column empty and the box read
                  as a stray card instead of the panel's content. */}
              <TabsContent
                value="react"
                className="m-0 flex min-h-0 flex-1 flex-col overflow-auto p-3"
              >
                <CodeBlock
                  className="h-full"
                  code={reactCode(props)}
                  language="tsx"
                />
              </TabsContent>
              <TabsContent
                value="angular"
                className="m-0 flex min-h-0 flex-1 flex-col overflow-auto p-3"
              >
                <CodeBlock
                  className="h-full"
                  code={angularCode(props)}
                  language="html"
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Panel 3 - live Preview + theme bar */}
          <div className="flex min-w-0 flex-col">
            <div className="flex h-12 shrink-0 items-center justify-between border-b px-4">
              <span className="font-semibold text-sm">Preview</span>
              <div className="flex items-center gap-2">
                <Select value={theme} onValueChange={setTheme}>
                  {/* size="sm" (h-8) pairs the trigger with the size-8 icon
                      button beside it - never override the height by class,
                      the size variant owns it. */}
                  <SelectTrigger
                    aria-label="Preview theme"
                    size="sm"
                    className="w-[8.5rem] gap-1.5 text-xs"
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
              </div>
            </div>
            {/* No local dark class: the preview follows the page, which the
                navbar toggle already controls. Two switches for one thing put
                the card and the site out of step. */}
            <div className="flex flex-1 items-center justify-center bg-background p-4 text-foreground">
              {/* Remount on the props that seed initial/uncontrolled state
                  (view, mode, model) so the block resets to them; placeholder is
                  a live prop and updates without a remount. */}
              <Assistant
                key={view}
                initialView={view}
                placeholder={placeholder}
                mentions={parts.mentions}
                contextMeter={parts.contextMeter}
                modeSelect={parts.modeSelect}
                modelSelect={parts.modelSelect}
              />
            </div>
          </div>
        </Card>
      </section>
    </TooltipProvider>
  );
}
