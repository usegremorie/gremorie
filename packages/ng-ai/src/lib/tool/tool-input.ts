import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

/**
 * ToolInput — labelled JSON block showing the tool's parameters. Mirrors
 * React `ToolInput`. Uses a `<pre><code>` JSON snapshot instead of the
 * project-internal CodeBlock to keep this primitive self-contained; if
 * syntax highlighting is desired, consumers can swap in `<code-block>`
 * (also part of ng-ai) externally.
 */
@Component({
  selector: 'tool-input',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4
      class="font-medium text-muted-foreground text-xs uppercase tracking-wide"
    >
      Parameters
    </h4>
    <div class="rounded-md bg-muted/50 overflow-auto">
      <pre class="m-0 p-4 text-xs"><code>{{ formatted() }}</code></pre>
    </div>
  `,
  host: {
    class: 'space-y-2 overflow-hidden p-4 block',
  },
})
export class ToolInput {
  readonly value = input<unknown>(null, { alias: 'input' });

  protected readonly formatted = computed(() => {
    try {
      return JSON.stringify(this.value(), null, 2);
    } catch {
      return String(this.value());
    }
  });
}
