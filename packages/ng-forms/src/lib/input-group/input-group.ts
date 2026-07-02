import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
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
 * - React `InputGroup` (a `role="group"` div) = our `gn-input-group` host.
 * - React `InputGroupAddon` = `gn-input-group-addon`, with the `align` cva and
 *   the click-to-focus behaviour (clicking the addon focuses the inner input,
 *   unless a button was clicked) preserved.
 * - React `InputGroupButton` = `gn-input-group-button`, wrapping the ng-core
 *   `Button` with the size cva.
 * - React `InputGroupText` = `gn-input-group-text`.
 * - React `InputGroupInput` / `InputGroupTextarea` = `gn-input-group-input` /
 *   `gn-input-group-textarea`, wrapping the ng-forms `Input` / `Textarea` with
 *   `data-slot="input-group-control"` and the borderless override classes.
 *
 * @example
 * ```html
 * <gn-input-group>
 *   <gn-input-group-input placeholder="Search…" />
 *   <gn-input-group-addon align="inline-end">
 *     <gn-input-group-button>Go</gn-input-group-button>
 *   </gn-input-group-addon>
 * </gn-input-group>
 * ```
 */
@Component({
  selector: 'gn-input-group',
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
      'h-9 has-[>textarea]:h-auto',
      'has-[>[data-align=inline-start]]:[&>input]:pl-2',
      'has-[>[data-align=inline-end]]:[&>input]:pr-2',
      'has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3',
      'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3',
      'has-[[data-slot=input-group-control]:focus-visible]:ring-ring has-[[data-slot=input-group-control]:focus-visible]:ring-1',
      'has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40',
      this.class(),
    ),
  );
}

export type InputGroupAddonAlign =
  | 'inline-start'
  | 'inline-end'
  | 'block-start'
  | 'block-end';

const inputGroupAddonVariants = cva(
  "text-muted-foreground flex h-auto cursor-text select-none items-center justify-center gap-2 py-1.5 text-sm font-medium group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        'inline-start':
          'order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]',
        'inline-end':
          'order-last pr-3 has-[>button]:mr-[-0.4rem] has-[>kbd]:mr-[-0.35rem]',
        'block-start':
          '[.border-b]:pb-3 order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5',
        'block-end':
          '[.border-t]:pt-3 order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5',
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
  selector: 'gn-input-group-addon',
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
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-2 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5",
        sm: 'h-8 gap-1.5 rounded-md px-2.5 has-[>svg]:px-2.5',
        'icon-xs':
          'size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0',
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
  selector: 'gn-input-group-button',
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
  selector: 'gn-input-group-text',
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
 * component, which in React *is* the native `<input>`. The Angular `gn-input`
 * wraps the native input inside a host element, which would break the parent
 * group's `> input` child selectors and the
 * `has-[[data-slot=input-group-control]:focus-visible]` focus ring. So this
 * control renders the native `<input>` directly — carrying
 * `data-slot="input-group-control"` and the same base + override classes as
 * `gn-input` — keeping it a direct `<input>` child of the group, exactly as
 * React produces.
 */
@Component({
  selector: 'gn-input-group-input',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      data-slot="input-group-control"
      [type]="type()"
      [class]="computedClass()"
      [attr.id]="id() || null"
      [attr.name]="name() || null"
      [attr.placeholder]="placeholder() || null"
      [attr.aria-invalid]="ariaInvalid() ? 'true' : null"
      [disabled]="disabled()"
      [value]="value()"
    />
  `,
})
export class InputGroupInput {
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
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'h-9 w-full min-w-0 bg-transparent px-3 py-1 text-base outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      'flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent',
      this.class(),
    ),
  );
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
  selector: 'gn-input-group-textarea',
  standalone: true,
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
