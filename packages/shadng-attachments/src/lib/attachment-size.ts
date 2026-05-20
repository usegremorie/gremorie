import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';

import { AttachmentItem } from './attachment-item';
import { formatFileSize } from './attachment.utils';

/**
 * Formatted byte size. Hidden when the data has no `size` field.
 */
@Component({
  selector: 'attachment-size',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (formatted(); as size) {{{ size }}}`,
  host: {
    class: 'text-xs text-muted-foreground',
    '[hidden]': '!formatted()',
  },
})
export class AttachmentSize {
  protected readonly parent = inject(AttachmentItem);

  protected readonly formatted = computed(() => {
    const size = this.parent.data().size;
    if (size === undefined) return null;
    return formatFileSize(size);
  });
}
