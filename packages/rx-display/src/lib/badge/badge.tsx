import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";

import { cn } from "@gremorie/rx-core";

/**
 * Badge - compact label for status, counts and tags.
 *
 * Imported from shadcn/ui (MIT). Renders a `<span>` (or any element
 * via `asChild`) styled by `class-variance-authority`. KDS treats
 * Badge as a static label primitive - interactive selection-style
 * chips belong to `ToggleGroup` (Phase 4).
 *
 * Per ADR-012, this primitive ships under
 * `@kalvner/kds/display/badge` with `cn` imported by relative path.
 * Variants are token-driven (`bg-primary`, `bg-destructive`,
 * `border-border`) so theme changes flow through automatically.
 *
 * The `[a&]:` selectors in the variants apply hover styles only when
 * Badge is rendered as an `<a>` via `asChild` - keeps the static
 * variant fully static and avoids "fake interactive" affordances.
 */
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  };

function Badge({ className, variant = "default", asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
