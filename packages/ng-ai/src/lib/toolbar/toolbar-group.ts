import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';

/**
 * ToolbarGroup — visually-grouped subset of toolbar buttons (gap collapsed,
 * shared borders).
 */
@Component({
  selector: 'toolbar-group',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    role: 'group',
    '[class]': 'hostClass()',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class ToolbarGroup {
  readonly ariaLabel = input<string>();
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  protected readonly hostClass = computed(() =>
    cn(
      'inline-flex items-center',
      this.orientation() === 'horizontal' ? 'flex-row gap-0.5' : 'flex-col gap-0.5',
    ),
  );
}
