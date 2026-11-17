'use client';

import { cn } from '@gremorie/rx-core';
import { Tabs, TabsList, TabsTrigger } from '@gremorie/rx-navigation';
import { useState } from 'react';

import { CommandLine } from '@/components/landing/command-line';

/**
 * Hero install command - the "prove it is real" box, rendered right below the
 * subheadline. Small React | Angular tabs switch the command between the two
 * editions of the same primitive; the copy button grabs the active command.
 *
 * Built to the same shape as a tabbed code block in the docs, because it is
 * the same object: `/get-started/installation` already shows this exact
 * command under React | Angular tabs. Two different boxes for one thing made
 * the landing look like a different product from the docs it links to.
 *
 * The wrapper and tab row are measured from that rendered block:
 *   wrapper  flex flex-col overflow-hidden rounded-xl border bg-fd-secondary
 *   tab row  flex gap-3.5 px-4, underlined triggers at py-2 text-sm
 * The command itself is a `CommandLine`, the one definition of a copyable
 * command on this site - the Assistant showcase stacks two of the same thing.
 *
 * Dogfood survives the alignment: the tabs are still rx-navigation Tabs. Only
 * the surface tokens are Fumadocs' (`fd-secondary`), which is what makes it
 * read as the same chrome as the docs. The DS ships a `line` TabsList variant
 * whose underline is already the docs' tab treatment - no restyling needed.
 *
 * Controlled Tabs with no TabsContent: the command line below the header
 * re-renders from state, so the box stays one compact block instead of two
 * stacked panels.
 */

const COMMANDS = {
  react: 'npx gremorie add button',
  angular: 'npx gremorie add ng-button',
} as const;

export type Framework = 'react' | 'angular';

/**
 * `commands` sets the command per edition (defaults to the button). Pass
 * `framework` + `onFrameworkChange` to drive it from outside, e.g. so the same
 * tab also switches a code sample below it.
 */
export function InstallCommand({
  commands = COMMANDS,
  framework: controlled,
  onFrameworkChange,
  className,
}: {
  commands?: Record<Framework, string>;
  framework?: Framework;
  onFrameworkChange?: (framework: Framework) => void;
  className?: string;
} = {}) {
  const [own, setOwn] = useState<Framework>('react');
  const framework = controlled ?? own;
  const setFramework = (f: Framework) => {
    setOwn(f);
    onFrameworkChange?.(f);
  };

  return (
    <div
      className={cn(
        'flex w-full max-w-md flex-col overflow-hidden rounded-xl border bg-fd-secondary text-left',
        className,
      )}
    >
      <FrameworkTabs
        className="px-4"
        onValueChange={setFramework}
        value={framework}
      />
      <CommandLine command={commands[framework]} label="install command" />
    </div>
  );
}

// The underline sits ON the divider below the tabs (the card header's
// border-b, or the command box's top border), as Fumadocs and Radix Themes
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
