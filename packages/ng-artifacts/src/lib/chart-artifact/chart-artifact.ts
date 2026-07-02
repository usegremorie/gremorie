import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  AreaChart,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  RadialChart,
  ScatterChart,
  type ChartConfig,
  type ChartDatum,
} from '@gremorie/ng-data';

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
  type ArtifactMenuEntry,
  type ArtifactViewOption,
} from '../artifact/artifact';

export type ChartArtifactDatum = Record<string, string | number>;
export type ChartArtifactView = 'chart' | 'table';
export type ChartArtifactColor = 'primary' | 'gray' | 'success' | 'error';

/** Which chart primitive the artifact embeds. */
export type ChartArtifactType =
  | 'bar'
  | 'area'
  | 'line'
  | 'pie'
  | 'radar'
  | 'radial'
  | 'scatter';

export interface ChartArtifactSeries {
  /** Data field for this series. */
  key: string;
  /** Column / legend label (defaults to a title-cased key). */
  label?: string;
  /** Token color, e.g. `var(--chart-1)` (defaults to the cycling palette). */
  color?: string;
}

/** Categorical types render one row → one slice/bar, colored from the palette. */
const CATEGORICAL: ReadonlySet<ChartArtifactType> = new Set([
  'bar',
  'pie',
  'radial',
]);

interface SeriesView {
  key: string;
  label: string;
  color: string;
}

const titleCase = (s: string): string =>
  s.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const paletteColor = (i: number): string => `var(--chart-${(i % 5) + 1})`;

// ── download helpers (browser-only) ──────────────────────────────────────────

function downloadBlob(blob: Blob, name: string): void {
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

const csvCell = (v: unknown): string => {
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
function inlineComputedStyles(
  source: SVGSVGElement,
  clone: SVGSVGElement,
): void {
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

function exportSvgToPng(svg: SVGSVGElement, fileName: string): void {
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
 * ChartArtifact — the Chart preset of the artifact shell. Parity port of
 * `@gremorie/rx-artifacts`' `ChartArtifact`.
 *
 * Embeds any of the styled chart primitives (bar, area, line, pie, radar,
 * radial, scatter) from `@gremorie/ng-data` inside the generic `Artifact`, with
 * a working chart ⇄ table toggle and downloads. The table is **wide**: one
 * column per value series (so multi-series charts like radar/line keep every
 * value). Because it embeds the chart primitives, any change to them reflects
 * here.
 */
@Component({
  selector: 'chart-artifact',
  imports: [
    Artifact,
    ArtifactHeader,
    ArtifactFeaturedIcon,
    ArtifactHeading,
    ArtifactTitle,
    ArtifactDescription,
    ArtifactActions,
    ArtifactActionsExpanded,
    ArtifactActionsCollapsed,
    ArtifactViewToggle,
    ArtifactMenu,
    ArtifactContent,
    AreaChart,
    BarChart,
    LineChart,
    ScatterChart,
    PieChart,
    RadarChart,
    RadialChart,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'chart-artifact' },
  template: `
    <artifact>
      <artifact-header>
        <artifact-featured-icon [icon]="icon()" [color]="accent()" />
        <artifact-heading>
          <artifact-title>{{ title() }}</artifact-title>
          @if (description()) {
            <artifact-description>{{ description() }}</artifact-description>
          }
        </artifact-heading>

        <artifact-actions>
          <!-- The view toggle stays at every width. -->
          <artifact-view-toggle
            [value]="view()"
            [options]="viewOptions"
            (valueChange)="setView($any($event))"
          />

          <!-- Wide card (≥448px): primary Download menu + secondary More menu. -->
          <artifact-actions-expanded>
            <artifact-menu
              icon="lucideDownload"
              label="Download"
              [items]="downloadItems()"
            />
            <artifact-menu
              icon="lucideEllipsis"
              label="More actions"
              [items]="moreItems()"
            />
          </artifact-actions-expanded>

          <!-- Narrow card (<448px): one More menu carrying every action. -->
          <artifact-actions-collapsed>
            <artifact-menu
              icon="lucideEllipsis"
              label="Actions"
              [items]="collapsedItems()"
            />
          </artifact-actions-collapsed>
        </artifact-actions>
      </artifact-header>

      <artifact-content>
        <div #contentRef>
          @if (view() === 'chart') {
            @switch (type()) {
              @case ('area') {
                <area-chart
                  [data]="data()"
                  [config]="config()"
                  [xKey]="categoryKey()"
                  [yAxis]="false"
                />
              }
              @case ('line') {
                <line-chart
                  [data]="data()"
                  [config]="config()"
                  [xKey]="categoryKey()"
                  [yAxis]="false"
                />
              }
              @case ('scatter') {
                <scatter-chart
                  [data]="data()"
                  [config]="config()"
                  [xKey]="categoryKey()"
                />
              }
              @case ('radar') {
                <radar-chart
                  [data]="data()"
                  [config]="config()"
                  [xKey]="categoryKey()"
                />
              }
              @case ('pie') {
                <pie-chart
                  [data]="categoricalData()"
                  [config]="config()"
                  [nameKey]="categoryKey()"
                  [dataKey]="series()[0].key"
                  [donut]="true"
                />
              }
              @case ('radial') {
                <radial-chart
                  [data]="categoricalData()"
                  [config]="config()"
                  [nameKey]="categoryKey()"
                  [dataKey]="series()[0].key"
                />
              }
              @default {
                <bar-chart
                  [data]="barData()"
                  [config]="config()"
                  [xKey]="categoryKey()"
                  [yAxis]="false"
                />
              }
            }
          } @else {
            <table class="w-full caption-bottom text-sm">
              <thead class="[&_tr]:border-b">
                <tr class="border-b border-border">
                  <th
                    class="h-10 px-2 text-left align-middle font-medium text-muted-foreground"
                  >
                    {{ catLabel() }}
                  </th>
                  @for (s of series(); track s.key) {
                    <th
                      class="h-10 px-2 text-right align-middle font-medium text-muted-foreground"
                    >
                      <span class="inline-flex items-center gap-1.5">
                        @if (!rowSwatch()) {
                          <span
                            aria-hidden="true"
                            class="size-2.5 shrink-0 rounded-[3px]"
                            [style.background-color]="s.color"
                          ></span>
                        }
                        {{ s.label }}
                      </span>
                    </th>
                  }
                </tr>
              </thead>
              <tbody>
                @for (row of data(); track $index; let i = $index) {
                  <tr
                    class="border-b border-border transition-colors hover:bg-muted/50"
                  >
                    <td class="p-2 align-middle font-medium">
                      <span class="flex items-center gap-2">
                        @if (rowSwatch()) {
                          <span
                            aria-hidden="true"
                            class="size-2.5 shrink-0 rounded-[3px]"
                            [style.background-color]="paletteColor(i)"
                          ></span>
                        }
                        {{ row[categoryKey()] }}
                      </span>
                    </td>
                    @for (s of series(); track s.key) {
                      <td class="p-2 align-middle text-right tabular-nums">
                        {{ format(toNumber(row[s.key])) }}
                      </td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      </artifact-content>
    </artifact>
  `,
})
export class ChartArtifact {
  readonly title = input.required<string>();
  readonly description = input<string>();
  readonly data = input.required<ChartArtifactDatum[]>();
  readonly type = input<ChartArtifactType>('bar');
  readonly categoryKey = input.required<string>();
  readonly valueKey = input.required<string | ChartArtifactSeries[]>();
  readonly categoryLabel = input<string>();
  readonly valueLabel = input<string>();
  readonly defaultView = input<ChartArtifactView>('chart');
  readonly numberFormat = input<Intl.NumberFormatOptions>();
  readonly fileName = input('chart');
  readonly icon = input<string>('lucideChartColumn');
  readonly accent = input<ChartArtifactColor>('primary');

  readonly regenerate = output<void>();
  readonly save = output<void>();

  private readonly contentRef =
    viewChild<ElementRef<HTMLDivElement>>('contentRef');

  /** Current view; seeded from `defaultView`. */
  private readonly viewState = signal<ChartArtifactView | null>(null);
  protected readonly view = computed(
    () => this.viewState() ?? this.defaultView(),
  );

  protected readonly viewOptions: ArtifactViewOption[] = [
    { value: 'chart', icon: 'lucideChartColumn', label: 'Chart view' },
    { value: 'table', icon: 'lucideTable', label: 'Table view' },
  ];

  protected readonly catLabel = computed(
    () => this.categoryLabel() ?? titleCase(this.categoryKey()),
  );

  protected readonly isCategorical = computed(() =>
    CATEGORICAL.has(this.type()),
  );

  /** Normalize `valueKey` (string | series[]) into a fully-resolved series list. */
  protected readonly series = computed<SeriesView[]>(() => {
    const vk = this.valueKey();
    const raw: ChartArtifactSeries[] =
      typeof vk === 'string'
        ? [{ key: vk, label: this.valueLabel(), color: undefined }]
        : vk;
    return raw.map((s, i) => ({
      key: s.key,
      label: s.label ?? titleCase(s.key),
      color: s.color ?? paletteColor(i),
    }));
  });

  protected readonly singleSeries = computed(() => this.series().length === 1);

  /** Chart `config` maps each series key → label + color. */
  protected readonly config = computed<ChartConfig>(() =>
    Object.fromEntries(
      this.series().map((s) => [s.key, { label: s.label, color: s.color }]),
    ),
  );

  /** Categorical (bar/pie/radial): one palette color per ROW via each row's `fill`. */
  protected readonly categoricalData = computed<ChartDatum[]>(() =>
    this.data().map((row, i) => ({ ...row, fill: paletteColor(i) })),
  );

  /** Bar uses per-row fill only for the single categorical case. */
  protected readonly barData = computed<ChartDatum[]>(() =>
    this.isCategorical() && this.singleSeries()
      ? this.categoricalData()
      : (this.data() as ChartDatum[]),
  );

  /**
   * A leading color swatch only makes sense when each ROW has its own color
   * (categorical single-series) — not for multi-series, where color is per
   * column.
   */
  protected readonly rowSwatch = computed(
    () => this.isCategorical() && this.singleSeries(),
  );

  protected readonly downloadItems = computed<ArtifactMenuEntry[]>(() => [
    {
      label: 'Image (PNG)',
      icon: 'lucideImageDown',
      onSelect: () => this.downloadImage(),
    },
    {
      label: 'Data (CSV)',
      icon: 'lucideSheet',
      onSelect: () => this.downloadData(),
    },
  ]);

  protected readonly moreItems = computed<ArtifactMenuEntry[]>(() => [
    {
      label: 'Copy values',
      icon: 'lucideCopy',
      onSelect: () => this.copyValues(),
    },
    {
      label: 'Save',
      icon: 'lucideBookmark',
      onSelect: () => this.save.emit(),
    },
    'separator',
    {
      label: 'Regenerate',
      icon: 'lucideRefreshCw',
      onSelect: () => this.regenerate.emit(),
    },
  ]);

  protected readonly collapsedItems = computed<ArtifactMenuEntry[]>(() => [
    {
      label: 'Download image (PNG)',
      icon: 'lucideImageDown',
      onSelect: () => this.downloadImage(),
    },
    {
      label: 'Download data (CSV)',
      icon: 'lucideSheet',
      onSelect: () => this.downloadData(),
    },
    'separator',
    {
      label: 'Copy values',
      icon: 'lucideCopy',
      onSelect: () => this.copyValues(),
    },
    { label: 'Save', icon: 'lucideBookmark', onSelect: () => this.save.emit() },
    'separator',
    {
      label: 'Regenerate',
      icon: 'lucideRefreshCw',
      onSelect: () => this.regenerate.emit(),
    },
  ]);

  protected readonly paletteColor = paletteColor;

  protected setView(view: ChartArtifactView): void {
    this.viewState.set(view);
  }

  protected toNumber(v: string | number): number {
    return Number(v);
  }

  protected format(n: number): string {
    return new Intl.NumberFormat(undefined, this.numberFormat()).format(n);
  }

  private exportImage(): void {
    const svg = this.contentRef()?.nativeElement.querySelector('svg');
    if (svg && svg.getBoundingClientRect().width > 0) {
      exportSvgToPng(svg, this.fileName());
    }
  }

  private downloadImage(): void {
    if (this.view() !== 'chart') {
      this.setView('chart');
      setTimeout(() => this.exportImage(), 140);
    } else {
      this.exportImage();
    }
  }

  private downloadData(): void {
    const header = [this.catLabel(), ...this.series().map((s) => s.label)];
    const rows = [
      header.map(csvCell).join(','),
      ...this.data().map((d) =>
        [
          csvCell(d[this.categoryKey()]),
          ...this.series().map((s) => csvCell(d[s.key])),
        ].join(','),
      ),
    ];
    downloadBlob(
      new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' }),
      `${this.fileName()}.csv`,
    );
  }

  private copyValues(): void {
    const text = this.data()
      .map((d) =>
        [
          d[this.categoryKey()],
          ...this.series().map((s) => this.format(Number(d[s.key]))),
        ].join('\t'),
      )
      .join('\n');
    void navigator.clipboard?.writeText(text);
  }
}
