import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '@shadng/core';
import { Area } from '../headless/area';
import { CartesianGrid } from '../headless/cartesian-grid';
import { ChartFrame } from '../headless/chart-frame';
import { XAxis, YAxis } from '../headless/axis';
import type { ChartConfig, Datum } from '../headless/types';

interface SeriesView {
  key: string;
  label: string;
  color: string;
}

/**
 * Styled area chart. Pass tabular `data`, a serializable `config` mapping each
 * value field to a label + token color, and the `xKey` category field.
 *
 * @example
 * ```html
 * <area-chart [data]="data" [config]="config" xKey="month" />
 * ```
 */
@Component({
  selector: 'area-chart',
  imports: [ChartFrame, Area, CartesianGrid, XAxis, YAxis],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'area-chart' },
  template: `
    <figure role="img" [attr.aria-label]="ariaLabel()" [class]="cardClass">
      <svg
        chartFrame
        [data]="data()"
        [xKey]="xKey()"
        class="aspect-video w-full overflow-visible text-muted-foreground"
      >
        <svg:g cartesianGrid #grid="cartesianGrid">
          @for (line of grid.lines(); track $index) {
            <svg:line
              x1="0"
              x2="100%"
              [attr.y1]="line.y"
              [attr.y2]="line.y"
              stroke="currentColor"
              stroke-opacity="0.15"
            />
          }
        </svg:g>

        @for (s of series(); track s.key) {
          <svg:path
            [area]="s.key"
            [color]="s.color"
            [attr.stroke]="s.color"
            stroke-width="2"
            fill-opacity="0.2"
          />
        }

        <svg:g xAxis #x="xAxis">
          @for (t of x.ticks(); track t.label) {
            <svg:text
              [attr.x]="t.x"
              y="100%"
              dy="-2"
              text-anchor="middle"
              class="fill-muted-foreground text-[10px]"
            >{{ t.label }}</svg:text>
          }
        </svg:g>

        <svg:g yAxis #y="yAxis">
          @for (t of y.ticks(); track t.value) {
            <svg:text
              x="0"
              [attr.y]="t.y"
              dy="-2"
              class="fill-muted-foreground text-[10px]"
            >{{ t.label }}</svg:text>
          }
        </svg:g>
      </svg>

      <table class="sr-only">
        <caption>{{ ariaLabel() }}</caption>
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
    </figure>
  `,
})
export class AreaChart {
  readonly data = input.required<readonly Datum[]>();
  readonly config = input.required<ChartConfig>();
  readonly xKey = input.required<string>();

  readonly series = computed<SeriesView[]>(() =>
    Object.entries(this.config()).map(([key, entry]) => ({
      key,
      label: entry.label,
      color: entry.color,
    })),
  );

  readonly ariaLabel = computed(
    () => `Area chart of ${this.series().map((s) => s.label).join(', ')} by ${this.xKey()}`,
  );

  readonly cardClass = cn(
    'flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-card-foreground',
  );
}
