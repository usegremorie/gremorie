import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Empty-state placeholder. Render inside an {@link AttachmentList}
 * (typically gated by `@if (items.length === 0)`) to communicate
 * "no files yet" — useful in upload-first UIs.
 */
@Component({
  selector: 'attachment-empty',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      class="size-6 opacity-60"
    >
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 17.93 8.8l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
    <ng-content>
      <p class="text-sm">No attachments yet.</p>
    </ng-content>
  `,
  host: {
    class:
      'flex w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 px-4 py-6 text-center text-muted-foreground',
  },
})
export class AttachmentEmpty {}
