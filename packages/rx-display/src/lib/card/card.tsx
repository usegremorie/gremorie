import { cn } from '@gremorie/rx-core';

import type { ComponentPropsWithoutRef } from 'react';

/**
 * Card - surface primitive for grouping related content.
 *
 * Composed Card surface: a rounded surface with a
 * structured `Header → Content → Footer` rhythm. Each sub-component
 * is a thin styled `<div>`; the API is composable, not configurative -
 * you opt in to the parts you need.
 *
 * Common use cases: dashboard tiles, marketing feature cards, KPI
 * surfaces, chart wrappers (header for title + description, content
 * for the chart, footer for a trend caption + period).
 *
 * Imports the `cn` helper relative - keeps the primitive zero-leak
 * for downstream consumers of `@kalvner/kds/display/card`.
 */

export type CardProps = ComponentPropsWithoutRef<'div'>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
        className,
      )}
      {...props}
    />
  );
}
Card.displayName = 'Card';

export type CardHeaderProps = ComponentPropsWithoutRef<'div'>;

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  );
}
CardHeader.displayName = 'CardHeader';

export type CardTitleProps = ComponentPropsWithoutRef<'div'>;

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  );
}
CardTitle.displayName = 'CardTitle';

export type CardDescriptionProps = ComponentPropsWithoutRef<'div'>;

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}
CardDescription.displayName = 'CardDescription';

export type CardActionProps = ComponentPropsWithoutRef<'div'>;

export function CardAction({ className, ...props }: CardActionProps) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  );
}
CardAction.displayName = 'CardAction';

export type CardContentProps = ComponentPropsWithoutRef<'div'>;

export function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  );
}
CardContent.displayName = 'CardContent';

export type CardFooterProps = ComponentPropsWithoutRef<'div'>;

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  );
}
CardFooter.displayName = 'CardFooter';
