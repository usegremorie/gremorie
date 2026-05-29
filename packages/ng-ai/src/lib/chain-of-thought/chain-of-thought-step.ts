import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';

export type ChainOfThoughtStepStatus = 'complete' | 'active' | 'pending';

/**
 * ChainOfThoughtStep — one row in the chain. Mirrors React
 * `ChainOfThoughtStep`.
 *
 * Status drives muted/foreground color treatment. Label + optional
 * description are inputs; deeper content (e.g. search results) can be
 * projected after them.
 */
@Component({
  selector: 'chain-of-thought-step',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative mt-0.5">
      <!-- dot icon -->
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <circle cx="12.1" cy="12.1" r="1" />
      </svg>
      <div class="-mx-px absolute top-7 bottom-0 left-1/2 w-px bg-border"></div>
    </div>
    <div class="flex-1 space-y-2 overflow-hidden">
      <div>{{ label() }}</div>
      @if (description()) {
        <div class="text-muted-foreground text-xs">{{ description() }}</div>
      }
      <ng-content />
    </div>
  `,
  host: {
    '[class]': 'hostClass()',
  },
})
export class ChainOfThoughtStep {
  readonly label = input.required<string>();
  readonly description = input<string>();
  readonly status = input<ChainOfThoughtStepStatus>('complete');

  protected readonly hostClass = computed(() => {
    const statusStyles: Record<ChainOfThoughtStepStatus, string> = {
      complete: 'text-muted-foreground',
      active: 'text-foreground',
      pending: 'text-muted-foreground/50',
    };
    return cn(
      'flex gap-2 text-sm animate-in fade-in-0 slide-in-from-top-2',
      statusStyles[this.status()],
    );
  });
}
