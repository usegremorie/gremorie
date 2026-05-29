import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';

import { SOURCES } from './sources';

/**
 * SourcesContent — collapsible body. Mirrors React `SourcesContent`.
 */
@Component({
  selector: 'sources-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div
        class="mt-3 flex w-fit flex-col gap-2 outline-none animate-in slide-in-from-top-2"
      >
        <ng-content />
      </div>
    }
  `,
})
export class SourcesContent {
  private readonly state = inject(SOURCES);
  protected readonly open = computed(() => this.state.isOpen());
}
