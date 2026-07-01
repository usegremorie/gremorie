import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CartesianGrid } from '../headless/cartesian-grid';
import { ChartFrame } from '../headless/chart-frame';
import { Line } from '../headless/line';
import { ChartTooltip, ChartTooltipCard } from '../headless/tooltip';
import { XAxis, YAxis } from '../headless/axis';
import { formatValue } from '../headless/format';
import {
  paletteColor,
  titleCaseKey,
  type ChartConfig,
  type ChartDatum,
  type CurveType,
  type Margin,
} from '../headless/types';

interface SeriesView {
  key: string;
  label: string;
  color: string;
  format?: string;
}

interface TooltipRow {
  key: string;
  label: string;
  color: string;
  value: string;
}

/**
 * Styled line chart — parity with `@gremorie/rx-data`'s `LineChart`. One stroked
 * line per `config` entry over the `xKey` category axis. Supports a curve
 * `type`, optional `dots`, an optional `yAxis`, and a hover tooltip.
 *
 * @example
 * ```html
 * <line-chart [data]="data" [config]="config" xKey="month" [dots]="true" />
 * ```
 */
@Component({
  selector: 'line-chart',
  imports: [
    ChartFrame,
    ChartTooltip,
    ChartTooltipCard,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'line-chart',
    role: 'img',
    '[attr.aria-label]': 'ariaLabel()',
    class:
      'flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-card-foreground',
  },
  template: `
    <div class="relative w-full">
      <svg
        chartFrame
        chartTooltip
        #tip="chartTooltip"
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

        @for (s of series(); track s.key) {
          <svg:path
            [line]="s.key"
            #l="line"
            [color]="s.color"
            [curve]="type()"
            stroke-width="2"
          />
          @if (dots()) {
            @for (p of l.points(); track $index) {
              <svg:circle
                [attr.cx]="p.x"
                [attr.cy]="p.y"
                r="3"
                [attr.fill]="s.color"
                stroke="var(--background)"
                stroke-width="1.5"
              />
            }
          }
          @if (
            tooltip() &&
            tip.activeIndex() !== null &&
            l.points()[tip.activeIndex()!]
          ) {
            <svg:circle
              [attr.cx]="l.points()[tip.activeIndex()!].x"
              [attr.cy]="l.points()[tip.activeIndex()!].y"
              r="3.5"
              [attr.fill]="s.color"
              stroke="var(--background)"
              stroke-width="1.5"
            />
          }
        }

        <svg:g xAxis #x="xAxis">
          @for (t of x.ticks(); track t.label) {
            <svg:text
              [attr.x]="t.x"
              [attr.y]="x.labelY()"
              text-anchor="middle"
              class="fill-muted-foreground text-[10px]"
            >
              {{ t.label }}
            </svg:text>
          }
        </svg:g>

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

      @if (tooltip() && tip.activeIndex() !== null) {
        <div
          [chartTooltipCard]="tip"
          class="pointer-events-none absolute z-10 min-w-28 rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs shadow-md"
        >
          <div class="mb-1 font-medium text-popover-foreground">
            {{ activeName(tip) }}
          </div>
          @for (row of tipRows(tip); track row.key) {
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
    </div>

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
  `,
})
export class LineChart {
  readonly data = input.required<readonly ChartDatum[]>();
  readonly config = input.required<ChartConfig>();
  readonly xKey = input.required<string>();
  readonly type = input<CurveType>('natural');
  readonly dots = input(false);
  readonly yAxis = input(true);
  readonly tooltip = input(true);

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

  readonly ariaLabel = computed(
    () =>
      `Line chart of ${this.series()
        .map((s) => s.label)
        .join(', ')} by ${this.xKey()}`,
  );

  protected activeName(tip: ChartTooltip): string {
    const row = tip.activeRow();
    return row ? String(row[this.xKey()] ?? '') : '';
  }

  protected tipRows(tip: ChartTooltip): TooltipRow[] {
    const row = tip.activeRow();
    if (!row) return [];
    return this.series().map((s) => ({
      key: s.key,
      label: s.label,
      color: s.color,
      value: formatValue(Number(row[s.key] ?? 0), s.format || 'number'),
    }));
  }
}
