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

/**
 * Gremorie Workbench - audit the React and Angular editions side by side. The
 * shell dogfoods the rx-* primitives (Resizable, Tabs, Select, Switch, Badge,
 * Separator, ScrollArea, Tooltip, CodeBlock); both previews are symmetric
 * Storybook iframes (React :4401, Angular :4400) driven by the same contract
 * controls, so the only variable between columns is the framework.
 */
const RX_BASE = 'http://localhost:4401';
const NG_BASE = 'http://localhost:4400';

/** The Gremorie brand themes, applied via `data-theme` on the root element.
 *  `default` clears the attribute and falls back to the base palette. */
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

function storyUrl(
  base: string,
  id: string | undefined,
  values: Values,
): string | null {
  if (!id) return null;
  return `${base}/iframe.html?id=${id}&viewMode=story${encodeArgs(values)}`;
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

/** The interactive input for a single controllable prop. */
function ControlInput({
  control,
  value,
  onChange,
}: {
  control: WorkbenchControl;
  value: string | number | boolean | undefined;
  onChange: (v: string | number | boolean) => void;
}) {
  if (control.kind === 'toggle') {
    return <Switch checked={Boolean(value)} onCheckedChange={onChange} />;
  }
  if (control.kind === 'select') {
    return (
      <Select value={String(value ?? '')} onValueChange={onChange}>
        <SelectTrigger className="h-8" size="sm">
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
    );
  }
  return (
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
  );
}

/** One prop row: name + type + required badge + description, and - when the
 *  prop is controllable - the live control that drives both previews. */
function PropField({
  prop,
  control,
  value,
  onChange,
}: {
  prop: PropRow;
  control: WorkbenchControl | undefined;
  value: string | number | boolean | undefined;
  onChange: (v: string | number | boolean) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {control?.kind === 'toggle' ? (
          <Label className="flex flex-1 items-center justify-between gap-2 font-medium text-foreground text-xs">
            <span>{prop.name}</span>
            <ControlInput control={control} value={value} onChange={onChange} />
          </Label>
        ) : (
          <Label className="font-medium text-foreground text-xs">
            {prop.name}
          </Label>
        )}
        {prop.required && (
          <Badge
            variant="outline"
            className="h-4 border-amber-500/40 px-1 text-[9px] text-amber-600 dark:text-amber-400"
          >
            required
          </Badge>
        )}
        <code className="font-mono text-[10px] text-muted-foreground">
          {prop.type}
        </code>
      </div>
      {prop.description && (
        <p className="text-[11px] text-muted-foreground leading-snug">
          {prop.description}
        </p>
      )}
      {control && control.kind !== 'toggle' && (
        <ControlInput control={control} value={value} onChange={onChange} />
      )}
      {!control && (
        <p className="text-[11px] text-muted-foreground/70 italic">
          set in code{prop.default !== '-' ? ` · default ${prop.default}` : ''}
        </p>
      )}
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
        <div className="flex shrink-0 items-center justify-between gap-2 border-b px-3 py-2">
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
              className="h-full w-full border-0 bg-white"
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
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="text-muted-foreground/70 hover:text-foreground"
              >
                <InfoIcon className="size-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-60 text-xs">
              First line copies the component source into your app via the
              registry; second installs the bundled package from npm.
            </TooltipContent>
          </Tooltip>
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
  // CodeBlock - re-themes together.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', dark);
    if (theme === 'default') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
  }, [dark, theme]);

  if (!entry) {
    return <p className="p-6">No component contracts found.</p>;
  }

  const controlByName = new Map(entry.controls.map((c) => [c.name, c]));
  const set = (k: string, v: string | number | boolean) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  const whenNot = entry.guidance.whenNotToUse?.map((w) =>
    w.use ? `${w.text} - use ${w.use}` : w.text,
  );

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex h-screen flex-col bg-background text-foreground">
        <header className="flex shrink-0 items-center gap-3 border-b px-4 py-2.5">
          <span className="font-semibold text-sm">Gremorie Workbench</span>
          <Separator orientation="vertical" className="h-5" />
          <Select
            value={name}
            onValueChange={(v) => {
              const next = entries.find((x) => x.name === v) ?? entry;
              setName(v);
              setValues(defaults(next));
            }}
          >
            <SelectTrigger className="h-8 w-72" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {entries.map((e) => (
                <SelectItem key={e.name} value={e.name}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

        <ResizablePanelGroup direction="horizontal" className="min-h-0 flex-1">
          {/* Column 1 - shared anatomy + agnostic guidance */}
          <ResizablePanel defaultSize={19} minSize={12}>
            <div className="flex h-full min-h-0 flex-col">
              <div className="shrink-0 border-b px-4 py-3">
                <h2 className="font-semibold text-sm">Anatomy & guidance</h2>
                <p className="text-[11px] text-muted-foreground">
                  Shared across both editions
                </p>
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

          {/* Column 2 - the agnostic public API, controllable props are live */}
          <ResizablePanel defaultSize={20} minSize={14}>
            <div className="flex h-full min-h-0 flex-col">
              <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
                <div>
                  <h2 className="font-semibold text-sm">Props</h2>
                  <p className="text-[11px] text-muted-foreground">
                    Drive both previews
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setValues(defaults(entry))}
                >
                  Reset
                </Button>
              </div>
              <ScrollArea className="min-h-0 flex-1">
                <div className="space-y-4 p-4">
                  {entry.props.map((prop) => (
                    <PropField
                      key={prop.name}
                      prop={prop}
                      control={controlByName.get(prop.name)}
                      value={values[prop.name]}
                      onChange={(v) => set(prop.name, v)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />

          {/* Column 3 - React */}
          <ResizablePanel defaultSize={30.5} minSize={20}>
            <FrameworkColumn
              title="React"
              edition="rx-*"
              url={storyUrl(RX_BASE, entry.preview.rx, values)}
              code={storySource('rx', entry.name) ?? rxCode(entry, values)}
              language="tsx"
              commands={entry.commands.rx}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />

          {/* Column 4 - Angular */}
          <ResizablePanel defaultSize={30.5} minSize={20}>
            <FrameworkColumn
              title="Angular"
              edition="ng-*"
              url={storyUrl(NG_BASE, entry.preview.ng, values)}
              code={storySource('ng', entry.name) ?? ngCode(entry, values)}
              language="typescript"
              commands={entry.commands.ng}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </TooltipProvider>
  );
}
