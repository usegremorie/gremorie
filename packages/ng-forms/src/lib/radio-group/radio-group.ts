import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { BrnRadio, BrnRadioGroup } from '@spartan-ng/brain/radio-group';
import { cn } from '@gremorie/ng-core';

/**
 * RadioGroup — single-select group of mutually-exclusive options. Mirrors
 * React `RadioGroup` from `@gremorie/rx-forms`, which wraps
 * `@radix-ui/react-radio-group`.
 *
 * The Angular edition composes the spartan brain `BrnRadioGroup` directive as a
 * `hostDirective` — the Angular equivalent of the Radix RadioGroup `Root`. We
 * use the brain (not a hand-rolled group) because it owns the selected value,
 * roving tabindex (only the active option is in the tab order), arrow-key
 * navigation, and `ControlValueAccessor` — the exact behavioral contract Radix
 * gives the React `Root`, keeping the two editions at parity.
 *
 * ## React → Angular mapping
 *
 * - React `RadioGroup` = our `gn-radio-group`. The `data-slot="radio-group"`
 *   and the `grid gap-3` layout class are on our host. `value` /
 *   `onValueChange`, `name`, `disabled`, `required` are exposed by the brain
 *   directive and surfaced as inputs (`[name]`, `[(value)]`, `[disabled]`,
 *   `[required]`).
 * - React `RadioGroupItem` = our `gn-radio-group-item` (below).
 *
 * @example
 * ```html
 * <gn-radio-group [(value)]="plan">
 *   <gn-radio-group-item value="free" id="r1" />
 *   <gn-radio-group-item value="pro" id="r2" />
 * </gn-radio-group>
 * ```
 */
@Component({
  selector: 'gn-radio-group',
  standalone: true,
  hostDirectives: [
    {
      directive: BrnRadioGroup,
      inputs: ['name', 'value', 'disabled', 'required'],
      outputs: ['valueChange'],
    },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'radio-group',
    class: 'grid gap-3',
  },
})
export class RadioGroup {}

/**
 * RadioGroupItem — a single option inside a RadioGroup. Mirrors React
 * `RadioGroupItem`, which wraps the Radix RadioGroup `Item` + `Indicator`.
 *
 * Renders the brain `brn-radio` (the Angular equivalent of Radix `Item`). The
 * React `Item` class string (`aspect-square size-4 rounded-full border…`) is
 * applied verbatim to the `brn-radio` host element, which also carries the
 * `data-slot="radio-group-item"`.
 *
 * The indicator: React renders a `CircleIcon` inside a Radix `Indicator` that
 * only mounts when the item is selected. `brn-radio` exposes the `[indicator]`
 * projection slot and toggles a `.brn-radio-checked` class on its host when
 * selected. To stay faithful we project the filled-circle SVG (the lucide
 * `circle` icon, hand-inlined since lucide is unavailable in Angular here) into
 * `[indicator]` and gate its visibility off that host class via the
 * `group-[.brn-radio-checked]:flex hidden` arbitrary variant — visible only
 * when selected, matching React.
 */
@Component({
  selector: 'gn-radio-group-item',
  standalone: true,
  imports: [BrnRadio],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <brn-radio
      data-slot="radio-group-item"
      [class]="computedClass()"
      [value]="value()"
      [disabled]="disabled()"
      [id]="id() || undefined"
      [aria-label]="ariaLabel() || undefined"
    >
      <span
        indicator
        data-slot="radio-group-indicator"
        class="relative hidden items-center justify-center group-[.brn-radio-checked]:flex"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-primary"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      </span>
    </brn-radio>
  `,
})
export class RadioGroupItem {
  /** The value this item represents. Mirrors React `value` (required). */
  readonly value = input.required<string>();
  /** Disable just this option. Mirrors React `disabled`. */
  readonly disabled = input<boolean>(false);
  /** Element id (for label association). Mirrors React `id`. */
  readonly id = input<string>('');
  /** Accessible label when no visible label exists. Mirrors React `aria-label`. */
  readonly ariaLabel = input<string>('');
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  /**
   * The React `RadioGroupItem` class string, verbatim, applied to the brain
   * `brn-radio` host and merged with any consumer `class`. The leading `group`
   * (set statically on the element) cooperates with this string so the
   * indicator can key off `.brn-radio-checked`.
   */
  protected readonly computedClass = computed(() =>
    cn(
      'group aspect-square size-4 shrink-0 rounded-full border border-input text-primary shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40',
      this.class(),
    ),
  );
}
