import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  ElementRef,
  inject,
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
import { BrnPopover, BrnPopoverContent } from '@spartan-ng/brain/popover';
import { cn } from '@gremorie/ng-core';

/** Trigger height. Mirrors React `SelectTrigger` `size`. */
export type SelectSize = 'sm' | 'default';

const SELECT_TRIGGER_VARIANTS = {
  default: '',
  outline:
    'border-foreground/10 bg-transparent hover:bg-muted dark:hover:bg-input/30',
  secondary:
    'bg-foreground/5 text-secondary-foreground hover:bg-foreground/10 aria-expanded:bg-foreground/10 dark:bg-foreground/8 dark:hover:bg-foreground/15 dark:aria-expanded:bg-foreground/15',
} as const;

/**
 * Trigger surface. `default` is the filled field; `outline` and `secondary`
 * are for a trigger that sits on a filled surface (e.g. inside a prompt
 * input), where a second fill would vanish.
 */
export type SelectTriggerVariant = keyof typeof SELECT_TRIGGER_VARIANTS;

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
 * - React `Select` (`Root`) = `gr-select`, which hosts the `BrnPopover` element
 *   and applies `brnSelect` to it via host directives so the value lives on the
 *   root and the popover owns open/close. `data-slot="select"` on the host.
 * - React `SelectTrigger` = `gr-select-trigger` — a `<button>` carrying
 *   `brnSelectTrigger` only (it toggles the select AND sets the overlay origin;
 *   adding `brnPopoverTrigger` too toggles twice per click and the select never
 *   opens), with the verbatim React trigger
 *   class string and `data-size`. The trailing chevron (lucide `chevron-down`,
 *   hand-inlined) is rendered after the projected value.
 * - React `SelectValue` = `gr-select-value` — `brnSelectValue` renders the
 *   selected label or the `placeholder`.
 * - React `SelectContent` = `gr-select-content` — a `brnPopoverContent`
 *   template wrapping a `brnSelectContent` div with the verbatim popover class
 *   string and the scroll-up/down affordances.
 * - React `SelectItem` / `SelectGroup` / `SelectLabel` / `SelectSeparator` =
 *   the matching `gr-select-*` wrappers over the brain item/group/label/
 *   separator directives, each forwarding the verbatim React class string.
 *
 * @example
 * ```html
 * <gr-select [(value)]="fruit">
 *   <gr-select-trigger class="w-48">
 *     <gr-select-value placeholder="Pick a fruit" />
 *   </gr-select-trigger>
 *   <gr-select-content>
 *     <gr-select-item value="apple">Apple</gr-select-item>
 *     <gr-select-item value="banana">Banana</gr-select-item>
 *   </gr-select-content>
 * </gr-select>
 * ```
 */
@Component({
  selector: 'gr-select',
  standalone: true,
  hostDirectives: [
    BrnPopover,
    {
      directive: BrnSelect,
      // itemToString: the content is lazy (rendered on open), so a closed
      // select only knows its value. React's SelectValue shows the item's
      // text; pass itemToString to show the same label before first open.
      inputs: ['value', 'disabled', 'itemToString'],
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
  // lives on `gr-select-value` (the brain `BrnSelectValue` `placeholder`
  // input), matching React's `SelectValue placeholder`. The `BrnPopover` host
  // directive supplies the ancestor popover that `BrnSelect`, the trigger
  // (`brnSelectTrigger`) and the content (`brnPopoverContent`) resolve — it
  // owns the portalled, positioned overlay. `Select` adds no extra inputs; the
  // wrapper exists to apply both brain directives + the slot.
}

/**
 * SelectTrigger — the clickable button that opens the listbox. Mirrors React
 * `SelectTrigger`.
 */
@Component({
  selector: 'gr-select-trigger',
  standalone: true,
  imports: [BrnSelectTrigger],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      brnSelectTrigger
      type="button"
      data-slot="select-trigger"
      [attr.data-size]="size()"
      [attr.data-variant]="variant()"
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
  /** Trigger surface. Mirrors React `SelectTrigger` `variant`. */
  readonly variant = input<SelectTriggerVariant>('default');
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      "flex w-fit items-center justify-between gap-2 rounded-sm border border-transparent bg-input/50 px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[placeholder]:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 hover:bg-input/70 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
      SELECT_TRIGGER_VARIANTS[this.variant()],
      this.class(),
    ),
  );
}

/**
 * SelectValue — renders the selected label or the placeholder. Mirrors React
 * `SelectValue`.
 */
@Component({
  selector: 'gr-select-value',
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

/** Box of the first non-empty text node under `root` (null when none). */
function firstTextRect(root: Element): DOMRect | null {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim()) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    return range.getBoundingClientRect();
  }
  return null;
}

/** Keep this far from the viewport edges when shifting the listbox. */
const VIEWPORT_MARGIN = 8;

/**
 * Item-aligned positioning, the Radix `position="item-aligned"` that React
 * `SelectContent` uses by default: on open, the listbox shifts so the selected
 * item's text lands exactly on the trigger's text, and it is at least as wide
 * as the trigger. The brain only places the listbox below the trigger, so this
 * runs after each render of the content. Without a selection it stays below.
 *
 * The open zoom animation scales the panel, which would skew the measurement,
 * so it is suspended while measuring and restarts afterwards. The shift uses
 * the `translate` property, which composes with the animation's `transform`.
 */
@Directive({ selector: '[grSelectItemAligned]', standalone: true })
export class SelectItemAligned {
  private readonly panel: HTMLElement = inject(ElementRef).nativeElement;
  private readonly host: HTMLElement = inject(SelectContent).host;

  constructor() {
    afterNextRender(() => this.align());
  }

  private align(): void {
    const trigger = this.host
      .closest('[data-slot=select]')
      ?.querySelector<HTMLElement>('[data-slot=select-trigger]');
    const value = trigger?.querySelector('[data-slot=select-value]');
    const item = this.panel.querySelector(
      '[data-slot=select-item][aria-selected=true]',
    );
    if (!trigger || !value || !item) return;

    const panel = this.panel;
    panel.style.minWidth = `${trigger.getBoundingClientRect().width}px`;
    panel.style.animationName = 'none';
    const from = firstTextRect(item);
    const to = firstTextRect(value);
    if (from && to) {
      const box = panel.getBoundingClientRect();
      const clamp = (shift: number, start: number, end: number, max: number) =>
        Math.min(
          Math.max(shift, VIEWPORT_MARGIN - start),
          max - VIEWPORT_MARGIN - end,
        );
      const dx = clamp(to.left - from.left, box.left, box.right, innerWidth);
      const dy = clamp(to.top - from.top, box.top, box.bottom, innerHeight);
      panel.style.translate = `${dx}px ${dy}px`;
    }
    panel.style.animationName = '';
  }
}

/**
 * SelectContent — the portalled, scrollable listbox. Mirrors React
 * `SelectContent`.
 */
@Component({
  selector: 'gr-select-content',
  standalone: true,
  imports: [
    BrnPopoverContent,
    BrnSelectContent,
    BrnSelectScrollUp,
    BrnSelectScrollDown,
    SelectItemAligned,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template brnPopoverContent>
      <div
        brnSelectContent
        grSelectItemAligned
        data-slot="select-content"
        [class]="computedClass()"
      >
        <button
          brnSelectScrollUp
          class="flex cursor-default items-center justify-center py-1 data-[hidden]:hidden"
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
          class="flex cursor-default items-center justify-center py-1 data-[hidden]:hidden"
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
  /** Host element; the item-aligned positioning finds the trigger from it. */
  readonly host: HTMLElement = inject(ElementRef).nativeElement;
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover-surface text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
      this.class(),
    ),
  );
}

/**
 * SelectItem — one selectable option. Mirrors React `SelectItem`. The check
 * indicator (lucide `check`, hand-inlined) sits in an absolute right slot.
 *
 * React's Radix `ItemIndicator` only mounts when the item is selected. The
 * brain `BrnSelectItem` sets `[attr.aria-selected]="active()"` on this host
 * element, so to stay faithful the indicator is gated purely off that attribute
 * via the `group-aria-selected:flex hidden` arbitrary variant — visible only
 * when the brain reports the item selected. No manual `selected` input is
 * needed; selection stays the single source of truth in the brain.
 */
@Component({
  selector: 'gr-select-item',
  standalone: true,
  hostDirectives: [{ directive: BrnSelectItem, inputs: ['value', 'disabled'] }],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
    <span data-slot="select-item-text"><ng-content /></span>
  `,
  host: {
    'data-slot': 'select-item',
    '[class]': 'computedClass()',
  },
})
export class SelectItem {
  // `value` (required) and `disabled` are the brain `BrnSelectItem` inputs,
  // exposed on this element by the host directive. The brain must sit on the
  // `gr-select-item` element itself: `BrnSelect` collects its items with a
  // content query, which cannot see a directive inside this template — the
  // items would never register, leaving no highlight, keyboard navigation or
  // type-ahead.
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      "group relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
      this.class(),
    ),
  );
}

/**
 * SelectGroup — a labelled section of options. Mirrors React `SelectGroup`.
 */
@Component({
  selector: 'gr-select-group',
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
  selector: 'gr-select-label',
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
  selector: 'gr-select-separator',
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
