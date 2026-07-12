import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@gremorie/ng-core';

/**
 * `buttonGroupVariants` — the cva for the ButtonGroup container. Copied verbatim
 * from React `buttonGroupVariants` in `@gremorie/rx-forms` so both editions emit
 * identical classes. Exported for advanced consumers composing custom groups.
 */
export const buttonGroupVariants = cva(
  "flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none',
        vertical:
          'flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  },
);

export type ButtonGroupOrientation = NonNullable<
  VariantProps<typeof buttonGroupVariants>['orientation']
>;

/**
 * ButtonGroup — layout wrapper that fuses adjacent buttons (and button-like
 * controls) into one segmented control. Angular parity port of React
 * `ButtonGroup` from `@gremorie/rx-forms`.
 *
 * Pure layout, no brain: a `role="group"` container whose `buttonGroupVariants`
 * cva strips the inner radii/borders so children read as a single unit, either
 * `horizontal` (default) or `vertical`.
 *
 * Parity with React `ButtonGroup`:
 * - `orientation` ('horizontal'|'vertical') ↔ React `orientation`
 *
 * @example
 * ```html
 * <gr-button-group>
 *   <button class="...">Prev</button>
 *   <gr-button-group-separator />
 *   <button class="...">Next</button>
 * </gr-button-group>
 * ```
 */
@Component({
  selector: 'gr-button-group',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    role: 'group',
    'data-slot': 'button-group',
    '[attr.data-orientation]': 'orientation()',
    '[class]': 'computedClass()',
  },
})
export class ButtonGroup {
  /** Layout axis. Mirrors React `orientation` (default 'horizontal'). */
  readonly orientation = input<ButtonGroupOrientation>('horizontal');

  protected readonly computedClass = computed(() =>
    cn(buttonGroupVariants({ orientation: this.orientation() })),
  );
}

/**
 * ButtonGroupText — a non-interactive bordered cell inside a ButtonGroup, for
 * inline labels/affixes (e.g. "https://", a unit, a count). Angular parity port
 * of React `ButtonGroupText`.
 */
@Component({
  selector: 'gr-button-group-text',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class:
      "bg-muted shadow-xs flex items-center gap-2 rounded-md border px-4 text-sm font-medium [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
  },
})
export class ButtonGroupText {}

/**
 * ButtonGroupSeparator — a thin divider between segments of a ButtonGroup.
 * Angular parity port of React `ButtonGroupSeparator`, which uses Radix
 * `Separator`. Hand-rolled here as a styled `role="separator"` div (decorative,
 * so `aria-hidden`) that stretches across the cross-axis.
 *
 * Parity with React `ButtonGroupSeparator`:
 * - `orientation` ('horizontal'|'vertical') ↔ React `orientation` (default 'vertical')
 */
@Component({
  selector: 'gr-button-group-separator',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  host: {
    role: 'separator',
    'aria-hidden': 'true',
    'data-slot': 'button-group-separator',
    '[attr.data-orientation]': 'orientation()',
    '[class]': 'computedClass()',
  },
})
export class ButtonGroupSeparator {
  /** Divider axis. Mirrors React `orientation` (default 'vertical'). */
  readonly orientation = input<'horizontal' | 'vertical'>('vertical');

  protected readonly computedClass = computed(() =>
    cn(
      'bg-input relative !m-0 self-stretch shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:h-auto',
    ),
  );
}
