'use client';

import { cn } from '@gremorie/rx-core';
import { InputGroupButton } from '@gremorie/rx-forms';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@gremorie/rx-overlays';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { AtSignIcon, CheckIcon, XIcon } from 'lucide-react';
import { type ComponentProps, type ReactNode, useMemo, useState } from 'react';

// ============================================================================
// PromptInputContext - "@ Add context" command palette + selected-context chips
//
// A self-contained, stateful affordance for the PromptInput header. It owns the
// set of selected context items and renders both the trigger and the chips, so
// consumers get the canonical behaviour for free:
//
//   - 0 selected  -> labelled "@ Add context" outline button
//   - 1+ selected -> the trigger collapses to an icon-only "@" button on the
//                    left, followed by a removable chip per selected item
//
// The trigger opens a Popover hosting a Command palette (search + grouped,
// multi-select list) - the same Popover+Command combobox pattern used by
// ModelSelector. Selection is controllable via `value` / `onValueChange`.
// ============================================================================

export type PromptInputContextItem = {
  /** Stable identifier, returned through `onValueChange`. */
  id: string;
  /** Visible label in the palette and the selected chip. */
  label: string;
  /** Optional leading icon (rendered at `size-3`/`size-4`). */
  icon?: ReactNode;
  /** Optional group heading, e.g. "Recent" or "Workspace". */
  group?: string;
  /** Extra search terms folded into the palette filter. */
  keywords?: string[];
};

export type PromptInputContextProps = Omit<
  ComponentProps<'div'>,
  'onChange' | 'defaultValue'
> & {
  /** Available context items, rendered grouped in declaration order. */
  items: PromptInputContextItem[];
  /** Controlled selected ids. */
  value?: string[];
  /** Uncontrolled initial selected ids. */
  defaultValue?: string[];
  /** Fires with the next selected ids whenever the selection changes. */
  onValueChange?: (value: string[]) => void;
  /** Button label shown while nothing is selected. */
  label?: ReactNode;
  /** Search input placeholder. */
  placeholder?: string;
  /** Empty-state text when the search matches nothing. */
  emptyText?: ReactNode;
  /** Trigger tooltip (set to `null` to disable). */
  tooltip?: ReactNode;
  /** Popover alignment relative to the trigger. */
  align?: ComponentProps<typeof PopoverContent>['align'];
};

export const PromptInputContext = ({
  items,
  value,
  defaultValue = [],
  onValueChange,
  label = 'Add context',
  placeholder = 'Search context...',
  emptyText = 'No context found.',
  tooltip = 'Add context',
  align = 'start',
  className,
  ...props
}: PromptInputContextProps) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useControllableState<string[]>({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const selectedIds = selected ?? [];

  const toggle = (id: string) =>
    setSelected((prev = []) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const remove = (id: string) =>
    setSelected((prev = []) => prev.filter((x) => x !== id));

  const selectedItems = useMemo(
    () =>
      selectedIds
        .map((id) => items.find((it) => it.id === id))
        .filter((it): it is PromptInputContextItem => Boolean(it)),
    [selectedIds, items],
  );

  const hasSelection = selectedItems.length > 0;

  // Group items by their `group`, preserving first-seen order.
  const groups = useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, PromptInputContextItem[]>();

    for (const it of items) {
      const key = it.group ?? '';
      if (!map.has(key)) {
        map.set(key, []);
        order.push(key);
      }
      map.get(key)?.push(it);
    }

    return order.map((key) => ({ heading: key, items: map.get(key) ?? [] }));
  }, [items]);

  const trigger = (
    <InputGroupButton
      aria-expanded={open}
      aria-label="Add context"
      className="border border-input border-solid bg-transparent text-foreground shadow-none transition-colors hover:bg-accent hover:text-foreground aria-expanded:bg-accent"
      size={hasSelection ? 'icon-sm' : 'sm'}
      type="button"
      variant="outline"
    >
      <AtSignIcon className="size-4" />
      {hasSelection ? null : <span>{label}</span>}
    </InputGroupButton>
  );

  return (
    <div
      className={cn('flex flex-wrap items-center gap-1.5', className)}
      {...props}
    >
      <Popover onOpenChange={setOpen} open={open}>
        {tooltip ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        ) : (
          <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        )}
        <PopoverContent align={align} className="w-64 p-0" sideOffset={6}>
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              {groups.map((group, index) => (
                <CommandGroup
                  heading={group.heading || undefined}
                  key={group.heading || `group-${index}`}
                >
                  {group.items.map((item) => {
                    const isSelected = selectedIds.includes(item.id);

                    return (
                      <CommandItem
                        key={item.id}
                        onSelect={() => toggle(item.id)}
                        value={`${item.label} ${(item.keywords ?? []).join(' ')}`}
                      >
                        {item.icon ? (
                          <span className="text-muted-foreground [&>svg]:size-4">
                            {item.icon}
                          </span>
                        ) : null}
                        <span className="truncate">{item.label}</span>
                        {isSelected ? (
                          <CheckIcon className="ml-auto size-4" />
                        ) : null}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedItems.map((item) => (
        <span
          className="inline-flex h-8 items-center gap-1 rounded-md border px-2.5 text-xs"
          key={item.id}
        >
          {item.icon ? (
            <span className="text-muted-foreground [&>svg]:size-3">
              {item.icon}
            </span>
          ) : null}
          <span className="max-w-[10rem] truncate">{item.label}</span>
          <button
            aria-label={`Remove ${item.label}`}
            className="relative ml-0.5 inline-flex size-4 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors after:absolute after:-inset-1 after:content-[''] hover:bg-accent hover:text-foreground"
            onClick={() => remove(item.id)}
            type="button"
          >
            <XIcon className="size-3" />
          </button>
        </span>
      ))}
    </div>
  );
};
