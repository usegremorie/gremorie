'use client';

import { Button } from '@gremorie/rx-forms';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useIsMobile,
} from '@gremorie/rx-overlays';
import type { ReactNode } from 'react';

/**
 * An icon button that opens its menu as a popover from md up and as a bottom
 * drawer below it. The button has no visible label: the label is its
 * accessible name and its tooltip.
 */
export function ResponsiveMenu({
  label,
  title,
  description,
  icon,
  children,
}: {
  label: string;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  const isMobile = useIsMobile();
  const trigger = (
    <Button aria-label={label} size="icon-sm" variant="ghost">
      {icon}
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
      <PopoverContent align="end" className="w-80 p-3">
        <p className="font-medium text-sm">{title}</p>
        <p className="mb-3 text-muted-foreground text-xs">{description}</p>
        {children}
      </PopoverContent>
    </Popover>
  );
}
