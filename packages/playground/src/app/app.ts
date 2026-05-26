import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { PromptInputDemo } from './prompt-input-demo';
import { ChartsDemo } from './charts-demo';

@Component({
  imports: [PromptInputDemo, ChartsDemo],
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="mx-auto flex max-w-5xl flex-col gap-6 p-8">
      <header class="flex flex-col gap-2">
        <h1 class="text-3xl font-semibold tracking-tight text-foreground">
          {{ title }}
        </h1>
        <p class="text-muted-foreground">
          Visual smoke test of <code class="font-mono">@gremorie/ng-prompt-input</code> —
          the four states of <code class="font-mono">PromptInput</code>.
        </p>
      </header>

      <app-charts-demo />

      <app-prompt-input-demo
        label="Ready"
        description="Default state. User can type and submit (Enter or click)."
        initialState="ready"
      />

      <app-prompt-input-demo
        label="Submitted"
        description="Message sent, waiting for first chunk. Submit shows a spinner."
        initialState="submitted"
      />

      <app-prompt-input-demo
        label="Streaming"
        description="Receiving chunks. Submit becomes a stop button (destructive tint)."
        initialState="streaming"
      />

      <app-prompt-input-demo
        label="Error"
        description="Last submit failed. Border turns destructive, submit becomes retry."
        initialState="error"
      />

      <footer class="pt-4 text-xs text-muted-foreground">
        <p>
          Press <kbd class="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">Mod+K</kbd>
          to focus the first textarea globally.
        </p>
      </footer>
    </main>
  `,
})
export class App {
  protected readonly title = 'Gremorie NG — Playground';

  // Placeholder reactive state to keep change detection lively.
  protected readonly hash = signal(Date.now());
}
