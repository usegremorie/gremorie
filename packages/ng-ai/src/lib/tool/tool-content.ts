import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';

import { TOOL } from './tool';

/**
 * ToolContent — collapsible body. Mirrors React `ToolContent`.
 */
@Component({
  selector: 'tool-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div
        class="text-popover-foreground outline-none animate-in slide-in-from-top-2"
      >
        <ng-content />
      </div>
    }
  `,
})
export class ToolContent {
  private readonly host = inject(TOOL);
  protected readonly open = computed(() => this.host.isOpen());
}
