import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentPropsWithoutRef, type Ref } from "react";

import { cn } from "@gremorie/rx-core";

/**
 * Stack - vertical layout primitive.
 *
 * A `<div>` configured as `flex flex-col` with consistent gap,
 * alignment, and justification props. Stack is the right primitive any
 * time you have a list of items flowing top-to-bottom: card contents,
 * form sections, settings rows, vertical menus.
 *
 * For row layouts use `Flex`. For two-axis grids use `Grid`. For
 * one-off styled divs without layout intent use `Box`.
 */
const stackVariants = cva("flex flex-col", {
  variants: {
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
      "2xl": "gap-12"
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline"
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly"
    }
  },
  defaultVariants: {
    gap: "md",
    align: "stretch",
    justify: "start"
  }
});

export interface StackProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof stackVariants> {
  /** Forwarded ref to the underlying `div` element. */
  ref?: Ref<HTMLDivElement>;
}

export function Stack({
  className,
  gap,
  align,
  justify,
  ref,
  ...props
}: StackProps) {
  return (
    <div
      ref={ref}
      className={cn(stackVariants({ gap, align, justify }), className)}
      {...props}
    />
  );
}

Stack.displayName = "Stack";
