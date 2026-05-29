import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';

import { CHAIN_OF_THOUGHT } from './chain-of-thought';

/**
 * ChainOfThoughtHeader — clickable header that toggles the chain.
 *
 * Mirrors React `ChainOfThoughtHeader`. Renders BrainIcon + label +
 * rotating chevron.
 */
@Component({
  selector: 'chain-of-thought-header',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      (click)="toggle()"
      class="flex w-full items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
      [attr.aria-expanded]="isOpen()"
    >
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
        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
        <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      </svg>
      <span class="flex-1 text-left">
        <ng-content>Chain of Thought</ng-content>
      </span>
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
        class="transition-transform"
        [class.rotate-180]="isOpen()"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  `,
})
export class ChainOfThoughtHeader {
  private readonly state = inject(CHAIN_OF_THOUGHT);
  protected readonly isOpen = computed(() => this.state.isOpen());

  protected toggle(): void {
    this.state.toggle();
  }
}
