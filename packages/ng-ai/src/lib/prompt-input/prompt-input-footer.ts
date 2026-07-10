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
/**
 * Base classes of the React `InputGroupAddon` (rx-forms) plus its
 * `block-end` alignment variant. Keep in lock-step with
 * `packages/rx-forms/src/lib/input-group/input-group.tsx`.
 */
const ADDON_BASE =
  "text-muted-foreground flex h-auto cursor-text select-none items-center justify-center gap-2 py-1.5 text-sm font-medium group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4";
const ADDON_BLOCK_END =
  '[.border-t]:pt-3 order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5';

@Component({
  selector: 'prompt-input-footer',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'prompt-input-footer',
    'data-align': 'block-end',
    '[class]': 'hostClass()',
  },
})
export class PromptInputFooter {
  readonly class = input<string>('');
  protected readonly hostClass = computed(() =>
    cn(ADDON_BASE, ADDON_BLOCK_END, 'justify-between gap-1', this.class()),
  );
}
