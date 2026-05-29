import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';

import type { MessageAttachmentData } from './message.types';

/**
 * MessageAttachment — image preview or file chip. Mirrors React
 * `MessageAttachment`. Emits `(removed)` when the optional remove button is
 * clicked; consumers opt in by setting `[removable]="true"`.
 */
@Component({
  selector: 'message-attachment',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isImage()) {
      <img
        [src]="data().url"
        [alt]="label()"
        class="size-full object-cover"
        height="100"
        width="100"
      />
    } @else {
      <div
        class="flex size-full shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
        [attr.aria-label]="label()"
      >
        <!-- paperclip glyph (no icon-set dep) -->
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
        >
          <path d="m21 11-8.99 9a5.5 5.5 0 0 1-7.78-7.78l8.49-8.49a3.5 3.5 0 1 1 4.95 4.95L8.93 17.07a1.5 1.5 0 0 1-2.12-2.12l8.49-8.49" />
        </svg>
      </div>
    }
    @if (removable()) {
      <button
        type="button"
        (click)="handleRemove($event)"
        class="absolute top-2 right-2 inline-flex size-6 items-center justify-center rounded-full bg-background/80 p-0 opacity-0 backdrop-blur-sm transition-opacity hover:bg-background group-hover:opacity-100"
        aria-label="Remove attachment"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
        <span class="sr-only">Remove</span>
      </button>
    }
  `,
  host: {
    class: 'group relative size-24 overflow-hidden rounded-lg',
  },
})
export class MessageAttachment {
  readonly data = input.required<MessageAttachmentData>();
  readonly removable = input<boolean>(false);

  readonly removed = output<void>();

  protected readonly isImage = computed(() => {
    const d = this.data();
    return !!d.mediaType?.startsWith('image/') && !!d.url;
  });

  protected readonly label = computed(() => {
    const d = this.data();
    return d.filename || (this.isImage() ? 'Image' : 'Attachment');
  });

  protected handleRemove(event: MouseEvent): void {
    event.stopPropagation();
    this.removed.emit();
  }
}
