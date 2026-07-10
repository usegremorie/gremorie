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
/**
 * Base classes of the React `InputGroupAddon` (rx-forms) plus its
 * `block-start` alignment variant. Keep in lock-step with
 * `packages/rx-forms/src/lib/input-group/input-group.tsx`.
 */
const ADDON_BASE =
  "text-muted-foreground flex h-auto cursor-text select-none items-center justify-center gap-2 py-1.5 text-sm font-medium group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4";
const ADDON_BLOCK_START =
  '[.border-b]:pb-3 order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5';

@Component({
  selector: 'prompt-input-header',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'prompt-input-header',
    'data-align': 'block-start',
    '[class]': 'hostClass()',
  },
})
export class PromptInputHeader {
  readonly class = input<string>('');
  protected readonly hostClass = computed(() =>
    cn(ADDON_BASE, ADDON_BLOCK_START, 'flex-wrap gap-1', this.class()),
  );
}
