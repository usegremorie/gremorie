import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { cn } from './utils';

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
  protected readonly hostClass = cn(
    'flex flex-1 items-center gap-1',
  );
}
