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

// Deep import of the pure data module: the registry barrel re-exports the
// generator (node:fs/node:path), which cannot enter a browser bundle.
import { ITEMS } from '@gremorie/registry/dist/items.js';

import { cn } from '@gremorie/rx-core';
import { type ShowcaseView } from './nav';
import {
  PropertyGroup,
  PropertySelect,
  PropertySwitch,
  PropertyText,
} from './property-list';
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

/** The reference showcase the Gremorie showcase is compared against. */
const REFERENCE_URL =
  'https://ui.shadcn.com/preview/base/preview-02?preset=b1VnZgxu&style=luma&theme=fuchsia&menuColor=default-translucent&radius=small';
/** Story id of the showcase screen in both Storybooks. */
const SHOWCASE_STORY = 'showcase--all';

/**
 * Angular items that actually exist in the published registry index
 * (apps/docs/public/r/registry.json, imported at build time). The ng registry
 * covers only a subset of the contracts, so the manifest gates the
 * `npx gremorie add ng-*` command on this set: a missing item degrades to the
 * npm install of the bundle (rendered as a single line by FrameworkColumn).
 */
const NG_REGISTRY_ITEMS = new Set(
  ITEMS.filter((item) => item.framework === 'ng').map((item) => item.name),
);

/** The Gremorie brand themes, applied via `data-theme` on the root element. */
const THEMES = [
  { value: 'default', label: 'Default' },
  { value: 'claude', label: 'Claude' },
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'mistral', label: 'Mistral' },
  { value: 'perplexity', label: 'Perplexity' },
  { value: 'purple', label: 'Purple' },
] as const;

type Values = Record<string, string | number | boolean>;
type CodeLang = 'tsx' | 'typescript';

function defaults(entry: WorkbenchEntry | undefined): Values {
  const v: Values = {};
  if (!entry) return v;
  for (const c of entry.controls) {
    const ex = entry.example?.[c.name];
    if (ex !== undefined) v[c.name] = ex;
    else if (c.default !== undefined) v[c.name] = c.default;
    else if (c.kind === 'toggle') v[c.name] = false;
    else if (c.kind === 'select') v[c.name] = c.options?.[0] ?? '';
    else v[c.name] = '';
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

/** "npm i @gremorie/rx-forms" -> "@gremorie/rx-forms" */
const pkgFromNpm = (npm: string) => npm.replace(/^npm i\s+/, '').trim();

/**
 * Live consumer-usage code, generated from the current control values - the code
 * a consumer copies, updating as the controls change. React uses the component
 * (PascalCase) as the JSX tag; Angular imports the component class and uses its
 * selector in the template. Empty controls are omitted; a `data` prop (if the
 * component has one) is shown as a bound reference.
 */
function usageCode(
  entry: WorkbenchEntry,
  values: Values,
  fw: 'rx' | 'ng',
): string {
  const cls = pascal(entry.name);
  const tag =
    fw === 'rx' ? (entry.tag.rx ?? cls) : (entry.tag.ng ?? entry.name);
  const pkg = pkgFromNpm(
    fw === 'rx' ? entry.commands.rx.npm : entry.commands.ng.npm,
  );

  const attrs = entry.controls
    .filter((c) => !c.demo)
    .map((c) => {
      const v = values[c.name];
      if (v === '' || v === undefined) return null;
      if (c.kind === 'toggle') {
        return fw === 'rx' ? (v ? c.name : null) : `[${c.name}]="${v}"`;
      }
      if (c.kind === 'number') {
        return fw === 'rx' ? `${c.name}={${v}}` : `[${c.name}]="${v}"`;
      }
      return `${c.name}="${v}"`;
    })
    .filter(Boolean) as string[];

  if (entry.props.some((p) => p.name === 'data')) {
    attrs.push(fw === 'rx' ? 'data={data}' : '[data]="data"');
  }

  const el =
    attrs.length > 1
      ? `<${tag}\n${attrs.map((a) => `  ${a}`).join('\n')}\n/>`
      : `<${tag}${attrs.length ? ` ${attrs[0]}` : ''} />`;

  return `import { ${cls} } from '${pkg}';\n\n${el}`;
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

/** One playground row: the name on the left (required marker and
 *  info tip beside it) and the control on the right. Type is implied by the
 *  control: a switch, a compact select, or a value edited in a popover. */
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
  const id = `prop-${control.name}`;
  const label = (
    <span className="flex min-w-0 items-center gap-1">
      <span className="truncate">{control.name}</span>
      {meta?.required && (
        <span className="text-[10px] text-rose-500 leading-none">*</span>
      )}
      {(meta?.description ?? control.desc) && (
        <PropInfo text={meta?.description ?? control.desc ?? ''} />
      )}
    </span>
  );

  if (control.kind === 'toggle') {
    return (
      <PropertySwitch
        ariaLabel={control.name}
        checked={Boolean(value)}
        id={id}
        label={label}
        onCheckedChange={onChange}
      />
    );
  }
  if (control.kind === 'select') {
    return (
      <PropertySelect
        ariaLabel={control.name}
        id={id}
        label={label}
        onValueChange={onChange}
        options={control.options ?? []}
        value={String(value ?? '')}
      />
    );
  }
  return (
    <PropertyText
      ariaLabel={control.name}
      id={id}
      label={label}
      onValueChange={(v) => onChange(control.kind === 'number' ? Number(v) : v)}
      type={control.kind === 'number' ? 'number' : 'text'}
      value={String(value ?? '')}
    />
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
            // A new iframe per URL: changing src on the same element adds a
            // browser history entry, which would hijack the back button.
            <iframe
              key={url}
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
          <PropInfo
            text={
              commands.registry === commands.npm
                ? 'Installs the bundled package from npm (no copy-paste registry item for this edition yet).'
                : 'First line copies the component source into your app via the registry; second installs the bundled package from npm.'
            }
          />
        </div>
        <CodeBlock
          code={
            commands.registry === commands.npm
              ? commands.npm
              : `${commands.registry}\n${commands.npm}`
          }
          language="bash"
        >
          <CodeBlockCopyButton />
        </CodeBlock>
      </div>
    </div>
  );
}

interface UrlState {
  component: string | null;
  showcase: ShowcaseView | null;
  dark: boolean;
  theme: string;
}

const SHOWCASE_VIEWS: ShowcaseView[] = ['rx', 'ng', 'ref'];

/** Reads the workbench screen and theme from the query string. */
function readUrlState(): UrlState {
  const q = new URLSearchParams(window.location.search);
  const view = q.get('showcase') as ShowcaseView | null;
  return {
    component: q.get('component'),
    showcase: view && SHOWCASE_VIEWS.includes(view) ? view : null,
    dark: q.get('mode') !== 'light',
    theme: q.get('theme') || 'default',
  };
}

/** Serializes the screen and theme; defaults are left out of the URL. */
function writeUrlState(s: {
  component: string;
  showcase: ShowcaseView | null;
  dark: boolean;
  theme: string;
}): string {
  const q = new URLSearchParams();
  if (s.showcase) q.set('showcase', s.showcase);
  else q.set('component', s.component);
  if (!s.dark) q.set('mode', 'light');
  if (s.theme !== 'default') q.set('theme', s.theme);
  return `?${q.toString()}`;
}

export function App() {
  const entries = useMemo(
    () => workbenchManifest(CONTRACTS, { ngRegistryItems: NG_REGISTRY_ITEMS }),
    [],
  );
  // The URL is the source of truth for where you are, so a refresh, a shared
  // link or the back button land on the same screen and theme.
  const initial = useMemo(() => readUrlState(), []);
  const [name, setName] = useState(
    entries.some((e) => e.name === initial.component)
      ? (initial.component as string)
      : (entries[0]?.name ?? ''),
  );
  const entry = entries.find((e) => e.name === name) ?? entries[0];
  const [values, setValues] = useState<Values>(() => defaults(entry));
  const [dark, setDark] = useState(initial.dark);
  const [theme, setTheme] = useState<string>(initial.theme);
  const [showcase, setShowcase] = useState<ShowcaseView | null>(
    initial.showcase,
  );

  // Screen changes push a history entry; theme and mode only replace it.
  useEffect(() => {
    const next = writeUrlState({ component: name, showcase, dark, theme });
    if (next === window.location.search) return;
    const was = readUrlState();
    const screen = (c: string | null, v: ShowcaseView | null) =>
      v ? `showcase:${v}` : `component:${c}`;
    // The first write only normalizes the URL the page was opened with.
    const pushed =
      window.location.search !== '' &&
      screen(was.component, was.showcase) !== screen(name, showcase);
    window.history[pushed ? 'pushState' : 'replaceState'](null, '', next);
  }, [name, showcase, dark, theme]);

  useEffect(() => {
    const onPop = () => {
      const s = readUrlState();
      const next = entries.find((e) => e.name === s.component);
      if (next) {
        setName(next.name);
        setValues(defaults(next));
      }
      setShowcase(s.showcase);
      setDark(s.dark);
      setTheme(s.theme);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [entries]);

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
    setShowcase(null);
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
            showcase={showcase}
            onShowcase={setShowcase}
          />

          {showcase && (
            <main data-showcase={showcase} className="min-h-0 min-w-0 flex-1">
              <iframe
                key={showcase}
                title={`Showcase: ${showcase === 'ref' ? 'Reference' : showcase === 'rx' ? 'React' : 'Angular'}`}
                className="size-full border-0"
                src={
                  showcase === 'ref'
                    ? REFERENCE_URL
                    : (storyUrl(
                        showcase === 'rx' ? RX_BASE : NG_BASE,
                        SHOWCASE_STORY,
                        {},
                        theme,
                        dark,
                      ) ?? undefined)
                }
              />
            </main>
          )}

          {/* Content: anatomy/guidance · props · React · Angular */}
          {/* A wrapper, not a class on the group: react-resizable-panels sets
              display:flex inline, which would override "hidden". */}
          <div
            className={cn('flex min-h-0 min-w-0 flex-1', showcase && 'hidden')}
          >
            <ResizablePanelGroup
              direction="horizontal"
              className="min-h-0 flex-1"
            >
              <ResizablePanel defaultSize={17} minSize={13}>
                <div className="flex h-full min-h-0 flex-col">
                  <div className="flex h-12 shrink-0 items-center border-b px-4">
                    <h2 className="font-semibold text-sm">
                      Anatomy & guidance
                    </h2>
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

              <ResizablePanel defaultSize={23} minSize={16}>
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
                  {/* Radix renders the viewport content as display:table, which grows to
                      the content's width; block keeps the rows inside the panel. */}
                  <ScrollArea className="min-h-0 flex-1 [&_[data-slot=scroll-area-viewport]>div]:!block">
                    <div className="p-4">
                      {entry.controls.length === 0 ? (
                        <p className="text-muted-foreground text-xs">
                          No interactive props for this component.
                        </p>
                      ) : (
                        <PropertyGroup>
                          {entry.controls.map((c) => (
                            <PropField
                              key={c.name}
                              control={c}
                              meta={metaByName.get(c.name)}
                              value={values[c.name]}
                              onChange={(v) => set(c.name, v)}
                            />
                          ))}
                        </PropertyGroup>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={30} minSize={20}>
                <FrameworkColumn
                  title="React"
                  edition="rx-*"
                  url={storyUrl(RX_BASE, entry.preview.rx, values, theme, dark)}
                  code={usageCode(entry, values, 'rx')}
                  language="tsx"
                  commands={entry.commands.rx}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={30} minSize={20}>
                <FrameworkColumn
                  title="Angular"
                  edition="ng-*"
                  url={storyUrl(NG_BASE, entry.preview.ng, values, theme, dark)}
                  code={usageCode(entry, values, 'ng')}
                  language="typescript"
                  commands={entry.commands.ng}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
