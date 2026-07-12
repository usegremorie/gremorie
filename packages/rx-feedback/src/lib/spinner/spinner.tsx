import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2Icon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@gremorie/rx-core';

/**
 * Spinner size variants. Matches the Angular companion (`gr-spinner`).
 */
const spinnerVariants = cva('animate-spin', {
  variants: {
    size: {
      sm: 'size-3',
      default: 'size-4',
      lg: 'size-6',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export type SpinnerSize = NonNullable<
  VariantProps<typeof spinnerVariants>['size']
>;

export type SpinnerProps = React.ComponentProps<'svg'> &
  VariantProps<typeof spinnerVariants>;

/**
 * Spinner - indeterminate "thinking" indicator. A faithful shadcn/ui port
 * (lucide `Loader2Icon` + `animate-spin`), extended with a `size` variant so
 * the API matches `@gremorie/ng-feedback`.
 *
 * Renders a single rotating glyph, so it lives anywhere a glyph fits -
 * inline next to text, inside a button while a request is in flight, in an
 * empty state. Use `Spinner` when duration is unknown; use `Progress` when
 * you know the percent complete; use `Skeleton` when you need to reserve
 * layout for content shape. Inherits `currentColor`, so it tints with the
 * surrounding text color.
 */
function Spinner({ className, size, ...props }: SpinnerProps) {
  return (
    <Loader2Icon
      data-slot="spinner"
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    />
  );
}

export { Spinner, spinnerVariants };
