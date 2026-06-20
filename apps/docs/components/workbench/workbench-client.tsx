'use client';

import {
  CONTRACTS,
  workbenchManifest,
  type WorkbenchControl,
  type WorkbenchEntry,
} from '@gremorie/contracts';
import { useMemo, useState } from 'react';

/**
 * Dual-framework component workbench: anatomy + contract-driven controls +
 * React and Angular live previews side by side. The controls drive BOTH
 * Storybook iframes in lockstep via the Storybook `args` URL param, so you can
 * sweep variants and compare RX vs NG without touching code.
 *
 * Previews embed the two unified Storybooks (React :4401, Angular :4400). In
 * dev, run `nx storybook rx-ai` + `nx storybook ng-ai`; in prod, point these
 * base URLs at the hosted static builds.
 */
const RX_BASE = 'http://localhost:4401';
const NG_BASE = 'http://localhost:4400';

type Values = Record<string, string | number | boolean>;

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
      typeof v === 'boolean' ? `${k}:!${v}` : `${k}:${encodeURIComponent(String(v))}`,
    );
  return parts.length ? `&args=${parts.join(';')}` : '';
}

function storyUrl(base: string, id: string | undefined, values: Values): string | null {
  if (!id) return null;
  return `${base}/iframe.html?id=${id}&viewMode=story${encodeArgs(values)}`;
}

const pascal = (s: string) =>
  s.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase());

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
      if (c.kind === 'toggle' || c.kind === 'number') return `[${c.name}]="${v}"`;
      return `${c.name}="${v}"`;
    })
    .filter(Boolean);
  return `<${entry.name} ${attrs.join(' ')} [data]="data" />`;
}

function Control({
  control,
  value,
  onChange,
}: {
  control: WorkbenchControl;
  value: string | number | boolean | undefined;
  onChange: (v: string | number | boolean) => void;
}) {
  const label = (
    <span className="text-fd-muted-foreground text-xs">{control.name}</span>
  );
  if (control.kind === 'select') {
    return (
      <label className="flex flex-col gap-1">
        {label}
        <select
          className="rounded-md border border-fd-border bg-fd-background px-2 py-1 text-sm"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        >
          {control.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </label>
    );
  }
  if (control.kind === 'toggle') {
    return (
      <label className="flex items-center justify-between gap-2">
        {label}
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
      </label>
    );
  }
  return (
    <label className="flex flex-col gap-1">
      {label}
      <input
        type={control.kind === 'number' ? 'number' : 'text'}
        className="rounded-md border border-fd-border bg-fd-background px-2 py-1 text-sm"
        value={String(value ?? '')}
        onChange={(e) =>
          onChange(control.kind === 'number' ? Number(e.target.value) : e.target.value)
        }
      />
    </label>
  );
}

function PreviewColumn({
  title,
  url,
  code,
  commands,
}: {
  title: string;
  url: string | null;
  code: string;
  commands: { registry: string; npm: string };
}) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  return (
    <div className="flex min-w-0 flex-col rounded-lg border border-fd-border">
      <div className="flex items-center gap-1 border-b border-fd-border px-2 py-1.5">
        <span className="mr-auto text-sm font-medium">{title}</span>
        {(['preview', 'code'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded px-2 py-0.5 text-xs ${tab === t ? 'bg-fd-primary/10 text-fd-primary' : 'text-fd-muted-foreground'}`}
          >
            {t === 'preview' ? 'Preview' : 'Code'}
          </button>
        ))}
      </div>
      <div className="min-h-[280px] p-2">
        {tab === 'preview' ? (
          url ? (
            <iframe
              title={`${title} preview`}
              src={url}
              className="h-[320px] w-full rounded border border-fd-border bg-white"
            />
          ) : (
            <p className="text-fd-muted-foreground text-sm">No story id for this edition.</p>
          )
        ) : (
          <pre className="overflow-auto rounded bg-fd-muted/40 p-2 text-xs">
            <code>{code}</code>
          </pre>
        )}
      </div>
      <div className="border-t border-fd-border px-2 py-1.5 font-mono text-[11px] text-fd-muted-foreground">
        <div>$ {commands.registry}</div>
        <div>$ {commands.npm}</div>
      </div>
    </div>
  );
}

export function WorkbenchClient() {
  const entries = useMemo(() => workbenchManifest(CONTRACTS), []);
  const [name, setName] = useState(entries[0]?.name ?? '');
  const entry = entries.find((e) => e.name === name) ?? entries[0];
  const [values, setValues] = useState<Values>(() => defaults(entry));

  if (!entry) return <p className="p-6">No component contracts found.</p>;

  const set = (k: string, v: string | number | boolean) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6">
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-xl font-semibold">Workbench</h1>
        <select
          className="rounded-md border border-fd-border bg-fd-background px-2 py-1 text-sm"
          value={name}
          onChange={(e) => {
            const next = entries.find((x) => x.name === e.target.value) ?? entry;
            setName(e.target.value);
            setValues(defaults(next));
          }}
        >
          {entries.map((e) => (
            <option key={e.name} value={e.name}>
              {e.name} ({e.category})
            </option>
          ))}
        </select>
        <span className="text-fd-muted-foreground text-xs">
          Controls drive both Storybook iframes in lockstep.
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[220px_220px_1fr_1fr]">
        <section className="rounded-lg border border-fd-border p-3">
          <h2 className="mb-2 text-sm font-medium">Anatomy</h2>
          <pre className="overflow-auto whitespace-pre font-mono text-[11px] leading-relaxed text-fd-muted-foreground">
            {entry.anatomy.trim()}
          </pre>
        </section>

        <section className="rounded-lg border border-fd-border p-3">
          <h2 className="mb-3 text-sm font-medium">Props (controls)</h2>
          <div className="flex flex-col gap-3">
            {entry.controls.map((c) => (
              <Control key={c.name} control={c} value={values[c.name]} onChange={(v) => set(c.name, v)} />
            ))}
          </div>
        </section>

        <PreviewColumn
          title="React"
          url={storyUrl(RX_BASE, entry.preview.rx, values)}
          code={rxCode(entry, values)}
          commands={entry.commands.rx}
        />
        <PreviewColumn
          title="Angular"
          url={storyUrl(NG_BASE, entry.preview.ng, values)}
          code={ngCode(entry, values)}
          commands={entry.commands.ng}
        />
      </div>
    </div>
  );
}
