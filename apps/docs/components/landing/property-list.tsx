'use client';

/**
 * Property list: a settings list for props panels (home card, workbench),
 * composed from DS primitives only. Each row: icon, label, and the control on
 * the right (switch, compact select, or a value that edits in a popover).
 *
 *   PropertyGroup            section title + rounded surface
 *   ├─ PropertySwitch        whole row toggles (label for the switch)
 *   ├─ PropertySelect        value + chevron on the right
 *   └─ PropertyText          value + pencil; edits in a popover
 *
 * Built on Item (ItemGroup / Item / ItemMedia / ItemContent / ItemActions /
 * ItemSeparator), the Gremorie way to lay out settings rows.
 */

import { cn } from '@gremorie/rx-core';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
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
import { PencilIcon, type LucideIcon } from 'lucide-react';
import { Children, Fragment, type ReactNode } from 'react';

// Row: 40px tall, 12px sides, 12px between icon and label. Hover changes only
// the background. Title at 14px (Item `sm` would set 12px).
const ROW =
  'min-h-10 flex-nowrap gap-3 rounded-none border-0 px-3 py-1 hover:bg-accent [&_[data-slot=item-title]]:block [&_[data-slot=item-title]]:w-full [&_[data-slot=item-title]]:truncate [&_[data-slot=item-title]]:text-sm [&_[data-slot=item-title]]:font-normal [&_[data-slot=item-title]]:text-secondary-foreground';

function RowIcon({ icon: Icon }: { icon: LucideIcon }) {
  // ItemMedia "icon": a bare 16px glyph, as in menus.
  return (
    <ItemMedia className="text-muted-foreground">
      <Icon />
    </ItemMedia>
  );
}

export function PropertyGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const rows = Children.toArray(children);
  return (
    <section className="flex flex-col gap-2">
      <h4 className="px-1 font-medium text-muted-foreground text-xs">
        {title}
      </h4>
      <ItemGroup className="overflow-hidden rounded-lg bg-secondary">
        {rows.map((row, i) => (
          <Fragment key={i}>
            {i > 0 && (
              // Starts where the text starts: 12px side + 16px icon + 12px gap.
              <ItemSeparator className="my-0 ml-10 w-auto bg-border" />
            )}
            {row}
          </Fragment>
        ))}
      </ItemGroup>
    </section>
  );
}

export function PropertySwitch({
  id,
  icon,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  icon: LucideIcon;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <Item asChild className={cn(ROW, 'cursor-pointer')} size="sm">
      <label htmlFor={id}>
        <RowIcon icon={icon} />
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
  icon,
  label,
  value,
  options,
  onValueChange,
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onValueChange: (value: string) => void;
  className?: string;
}) {
  return (
    <Item className={cn(ROW, className)} size="sm">
      <RowIcon icon={icon} />
      <ItemContent className="min-w-0 flex-1">
        <ItemTitle>{label}</ItemTitle>
      </ItemContent>
      <ItemActions className="ml-auto shrink-0">
        <Select onValueChange={onValueChange} value={value}>
          <SelectTrigger
            aria-label={label}
            className="-mr-2 h-7 shrink-0 gap-1 border-none data-[size=sm]:h-7 bg-transparent px-2 text-muted-foreground shadow-none hover:bg-accent"
            size="sm"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
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
  icon,
  label,
  value,
  onValueChange,
}: {
  id: string;
  icon: LucideIcon;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <Item className={ROW} size="sm">
      <RowIcon icon={icon} />
      <ItemContent className="min-w-0 max-w-[60%] flex-none">
        <ItemTitle>{label}</ItemTitle>
      </ItemContent>
      <ItemActions className="ml-auto min-w-0 flex-1 justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <button
              aria-label={`Edit ${label.toLowerCase()}`}
              className="-mr-2 flex h-7 min-w-0 items-center gap-1.5 rounded-sm px-2 text-muted-foreground text-sm hover:bg-accent"
              type="button"
            >
              <span className="truncate">{value}</span>
              <PencilIcon className="size-3.5 shrink-0" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 p-3">
            <label className="sr-only" htmlFor={id}>
              {label}
            </label>
            {/* The popover focuses its first field when it opens. */}
            <Input
              id={id}
              onChange={(e) => onValueChange(e.target.value)}
              value={value}
            />
          </PopoverContent>
        </Popover>
      </ItemActions>
    </Item>
  );
}
