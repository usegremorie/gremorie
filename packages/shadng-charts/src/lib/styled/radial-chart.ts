import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '@shadng/core';
import { ChartFrame } from '../headless/chart-frame';
import { RadialBar } from '../headless/radial-bar';
import type { Datum } from '../headless/types';

interface LegendItem {
  name: string;
  color: string;
}

/**
 * Styled radial bar chart — one concentric ring per data row (`nameKey`), each
 * sweep proportional to its `valueKey` value. Colors cycle `--chart-1..5`.
 *
 * @example
 * ```html
 * <radial-chart [data]="data" nameKey="browser" valueKey="visitors" />
 * ```
 */
@Component({
  selector: 'radial-chart',
  imports: [ChartFrame, RadialBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'radial-chart' },
  template: `
    <figure role="img" [attr.aria-label]="ariaLabel()" [class]="cardClass">
      <svg
        chartFrame
        [data]="data()"
        [xKey]="nameKey()"
        class="mx-auto aspect-square max-h-[260px] w-full overflow-visible text-muted-foreground"
      >
        <svg:g [radialBar]="valueKey()" #r="radialBar" [attr.transform]="r.transform()">
          @for (a of r.arcs(); track a.name) {
            <svg:path [attr.d]="a.track" fill="currentColor" fill-opacity="0.08" />
            <svg:path [attr.d]="a.d" [attr.fill]="color(a.index)" />
          }
        </svg:g>
      </svg>

      <ul class="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        @for (item of legend(); track item.name) {
          <li class="flex items-center gap-1.5">
            <span class="size-2.5 rounded-[2px]" [style.background]="item.color"></span>
            {{ item.name }}
          </li>
        }
      </ul>

      <table class="sr-only">
        <caption>{{ ariaLabel() }}</caption>
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
export class RadialChart {
  readonly data = input.required<readonly Datum[]>();
  readonly nameKey = input.required<string>();
  readonly valueKey = input.required<string>();

  protected readonly color = (i: number) => `var(--chart-${(i % 5) + 1})`;

  readonly legend = computed<LegendItem[]>(() =>
    this.data().map((row, i) => ({
      name: String(row[this.nameKey()]),
      color: this.color(i),
    })),
  );

  readonly ariaLabel = computed(
    () => `Radial bar chart of ${this.valueKey()} by ${this.nameKey()}`,
  );

  readonly cardClass = cn(
    'flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground',
  );
}
