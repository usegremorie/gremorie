import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';

import type { MessageRole } from './message.types';

/**
 * Message — root container for a chat bubble.
 *
 * Mirrors React `Message` from rx-ai. The `from` input drives the
 * `is-user` / `is-assistant` group classes that descendants
 * (`MessageContent`) read with `group-[.is-user]:*` Tailwind variants.
 *
 * @example
 * ```html
 * <message from="user">
 *   <message-content>Hello!</message-content>
 * </message>
 * ```
 */
@Component({
  selector: 'message',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    '[class]': 'hostClass()',
  },
})
export class Message {
  readonly from = input.required<MessageRole>();

  protected readonly hostClass = computed(() =>
    cn(
      'group flex w-full max-w-[95%] flex-col gap-2',
      this.from() === 'user' ? 'is-user ml-auto justify-end' : 'is-assistant',
    ),
  );
}
