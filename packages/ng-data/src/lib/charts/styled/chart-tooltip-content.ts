import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';

/** One series row inside the tooltip card. */
export interface ChartTooltipRow {
  key: string;
  label: string;
  color: string;
  value: string;
}

/**
 * Chart tooltip card — the floating popover the cartesian charts show on hover,
 * as a standalone, reusable component (parity with React `ChartTooltipContent`
 * from `@gremorie/rx-data`). Presentational only: it takes the resolved `label`
 * (category header) and `rows` (series) and renders them; the charts pass those
 * from the `chartTooltip` directive and add positioning via `[chartTooltipCard]`.
 *
 * Variants mirror React: `indicator` ('dot' | 'line' | 'dashed'), `hideLabel`,
 * `hideIndicator`.
 *
 * @example
 * ```html
 * <chart-tooltip-content [chartTooltipCard]="tip" class="absolute z-10"
 *   [label]="activeName(tip)" [rows]="tipRows(tip)" />
 * ```
 */
@Component({
  selector: 'chart-tooltip-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'chart-tooltip',
    class:
      'block min-w-32 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-card-foreground shadow-md',
  },
  template: `
    @if (!hideLabel() && label()) {
      <div class="mb-1 font-medium">{{ label() }}</div>
    }
    @for (row of rows(); track row.key) {
      <div class="flex items-center gap-1.5 text-muted-foreground">
        @if (!hideIndicator()) {
          @switch (indicator()) {
            @case ('line') {
              <span
                class="h-3 w-1 shrink-0 rounded-[2px]"
                [style.background]="row.color"
              ></span>
            }
            @case ('dashed') {
              <span
                class="h-3 w-0 shrink-0 border-l-2 border-dashed"
                [style.borderColor]="row.color"
              ></span>
            }
            @default {
              <span
                class="size-2 shrink-0 rounded-[2px]"
                [style.background]="row.color"
              ></span>
            }
          }
        }
        <span>{{ row.label }}</span>
        <span
          class="ml-auto pl-3 font-medium tabular-nums text-card-foreground"
        >
          {{ row.value }}
        </span>
      </div>
    }
  `,
})
export class ChartTooltipContent {
  /** Category header (hidden when `hideLabel`). */
  readonly label = input<string>('');
  /** Series rows. */
  readonly rows = input<readonly ChartTooltipRow[]>([]);
  /** Swatch style. */
  readonly indicator = input<'dot' | 'line' | 'dashed'>('dot');
  /** Drop the category header. */
  readonly hideLabel = input(false);
  /** Drop the color swatch. */
  readonly hideIndicator = input(false);
}
