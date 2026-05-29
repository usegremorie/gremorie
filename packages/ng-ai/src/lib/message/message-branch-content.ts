import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  inject,
  ViewEncapsulation,
} from '@angular/core';

import { MESSAGE_BRANCH } from './message-branch';
import { MessageBranchItem } from './message-branch';

/**
 * MessageBranchContent — renders only the currently active branch template.
 *
 * Children are wrapped with `[messageBranchItem]` directives so the parent
 * MessageBranch can index them. Mirrors React `MessageBranchContent`.
 */
@Component({
  selector: 'message-branch-content',
  standalone: true,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (item of items(); track $index) {
      <div
        class="grid gap-2 overflow-hidden [&>div]:pb-0"
        [class.hidden]="$index !== current()"
      >
        <ng-container *ngTemplateOutlet="item.template" />
      </div>
    }
  `,
})
export class MessageBranchContent {
  protected readonly state = inject(MESSAGE_BRANCH);
  protected readonly items = contentChildren(MessageBranchItem, {
    descendants: true,
  });
  protected readonly current = computed(() => this.state.currentBranch());
}
