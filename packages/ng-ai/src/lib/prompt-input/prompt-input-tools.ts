import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { cn } from '@gremorie/ng-core';

@Component({
  selector: 'prompt-input-tools',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    role: 'group',
    '[attr.aria-label]': '"Prompt actions"',
    '[class]': 'hostClass()',
  },
})
export class PromptInputTools {
  // Mirrors React `PromptInputTools` exactly: a hugging flex row. The footer
  // (justify-between) spaces the left and right groups; Tools itself must NOT
  // stretch, or the icon cluster drifts away from the submit button.
  /** Extra classes merged via `cn` (e.g. `gap-0` for a ghost icon group). Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly hostClass = computed(() =>
    cn('flex items-center gap-1', this.class()),
  );
}
