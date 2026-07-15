import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { ChartFrame } from '../headless/chart-frame';
import { Radar } from '../headless/radar';
import { formatValue } from '../headless/format';
import {
  paletteColor,
  titleCaseKey,
  type ChartConfig,
  type ChartDatum,
  type GridType,
} from '../headless/types';

interface SeriesView {
  key: string;
  label: string;
  color: string;
  format?: string;
}

/**
 * Styled radar chart — parity with `@gremorie/rx-data`'s `RadarChart`. Each data
 * row (`xKey`) becomes a spoke; each `config` entry a closed series polygon
 * sharing one radial max. `gridType` switches the grid between polygon and
 * circle; `tooltip` enables per-spoke hover.
 *
 * @example
 * ```html
 * <radar-chart [data]="data" [config]="config" xKey="metric" gridType="circle" />
 * ```
 */
@Component({
  selector: 'radar-chart',
  imports: [ChartFrame, Radar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'radar-chart',
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
        [xKey]="xKey()"
        class="mx-auto aspect-square max-h-[280px] w-full overflow-visible text-muted-foreground"
      >
        @for (s of series(); track s.key; let i = $index) {
          <svg:g [radar]="s.key" [color]="s.color" #r="radar">
            @if (i === 0) {
              @if (gridType() === 'circle') {
                @for (level of gridLevels; track level) {
                  <svg:circle
                    [attr.cx]="r.center().cx"
                    [attr.cy]="r.center().cy"
                    [attr.r]="r.center().radius * level"
                    fill="none"
                    stroke="currentColor"
                    stroke-opacity="0.12"
                  />
                }
              } @else {
                @for (ring of r.rings(); track $index) {
                  <svg:path
                    [attr.d]="ring"
                    fill="none"
                    stroke="currentColor"
                    stroke-opacity="0.12"
                  />
                }
              }
              @for (ax of r.axes(); track ax.label; let ai = $index) {
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
                @if (tooltip()) {
                  <svg:line
                    [attr.x1]="r.center().cx"
                    [attr.y1]="r.center().cy"
                    [attr.x2]="ax.x2"
                    [attr.y2]="ax.y2"
                    stroke="transparent"
                    stroke-width="18"
                    class="cursor-pointer"
                    (pointerenter)="active.set({ i: ai, lx: ax.lx, ly: ax.ly })"
                    (pointerleave)="active.set(null)"
                  />
                }
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

      @if (tooltip() && active() !== null) {
        <div
          class="pointer-events-none absolute z-10 min-w-28 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs shadow-md"
          [style.left.px]="active()!.lx"
          [style.top.px]="active()!.ly"
        >
          <div class="mb-1 font-medium text-popover-foreground">
            {{ activeLabel() }}
          </div>
          @for (row of tipRows(active()!.i); track row.key) {
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
    </div>
  `,
})
export class RadarChart {
  readonly data = input.required<readonly ChartDatum[]>();
  readonly config = input.required<ChartConfig>();
  readonly xKey = input.required<string>();
  readonly gridType = input<GridType>('polygon');
  readonly tooltip = input(true);

  readonly active = signal<{ i: number; lx: number; ly: number } | null>(null);
  protected readonly gridLevels = [0.25, 0.5, 0.75, 1] as const;

  readonly activeLabel = computed(() => {
    const a = this.active();
    return a ? String(this.data()[a.i]?.[this.xKey()] ?? '') : '';
  });

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

  protected tipRows(
    i: number,
  ): { key: string; label: string; color: string; value: string }[] {
    const row = this.data()[i];
    if (!row) return [];
    return this.series().map((s) => ({
      key: s.key,
      label: s.label,
      color: s.color,
      value: formatValue(Number(row[s.key] ?? 0), s.format || 'number'),
    }));
  }

  readonly ariaLabel = computed(
    () =>
      `Radar chart of ${this.series()
        .map((s) => s.label)
        .join(', ')} by ${this.xKey()}`,
  );
}
