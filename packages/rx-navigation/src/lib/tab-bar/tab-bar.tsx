'use client';

import { cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import * as React from 'react';

import { cn } from '@gremorie/rx-core';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/rx-overlays';

/**
 * TabBar - the app's top-level destinations, docked to the bottom of a phone
 * screen.
 *
 *   <TabBar>                  nav, fixed to the bottom, safe-area aware
 *   └─ <TabBarItem />         one destination: icon, label, optional badge
 *
 * Three looks, one API:
 *   material   full-width bar; the active icon sits on a pill indicator
 *   ios        floating translucent capsule, icon over label
 *   floating   compact floating pill, icons only (labels become the
 *              accessible name and a tooltip)
 *
 * The floating looks paint with the floating-surface tokens
 * (`--surface-opacity`, `--surface-backdrop`), so a solid theme gets a solid
 * bar. Items are destinations, so the root is a `<nav>` and the active item
 * carries `aria-current="page"`; for panels inside one page use Tabs.
 *
 * The bar is `fixed` to the viewport. To show it inside a frame (a preview,
 * a phone mock-up), pass `className="absolute"` on a positioned parent.
 */

type TabBarVariant = 'material' | 'ios' | 'floating';
type TabBarLabels = 'always' | 'active' | 'never';

interface TabBarContextValue {
  variant: TabBarVariant;
  labels: TabBarLabels;
  value: string | undefined;
  select: (value: string) => void;
}

const TabBarContext = React.createContext<TabBarContextValue | null>(null);

function useTabBar() {
  const ctx = React.useContext(TabBarContext);
  if (!ctx) throw new Error('TabBarItem must be used inside <TabBar>.');
  return ctx;
}

/**
 * Hides the bar while the page scrolls down and brings it back on the way
 * up, the way phone tab bars get out of the reader's way. Small moves (under
 * 8px) and the top of the page never hide it.
 */
function useHideOnScroll(enabled: boolean) {
  const [hidden, setHidden] = React.useState(false);
  React.useEffect(() => {
    if (!enabled) {
      setHidden(false);
      return;
    }
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - last;
      if (Math.abs(delta) < 8) return;
      setHidden(delta > 0 && y > 56);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [enabled]);
  return hidden;
}

const tabBarVariants = cva(
  'fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ease-out data-[hidden=true]:translate-y-[calc(100%+1.5rem)] motion-reduce:transition-none',
  {
    variants: {
      variant: {
        material:
          'border-t border-border bg-background-surface pb-[env(safe-area-inset-bottom)]',
        ios: 'pointer-events-none px-4 pb-[max(env(safe-area-inset-bottom),1rem)]',
        floating:
          'pointer-events-none flex justify-center px-4 pb-[max(env(safe-area-inset-bottom),1rem)]',
      },
    },
  },
);

const tabBarListVariants = cva('flex items-stretch', {
  variants: {
    variant: {
      material: 'mx-auto h-20 max-w-2xl',
      ios: 'pointer-events-auto mx-auto h-16 max-w-md rounded-full border border-border bg-popover-surface p-1 shadow-lg',
      floating:
        'pointer-events-auto gap-1 rounded-full border border-border bg-popover-surface p-1.5 shadow-lg',
    },
  },
});

interface TabBarProps extends Omit<
  React.ComponentProps<'nav'>,
  'onChange' | 'defaultValue'
> {
  /** The look: full-width bar, floating capsule, or icon-only pill. */
  variant?: TabBarVariant;
  /** When item labels show. `floating` always hides them visually. */
  labels?: TabBarLabels;
  /** Controlled active item. */
  value?: string;
  /** Initially active item (uncontrolled). */
  defaultValue?: string;
  /** Called with the item's value when an item is chosen. */
  onValueChange?: (value: string) => void;
  /** Slide the bar away while scrolling down, back on scrolling up. */
  hideOnScroll?: boolean;
}

function TabBar({
  className,
  variant = 'material',
  labels: labelsProp = 'always',
  value: valueProp,
  defaultValue,
  onValueChange,
  hideOnScroll = false,
  children,
  'aria-label': ariaLabel = 'Main',
  ...props
}: TabBarProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const value = valueProp ?? inner;
  const labels = variant === 'floating' ? 'never' : labelsProp;
  const hidden = useHideOnScroll(hideOnScroll);

  const select = React.useCallback(
    (next: string) => {
      if (valueProp === undefined) setInner(next);
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );

  const ctx = React.useMemo(
    () => ({ variant, labels, value, select }),
    [variant, labels, value, select],
  );

  return (
    <TabBarContext.Provider value={ctx}>
      <TooltipProvider>
        <nav
          aria-label={ariaLabel}
          data-hidden={hidden}
          data-labels={labels}
          data-slot="tab-bar"
          data-variant={variant}
          className={cn(tabBarVariants({ variant }), className)}
          {...props}
        >
          <div
            data-slot="tab-bar-list"
            className={tabBarListVariants({ variant })}
          >
            {children}
          </div>
        </nav>
      </TooltipProvider>
    </TabBarContext.Provider>
  );
}

const tabBarItemVariants = cva(
  "group/tab-bar-item relative flex items-center justify-center text-muted-foreground transition-colors outline-none select-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6",
  {
    variants: {
      variant: {
        material:
          'min-w-0 flex-1 flex-col gap-1 rounded-md data-[active=true]:text-foreground',
        ios: 'min-w-0 flex-1 flex-col gap-0.5 rounded-full data-[active=true]:bg-accent data-[active=true]:text-primary',
        floating:
          'size-11 rounded-full data-[active=true]:bg-accent data-[active=true]:text-foreground',
      },
    },
  },
);

const tabBarIconVariants = cva(
  'relative inline-flex items-center justify-center',
  {
    variants: {
      variant: {
        material:
          'h-8 w-16 rounded-full transition-colors group-data-[active=true]/tab-bar-item:bg-accent',
        ios: '',
        floating: '',
      },
    },
  },
);

const tabBarLabelVariants = cva('truncate font-medium', {
  variants: {
    variant: {
      material: 'text-xs',
      ios: 'text-[0.625rem]',
      floating: '',
    },
  },
});

interface TabBarItemProps extends Omit<
  React.ComponentProps<'button'>,
  'value'
> {
  /** Identifies the item; the bar is active on the item whose value matches. */
  value: string;
  /** Visible text, and the accessible name when labels are hidden. */
  label: string;
  /** Icon component, e.g. a lucide icon. */
  icon: React.ElementType;
  /** A count, or `true` for a dot. Hidden when `0` or `false`. */
  badge?: number | boolean;
  /** Force the active state, e.g. from the router's current path. */
  active?: boolean;
  /** Render the child element (a router Link) instead of a button. */
  asChild?: boolean;
}

function TabBarItem({
  className,
  value,
  label,
  icon: Icon,
  badge,
  active: activeProp,
  asChild = false,
  onClick,
  children,
  ...props
}: TabBarItemProps) {
  const { variant, labels, value: current, select } = useTabBar();
  const active = activeProp ?? current === value;
  const showLabel = labels === 'always' || (labels === 'active' && active);

  const content = (
    <>
      <span
        data-slot="tab-bar-icon"
        className={tabBarIconVariants({ variant })}
      >
        <Icon aria-hidden="true" />
        {badge ? (
          <span
            aria-hidden="true"
            data-slot="tab-bar-badge"
            className={cn(
              'absolute top-0 rounded-full bg-destructive text-destructive-foreground ring-2 ring-background',
              variant === 'material' ? 'left-1/2 ml-1.5' : '-right-1.5',
              badge === true
                ? 'size-2'
                : 'flex h-4 min-w-4 items-center justify-center px-1 text-[0.625rem] leading-none font-semibold tabular-nums',
            )}
          >
            {badge === true ? null : badge > 99 ? '99+' : badge}
          </span>
        ) : null}
      </span>
      {showLabel ? (
        <span
          data-slot="tab-bar-label"
          className={tabBarLabelVariants({ variant })}
        >
          {label}
        </span>
      ) : null}
    </>
  );

  const badgeText =
    typeof badge === 'number' && badge > 0 ? `, ${badge} new` : '';
  const shared = {
    'aria-current': active ? ('page' as const) : undefined,
    'aria-label': showLabel && !badgeText ? undefined : `${label}${badgeText}`,
    'data-active': active,
    'data-slot': 'tab-bar-item',
    className: cn(tabBarItemVariants({ variant }), className),
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) select(value);
    },
  };

  const item = asChild ? (
    <Slot.Root {...shared} {...props}>
      {React.isValidElement(children)
        ? React.cloneElement(children, undefined, content)
        : children}
    </Slot.Root>
  ) : (
    <button type="button" {...shared} {...props}>
      {content}
    </button>
  );

  if (showLabel) return item;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{item}</TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}

export { TabBar, TabBarItem, tabBarVariants };
export type { TabBarProps, TabBarItemProps, TabBarVariant, TabBarLabels };
