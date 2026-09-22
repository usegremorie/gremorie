'use client';

import { Button } from '@gremorie/rx-forms';
import { Tabs, TabsList, TabsTrigger } from '@gremorie/rx-navigation';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

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
 * The measurements come from that rendered block, not from taste:
 *   wrapper  flex flex-col overflow-hidden rounded-xl border bg-fd-secondary
 *   tab row  flex gap-3.5 px-4, underlined triggers at py-2 text-sm
 *   code     figure bg-fd-card rounded-xl border shadow-sm, pre at 13px
 *   copy     absolute top-3 right-2, backdrop-blur-lg, 24x24 hit area
 *
 * Dogfood survives the alignment: the tabs are still rx-navigation Tabs and
 * the copy button is still an rx-forms Button. Only the surface tokens are
 * Fumadocs' (`fd-secondary`, `fd-card`), which is what makes it read as the
 * same chrome as the docs. The DS ships a `line` TabsList variant whose
 * underline is already the docs' tab treatment - no restyling needed.
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
  const [copied, setCopied] = useState(false);

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(COMMANDS[framework]);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (permissions / insecure context): no-op.
    }
  }

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
      <figure className="relative m-0 overflow-hidden rounded-xl border bg-fd-card shadow-sm">
        <div className="absolute top-3 right-2 z-2 rounded-lg text-fd-muted-foreground backdrop-blur-lg">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={copyCommand}
            aria-label={
              copied ? 'Install command copied' : 'Copy install command'
            }
          >
            {copied ? (
              <Check className="size-4 text-success" aria-hidden="true" />
            ) : (
              <Copy className="size-4" aria-hidden="true" />
            )}
          </Button>
        </div>
        <pre className="overflow-x-auto px-4 py-3 font-mono text-[13px] text-fd-foreground">
          <code>
            <span
              className="select-none text-fd-muted-foreground"
              aria-hidden="true"
            >
              ${' '}
            </span>
            {COMMANDS[framework]}
          </code>
        </pre>
      </figure>
    </div>
  );
}
