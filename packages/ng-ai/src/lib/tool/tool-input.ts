import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { CodeBlock } from '@gremorie/ng-artifacts';

/**
 * ToolInput — labelled JSON block showing the tool's parameters. Mirrors
 * React `ToolInput`, which renders its content via the shared `CodeBlock`
 * (Shiki-highlighted). This Angular version dogfoods the ng-ai
 * `<code-block>` primitive directly with `language="json"`.
 */
@Component({
  selector: 'tool-input',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeBlock],
  template: `
    <h4
      class="font-medium text-muted-foreground text-xs uppercase tracking-wide"
    >
      Parameters
    </h4>
    <div class="rounded-md bg-muted/50 overflow-auto">
      <code-block [code]="formatted()" language="json" />
    </div>
  `,
  host: {
    class: 'space-y-2 overflow-hidden p-4 block',
  },
})
export class ToolInput {
  // Public binding is `input` (mirrors the AI Elements ToolInput prop); the
  // internal field keeps `value` to avoid shadowing Angular's `input()`.
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly value = input<unknown>(null, { alias: 'input' });

  protected readonly formatted = computed(() => {
    try {
      return JSON.stringify(this.value(), null, 2);
    } catch {
      return String(this.value());
    }
  });
}
