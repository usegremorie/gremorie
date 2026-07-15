import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { ChartFrame } from '../headless/chart-frame';
import { RadialBar } from '../headless/radial-bar';
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
 * Styled radial bar chart — parity with `@gremorie/rx-data`'s `RadialChart`. One
 * concentric ring per data row (`nameKey`), each sweep proportional to its
 * `dataKey` value. Colors come from each row's `fill`, falling back to the
 * palette. `tooltip` enables per-arc hover.
 *
 * @example
 * ```html
 * <radial-chart [data]="data" nameKey="browser" dataKey="visitors" />
 * ```
 */
@Component({
  selector: 'radial-chart',
  imports: [ChartFrame, RadialBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'radial-chart',
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
          [radialBar]="dataKey()"
          #r="radialBar"
          [attr.transform]="r.transform()"
        >
          @for (a of r.arcs(); track a.name) {
            <svg:path
              [attr.d]="a.track"
              fill="currentColor"
              fill-opacity="0.08"
            />
            <svg:path
              [attr.d]="a.d"
              [attr.fill]="arcColor(a.index)"
              [attr.fill-opacity]="
                active() === null || active() === a.index ? 1 : 0.5
              "
              class="cursor-pointer"
              (pointerenter)="tooltip() && active.set(a.index)"
              (pointerleave)="active.set(null)"
            />
          }
        </svg:g>
      </svg>

      @if (tooltip() && active() !== null) {
        <div
          class="pointer-events-none absolute z-10 min-w-24 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs shadow-md"
          [style.left.px]="r.center().cx"
          [style.top.px]="r.center().cy"
        >
          <div class="flex items-center gap-1.5 text-muted-foreground">
            <span
              class="size-2 rounded-[2px]"
              [style.background]="arcColor(active()!)"
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
export class RadialChart {
  readonly data = input.required<readonly ChartDatum[]>();
  readonly nameKey = input.required<string>();
  readonly dataKey = input.required<string>();
  readonly config = input<ChartConfig>({});
  readonly tooltip = input(true);

  readonly active = signal<number | null>(null);

  protected arcColor(i: number): string {
    return (this.data()[i]?.fill as string | undefined) ?? paletteColor(i);
  }

  readonly legend = computed<LegendItem[]>(() =>
    this.data().map((row, i) => ({
      name: String(row[this.nameKey()]),
      color: this.arcColor(i),
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
    () => `Radial bar chart of ${this.dataKey()} by ${this.nameKey()}`,
  );
}
