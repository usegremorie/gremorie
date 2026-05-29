import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { MESSAGE_BRANCH } from './message-branch';
import type { MessageRole } from './message.types';

/**
 * MessageBranchSelector — wrapper for the prev/next/page controls. Hides
 * itself when there is only one branch. Mirrors React `MessageBranchSelector`.
 */
@Component({
  selector: 'message-branch-selector',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div
        class="inline-flex items-center [&>*:not(:first-child)]:rounded-l-md [&>*:not(:last-child)]:rounded-r-md"
      >
        <ng-content />
      </div>
    }
  `,
})
export class MessageBranchSelector {
  readonly from = input.required<MessageRole>();

  private readonly state = inject(MESSAGE_BRANCH);
  protected readonly visible = computed(() => this.state.totalBranches() > 1);
}
