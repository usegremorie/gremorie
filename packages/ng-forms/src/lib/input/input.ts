import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '@gremorie/ng-core';

/**
 * Input — single-line text field. Mirrors React `Input` from
 * `@gremorie/rx-forms`.
 *
 * Renders a styled native `<input>` that adopts every native HTML `type`
 * (text, email, password, number, search, tel, url, file…). Visual states are
 * token-driven: `border-input` for default, `focus-visible:ring-ring/50` for
 * focus, `aria-invalid:border-destructive` for error. The exact Tailwind class
 * string is copied verbatim from the React `Input`.
 *
 * ## React → Angular mapping
 *
 * React's `Input` IS the `<input>` (it spreads `React.ComponentProps<'input'>`
 * directly onto the element). Angular cannot spread an arbitrary prop bag onto
 * a host, so:
 *
 * - The component selector is `gr-input` and it renders the styled `<input>`
 *   *inside* its template. The `data-slot="input"` and the full class string
 *   live on that inner `<input>`, not on the host — so the host is an invisible
 *   wrapper and the visible control is the native input, matching React 1:1.
 * - React's spread native props become discrete signal `input()`s
 *   (`type`, `placeholder`, `disabled`, `value`, `ariaInvalid`, `id`, `name`).
 * - React's `className` merge maps to a `class` input merged via `cn`.
 * - Two-way value flow is provided through `ControlValueAccessor` (so the
 *   component works with `[(ngModel)]`/reactive forms) plus a `valueChange`
 *   output for template-driven `[(value)]`-style binding.
 *
 * @example
 * ```html
 * <gr-input type="email" placeholder="ada@example.com" [(ngModel)]="email" />
 * ```
 */
@Component({
  selector: 'gr-input',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true,
    },
  ],
  template: `
    <input
      data-slot="input"
      [class]="inputClass()"
      [type]="type()"
      [attr.id]="id() || null"
      [attr.name]="name() || null"
      [attr.placeholder]="placeholder() || null"
      [attr.aria-invalid]="ariaInvalid() ? 'true' : null"
      [disabled]="isDisabled()"
      [value]="model()"
      (input)="handleInput($event)"
      (blur)="handleBlur()"
    />
  `,
})
export class Input implements ControlValueAccessor {
  /** Native input type. Mirrors React `type` (default `'text'`). */
  readonly type = input<string>('text');
  /** Placeholder text. Mirrors React `placeholder`. */
  readonly placeholder = input<string>('');
  /** Disable interaction. Mirrors React `disabled`. */
  readonly disabled = input<boolean>(false);
  /** Initial/controlled value. Mirrors React `value`/`defaultValue`. */
  readonly value = input<string>('');
  /** Switches to destructive error styling. Mirrors React `aria-invalid`. */
  readonly ariaInvalid = input<boolean>(false);
  /** Element id (for label association). Mirrors React `id`. */
  readonly id = input<string>('');
  /** Form control name. Mirrors React `name`. */
  readonly name = input<string>('');
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  /** Emits the current string value on every keystroke. */
  readonly valueChange = output<string>();

  /** Internal model: seeded from `value`, then driven by CVA/`(input)`. */
  protected readonly model = signal('');
  /** Internal disabled state: `disabled` input OR `setDisabledState`. */
  protected readonly disabledState = signal(false);

  protected readonly isDisabled = computed(
    () => this.disabled() || this.disabledState(),
  );

  protected readonly inputClass = computed(() =>
    cn(
      'h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
      'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
      'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
      this.class(),
    ),
  );

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    // Seed the internal model from the `value` input when used statically
    // (e.g. in templates / stories without ngModel). CVA `writeValue` and
    // user keystrokes drive it afterwards. Tracks only `value`.
    effect(() => {
      const seed = this.value();
      if (seed) {
        this.model.set(seed);
      }
    });
  }

  protected handleInput(event: Event): void {
    const next = (event.target as HTMLInputElement).value;
    this.model.set(next);
    this.onChange(next);
    this.valueChange.emit(next);
  }

  protected handleBlur(): void {
    this.onTouched();
  }

  // --- ControlValueAccessor ---

  writeValue(value: string | null): void {
    this.model.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }
}
