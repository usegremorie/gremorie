'use client';

import { CodeBlock, CodeBlockCopyButton } from '@gremorie/rx-artifacts';
import { Card, CardHeader } from '@gremorie/rx-display';
import { TooltipProvider } from '@gremorie/rx-overlays';
import {
  AtSignIcon,
  EllipsisIcon,
  GaugeIcon,
  MessageSquareIcon,
  PanelBottomIcon,
  SparklesIcon,
  TelescopeIcon,
  TextCursorInputIcon,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';

import { CommandLine } from '@/components/landing/command-line';
import {
  FrameworkTabs,
  type Framework,
} from '@/components/landing/install-command';
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
 * Landing showcase: a live playground for the flagship block - the real
 * `Assistant` (the same one shipped at /blocks/assistant, rendered here, not a
 * Storybook iframe). Two columns:
 *
 *   left   Properties card - the block's real props as a settings list.
 *          Code card - install command (React | Angular, the hero's block)
 *          and the consumer code for the active edition, generated live.
 *   right  the REAL `<Assistant />`, filling the column.
 *
 * Every control drives the code AND the preview together. Themes are not
 * picked here (they live elsewhere on the site).
 */

// The composer parts the block lets you strip, in the order they appear in
// the composer. Labels match the contract prop names so the panel and the
// snippet agree.
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

type PartKey = (typeof COMPOSER_PARTS)[number]['key'];
type Parts = Record<PartKey, boolean>;

// Every part ships on; the panel strips them.
const ALL_ON: Parts = {
  mentions: true,
  contextMeter: true,
  modeSelect: true,
  modelSelect: true,
};

type ToolsCollapse = 'auto' | 'always' | 'never';
const TOOLS_OPTIONS: { value: ToolsCollapse; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'never', label: 'Inline' },
  { value: 'always', label: 'Menu' },
];

type ComposerLayout = 'stacked' | 'inline';
const LAYOUT_OPTIONS: { value: ComposerLayout; label: string }[] = [
  { value: 'stacked', label: 'Default' },
  { value: 'inline', label: 'Compact' },
];

// The code box: fixed 320px, scrollbars hidden until the pointer is over it
// (the DS bar, --border thumb, otherwise).
const CODE_SCROLL =
  '[&_.overflow-auto]:h-80 [&_.overflow-auto]:[scrollbar-color:transparent_transparent] [&_.overflow-auto:hover]:[scrollbar-color:var(--border)_transparent]';

const INSTALL: Record<Framework, string> = {
  react: 'npx gremorie add rx-assistant',
  angular: 'npx gremorie add ng-assistant',
};

// Block defaults - a prop is emitted in the snippet only when it differs.
const DEFAULTS = {
  placeholder: 'Ask anything, or pick a mode...',
};

type ShowcaseProps = {
  view: AssistantView;
  placeholder: string;
  parts: Parts;
  tools: ToolsCollapse;
  layout: ComposerLayout;
};

function propsFor(
  { view, placeholder, parts, tools, layout }: ShowcaseProps,
  edition: Framework,
): string[] {
  const out: string[] = [];
  const bool = (key: string) =>
    edition === 'react' ? `${key}={false}` : `[${key}]="false"`;
  if (view === 'empty') out.push('initialView="empty"');
  if (placeholder !== DEFAULTS.placeholder)
    out.push(`placeholder="${placeholder}"`);
  // Booleans default to true, so only the ones switched OFF earn a line.
  for (const part of COMPOSER_PARTS) {
    if (!parts[part.key]) out.push(bool(part.key));
  }
  if (tools !== 'auto') out.push(`toolsCollapse="${tools}"`);
  if (layout !== 'stacked') out.push(`composerLayout="${layout}"`);
  return out;
}

function reactCode(props: ShowcaseProps): string {
  const p = propsFor(props, 'react');
  const tag =
    p.length === 0
      ? '<Assistant />'
      : `<Assistant\n      ${p.join('\n      ')}\n    />`;
  return `import { Assistant } from '@/components/gremorie/blocks/assistant';

export function Chat() {
  return ${tag};
}`;
}

function angularCode(props: ShowcaseProps): string {
  // The Angular edition exposes the same props as real inputs on the
  // <ai-assistant> element, so the snippet mirrors the React one.
  const p = propsFor(props, 'angular');
  const tag =
    p.length === 0
      ? '<ai-assistant />'
      : `<ai-assistant\n  ${p.join('\n  ')}\n/>`;
  return `<!-- import { Assistant } from '@gremorie/ng-ai' -->

${tag}`;
}

export function AssistantShowcase() {
  const [view, setView] = useState<AssistantView>('filled');
  const [placeholder, setPlaceholder] = useState(DEFAULTS.placeholder);
  const [parts, setParts] = useState<Parts>(ALL_ON);
  const [tools, setTools] = useState<ToolsCollapse>('auto');
  const [layout, setLayout] = useState<ComposerLayout>('stacked');
  const [edition, setEdition] = useState<Framework>('react');

  const props: ShowcaseProps = { view, placeholder, parts, tools, layout };

  return (
    <TooltipProvider>
      <section className="relative mx-auto max-w-[88rem] px-6 pb-20">
        <div
          aria-hidden="true"
          className="-z-10 pointer-events-none absolute inset-x-0 top-0 mx-auto size-[520px] rounded-full bg-primary/10 blur-[120px]"
        />
        <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
          {/* Left column: the controls, then the code they produce. */}
          <div className="flex min-w-0 flex-col gap-6">
            <Card className="gap-5 p-4">
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

              {/* Switching a part off changes the composer in front of the
                  reader AND the snippet, which is what a props panel is for. */}
              <PropertyGroup title="Composer">
                <PropertySelect
                  icon={PanelBottomIcon}
                  label="Layout"
                  onValueChange={(v) => setLayout(v as ComposerLayout)}
                  options={LAYOUT_OPTIONS}
                  value={layout}
                />
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
            </Card>

            {/* Code: the edition tabs head the card; the body holds the
                install command and the consumer code for that edition. The
                code box has a fixed height, so the section keeps its size
                whatever the props produce; it scrolls both ways, with the
                bars showing on hover. */}
            <Card className="gap-0 overflow-hidden py-0">
              <CardHeader className="block border-b px-4 [.border-b]:pb-0">
                <FrameworkTabs onValueChange={setEdition} value={edition} />
              </CardHeader>
              <div className="flex flex-col gap-3 p-4">
                <CommandLine
                  command={INSTALL[edition]}
                  label="install command"
                />
                <CodeBlock
                  className={CODE_SCROLL}
                  code={
                    edition === 'react' ? reactCode(props) : angularCode(props)
                  }
                  language={edition === 'react' ? 'tsx' : 'html'}
                >
                  {/* Backdrop like the install command's copy: code scrolling
                      under the button stays out of the icon's way. */}
                  <CodeBlockCopyButton className="bg-background/80 backdrop-blur-lg" />
                </CodeBlock>
              </div>
            </Card>
          </div>

          {/* Right column: the block itself. On large screens the left
              column sets the row height (680px at least) and the Assistant
              fills it, scrolling its thread inside, instead of a long
              conversation stretching the whole section. Remount on the props
              that seed initial state (view) so it resets to them. */}
          <div className="relative min-h-[680px]">
            <Assistant
              className="h-[680px] max-w-none lg:absolute lg:inset-0 lg:h-auto"
              composerLayout={layout}
              contextMeter={parts.contextMeter}
              initialView={view}
              key={view}
              mentions={parts.mentions}
              modelSelect={parts.modelSelect}
              modeSelect={parts.modeSelect}
              placeholder={placeholder}
              toolsCollapse={tools}
            />
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
}
