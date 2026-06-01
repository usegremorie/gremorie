import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';
import { ChartFrame } from '../headless/chart-frame';
import { Radar } from '../headless/radar';
import type { ChartConfig, Datum } from '../headless/types';

interface SeriesView {
  key: string;
  label: string;
  color: string;
}

/**
 * Styled radar chart. Each data row (`xKey`) becomes a spoke; each entry in
 * `config` becomes a closed series polygon sharing one radial max.
 *
 * @example
 * ```html
 * <radar-chart [data]="data" [config]="config" xKey="metric" />
 * ```
 */
@Component({
  selector: 'radar-chart',
  imports: [ChartFrame, Radar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'radar-chart' },
  template: `
    <figure role="img" [attr.aria-label]="ariaLabel()" [class]="cardClass">
      <svg
        chartFrame
        [data]="data()"
        [xKey]="xKey()"
        class="mx-auto aspect-square max-h-[280px] w-full overflow-visible text-muted-foreground"
      >
        @for (s of series(); track s.key; let i = $index) {
          <svg:g [radar]="s.key" [color]="s.color" #r="radar">
            @if (i === 0) {
              @for (ring of r.rings(); track $index) {
                <svg:path
                  [attr.d]="ring"
                  fill="none"
                  stroke="currentColor"
                  stroke-opacity="0.12"
                />
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
              [attr.d]="r.d()"
              [attr.fill]="s.color"
              fill-opacity="0.2"
              [attr.stroke]="s.color"
              stroke-width="2"
            />
          </svg:g>
        }
      </svg>

      <ul
        class="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground"
      >
        @for (s of series(); track s.key) {
          <li class="flex items-center gap-1.5">
            <span
              class="size-2.5 rounded-[2px]"
              [style.background]="s.color"
            ></span>
            {{ s.label }}
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
export class RadarChart {
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
      `Radar chart of ${this.series()
        .map((s) => s.label)
        .join(', ')} by ${this.xKey()}`,
  );

  readonly cardClass = cn(
    'flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground',
  );
}
