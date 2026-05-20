import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { cn } from '@shadng/core';

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
  // flex-1 lets Tools occupy remaining space inside the toolbar,
  // which naturally pushes the submit button to the right edge.
  // flex-wrap keeps items readable on narrow viewports.
  protected readonly hostClass = cn(
    'flex flex-1 flex-wrap items-center gap-1',
  );
}
