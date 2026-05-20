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
 *
 * Host display adapts to the parent variant — in row-flex parents
 * (`inline`, `list`) it claims remaining space; in column-flex (`grid`)
 * it spans full width.
 */
@Component({
  selector: 'attachment-info',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="truncate text-sm leading-tight text-foreground" [attr.title]="label()">
      {{ label() }}
    </span>
    @if (secondary(); as line) {
      <span class="truncate text-xs leading-tight text-muted-foreground">{{ line }}</span>
    }
  `,
  host: {
    '[class]': 'hostClass()',
  },
})
export class AttachmentInfo {
  protected readonly parent = inject(AttachmentItem);

  readonly showMediaType = input<boolean>(false);
  readonly showSize = input<boolean>(true);

  protected readonly label = computed(() => this.parent.label());

  protected readonly hostClass = computed(() => {
    const variant = this.parent.resolvedVariant();
    const base = 'flex min-w-0 flex-col gap-0.5';
    if (variant === 'grid') {
      // Column-flex parent — span the card width, don't stretch vertically.
      return `${base} w-full pt-1`;
    }
    // Row-flex parent — fill remaining horizontal space.
    return `${base} flex-1`;
  });

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
