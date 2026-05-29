import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

/**
 * MessageActions — row of icon buttons (copy, retry, thumbs, etc.).
 */
@Component({
  selector: 'message-actions',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'flex items-center gap-1',
  },
})
export class MessageActions {}
