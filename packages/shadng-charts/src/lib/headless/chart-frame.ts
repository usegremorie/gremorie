import {
  afterNextRender,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { ChartContext } from './chart-context';
import type { Datum, Margin } from './types';
import { DEFAULT_MARGIN } from './types';

/**
 * Root of a headless chart. Apply to an `<svg>`. Provides a `ChartContext`
 * to all descendant series/axes, mirrors `data`/`xKey` into it, and tracks
 * the element's size via ResizeObserver (client-only). SSR renders with a
 * `viewBox` so the chart is meaningful before hydration.
 *
 * @example
 * ```html
 * <svg chartFrame [data]="data" xKey="month"><svg:path [area]="'sales'"/></svg>
 * ```
 */
@Directive({
  selector: 'svg[chartFrame]',
  providers: [ChartContext],
  host: {
    'data-slot': 'chart-frame',
    preserveAspectRatio: 'none',
    '[attr.viewBox]': 'viewBox()',
  },
})
export class ChartFrame {
  private readonly ctx = inject(ChartContext);
  private readonly el = inject<ElementRef<SVGSVGElement>>(ElementRef);

  readonly data = input.required<readonly Datum[]>();
  readonly xKey = input.required<string>();
  readonly margin = input<Margin>(DEFAULT_MARGIN);

  readonly viewBox = () => `0 0 ${this.ctx.width()} ${this.ctx.height()}`;

  constructor() {
    effect(() => {
      this.ctx.data.set(this.data());
      this.ctx.xKey.set(this.xKey());
      this.ctx.margin.set(this.margin());
    });

    afterNextRender(() => {
      const node = this.el.nativeElement;
      if (typeof ResizeObserver === 'undefined') {
        const rect = node.getBoundingClientRect();
        this.ctx.width.set(rect.width);
        this.ctx.height.set(rect.height);
        return;
      }
      const ro = new ResizeObserver((entries) => {
        const box = entries[0]?.contentRect;
        if (box) {
          this.ctx.width.set(box.width);
          this.ctx.height.set(box.height);
        }
      });
      ro.observe(node);
    });
  }
}
