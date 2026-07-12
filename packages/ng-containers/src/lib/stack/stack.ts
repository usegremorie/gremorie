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
 * Stack variants — mirror React `Stack` from `@gremorie/rx-containers`.
 *
 * A `flex flex-col` primitive whose spacing and cross-/main-axis
 * alignment are driven entirely by inputs (no subcomponents). The token
 * scale (`gap`) maps 1:1 to the React reference (0 / 4 / 8 / 16 / 24 / 32
 * / 48 px).
 */
export const stackVariants = cva('flex flex-col', {
  variants: {
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
      '2xl': 'gap-12',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
  },
  defaultVariants: {
    gap: 'md',
    align: 'stretch',
    justify: 'start',
  },
});

export type StackGap = NonNullable<VariantProps<typeof stackVariants>['gap']>;
export type StackAlign = NonNullable<
  VariantProps<typeof stackVariants>['align']
>;
export type StackJustify = NonNullable<
  VariantProps<typeof stackVariants>['justify']
>;

/**
 * Stack — vertical layout primitive. Mirrors React `Stack` from
 * `@gremorie/rx-containers`.
 *
 * A `<div>` configured as `flex flex-col` with consistent `gap`, `align`
 * and `justify` inputs. Reach for Stack any time items flow
 * top-to-bottom: card contents, form sections, settings rows, vertical
 * menus. For row layouts use `Flex`; for two-axis grids use `Grid`; for a
 * one-off styled div use `Box`.
 *
 * @example
 * ```html
 * <gr-stack gap="md" class="w-64">
 *   <div>One</div>
 *   <div>Two</div>
 *   <div>Three</div>
 * </gr-stack>
 * ```
 */
@Component({
  selector: 'gr-stack',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'stack',
    '[class]': 'computedClass()',
  },
})
export class Stack {
  readonly gap = input<StackGap>('md');
  readonly align = input<StackAlign>('stretch');
  readonly justify = input<StackJustify>('start');

  protected readonly computedClass = computed(() =>
    cn(
      stackVariants({
        gap: this.gap(),
        align: this.align(),
        justify: this.justify(),
      }),
    ),
  );
}
