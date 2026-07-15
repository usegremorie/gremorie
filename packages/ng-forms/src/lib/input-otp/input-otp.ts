import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { BrnInputOtpSlot } from '@spartan-ng/brain/input-otp';
import { cn } from '@gremorie/ng-core';

// Re-export the brain OTP component so consumers can use `<brn-input-otp grInputOtp>`
// as the container element (see `InputOtp` below for why it is the element).
export { BrnInputOtp } from '@spartan-ng/brain/input-otp';

/**
 * InputOTP — segmented one-time-passcode input. Mirrors React `InputOTP` from
 * `@gremorie/rx-forms`, which is built on the `input-otp` library.
 *
 * The Angular edition wraps the spartan brain `BrnInputOtp` — the Angular
 * equivalent of the `input-otp` `OTPInput`. We use the brain (not a
 * hand-rolled multi-input) because it owns the full OTP contract for free:
 * a single hidden `<input autocomplete="one-time-code">` driving every slot,
 * paste handling, focus tracking, the per-slot `char` / `isActive` /
 * `hasFakeCaret` state, and `ControlValueAccessor` so the component drops into
 * reactive / template-driven forms. That is exactly what the `input-otp`
 * library gives the React version, keeping the two editions at parity.
 *
 * ## React → Angular mapping
 *
 * - React `InputOTP` (the `OTPInput`) = the brain `<brn-input-otp>` element with
 *   our `grInputOtp` directive, which carries `data-slot="input-otp"` and the
 *   React `containerClassName` (`flex items-center gap-2 has-[:disabled]:opacity-50`).
 *   React's `maxLength` / `value` / `disabled` map to the brain's own
 *   `[maxLength]` / `[(value)]` / `[disabled]` inputs on that element.
 * - React `InputOTPGroup` = `gr-input-otp-group` (a `flex items-center` div
 *   carrying `data-slot="input-otp-group"`).
 * - React `InputOTPSlot` = `gr-input-otp-slot`. React reads slot state from
 *   `OTPInputContext`; the brain's `brn-input-otp-slot` already reads it from
 *   the parent `BrnInputOtp` by `index`, renders `{{char}}`, sets
 *   `data-active` on its host, and projects the fake caret only when
 *   `hasFakeCaret`. So we render `<brn-input-otp-slot [index]>` and forward the
 *   React slot class string (which keys off `data-[active=true]`) to it,
 *   projecting the blinking-caret element.
 * - React `InputOTPSeparator` = `gr-input-otp-separator` — a
 *   `role="separator"` carrying the lucide `minus` icon (hand-inlined SVG).
 *
 * Use for 2FA, email/SMS verification codes. Do not use for passwords or
 * persistent PINs — InputOTP is designed for ephemeral codes.
 *
 * @example
 * ```html
 * <brn-input-otp grInputOtp [maxLength]="6" [(value)]="code">
 *   <gr-input-otp-group>
 *     <gr-input-otp-slot [index]="0" />
 *     <gr-input-otp-slot [index]="1" />
 *     <gr-input-otp-slot [index]="2" />
 *   </gr-input-otp-group>
 *   <gr-input-otp-separator />
 *   <gr-input-otp-group>
 *     <gr-input-otp-slot [index]="3" />
 *     <gr-input-otp-slot [index]="4" />
 *     <gr-input-otp-slot [index]="5" />
 *   </gr-input-otp-group>
 * </brn-input-otp>
 * ```
 */
// InputOtp is a DIRECTIVE applied to the brain's `<brn-input-otp>` element, not
// a wrapper component. `BrnInputOtp` is a @Component whose OTP-context token is
// private (not exported by @spartan-ng/brain), so a wrapping `<gr-input-otp>`
// could not pass that context to `<ng-content>`-projected slots — Angular
// resolves a projected element's DI from its declaration site, so the slots
// raised NG0201. Mirrors the spartan reference `hlm-input-otp`
// (`selector: 'brn-input-otp[hlmInputOtp]'`): the consumer element is
// `<brn-input-otp grInputOtp …>`, the slots are its real descendants and resolve
// the OTP context correctly. The brain owns `maxLength` / `value` (`[(value)]`) /
// `disabled` / `inputId` inputs directly, at parity with React `InputOTP`'s
// props on the `OTPInput` element.
@Directive({
  selector: 'brn-input-otp[grInputOtp]',
  standalone: true,
  host: {
    'data-slot': 'input-otp',
    '[class]': 'containerClass()',
  },
})
export class InputOtp {
  /**
   * Extra classes for the container. Mirrors React `containerClassName`,
   * merged with the verbatim React container class string.
   */
  readonly containerClassName = input<string>('');

  protected readonly containerClass = computed(() =>
    cn(
      'flex items-center gap-2 has-[:disabled]:opacity-50',
      this.containerClassName(),
    ),
  );
}

/**
 * InputOTPGroup — a visual grouping of adjacent slots. Mirrors React
 * `InputOTPGroup` (a `flex items-center` div).
 */
@Component({
  selector: 'gr-input-otp-group',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'input-otp-group',
    '[class]': 'computedClass()',
  },
})
export class InputOtpGroup {
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('flex items-center', this.class()),
  );
}

/**
 * InputOTPSlot — a single character cell. Mirrors React `InputOTPSlot`.
 *
 * Wraps the brain `brn-input-otp-slot`, which renders `{{char}}`, sets
 * `data-active` on its host, and projects the fake caret only when the slot
 * has one. The React slot class string (which keys off `data-[active=true]`)
 * is forwarded verbatim to the brain slot host via `[class]`, and the blinking
 * caret element is projected.
 */
@Component({
  selector: 'gr-input-otp-slot',
  standalone: true,
  imports: [BrnInputOtpSlot],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <brn-input-otp-slot
      data-slot="input-otp-slot"
      [index]="index()"
      [class]="computedClass()"
    >
      <div
        class="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          class="h-4 w-px animate-caret-blink bg-foreground duration-1000"
        ></div>
      </div>
    </brn-input-otp-slot>
  `,
})
export class InputOtpSlot {
  /** The slot index this cell represents. Mirrors React `index` (required). */
  readonly index = input.required<number>();
  /** Switches to destructive error styling. Mirrors React `aria-invalid`. */
  readonly ariaInvalid = input<boolean>(false);
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-[3px] data-[active=true]:ring-ring/50 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:bg-input/30',
      this.class(),
    ),
  );
}

/**
 * InputOTPSeparator — a decorative divider between groups. Mirrors React
 * `InputOTPSeparator`, which renders a lucide `MinusIcon`. The icon is
 * hand-inlined as SVG (lucide is unavailable in Angular here).
 */
@Component({
  selector: 'gr-input-otp-separator',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
    </svg>
  `,
  host: {
    role: 'separator',
    'data-slot': 'input-otp-separator',
  },
})
export class InputOtpSeparator {}
