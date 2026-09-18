import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  effect,
  input,
  ViewContainerRef,
  inject,
  type Type,
} from '@angular/core';

/** One legend entry: a swatch (or the series' own icon) beside its label. */
export interface ChartLegendItem {
  key: string;
  label: string;
  color: string;
  /** Optional component drawn in place of the colour swatch. */
  icon?: Type<unknown>;
}

/**
 * Renders a component class into this element.
 *
 * `NgComponentOutlet` would do the same, but it lives in `@angular/common`,
 * and no `@gremorie/ng-*` package declares that dependency today (`ng-ai`
 * imports it regardless, which is a packaging hole worth closing separately).
 * `ViewContainerRef` is in `@angular/core`, which every package already has,
 * so the chart legend does not widen that hole.
 */
@Directive({ selector: '[chartIcon]', standalone: true })
export class ChartIconOutlet {
  readonly icon = input.required<Type<unknown>>({ alias: 'chartIcon' });
  private readonly vcr = inject(ViewContainerRef);

  constructor() {
    effect(() => {
      const type = this.icon();
      this.vcr.clear();
      this.vcr.createComponent(type);
    });
  }
}

/**
 * The legend under a chart — the Angular counterpart of React's
 * `ChartLegendList`, and the single place the markup lives.
 *
 * It was duplicated across the three polar charts before this, which is how
 * `icon` came to work in one edition and not the other: adding it meant
 * touching three files, so nobody did.
 *
 * `icon` mirrors React's `ChartConfig.icon` — when a series supplies one it
 * replaces the swatch, and the colour reaches it through `currentColor`, so a
 * plain SVG icon picks up the series hue without the consumer wiring anything.
 */
@Component({
  selector: 'chart-legend',
  standalone: true,
  imports: [ChartIconOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul
      class="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground"
    >
      @for (item of items(); track item.key) {
        <li class="flex items-center gap-1.5">
          @if (item.icon; as icon) {
            <span
              data-slot="chart-legend-icon"
              class="[&>svg]:size-3 [&>svg]:shrink-0"
              [style.color]="item.color"
            >
              <!-- The anchor sits INSIDE the span on purpose: ViewContainerRef
                   inserts the created component as a sibling of its anchor, so
                   an anchor on the span itself would drop the icon outside the
                   colour context. -->
              <ng-container [chartIcon]="icon" />
            </span>
          } @else {
            <span
              data-slot="chart-legend-swatch"
              class="size-2.5 rounded-[2px]"
              [style.background]="item.color"
            ></span>
          }
          {{ item.label }}
        </li>
      }
    </ul>
  `,
})
export class ChartLegend {
  readonly items = input.required<readonly ChartLegendItem[]>();
}
