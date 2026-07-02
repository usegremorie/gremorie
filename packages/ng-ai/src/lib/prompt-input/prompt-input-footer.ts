import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { cn } from '@gremorie/ng-core';

/**
 * PromptInputFooter — the bottom addon row of the composer (a.k.a. the toolbar).
 *
 * Mirrors React `PromptInputFooter` (an `InputGroupAddon align="block-end"`): a
 * spaced row that hosts the mode/model selects on the left and the web-search /
 * attach / speech / submit affordances on the right. Must be a SIBLING of
 * `<prompt-input-body>`, never nested inside it — see the `display:contents`
 * gotcha in `docs/anatomy/assistant.md`.
 */
@Component({
  selector: 'prompt-input-footer',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'prompt-input-footer',
    '[class]': 'hostClass()',
  },
})
export class PromptInputFooter {
  readonly class = input<string>('');
  protected readonly hostClass = computed(() =>
    cn('flex w-full items-center justify-between gap-1', this.class()),
  );
}
