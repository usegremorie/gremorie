"use client";

import {
  Bar,
  bandScale,
  CartesianGrid,
  ChartFrame,
  useChart,
  XAxis,
} from "@gremorie/rx-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gremorie/rx-display";
import { Button, ToggleGroup, ToggleGroupItem } from "@gremorie/rx-forms";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@gremorie/rx-overlays";
import {
  Bookmark,
  ChartColumn,
  Copy,
  Download,
  Ellipsis,
  ImageDown,
  RefreshCw,
  Sheet,
  Table as TableIcon,
} from "lucide-react";
import { useRef, useState } from "react";

import {
  Artifact,
  ArtifactActions,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
} from "../artifact";

/**
 * Categorical palette (one color per bar/category), mapped to the chart
 * tokens. Cycles for datasets with more than five categories.
 */
export const CHART_ARTIFACT_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

const colorAt = (i: number) =>
  CHART_ARTIFACT_COLORS[i % CHART_ARTIFACT_COLORS.length];

export type ChartArtifactDatum = Record<string, string | number>;

export type ChartArtifactView = "chart" | "table";

export interface ChartArtifactProps {
  /** Single-line heading. */
  title: string;
  /** Optional one-line supporting text (truncates if it overflows). */
  description?: string;
  /** Tabular rows: one object per category. */
  data: ChartArtifactDatum[];
  /** Field used for the category (x axis / first table column). */
  categoryKey: string;
  /** Numeric field plotted as the bar height. */
  valueKey: string;
  /** Header label for the category column (defaults to a title-cased key). */
  categoryLabel?: string;
  /** Header label for the value column (defaults to a title-cased key). */
  valueLabel?: string;
  /** Which view is shown first. */
  defaultView?: ChartArtifactView;
  /** `Intl.NumberFormat` options for value rendering (table + image). */
  numberFormat?: Intl.NumberFormatOptions;
  /** Base name for downloaded files (no extension). */
  fileName?: string;
  className?: string;
  /** Wired to the "Regenerate" item in the more menu. */
  onRegenerate?: () => void;
  /** Wired to the "Save" item in the more menu. */
  onSave?: () => void;
}

const titleCase = (s: string) =>
  s.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// ── download helpers (client-only) ───────────────────────────────────────────

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.rel = "noopener";
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const csvCell = (v: unknown) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** Computed style props worth inlining so a detached SVG renders faithfully. */
const SVG_STYLE_PROPS = [
  "fill",
  "fill-opacity",
  "stroke",
  "stroke-width",
  "stroke-opacity",
  "stroke-dasharray",
  "opacity",
  "font-family",
  "font-size",
  "font-weight",
  "text-anchor",
  "dominant-baseline",
];

/**
 * Copy resolved (CSS-variable- and class-free) styles from a live SVG tree
 * onto a clone, so it can be serialized and rasterized off-DOM with the same
 * colors and type.
 */
function inlineComputedStyles(source: SVGSVGElement, clone: SVGSVGElement) {
  const src = [source, ...Array.from(source.querySelectorAll("*"))];
  const dst = [clone, ...Array.from(clone.querySelectorAll("*"))];
  src.forEach((el, i) => {
    const target = dst[i] as SVGElement | undefined;
    if (!target) return;
    const cs = getComputedStyle(el);
    let style = "";
    for (const prop of SVG_STYLE_PROPS) {
      const value = cs.getPropertyValue(prop);
      if (value) style += `${prop}:${value};`;
    }
    target.setAttribute("style", style);
    target.removeAttribute("class");
  });
}

function exportSvgToPng(svg: SVGSVGElement, fileName: string) {
  const rect = svg.getBoundingClientRect();
  const width = Math.max(1, Math.ceil(rect.width));
  const height = Math.max(1, Math.ceil(rect.height));

  const clone = svg.cloneNode(true) as SVGSVGElement;
  inlineComputedStyles(svg, clone);
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const xml = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(
    new Blob([xml], { type: "image/svg+xml;charset=utf-8" })
  );

  const img = new Image();
  img.onload = () => {
    const scale = 2; // retina-ish export
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(scale, scale);
      // Solid backdrop when we can resolve one; transparent otherwise.
      const bg = getComputedStyle(svg).backgroundColor;
      if (bg && bg.startsWith("rgb") && !bg.includes(", 0)")) {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) downloadBlob(blob, `${fileName}.png`);
      }, "image/png");
    }
    URL.revokeObjectURL(url);
  };
  img.onerror = () => URL.revokeObjectURL(url);
  img.src = url;
}

// ── chart + table views ──────────────────────────────────────────────────────

interface ViewProps {
  data: ChartArtifactDatum[];
  categoryKey: string;
  valueKey: string;
  categoryLabel: string;
  valueLabel: string;
  format: (n: number) => string;
}

/** Tight gutters — no Y axis (shadcn-style), small room for X labels. */
const CHART_MARGIN = { top: 20, right: 8, bottom: 24, left: 8 };

/** A bar with only its TOP corners rounded (clean, not blocky). */
function barPath(x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.max(0, Math.min(r, w / 2, h));
  return `M${x},${y + h}L${x},${y + rr}Q${x},${y} ${x + rr},${y}L${x + w - rr},${y}Q${x + w},${y} ${x + w},${y + rr}L${x + w},${y + h}Z`;
}

interface HoverState {
  i: number;
  cx: number;
  top: number;
}

/** Faint band behind the hovered category — the shadcn "cursor". */
function BandHighlight({ index }: { index: number | null }) {
  const ctx = useChart();
  if (index == null) return null;
  const cats = ctx.data.map((d) => String(d[ctx.xKey]));
  const band = bandScale(cats, [ctx.plotLeft, ctx.plotRight], 0.2);
  const bx = band(cats[index]);
  return (
    <rect
      x={bx}
      y={ctx.plotTop}
      width={band.bandwidth}
      height={ctx.plotBottom - ctx.plotTop}
      rx={6}
      fill="currentColor"
      fillOpacity={0.08}
    />
  );
}

/** Transparent per-category hit areas spanning the full plot height. */
function HoverCapture({
  valueKey,
  onHover,
}: {
  valueKey: string;
  onHover: (h: HoverState | null) => void;
}) {
  const ctx = useChart();
  const cats = ctx.data.map((d) => String(d[ctx.xKey]));
  const band = bandScale(cats, [ctx.plotLeft, ctx.plotRight], 0.2);
  return (
    <g onMouseLeave={() => onHover(null)}>
      {ctx.data.map((d, i) => {
        const bx = band(cats[i]);
        return (
          <rect
            key={i}
            x={bx}
            y={ctx.plotTop}
            width={band.bandwidth}
            height={ctx.plotBottom - ctx.plotTop}
            fill="transparent"
            onMouseEnter={() =>
              onHover({
                i,
                cx: bx + band.bandwidth / 2,
                top: ctx.yScale(Number(d[valueKey])),
              })
            }
          />
        );
      })}
    </g>
  );
}

function ChartView({
  data,
  categoryKey,
  valueKey,
  valueLabel,
  format,
}: ViewProps) {
  const [hover, setHover] = useState<HoverState | null>(null);
  const ariaLabel = `Bar chart of ${valueKey} by ${categoryKey}`;
  const above = hover ? hover.top >= 60 : true;

  return (
    <figure role="img" aria-label={ariaLabel} className="relative m-0">
      <ChartFrame
        data={data}
        xKey={categoryKey}
        margin={CHART_MARGIN}
        className="aspect-[5/3] w-full overflow-visible text-muted-foreground"
      >
        <CartesianGrid>
          {(lines) =>
            lines.map((l, i) => (
              <line
                key={i}
                x1={l.x1}
                x2={l.x2}
                y1={l.y}
                y2={l.y}
                stroke="currentColor"
                strokeOpacity={0.1}
              />
            ))
          }
        </CartesianGrid>

        <BandHighlight index={hover?.i ?? null} />

        <Bar dataKey={valueKey}>
          {(rects) =>
            rects.map((r, i) => (
              <path
                key={i}
                d={barPath(r.x, r.y, r.width, r.height, 6)}
                fill={colorAt(i)}
              />
            ))
          }
        </Bar>

        <XAxis>
          {({ ticks, labelY }) =>
            ticks.map((t) => (
              <text
                key={t.label}
                x={t.x}
                y={labelY}
                textAnchor="middle"
                className="fill-muted-foreground text-[11px]"
              >
                {t.label}
              </text>
            ))
          }
        </XAxis>

        <HoverCapture valueKey={valueKey} onHover={setHover} />
      </ChartFrame>

      {hover ? (
        <div
          role="tooltip"
          className="pointer-events-none absolute z-10 min-w-32 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-md"
          style={{
            left: hover.cx,
            top: above ? hover.top - 10 : hover.top + 10,
            transform: `translate(-50%, ${above ? "-100%" : "0"})`,
          }}
        >
          <div className="mb-1 font-medium text-foreground">
            {String(data[hover.i][categoryKey])}
          </div>
          <div className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="size-2.5 shrink-0 rounded-[3px]"
              style={{ backgroundColor: colorAt(hover.i) }}
            />
            <span className="text-muted-foreground">{valueLabel}</span>
            <span className="ml-3 font-medium tabular-nums text-foreground">
              {format(Number(data[hover.i][valueKey]))}
            </span>
          </div>
        </div>
      ) : null}

      <figcaption className="sr-only">
        {data
          .map((d) => `${d[categoryKey]}: ${format(Number(d[valueKey]))}`)
          .join(", ")}
      </figcaption>
    </figure>
  );
}

function TableView({
  data,
  categoryKey,
  valueKey,
  categoryLabel,
  valueLabel,
  format,
}: ViewProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{categoryLabel}</TableHead>
          <TableHead className="text-right">{valueLabel}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium">
              <span className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="size-2.5 shrink-0 rounded-[3px]"
                  style={{ backgroundColor: colorAt(i) }}
                />
                {row[categoryKey]}
              </span>
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {format(Number(row[valueKey]))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ── artifact ─────────────────────────────────────────────────────────────────

/**
 * ChartArtifact — a schema-driven bar chart rendered as a Gremorie artifact.
 *
 * Header: a title + one-line description, a chart/table segmented toggle, a
 * single Download button (opens a menu: image PNG / data CSV), and a more
 * menu. Bars use the categorical chart palette; the table mirrors the colors.
 * Composes existing primitives only (Artifact, rx-data headless chart, Table,
 * ToggleGroup, DropdownMenu, Button).
 */
export function ChartArtifact({
  title,
  description,
  data,
  categoryKey,
  valueKey,
  categoryLabel,
  valueLabel,
  defaultView = "chart",
  numberFormat,
  fileName = "chart",
  className,
  onRegenerate,
  onSave,
}: ChartArtifactProps) {
  const [view, setView] = useState<ChartArtifactView>(defaultView);
  const chartRef = useRef<HTMLDivElement>(null);

  const catLabel = categoryLabel ?? titleCase(categoryKey);
  const valLabel = valueLabel ?? titleCase(valueKey);
  const format = (n: number) =>
    new Intl.NumberFormat(undefined, numberFormat).format(n);

  const viewProps: ViewProps = {
    data,
    categoryKey,
    valueKey,
    categoryLabel: catLabel,
    valueLabel: valLabel,
    format,
  };

  const exportImage = () => {
    const svg = chartRef.current?.querySelector("svg");
    if (svg && svg.getBoundingClientRect().width > 0) {
      exportSvgToPng(svg, fileName);
    }
  };

  const downloadImage = () => {
    if (view !== "chart") {
      // Image only exists in the chart view — switch, then export next frame.
      setView("chart");
      setTimeout(exportImage, 140);
    } else {
      exportImage();
    }
  };

  const downloadData = () => {
    const rows = [
      [catLabel, valLabel].map(csvCell).join(","),
      ...data.map((d) =>
        [csvCell(d[categoryKey]), csvCell(d[valueKey])].join(",")
      ),
    ];
    downloadBlob(
      new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" }),
      `${fileName}.csv`
    );
  };

  const copyValues = () => {
    const text = data
      .map((d) => `${d[categoryKey]}\t${format(Number(d[valueKey]))}`)
      .join("\n");
    void navigator.clipboard?.writeText(text);
  };

  return (
    <Artifact className={className}>
      <ArtifactHeader className="gap-3">
        <div className="min-w-0 flex-1">
          <ArtifactTitle className="truncate text-[0.9375rem]">
            {title}
          </ArtifactTitle>
          {description ? (
            <ArtifactDescription className="truncate">
              {description}
            </ArtifactDescription>
          ) : null}
        </div>

        <ArtifactActions className="shrink-0">
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(v) => v && setView(v as ChartArtifactView)}
            variant="outline"
            size="sm"
            className="mr-1"
          >
            <ToggleGroupItem value="chart" aria-label="Chart view">
              <ChartColumn className="size-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="table" aria-label="Table view">
              <TableIcon className="size-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Download"
              >
                <Download className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Download</DropdownMenuLabel>
              <DropdownMenuItem onSelect={downloadImage}>
                <ImageDown className="size-4" />
                Image (PNG)
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={downloadData}>
                <Sheet className="size-4" />
                Data (CSV)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-foreground"
                aria-label="More actions"
              >
                <Ellipsis className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onSelect={copyValues}>
                <Copy className="size-4" />
                Copy values
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onSave?.()}>
                <Bookmark className="size-4" />
                Save
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => onRegenerate?.()}>
                <RefreshCw className="size-4" />
                Regenerate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ArtifactActions>
      </ArtifactHeader>

      <ArtifactContent>
        <div ref={chartRef}>
          {view === "chart" ? (
            <ChartView {...viewProps} />
          ) : (
            <TableView {...viewProps} />
          )}
        </div>
      </ArtifactContent>
    </Artifact>
  );
}
