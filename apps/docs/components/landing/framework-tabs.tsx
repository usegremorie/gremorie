'use client';

import { cn } from '@gremorie/rx-core';
import { Tabs, TabsList, TabsTrigger } from '@gremorie/rx-navigation';

export type Framework = 'react' | 'angular';

// The underline sits ON the divider below the tabs (the code card's
// header border), as Fumadocs and Radix Themes
// draw it. ::after is placed from the trigger's padding box, and the trigger
// has a 1px (transparent) border, so -2px puts the 2px line exactly over the
// trigger's border plus the 1px divider. Painted above the next block.
const TRIGGER =
  'h-full flex-none px-0 py-2 text-sm font-medium after:z-10 group-data-[orientation=horizontal]/tabs:after:bottom-[-2px]';

/**
 * React | Angular switch: the DS `line` Tabs, text plus an underline on the
 * active edition. Controlled, with no TabsContent: the caller renders what the
 * edition changes (a command, a code sample).
 */
export function FrameworkTabs({
  value,
  onValueChange,
  className,
}: {
  value: Framework;
  onValueChange: (framework: Framework) => void;
  className?: string;
}) {
  return (
    <Tabs value={value} onValueChange={(v) => onValueChange(v as Framework)}>
      <TabsList
        variant="line"
        className={cn('h-auto w-full justify-start gap-3.5 p-0', className)}
      >
        <TabsTrigger value="react" className={TRIGGER}>
          React
        </TabsTrigger>
        <TabsTrigger value="angular" className={TRIGGER}>
          Angular
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
