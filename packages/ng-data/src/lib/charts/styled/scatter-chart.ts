import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { CartesianGrid } from '../headless/cartesian-grid';
import { ChartFrame } from '../headless/chart-frame';
import { Scatter } from '../headless/scatter';
import { YAxis } from '../headless/axis';
import { formatValue } from '../headless/format';
import {
  paletteColor,
  titleCaseKey,
  type ChartConfig,
  type ChartDatum,
  type Margin,
} from '../headless/types';

interface SeriesView {
  key: string;
  label: string;
  color: string;
  format?: string;
}

interface ActivePoint {
  si: number;
  pi: number;
  cx: number;
  cy: number;
}

/**
 * Styled scatter chart — parity with `@gremorie/rx-data`'s `ScatterChart`.
 * `xKey` is a numeric field (linear X axis); each `config` entry is a numeric Y
 * series. Supports an optional `yAxis` and a per-point hover tooltip.
 *
 * @example
 * ```html
 * <scatter-chart [data]="data" [config]="config" xKey="weight" />
 * ```
 */
@Component({
  selector: 'scatter-chart',
  imports: [ChartFrame, Scatter, CartesianGrid, YAxis],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'scatter-chart',
    role: 'img',
    '[attr.aria-label]': 'ariaLabel()',
    class:
      'flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-card-foreground',
  },
  template: `
    <div class="relative w-full">
      <svg
        chartFrame
        [data]="data()"
        [xKey]="xKey()"
        [margin]="margin()"
        class="aspect-video w-full overflow-visible text-muted-foreground"
      >
        <svg:g cartesianGrid #grid="cartesianGrid">
          @for (gline of grid.lines(); track $index) {
            <svg:line
              [attr.x1]="gline.x1"
              [attr.x2]="gline.x2"
              [attr.y1]="gline.y"
              [attr.y2]="gline.y"
              stroke="currentColor"
              stroke-opacity="0.15"
            />
          }
        </svg:g>

        @for (s of series(); track s.key; let si = $index) {
          <svg:g [scatter]="s.key" #sc="scatter">
            @for (p of sc.points(); track $index; let pi = $index) {
              <svg:circle
                [attr.cx]="p.cx"
                [attr.cy]="p.cy"
                [attr.r]="active()?.si === si && active()?.pi === pi ? 6 : 4"
                [attr.fill]="s.color"
                fill-opacity="0.7"
                class="cursor-pointer transition-[r]"
                (pointerenter)="tooltip() && setActive(si, pi, p.cx, p.cy)"
                (pointerleave)="clearActive()"
              />
            }
            @if (si === 0) {
              @for (t of sc.xTicks(); track t.label) {
                <svg:text
                  [attr.x]="t.x"
                  [attr.y]="sc.labelY()"
                  text-anchor="middle"
                  class="fill-muted-foreground text-[10px]"
                >
                  {{ t.label }}
                </svg:text>
              }
            }
          </svg:g>
        }

        @if (yAxis()) {
          <svg:g yAxis #y="yAxis">
            @for (t of y.ticks(); track t.value) {
              <svg:text
                [attr.x]="y.labelX()"
                [attr.y]="t.y"
                text-anchor="end"
                dominant-baseline="middle"
                class="fill-muted-foreground text-[10px]"
              >
                {{ t.label }}
              </svg:text>
            }
          </svg:g>
        }
      </svg>

      @if (tooltip() && active() !== null) {
        <div
          class="pointer-events-none absolute z-10 min-w-28 rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs shadow-md"
          [style.left.px]="active()!.cx"
          [style.top.px]="active()!.cy"
          style="transform: translate(12px, -50%)"
        >
          <div class="mb-1 font-medium text-popover-foreground">
            {{ xKey() }}: {{ activeX() }}
          </div>
          <div class="flex items-center gap-1.5 text-muted-foreground">
            <span class="size-2 rounded-[2px]" [style.background]="activeSeries()?.color"></span>
            <span>{{ activeSeries()?.label }}</span>
            <span class="ml-auto pl-3 font-medium tabular-nums text-popover-foreground">
              {{ activeValue() }}
            </span>
          </div>
        </div>
      }
    </div>

    <table class="sr-only">
      <caption>
        {{ ariaLabel() }}
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
  `,
})
export class ScatterChart {
  readonly data = input.required<readonly ChartDatum[]>();
  readonly config = input.required<ChartConfig>();
  readonly xKey = input.required<string>();
  readonly yAxis = input(true);
  readonly tooltip = input(true);

  readonly active = signal<ActivePoint | null>(null);

  readonly margin = computed<Margin>(() =>
    this.yAxis()
      ? { top: 8, right: 12, bottom: 24, left: 40 }
      : { top: 8, right: 12, bottom: 24, left: 12 },
  );

  readonly series = computed<SeriesView[]>(() => {
    const cfg = this.config();
    return Object.keys(cfg)
      .filter((k) => k !== this.xKey())
      .map((key, i) => ({
        key,
        label: cfg[key]?.label ?? titleCaseKey(key),
        color: cfg[key]?.color ?? paletteColor(i),
        format: cfg[key]?.format,
      }));
  });

  readonly activeSeries = computed<SeriesView | undefined>(() => {
    const a = this.active();
    return a ? this.series()[a.si] : undefined;
  });

  readonly activeX = computed(() => {
    const a = this.active();
    return a ? String(this.data()[a.pi]?.[this.xKey()] ?? '') : '';
  });

  readonly activeValue = computed(() => {
    const a = this.active();
    const s = this.activeSeries();
    if (!a || !s) return '';
    return formatValue(Number(this.data()[a.pi]?.[s.key] ?? 0), s.format || 'number');
  });

  readonly ariaLabel = computed(
    () =>
      `Scatter chart of ${this.series()
        .map((s) => s.label)
        .join(', ')} against ${this.xKey()}`,
  );

  protected setActive(si: number, pi: number, cx: number, cy: number): void {
    this.active.set({ si, pi, cx, cy });
  }

  protected clearActive(): void {
    this.active.set(null);
  }
}
