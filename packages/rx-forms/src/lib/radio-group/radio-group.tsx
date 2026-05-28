"use client";

import { CircleIcon } from "lucide-react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@gremorie/rx-core";

/**
 * RadioGroup - single-select group of mutually-exclusive options.
 *
 * Built over Radix. The `Root` owns the
 * selected value; each `Item` represents a single option. Visible
 * options are best capped at five - beyond that, prefer `Select`
 * for vertical-space efficiency.
 *
 * The Radix primitive handles roving tabindex (only the active
 * option is in the tab order) and arrow-key navigation
 * automatically.
 */
export type RadioGroupProps = React.ComponentProps<
  typeof RadioGroupPrimitive.Root
>;
export type RadioGroupItemProps = React.ComponentProps<
  typeof RadioGroupPrimitive.Item
>;

function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

function RadioGroupItem({ className, ...props }: RadioGroupItemProps) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "aspect-square size-4 shrink-0 rounded-full border border-input text-primary shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
