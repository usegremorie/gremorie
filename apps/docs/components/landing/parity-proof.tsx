'use client';

import { CodeBlock } from '@gremorie/rx-artifacts';
import { Badge, Card } from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gremorie/rx-navigation';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

/**
 * Parity proof - the section that PROVES the number one claim instead of
 * stating it: the same Button, in both editions, behind React | Angular tabs.
 *
 * The snippets are faithful consumer usage of the real primitives:
 *  - React: `Button` from @gremorie/rx-forms (packages/rx-forms/src/lib/button)
 *  - Angular: the `ai-button` element selector from @gremorie/ng-core
 *    (packages/ng-core/src/lib/button.ts), same variant/size inputs.
 * The live row above the tabs renders the actual React Buttons - both
 * editions share the exact variant classes, enforced by the contract lint
 * in packages/contracts (CI), which is what makes the "no drift" claim true.
 *
 * CTA note: the plan points this CTA at the public Workbench. The workbench
 * app has no public deployment URL yet, so the CTA goes to /components until
 * it ships; swap the href once the workbench is live.
 *
 * Dogfood: rx Tabs, Card, Badge, Button and the rx-artifacts CodeBlock.
 */

const REACT_SNIPPET = `import { Button } from '@gremorie/rx-forms';

export function Actions() {
  return (
    <div className="flex items-center gap-2">
      <Button>Save changes</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="ghost">Learn more</Button>
    </div>
  );
}`;

const ANGULAR_SNIPPET = `<!-- import { Button } from '@gremorie/ng-core' -->

<div class="flex items-center gap-2">
  <ai-button>Save changes</ai-button>
  <ai-button variant="outline">Cancel</ai-button>
  <ai-button variant="ghost">Learn more</ai-button>
</div>`;

export function ParityProof() {
  return (
    <section className="py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-2 lg:gap-16">
        {/* Copy column */}
        <div className="max-w-xl">
          <p className="font-medium text-primary text-sm">React ⇄ Angular</p>
          <h2 className="mt-2 font-bold text-3xl text-foreground tracking-tight sm:text-4xl">
            Same component. Both frameworks. No drift.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Every primitive ships in a React and an Angular edition with the
            same anatomy, the same props, and the same tokens, enforced by a
            contract lint in CI, not by good intentions. Pick a framework tab:
            the code changes, the rendered result does not.
          </p>
          <div className="mt-6">
            <Button variant="outline" asChild>
              <Link href="/components">
                Browse the components
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Proof column - rendered result + the two editions of the code */}
        <Card className="gap-0 overflow-hidden p-0">
          <div className="flex flex-wrap items-center gap-2 border-b border-border/60 bg-muted/20 px-4 py-5">
            <Button size="sm">Save changes</Button>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
            <Button size="sm" variant="ghost">
              Learn more
            </Button>
            <Badge
              variant="outline"
              className="ml-auto text-[10px] text-muted-foreground uppercase tracking-wider"
            >
              Rendered output
            </Badge>
          </div>
          <Tabs defaultValue="react" className="gap-0">
            <div className="flex h-11 items-center justify-between border-b border-border/60 px-4">
              <span className="font-medium text-muted-foreground text-xs">
                The same Button, twice
              </span>
              <TabsList className="h-8">
                <TabsTrigger value="react" className="text-xs">
                  React
                </TabsTrigger>
                <TabsTrigger value="angular" className="text-xs">
                  Angular
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="react" className="m-0">
              <CodeBlock
                code={REACT_SNIPPET}
                language="tsx"
                className="rounded-none border-0"
              />
            </TabsContent>
            <TabsContent value="angular" className="m-0">
              <CodeBlock
                code={ANGULAR_SNIPPET}
                language="html"
                className="rounded-none border-0"
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </section>
  );
}
