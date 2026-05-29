import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { BrnCollapsibleTrigger } from '@spartan-ng/brain/collapsible';

import { Shimmer } from '../shimmer/shimmer';
import { REASONING } from './reasoning';

/**
 * ReasoningTrigger — clickable header for the Reasoning collapsible.
 *
 * Default text follows React `defaultGetThinkingMessage`:
 * - "Thinking…" (shimmered) while streaming or duration is 0
 * - "Thought for a few seconds" when duration is undefined
 * - "Thought for {duration} seconds" otherwise
 *
 * Project custom children to fully override.
 */
@Component({
  selector: 'reasoning-trigger',
  standalone: true,
  imports: [BrnCollapsibleTrigger, Shimmer],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      brnCollapsibleTrigger
      class="flex w-full items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
    >
      <ng-content>
        <!-- brain icon -->
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
          <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
          <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
          <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
        </svg>
        @if (showShimmer()) {
          <span ngShimmer [shimmerDuration]="1">Thinking…</span>
        } @else {
          <p>{{ label() }}</p>
        }
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
          [class.rotate-180]="open()"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </ng-content>
    </button>
  `,
})
export class ReasoningTrigger {
  private readonly state = inject(REASONING);

  protected readonly open = computed(() => this.state.isOpen());
  protected readonly showShimmer = computed(() => {
    const d = this.state.duration();
    return this.state.isStreaming() || d === 0;
  });

  protected readonly label = computed(() => {
    const d = this.state.duration();
    if (d === undefined) return 'Thought for a few seconds';
    return `Thought for ${d} seconds`;
  });
}
