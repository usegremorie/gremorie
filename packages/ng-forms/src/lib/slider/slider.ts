import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  ViewEncapsulation,
} from '@angular/core';
import {
  BrnSlider,
  BrnSliderRange,
  BrnSliderThumb,
  BrnSliderTrack,
} from '@spartan-ng/brain/slider';
import { cn } from '@gremorie/ng-core';

/**
 * Slider — continuous numeric input via draggable thumb. Angular parity port of
 * React `Slider` from `@gremorie/rx-forms`, which wraps Radix `Slider`.
 *
 * Single thumb by default; pass a two-element `value` (e.g. `[low, high]`) for a
 * range slider — the template renders one thumb per value via `@for`. Honors
 * `step`, `min`, `max`, and `orientation="vertical"`.
 *
 * The behavior is delegated to the spartan brain `BrnSlider` directive (the
 * Angular equivalent of Radix Slider). `brnSlider` is applied to the **root**
 * element so the projected track/range/thumb directives — whose injector chain
 * runs through the host — resolve their owning `BrnSlider`. The brain already
 * emits `data-slot`, `data-orientation` and `data-disabled` on each part, so we
 * only contribute the React class strings (which key off those data attributes).
 *
 * Use Slider when **approximate position is more useful than exact precision** —
 * volume, brightness, price filters. For exact values use a number Input; for
 * discrete choices prefer RadioGroup or Select. Always show the current value
 * next to the slider.
 *
 * Parity with React `Slider`:
 * - `value` (number[] model) ↔ React `value`/`defaultValue`
 * - `min` (0), `max` (100), `step` ↔ React `min`/`max`/`step`
 * - `disabled` ↔ React Root `disabled`
 * - `orientation` ('horizontal'|'vertical') ↔ React `orientation`
 * - `thumbAriaLabel` (string | string[]) ↔ React `thumbAriaLabel`
 *
 * @example
 * ```html
 * <gn-slider [value]="[50]" [min]="0" [max]="100" thumbAriaLabel="Volume" />
 * <gn-slider [value]="[25, 75]" [thumbAriaLabel]="['Minimum', 'Maximum']" />
 * ```
 */
@Component({
  selector: 'gn-slider',
  standalone: true,
  imports: [BrnSlider, BrnSliderTrack, BrnSliderRange, BrnSliderThumb],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      brnSlider
      [value]="value()"
      [min]="min()"
      [max]="max()"
      [step]="step()"
      [disabled]="disabled()"
      [orientation]="orientation()"
      [class]="rootClass()"
    >
      <div brnSliderTrack [class]="trackClass()">
        <div brnSliderRange [class]="rangeClass()"></div>
      </div>
      @for (thumb of value(); track $index) {
        <span
          brnSliderThumb
          [attr.aria-label]="thumbLabel($index)"
          [class]="thumbClass()"
        ></span>
      }
    </div>
  `,
})
export class Slider {
  /** The current slider value(s). One thumb is rendered per value. Mirrors React `value`. */
  readonly value = model<number[]>([0]);
  /** Minimum allowed value. Mirrors React `min` (default 0). */
  readonly min = input<number>(0);
  /** Maximum allowed value. Mirrors React `max` (default 100). */
  readonly max = input<number>(100);
  /** Step increment. Mirrors React `step`. */
  readonly step = input<number>(1);
  /** Whether the slider is disabled. Mirrors React Root `disabled`. */
  readonly disabled = input<boolean>(false);
  /** Slider orientation. Mirrors React `orientation`. */
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  /**
   * Accessible name for each thumb. Pass an array for multi-thumb (range)
   * sliders. Mirrors React `thumbAriaLabel`. Falls back to a generic
   * "Slider thumb {index + 1}". Required for WCAG SC 4.1.2 when the slider has
   * no adjacent visible label.
   */
  readonly thumbAriaLabel = input<string | string[]>();

  protected thumbLabel(index: number): string {
    const label = this.thumbAriaLabel();
    if (Array.isArray(label)) {
      return label[index] ?? `Slider thumb ${index + 1}`;
    }
    if (typeof label === 'string') {
      return label;
    }
    return `Slider thumb ${index + 1}`;
  }

  protected readonly rootClass = computed(() =>
    cn(
      'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
    ),
  );

  protected readonly trackClass = computed(() =>
    cn(
      'relative grow overflow-hidden rounded-full bg-muted data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5',
    ),
  );

  protected readonly rangeClass = computed(() =>
    cn(
      'absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
    ),
  );

  protected readonly thumbClass = computed(() =>
    cn(
      'block size-4 shrink-0 rounded-full border border-primary bg-background shadow-sm ring-ring/50 transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50',
    ),
  );
}
