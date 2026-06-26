import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import * as React from 'react';

import { cn } from '@gremorie/rx-core';

import { Separator } from '../separator';

/**
 * Item - flexible list-row primitive (compound). Adapted from shadcn/ui's Item
 * into a single-`size` cascade: the `size` set on `Item` drives media size AND
 * title/description typography at once via `data-size` + `group-data` selectors,
 * so no wrapper has to repeat measurements.
 *
 * Height rule (media height tracks the text-block height), media centered with
 * the text:
 * - with a description:    lg 40px · md 36px · sm 32px
 * - without a description: lg/md 20px · sm 16px
 *
 * The `icon` media variant is the only fixed size (24px) and ignores the
 * cascade; `featured` / `avatar` / `image` follow it.
 */
const itemVariants = cva(
  'group/item flex flex-wrap items-center rounded-md border border-transparent text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border-border',
        muted: 'bg-muted/50',
      },
      size: {
        lg: 'gap-3 p-4',
        md: 'gap-2.5 px-4 py-3',
        sm: 'gap-2 px-3 py-2',
        // No padding/gap so an `asChild` host controls layout; the media/text
        // still resolve to `md` because data-size falls back to `md` below.
        none: '',
      },
      interactive: {
        true: 'cursor-pointer hover:bg-accent/50',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      interactive: false,
    },
  },
);

export type ItemProps = React.ComponentProps<'div'> &
  VariantProps<typeof itemVariants> & { asChild?: boolean };

function Item({
  className,
  variant = 'default',
  size = 'md',
  interactive = false,
  asChild = false,
  ...props
}: ItemProps) {
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-size={size === 'none' ? 'md' : size}
      data-interactive={interactive || undefined}
      className={cn(itemVariants({ variant, size, interactive, className }))}
      {...props}
    />
  );
}

// Cascade applied only to the container media variants (featured/avatar/image).
// Base (no description) = title height; with description = title+description.
const mediaSizeCascade =
  'group-data-[size=lg]/item:size-5 group-data-[size=md]/item:size-5 group-data-[size=sm]/item:size-4 ' +
  'group-has-[[data-slot=item-description]]/item:group-data-[size=lg]/item:size-10 ' +
  'group-has-[[data-slot=item-description]]/item:group-data-[size=md]/item:size-9 ' +
  'group-has-[[data-slot=item-description]]/item:group-data-[size=sm]/item:size-8';

const itemMediaVariants = cva(
  'flex shrink-0 items-center justify-center [&_svg]:pointer-events-none',
  {
    variants: {
      variant: {
        // The only fixed size: a bare 24px glyph, no container, no cascade.
        icon: "bg-transparent [&_svg:not([class*='size-'])]:size-6",
        featured: `${mediaSizeCascade} rounded-sm border bg-muted [&_svg:not([class*='size-'])]:size-[60%]`,
        avatar: `${mediaSizeCascade} overflow-hidden rounded-full [&_img]:size-full [&_img]:object-cover`,
        image: `${mediaSizeCascade} overflow-hidden rounded-sm [&_img]:size-full [&_img]:object-cover`,
      },
    },
    defaultVariants: {
      variant: 'icon',
    },
  },
);

export type ItemMediaProps = React.ComponentProps<'div'> &
  VariantProps<typeof itemMediaVariants>;

function ItemMedia({ className, variant = 'icon', ...props }: ItemMediaProps) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  );
}

function ItemContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        'flex flex-1 flex-col gap-0.5 [&+[data-slot=item-content]]:flex-none',
        className,
      )}
      {...props}
    />
  );
}

function ItemTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        'flex w-fit items-center gap-2 font-medium',
        'group-data-[size=lg]/item:text-sm group-data-[size=md]/item:text-sm group-data-[size=sm]/item:text-xs',
        className,
      )}
      {...props}
    />
  );
}

function ItemDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        'line-clamp-2 font-normal text-balance text-muted-foreground',
        'group-data-[size=lg]/item:text-sm group-data-[size=md]/item:text-xs group-data-[size=sm]/item:text-xs',
        '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
        className,
      )}
      {...props}
    />
  );
}

function ItemActions({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-actions"
      className={cn('flex items-center gap-2', className)}
      {...props}
    />
  );
}

function ItemHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        'flex basis-full items-center justify-between gap-2',
        className,
      )}
      {...props}
    />
  );
}

function ItemFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        'flex basis-full items-center justify-between gap-2',
        className,
      )}
      {...props}
    />
  );
}

function ItemGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn('group/item-group flex flex-col', className)}
      {...props}
    />
  );
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn('my-0', className)}
      {...props}
    />
  );
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
};
