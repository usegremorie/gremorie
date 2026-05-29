import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';
import { CodeBlock } from '../code-block/code-block';

/**
 * ToolOutput — labelled body showing either the result or an error. Mirrors
 * React `ToolOutput`. Auto-formats object output as JSON; string output is
 * rendered via the same code-block highlighter (json language) so the
 * surface stays consistent with rx-ai which routes both through CodeBlock.
 *
 * Errors are rendered as plain text inside a destructive-tinted container
 * (no highlight) since they are not structured data.
 *
 * When both inputs are empty, renders nothing (matches React behavior).
 */
@Component({
  selector: 'tool-output',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeBlock],
  template: `
    @if (visible()) {
      <h4
        class="font-medium text-muted-foreground text-xs uppercase tracking-wide"
      >
        {{ heading() }}
      </h4>
      <div [class]="bodyClass()">
        @if (errorText()) {
          <div class="p-4 text-xs">{{ errorText() }}</div>
        }
        @if (hasOutput()) {
          <code-block [code]="formatted()" language="json" />
        }
      </div>
    }
  `,
  host: {
    '[class]': 'hostClass()',
  },
})
export class ToolOutput {
  readonly output = input<unknown>(null);
  readonly errorText = input<string | null | undefined>(null);

  protected readonly hasOutput = computed(() => {
    const o = this.output();
    return o !== null && o !== undefined && o !== '';
  });

  protected readonly visible = computed(
    () => this.hasOutput() || !!this.errorText(),
  );

  protected readonly heading = computed(() =>
    this.errorText() ? 'Error' : 'Result',
  );

  protected readonly hostClass = computed(() =>
    cn('space-y-2 p-4', !this.visible() && 'hidden'),
  );

  protected readonly bodyClass = computed(() =>
    cn(
      'overflow-x-auto rounded-md text-xs [&_table]:w-full',
      this.errorText()
        ? 'bg-destructive/10 text-destructive'
        : 'bg-muted/50 text-foreground',
    ),
  );

  protected readonly formatted = computed(() => {
    const o = this.output();
    if (o === null || o === undefined) return '';
    if (typeof o === 'string') return o;
    try {
      return JSON.stringify(o, null, 2);
    } catch {
      return String(o);
    }
  });
}
