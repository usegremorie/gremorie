'use client';

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

type Framework = keyof typeof COMMANDS;

export function InstallCommand() {
  const [framework, setFramework] = useState<Framework>('react');

  return (
    <div className="flex w-full max-w-md flex-col overflow-hidden rounded-xl border bg-fd-secondary text-left">
      <Tabs
        value={framework}
        onValueChange={(v) => setFramework(v as Framework)}
      >
        <TabsList
          variant="line"
          className="h-auto w-full justify-start gap-3.5 p-0 px-4"
        >
          <TabsTrigger
            value="react"
            className="flex-none px-0 py-2 text-sm font-medium"
          >
            React
          </TabsTrigger>
          <TabsTrigger
            value="angular"
            className="flex-none px-0 py-2 text-sm font-medium"
          >
            Angular
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <CommandLine command={COMMANDS[framework]} label="install command" />
    </div>
  );
}
