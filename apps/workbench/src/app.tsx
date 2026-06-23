import {
  CONTRACTS,
  workbenchManifest,
  type PropRow,
  type WorkbenchControl,
  type WorkbenchEntry,
} from '@gremorie/contracts';
import { CodeBlock, CodeBlockCopyButton } from '@gremorie/rx-artifacts';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
} from '@gremorie/rx-containers';
import { Badge, Separator } from '@gremorie/rx-display';
import {
  Button,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/rx-overlays';
import { CheckIcon, InfoIcon, MoonIcon, SunIcon, XIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Sidebar } from './sidebar';

/**
 * Gremorie Workbench - audit the React and Angular editions side by side. The
 * shell dogfoods the rx-* primitives; both previews are symmetric Storybook
 * iframes (React :4401, Angular :4400) driven by the same contract controls and
 * the same theme globals, so the only variable between columns is the framework.
 */
// Storybook origins. Local dev falls back to the running Storybook dev servers;
// production points at the published Storybooks (e.g. Chromatic branch
// permalinks) via build-time env vars. Same iframe contract either way.
const RX_BASE = import.meta.env.VITE_RX_BASE ?? 'http://localhost:4401';
const NG_BASE = import.meta.env.VITE_NG_BASE ?? 'http://localhost:4400';

/** The Gremorie brand themes, applied via `data-theme` on the root element. */
const THEMES = [
  { value: 'default', label: 'Default' },
  { value: 'claude', label: 'Claude' },
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'mistral', label: 'Mistral' },
  { value: 'perplexity', label: 'Perplexity' },
] as const;

type Values = Record<string, string | number | boolean>;
type CodeLang = 'tsx' | 'typescript';

function defaults(entry: WorkbenchEntry | undefined): Values {
  const v: Values = {};
  if (!entry) return v;
  for (const c of entry.controls) {
    if (c.default !== undefined) v[c.name] = c.default;
    else if (c.kind === 'toggle') v[c.name] = false;
    else if (c.kind === 'select') v[c.name] = c.options?.[0] ?? '';
  }
  return v;
}

function encodeArgs(values: Values): string {
  const parts = Object.entries(values)
    .filter(([, v]) => v !== '' && v !== undefined)
    .map(([k, v]) =>
      typeof v === 'boolean'
        ? `${k}:!${v}`
        : `${k}:${encodeURIComponent(String(v))}`,
    );
  return parts.length ? `&args=${parts.join(';')}` : '';
}

/** Build a Storybook iframe URL with the args AND the theme globals, so the
 *  previewed component re-themes in lockstep with the workbench shell. */
function storyUrl(
  base: string,
  id: string | undefined,
  values: Values,
  theme: string,
  dark: boolean,
): string | null {
  if (!id) return null;
  const globals = `&globals=theme:${theme};dark:!${dark}`;
  // shortcuts=false + singleStory=true: Chromatic's recommended embed flags.
  return `${base}/iframe.html?id=${id}&viewMode=story&shortcuts=false&singleStory=true${encodeArgs(values)}${globals}`;
}

const pascal = (s: string) =>
  s.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase());

/** Fallback usage snippet, only shown if a story source can't be located. */
function rxCode(entry: WorkbenchEntry, values: Values): string {
  const attrs = entry.controls
    .map((c) => {
      const v = values[c.name];
      if (v === '' || v === undefined) return null;
      if (c.kind === 'toggle') return v ? c.name : null;
      if (c.kind === 'number') return `${c.name}={${v}}`;
      return `${c.name}="${v}"`;
    })
    .filter(Boolean);
  return `<${pascal(entry.name)} ${attrs.join(' ')} data={data} />`;
}

function ngCode(entry: WorkbenchEntry, values: Values): string {
  const attrs = entry.controls
    .map((c) => {
      const v = values[c.name];
      if (v === '' || v === undefined) return null;
      if (c.kind === 'toggle' || c.kind === 'number')
        return `[${c.name}]="${v}"`;
      return `${c.name}="${v}"`;
    })
    .filter(Boolean);
  return `<${entry.name} ${attrs.join(' ')} [data]="data" />`;
}

// Real story sources, loaded as raw text at build time (Vite). The Code tab
// shows the actual source of the story rendered in the Preview iframe - same
// pattern as the docs ComponentPreview, so Preview and Code never drift.
const RX_STORY_SRC = import.meta.glob(
  '../../../packages/{rx-data,rx-artifacts}/src/**/*.stories.tsx',
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>;
const NG_STORY_SRC = import.meta.glob(
  '../../../packages/{ng-data,ng-artifacts}/src/**/*.stories.ts',
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>;

function storySource(fw: 'rx' | 'ng', name: string): string | null {
  const map = fw === 'rx' ? RX_STORY_SRC : NG_STORY_SRC;
  const suffix = `/${name}.stories.${fw === 'rx' ? 'tsx' : 'ts'}`;
  const key = Object.keys(map).find((k) => k.endsWith(suffix));
  return key ? map[key] : null;
}

/** Tiny info affordance: an icon that reveals the prop description on hover,
 *  keeping the control row clean (Figma-playground style). */
function PropInfo({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="text-muted-foreground/50 transition-colors hover:text-foreground"
        >
          <InfoIcon className="size-3" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-56 text-xs">{text}</TooltipContent>
    </Tooltip>
  );
}

/** One playground row: just the name + control. Type is implied by the control
 *  (a text box is a string, a dropdown shows its options on open); the optional
 *  description lives behind an info icon. Required props get a subtle marker. */
function PropField({
  control,
  meta,
  value,
  onChange,
}: {
  control: WorkbenchControl;
  meta: PropRow | undefined;
  value: string | number | boolean | undefined;
  onChange: (v: string | number | boolean) => void;
}) {
  const labelRow = (
    <div className="flex items-center gap-1">
      <Label className="font-medium text-foreground text-xs">
        {control.name}
      </Label>
      {meta?.required && (
        <span className="text-[10px] text-rose-500 leading-none">*</span>
      )}
      {meta?.description && <PropInfo text={meta.description} />}
    </div>
  );

  if (control.kind === 'toggle') {
    return (
      <div className="flex items-center justify-between gap-2">
        {labelRow}
        <Switch checked={Boolean(value)} onCheckedChange={onChange} />
      </div>
    );
  }
  if (control.kind === 'select') {
    return (
      <div className="space-y-1.5">
        {labelRow}
        <Select value={String(value ?? '')} onValueChange={onChange}>
          <SelectTrigger className="h-8 w-full" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {control.options?.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
  return (
    <div className="space-y-1.5">
      {labelRow}
      <Input
        type={control.kind === 'number' ? 'number' : 'text'}
        className="h-8"
        value={String(value ?? '')}
        onChange={(e) =>
          onChange(
            control.kind === 'number' ? Number(e.target.value) : e.target.value,
          )
        }
      />
    </div>
  );
}

/** A bulleted guidance list with an icon per item. */
function GuidanceList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: 'do' | 'dont';
}) {
  if (!items.length) return null;
  const Icon = tone === 'do' ? CheckIcon : XIcon;
  const color =
    tone === 'do'
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-rose-600 dark:text-rose-400';
  return (
    <div className="space-y-1">
      <p className="font-medium text-[11px] text-foreground uppercase tracking-wide">
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((it) => (
          <li
            key={it}
            className="flex gap-1.5 text-[11px] text-muted-foreground leading-snug"
          >
            <Icon className={`mt-0.5 size-3 shrink-0 ${color}`} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A framework column: Preview|Code tabs over a Storybook iframe + real source,
 *  with the install commands underneath. */
function FrameworkColumn({
  title,
  edition,
  url,
  code,
  language,
  commands,
}: {
  title: string;
  edition: string;
  url: string | null;
  code: string;
  language: CodeLang;
  commands: { registry: string; npm: string };
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <Tabs
        defaultValue="preview"
        className="flex min-h-0 flex-1 flex-col gap-0"
      >
        <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{title}</span>
            <Badge variant="secondary" className="h-5 font-mono text-[10px]">
              {edition}
            </Badge>
          </div>
          <TabsList className="h-8">
            <TabsTrigger value="preview" className="text-xs">
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="text-xs">
              Code
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="preview"
          className="m-0 min-h-0 flex-1 overflow-hidden"
        >
          {url ? (
            <iframe
              title={`${title} preview`}
              src={url}
              className="h-full w-full border-0 bg-background"
            />
          ) : (
            <p className="p-4 text-muted-foreground text-sm">
              No story registered for this edition yet.
            </p>
          )}
        </TabsContent>

        <TabsContent
          value="code"
          className="m-0 min-h-0 flex-1 overflow-hidden"
        >
          <ScrollArea className="h-full">
            <div className="p-3">
              <CodeBlock
                code={code.trimEnd()}
                language={language}
                showLineNumbers
              >
                <CodeBlockCopyButton />
              </CodeBlock>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <Separator />
      <div className="shrink-0 space-y-2 p-3">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-[11px] text-muted-foreground uppercase tracking-wide">
            Install
          </span>
          <PropInfo text="First line copies the component source into your app via the registry; second installs the bundled package from npm." />
        </div>
        <CodeBlock
          code={`${commands.registry}\n${commands.npm}`}
          language="bash"
        >
          <CodeBlockCopyButton />
        </CodeBlock>
      </div>
    </div>
  );
}

export function App() {
  const entries = useMemo(() => workbenchManifest(CONTRACTS), []);
  const [name, setName] = useState(entries[0]?.name ?? '');
  const entry = entries.find((e) => e.name === name) ?? entries[0];
  const [values, setValues] = useState<Values>(() => defaults(entry));
  const [dark, setDark] = useState(true);
  const [theme, setTheme] = useState<string>('default');

  // Drive both the CSS-var tokens (`.dark`) and the brand palette (`data-theme`)
  // from the root element, so the whole shell - every rx-* component and the
  // CodeBlock - re-themes together. The previews follow via Storybook globals.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', dark);
    if (theme === 'default') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
  }, [dark, theme]);

  const contracted = useMemo(
    () => new Set(entries.map((e) => e.name)),
    [entries],
  );

  if (!entry) {
    return <p className="p-6">No component contracts found.</p>;
  }

  const metaByName = new Map(entry.props.map((p) => [p.name, p]));
  const selectByName = (n: string) => {
    const next = entries.find((e) => e.name === n);
    if (!next) return;
    setName(n);
    setValues(defaults(next));
  };
  const set = (k: string, v: string | number | boolean) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  const whenNot = entry.guidance.whenNotToUse?.map((w) =>
    w.use ? `${w.text} - use ${w.use}` : w.text,
  );

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex h-screen flex-col bg-background text-foreground">
        {/* Top bar: identity + theme controls */}
        <header className="flex shrink-0 items-center gap-3 border-b px-4 py-2.5">
          <span className="font-semibold text-sm">Gremorie Workbench</span>
          <Separator orientation="vertical" className="h-5" />
          <span className="font-medium text-sm">{entry.name}</span>
          <Badge variant="secondary">{entry.category}</Badge>
          {entry.status && (
            <Badge variant={entry.status === 'stable' ? 'default' : 'outline'}>
              {entry.status}
            </Badge>
          )}
          <div className="ml-auto flex items-center gap-2">
            <span className="font-mono text-[11px] text-muted-foreground max-lg:hidden">
              React :4401 · Angular :4400
            </span>
            <Separator orientation="vertical" className="h-5" />
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger
                className="h-8 w-32"
                size="sm"
                aria-label="Brand theme"
              >
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
                  onClick={() => setDark((d) => !d)}
                  aria-label={
                    dark ? 'Switch to light mode' : 'Switch to dark mode'
                  }
                >
                  {dark ? (
                    <SunIcon className="size-4" />
                  ) : (
                    <MoonIcon className="size-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">
                {dark ? 'Switch to light' : 'Switch to dark'}
              </TooltipContent>
            </Tooltip>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          {/* Left nav: full component catalog, collapsible by category */}
          <Sidebar
            active={name}
            contracted={contracted}
            onSelect={selectByName}
          />

          {/* Content: anatomy/guidance · props · React · Angular */}
          <ResizablePanelGroup
            direction="horizontal"
            className="min-h-0 flex-1"
          >
            <ResizablePanel defaultSize={20} minSize={13}>
              <div className="flex h-full min-h-0 flex-col">
                <div className="flex h-12 shrink-0 items-center border-b px-4">
                  <h2 className="font-semibold text-sm">Anatomy & guidance</h2>
                </div>
                <ScrollArea className="min-h-0 flex-1">
                  <div className="space-y-4 p-4">
                    <pre className="overflow-x-auto rounded-md bg-muted/60 p-3 font-mono text-[11px] text-foreground leading-relaxed">
                      {entry.anatomy.trim()}
                    </pre>
                    <Separator />
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {entry.guidance.summary}
                    </p>
                    <GuidanceList
                      title="Use when"
                      items={entry.guidance.whenToUse}
                      tone="do"
                    />
                    {whenNot && whenNot.length > 0 && (
                      <GuidanceList
                        title="Avoid when"
                        items={whenNot}
                        tone="dont"
                      />
                    )}
                  </div>
                </ScrollArea>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={18} minSize={13}>
              <div className="flex h-full min-h-0 flex-col">
                <div className="flex h-12 shrink-0 items-center justify-between border-b px-4">
                  <h2 className="font-semibold text-sm">Properties</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setValues(defaults(entry))}
                  >
                    Reset
                  </Button>
                </div>
                <ScrollArea className="min-h-0 flex-1">
                  <div className="space-y-4 p-4">
                    {entry.controls.length === 0 && (
                      <p className="text-muted-foreground text-xs">
                        No interactive props for this component.
                      </p>
                    )}
                    {entry.controls.map((c) => (
                      <PropField
                        key={c.name}
                        control={c}
                        meta={metaByName.get(c.name)}
                        value={values[c.name]}
                        onChange={(v) => set(c.name, v)}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={31} minSize={20}>
              <FrameworkColumn
                title="React"
                edition="rx-*"
                url={storyUrl(RX_BASE, entry.preview.rx, values, theme, dark)}
                code={storySource('rx', entry.name) ?? rxCode(entry, values)}
                language="tsx"
                commands={entry.commands.rx}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={31} minSize={20}>
              <FrameworkColumn
                title="Angular"
                edition="ng-*"
                url={storyUrl(NG_BASE, entry.preview.ng, values, theme, dark)}
                code={storySource('ng', entry.name) ?? ngCode(entry, values)}
                language="typescript"
                commands={entry.commands.ng}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </TooltipProvider>
  );
}
