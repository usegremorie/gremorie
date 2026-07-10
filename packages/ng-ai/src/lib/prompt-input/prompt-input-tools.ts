import {
  ChangeDetectionStrategy,
  Component,
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
    '[class]': 'hostClass',
  },
})
export class PromptInputTools {
  // Mirrors React `PromptInputTools` exactly: a hugging flex row. The footer
  // (justify-between) spaces the left and right groups; Tools itself must NOT
  // stretch, or the icon cluster drifts away from the submit button.
  protected readonly hostClass = cn('flex items-center gap-1');
}
