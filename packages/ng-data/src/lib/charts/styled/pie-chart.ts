import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { ChartFrame } from '../headless/chart-frame';
import { Pie } from '../headless/pie';
import { formatValue } from '../headless/format';
import {
  paletteColor,
  type ChartConfig,
  type ChartDatum,
} from '../headless/types';

interface LegendItem {
  name: string;
  color: string;
}

/**
 * Styled pie / donut chart — parity with `@gremorie/rx-data`'s `PieChart`.
 * `nameKey` is the slice label field, `dataKey` the numeric value field. Slice
 * colors come from each row's `fill`, falling back to the cycling palette. Set
 * `donut` for a donut, `showLabels` to draw slice labels, `tooltip` for hover.
 *
 * @example
 * ```html
 * <pie-chart [data]="data" nameKey="browser" dataKey="visitors" [donut]="true" />
 * ```
 */
@Component({
  selector: 'pie-chart',
  imports: [ChartFrame, Pie],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'pie-chart',
    role: 'img',
    '[attr.aria-label]': 'ariaLabel()',
    class:
      'flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground',
  },
  template: `
    <div class="relative w-full">
      <svg
        chartFrame
        [data]="data()"
        [xKey]="nameKey()"
        class="mx-auto aspect-square max-h-[260px] w-full overflow-visible text-muted-foreground"
      >
        <svg:g
          [pie]="dataKey()"
          [innerRadiusRatio]="donut() ? 0.6 : 0"
          #p="pie"
          [attr.transform]="p.transform()"
        >
          @for (s of p.slices(); track s.name) {
            <svg:path
              [attr.d]="s.d"
              [attr.fill]="sliceColor(s.index)"
              stroke="var(--background)"
              [attr.stroke-width]="active() === s.index ? 3 : 2"
              class="cursor-pointer"
              (pointerenter)="tooltip() && active.set(s.index)"
              (pointerleave)="active.set(null)"
            />
          }
          @if (showLabels()) {
            @for (l of p.labels(); track l.index) {
              <svg:text
                [attr.x]="l.x"
                [attr.y]="l.y"
                text-anchor="middle"
                dominant-baseline="middle"
                class="pointer-events-none fill-background text-[10px] font-medium"
              >
                {{ l.name }}
              </svg:text>
            }
          }
        </svg:g>
      </svg>

      @if (tooltip() && active() !== null && p.labels()[active()!]) {
        <div
          class="pointer-events-none absolute z-10 min-w-24 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs shadow-md"
          [style.left.px]="p.center().cx + p.labels()[active()!].x"
          [style.top.px]="p.center().cy + p.labels()[active()!].y"
        >
          <div class="flex items-center gap-1.5 text-muted-foreground">
            <span
              class="size-2 rounded-[2px]"
              [style.background]="sliceColor(active()!)"
            ></span>
            <span>{{ activeName() }}</span>
            <span
              class="ml-auto pl-3 font-medium tabular-nums text-popover-foreground"
            >
              {{ activeValue() }}
            </span>
          </div>
        </div>
      }

      <ul
        class="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground"
      >
        @for (item of legend(); track item.name) {
          <li class="flex items-center gap-1.5">
            <span
              class="size-2.5 rounded-[2px]"
              [style.background]="item.color"
            ></span>
            {{ item.name }}
          </li>
        }
      </ul>

      <table class="sr-only">
        <caption>
          {{
            ariaLabel()
          }}
        </caption>
        <thead>
          <tr>
            <th>{{ nameKey() }}</th>
            <th>{{ dataKey() }}</th>
          </tr>
        </thead>
        <tbody>
          @for (row of data(); track $index) {
            <tr>
              <td>{{ row[nameKey()] }}</td>
              <td>{{ row[dataKey()] }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class PieChart {
  readonly data = input.required<readonly ChartDatum[]>();
  readonly nameKey = input.required<string>();
  readonly dataKey = input.required<string>();
  readonly config = input<ChartConfig>({});
  readonly donut = input(false);
  readonly showLabels = input(false);
  readonly tooltip = input(true);

  readonly active = signal<number | null>(null);

  protected sliceColor(i: number): string {
    return (this.data()[i]?.fill as string | undefined) ?? paletteColor(i);
  }

  readonly legend = computed<LegendItem[]>(() =>
    this.data().map((row, i) => ({
      name: String(row[this.nameKey()]),
      color: this.sliceColor(i),
    })),
  );

  readonly activeName = computed(() => {
    const i = this.active();
    return i === null ? '' : String(this.data()[i]?.[this.nameKey()] ?? '');
  });

  readonly activeValue = computed(() => {
    const i = this.active();
    if (i === null) return '';
    const cfg = this.config()[this.dataKey()];
    return formatValue(
      Number(this.data()[i]?.[this.dataKey()] ?? 0),
      cfg?.format || 'number',
    );
  });

  readonly ariaLabel = computed(
    () =>
      `${this.donut() ? 'Donut' : 'Pie'} chart of ${this.dataKey()} by ${this.nameKey()}`,
  );
}
