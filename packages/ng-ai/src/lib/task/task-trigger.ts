import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { TASK } from './task';

/**
 * TaskTrigger — clickable header. Mirrors React `TaskTrigger`. Default
 * visual: search icon + title + rotating chevron.
 */
@Component({
  selector: 'task-trigger',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      (click)="toggle()"
      [attr.aria-expanded]="open()"
      class="group flex w-full cursor-pointer items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
    >
      <ng-content>
        <!-- SearchIcon -->
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <p class="text-sm">{{ title() }}</p>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          class="size-4 transition-transform"
          [class.rotate-180]="open()"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </ng-content>
    </button>
  `,
})
export class TaskTrigger {
  readonly title = input.required<string>();

  private readonly state = inject(TASK);
  protected readonly open = computed(() => this.state.isOpen());

  protected toggle(): void {
    this.state.toggle();
  }
}
