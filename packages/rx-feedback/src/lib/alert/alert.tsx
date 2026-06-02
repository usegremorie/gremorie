import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@gremorie/rx-core';

/**
 * Alert - in-flow feedback message.
 *
 * A persistent message anchored
 * inside page flow - distinct from `Toast` (transient, floating)
 * and `Banner` (page-spanning). KDS recommends conveying
 * informational, success, and warning intent through a leading
 * icon (`Info`, `CheckCircle2`, `AlertTriangle`, `XCircle` from
 * `lucide-react`) rather than introducing more variants - keeps
 * the visual surface consistent and the API minimal.
 *
 * Per ADR-012, this primitive ships under
 * `@kalvner/kds/feedback/alert` with `cn` imported by relative
 * path. Variants are token-driven (`bg-card`, `text-destructive`).
 *
 * Use `<AlertTitle>` for the headline and `<AlertDescription>` for
 * the body. The grid layout reserves a column for an SVG sibling -
 * pass an icon as the first child when you want it.
 */
const alertVariants = cva(
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

export type AlertProps = React.ComponentProps<'div'> &
  VariantProps<typeof alertVariants>;

function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight',
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed',
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, alertVariants };
