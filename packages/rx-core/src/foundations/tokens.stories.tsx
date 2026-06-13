import type { Meta, StoryObj } from '@storybook/react';
import { formatHex, oklch as toOklch } from 'culori';
import { type ReactNode, useEffect, useMemo, useState } from 'react';

// Raw token source - parsed for the Primitive scales so the table is COMPLETE
// and never tree-shaken (Tailwind v4 `@theme` only emits CSS vars for primitives
// that some utility references, so reading computed CSS would drop unused steps).
// Reading the source keeps it accurate with zero drift.
// @ts-expect-error - Vite `?raw` import, typed by the bundler not tsc.
import themeCssRaw from '@gremorie/tokens/theme.css?raw';

/**
 * Tokens - a LIVE reference for the Gremorie two-tier color system.
 *
 * Every value here is read from the actual computed CSS at render time, so it
 * never drifts from `@gremorie/tokens` (theme.css). Switch the **Theme** and
 * **Mode (Light/Dark)** toolbars above and the tables recolor instantly - the
 * same `data-theme` / `.dark` mechanism the whole app uses. Same no-drift
 * principle as the docs ComponentPreview: read the source of truth, never a
 * hand-copied snapshot.
 */

// ── Live colour resolution ──────────────────────────────────────────────────
// Resolve a batch of `var(--token)` expressions to their rendered colour in a
// single reflow. Missing tokens fall back to `transparent` so we can drop them.
type Resolved = { rgb: string; hex: string; oklch: string };

function resolveMany(cssVars: string[]): Record<string, Resolved | null> {
  const host = document.createElement('div');
  host.style.cssText = 'position:absolute;left:-9999px;top:-9999px;';
  const probes = cssVars.map((v) => {
    const span = document.createElement('span');
    span.style.color = `var(${v}, transparent)`;
    host.appendChild(span);
    return span;
  });
  document.body.appendChild(host);

  const out: Record<string, Resolved | null> = {};
  cssVars.forEach((v, i) => {
    const rgb = getComputedStyle(probes[i] as Element).color;
    if (!rgb || rgb === 'rgba(0, 0, 0, 0)' || rgb === 'transparent') {
      out[v] = null;
      return;
    }
    const okl = toOklch(rgb);
    out[v] = {
      rgb,
      hex: formatHex(rgb) ?? rgb,
      oklch: okl
        ? `oklch(${okl.l.toFixed(3)} ${okl.c.toFixed(3)} ${(okl.h ?? 0).toFixed(1)})`
        : '',
    };
  });

  document.body.removeChild(host);
  return out;
}

// Re-render the tables whenever the Theme/Dark toolbars mutate the root.
function useThemeTick(): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const obs = new MutationObserver(() => setTick((t) => t + 1));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });
    return () => obs.disconnect();
  }, []);
  return tick;
}

// ── Table primitives ────────────────────────────────────────────────────────
type Row = { token: string; className: string; primitive?: string };

const cellStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderBottom: '1px solid var(--border)',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};
const headStyle: React.CSSProperties = {
  ...cellStyle,
  fontWeight: 600,
  color: 'var(--muted-foreground)',
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};
const mono: React.CSSProperties = {
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
  fontSize: 12,
};

function Swatch({ token }: { token: string }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        width: 28,
        height: 28,
        borderRadius: 6,
        background: `var(${token})`,
        border: '1px solid var(--border)',
        boxShadow: 'inset 0 0 0 1px rgb(0 0 0 / 0.03)',
        verticalAlign: 'middle',
      }}
    />
  );
}

function ColorTable({
  rows,
  withPrimitive,
}: {
  rows: Row[];
  withPrimitive?: boolean;
}) {
  const tick = useThemeTick();
  // `tick` re-runs the resolve when the Theme/Dark toolbars mutate the root.
  const resolved = useMemo(
    () => resolveMany(rows.map((r) => r.token)),
    [rows, tick],
  );

  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          borderCollapse: 'collapse',
          width: '100%',
          color: 'var(--foreground)',
        }}
      >
        <thead>
          <tr>
            <th style={headStyle}>Sample</th>
            <th style={headStyle}>CSS Token</th>
            <th style={headStyle}>Class</th>
            {withPrimitive ? <th style={headStyle}>Primitive (base)</th> : null}
            <th style={headStyle}>OKLCH</th>
            <th style={headStyle}>Hex</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const v = resolved[r.token];
            if (!v) return null;
            return (
              <tr key={r.token}>
                <td style={cellStyle}>
                  <Swatch token={r.token} />
                </td>
                <td style={{ ...cellStyle, ...mono }}>{r.token}</td>
                <td
                  style={{
                    ...cellStyle,
                    ...mono,
                    color: 'var(--muted-foreground)',
                  }}
                >
                  {r.className}
                </td>
                {withPrimitive ? (
                  <td
                    style={{
                      ...cellStyle,
                      ...mono,
                      color: 'var(--muted-foreground)',
                    }}
                  >
                    {r.primitive ?? '—'}
                  </td>
                ) : null}
                <td style={{ ...cellStyle, ...mono }}>{v.oklch}</td>
                <td style={{ ...cellStyle, ...mono }}>{v.hex}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h3
        style={{
          color: 'var(--foreground)',
          fontSize: 14,
          fontWeight: 600,
          margin: '0 0 8px',
        }}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

function Page({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        padding: 24,
        background: 'var(--background)',
        color: 'var(--foreground)',
        minHeight: '100vh',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
      }}
    >
      {children}
    </div>
  );
}

// ── Token data (names + base-theme primitive refs from tokens/theme.css) ─────
const SEMANTIC_CORE: Row[] = [
  {
    token: '--background',
    className: 'bg-background',
    primitive: '--color-gray-50',
  },
  {
    token: '--foreground',
    className: 'text-foreground',
    primitive: '--color-gray-950',
  },
  { token: '--card', className: 'bg-card', primitive: '--color-gray-0' },
  {
    token: '--card-foreground',
    className: 'text-card-foreground',
    primitive: '--foreground',
  },
  { token: '--popover', className: 'bg-popover', primitive: '--color-gray-0' },
  {
    token: '--popover-foreground',
    className: 'text-popover-foreground',
    primitive: '--foreground',
  },
  {
    token: '--primary',
    className: 'bg-primary',
    primitive: '--color-gray-900',
  },
  {
    token: '--primary-foreground',
    className: 'text-primary-foreground',
    primitive: '--color-gray-50',
  },
  {
    token: '--secondary',
    className: 'bg-secondary',
    primitive: '--color-gray-100',
  },
  {
    token: '--secondary-foreground',
    className: 'text-secondary-foreground',
    primitive: '--color-gray-900',
  },
  { token: '--muted', className: 'bg-muted', primitive: '--color-gray-100' },
  {
    token: '--muted-foreground',
    className: 'text-muted-foreground',
    primitive: '--color-gray-500',
  },
  { token: '--accent', className: 'bg-accent', primitive: '--color-gray-100' },
  {
    token: '--accent-foreground',
    className: 'text-accent-foreground',
    primitive: '--color-gray-900',
  },
  {
    token: '--destructive',
    className: 'bg-destructive',
    primitive: '--color-red-600',
  },
  {
    token: '--destructive-foreground',
    className: 'text-destructive-foreground',
    primitive: '--color-gray-50',
  },
  {
    token: '--success',
    className: 'bg-success',
    primitive: 'oklch(0.65 0.18 145)',
  },
  {
    token: '--success-foreground',
    className: 'text-success-foreground',
    primitive: '--color-gray-50',
  },
  {
    token: '--border',
    className: 'border-border',
    primitive: '--color-gray-200',
  },
  {
    token: '--input',
    className: 'border-input',
    primitive: '--color-gray-200',
  },
  { token: '--ring', className: 'ring-ring', primitive: '--color-gray-400' },
];

const SEMANTIC_SIDEBAR: Row[] = [
  { token: '--sidebar', className: 'bg-sidebar', primitive: '--color-gray-50' },
  {
    token: '--sidebar-foreground',
    className: 'text-sidebar-foreground',
    primitive: '--color-gray-950',
  },
  {
    token: '--sidebar-primary',
    className: 'bg-sidebar-primary',
    primitive: '--color-gray-900',
  },
  {
    token: '--sidebar-primary-foreground',
    className: 'text-sidebar-primary-foreground',
    primitive: '--color-gray-50',
  },
  {
    token: '--sidebar-accent',
    className: 'bg-sidebar-accent',
    primitive: '--color-gray-100',
  },
  {
    token: '--sidebar-accent-foreground',
    className: 'text-sidebar-accent-foreground',
    primitive: '--color-gray-900',
  },
  {
    token: '--sidebar-border',
    className: 'border-sidebar-border',
    primitive: '--color-gray-200',
  },
  {
    token: '--sidebar-ring',
    className: 'ring-sidebar-ring',
    primitive: '--color-gray-400',
  },
];

const SEMANTIC_CHART: Row[] = [1, 2, 3, 4, 5].map((n) => ({
  token: `--chart-${n}`,
  className: `bg-chart-${n}`,
  primitive: 'data-viz scale',
}));

// Primitive scales: gray leads (the workhorse neutral), then the rest. Display
// order only; the actual steps come from the parsed source.
const FAMILIES = [
  'gray',
  'neutral',
  'slate',
  'zinc',
  'stone',
  'red',
  'rose',
  'pink',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'clay',
  'taupe',
  'mauve',
  'olive',
  'mist',
];

type PrimRow = { token: string; className: string; value: string; hex: string };

// Parse every `--color-<family>-<step>: <value>;` from the token source.
const PRIMITIVES: Record<string, PrimRow[]> = (() => {
  const re = /--color-([a-z]+)-(0|\d{2,3}):\s*([^;]+);/g;
  const map: Record<string, PrimRow[]> = {};
  const src = String(themeCssRaw);
  let m: RegExpExecArray | null = re.exec(src);
  while (m !== null) {
    const [, family, step, rawValue] = m;
    const value = rawValue
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .trim();
    (map[family] ??= []).push({
      token: `--color-${family}-${step}`,
      className: `bg-${family}-${step}`,
      value,
      hex: formatHex(value) ?? '',
    });
    m = re.exec(src);
  }
  return map;
})();

// Static table for primitives: the swatch uses the literal source value, so it
// renders even for steps Tailwind tree-shook out of the emitted CSS vars.
function StaticColorTable({ rows }: { rows: PrimRow[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          borderCollapse: 'collapse',
          width: '100%',
          color: 'var(--foreground)',
        }}
      >
        <thead>
          <tr>
            <th style={headStyle}>Sample</th>
            <th style={headStyle}>CSS Token</th>
            <th style={headStyle}>Class</th>
            <th style={headStyle}>OKLCH</th>
            <th style={headStyle}>Hex</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.token}>
              <td style={cellStyle}>
                <span
                  aria-hidden
                  style={{
                    display: 'inline-block',
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: r.value,
                    border: '1px solid var(--border)',
                    verticalAlign: 'middle',
                  }}
                />
              </td>
              <td style={{ ...cellStyle, ...mono }}>{r.token}</td>
              <td
                style={{
                  ...cellStyle,
                  ...mono,
                  color: 'var(--muted-foreground)',
                }}
              >
                {r.className}
              </td>
              <td style={{ ...cellStyle, ...mono }}>{r.value}</td>
              <td style={{ ...cellStyle, ...mono }}>{r.hex}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Meta ────────────────────────────────────────────────────────────────────
const meta: Meta = {
  title: 'Tokens/Colors',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};
export default meta;
type Story = StoryObj;

/** Overview - the two-tier model and the class-based dark-mode rule. */
export const Overview: Story = {
  name: 'Overview',
  render: () => (
    <Page>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px' }}>
        Color tokens
      </h2>
      <p
        style={{
          maxWidth: 640,
          lineHeight: 1.6,
          color: 'var(--muted-foreground)',
        }}
      >
        Two tiers.{' '}
        <strong style={{ color: 'var(--foreground)' }}>Primitives</strong> are
        the raw palette (<code style={mono}>--color-gray-500</code>, …).{' '}
        <strong style={{ color: 'var(--foreground)' }}>Semantics</strong> are
        what components consume (<code style={mono}>--card</code>,{' '}
        <code style={mono}>--primary</code>, …) and reference a primitive.
        Components use semantics only - never raw primitives, never hardcoded
        hex/oklch.
      </p>
      <p
        style={{
          maxWidth: 640,
          lineHeight: 1.6,
          color: 'var(--muted-foreground)',
        }}
      >
        Dark mode is the{' '}
        <strong style={{ color: 'var(--foreground)' }}>.dark class</strong>, not{' '}
        <code style={mono}>@media (prefers-color-scheme: dark)</code>. The
        Tailwind <code style={mono}>dark:</code> variant is bound to that class
        once, in <code style={mono}>@gremorie/tokens/theme.css</code>, so OS
        preference can never fire dark utilities on a light theme.
      </p>
      <p
        style={{
          maxWidth: 640,
          lineHeight: 1.6,
          color: 'var(--muted-foreground)',
        }}
      >
        Use the <strong style={{ color: 'var(--foreground)' }}>Theme</strong>{' '}
        and <strong style={{ color: 'var(--foreground)' }}>Mode</strong>{' '}
        toolbars above - every table on the Semantic and Primitive pages
        recolors live.
      </p>
    </Page>
  ),
};

/**
 * Semantic - what components consume. The OKLCH/Hex columns are live: switch
 * Theme/Mode in the toolbar to read any theme in light or dark.
 */
export const Semantic: Story = {
  name: 'Semantic',
  render: () => (
    <Page>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px' }}>
        Semantic color tokens
      </h2>
      <p
        style={{
          margin: '0 0 20px',
          color: 'var(--muted-foreground)',
          fontSize: 13,
        }}
      >
        Live values for the active Theme/Mode. The Primitive column shows the
        base-theme reference; named themes may remap it.
      </p>
      <Section title="Core">
        <ColorTable rows={SEMANTIC_CORE} withPrimitive />
      </Section>
      <Section title="Sidebar">
        <ColorTable rows={SEMANTIC_SIDEBAR} withPrimitive />
      </Section>
      <Section title="Chart">
        <ColorTable rows={SEMANTIC_CHART} withPrimitive />
      </Section>
    </Page>
  ),
};

/** Primitive - the raw palette scales (50..950). Live values per active theme. */
export const Primitive: Story = {
  name: 'Primitive',
  render: () => (
    <Page>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px' }}>
        Primitive color scales
      </h2>
      <p
        style={{
          margin: '0 0 20px',
          color: 'var(--muted-foreground)',
          fontSize: 13,
        }}
      >
        Layer 1. Components never consume these directly - they flow into
        semantics. Steps with no value for a family are omitted.
      </p>
      {FAMILIES.filter((family) => PRIMITIVES[family]?.length).map((family) => (
        <Section key={family} title={family}>
          <StaticColorTable rows={PRIMITIVES[family]} />
        </Section>
      ))}
    </Page>
  ),
};
