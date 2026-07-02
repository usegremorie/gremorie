import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Area } from '../headless/area';
import { CartesianGrid } from '../headless/cartesian-grid';
import { ChartFrame } from '../headless/chart-frame';
import { ChartTooltip, ChartTooltipCard } from '../headless/tooltip';
import { ChartTooltipContent } from './chart-tooltip-content';
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
 * Styled area chart — parity with `@gremorie/rx-data`'s `AreaChart`. One filled
 * area per `config` entry over the `xKey` category axis. Supports `stacked`, a
 * curve `type`, an optional `yAxis`, and a hover tooltip.
 *
 * @example
 * ```html
 * <area-chart [data]="data" [config]="config" xKey="month" [stacked]="true" />
 * ```
 */
@Component({
  selector: 'area-chart',
  imports: [
    ChartFrame,
    ChartTooltip,
    ChartTooltipCard,
    ChartTooltipContent,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'area-chart',
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
        [stacked]="stacked()"
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
            [area]="s.key"
            #a="area"
            [color]="s.color"
            [curve]="type()"
            [fillOpacity]="0.4"
            [attr.stroke]="s.color"
            stroke-width="2"
          ></svg:path>
          @if (
            tooltip() &&
            tip.activeIndex() !== null &&
            a.points()[tip.activeIndex()!]
          ) {
            <svg:circle
              [attr.cx]="a.points()[tip.activeIndex()!].x"
              [attr.cy]="a.points()[tip.activeIndex()!].y"
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
        <chart-tooltip-content
          [chartTooltipCard]="tip"
          class="pointer-events-none absolute z-10"
          [label]="activeName(tip)"
          [rows]="tipRows(tip)"
        />
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
export class AreaChart {
  readonly data = input.required<readonly ChartDatum[]>();
  readonly config = input.required<ChartConfig>();
  readonly xKey = input.required<string>();
  readonly stacked = input(false);
  readonly type = input<CurveType>('natural');
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
      `Area chart of ${this.series()
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
