import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';

import { MESSAGE_BRANCH } from './message-branch';

/**
 * MessageBranchPrevious — "previous branch" icon button. Disabled when there
 * is only one branch. Mirrors React `MessageBranchPrevious`.
 */
@Component({
  selector: 'message-branch-previous',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
      aria-label="Previous branch"
      [disabled]="disabled()"
      (click)="prev()"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
    </button>
  `,
})
export class MessageBranchPrevious {
  private readonly state = inject(MESSAGE_BRANCH);
  protected readonly disabled = computed(() => this.state.totalBranches() <= 1);

  protected prev(): void {
    this.state.goToPrevious();
  }
}

/**
 * MessageBranchNext — "next branch" icon button. Disabled when there is only
 * one branch. Mirrors React `MessageBranchNext`.
 */
@Component({
  selector: 'message-branch-next',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
      aria-label="Next branch"
      [disabled]="disabled()"
      (click)="next()"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </button>
  `,
})
export class MessageBranchNext {
  private readonly state = inject(MESSAGE_BRANCH);
  protected readonly disabled = computed(() => this.state.totalBranches() <= 1);

  protected next(): void {
    this.state.goToNext();
  }
}

/**
 * MessageBranchPage — "X of Y" pagination label. Mirrors React
 * `MessageBranchPage`.
 */
@Component({
  selector: 'message-branch-page',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span>{{ label() }}</span>`,
  host: {
    class:
      'inline-flex items-center px-2 text-muted-foreground text-xs font-medium',
  },
})
export class MessageBranchPage {
  private readonly state = inject(MESSAGE_BRANCH);
  protected readonly label = computed(
    () => `${this.state.currentBranch() + 1} of ${this.state.totalBranches()}`,
  );
}
