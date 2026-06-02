import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Badge variants — 6 variants mirroring React `Badge` from `@gremorie/rx-display`.
 *
 * Token-driven (`bg-primary`, `bg-secondary`, `border-border`) so theme
 * changes propagate automatically. `[a&]:hover:*` selectors apply hover
 * affordances only when Badge is rendered as an anchor — keeps the
 * default static surface non-interactive.
 */
export const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary:
          'bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90',
        outline:
          'border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        ghost: '[a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 [a&]:hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type BadgeVariant = NonNullable<
  VariantProps<typeof badgeVariants>['variant']
>;

/**
 * Badge — compact label for status, counts and tags. Mirrors React
 * `Badge` from `@gremorie/rx-display`.
 *
 * KDS treats Badge as a static label primitive — interactive
 * selection-style chips belong to `ToggleGroup`. The host element is a
 * `<span>`-equivalent block; use Angular's `routerLink` or wrap with an
 * `<a>` when the badge needs to be a link (the `[a&]:` selectors in the
 * variants light up hover affordances when wrapped in an anchor).
 *
 * @example
 * ```html
 * <gn-badge>Default</gn-badge>
 * <gn-badge variant="secondary">Secondary</gn-badge>
 * <gn-badge variant="destructive">Destructive</gn-badge>
 * <gn-badge variant="outline">Outline</gn-badge>
 * <gn-badge variant="ghost">Ghost</gn-badge>
 * <gn-badge variant="link">Link</gn-badge>
 * ```
 */
@Component({
  selector: 'gn-badge',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'badge',
    '[attr.data-variant]': 'variant()',
    '[class]': 'computedClass()',
  },
})
export class Badge {
  readonly variant = input<BadgeVariant>('default');

  protected readonly computedClass = computed(() =>
    badgeVariants({ variant: this.variant() }),
  );
}
