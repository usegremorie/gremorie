'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import type { TooltipValueType } from 'recharts';

import { cn } from '@gremorie/rx-core';

/**
 * Chart primitives — ported from shadcn/ui (new-york-v4), the proven recharts
 * wrapper, adapted to Gremorie (`cn` from `@gremorie/rx-core`; design tokens).
 *
 * This is the foundation every React (`rx-*`) chart composes on: `ChartContainer`
 * provides the responsive frame + per-series CSS color vars (`--color-<key>`),
 * `ChartTooltip`/`ChartTooltipContent` the hover card, `ChartLegend`/
 * `ChartLegendContent` the legend. Built on recharts so behaviour (axes,
 * scales, layout) is battle-tested instead of hand-rolled.
 *
 * The Angular (`ng-*`) charts mirror this anatomy/structure.
 */

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark' } as const;

const INITIAL_DIMENSION = { width: 320, height: 200 } as const;
type TooltipNameType = number | string;

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>;

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >['children'];
  initialDimension?: {
    width: number;
    height: number;
  };
}) {
  const uniqueId = React.useId();
  // `id` is caller-supplied and lands in a CSS attribute selector, so strip
  // anything outside the ident charset. This also normalises `useId()` across
  // React versions (18 emits `:r0:`, 19 emits `_r_0_`) and any custom
  // `identifierPrefix`.
  const chartId = `chart-${cssIdent(id ?? uniqueId)}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer
          initialDimension={initialDimension}
        >
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

/**
 * Strip everything outside the CSS ident charset. Used for values that end up
 * inside a selector or a custom-property name.
 */
function cssIdent(value: string): string {
  return value.replace(/[^A-Za-z0-9_-]/g, '');
}

/**
 * A deliberately conservative allowlist for CSS color values.
 *
 * Permits every notation the chart palette actually uses — `#rrggbb`,
 * `rgb()/hsl()/oklch()/lab()/color-mix()`, `var(--token)`, and bare keywords
 * like `transparent` — by allowing only alphanumerics, `#`, parentheses,
 * commas, dots, `%`, `/`, whitespace, `_` and `-`.
 *
 * Every character that could terminate the declaration or the rule is absent:
 * `;` `{` `}` `:` `<` `>` `"` `'` `\` `@` `*`. That blocks both CSS injection
 * (`red;background:url(https://attacker/?leak=…)`) and the HTML break-out
 * (`red}</style><img src=x onerror=…>`).
 */
const SAFE_CSS_COLOR = /^[A-Za-z0-9#(),./%\s_-]{1,128}$/;

function isSafeCssColor(color: string): boolean {
  return SAFE_CSS_COLOR.test(color);
}

/**
 * Emits the per-series `--color-<key>` custom properties, one rule per theme.
 *
 * ## Security
 *
 * `config` keys and colors may originate from model output (see
 * `ChartArtifact`, which maps `valueKey[].color` straight into a config).
 *
 * Two independent defences:
 *
 * 1. The CSS is passed as a **text child**, not via `dangerouslySetInnerHTML`.
 *    React escapes `</style` in text children (client-side it never parses as
 *    HTML at all), so a value cannot close the element and inject markup.
 * 2. Keys and colors are validated before interpolation, so a value cannot
 *    inject extra CSS declarations either.
 *
 * A series whose key or any of whose colors fails validation is dropped whole,
 * across every theme — never partially. A chart that renders a color in dark
 * mode but not light mode would be worse than one that falls back to the
 * default palette. Dropping never throws: a malformed color from a model must
 * not take down the chart.
 */
type ThemeName = keyof typeof THEMES;

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme ?? config.color,
  );

  if (!colorConfig.length || !id) {
    return null;
  }

  // Validate once per series rather than once per theme, so a single bad value
  // produces a single warning.
  const safeSeries: {
    key: string;
    colors: Partial<Record<ThemeName, string>>;
  }[] = [];

  for (const [key, itemConfig] of colorConfig) {
    const safeKey = cssIdent(key);
    const colors: Partial<Record<ThemeName, string>> = {};
    let usable = safeKey.length > 0 && safeKey === key;

    if (usable) {
      for (const theme of Object.keys(THEMES) as ThemeName[]) {
        const color = itemConfig.theme?.[theme] ?? itemConfig.color;
        if (!color) continue;
        if (!isSafeCssColor(color)) {
          usable = false;
          break;
        }
        colors[theme] = color;
      }
    }

    if (!usable) {
      // Warned unconditionally: this package ships raw tsc output, so it can
      // assume neither a bundler that inlines `process.env.NODE_ENV` nor a
      // runtime where `process` exists. A dropped series is rare and
      // security-relevant — worth surfacing in production too.
      console.warn(
        `[rx-data] ChartStyle dropped an unsafe series entry: ${JSON.stringify({ key })}`,
      );
      continue;
    }

    safeSeries.push({ key: safeKey, colors });
  }

  const css = (Object.entries(THEMES) as [ThemeName, string][])
    .map(([theme, prefix]) => {
      const declarations = safeSeries
        .filter((series) => series.colors[theme])
        .map((series) => `  --color-${series.key}: ${series.colors[theme]};`);

      if (!declarations.length) return null;

      return `${prefix} [data-chart="${id}"] {\n${declarations.join('\n')}\n}`;
    })
    .filter((rule): rule is string => rule !== null)
    .join('\n');

  if (!css) {
    return null;
  }

  return <style>{css}</style>;
};

const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<'div'> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: 'line' | 'dot' | 'dashed';
    nameKey?: string;
    labelKey?: string;
  } & Omit<
    RechartsPrimitive.DefaultTooltipContentProps<
      TooltipValueType,
      TooltipNameType
    >,
    'accessibilityLayer'
  >) {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? 'value'}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === 'string'
        ? (config[label]?.label ?? label)
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn('font-medium', labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      );
    }

    if (!value) {
      return null;
    }

    return <div className={cn('font-medium', labelClassName)}>{value}</div>;
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ]);

  if (!active || !payload?.length) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== 'dot';

  return (
    <div
      className={cn(
        'grid min-w-32 items-start gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-card-foreground shadow-md',
        className,
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload
          .filter((item) => item.type !== 'none')
          .map((item, index) => {
            const key = `${nameKey ?? item.name ?? item.dataKey ?? 'value'}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color ?? item.payload?.fill ?? item.color;

            return (
              <div
                key={index}
                className={cn(
                  'flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground',
                  indicator === 'dot' && 'items-center',
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            'shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)',
                            {
                              'h-2.5 w-2.5': indicator === 'dot',
                              'w-1': indicator === 'line',
                              'w-0 border-[1.5px] border-dashed bg-transparent':
                                indicator === 'dashed',
                              'my-0.5': nestLabel && indicator === 'dashed',
                            },
                          )}
                          style={
                            {
                              '--color-bg': indicatorColor,
                              '--color-border': indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        'flex flex-1 justify-between leading-none',
                        nestLabel ? 'items-end' : 'items-center',
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label ?? item.name}
                        </span>
                      </div>
                      {item.value != null && (
                        <span className="font-mono font-medium text-card-foreground tabular-nums">
                          {typeof item.value === 'number'
                            ? item.value.toLocaleString()
                            : String(item.value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = 'bottom',
  nameKey,
}: React.ComponentProps<'div'> & {
  hideIcon?: boolean;
  nameKey?: string;
} & RechartsPrimitive.DefaultLegendContentProps) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-4',
        verticalAlign === 'top' ? 'pb-3' : 'pt-3',
        className,
      )}
    >
      {payload
        .filter((item) => item.type !== 'none')
        .map((item, index) => {
          const key = `${nameKey ?? item.dataKey ?? 'value'}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={index}
              className={cn(
                'flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground',
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
    </div>
  );
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined;
  }

  const payloadPayload =
    'payload' in payload &&
    typeof payload.payload === 'object' &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === 'string'
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key];
}

export {
  ChartContainer,
  // Exposed so `ChartTooltipContent` / `ChartLegendContent` can be rendered
  // standalone (outside a `ChartContainer`) by providing the config directly —
  // e.g. isolated tooltip previews. Normal chart usage never needs this.
  ChartContext,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  useChart,
};
