import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { cn } from '@gremorie/ng-core';

/**
 * PromptInputHeader — the top addon row of the composer.
 *
 * Mirrors React `PromptInputHeader` (an `InputGroupAddon align="block-start"`):
 * a wrapping flex row that hosts header affordances such as the "@ Add context"
 * mentions button and the Context token-usage trigger. Must be a SIBLING of
 * `<prompt-input-body>`, not nested inside it.
 */
@Component({
  selector: 'prompt-input-header',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'prompt-input-header',
    '[class]': 'hostClass()',
  },
})
export class PromptInputHeader {
  readonly class = input<string>('');
  protected readonly hostClass = computed(() =>
    cn('flex w-full flex-wrap items-center gap-1', this.class()),
  );
}
