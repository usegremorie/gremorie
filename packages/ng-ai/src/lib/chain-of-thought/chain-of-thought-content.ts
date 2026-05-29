import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';

import { CHAIN_OF_THOUGHT } from './chain-of-thought';

/**
 * ChainOfThoughtContent — collapsible body that holds the step list.
 *
 * Renders only when the chain is open. Mirrors React
 * `ChainOfThoughtContent`. Lightweight (no JS collapse animation — relies
 * on Tailwind's `animate-in/out` utilities + visibility toggle).
 */
@Component({
  selector: 'chain-of-thought-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div
        class="mt-2 space-y-3 text-popover-foreground outline-none animate-in slide-in-from-top-2"
      >
        <ng-content />
      </div>
    }
  `,
})
export class ChainOfThoughtContent {
  private readonly state = inject(CHAIN_OF_THOUGHT);
  protected readonly open = computed(() => this.state.isOpen());
}
