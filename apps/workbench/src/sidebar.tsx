import { cn } from '@gremorie/rx-core';
import { ScrollArea } from '@gremorie/rx-containers';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { NAV, categoryOf } from './nav';

/**
 * Component catalog sidebar - sections with collapsible categories (icon +
 * chevron) that expand on click to reveal their components, mirroring the docs
 * sidebar. Only components with a contract are interactive; the rest show the
 * roadmap, dimmed.
 */
export function Sidebar({
  active,
  contracted,
  onSelect,
}: {
  active: string;
  contracted: Set<string>;
  onSelect: (name: string) => void;
}) {
  const [open, setOpen] = useState<Set<string>>(
    () => new Set([categoryOf(active)].filter(Boolean) as string[]),
  );
  const toggle = (key: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const Item = ({ name }: { name: string }) => {
    const enabled = contracted.has(name);
    const isActive = name === active;
    return (
      <button
        type="button"
        disabled={!enabled}
        onClick={() => enabled && onSelect(name)}
        className={cn(
          'block w-full rounded-md py-1.5 pr-2 pl-9 text-left text-sm transition-colors',
          isActive
            ? 'bg-accent font-medium text-accent-foreground'
            : enabled
              ? 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              : 'cursor-default text-muted-foreground/40',
        )}
      >
        {name}
      </button>
    );
  };

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r">
      <ScrollArea className="min-h-0 flex-1">
        <nav className="space-y-5 p-3">
          {NAV.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="px-3 font-semibold text-[11px] text-muted-foreground">
                {section.title}
              </p>
              {section.categories.map((cat) => {
                const Icon = cat.icon;
                // A single-item category is a leaf (e.g. Form): a direct link.
                if (cat.items.length === 1) {
                  const name = cat.items[0];
                  const enabled = contracted.has(name);
                  const isActive = name === active;
                  return (
                    <button
                      type="button"
                      key={cat.key}
                      disabled={!enabled}
                      onClick={() => enabled && onSelect(name)}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors',
                        isActive
                          ? 'bg-accent font-medium text-accent-foreground'
                          : enabled
                            ? 'hover:bg-accent/50'
                            : 'cursor-default text-muted-foreground/50',
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span>{cat.label}</span>
                    </button>
                  );
                }
                const isOpen = open.has(cat.key);
                return (
                  <div key={cat.key}>
                    <button
                      type="button"
                      onClick={() => toggle(cat.key)}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent/50"
                    >
                      <Icon className="size-4 shrink-0 text-muted-foreground" />
                      <span>{cat.label}</span>
                      <ChevronRight
                        className={cn(
                          'ml-auto size-4 shrink-0 text-muted-foreground transition-transform',
                          isOpen && 'rotate-90',
                        )}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-0.5 space-y-0.5">
                        {cat.items.map((name) => (
                          <Item key={name} name={name} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
