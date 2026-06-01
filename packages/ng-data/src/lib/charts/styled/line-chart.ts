import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';
import { CartesianGrid } from '../headless/cartesian-grid';
import { ChartFrame } from '../headless/chart-frame';
import { Line } from '../headless/line';
import { XAxis, YAxis } from '../headless/axis';
import type { ChartConfig, Datum } from '../headless/types';

interface SeriesView {
  key: string;
  label: string;
  color: string;
}

/**
 * Styled line chart. Pass tabular `data`, a serializable `config` mapping each
 * value field to a label + token color, and the `xKey` category field.
 *
 * @example
 * ```html
 * <line-chart [data]="data" [config]="config" xKey="month" />
 * ```
 */
@Component({
  selector: 'line-chart',
  imports: [ChartFrame, Line, CartesianGrid, XAxis, YAxis],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'line-chart' },
  template: `
    <figure role="img" [attr.aria-label]="ariaLabel()" [class]="cardClass">
      <svg
        chartFrame
        [data]="data()"
        [xKey]="xKey()"
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
          <svg:path [line]="s.key" [color]="s.color" stroke-width="2" />
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
      </svg>

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
    </figure>
  `,
})
export class LineChart {
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
    () =>
      `Line chart of ${this.series()
        .map((s) => s.label)
        .join(', ')} by ${this.xKey()}`,
  );

  readonly cardClass = cn(
    'flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-card-foreground',
  );
}
