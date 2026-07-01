import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Bar, type BarRect } from '../headless/bar';
import { ChartFrame } from '../headless/chart-frame';
import { ChartTooltip, ChartTooltipCard } from '../headless/tooltip';
import { formatValue } from '../headless/format';
import {
  paletteColor,
  titleCaseKey,
  type ChartConfig,
  type ChartDatum,
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
 * Styled grouped/stacked bar chart — parity with `@gremorie/rx-data`'s
 * `BarChart`. Pass tabular `data`, a serializable `config` mapping each value
 * field to a label + token color, and the `xKey` category. Supports `stacked`,
 * `horizontal`, per-bar `fill`, value labels, a hover tooltip, and a custom
 * corner `radius`.
 *
 * @example
 * ```html
 * <bar-chart [data]="data" [config]="config" xKey="month" />
 * <bar-chart [data]="data" [config]="config" xKey="month" [stacked]="true" />
 * <bar-chart [data]="data" [config]="config" xKey="month" [horizontal]="true" />
 * ```
 */
@Component({
  selector: 'bar-chart',
  imports: [ChartFrame, ChartTooltip, ChartTooltipCard, Bar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'bar-chart',
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
        class="aspect-video w-full overflow-visible text-muted-foreground"
      >
        @for (s of series(); track s.key; let i = $index) {
          <svg:g
            [bar]="s.key"
            [radius]="radius()"
            [horizontal]="horizontal()"
            #b="bar"
          >
            @if (i === 0) {
              @for (g of b.gridLines(); track $index) {
                <svg:line
                  [attr.x1]="g.x1"
                  [attr.x2]="g.x2"
                  [attr.y1]="g.y1"
                  [attr.y2]="g.y2"
                  stroke="currentColor"
                  stroke-opacity="0.15"
                />
              }
            }

            @for (r of b.bars(); track $index) {
              <svg:path [attr.d]="r.d" [attr.fill]="r.fill ?? s.color" />
            }

            @if (showLabels() && (single() || i === series().length - 1)) {
              @for (r of b.bars(); track $index) {
                <svg:text
                  [attr.x]="labelX(r)"
                  [attr.y]="labelY(r)"
                  [attr.text-anchor]="horizontal() ? 'start' : 'middle'"
                  dominant-baseline="middle"
                  class="fill-foreground text-[10px]"
                >
                  {{ fmt(r.value, s.format) }}
                </svg:text>
              }
            }

            @if (i === 0) {
              @for (t of b.categoryTicks(); track t.label) {
                <svg:text
                  [attr.x]="t.x"
                  [attr.y]="t.y"
                  [attr.text-anchor]="horizontal() ? 'end' : 'middle'"
                  [attr.dominant-baseline]="horizontal() ? 'middle' : 'auto'"
                  class="fill-muted-foreground text-[10px]"
                >
                  {{ t.label }}
                </svg:text>
              }
              @if (yAxis()) {
                @for (t of b.valueTicks(); track t.value) {
                  <svg:text
                    [attr.x]="t.x"
                    [attr.y]="t.y"
                    [attr.text-anchor]="horizontal() ? 'middle' : 'end'"
                    dominant-baseline="middle"
                    class="fill-muted-foreground text-[10px]"
                  >
                    {{ t.label }}
                  </svg:text>
                }
              }
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
export class BarChart {
  readonly data = input.required<readonly ChartDatum[]>();
  readonly config = input.required<ChartConfig>();
  readonly xKey = input.required<string>();
  readonly stacked = input(false);
  readonly horizontal = input(false);
  readonly yAxis = input(true);
  readonly showLabels = input(false);
  readonly tooltip = input(true);
  readonly radius = input(8);

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

  readonly single = computed(() => this.series().length <= 1);

  readonly ariaLabel = computed(
    () =>
      `Bar chart of ${this.series()
        .map((s) => s.label)
        .join(', ')} by ${this.xKey()}`,
  );

  protected fmt(value: number | string, format?: string): string {
    return formatValue(Number(value), format || 'number');
  }

  protected labelX(r: BarRect): number {
    return this.horizontal() ? r.x + r.width + 6 : r.x + r.width / 2;
  }

  protected labelY(r: BarRect): number {
    return this.horizontal() ? r.y + r.height / 2 : r.y - 6;
  }

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
      color: (row['fill'] as string | undefined) ?? s.color,
      value: this.fmt(row[s.key], s.format),
    }));
  }
}
