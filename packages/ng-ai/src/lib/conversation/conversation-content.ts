import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

/**
 * ConversationContent — inner flex column for the message list.
 *
 * Mirrors React `ConversationContent`. Visual sibling of the scroll button.
 */
@Component({
  selector: 'conversation-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'flex flex-col gap-8 p-4',
  },
})
export class ConversationContent {}
