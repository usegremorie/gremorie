import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import {
  BrnToggleGroup,
  BrnToggleGroupItem,
} from '@spartan-ng/brain/toggle-group';
import { cn } from '@gremorie/ng-core';
import {
  toggleVariants,
  type ToggleSize,
  type ToggleVariant,
} from '../toggle/toggle';

/**
 * ToggleGroup — coordinated set of Toggles. Angular parity port of React
 * `ToggleGroup` from `@gremorie/rx-forms`, which wraps Radix `ToggleGroup`.
 *
 * Use `type="single"` for radio-like selection (one pressed at a time) or
 * `type="multiple"` for checkbox-like (any number pressed). `variant`, `size`
 * and `spacing` propagate from the Root to its items.
 *
 * Behavior (selection + roving focus) is delegated to the spartan brain
 * `BrnToggleGroup` directive (the Angular equivalent of Radix ToggleGroup),
 * applied as a `hostDirective` so its `type`/`value`/`nullable`/`disabled`
 * inputs are forwarded transparently. React propagates `variant`/`size`/
 * `spacing` to children via context; Angular has no JSX context, so
 * `ToggleGroupItem` reads them by injecting this parent instead.
 *
 * Use ToggleGroup for **formatting/state** (text alignment, view mode, filter
 * chips). RadioGroup is for form values; Tabs swap full content panels.
 *
 * Parity with React `ToggleGroup`:
 * - `type` ('single'|'multiple') ↔ React `type`
 * - `value` ↔ React `value`
 * - `variant` / `size` / `spacing` ↔ React `variant` / `size` / `spacing`
 * - `disabled` / `nullable` ↔ React Radix Root props
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
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-spacing]': 'spacing()',
    '[style.--gap]': 'spacing()',
    '[class]': 'rootClass()',
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

  protected readonly rootClass = computed(() =>
    cn(
      'group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=default]:data-[variant=outline]:shadow-xs',
    ),
  );
}

/**
 * ToggleGroupItem — a single button inside a ToggleGroup. Angular parity port of
 * React `ToggleGroupItem`.
 *
 * Renders a `<button brnToggleGroupItem>` (the brain item directive owns the
 * pressed state and group coordination). `variant`/`size`/`spacing` are read
 * from the parent `ToggleGroup` when present (the Angular stand-in for React
 * context), falling back to this item's own inputs. The class is built from the
 * shared `toggleVariants` cva plus the React item class string.
 */
@Component({
  selector: 'gr-toggle-group-item',
  standalone: true,
  imports: [BrnToggleGroupItem],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      brnToggleGroupItem
      data-slot="toggle-group-item"
      [value]="value()"
      [disabled]="disabled()"
      [attr.data-variant]="resolvedVariant()"
      [attr.data-size]="resolvedSize()"
      [attr.data-spacing]="resolvedSpacing()"
      [attr.aria-label]="ariaLabel() || null"
      [class]="itemClass()"
    >
      <ng-content />
    </button>
  `,
})
export class ToggleGroupItem {
  private readonly group = inject(ToggleGroup, { optional: true });

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
      'data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first:rounded-l-md data-[spacing=0]:last:rounded-r-md data-[spacing=0]:data-[variant=outline]:border-l-0 data-[spacing=0]:data-[variant=outline]:first:border-l',
    ),
  );
}
