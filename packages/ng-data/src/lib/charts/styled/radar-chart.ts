import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { spokeIndexAt } from '../headless/polar';
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
        class="mx-auto aspect-square max-h-[280px] w-full overflow-visible text-muted-foreground"
        (pointermove)="onPointerMove($event)"
        (pointerleave)="active.set(null)"
      >
        @for (s of series(); track s.key; let i = $index) {
          <svg:g [radar]="s.key" [color]="s.color" #r="radar">
            @if (i === 0) {
              @if (gridType() === 'circle') {
                @for (level of gridLevels; track level) {
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

      @if (tooltip() && activeAnchor(); as anchor) {
        <div
          class="pointer-events-none absolute z-10 min-w-28 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs shadow-md"
          [style.left.px]="anchor.lx"
          [style.top.px]="anchor.ly"
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
  protected readonly gridLevels = [0.25, 0.5, 0.75, 1] as const;

  private readonly plot = viewChild.required<ElementRef<SVGSVGElement>>('plot');
  private readonly radars = viewChildren(Radar);

  readonly activeLabel = computed(() => {
    const i = this.active();
    return i === null ? '' : String(this.data()[i]?.[this.xKey()] ?? '');
  });

  /** Tooltip anchor: the active spoke's label position. */
  protected readonly activeAnchor = computed(() => {
    const i = this.active();
    const axes = this.radars()[0]?.axes();
    return i === null ? null : (axes?.[i] ?? null);
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
    this.active.set(
      spokeIndexAt(
        { x: event.clientX - rect.left, y: event.clientY - rect.top },
        radar.center(),
        this.data().length,
      ),
    );
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
