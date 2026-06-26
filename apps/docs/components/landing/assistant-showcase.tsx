'use client';

import { CodeBlock } from '@gremorie/rx-artifacts';
import { cn } from '@gremorie/rx-core';
import { Badge, Card, Separator } from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gremorie/rx-navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/rx-overlays';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useState } from 'react';

import {
  Assistant,
  type AssistantView,
} from '@/components/preview/blocks/assistant';

/**
 * Landing showcase: a mini live playground for the flagship block - the real
 * `Assistant` (the same one shipped at /blocks/assistant, rendered here, not a
 * Storybook iframe). Three panels, all visible at once:
 *
 *   1. Properties - the block's real `initialView` prop, as a segmented control.
 *   2. Code       - React | Angular consumer code, generated live from the
 *                   control, plus install commands.
 *   3. Preview    - the REAL `<Assistant />` rendered, with a dark/light toggle.
 *
 * The control drives the code AND the preview together: flipping "Starting view"
 * remounts the Assistant on that surface and updates the code snippet.
 */
function reactCode(view: AssistantView): string {
  const prop = view === 'empty' ? ' initialView="empty"' : '';
  return `import { Assistant } from '@/components/gremorie/blocks/assistant';

export function Chat() {
  return <Assistant${prop} />;
}`;
}

function angularCode(view: AssistantView): string {
  // The Angular edition ships the Assistant as the bare <ai-assistant> element
  // from @gremorie/ng-ai. It exposes a state machine ([state]/[disabled]) rather
  // than React's initialView, so the snippet stays stable across the control.
  const note =
    view === 'empty'
      ? '<!-- new-chat start: clear the seeded turns in the copied source -->\n'
      : '';
  return `// import { Assistant } from '@gremorie/ng-ai';

${note}<ai-assistant />`;
}

export function AssistantShowcase() {
  const [view, setView] = useState<AssistantView>('filled');
  const [previewDark, setPreviewDark] = useState(false);

  return (
    <TooltipProvider>
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">
            Flagship block
          </Badge>
          <h2 className="text-balance font-bold text-2xl text-foreground tracking-tight sm:text-3xl">
            The Assistant, live
          </h2>
          <p className="mt-2 text-balance text-muted-foreground">
            A complete chat surface in one import - streaming reasoning, an
            inline chart artifact, sources, and a B2B composer. Flip the
            starting view; the code and the rendered block update together.
          </p>
        </div>

        <Card className="grid gap-0 overflow-hidden p-0 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          {/* Left column - Properties + Code, stacked */}
          <div className="flex min-w-0 flex-col divide-y border-b lg:border-r lg:border-b-0">
            {/* Panel 1 - Properties */}
            <div className="flex flex-col gap-4 p-5">
              <h3 className="font-semibold text-sm">Properties</h3>
              <div className="space-y-1.5">
                <span className="text-muted-foreground text-xs">
                  Starting view
                </span>
                <Tabs
                  value={view}
                  onValueChange={(v) => setView(v as AssistantView)}
                >
                  <TabsList className="grid h-8 w-full grid-cols-2">
                    <TabsTrigger value="filled" className="text-xs">
                      Conversation
                    </TabsTrigger>
                    <TabsTrigger value="empty" className="text-xs">
                      New chat
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <Separator />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Assistant is a <strong>block</strong> - you own the source.{' '}
                <code className="text-[10px]">
                  gremorie add block-assistant
                </code>{' '}
                copies it in; wire <code className="text-[10px]">onSubmit</code>{' '}
                to your endpoint to make the mock real.
              </p>
            </div>

            {/* Panel 2 - Code (React | Angular) + install */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <Tabs
                defaultValue="react"
                className="flex min-h-0 flex-1 flex-col gap-0"
              >
                <div className="flex h-12 shrink-0 items-center justify-between border-b px-4">
                  <span className="font-semibold text-sm">Code</span>
                  <TabsList className="h-8">
                    <TabsTrigger value="react" className="text-xs">
                      React
                    </TabsTrigger>
                    <TabsTrigger value="angular" className="text-xs">
                      Angular
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent
                  value="react"
                  className="m-0 min-h-0 flex-1 overflow-auto p-3"
                >
                  <CodeBlock code={reactCode(view)} language="tsx" />
                </TabsContent>
                <TabsContent
                  value="angular"
                  className="m-0 min-h-0 flex-1 overflow-auto p-3"
                >
                  <CodeBlock code={angularCode(view)} language="html" />
                </TabsContent>
              </Tabs>
              <Separator />
              <div className="space-y-1 p-3 font-mono text-[11px] text-muted-foreground">
                <div>$ npx gremorie add block-assistant</div>
                <div>$ npm i @gremorie/ng-ai</div>
              </div>
            </div>
          </div>

          {/* Right column - live Preview + theme bar */}
          <div className="flex min-w-0 flex-col">
            <div className="flex h-12 shrink-0 items-center justify-between border-b px-4">
              <span className="font-semibold text-sm">Preview</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() => setPreviewDark((d) => !d)}
                    aria-label={
                      previewDark
                        ? 'Switch preview to light'
                        : 'Switch preview to dark'
                    }
                  >
                    {previewDark ? (
                      <SunIcon className="size-4" />
                    ) : (
                      <MoonIcon className="size-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-xs">
                  {previewDark ? 'Light' : 'Dark'}
                </TooltipContent>
              </Tooltip>
            </div>
            <div
              className={cn(
                'flex flex-1 items-center justify-center bg-background p-4 text-foreground',
                previewDark && 'dark',
              )}
            >
              {/* Remount on view/theme change so the block resets to the chosen
                  starting surface (initialView only sets the initial state). */}
              <Assistant
                key={`${view}-${previewDark ? 'dark' : 'light'}`}
                initialView={view}
              />
            </div>
          </div>
        </Card>
      </section>
    </TooltipProvider>
  );
}
