import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  ElementRef,
  forwardRef,
  inject,
  input,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { BrnToggleGroup } from '@spartan-ng/brain/toggle-group';
import { cn } from '@gremorie/ng-core';
import {
  toggleVariants,
  type ToggleSize,
  type ToggleVariant,
} from '../toggle/toggle';

let nextItemId = 0;

/**
 * ToggleGroup — coordinated set of Toggles. Angular parity port of React
 * `ToggleGroup` from `@gremorie/rx-forms`, which wraps Radix `ToggleGroup`.
 *
 * Use `type="single"` for radio-like selection (one pressed at a time) or
 * `type="multiple"` for checkbox-like (any number pressed). `variant`, `size`
 * and `spacing` propagate from the Root to its items.
 *
 * Selection state (and the `ControlValueAccessor` for forms) is delegated to the
 * spartan brain `BrnToggleGroup` directive, applied as a `hostDirective` so its
 * `type`/`value`/`nullable`/`disabled` inputs are forwarded transparently.
 *
 * The brain stops at state, so the parts Radix adds on top live here, to match
 * the React edition exactly:
 * - ARIA: `type="single"` is a `radiogroup` of `radio` items with
 *   `aria-checked`; `type="multiple"` is a `toolbar` of buttons with
 *   `aria-pressed` (the brain would render `group` + `aria-pressed` for both).
 * - Keyboard: one tab stop with roving focus. Arrow keys move focus (looping,
 *   skipping disabled items, flipped in RTL), Home/End jump to the ends, and
 *   moving focus never changes the selection. Tabbing in lands on the pressed
 *   item, else the one focused last, else the first enabled one.
 * - `nullable` defaults to `true`, like Radix: clicking the pressed item of a
 *   single group clears the value. Pass `[nullable]="false"` when a value is
 *   required.
 *
 * React propagates `variant`/`size`/`spacing` to children via context; Angular
 * has no JSX context, so `ToggleGroupItem` reads them by injecting this parent.
 *
 * Use ToggleGroup for **formatting/state** (text alignment, view mode, filter
 * chips). RadioGroup is for form values; Tabs swap full content panels.
 *
 * @example
 * ```html
 * <gr-toggle-group type="single" variant="outline">
 *   <gr-toggle-group-item value="left" ariaLabel="Align left">L</gr-toggle-group-item>
 *   <gr-toggle-group-item value="center" ariaLabel="Align center">C</gr-toggle-group-item>
 *   <gr-toggle-group-item value="right" ariaLabel="Align right">R</gr-toggle-group-item>
 * </gr-toggle-group>
 * ```
 */
@Component({
  selector: 'gr-toggle-group',
  standalone: true,
  hostDirectives: [
    {
      directive: BrnToggleGroup,
      inputs: ['type', 'value', 'nullable', 'disabled'],
      outputs: ['valueChange'],
    },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'toggle-group',
    // Overrides the brain's static `role="group"` (Radix parity).
    '[attr.role]': "multiple() ? 'toolbar' : 'radiogroup'",
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-spacing]': 'spacing()',
    '[style.--gap]': 'spacing()',
    '[class]': 'rootClass()',
    '(keydown)': 'onKeydown($event)',
    '(focusin)': 'onFocusIn($event)',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class ToggleGroup {
  // NOTE: `type`, `value`, `nullable` and `disabled` are NOT redeclared here —
  // they are exposed on this component's selector by the `BrnToggleGroup`
  // hostDirective (`inputs: [...]` above) and forwarded straight to the brain,
  // which owns selection state. We only add the presentational inputs below.

  /** Visual variant propagated to items. Mirrors React `variant`. */
  readonly variant = input<ToggleVariant>('default');
  /** Size preset propagated to items. Mirrors React `size`. */
  readonly size = input<ToggleSize>('default');
  /** Gap (in spacing units) between items. Mirrors React `spacing` (default 0). */
  readonly spacing = input<number>(0);

  /** @internal The brain directive that owns the selection state. */
  readonly brn = inject<BrnToggleGroup<unknown>>(BrnToggleGroup);
  /** @internal Every item in DOM order (drives position and roving focus). */
  readonly items = contentChildren<ToggleGroupItem>(
    forwardRef(() => ToggleGroupItem),
    { descendants: true },
  );
  /** @internal Whether the group allows several pressed items. */
  readonly multiple = computed(() => this.brn.type() === 'multiple');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly focused = signal<ToggleGroupItem | null>(null);
  private readonly lastFocused = signal<ToggleGroupItem | null>(null);

  /**
   * @internal The single item that carries `tabindex="0"`. While focus is
   * inside the group it is the focused item (so Shift+Tab leaves the group);
   * otherwise the pressed item, then the last focused, then the first enabled
   * one — the order Radix's RovingFocusGroup uses when focus enters.
   */
  readonly tabStop = computed<ToggleGroupItem | null>(
    (): ToggleGroupItem | null => {
      const focusable = this.items().filter((item) => item.focusable());
      const focused = this.focused();
      if (focused && focusable.includes(focused)) return focused;
      const last = this.lastFocused();
      return (
        focusable.find((item) => item.pressed()) ??
        (last && focusable.includes(last) ? last : null) ??
        focusable[0] ??
        null
      );
    },
  );

  protected readonly rootClass = computed(() =>
    cn(
      'group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=default]:data-[variant=outline]:shadow-xs',
    ),
  );

  protected onKeydown(event: KeyboardEvent): void {
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
      return;
    }
    const focusable = this.items().filter((item) => item.focusable());
    const current = focusable.findIndex((item) => item.owns(event.target));
    if (current === -1) return;

    const rtl = getComputedStyle(this.host.nativeElement).direction === 'rtl';
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = rtl ? 'ArrowRight' : 'ArrowLeft';
    const count = focusable.length;
    let target: number;
    switch (event.key) {
      case forward:
      case 'ArrowDown':
        target = (current + 1) % count;
        break;
      case backward:
      case 'ArrowUp':
        target = (current - 1 + count) % count;
        break;
      case 'Home':
        target = 0;
        break;
      case 'End':
        target = count - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    focusable[target].focus();
  }

  protected onFocusIn(event: FocusEvent): void {
    const item = this.items().find((candidate) => candidate.owns(event.target));
    if (!item) return;
    this.focused.set(item);
    this.lastFocused.set(item);
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (!next || !this.host.nativeElement.contains(next)) {
      this.focused.set(null);
    }
  }
}

/**
 * ToggleGroupItem — a single button inside a ToggleGroup. Angular parity port of
 * React `ToggleGroupItem`.
 *
 * The host element uses `display: contents`, so the inner `<button>` is the
 * flex item, exactly as in the React DOM. Because that button is the only child
 * of its own host, CSS `:first-child`/`:last-child` can't see the item's place
 * in the group; the item exposes `data-first`/`data-last` instead, and the
 * segmented-control classes (outer radius, shared borders) read those.
 *
 * `variant`/`size`/`spacing` are read from the parent `ToggleGroup` when present
 * (the Angular stand-in for React context), falling back to this item's own
 * inputs. The class is built from the shared `toggleVariants` cva plus the React
 * item class string.
 */
@Component({
  selector: 'gr-toggle-group-item',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: `
    <button
      #button
      type="button"
      data-slot="toggle-group-item"
      [id]="id"
      [disabled]="isDisabled()"
      [attr.tabindex]="tabIndex()"
      [attr.role]="radio() ? 'radio' : null"
      [attr.aria-checked]="radio() ? pressed() : null"
      [attr.aria-pressed]="radio() ? null : pressed()"
      [attr.aria-label]="ariaLabel() || null"
      [attr.data-state]="pressed() ? 'on' : 'off'"
      [attr.data-disabled]="isDisabled() ? '' : null"
      [attr.data-first]="isFirst() ? '' : null"
      [attr.data-last]="isLast() ? '' : null"
      [attr.data-variant]="resolvedVariant()"
      [attr.data-size]="resolvedSize()"
      [attr.data-spacing]="resolvedSpacing()"
      [class]="itemClass()"
      (click)="toggle()"
    >
      <ng-content />
    </button>
  `,
})
export class ToggleGroupItem {
  private readonly group = inject(ToggleGroup, { optional: true });
  private readonly button =
    viewChild.required<ElementRef<HTMLButtonElement>>('button');
  /** Pressed state when the item is used outside a group. */
  private readonly standalonePressed = signal(false);

  protected readonly id = `gr-toggle-group-item-${++nextItemId}`;

  /** The value this item represents. Mirrors React `value`. */
  readonly value = input<unknown>();
  /** Whether the item is disabled. Mirrors React `disabled`. */
  readonly disabled = input<boolean>(false);
  /** Accessible label for icon-only items. Mirrors React `aria-label`. */
  readonly ariaLabel = input<string>('');
  /** Visual variant fallback when not inside a ToggleGroup. Mirrors React `variant`. */
  readonly variant = input<ToggleVariant>('default');
  /** Size fallback when not inside a ToggleGroup. Mirrors React `size`. */
  readonly size = input<ToggleSize>('default');

  /** @internal Whether this item is pressed. */
  readonly pressed = computed(() =>
    this.group
      ? this.group.brn.isSelected(this.value())
      : this.standalonePressed(),
  );
  /** @internal Disabled by itself or by the whole group. */
  readonly isDisabled = computed(
    () => this.disabled() || (this.group?.brn.disabledState() ?? false),
  );
  /** @internal Whether roving focus may land here. */
  readonly focusable = computed(() => !this.isDisabled());

  /** Radix renders single-select items as radios. */
  protected readonly radio = computed(
    () => !!this.group && !this.group.multiple(),
  );
  protected readonly tabIndex = computed<number | null>((): number | null =>
    this.group ? (this.group.tabStop() === this ? 0 : -1) : null,
  );
  private readonly index = computed(
    () => this.group?.items().indexOf(this) ?? 0,
  );
  protected readonly isFirst = computed(() => this.index() === 0);
  protected readonly isLast = computed(
    () => this.index() === (this.group?.items().length ?? 1) - 1,
  );

  /** Group variant wins (React context precedence), else the item's own input. */
  protected readonly resolvedVariant = computed<ToggleVariant>(
    () => this.group?.variant() ?? this.variant(),
  );
  protected readonly resolvedSize = computed<ToggleSize>(
    () => this.group?.size() ?? this.size(),
  );
  protected readonly resolvedSpacing = computed<number>(
    () => this.group?.spacing() ?? 0,
  );

  protected readonly itemClass = computed(() =>
    cn(
      toggleVariants({
        variant: this.resolvedVariant(),
        size: this.resolvedSize(),
      }),
      'w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10',
      // React uses `first:`/`last:` on the button; here the button is an only
      // child, so position comes from `data-first`/`data-last` instead.
      'data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:data-first:rounded-l-md data-[spacing=0]:data-last:rounded-r-md data-[spacing=0]:data-[variant=outline]:border-l-0 data-[spacing=0]:data-[variant=outline]:data-first:border-l',
    ),
  );

  /** @internal Whether a DOM event target is this item's button. */
  owns(target: EventTarget | null): boolean {
    return target === this.button().nativeElement;
  }

  /** @internal Moves keyboard focus to this item. */
  focus(): void {
    this.button().nativeElement.focus();
  }

  protected toggle(): void {
    if (this.isDisabled()) return;
    if (!this.group) {
      this.standalonePressed.update((on) => !on);
      return;
    }
    // The brain only uses `source` to build its `change` event, which this
    // component does not forward (`valueChange` carries the value).
    const source = null as never;
    if (this.pressed()) {
      this.group.brn.deselect(this.value(), source);
    } else {
      this.group.brn.select(this.value(), source);
    }
  }
}
