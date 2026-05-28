"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@gremorie/rx-core";
import { Button, Calendar } from "@gremorie/rx-forms";

import { Popover, PopoverContent, PopoverTrigger } from "../popover";

/**
 * DatePicker - composite of Popover + Calendar with Gremorie defaults.
 *
 * Not a single primitive but the canonical composition that the registry
 * exposes as a ready-to-use wrapper, saving boilerplate.
 *
 * Single-mode por padrão. Para range, use `<DatePickerRange />`. Pra UX
 * mobile, prefira [Drawer](../../overlays/drawer) + Calendar - popover
 * não funciona bem em telas pequenas.
 */

type DatePickerProps = {
  value?: Date;
  onValueChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

function DatePicker({
  value,
  onValueChange,
  placeholder = "Selecione uma data",
  disabled,
  className
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          data-slot="date-picker-trigger"
        >
          <CalendarIcon className="mr-2 size-4" />
          {value ? format(value, "PP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onValueChange}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
export type { DatePickerProps };
