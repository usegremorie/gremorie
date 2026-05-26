import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';

import { AttachmentItem } from './attachment-item';

/**
 * Filename only — finer-grained than {@link AttachmentInfo}. Use when
 * you want full control over layout (e.g. wrap with a custom badge).
 *
 * Host display adapts to the parent variant: `flex-1` in row-flex
 * (`inline`/`list`), `w-full` in column-flex (`grid`).
 */
@Component({
  selector: 'attachment-name',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ label() }}`,
  host: {
    '[class]': 'hostClass()',
    '[attr.title]': 'label()',
  },
})
export class AttachmentName {
  protected readonly parent = inject(AttachmentItem);

  protected readonly label = computed(() => this.parent.label());

  protected readonly hostClass = computed(() => {
    const variant = this.parent.resolvedVariant();
    const base = 'block min-w-0 truncate text-sm text-foreground';
    return variant === 'grid' ? `${base} w-full` : `${base} flex-1`;
  });
}
