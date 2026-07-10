'use client';

import { Button } from '@gremorie/rx-forms';
import { Tabs, TabsList, TabsTrigger } from '@gremorie/rx-navigation';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

/**
 * Hero install command - the "prove it is real" box (shadcn-style), rendered
 * right below the subheadline. Small React | Angular tabs switch the command
 * between the two editions of the same primitive; the copy button grabs the
 * active command.
 *
 * Dogfood: rx-navigation Tabs + rx-forms Button. Controlled Tabs with no
 * TabsContent - the command line below the header re-renders from state, so
 * the box stays one compact block instead of two stacked panels.
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
    <div className="w-full max-w-md overflow-hidden rounded-lg border bg-card text-left shadow-xs">
      <Tabs
        value={framework}
        onValueChange={(v) => setFramework(v as Framework)}
      >
        <div className="flex items-center justify-between gap-2 border-b border-border/60 px-2 py-1.5">
          <TabsList className="h-7">
            <TabsTrigger value="react" className="px-2.5 text-xs">
              React
            </TabsTrigger>
            <TabsTrigger value="angular" className="px-2.5 text-xs">
              Angular
            </TabsTrigger>
          </TabsList>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={copyCommand}
            aria-label={
              copied ? 'Install command copied' : 'Copy install command'
            }
          >
            {copied ? (
              <Check className="size-3.5 text-success" aria-hidden="true" />
            ) : (
              <Copy className="size-3.5" aria-hidden="true" />
            )}
          </Button>
        </div>
      </Tabs>
      <p className="flex items-center gap-2 overflow-x-auto px-4 py-3 font-mono text-sm text-foreground">
        <span className="select-none text-muted-foreground" aria-hidden="true">
          $
        </span>
        {COMMANDS[framework]}
      </p>
    </div>
  );
}
