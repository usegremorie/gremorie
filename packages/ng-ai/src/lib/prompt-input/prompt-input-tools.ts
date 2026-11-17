import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { cn } from '@gremorie/ng-core';

export type PromptInputToolsCollapse = 'auto' | 'always' | 'never';

@Component({
  selector: 'prompt-input-tools',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    role: 'group',
    '[attr.aria-label]': '"Prompt actions"',
    '[attr.data-collapse]': 'collapse()',
    '[class]': 'hostClass()',
  },
})
export class PromptInputTools {
  // Mirrors React `PromptInputTools` exactly: a hugging flex row. The footer
  // (justify-between) spaces the left and right groups; Tools itself must NOT
  // stretch, or the icon cluster drifts away from the submit button.
  /** Extra classes merged via `cn` (e.g. `gap-0` for a ghost icon group). Mirrors React `className`. */
  readonly class = input<string>('');

  /**
   * How the tools fit the composer. `auto` (default) shows them inline and
   * swaps to the overflow menu when the composer is narrower than 28rem;
   * `never` always shows them inline; `always` always uses the menu.
   * Mirrors React `collapse`.
   */
  readonly collapse = input<PromptInputToolsCollapse>('auto');

  protected readonly hostClass = computed(() =>
    cn('group/prompt-input-tools flex items-center gap-1', this.class()),
  );
}

/** The tools shown inline. Hidden while `prompt-input-tools` is collapsed. Mirrors React `PromptInputToolsExpanded`. */
@Component({
  selector: 'prompt-input-tools-expanded',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'prompt-input-tools-expanded',
    class:
      'contents group-data-[collapse=always]/prompt-input-tools:hidden group-data-[collapse=auto]/prompt-input-tools:@max-md/prompt-input:hidden',
  },
})
export class PromptInputToolsExpanded {}

/** The overflow menu that replaces the inline tools while collapsed. Mirrors React `PromptInputToolsCollapsed`. */
@Component({
  selector: 'prompt-input-tools-collapsed',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'prompt-input-tools-collapsed',
    class:
      'hidden group-data-[collapse=always]/prompt-input-tools:contents group-data-[collapse=auto]/prompt-input-tools:@max-md/prompt-input:contents',
  },
})
export class PromptInputToolsCollapsed {}
