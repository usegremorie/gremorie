import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

/**
 * MessageAttachments — wrap-flex container for `<message-attachment>` items
 * inside a message bubble.
 */
@Component({
  selector: 'message-attachments',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'ml-auto flex w-fit flex-wrap items-start gap-2',
  },
})
export class MessageAttachments {}
