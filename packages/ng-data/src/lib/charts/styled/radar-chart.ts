import {
  ChangeDetectionStrategy,
  Component,
  computed,
  afterRenderEffect,
  ElementRef,
  input,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { ChartLegend, type ChartLegendItem } from './chart-legend';
import { ChartFrame } from '../headless/chart-frame';
import { Radar } from '../headless/radar';
import { formatValue } from '../headless/format';
import { placeBeside, polarPoint, spokeIndexAt } from '../headless/polar';
import {
  paletteColor,
  titleCaseKey,
  type ChartConfig,
  type ChartDatum,
  type GridType,
  type RadarFill,
} from '../headless/types';

interface SeriesView {
  key: string;
  label: string;
  color: string;
  format?: string;
  icon?: ChartLegendItem['icon'];
}

/**
 * Styled radar chart — parity with `@gremorie/rx-data`'s `RadarChart`. Each data
 * row (`xKey`) becomes a spoke; each `config` entry a closed series polygon
 * sharing one radial max. `gridType` switches the grid between polygon and
 * circle; `tooltip` enables per-spoke hover.
 *
 * @example
 * ```html
 * <radar-chart [data]="data" [config]="config" xKey="metric" gridType="circle" />
 * ```
 */
@Component({
  selector: 'radar-chart',
  imports: [ChartFrame, Radar, ChartLegend],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'radar-chart',
    role: 'img',
    '[attr.aria-label]': 'ariaLabel()',
    class:
      'flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground',
  },
  template: `
    <div class="relative w-full">
      <svg
        #plot
        chartFrame
        [data]="data()"
        [xKey]="xKey()"
        [domain]="domain()"
        class="mx-auto aspect-square max-h-[280px] w-full overflow-visible text-muted-foreground"
        (pointermove)="onPointerMove($event)"
        (pointerleave)="clearActive()"
      >
        @for (s of series(); track s.key; let i = $index) {
          <svg:g
            [radar]="s.key"
            [color]="s.color"
            [levels]="gridLevels()"
            #r="radar"
          >
            @if (i === 0) {
              @if (gridType() === 'circle') {
                @for (level of gridLevels(); track level) {
                  <svg:circle
                    [attr.cx]="r.center().cx"
                    [attr.cy]="r.center().cy"
                    [attr.r]="r.center().radius * level"
                    fill="none"
                    stroke="currentColor"
                    stroke-opacity="0.12"
                  />
                }
              } @else {
                @for (ring of r.rings(); track $index) {
                  <svg:path
                    [attr.d]="ring"
                    fill="none"
                    stroke="currentColor"
                    stroke-opacity="0.12"
                  />
                }
              }
              @if (radiusAxis()) {
                <!-- Tick values up the vertical, the way recharts'
                     PolarRadiusAxis sits at angle 90. Nudged left of the axis
                     so they do not sit on the spoke itself. -->
                @for (t of radiusTicks(); track t.level) {
                  <svg:text
                    data-slot="radar-radius-tick"
                    [attr.x]="t.x - 6"
                    [attr.y]="t.y"
                    text-anchor="end"
                    dominant-baseline="middle"
                    class="fill-muted-foreground text-[10px]"
                  >
                    {{ t.value }}
                  </svg:text>
                }
              }
              @for (ax of r.axes(); track ax.label) {
                <svg:line
                  [attr.x1]="r.center().cx"
                  [attr.y1]="r.center().cy"
                  [attr.x2]="ax.x2"
                  [attr.y2]="ax.y2"
                  stroke="currentColor"
                  stroke-opacity="0.12"
                />
                <svg:text
                  [attr.x]="ax.lx"
                  [attr.y]="ax.ly"
                  text-anchor="middle"
                  dominant-baseline="middle"
                  class="fill-muted-foreground text-[10px]"
                >
                  {{ ax.label }}
                </svg:text>
              }
            }
            <svg:path
              data-slot="radar-polygon"
              [attr.d]="r.d()"
              [attr.fill]="s.color"
              [attr.fill-opacity]="fillOpacity()"
              [attr.stroke]="s.color"
              [attr.stroke-width]="strokeWidth()"
            />
            @if (dots()) {
              @for (p of r.points(); track $index) {
                <svg:circle
                  data-slot="radar-dot"
                  [attr.cx]="p.x"
                  [attr.cy]="p.y"
                  r="3"
                  [attr.fill]="s.color"
                  stroke="var(--background)"
                  stroke-width="1.5"
                />
              }
            }
            @if (tooltip() && activePoint(r) !== null) {
              <!-- Active dot, matching recharts' Radar default (r=4,
                   strokeWidth=2, fill = series colour). recharts hardcodes a
                   white ring; the token keeps the same separation in both
                   modes. -->
              <svg:circle
                data-slot="radar-active-dot"
                [attr.cx]="activePoint(r)!.x"
                [attr.cy]="activePoint(r)!.y"
                r="4"
                [attr.fill]="s.color"
                stroke-width="2"
                class="stroke-background"
              />
            }
          </svg:g>
        }
      </svg>

      @if (tooltip() && tipPosition(); as pos) {
        <div
          #tip
          data-slot="radar-tooltip"
          class="pointer-events-none absolute z-10 min-w-28 rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs shadow-md"
          [style.left.px]="pos.x"
          [style.top.px]="pos.y"
        >
          <div class="mb-1 font-medium text-popover-foreground">
            {{ activeLabel() }}
          </div>
          @for (row of tipRows(active()!); track row.key) {
            <div class="flex items-center gap-1.5 text-muted-foreground">
              <span
                class="size-2 rounded-[2px]"
                [style.background]="row.color"
              ></span>
              <span>{{ row.label }}</span>
              <span
                class="ml-auto pl-3 font-medium tabular-nums text-popover-foreground"
              >
                {{ row.value }}
              </span>
            </div>
          }
        </div>
      }

      <chart-legend [items]="legendItems()" />

      <table class="sr-only">
        <caption>
          {{
            ariaLabel()
          }}
        </caption>
        <thead>
          <tr>
            <th>{{ xKey() }}</th>
            @for (s of series(); track s.key) {
              <th>{{ s.label }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of data(); track $index) {
            <tr>
              <td>{{ row[xKey()] }}</td>
              @for (s of series(); track s.key) {
                <td>{{ row[s.key] }}</td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class RadarChart {
  readonly data = input.required<readonly ChartDatum[]>();
  readonly config = input.required<ChartConfig>();
  readonly xKey = input.required<string>();
  readonly gridType = input<GridType>('polygon');
  readonly fill = input<RadarFill>('auto');
  readonly dots = input(false);
  /**
   * Pins the radial scale, e.g. `[0, 100]`. Omit and it follows the data —
   * fine for one chart, wrong the moment two are compared, because a top score
   * of 70 would fill the plot exactly like a top score of 100.
   */
  readonly domain = input<[number, number] | undefined>(undefined);
  /** Number of grid rings, and of ticks on the radius axis. */
  readonly ticks = input(4);
  /** Label each ring with its value, up the vertical axis. */
  readonly radiusAxis = input(false);
  readonly tooltip = input(true);

  /** One series reads as a shape; two or more read as outlines. */
  private readonly single = computed(() => this.series().length <= 1);

  protected readonly filled = computed(
    () => this.fill() === 'on' || (this.fill() === 'auto' && this.single()),
  );

  /* A lone filled polygon can take a heavy 0.6; overlapping ones cannot, so
     forcing `on` past one series drops to 0.2 to keep the stack readable. */
  protected readonly fillOpacity = computed(() => {
    if (!this.filled()) return 0;
    return this.single() ? 0.6 : 0.2;
  });

  /* The lone filled polygon carries its own edge, so it needs no stroke. */
  protected readonly strokeWidth = computed(() =>
    this.filled() && this.single() ? 0 : 2,
  );

  /** Index of the spoke the pointer is closest to, or null when outside. */
  readonly active = signal<number | null>(null);
  /** Ring positions as fractions of the radius, innermost first. */
  protected readonly gridLevels = computed(() => {
    const n = Math.max(1, Math.floor(this.ticks()));
    return Array.from({ length: n }, (_, i) => (i + 1) / n);
  });

  /** Ring values for the radius axis, paired with their fraction. */
  protected readonly radiusTicks = computed(() => {
    const radar = this.radars()[0];
    if (!radar) return [];
    const [min, max] = this.domain() ?? [0, 0];
    const span = max - min;
    const { cx, cy, radius } = radar.center();
    return this.gridLevels().map((level) => ({
      level,
      value: span > 0 ? formatValue(min + span * level) : '',
      x: cx,
      y: cy - radius * level,
    }));
  });

  private readonly plot = viewChild.required<ElementRef<SVGSVGElement>>('plot');
  private readonly radars = viewChildren(Radar);

  readonly activeLabel = computed(() => {
    const i = this.active();
    return i === null ? '' : String(this.data()[i]?.[this.xKey()] ?? '');
  });

  /** Pointer position inside the plot, in SVG user units. */
  private readonly pointer = signal<{ x: number; y: number } | null>(null);
  private readonly tip = viewChild<ElementRef<HTMLElement>>('tip');
  private readonly tipSize = signal({ w: 0, h: 0 });

  constructor() {
    // The flip below needs the tooltip's own box, which only exists once it has
    // rendered. Measure after each render and feed it back as a signal.
    afterRenderEffect(() => {
      const el = this.tip()?.nativeElement;
      if (!el) return;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const prev = this.tipSize();
      if (prev.w !== w || prev.h !== h) this.tipSize.set({ w, h });
    });
  }

  /**
   * Where the tooltip points: the active spoke's angle, at the pointer's own
   * distance from the centre. recharts' `getActivePolarCoordinate` does the
   * same for a centric layout, which is why its tooltip moves as you reach
   * further out instead of parking on the axis label.
   */
  private readonly anchor = computed(() => {
    const i = this.active();
    const p = this.pointer();
    const radar = this.radars()[0];
    if (i === null || !p || !radar) return null;
    const n = this.data().length;
    if (n === 0) return null;
    const { cx, cy } = radar.center();
    const distance = Math.hypot(p.x - cx, p.y - cy);
    return polarPoint(cx, cy, distance, (i / n) * 2 * Math.PI);
  });

  /**
   * Place the tooltip beside the anchor, flipping to the near side when it
   * would overflow, then clamping to the plot. This is recharts'
   * `getTooltipTranslateXY` with its default offset of 10, applied per axis:
   * prefer `coordinate + offset`, fall back to `coordinate - size - offset`
   * when the far edge would be crossed, and never start before the plot does.
   *
   * Anchoring on the axis label instead — which is what this did first — parks
   * the card over the plot on the lower spokes and covers both the dots and
   * the label it points at.
   */
  protected readonly tipPosition = computed(() => {
    const a = this.anchor();
    const radar = this.radars()[0];
    if (!a || !radar) return null;
    const { cx, cy, radius } = radar.center();
    const { w, h } = this.tipSize();
    // The plot box the card has to stay inside.
    const box = {
      x: cx - radius,
      y: cy - radius,
      side: radius * 2,
    };
    return {
      x: placeBeside(a.x, w, box.x, box.side),
      y: placeBeside(a.y, h, box.y, box.side),
    };
  });

  /**
   * Resolve the active spoke from the pointer's angle rather than from a
   * hit target under the cursor, so the whole wedge is hoverable — the
   * behaviour recharts gives the React edition for free via its axis-mode
   * tooltip. Hanging invisible shapes off each spoke cannot match it: the
   * series polygons paint over them and swallow the events.
   */
  protected onPointerMove(event: PointerEvent): void {
    if (!this.tooltip()) return;
    const radar = this.radars()[0];
    if (!radar) return;
    // The frame's viewBox is `0 0 width height` taken from this same element's
    // measured box, so user units and CSS pixels are 1:1.
    const rect = this.plot().nativeElement.getBoundingClientRect();
    const point = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    const index = spokeIndexAt(point, radar.center(), this.data().length);
    this.active.set(index);
    this.pointer.set(index === null ? null : point);
  }

  protected clearActive(): void {
    this.active.set(null);
    this.pointer.set(null);
  }

  /** This series' vertex on the active spoke, for the active dot. */
  protected activePoint(radar: Radar): { x: number; y: number } | null {
    const i = this.active();
    return i === null ? null : (radar.points()[i] ?? null);
  }

  readonly series = computed<SeriesView[]>(() => {
    const cfg = this.config();
    return Object.keys(cfg)
      .filter((k) => k !== this.xKey())
      .map((key, i) => ({
        key,
        label: cfg[key]?.label ?? titleCaseKey(key),
        color: cfg[key]?.color ?? paletteColor(i),
        format: cfg[key]?.format,
        icon: cfg[key]?.icon,
      }));
  });

  protected readonly legendItems = computed<ChartLegendItem[]>(() =>
    this.series().map((s) => ({
      key: s.key,
      label: s.label,
      color: s.color,
      icon: s.icon,
    })),
  );

  protected tipRows(
    i: number,
  ): { key: string; label: string; color: string; value: string }[] {
    const row = this.data()[i];
    if (!row) return [];
    return this.series().map((s) => ({
      key: s.key,
      label: s.label,
      color: s.color,
      value: formatValue(Number(row[s.key] ?? 0), s.format || 'number'),
    }));
  }

  readonly ariaLabel = computed(
    () =>
      `Radar chart of ${this.series()
        .map((s) => s.label)
        .join(', ')} by ${this.xKey()}`,
  );
}
