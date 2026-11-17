'use client';

import { CodeBlock } from '@gremorie/rx-artifacts';
import { Card } from '@gremorie/rx-display';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ToggleGroup,
  ToggleGroupItem,
} from '@gremorie/rx-forms';
import { TooltipProvider } from '@gremorie/rx-overlays';
import {
  AtSignIcon,
  EllipsisIcon,
  GaugeIcon,
  MessageSquareIcon,
  PaletteIcon,
  SparklesIcon,
  TelescopeIcon,
  TextCursorInputIcon,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { CommandLine } from '@/components/landing/command-line';
import {
  PropertyGroup,
  PropertySelect,
  PropertySwitch,
  PropertyText,
} from '@/components/landing/property-list';
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
const COMPOSER_PARTS: readonly {
  key: 'mentions' | 'contextMeter' | 'modeSelect' | 'modelSelect';
  label: string;
  icon: LucideIcon;
}[] = [
  { key: 'mentions', label: 'Mentions (@)', icon: AtSignIcon },
  { key: 'contextMeter', label: 'Context meter', icon: GaugeIcon },
  { key: 'modeSelect', label: 'Mode select', icon: TelescopeIcon },
  { key: 'modelSelect', label: 'Model select', icon: SparklesIcon },
];

type ToolsCollapse = 'auto' | 'always' | 'never';
const TOOLS_OPTIONS: { value: ToolsCollapse; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'never', label: 'Inline' },
  { value: 'always', label: 'Menu' },
];

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
  { value: 'purple', label: 'Purple' },
];

// Block defaults - a prop is emitted in the snippet only when it differs.
const DEFAULTS = {
  placeholder: 'Ask anything, or pick a mode...',
};

type ShowcaseProps = {
  view: AssistantView;
  placeholder: string;
  parts: Parts;
  tools: ToolsCollapse;
  theme: string;
};

function reactCode({
  view,
  placeholder,
  parts,
  tools,
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
  // Booleans default to true, so only the ones switched OFF earn a line.
  for (const part of COMPOSER_PARTS) {
    if (!parts[part.key]) props.push(`${part.key}={false}`);
  }
  if (tools !== 'auto') props.push(`toolsCollapse="${tools}"`);

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
  tools,
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
  if (tools !== 'auto') attrs.push(`toolsCollapse="${tools}"`);
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
  const [tools, setTools] = useState<ToolsCollapse>('auto');
  const [edition, setEdition] = useState<'react' | 'angular'>('react');

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

  const props: ShowcaseProps = { view, placeholder, parts, tools, theme };

  return (
    <TooltipProvider>
      {/* The hero's product shot: centered, slightly haloed, tucked right
          under the hero copy like a product screenshot. */}
      <section className="relative mx-auto max-w-[88rem] px-6 pb-20">
        <div
          aria-hidden="true"
          className="-z-10 pointer-events-none absolute inset-x-0 top-0 mx-auto size-[520px] rounded-full bg-primary/10 blur-[120px]"
        />
        <Card className="grid gap-0 overflow-hidden p-0 shadow-lg lg:grid-cols-[minmax(0,20rem)_minmax(0,22rem)_minmax(0,1fr)]">
          {/* Panel 1 - Properties: a settings list (Item rows), one control
              per row: switch, compact select, or a value edited in a popover. */}
          <div className="flex flex-col gap-5 border-b p-4 lg:border-r lg:border-b-0">
            <PropertyGroup title="Assistant">
              <PropertySelect
                icon={MessageSquareIcon}
                label="Starting view"
                onValueChange={(v) => setView(v as AssistantView)}
                options={[
                  { value: 'filled', label: 'Conversation' },
                  { value: 'empty', label: 'New chat' },
                ]}
                value={view}
              />
              <PropertyText
                icon={TextCursorInputIcon}
                id="showcase-placeholder"
                label="Placeholder"
                onValueChange={setPlaceholder}
                value={placeholder}
              />
            </PropertyGroup>

            {/* Booleans, not value pickers: switching a part off changes the
                composer in front of the reader AND the snippet, which is what
                a props panel is for. */}
            <PropertyGroup title="Composer">
              {COMPOSER_PARTS.map((part) => (
                <PropertySwitch
                  checked={parts[part.key]}
                  icon={part.icon}
                  id={`showcase-${part.key}`}
                  key={part.key}
                  label={part.label}
                  onCheckedChange={(on) =>
                    setParts((p) => ({ ...p, [part.key]: on }))
                  }
                />
              ))}
              <PropertySelect
                icon={EllipsisIcon}
                label="Tools"
                onValueChange={(v) => setTools(v as ToolsCollapse)}
                options={TOOLS_OPTIONS}
                value={tools}
              />
            </PropertyGroup>
          </div>

          {/* Panel 2 - Code (React | Angular) + install */}
          <div className="flex min-w-0 flex-col border-b lg:border-r lg:border-b-0">
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex h-12 shrink-0 items-center justify-between border-b px-4">
                <span className="font-semibold text-sm">Code</span>
                {/* One edition at a time: a toggle group, not tabs. */}
                <ToggleGroup
                  aria-label="Edition"
                  onValueChange={(v) =>
                    v && setEdition(v as 'react' | 'angular')
                  }
                  size="sm"
                  type="single"
                  value={edition}
                  variant="outline"
                >
                  <ToggleGroupItem value="react">React</ToggleGroupItem>
                  <ToggleGroupItem value="angular">Angular</ToggleGroupItem>
                </ToggleGroup>
              </div>
              {/* Install first, then the code it enables. The commands used to
                  sit at the foot of the panel, below a snippet that already
                  said `import { Assistant }` - reading it top to bottom asked
                  you to import something you had not installed yet. They are
                  the same CommandLine the hero uses, so a command looks and
                  copies the same way everywhere on the site. */}
              {/* flex + gap, not space-y: CommandLine's figure carries `m-0`
                  to kill the prose margin, and that beat space-y's margin-top,
                  so the two fields sat at a 0px gap. p-4 matches the header's
                  px-4 above, so the fields line up with the "Code" label
                  instead of sitting 4px inside it. 12px between them against
                  16px to the edges: closer to each other than to the frame. */}
              <div className="flex shrink-0 flex-col gap-3 border-b p-4">
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
              <div className="m-0 flex min-h-0 flex-1 flex-col overflow-auto p-3">
                <CodeBlock
                  className="h-full"
                  code={
                    edition === 'react' ? reactCode(props) : angularCode(props)
                  }
                  language={edition === 'react' ? 'tsx' : 'html'}
                />
              </div>
            </div>
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
                toolsCollapse={tools}
              />
            </div>
          </div>
        </Card>
      </section>
    </TooltipProvider>
  );
}
