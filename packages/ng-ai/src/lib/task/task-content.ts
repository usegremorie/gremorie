import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';

import { TASK } from './task';

/**
 * TaskContent — collapsible body for a Task. Mirrors React `TaskContent`.
 */
@Component({
  selector: 'task-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div
        class="mt-4 space-y-2 border-muted border-l-2 pl-4 text-popover-foreground outline-none animate-in slide-in-from-top-2"
      >
        <ng-content />
      </div>
    }
  `,
})
export class TaskContent {
  private readonly state = inject(TASK);
  protected readonly open = computed(() => this.state.isOpen());
}
