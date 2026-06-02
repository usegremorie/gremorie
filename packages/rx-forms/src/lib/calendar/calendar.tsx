'use client';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import * as React from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';

import { cn } from '@gremorie/rx-core';
import { buttonVariants } from '../button/button';

/**
 * Calendar - date picker grid built on react-day-picker v10.
 *
 * Three modes via `mode`:
 *   - `single`   → one date
 *   - `range`    → start + end (faixa de datas)
 *   - `multiple` → várias datas independentes
 *
 * Use `Calendar` standalone in pages with bastante espaço (agendas,
 * planejadores). Para forms compactos, embrulhe em
 * [Popover](../../overlays/popover) - esse padrão composto é o
 * `DatePicker`.
 *
 * Em v10 do react-day-picker as keys de classNames foram migradas
 * para o enum `UI`; usamos `getDefaultClassNames()` e fazemos merge
 * apenas com tokens semânticos do KDS.
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaults = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        ...defaults,
        root: cn(defaults.root, 'group/calendar'),
        months: cn(defaults.months, 'flex flex-col gap-4 sm:flex-row'),
        month: cn(defaults.month, 'flex flex-col gap-4'),
        month_caption: cn(
          defaults.month_caption,
          'flex h-7 items-center justify-center',
        ),
        caption_label: cn(defaults.caption_label, 'text-sm font-medium'),
        nav: cn(defaults.nav, 'flex items-center gap-1'),
        button_previous: cn(
          defaults.button_previous,
          buttonVariants({ variant: 'outline' }),
          'absolute left-1 top-3 size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        button_next: cn(
          defaults.button_next,
          buttonVariants({ variant: 'outline' }),
          'absolute right-1 top-3 size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        weekdays: cn(defaults.weekdays, 'flex'),
        weekday: cn(
          defaults.weekday,
          'w-8 text-[0.8rem] font-normal text-muted-foreground',
        ),
        week: cn(defaults.week, 'mt-2 flex w-full'),
        day: cn(
          defaults.day,
          'relative size-8 p-0 text-center text-sm focus-within:relative focus-within:z-20',
        ),
        day_button: cn(
          defaults.day_button,
          buttonVariants({ variant: 'ghost' }),
          'size-8 p-0 font-normal aria-selected:opacity-100',
        ),
        selected: cn(
          defaults.selected,
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        ),
        today: cn(defaults.today, 'bg-accent text-accent-foreground'),
        outside: cn(
          defaults.outside,
          'text-muted-foreground aria-selected:text-muted-foreground',
        ),
        disabled: cn(defaults.disabled, 'text-muted-foreground opacity-50'),
        hidden: cn(defaults.hidden, 'invisible'),
        ...classNames,
      }}
      components={{
        Chevron: ({
          orientation,
          className: chevronClassName,
          ...chevronProps
        }) => {
          if (orientation === 'left') {
            return (
              <ChevronLeftIcon
                className={cn('size-4', chevronClassName)}
                {...chevronProps}
              />
            );
          }
          return (
            <ChevronRightIcon
              className={cn('size-4', chevronClassName)}
              {...chevronProps}
            />
          );
        },
      }}
      {...props}
    />
  );
}

export { Calendar };
