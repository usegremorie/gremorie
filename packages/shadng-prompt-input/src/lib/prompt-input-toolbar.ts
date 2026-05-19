import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { cn } from './utils';

@Component({
  selector: 'prompt-input-toolbar',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    role: 'toolbar',
    '[class]': 'hostClass',
  },
})
export class PromptInputToolbar {
  protected readonly hostClass = cn(
    'flex w-full items-center gap-2',
    // Light separation from the textarea above without a hard border line.
    'pt-1',
  );
}
