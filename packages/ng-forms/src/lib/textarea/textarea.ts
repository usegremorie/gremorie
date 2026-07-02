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
 * Textarea — multi-line text field. Mirrors React `Textarea` from
 * `@gremorie/rx-forms`.
 *
 * Renders a styled native `<textarea>` that uses CSS `field-sizing: content`
 * so the field grows automatically as the user types — no manual `rows` or JS
 * measurement needed in modern browsers. The exact Tailwind class string is
 * copied verbatim from the React `Textarea`.
 *
 * ## React → Angular mapping
 *
 * React's `Textarea` IS the `<textarea>` (it spreads
 * `React.ComponentProps<'textarea'>` directly). Angular cannot spread a prop
 * bag onto a host, so the `gn-textarea` selector renders the styled
 * `<textarea>` *inside* its template, carrying `data-slot="textarea"` and the
 * full class string — the host is an invisible wrapper, the visible control is
 * the native textarea, matching React 1:1.
 *
 * - React's spread native props become discrete signal `input()`s
 *   (`value`, `placeholder`, `disabled`, `ariaInvalid`, `id`, `name`, `rows`).
 * - React's `className` merge → `class` input merged via `cn`.
 * - Two-way value flow via `ControlValueAccessor` (works with `[(ngModel)]`/
 *   reactive forms) plus a `valueChange` output. `rows` is provided as a
 *   discrete escape hatch even though `field-sizing-content` handles growth.
 *
 * @example
 * ```html
 * <gn-textarea placeholder="Tell us about yourself…" [(ngModel)]="bio" />
 * ```
 */
@Component({
  selector: 'gn-textarea',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Textarea),
      multi: true,
    },
  ],
  template: `
    <textarea
      data-slot="textarea"
      [class]="textareaClass()"
      [attr.id]="id() || null"
      [attr.name]="name() || null"
      [attr.placeholder]="placeholder() || null"
      [attr.rows]="rows() ?? null"
      [attr.aria-invalid]="ariaInvalid() ? 'true' : null"
      [disabled]="isDisabled()"
      [value]="model()"
      (input)="handleInput($event)"
      (blur)="handleBlur()"
    ></textarea>
  `,
})
export class Textarea implements ControlValueAccessor {
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
  /** Visible row count. Mirrors React `rows` (optional; defaults to none). */
  readonly rows = input<number | null>(null);
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

  protected readonly textareaClass = computed(() =>
    cn(
      'flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40',
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
    const next = (event.target as HTMLTextAreaElement).value;
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
