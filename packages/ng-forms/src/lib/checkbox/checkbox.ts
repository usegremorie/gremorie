import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  untracked,
  ViewEncapsulation,
} from '@angular/core';
import { BrnCheckbox } from '@spartan-ng/brain/checkbox';
import { cn } from '@gremorie/ng-core';

/** Mirrors React's `boolean | 'indeterminate'` checked union. */
export type CheckedState = boolean | 'indeterminate';

/**
 * Checkbox — binary or indeterminate selection control. Mirrors React
 * `Checkbox` from `@gremorie/rx-forms`, which wraps `@radix-ui/react-checkbox`.
 *
 * The Angular edition wraps the spartan brain `BrnCheckbox` — the Angular
 * equivalent of the Radix Checkbox. We use the brain (not a hand-rolled
 * `<button role="checkbox">`) because it ships the full a11y + state contract
 * for free: `role="checkbox"`, `aria-checked` (`true | false | mixed`),
 * `data-state` (`checked | unchecked | indeterminate`), `data-disabled`, focus
 * tracking, and `ControlValueAccessor` so the component drops into reactive /
 * template-driven forms. That is exactly the surface Radix gives the React
 * version, so the brain keeps the two editions at behavioral parity.
 *
 * ## React → Angular mapping
 *
 * - `brn-checkbox` renders its own inner `<button role="checkbox">` and applies
 *   `[class]` + `data-state` to *that button* (the host element is
 *   `display: contents`). So the React `className` (verbatim) is forwarded via
 *   the `[class]` input of `brn-checkbox`, landing on the button exactly where
 *   Radix `Checkbox.Root` puts it. `data-slot="checkbox"` is set on our host.
 * - React's `checked` (`boolean | 'indeterminate'`) is preserved: the `checked`
 *   input accepts that union, and an `indeterminate` model mirrors the
 *   normalized third state. Both are bridged onto the brain's `checked` /
 *   `indeterminate` models with effects, with `checkedChange` re-emitted.
 * - The indicator: React renders the `CheckIcon` inside a Radix `Indicator`
 *   that *only mounts when checked*. `brn-checkbox` instead projects content
 *   unconditionally into its button, so to stay faithful we gate the icon with
 *   `@if (showIndicator())` — visible only when checked or indeterminate. The
 *   icon is the lucide `check` path (lucide is unavailable in Angular here, so
 *   it is hand-inlined as SVG at `size-3.5`, matching React).
 * - Reach for `Checkbox` for form values submitted on submit; reach for
 *   `Switch` when the toggle takes effect immediately.
 *
 * @example
 * ```html
 * <gr-checkbox [(checked)]="agreed" id="terms" />
 * ```
 */
@Component({
  selector: 'gr-checkbox',
  standalone: true,
  imports: [BrnCheckbox],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <brn-checkbox
      data-slot="checkbox"
      [class]="computedClass()"
      [(checked)]="brnChecked"
      [(indeterminate)]="indeterminate"
      [id]="id() || null"
      [name]="name() || null"
      [disabled]="disabled()"
      [required]="required()"
      [aria-label]="ariaLabel() || null"
      [forceInvalid]="ariaInvalid()"
    >
      @if (showIndicator()) {
        <span
          data-slot="checkbox-indicator"
          class="grid place-content-center text-current transition-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      }
    </brn-checkbox>
  `,
})
export class Checkbox {
  /**
   * Checked state. Mirrors React `checked` (`boolean | 'indeterminate'`).
   * Two-way bindable as `[(checked)]`.
   */
  readonly checked = model<CheckedState>(false);
  /** Indeterminate state. Mirrors React `indeterminate` via the union above. */
  readonly indeterminate = model<boolean>(false);
  /** Disable interaction. Mirrors React `disabled`. */
  readonly disabled = input<boolean>(false);
  /** Required in a form. Mirrors React `required`. */
  readonly required = input<boolean>(false);
  /** Element id (for label association). Mirrors React `id`. */
  readonly id = input<string>('');
  /** Form control name. Mirrors React `name`. */
  readonly name = input<string>('');
  /** Accessible label when no visible label exists. Mirrors React `aria-label`. */
  readonly ariaLabel = input<string>('');
  /** Switches to destructive error styling. Mirrors React `aria-invalid`. */
  readonly ariaInvalid = input<boolean>(false);
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  /** Plain boolean checked state bridged to/from the brain `checked` model. */
  protected readonly brnChecked = model<boolean>(false);

  /** Whether to render the check indicator (checked OR indeterminate). */
  protected readonly showIndicator = computed(
    () => this.checked() === true || this.indeterminate(),
  );

  /**
   * The React `Checkbox` class string, verbatim, forwarded to the brain inner
   * button via `[class]` and merged with any consumer `class`.
   */
  protected readonly computedClass = computed(() =>
    cn(
      'peer size-4 shrink-0 rounded-[4px] border border-input shadow-xs transition-shadow outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:data-[state=checked]:bg-primary',
      this.class(),
    ),
  );

  constructor() {
    // Bridge the public union `checked` -> internal boolean for the brain.
    effect(() => {
      const c = this.checked();
      untracked(() => {
        if (c === 'indeterminate') {
          if (!this.indeterminate()) this.indeterminate.set(true);
        } else if (this.brnChecked() !== c) {
          this.brnChecked.set(c);
        }
      });
    });

    // Bridge the internal boolean back to the public union.
    effect(() => {
      const b = this.brnChecked();
      untracked(() => {
        if (this.checked() !== b && this.checked() !== 'indeterminate') {
          this.checked.set(b);
        }
      });
    });

    // When indeterminate flips on, reflect it on the public union.
    effect(() => {
      const ind = this.indeterminate();
      untracked(() => {
        if (ind && this.checked() !== 'indeterminate') {
          this.checked.set('indeterminate');
        }
      });
    });
  }
}
