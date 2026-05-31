import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@gremorie/rx-core";

/**
 * FeaturedIcon — an icon inside a styled, themed container.
 *
 * The small "badge" that anchors a card / artifact / empty-state header.
 * Token-driven, so theme + dark mode flow through automatically. Pass a
 * Lucide `icon` (or any `children`); the container sizes the glyph.
 *
 * Variants: `color` (brand · gray · success · error) × `theme`
 * (light · solid · outline) × `size` (sm · md · lg · xl) × `shape`
 * (square · circle).
 */
const featuredIconVariants = cva(
  "inline-flex shrink-0 items-center justify-center [&_svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "size-8 [&_svg]:size-4",
        md: "size-10 [&_svg]:size-5",
        lg: "size-12 [&_svg]:size-6",
        xl: "size-14 [&_svg]:size-7",
      },
      shape: { square: "", circle: "rounded-full" },
      theme: { light: "", solid: "", outline: "" },
      color: { brand: "", gray: "", success: "", error: "" },
    },
    compoundVariants: [
      // Square corner radius scales with size.
      { shape: "square", size: "sm", class: "rounded-md" },
      { shape: "square", size: "md", class: "rounded-lg" },
      { shape: "square", size: "lg", class: "rounded-xl" },
      { shape: "square", size: "xl", class: "rounded-2xl" },
      // color × theme.
      { color: "brand", theme: "light", class: "bg-brand/10 text-brand" },
      { color: "brand", theme: "solid", class: "bg-brand text-brand-foreground" },
      { color: "brand", theme: "outline", class: "border border-brand/30 text-brand" },
      { color: "gray", theme: "light", class: "bg-muted text-muted-foreground" },
      { color: "gray", theme: "solid", class: "bg-secondary text-secondary-foreground" },
      { color: "gray", theme: "outline", class: "border border-border text-muted-foreground" },
      { color: "success", theme: "light", class: "bg-success/10 text-success" },
      { color: "success", theme: "solid", class: "bg-success text-success-foreground" },
      { color: "success", theme: "outline", class: "border border-success/30 text-success" },
      { color: "error", theme: "light", class: "bg-destructive/10 text-destructive" },
      { color: "error", theme: "solid", class: "bg-destructive text-destructive-foreground" },
      { color: "error", theme: "outline", class: "border border-destructive/30 text-destructive" },
    ],
    defaultVariants: {
      size: "md",
      shape: "square",
      theme: "light",
      color: "brand",
    },
  }
);

export type FeaturedIconProps = React.ComponentProps<"span"> &
  VariantProps<typeof featuredIconVariants> & {
    /** Lucide icon to render (alternatively pass `children`). */
    icon?: LucideIcon;
  };

function FeaturedIcon({
  className,
  size,
  shape,
  theme,
  color,
  icon: Icon,
  children,
  ...props
}: FeaturedIconProps) {
  return (
    <span
      data-slot="featured-icon"
      data-color={color ?? "brand"}
      data-theme={theme ?? "light"}
      className={cn(
        featuredIconVariants({ size, shape, theme, color }),
        className
      )}
      {...props}
    >
      {Icon ? <Icon aria-hidden /> : children}
    </span>
  );
}

export { FeaturedIcon, featuredIconVariants };
