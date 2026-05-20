import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { cn } from '@shadng/core';

@Component({
  selector: 'prompt-input-attachments',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    role: 'list',
    '[attr.aria-label]': '"Attached files"',
    '[class]': 'hostClass',
  },
})
export class PromptInputAttachments {
  protected readonly hostClass = cn('flex flex-wrap gap-2');
}
