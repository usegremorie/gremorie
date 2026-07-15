'use client';

import {
  AreaChart,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  RadialChart,
  ScatterChart,
  type ChartConfig,
} from '@gremorie/rx-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@gremorie/rx-display';
import {
  ChartColumn,
  Copy,
  Bookmark,
  Download,
  Ellipsis,
  ImageDown,
  RefreshCw,
  Sheet,
  Table as TableIcon,
  type LucideIcon,
} from 'lucide-react';
import { useRef, useState } from 'react';

import {
  Artifact,
  ArtifactActions,
  ArtifactActionsCollapsed,
  ArtifactActionsExpanded,
  ArtifactContent,
  ArtifactDescription,
  ArtifactFeaturedIcon,
  ArtifactHeader,
  ArtifactHeading,
  ArtifactMenu,
  ArtifactTitle,
  ArtifactViewToggle,
} from '../artifact';

export type ChartArtifactDatum = Record<string, string | number>;
export type ChartArtifactView = 'chart' | 'table';
export type ChartArtifactColor = 'primary' | 'gray' | 'success' | 'error';

/** Which chart primitive the artifact embeds. */
export type ChartArtifactType =
  'bar' | 'area' | 'line' | 'pie' | 'radar' | 'radial' | 'scatter';

/** Categorical types render one row → one slice/bar, colored from the palette. */
const CATEGORICAL: ReadonlySet<ChartArtifactType> = new Set([
  'bar',
  'pie',
  'radial',
]);

export interface ChartArtifactSeries {
  /** Data field for this series. */
  key: string;
  /** Column / legend label (defaults to a title-cased key). */
  label?: string;
  /** Token color, e.g. `var(--chart-1)` (defaults to the cycling palette). */
  color?: string;
}

export interface ChartArtifactProps {
  /** Single-line heading. */
  title: string;
  /** Optional one-line supporting text (truncates if it overflows). */
  description?: string;
  /** Tabular rows: one object per category / point. */
  data: ChartArtifactDatum[];
  /** Chart primitive to embed. */
  type?: ChartArtifactType;
  /** Category / X field (first table column; x axis for cartesian, name for polar). */
  categoryKey: string;
  /**
   * Value field(s). A string for a single series (legacy / categorical), or an
   * array for multi-series (line/area/radar/scatter). Each becomes a table
   * column.
   */
  valueKey: string | ChartArtifactSeries[];
  /** Header label for the category column (defaults to a title-cased key). */
  categoryLabel?: string;
  /** Label for a single value series (defaults to a title-cased key). Ignored when `valueKey` is an array. */
  valueLabel?: string;
  /** Which view is shown first. */
  defaultView?: ChartArtifactView;
  /** `Intl.NumberFormat` options for value rendering (table + CSV + tooltip). */
  numberFormat?: Intl.NumberFormatOptions;
  /** Base name for downloaded files (no extension). */
  fileName?: string;
  /** Featured icon in the header. */
  icon?: LucideIcon;
  /** Featured icon color. */
  accent?: ChartArtifactColor;
  className?: string;
  /** Wired to the "Regenerate" item in the more menu. */
  onRegenerate?: () => void;
  /** Wired to the "Save" item in the more menu. */
  onSave?: () => void;
}

const titleCase = (s: string) =>
  s.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const paletteColor = (i: number) => `var(--chart-${(i % 5) + 1})`;

// ── download helpers (client-only) ───────────────────────────────────────────

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.rel = 'noopener';
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const csvCell = (v: unknown) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const SVG_STYLE_PROPS = [
  'fill',
  'fill-opacity',
  'stroke',
  'stroke-width',
  'stroke-opacity',
  'opacity',
  'font-family',
  'font-size',
  'font-weight',
  'text-anchor',
  'dominant-baseline',
];

/** Inline resolved styles onto a clone so a detached SVG rasterizes faithfully. */
function inlineComputedStyles(source: SVGSVGElement, clone: SVGSVGElement) {
  const src = [source, ...Array.from(source.querySelectorAll('*'))];
  const dst = [clone, ...Array.from(clone.querySelectorAll('*'))];
  src.forEach((el, i) => {
    const target = dst[i] as SVGElement | undefined;
    if (!target) return;
    const cs = getComputedStyle(el);
    let style = '';
    for (const prop of SVG_STYLE_PROPS) {
      const value = cs.getPropertyValue(prop);
      if (value) style += `${prop}:${value};`;
    }
    target.setAttribute('style', style);
    target.removeAttribute('class');
  });
}

function exportSvgToPng(svg: SVGSVGElement, fileName: string) {
  const rect = svg.getBoundingClientRect();
  const width = Math.max(1, Math.ceil(rect.width));
  const height = Math.max(1, Math.ceil(rect.height));
  const clone = svg.cloneNode(true) as SVGSVGElement;
  inlineComputedStyles(svg, clone);
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const xml = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(
    new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }),
  );
  const img = new Image();
  img.onload = () => {
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(scale, scale);
      const bg = getComputedStyle(svg).backgroundColor;
      if (bg && bg.startsWith('rgb') && !bg.includes(', 0)')) {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) downloadBlob(blob, `${fileName}.png`);
      }, 'image/png');
    }
    URL.revokeObjectURL(url);
  };
  img.onerror = () => URL.revokeObjectURL(url);
  img.src = url;
}

// ── artifact ─────────────────────────────────────────────────────────────────

/**
 * ChartArtifact — the Chart preset of the artifact shell.
 *
 * Embeds any of the styled chart primitives (bar, area, line, pie, radar,
 * radial, scatter) from rx-data inside the generic `Artifact`, with a working
 * chart ⇄ table toggle and downloads. The table is **wide**: one column per
 * value series (so multi-series charts like radar/line keep every value).
 * Because it embeds the chart primitives, any change to them reflects here.
 */
export function ChartArtifact({
  title,
  description,
  data,
  type = 'bar',
  categoryKey,
  valueKey,
  categoryLabel,
  valueLabel,
  defaultView = 'chart',
  numberFormat,
  fileName = 'chart',
  icon = ChartColumn,
  accent = 'primary',
  className,
  onRegenerate,
  onSave,
}: ChartArtifactProps) {
  const [view, setView] = useState<ChartArtifactView>(defaultView);
  const contentRef = useRef<HTMLDivElement>(null);

  const catLabel = categoryLabel ?? titleCase(categoryKey);
  const format = (n: number) =>
    new Intl.NumberFormat(undefined, numberFormat).format(n);

  const isCategorical = CATEGORICAL.has(type);

  // Normalize `valueKey` (string | series[]) into a series list.
  const series: Required<ChartArtifactSeries>[] = (
    typeof valueKey === 'string'
      ? [{ key: valueKey, label: valueLabel, color: undefined }]
      : valueKey
  ).map((s, i) => ({
    key: s.key,
    label: s.label ?? titleCase(s.key),
    color: s.color ?? paletteColor(i),
  }));
  const singleSeries = series.length === 1;

  // Chart `config` maps each series key → label + color.
  const config: ChartConfig = Object.fromEntries(
    series.map((s) => [s.key, { label: s.label, color: s.color }]),
  );

  // Categorical (bar/pie/radial): one palette color per ROW via each row's `fill`.
  const categoricalData = data.map((row, i) => ({
    ...row,
    fill: paletteColor(i),
  }));

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <AreaChart
            data={data}
            config={config}
            xKey={categoryKey}
            yAxis={false}
          />
        );
      case 'line':
        return (
          <LineChart
            data={data}
            config={config}
            xKey={categoryKey}
            yAxis={false}
          />
        );
      case 'scatter':
        return <ScatterChart data={data} config={config} xKey={categoryKey} />;
      case 'radar':
        return <RadarChart data={data} config={config} xKey={categoryKey} />;
      case 'pie':
        return (
          <PieChart
            data={categoricalData}
            config={config}
            nameKey={categoryKey}
            dataKey={series[0].key}
            donut
          />
        );
      case 'radial':
        return (
          <RadialChart
            data={categoricalData}
            config={config}
            nameKey={categoryKey}
            dataKey={series[0].key}
          />
        );
      default:
        return (
          <BarChart
            data={isCategorical && singleSeries ? categoricalData : data}
            config={config}
            xKey={categoryKey}
            yAxis={false}
          />
        );
    }
  };

  const exportImage = () => {
    const svg = contentRef.current?.querySelector('svg');
    if (svg && svg.getBoundingClientRect().width > 0) {
      exportSvgToPng(svg, fileName);
    }
  };

  const downloadImage = () => {
    if (view !== 'chart') {
      setView('chart');
      setTimeout(exportImage, 140);
    } else {
      exportImage();
    }
  };

  const downloadData = () => {
    const header = [catLabel, ...series.map((s) => s.label)];
    const rows = [
      header.map(csvCell).join(','),
      ...data.map((d) =>
        [csvCell(d[categoryKey]), ...series.map((s) => csvCell(d[s.key]))].join(
          ',',
        ),
      ),
    ];
    downloadBlob(
      new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' }),
      `${fileName}.csv`,
    );
  };

  const copyValues = () => {
    const text = data
      .map((d) =>
        [d[categoryKey], ...series.map((s) => format(Number(d[s.key])))].join(
          '\t',
        ),
      )
      .join('\n');
    void navigator.clipboard?.writeText(text);
  };

  // A leading color swatch only makes sense when each ROW has its own color
  // (categorical single-series) — not for multi-series, where color is per column.
  const rowSwatch = isCategorical && singleSeries;

  return (
    <Artifact className={className}>
      <ArtifactHeader>
        <ArtifactFeaturedIcon icon={icon} color={accent} />
        <ArtifactHeading>
          <ArtifactTitle>{title}</ArtifactTitle>
          {description ? (
            <ArtifactDescription>{description}</ArtifactDescription>
          ) : null}
        </ArtifactHeading>

        <ArtifactActions>
          {/* The view toggle stays at every width. */}
          <ArtifactViewToggle
            value={view}
            onValueChange={(v) => setView(v as ChartArtifactView)}
            options={[
              { value: 'chart', icon: ChartColumn, label: 'Chart view' },
              { value: 'table', icon: TableIcon, label: 'Table view' },
            ]}
          />

          {/* Wide card (≥448px): primary Download menu + secondary More menu. */}
          <ArtifactActionsExpanded>
            <ArtifactMenu
              icon={Download}
              label="Download"
              items={[
                {
                  label: 'Image (PNG)',
                  icon: ImageDown,
                  onSelect: downloadImage,
                },
                { label: 'Data (CSV)', icon: Sheet, onSelect: downloadData },
              ]}
            />
            <ArtifactMenu
              icon={Ellipsis}
              label="More actions"
              items={[
                { label: 'Copy values', icon: Copy, onSelect: copyValues },
                { label: 'Save', icon: Bookmark, onSelect: () => onSave?.() },
                'separator',
                {
                  label: 'Regenerate',
                  icon: RefreshCw,
                  onSelect: () => onRegenerate?.(),
                },
              ]}
            />
          </ArtifactActionsExpanded>

          {/* Narrow card (<448px): one More menu carrying every action. */}
          <ArtifactActionsCollapsed>
            <ArtifactMenu
              icon={Ellipsis}
              label="Actions"
              items={[
                {
                  label: 'Download image (PNG)',
                  icon: ImageDown,
                  onSelect: downloadImage,
                },
                {
                  label: 'Download data (CSV)',
                  icon: Sheet,
                  onSelect: downloadData,
                },
                'separator',
                { label: 'Copy values', icon: Copy, onSelect: copyValues },
                { label: 'Save', icon: Bookmark, onSelect: () => onSave?.() },
                'separator',
                {
                  label: 'Regenerate',
                  icon: RefreshCw,
                  onSelect: () => onRegenerate?.(),
                },
              ]}
            />
          </ArtifactActionsCollapsed>
        </ArtifactActions>
      </ArtifactHeader>

      <ArtifactContent>
        <div ref={contentRef}>
          {view === 'chart' ? (
            renderChart()
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{catLabel}</TableHead>
                  {series.map((s) => (
                    <TableHead key={s.key} className="text-right">
                      <span className="inline-flex items-center gap-1.5">
                        {!rowSwatch ? (
                          <span
                            aria-hidden
                            className="size-2.5 shrink-0 rounded-[3px]"
                            style={{ backgroundColor: s.color }}
                          />
                        ) : null}
                        {s.label}
                      </span>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <span className="flex items-center gap-2">
                        {rowSwatch ? (
                          <span
                            aria-hidden
                            className="size-2.5 shrink-0 rounded-[3px]"
                            style={{ backgroundColor: paletteColor(i) }}
                          />
                        ) : null}
                        {row[categoryKey]}
                      </span>
                    </TableCell>
                    {series.map((s) => (
                      <TableCell
                        key={s.key}
                        className="text-right tabular-nums"
                      >
                        {format(Number(row[s.key]))}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </ArtifactContent>
    </Artifact>
  );
}
