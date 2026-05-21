import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@shadng/core';
import type { IapMessage } from '../../services/iap-chat.service';

@Component({
  selector: 'iap-chat-message',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="wrapperClass()">
      <div [class]="bubbleClass()">
        <p class="whitespace-pre-wrap break-words text-sm leading-relaxed">{{ message().content }}<span
            aria-hidden="true"
            [class]="cursorClass()"
          >▋</span></p>
      </div>
    </div>
  `,
})
export class ChatMessage {
  readonly message = input.required<IapMessage>();

  protected readonly isUser = computed(() => this.message().role === 'user');
  protected readonly isStreaming = computed(() => this.message().streaming);

  protected readonly wrapperClass = computed(() =>
    cn('flex w-full', this.isUser() ? 'justify-end' : 'justify-start'),
  );

  protected readonly bubbleClass = computed(() =>
    cn(
      'max-w-[75%] rounded-2xl px-4 py-2.5',
      this.isUser()
        ? 'rounded-br-sm bg-primary text-primary-foreground'
        : 'rounded-bl-sm bg-transparent text-foreground',
    ),
  );

  protected readonly cursorClass = computed(() =>
    cn(
      'ml-0.5 inline-block text-current',
      this.isStreaming() ? 'animate-pulse' : 'hidden',
    ),
  );
}
