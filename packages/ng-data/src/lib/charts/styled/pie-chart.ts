import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';
import { ChartFrame } from '../headless/chart-frame';
import { Pie } from '../headless/pie';
import type { Datum } from '../headless/types';

interface LegendItem {
  name: string;
  color: string;
}

/**
 * Styled pie / donut chart. `nameKey` is the slice label field, `valueKey` the
 * numeric value field. Slice colors cycle through the `--chart-1..5` tokens.
 * Set `donut` for a donut.
 *
 * @example
 * ```html
 * <pie-chart [data]="data" nameKey="browser" valueKey="visitors" [donut]="true" />
 * ```
 */
@Component({
  selector: 'pie-chart',
  imports: [ChartFrame, Pie],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'pie-chart' },
  template: `
    <figure role="img" [attr.aria-label]="ariaLabel()" [class]="cardClass">
      <svg
        chartFrame
        [data]="data()"
        [xKey]="nameKey()"
        class="mx-auto aspect-square max-h-[260px] w-full overflow-visible text-muted-foreground"
      >
        <svg:g
          [pie]="valueKey()"
          [innerRadiusRatio]="donut() ? 0.6 : 0"
          #p="pie"
          [attr.transform]="p.transform()"
        >
          @for (s of p.slices(); track s.name) {
            <svg:path
              [attr.d]="s.d"
              [attr.fill]="color(s.index)"
              stroke="var(--background)"
              stroke-width="2"
            />
          }
        </svg:g>
      </svg>

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
            <th>{{ valueKey() }}</th>
          </tr>
        </thead>
        <tbody>
          @for (row of data(); track $index) {
            <tr>
              <td>{{ row[nameKey()] }}</td>
              <td>{{ row[valueKey()] }}</td>
            </tr>
          }
        </tbody>
      </table>
    </figure>
  `,
})
export class PieChart {
  readonly data = input.required<readonly Datum[]>();
  readonly nameKey = input.required<string>();
  readonly valueKey = input.required<string>();
  readonly donut = input<boolean>(false);

  protected readonly color = (i: number) => `var(--chart-${(i % 5) + 1})`;

  readonly legend = computed<LegendItem[]>(() =>
    this.data().map((row, i) => ({
      name: String(row[this.nameKey()]),
      color: this.color(i),
    })),
  );

  readonly ariaLabel = computed(
    () =>
      `${this.donut() ? 'Donut' : 'Pie'} chart of ${this.valueKey()} by ${this.nameKey()}`,
  );

  readonly cardClass = cn(
    'flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground',
  );
}
