"use client";

import { BarChart, type ChartConfig } from "@gremorie/rx-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gremorie/rx-display";
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
} from "lucide-react";
import { useRef, useState } from "react";

import {
  Artifact,
  ArtifactActions,
  ArtifactContent,
  ArtifactDescription,
  ArtifactFeaturedIcon,
  ArtifactHeader,
  ArtifactHeading,
  ArtifactMenu,
  ArtifactTitle,
  ArtifactViewToggle,
} from "../artifact";

export type ChartArtifactDatum = Record<string, string | number>;
export type ChartArtifactView = "chart" | "table";
export type ChartArtifactColor = "brand" | "gray" | "success" | "error";

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
  /** Header label / tooltip label for the value (defaults to a title-cased key). */
  valueLabel?: string;
  /** Which view is shown first. */
  defaultView?: ChartArtifactView;
  /** `Intl.NumberFormat` options for value rendering (chart tooltip + table + CSV). */
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

const SVG_STYLE_PROPS = [
  "fill",
  "fill-opacity",
  "stroke",
  "stroke-width",
  "stroke-opacity",
  "opacity",
  "font-family",
  "font-size",
  "font-weight",
  "text-anchor",
  "dominant-baseline",
];

/** Inline resolved styles onto a clone so a detached SVG rasterizes faithfully. */
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
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(scale, scale);
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

// ── artifact ─────────────────────────────────────────────────────────────────

/**
 * ChartArtifact — the Chart preset of the artifact shell.
 *
 * Wraps the styled `BarChart` (rx-data) and a `Table` (rx-display) inside the
 * generic `Artifact`, toggling between them. Because it *embeds* `BarChart`,
 * any change to that chart primitive reflects here automatically.
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
  icon = ChartColumn,
  accent = "brand",
  className,
  onRegenerate,
  onSave,
}: ChartArtifactProps) {
  const [view, setView] = useState<ChartArtifactView>(defaultView);
  const contentRef = useRef<HTMLDivElement>(null);

  const catLabel = categoryLabel ?? titleCase(categoryKey);
  const valLabel = valueLabel ?? titleCase(valueKey);
  const format = (n: number) =>
    new Intl.NumberFormat(undefined, numberFormat).format(n);

  // Single categorical series: one chart token per bar via each row's `fill`.
  const config: ChartConfig = {
    [valueKey]: { label: valLabel },
  };
  const chartData = data.map((row, i) => ({
    ...row,
    fill: `var(--chart-${(i % 5) + 1})`,
  }));

  const exportImage = () => {
    const svg = contentRef.current?.querySelector("svg");
    if (svg && svg.getBoundingClientRect().width > 0) {
      exportSvgToPng(svg, fileName);
    }
  };

  const downloadImage = () => {
    if (view !== "chart") {
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
      <ArtifactHeader>
        <ArtifactFeaturedIcon icon={icon} color={accent} />
        <ArtifactHeading>
          <ArtifactTitle>{title}</ArtifactTitle>
          {description ? (
            <ArtifactDescription>{description}</ArtifactDescription>
          ) : null}
        </ArtifactHeading>

        <ArtifactActions>
          <ArtifactViewToggle
            value={view}
            onValueChange={(v) => setView(v as ChartArtifactView)}
            options={[
              { value: "chart", icon: ChartColumn, label: "Chart view" },
              { value: "table", icon: TableIcon, label: "Table view" },
            ]}
          />
          <ArtifactMenu
            icon={Download}
            label="Download"
            heading="Download"
            items={[
              { label: "Image (PNG)", icon: ImageDown, onSelect: downloadImage },
              { label: "Data (CSV)", icon: Sheet, onSelect: downloadData },
            ]}
          />
          <ArtifactMenu
            icon={Ellipsis}
            label="More actions"
            items={[
              { label: "Copy values", icon: Copy, onSelect: copyValues },
              { label: "Save", icon: Bookmark, onSelect: () => onSave?.() },
              "separator",
              {
                label: "Regenerate",
                icon: RefreshCw,
                onSelect: () => onRegenerate?.(),
              },
            ]}
          />
        </ArtifactActions>
      </ArtifactHeader>

      <ArtifactContent>
        <div ref={contentRef}>
          {view === "chart" ? (
            <BarChart
              data={chartData}
              config={config}
              xKey={categoryKey}
              yAxis={false}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{catLabel}</TableHead>
                  <TableHead className="text-right">{valLabel}</TableHead>
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
                          style={{ backgroundColor: `var(--chart-${(i % 5) + 1})` }}
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
          )}
        </div>
      </ArtifactContent>
    </Artifact>
  );
}
