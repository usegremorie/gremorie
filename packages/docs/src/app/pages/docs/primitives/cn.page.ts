import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DocsCodeBlock } from '../../../shared/code-block.component';
import { DocsLayout } from '../../../shared/doc-layout.component';
import { DocsPage, DocsSection, DocsProse } from '../../../shared/doc-page.component';

@Component({
  selector: 'docs-primitive-cn',
  imports: [DocsLayout, DocsPage, DocsSection, DocsProse, DocsCodeBlock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-layout>
      <docs-page
        eyebrow="Primitive · Utility"
        title="cn() — class name composer"
        lede="A 3-line helper combining clsx (conditional class names) and tailwind-merge (deterministic resolution of conflicting Tailwind utilities). Same primitive shadcn ships."
      >
        <docs-section title="Why" anchor="why">
          <docs-prose>
            <p>
              When you build components with Tailwind, two problems show up constantly:
            </p>
            <ul class="ml-5 list-disc space-y-1">
              <li>You want to conditionally include classes based on state (<code>disabled</code>, <code>active</code>, etc.) — <code>clsx</code> solves this.</li>
              <li>You want consumers to override your base classes — <code>tailwind-merge</code> resolves <code>p-2 p-4</code> to <code>p-4</code>, instead of letting both win randomly.</li>
            </ul>
            <p><strong>cn()</strong> combines both in one call. Every ShadNG component uses it internally.</p>
          </docs-prose>
        </docs-section>

        <docs-section title="Import" anchor="import">
          <docs-code-block lang="typescript" [code]="importExample" />
        </docs-section>

        <docs-section title="Usage" anchor="usage">
          <docs-code-block lang="typescript" [code]="usage" />
        </docs-section>

        <docs-section title="Source" anchor="source">
          <docs-prose>
            <p>
              The whole implementation — type signature plus body. Steal it directly into your own
              code if you don't want the dependency. The peer deps (<code>clsx</code>,
              <code>tailwind-merge</code>) are small and well-maintained.
            </p>
          </docs-prose>
          <docs-code-block title="cn.ts" lang="typescript" [code]="source" />
        </docs-section>

        <docs-section title="When NOT to use" anchor="when-not">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li><strong>Static class strings</strong> — if your classes never change, a plain string literal is faster and clearer.</li>
              <li><strong>Non-Tailwind class names</strong> — <code>tailwind-merge</code> only understands Tailwind utilities. For BEM or other systems, use <code>clsx</code> directly.</li>
              <li><strong>Inline styles</strong> — <code>cn()</code> is for the <code>class</code> attribute. For dynamic CSS variables, use <code>[style.--var]</code> bindings.</li>
            </ul>
          </docs-prose>
        </docs-section>
      </docs-page>
    </docs-layout>
  `,
})
export default class CnPrimitivePage {
  protected readonly importExample = `import { cn } from '@kalvner/shadng-prompt-input';`;

  protected readonly usage = `// Conditional classes
const className = cn(
  'inline-flex items-center rounded-md',
  disabled && 'opacity-50 pointer-events-none',
  pressed && 'bg-accent',
);

// Tailwind conflict resolution
cn('p-2 p-4');                            // → 'p-4'
cn('text-sm text-base');                  // → 'text-base'
cn('bg-red-500', condition && 'bg-blue-500');  // → 'bg-blue-500' (if condition)

// Inside a component
@Component({
  template: \`<div [class]="hostClass()">…</div>\`,
})
export class Card {
  variant = input<'default' | 'ghost'>('default');

  hostClass = computed(() => cn(
    'rounded-md border',
    this.variant() === 'ghost' && 'border-transparent bg-transparent',
    this.variant() === 'default' && 'border-border bg-card',
  ));
}`;

  protected readonly source = `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}`;
}
