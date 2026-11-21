import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cva, type VariantProps } from 'class-variance-authority';
import { buttonVariants, cn, type ButtonVariant } from '@gremorie/ng-core';

/**
 * InputGroup — layout primitive that composes an Input or Textarea with inline
 * addons (icons, buttons, kbd hints). Angular parity port of React `InputGroup`
 * from `@gremorie/rx-forms`.
 *
 * Pure layout, no brain. The container drives focus / invalid / disabled
 * styling from the inner control via Tailwind `has-[…]` selectors exactly like
 * React, so addons style themselves automatically. The full React class string
 * (including every `has-[>[data-align=…]]` and `has-[[data-slot]…]` variant) is
 * copied verbatim.
 *
 * ## React → Angular mapping
 *
 * - React `InputGroup` (a `role="group"` div) = our `gr-input-group` host.
 * - React `InputGroupAddon` = `gr-input-group-addon`, with the `align` cva and
 *   the click-to-focus behaviour (clicking the addon focuses the inner input,
 *   unless a button was clicked) preserved.
 * - React `InputGroupButton` = `gr-input-group-button`, wrapping the ng-core
 *   `Button` with the size cva.
 * - React `InputGroupText` = `gr-input-group-text`.
 * - React `InputGroupInput` / `InputGroupTextarea` = `gr-input-group-input` /
 *   `gr-input-group-textarea`, wrapping the ng-forms `Input` / `Textarea` with
 *   `data-slot="input-group-control"` and the borderless override classes.
 *
 * @example
 * ```html
 * <gr-input-group>
 *   <gr-input-group-input placeholder="Search…" />
 *   <gr-input-group-addon align="inline-end">
 *     <gr-input-group-button>Go</gr-input-group-button>
 *   </gr-input-group-addon>
 * </gr-input-group>
 * ```
 */
@Component({
  selector: 'gr-input-group',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    role: 'group',
    'data-slot': 'input-group',
    '[class]': 'computedClass()',
  },
})
export class InputGroup {
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'group/input-group border-input dark:bg-input/30 shadow-xs relative flex w-full items-center rounded-md border outline-none transition-[color,box-shadow]',
      'h-9 has-[>textarea]:h-auto has-[>gr-input-group-textarea]:h-auto',
      'has-[>[data-align=inline-start]]:[&>input]:pl-2',
      'has-[>[data-align=inline-end]]:[&>input]:pr-2',
      'has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3',
      'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3',
      // The same rules reaching the native input through the
      // `gr-input-group-input` host (display: contents, so a child selector
      // from the group would otherwise miss it).
      'has-[>[data-align=inline-start]]:[&>gr-input-group-input>input]:pl-2',
      'has-[>[data-align=inline-end]]:[&>gr-input-group-input>input]:pr-2',
      'has-[>[data-align=block-start]]:[&>gr-input-group-input>input]:pb-3',
      'has-[>[data-align=block-end]]:[&>gr-input-group-input>input]:pt-3',
      'has-[[data-slot=input-group-control]:focus-visible]:ring-ring has-[[data-slot=input-group-control]:focus-visible]:ring-1',
      'has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40',
      this.class(),
    ),
  );
}

export type InputGroupAddonAlign =
  'inline-start' | 'inline-end' | 'block-start' | 'block-end';

// `has-[>button]` cannot see through the `gr-input-group-button` host, so each
// button rule has a twin keyed on that host.
const inputGroupAddonVariants = cva(
  "text-muted-foreground flex h-auto cursor-text select-none items-center justify-center gap-2 py-1.5 text-sm font-medium group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-sm [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        'inline-start':
          'order-first pl-3 has-[>button]:-ml-2 has-[>gr-input-group-button]:-ml-2 has-[>kbd]:-ml-1.5',
        'inline-end':
          'order-last pr-3 has-[>button]:-mr-1.5 has-[>gr-input-group-button]:-mr-1.5 has-[>kbd]:-mr-1.5',
        'block-start':
          '[.border-b]:pb-3 order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5 group-has-[>gr-input-group-input]/input-group:pt-2.5',
        'block-end':
          '[.border-t]:pt-3 order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5 group-has-[>gr-input-group-input]/input-group:pb-2.5',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  },
);

/**
 * InputGroupAddon — a slot for icons, buttons or kbd hints alongside the
 * control. Mirrors React `InputGroupAddon`. Clicking the addon focuses the
 * inner input (unless a button was the target), matching React's `onClick`.
 */
@Component({
  selector: 'gr-input-group-addon',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    role: 'group',
    'data-slot': 'input-group-addon',
    '[attr.data-align]': 'align()',
    '[class]': 'computedClass()',
    '(click)': 'handleClick($event)',
  },
})
export class InputGroupAddon {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Placement of the addon. Mirrors React `align` (default 'inline-start'). */
  readonly align = input<InputGroupAddonAlign>('inline-start');
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(inputGroupAddonVariants({ align: this.align() }), this.class()),
  );

  protected handleClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).closest('button')) {
      return;
    }
    this.host.nativeElement.parentElement?.querySelector('input')?.focus();
  }
}

export type InputGroupButtonSize = 'xs' | 'sm' | 'icon-xs' | 'icon-sm';

const inputGroupButtonVariants = cva(
  'flex items-center gap-2 text-sm shadow-none',
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-sm px-2 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5",
        sm: 'h-8 gap-1.5 rounded-sm px-2.5 has-[>svg]:px-2.5',
        'icon-xs': 'size-6 rounded-sm p-0 has-[>svg]:p-0',
        'icon-sm': 'size-8 p-0 has-[>svg]:p-0',
      },
    },
    defaultVariants: {
      size: 'xs',
    },
  },
);

/**
 * InputGroupButton — a compact button sized for an addon. Mirrors React
 * `InputGroupButton`, which wraps the shared `Button`. Reuses the ng-core
 * `buttonVariants` cva (the same source the `Button` component uses) on a
 * native `<button>` so the group-button size cva can layer on top — the
 * ng-core `Button` component renders its own inner button without a
 * `className` merge hook. Defaults to the `ghost` variant and `xs` size.
 */
@Component({
  selector: 'gr-input-group-button',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [attr.type]="type()"
      data-slot="input-group-button"
      [attr.data-size]="size()"
      [disabled]="disabled()"
      [class]="computedClass()"
    >
      <ng-content />
    </button>
  `,
})
export class InputGroupButton {
  /** Native button type. Mirrors React `type` (default 'button'). */
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  /** Button variant. Mirrors React `variant` (default 'ghost'). */
  readonly variant = input<ButtonVariant>('ghost');
  /** Group-button size preset. Mirrors React `size` (default 'xs'). */
  readonly size = input<InputGroupButtonSize>('xs');
  /** Disable interaction. Mirrors React `disabled`. */
  readonly disabled = input<boolean>(false);
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      buttonVariants({ variant: this.variant() }),
      inputGroupButtonVariants({ size: this.size() }),
      this.class(),
    ),
  );
}

/**
 * InputGroupText — inline muted text/icon next to the control. Mirrors React
 * `InputGroupText` (a styled `<span>`).
 */
@Component({
  selector: 'gr-input-group-text',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
  },
})
export class InputGroupText {
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      "text-muted-foreground flex items-center gap-2 text-sm [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
      this.class(),
    ),
  );
}

/**
 * InputGroupInput — the inner input, stripped of its own border/ring so the
 * group container owns the chrome. Mirrors React `InputGroupInput`.
 *
 * **Faithful divergence:** React's `InputGroupInput` renders the `Input`
 * component, which in React *is* the native `<input>`. The Angular `gr-input`
 * wraps the native input inside a host element, which would break the parent
 * group's `> input` child selectors and the
 * `has-[[data-slot=input-group-control]:focus-visible]` focus ring. So this
 * control renders the native `<input>` itself, carrying
 * `data-slot="input-group-control"` and the React `Input` base classes plus the
 * group overrides. Its host is `display: contents`, so the input is the flex
 * item (`flex-1`, like React); the group's `> input` rules have a twin that
 * reaches through the host.
 *
 * Value: same surface as `gr-input` (`value` seed, `valueChange` output and
 * ControlValueAccessor for `ngModel` / reactive forms).
 */
@Component({
  selector: 'gr-input-group-input',
  standalone: true,
  // The control keeps the `id` (see Input: a host copy would shadow it for
  // labels). `contents`: the native input is the flex item, as in React.
  host: { '[attr.id]': 'null', class: 'contents' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputGroupInput),
      multi: true,
    },
  ],
  template: `
    <input
      data-slot="input-group-control"
      [type]="type()"
      [class]="computedClass()"
      [attr.id]="id() || null"
      [attr.name]="name() || null"
      [attr.placeholder]="placeholder() || null"
      [attr.inputmode]="inputmode() || null"
      [attr.aria-invalid]="ariaInvalid() ? 'true' : null"
      [disabled]="isDisabled()"
      [value]="model()"
      (input)="handleInput($event)"
      (blur)="handleBlur()"
    />
  `,
})
export class InputGroupInput implements ControlValueAccessor {
  /** Native input type. Mirrors React `type` (default 'text'). */
  readonly type = input<string>('text');
  /** Placeholder text. Mirrors React `placeholder`. */
  readonly placeholder = input<string>('');
  /** Disable interaction. Mirrors React `disabled`. */
  readonly disabled = input<boolean>(false);
  /** Controlled value. Mirrors React `value`. */
  readonly value = input<string>('');
  /** Error styling. Mirrors React `aria-invalid`. */
  readonly ariaInvalid = input<boolean>(false);
  /** Element id. Mirrors React `id`. */
  readonly id = input<string>('');
  /** Form control name. Mirrors React `name`. */
  readonly name = input<string>('');
  /** Virtual keyboard hint. Mirrors the native React `inputMode` prop. */
  readonly inputmode = input<string>('');
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  /** Emits the current string value on every keystroke. Mirrors `gr-input`. */
  readonly valueChange = output<string>();

  /** Internal model: seeded from `value`, then driven by CVA/`(input)`. */
  protected readonly model = signal('');
  /** Internal disabled state: `disabled` input OR `setDisabledState`. */
  protected readonly disabledState = signal(false);

  protected readonly isDisabled = computed(
    () => this.disabled() || this.disabledState(),
  );

  // React renders `Input` with these overrides, so the base is the `Input`
  // class string (see `gr-input`) followed by the group overrides.
  protected readonly computedClass = computed(() =>
    cn(
      'h-8 w-full min-w-0 rounded-sm border border-transparent bg-input/50 px-3 py-1 text-base transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
      'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
      'flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent',
      this.class(),
    ),
  );

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    // Seed from `value` (static use without forms); CVA and keystrokes drive
    // the model afterwards. Same contract as `gr-input`.
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

/**
 * InputGroupTextarea — the inner textarea, stripped of its own border/ring so
 * the group container owns the chrome. Mirrors React `InputGroupTextarea`.
 *
 * Renders a native `<textarea>` directly (same faithful divergence as
 * `InputGroupInput` above) so it stays a direct child the parent group can
 * target.
 */
@Component({
  selector: 'gr-input-group-textarea',
  standalone: true,
  // The control keeps the `id` (see Input: a host copy would shadow it for
  // labels). `contents`: the native textarea is the flex item, as in React.
  host: { '[attr.id]': 'null', class: 'contents' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <textarea
      data-slot="input-group-control"
      [class]="computedClass()"
      [attr.id]="id() || null"
      [attr.name]="name() || null"
      [attr.placeholder]="placeholder() || null"
      [attr.aria-invalid]="ariaInvalid() ? 'true' : null"
      [disabled]="disabled()"
      [value]="value()"
    ></textarea>
  `,
})
export class InputGroupTextarea {
  /** Placeholder text. Mirrors React `placeholder`. */
  readonly placeholder = input<string>('');
  /** Disable interaction. Mirrors React `disabled`. */
  readonly disabled = input<boolean>(false);
  /** Controlled value. Mirrors React `value`. */
  readonly value = input<string>('');
  /** Error styling. Mirrors React `aria-invalid`. */
  readonly ariaInvalid = input<boolean>(false);
  /** Element id. Mirrors React `id`. */
  readonly id = input<string>('');
  /** Form control name. Mirrors React `name`. */
  readonly name = input<string>('');
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'field-sizing-content min-h-16 w-full bg-transparent px-3 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      'flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent',
      this.class(),
    ),
  );
}

export { inputGroupAddonVariants, inputGroupButtonVariants };
export type { VariantProps };
