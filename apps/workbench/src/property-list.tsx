/**
 * Property list for the props panel: a settings list composed from DS
 * primitives (Item rows; switch, compact select, or a value edited in a
 * popover). Same composition as the site's home card
 * (apps/docs/components/landing/property-list.tsx); the workbench is its own
 * app, so it carries its own copy. Rows here have no icon (contract controls
 * carry none), so separators start at the text.
 */
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from '@gremorie/rx-display';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@gremorie/rx-forms';
import { Popover, PopoverContent, PopoverTrigger } from '@gremorie/rx-overlays';
import { cn } from '@gremorie/rx-core';
import { PencilIcon } from 'lucide-react';
import { Children, Fragment, type ReactNode } from 'react';

const ROW =
  'min-h-10 flex-nowrap gap-3 rounded-none border-0 px-3 py-1 hover:bg-foreground/5 [&_[data-slot=item-title]]:block [&_[data-slot=item-title]]:w-full [&_[data-slot=item-title]]:truncate [&_[data-slot=item-title]]:text-sm [&_[data-slot=item-title]]:font-normal [&_[data-slot=item-title]]:text-secondary-foreground';

export function PropertyGroup({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  const rows = Children.toArray(children);
  return (
    <section className="flex flex-col gap-2">
      {title && (
        <h4 className="px-1 font-medium text-muted-foreground text-xs">
          {title}
        </h4>
      )}
      <ItemGroup className="overflow-hidden rounded-lg bg-foreground/5 dark:bg-foreground/[0.07]">
        {rows.map((row, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <ItemSeparator className="my-0 ml-3 w-auto bg-foreground/8" />
            )}
            {row}
          </Fragment>
        ))}
      </ItemGroup>
    </section>
  );
}

type Base = { id: string; label: ReactNode; ariaLabel: string };

export function PropertySwitch({
  id,
  label,
  checked,
  onCheckedChange,
}: Base & { checked: boolean; onCheckedChange: (v: boolean) => void }) {
  return (
    <Item asChild className={cn(ROW, 'cursor-pointer')} size="sm">
      <label htmlFor={id}>
        <ItemContent className="min-w-0 flex-1">
          <ItemTitle>{label}</ItemTitle>
        </ItemContent>
        <ItemActions className="ml-auto shrink-0">
          <Switch
            checked={checked}
            id={id}
            onCheckedChange={onCheckedChange}
            size="sm"
          />
        </ItemActions>
      </label>
    </Item>
  );
}

export function PropertySelect({
  label,
  ariaLabel,
  value,
  options,
  onValueChange,
}: Base & {
  value: string;
  options: string[];
  onValueChange: (v: string) => void;
}) {
  return (
    <Item className={ROW} size="sm">
      <ItemContent className="min-w-0 flex-1">
        <ItemTitle>{label}</ItemTitle>
      </ItemContent>
      <ItemActions className="ml-auto shrink-0">
        <Select onValueChange={onValueChange} value={value}>
          <SelectTrigger
            aria-label={ariaLabel}
            className="-mr-2 h-7 shrink-0 gap-1 border-none data-[size=sm]:h-7 bg-transparent px-2 text-muted-foreground shadow-none hover:bg-foreground/5 dark:bg-transparent"
            size="sm"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {options.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ItemActions>
    </Item>
  );
}

export function PropertyText({
  id,
  label,
  ariaLabel,
  value,
  type = 'text',
  onValueChange,
}: Base & {
  value: string;
  type?: 'text' | 'number';
  onValueChange: (v: string) => void;
}) {
  return (
    <Item className={ROW} size="sm">
      <ItemContent className="min-w-0 max-w-[60%] flex-none">
        <ItemTitle>{label}</ItemTitle>
      </ItemContent>
      <ItemActions className="ml-auto min-w-0 flex-1 justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <button
              aria-label={`Edit ${ariaLabel}`}
              className="-mr-2 flex h-7 min-w-0 items-center gap-1.5 rounded-sm px-2 text-muted-foreground text-sm hover:bg-foreground/5"
              type="button"
            >
              <span className="truncate">{value === '' ? 'Empty' : value}</span>
              <PencilIcon className="size-3.5 shrink-0" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 p-3">
            <label className="sr-only" htmlFor={id}>
              {ariaLabel}
            </label>
            {/* The popover focuses its first field when it opens. */}
            <Input
              id={id}
              onChange={(e) => onValueChange(e.target.value)}
              type={type}
              value={value}
            />
          </PopoverContent>
        </Popover>
      </ItemActions>
    </Item>
  );
}
