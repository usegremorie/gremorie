import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Alert variants — token-driven (`bg-card`, `text-destructive`).
 *
 * The grid layout reserves a column for an SVG icon sibling — when the
 * first child of `gn-alert` is an SVG, the layout flips to two columns
 * (icon + body); otherwise it collapses to a single column.
 */
export const alertVariants = cva(
  'relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        destructive:
          'bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;

/**
 * Alert — in-flow feedback message. Mirrors React `Alert` from
 * `@gremorie/rx-feedback`.
 *
 * Persistent message anchored inside page flow — distinct from a Toast
 * (transient, floating) and a Banner (page-spanning). Convey
 * informational, success, and warning intent through a leading icon
 * (project as the first child) rather than introducing more variants —
 * keeps the visual surface consistent and the API minimal.
 *
 * @example
 * ```html
 * <gn-alert>
 *   <svg ...><!-- info icon --></svg>
 *   <gn-alert-title>Heads up!</gn-alert-title>
 *   <gn-alert-description>Some helpful context.</gn-alert-description>
 * </gn-alert>
 *
 * <gn-alert variant="destructive">
 *   <gn-alert-title>Error</gn-alert-title>
 *   <gn-alert-description>Something went wrong.</gn-alert-description>
 * </gn-alert>
 * ```
 */
@Component({
  selector: 'gn-alert',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'alert',
    role: 'alert',
    '[attr.data-variant]': 'variant()',
    '[class]': 'computedClass()',
  },
})
export class Alert {
  readonly variant = input<AlertVariant>('default');

  protected readonly computedClass = computed(() =>
    alertVariants({ variant: this.variant() }),
  );
}

/**
 * AlertTitle — headline inside an Alert. Mirrors React `AlertTitle`.
 */
@Component({
  selector: 'gn-alert-title',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'alert-title',
    class: 'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight',
  },
})
export class AlertTitle {}

/**
 * AlertDescription — secondary body inside an Alert. Mirrors React
 * `AlertDescription`.
 */
@Component({
  selector: 'gn-alert-description',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'alert-description',
    class:
      'col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed',
  },
})
export class AlertDescription {}
