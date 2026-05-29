import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { SOURCES } from './sources';

/**
 * SourcesTrigger — header that toggles the citations list. Mirrors React
 * `SourcesTrigger`. Default text: "Used {count} sources" + chevron.
 */
@Component({
  selector: 'sources-trigger',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      (click)="toggle()"
      [attr.aria-expanded]="open()"
      class="flex items-center gap-2"
    >
      <ng-content>
        <p class="font-medium">Used {{ count() }} sources</p>
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
export class SourcesTrigger {
  readonly count = input.required<number>();

  private readonly state = inject(SOURCES);
  protected readonly open = computed(() => this.state.isOpen());

  protected toggle(): void {
    this.state.toggle();
  }
}
