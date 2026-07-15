import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { BrnSwitch, BrnSwitchThumb } from '@spartan-ng/brain/switch';
import { cn } from '@gremorie/ng-core';

/** Mirrors the React `size` prop. */
export type SwitchSize = 'sm' | 'default';

/**
 * Switch — immediate-effect toggle. Mirrors React `Switch` from
 * `@gremorie/rx-forms`, which wraps `@radix-ui/react-switch`.
 *
 * The Angular edition wraps the spartan brain `BrnSwitch` + `BrnSwitchThumb` —
 * the Angular equivalent of the Radix Switch `Root` + `Thumb`. We use the brain
 * (not a hand-rolled `<button role="switch">`) because it ships the full a11y +
 * state contract: `role="switch"`, `aria-checked`, `data-state`
 * (`checked | unchecked`), `data-disabled`, focus tracking and
 * `ControlValueAccessor` — the same surface Radix gives the React version.
 *
 * ## React → Angular mapping
 *
 * - React `Switch` = our `gr-switch`. `data-slot="switch"` is on our host. The
 *   brain renders its own inner `<button role="switch">` and applies `[class]`
 *   + `data-state` to *that button*, so the React Root **visual** class string
 *   (track background / border / shape, which key off `data-[state=…]`) is
 *   forwarded verbatim via the `[class]` input, landing on the button exactly
 *   where Radix `Switch.Root` puts it.
 * - **Size handling — faithful divergence.** React sets `data-size` *and* the
 *   `data-[size=…]:h-…/w-…` track classes on the same Root element, and the
 *   thumb keys off `group-data-[size=…]/switch`. The brain owns the button, so
 *   we cannot add `data-size` to it. Instead we put `group/switch` **and**
 *   `data-size` on our **host**, and route the size-dependent track + thumb
 *   classes through `group-data-[size=…]/switch:` against that host. Visual
 *   output is identical; only the selector anchor moves from the button to the
 *   host wrapper.
 * - React `size` prop = our `size` input (`'sm' | 'default'`).
 * - Reach for `Switch` when toggling takes effect immediately; reach for
 *   `Checkbox` for a value submitted with a form.
 *
 * @example
 * ```html
 * <gr-switch [(checked)]="notifications" id="notify" />
 * ```
 */
@Component({
  selector: 'gr-switch',
  standalone: true,
  imports: [BrnSwitch, BrnSwitchThumb],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <brn-switch
      class="group/switch-state"
      data-slot="switch"
      [class]="rootClass()"
      [(checked)]="checked"
      [id]="id() || null"
      [name]="name() || null"
      [disabled]="disabled()"
    >
      <brn-switch-thumb data-slot="switch-thumb" [class]="thumbClass()" />
    </brn-switch>
  `,
  host: {
    '[attr.data-size]': 'size()',
    class: 'group/switch contents',
  },
})
export class Switch {
  /**
   * Checked state. Mirrors React `checked` / `onCheckedChange`. Two-way
   * bindable as `[(checked)]`.
   */
  readonly checked = model<boolean>(false);
  /** Visual size. Mirrors React `size` (`'sm' | 'default'`, default `default`). */
  readonly size = input<SwitchSize>('default');
  /** Disable interaction. Mirrors React `disabled`. */
  readonly disabled = input<boolean>(false);
  /** Element id (for label association). Mirrors React `id`. */
  readonly id = input<string>('');
  /** Form control name. Mirrors React `name`. */
  readonly name = input<string>('');
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  /**
   * The React Switch Root class string, applied to the brain inner button via
   * `[class]`. Track sizing keys off `group-data-[size=…]/switch` on our host
   * (see the divergence note above) rather than a local `data-[size=…]`; all
   * other classes — including the `data-[state=…]` ones — match React verbatim.
   */
  protected readonly rootClass = computed(() =>
    cn(
      'peer inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 group-data-[size=default]/switch:h-[1.15rem] group-data-[size=default]/switch:w-8 group-data-[size=sm]/switch:h-3.5 group-data-[size=sm]/switch:w-6 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80',
      this.class(),
    ),
  );

  /**
   * The React Switch Thumb class string. Size keys off the host
   * `group-data-[size=…]/switch`. **Faithful divergence:** the brain
   * `brn-switch-thumb` does *not* carry `data-state` (unlike the Radix Thumb),
   * but the `brn-switch` host element does, so the translate-on-checked is
   * routed through `group-data-[state=…]/switch-state` against that host
   * instead of the thumb's own `data-[state=…]`. Visual output is identical.
   */
  protected readonly thumbClass = computed(() =>
    cn(
      'pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[state=checked]/switch-state:translate-x-[calc(100%-2px)] group-data-[state=unchecked]/switch-state:translate-x-0 dark:group-data-[state=checked]/switch-state:bg-primary-foreground dark:group-data-[state=unchecked]/switch-state:bg-foreground',
    ),
  );
}
