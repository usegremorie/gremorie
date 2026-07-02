import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import {
  BrnSelect,
  BrnSelectContent,
  BrnSelectGroup,
  BrnSelectItem,
  BrnSelectLabel,
  BrnSelectScrollDown,
  BrnSelectScrollUp,
  BrnSelectSeparator,
  BrnSelectTrigger,
  BrnSelectValue,
} from '@spartan-ng/brain/select';
import {
  BrnPopover,
  BrnPopoverContent,
  BrnPopoverTrigger,
} from '@spartan-ng/brain/popover';
import { cn } from '@gremorie/ng-core';

/** Trigger height. Mirrors React `SelectTrigger` `size`. */
export type SelectSize = 'sm' | 'default';

/**
 * Select — dropdown chooser for short, fixed lists. Mirrors React `Select`
 * from `@gremorie/rx-forms`, which wraps `@radix-ui/react-select`.
 *
 * The Angular edition composes the spartan brain `BrnSelect` + `BrnPopover` —
 * the Angular equivalent of Radix `Select.Root` + its portalled popper. We use
 * the brain (not a hand-rolled listbox) because together they own the full a11y
 * + state contract for free: the value model, `role="listbox"` /
 * `role="option"` semantics, `aria-expanded`, `data-state`, type-ahead and
 * arrow-key navigation (via the brain's `ActiveDescendantKeyManager`), the
 * portalled + positioned overlay, and `ControlValueAccessor`. That is exactly
 * the surface Radix gives the React version, keeping the editions at parity.
 *
 * ## React → Angular mapping (compound 1:1)
 *
 * - React `Select` (`Root`) = `gn-select`, which hosts the `BrnPopover` element
 *   and applies `brnSelect` to it via host directives so the value lives on the
 *   root and the popover owns open/close. `data-slot="select"` on the host.
 * - React `SelectTrigger` = `gn-select-trigger` — a `<button>` carrying both
 *   `brnSelectTrigger` and `brnPopoverTrigger`, with the verbatim React trigger
 *   class string and `data-size`. The trailing chevron (lucide `chevron-down`,
 *   hand-inlined) is rendered after the projected value.
 * - React `SelectValue` = `gn-select-value` — `brnSelectValue` renders the
 *   selected label or the `placeholder`.
 * - React `SelectContent` = `gn-select-content` — a `brnPopoverContent`
 *   template wrapping a `brnSelectContent` div with the verbatim popover class
 *   string and the scroll-up/down affordances.
 * - React `SelectItem` / `SelectGroup` / `SelectLabel` / `SelectSeparator` =
 *   the matching `gn-select-*` wrappers over the brain item/group/label/
 *   separator directives, each forwarding the verbatim React class string.
 *
 * @example
 * ```html
 * <gn-select [(value)]="fruit">
 *   <gn-select-trigger class="w-48">
 *     <gn-select-value placeholder="Pick a fruit" />
 *   </gn-select-trigger>
 *   <gn-select-content>
 *     <gn-select-item value="apple">Apple</gn-select-item>
 *     <gn-select-item value="banana">Banana</gn-select-item>
 *   </gn-select-content>
 * </gn-select>
 * ```
 */
@Component({
  selector: 'gn-select',
  standalone: true,
  hostDirectives: [
    BrnPopover,
    {
      directive: BrnSelect,
      inputs: ['value', 'disabled'],
      outputs: ['valueChange'],
    },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'select',
  },
})
export class Select {
  // `value` and `disabled` are exposed on this selector by the `BrnSelect` host
  // directive (`inputs: [...]`) and owned by the brain — so a two-way
  // `[(value)]` and a `valueChange` output work transparently. The placeholder
  // lives on `gn-select-value` (the brain `BrnSelectValue` `placeholder`
  // input), matching React's `SelectValue placeholder`. The `BrnPopover` host
  // directive supplies the ancestor popover that `BrnSelect`, the trigger
  // (`brnPopoverTrigger`) and the content (`brnPopoverContent`) resolve — it
  // owns the portalled, positioned overlay. `Select` adds no extra inputs; the
  // wrapper exists to apply both brain directives + the slot.
}

/**
 * SelectTrigger — the clickable button that opens the listbox. Mirrors React
 * `SelectTrigger`.
 */
@Component({
  selector: 'gn-select-trigger',
  standalone: true,
  imports: [BrnSelectTrigger, BrnPopoverTrigger],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      brnSelectTrigger
      brnPopoverTrigger
      type="button"
      data-slot="select-trigger"
      [attr.data-size]="size()"
      [class]="computedClass()"
    >
      <ng-content />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="size-4 opacity-50"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  `,
})
export class SelectTrigger {
  /** Trigger height. Mirrors React `SelectTrigger` `size` (default 'default'). */
  readonly size = input<SelectSize>('default');
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      "flex w-fit items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[placeholder]:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
      this.class(),
    ),
  );
}

/**
 * SelectValue — renders the selected label or the placeholder. Mirrors React
 * `SelectValue`.
 */
@Component({
  selector: 'gn-select-value',
  standalone: true,
  imports: [BrnSelectValue],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span
    brnSelectValue
    data-slot="select-value"
    [placeholder]="placeholder()"
  ></span>`,
})
export class SelectValue {
  /** Placeholder shown when nothing is selected. Mirrors React `placeholder`. */
  readonly placeholder = input<string>('');
}

/**
 * SelectContent — the portalled, scrollable listbox. Mirrors React
 * `SelectContent`.
 */
@Component({
  selector: 'gn-select-content',
  standalone: true,
  imports: [
    BrnPopoverContent,
    BrnSelectContent,
    BrnSelectScrollUp,
    BrnSelectScrollDown,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template brnPopoverContent>
      <div
        brnSelectContent
        data-slot="select-content"
        [class]="computedClass()"
      >
        <button
          brnSelectScrollUp
          class="flex cursor-default items-center justify-center py-1"
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </button>
        <div class="p-1">
          <ng-content />
        </div>
        <button
          brnSelectScrollDown
          class="flex cursor-default items-center justify-center py-1"
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>
    </ng-template>
  `,
})
export class SelectContent {
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
      this.class(),
    ),
  );
}

/**
 * SelectItem — one selectable option. Mirrors React `SelectItem`. The check
 * indicator (lucide `check`, hand-inlined) sits in an absolute right slot.
 *
 * React's Radix `ItemIndicator` only mounts when the item is selected. The
 * brain `brnSelectItem` sets `[attr.aria-selected]="active()"` on its host
 * button, so to stay faithful the indicator is gated purely off that attribute
 * via the `group-aria-selected:flex hidden` arbitrary variant — visible only
 * when the brain reports the item selected. No manual `selected` input is
 * needed; selection stays the single source of truth in the brain.
 */
@Component({
  selector: 'gn-select-item',
  standalone: true,
  imports: [BrnSelectItem],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      brnSelectItem
      type="button"
      data-slot="select-item"
      [value]="value()"
      [disabled]="disabled()"
      [class]="computedClass()"
    >
      <span
        data-slot="select-item-indicator"
        class="absolute right-2 hidden size-3.5 items-center justify-center group-aria-selected:flex"
      >
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
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <ng-content />
    </button>
  `,
})
export class SelectItem {
  /** The value this option represents. Mirrors React `value`. */
  readonly value = input.required<string>();
  /** Disable just this option. Mirrors React `disabled`. */
  readonly disabled = input<boolean>(false);
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      "group relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
      this.class(),
    ),
  );
}

/**
 * SelectGroup — a labelled section of options. Mirrors React `SelectGroup`.
 */
@Component({
  selector: 'gn-select-group',
  standalone: true,
  imports: [BrnSelectGroup],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div brnSelectGroup data-slot="select-group"><ng-content /></div>`,
})
export class SelectGroup {}

/**
 * SelectLabel — the heading for a SelectGroup. Mirrors React `SelectLabel`.
 */
@Component({
  selector: 'gn-select-label',
  standalone: true,
  imports: [BrnSelectLabel],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div
    brnSelectLabel
    data-slot="select-label"
    [class]="computedClass()"
  >
    <ng-content />
  </div>`,
})
export class SelectLabel {
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('px-2 py-1.5 text-xs text-muted-foreground', this.class()),
  );
}

/**
 * SelectSeparator — a divider between groups. Mirrors React `SelectSeparator`.
 */
@Component({
  selector: 'gn-select-separator',
  standalone: true,
  imports: [BrnSelectSeparator],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div
    brnSelectSeparator
    data-slot="select-separator"
    [class]="computedClass()"
  ></div>`,
})
export class SelectSeparator {
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('pointer-events-none -mx-1 my-1 h-px bg-border', this.class()),
  );
}
