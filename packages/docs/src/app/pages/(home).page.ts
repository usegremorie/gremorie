import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DocsCodeBlock } from '../shared/code-block.component';
import { DocsLayout } from '../shared/doc-layout.component';

@Component({
  selector: 'docs-home',
  imports: [DocsLayout, DocsCodeBlock, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-layout>
      <div class="flex flex-col gap-12 pb-12">
        <section class="flex flex-col items-start gap-6 pt-8">
          <span class="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            v0.1.0 · pre-release
          </span>
          <h1 class="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            AI-native components<br />for Angular.
          </h1>
          <p class="max-w-prose text-base text-muted-foreground sm:text-lg">
            ShadNG is the Angular library of AI-native components that should exist but doesn't.
            Built on <a href="https://www.spartan.ng" target="_blank" rel="noopener" class="underline decoration-muted-foreground hover:decoration-foreground">spartan-ng</a>
            primitives, integrates cleanly with <a href="https://hashbrown.dev" target="_blank" rel="noopener" class="underline decoration-muted-foreground hover:decoration-foreground">Hashbrown</a>
            for LLM logic. Tribute to <a href="https://ui.shadcn.com" target="_blank" rel="noopener" class="underline decoration-muted-foreground hover:decoration-foreground">shadcn/ui</a>.
          </p>
          <div class="flex flex-wrap items-center gap-2">
            <a
              [routerLink]="['/docs/getting-started']"
              class="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get started
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-4">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a
              [routerLink]="['/docs/components/prompt-input']"
              class="inline-flex h-10 items-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Browse components
            </a>
            <a
              href="https://github.com/kalvner/shadng"
              target="_blank"
              rel="noopener"
              class="inline-flex h-10 items-center gap-1.5 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="size-4">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39.98 0 1.97.13 2.89.39 2.2-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.4-5.25 5.69.41.35.78 1.05.78 2.11v3.13c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z"/>
              </svg>
              GitHub
            </a>
          </div>
        </section>

        <section class="grid gap-4 sm:grid-cols-3">
          <div class="rounded-lg border border-border bg-card p-5">
            <h3 class="font-semibold text-foreground">10 components</h3>
            <p class="mt-1 text-sm text-muted-foreground">
              Full PromptInput family — container, textarea, toolbar, attachments, model select, and submit with 4 states.
            </p>
          </div>
          <div class="rounded-lg border border-border bg-card p-5">
            <h3 class="font-semibold text-foreground">Streaming-aware</h3>
            <p class="mt-1 text-sm text-muted-foreground">
              Built around an explicit <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">ready → submitted → streaming → error</code> state machine.
            </p>
          </div>
          <div class="rounded-lg border border-border bg-card p-5">
            <h3 class="font-semibold text-foreground">Bring your own state</h3>
            <p class="mt-1 text-sm text-muted-foreground">
              Inputs accept signals from Hashbrown, Vercel AI SDK, NgRx, or plain <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">fetch()</code>.
            </p>
          </div>
        </section>

        <section class="flex flex-col gap-3">
          <h2 class="text-xl font-semibold tracking-tight text-foreground">Install</h2>
          <docs-code-block
            lang="bash"
            code="npm install @kalvner/shadng-prompt-input"
          />
          <p class="text-sm text-muted-foreground">
            Then import the components you need:
          </p>
          <docs-code-block
            lang="typescript"
            [code]="importExample"
          />
        </section>
      </div>
    </docs-layout>
  `,
})
export default class HomePage {
  protected readonly importExample = `import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputToolbar,
} from '@kalvner/shadng-prompt-input';`;
}
