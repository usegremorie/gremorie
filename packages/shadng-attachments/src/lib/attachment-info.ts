import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { AttachmentItem } from './attachment-item';
import { formatFileSize } from './attachment.utils';

/**
 * Filename + optional secondary line (media type or size). Auto-truncates
 * long names with ellipsis. Tooltip exposes the full filename.
 */
@Component({
  selector: 'attachment-info',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex min-w-0 flex-1 flex-col">
      <span class="truncate text-sm text-foreground" [attr.title]="label()">
        {{ label() }}
      </span>
      @if (secondary(); as line) {
        <span class="truncate text-xs text-muted-foreground">{{ line }}</span>
      }
    </div>
  `,
})
export class AttachmentInfo {
  protected readonly parent = inject(AttachmentItem);

  readonly showMediaType = input<boolean>(false);
  readonly showSize = input<boolean>(true);

  protected readonly label = computed(() => this.parent.label());

  protected readonly secondary = computed<string | null>(() => {
    const data = this.parent.data();
    const parts: string[] = [];
    if (this.showMediaType() && data.mediaType) {
      parts.push(data.mediaType);
    }
    if (this.showSize() && data.size !== undefined) {
      parts.push(formatFileSize(data.size));
    }
    if (parts.length === 0) return null;
    return parts.join(' · ');
  });
}
