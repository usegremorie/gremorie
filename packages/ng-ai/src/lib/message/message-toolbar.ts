import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

/**
 * MessageToolbar — full-width toolbar row under the message body. Holds
 * actions on the left and metadata on the right.
 */
@Component({
  selector: 'message-toolbar',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'mt-4 flex w-full items-center justify-between gap-4',
  },
})
export class MessageToolbar {}
