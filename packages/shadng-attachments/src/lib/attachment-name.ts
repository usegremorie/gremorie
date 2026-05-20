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
 */
@Component({
  selector: 'attachment-name',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="truncate text-sm text-foreground" [attr.title]="label()">{{ label() }}</span>`,
})
export class AttachmentName {
  protected readonly parent = inject(AttachmentItem);

  protected readonly label = computed(() => this.parent.label());
}
