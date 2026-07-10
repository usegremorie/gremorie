'use client';

import type * as React from 'react';

import type { ChartConfig } from './chart';
import type { ChartDatum } from './types';

/**
 * Internal accessibility helpers shared by the styled charts — the computed
 * `aria-label` series labels and the `sr-only` data table required by
 * `docs/anatomy/charts.md` ("role=img figure + sr-only table, both editions").
 * Mirrors the Angular edition (`@gremorie/ng-data` styled charts) exactly:
 * same label derivation (`config[key].label ?? titleCaseKey(key)`), same
 * caption/thead/tbody structure. Not public API.
 */

/** Title-case a field key for a default label, e.g. `unique_users` → `Unique Users`. */
function titleCaseKey(key: string): string {
  return key.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/** The cycling categorical palette token for index `i` — same cycle as NG. */
export function paletteColor(i: number): string {
  return `var(--chart-${(i % 5) + 1})`;
}

/**
 * The visible legend under a polar chart — same `ul`/`li`/swatch markup and
 * classes as the NG polar hosts. Pie/radial pass one item per row
 * (`row[nameKey]` + `fill ?? palette`); radar passes one per series.
 */
export function ChartLegendList({
  items,
}: {
  items: readonly { name: React.ReactNode; color: string }[];
}) {
  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-[2px]"
            style={{ background: item.color }}
          />
          {item.name}
        </li>
      ))}
    </ul>
  );
}

export interface ChartSeriesView {
  key: string;
  /** Rendered header cell — the config label, falling back to the title-cased key. */
  header: React.ReactNode;
  /** Plain-text label for the computed `aria-label`. */
  labelText: string;
}

/** One view per series key: config label (or title-cased key) as node + text. */
export function seriesViews(
  config: ChartConfig,
  keys: readonly string[],
): ChartSeriesView[] {
  return keys.map((key) => {
    const label = config[key]?.label;
    return {
      key,
      header: label ?? titleCaseKey(key),
      labelText: typeof label === 'string' ? label : titleCaseKey(key),
    };
  });
}

export interface ChartDataTableProps {
  /** Table caption — the chart's computed `aria-label`. */
  caption: string;
  /** First column: the category/name field. Header shows the raw key, like NG. */
  labelKey: string;
  /** Value columns, one per series (or the single `dataKey` for pie/radial). */
  columns: readonly { key: string; header: React.ReactNode }[];
  /** Tabular rows. */
  data: readonly ChartDatum[];
}

/**
 * The `sr-only` table mirroring the chart data — rendered after the chart
 * container, exactly like the Angular edition's template.
 */
export function ChartDataTable({
  caption,
  labelKey,
  columns,
  data,
}: ChartDataTableProps) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th>{labelKey}</th>
          {columns.map((c) => (
            <th key={c.key}>{c.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td>{row[labelKey]}</td>
            {columns.map((c) => (
              <td key={c.key}>{row[c.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
