import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  inject,
  InjectionToken,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';
import { Label } from '../label/label';

/**
 * Form — field-aware form primitives. Angular parity port of React `Form` from
 * `@gremorie/rx-forms`.
 *
 * React's `Form` is a thin wrapper over `react-hook-form` (`FormProvider` +
 * `Controller`) whose subcomponents auto-wire the ARIA relationships
 * (`htmlFor`, `aria-describedby`, `aria-invalid`) and surface validation errors.
 * Angular already has first-class form state in `@angular/forms` (reactive +
 * template-driven), so there is no react-hook-form equivalent to wrap. The
 * Angular edition keeps the **structural + ARIA-wiring** contract — which is the
 * part that actually defines the component's anatomy — and lets consumers bind
 * their own `FormGroup` / `ngModel` to the controls inside `gn-form-control`.
 *
 * ## React → Angular mapping
 *
 * - React `FormItem` (a `grid gap-2` div that mints a `useId`) = `gn-form-item`,
 *   which generates a stable id and provides it down the tree via a DI token —
 *   the Angular stand-in for `FormItemContext`. From that id it derives the
 *   `…-form-item`, `…-form-item-description` and `…-form-item-message` ids,
 *   exactly like React's `useFormField`.
 * - React `FormLabel` = `gn-form-label` — wraps the `Label`, sets its `for` to
 *   the control id and toggles `data-[error=true]:text-destructive` from the
 *   item's `invalid` input.
 * - React `FormControl` (a Radix `Slot` that injects `id` /
 *   `aria-describedby` / `aria-invalid` onto its single child) = the
 *   `gnFormControl` attribute directive, applied directly to the inner control
 *   (`<gn-input gnFormControl>`), which binds those same attributes from the
 *   item context.
 * - React `FormDescription` / `FormMessage` = `gn-form-description` /
 *   `gn-form-message`. `gn-form-message` only renders when it has content
 *   (matching React's "returns null when empty").
 * - React `Form` (= `FormProvider`) has no markup; in Angular you use a native
 *   `<form [formGroup]>` directly, so no `gn-form` wrapper is needed.
 *
 * @example
 * ```html
 * <form [formGroup]="form">
 *   <gn-form-item [invalid]="form.controls.email.invalid && form.controls.email.touched">
 *     <gn-form-label>Email</gn-form-label>
 *     <gn-input gnFormControl formControlName="email" type="email" />
 *     <gn-form-description>We'll never share it.</gn-form-description>
 *     <gn-form-message>Enter a valid email.</gn-form-message>
 *   </gn-form-item>
 * </form>
 * ```
 */

/** Per-field context, the Angular stand-in for React's `FormItemContext`. */
export interface FormFieldContext {
  /** Stable base id minted by the `FormItem`. */
  readonly id: () => string;
  /** The control id: `${id}-form-item`. */
  readonly formItemId: () => string;
  /** The description id: `${id}-form-item-description`. */
  readonly formDescriptionId: () => string;
  /** The message id: `${id}-form-item-message`. */
  readonly formMessageId: () => string;
  /** Whether the field is currently in an error state. */
  readonly invalid: () => boolean;
}

/** DI token carrying the per-field context to descendant form parts. */
export const FORM_FIELD_CONTEXT = new InjectionToken<FormFieldContext>(
  'FORM_FIELD_CONTEXT',
);

let formItemId = 0;

/**
 * FormItem — a single field row. Mirrors React `FormItem`: a `grid gap-2`
 * container that mints a stable id and provides the field context downward.
 */
@Component({
  selector: 'gn-form-item',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'form-item',
    '[class]': 'computedClass()',
  },
  providers: [
    {
      provide: FORM_FIELD_CONTEXT,
      useExisting: FormItem,
    },
  ],
})
export class FormItem implements FormFieldContext {
  private readonly _id = `gn-form-${++formItemId}`;

  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');
  /**
   * Whether this field is in an error state. The Angular stand-in for the
   * `error` derived by React's `useFormField` from react-hook-form state —
   * bind it from your control's `invalid`/`touched`.
   */
  readonly invalid = input<boolean>(false);

  readonly id = () => this._id;
  readonly formItemId = () => `${this._id}-form-item`;
  readonly formDescriptionId = () => `${this._id}-form-item-description`;
  readonly formMessageId = () => `${this._id}-form-item-message`;

  protected readonly computedClass = computed(() =>
    cn('grid gap-2', this.class()),
  );
}

/**
 * FormLabel — the field label. Mirrors React `FormLabel`: wraps `Label`, points
 * `for` at the control id, and turns destructive when the field is invalid.
 */
@Component({
  selector: 'gn-form-label',
  standalone: true,
  imports: [Label],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gn-label
      data-slot="form-label"
      [for]="field.formItemId()"
      [attr.data-error]="field.invalid() ? 'true' : null"
      [class]="computedClass()"
    >
      <ng-content />
    </gn-label>
  `,
})
export class FormLabel {
  protected readonly field = inject(FORM_FIELD_CONTEXT);

  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('data-[error=true]:text-destructive', this.class()),
  );
}

/**
 * FormControl — wires the control's `id`, `aria-describedby` and `aria-invalid`
 * from the field context onto the host element. Mirrors React `FormControl`
 * (the Radix `Slot`). Apply directly to the inner control.
 */
@Directive({
  selector: '[gnFormControl]',
  standalone: true,
  host: {
    'data-slot': 'form-control',
    '[attr.id]': 'field.formItemId()',
    '[attr.aria-describedby]': 'describedBy()',
    '[attr.aria-invalid]': "field.invalid() ? 'true' : null",
  },
})
export class FormControl {
  protected readonly field = inject(FORM_FIELD_CONTEXT);

  protected readonly describedBy = computed(() =>
    this.field.invalid()
      ? `${this.field.formDescriptionId()} ${this.field.formMessageId()}`
      : this.field.formDescriptionId(),
  );
}

/**
 * FormDescription — helper text below the control. Mirrors React
 * `FormDescription` (a muted `<p>` carrying the description id).
 */
@Component({
  selector: 'gn-form-description',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'form-description',
    '[attr.id]': 'field.formDescriptionId()',
    '[class]': 'computedClass()',
  },
})
export class FormDescription {
  protected readonly field = inject(FORM_FIELD_CONTEXT);

  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('text-sm text-muted-foreground', this.class()),
  );
}

/**
 * FormMessage — validation message row. Mirrors React `FormMessage`: a
 * destructive `<p>` carrying the message id. Renders nothing when it has no
 * projected content, matching React's "returns null when empty".
 */
@Component({
  selector: 'gn-form-message',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'form-message',
    '[attr.id]': 'field.formMessageId()',
    '[class]': 'computedClass()',
  },
})
export class FormMessage {
  protected readonly field = inject(FORM_FIELD_CONTEXT);

  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('text-sm text-destructive empty:hidden', this.class()),
  );
}
