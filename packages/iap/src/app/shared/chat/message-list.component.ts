import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ScrollAreaImports } from '@shadng/scroll-area';
import { IapChatService } from '../../services/iap-chat.service';
import { ChatMessage } from './chat-message.component';
import { ThinkingIndicator } from './thinking-indicator.component';

@Component({
  selector: 'iap-message-list',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChatMessage, ThinkingIndicator, ScrollAreaImports],
  template: `
    <ng-scrollbar shadng appearance="compact" visibility="hover" class="flex-1">
      <div class="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-6">
        @for (message of chatService.messages(); track message.id) {
          <iap-chat-message [message]="message" />
        }

        @if (isStreaming()) {
          <div class="flex justify-start">
            <div class="max-w-[85%]">
              <iap-thinking-indicator
                [steps]="chatService.steps()"
                [done]="hasContent()"
              />
            </div>
          </div>
        }

        @if (chatService.error(); as errorMsg) {
          <div class="flex justify-center">
            <div class="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {{ errorMsg }}
            </div>
          </div>
        }

        <div #scrollEnd class="h-px shrink-0"></div>
      </div>
    </ng-scrollbar>
  `,
  host: { class: 'flex flex-1 flex-col overflow-hidden' },
})
export class MessageList {
  protected readonly chatService = inject(IapChatService);

  @ViewChild('scrollEnd')
  private readonly scrollEndRef?: ElementRef<HTMLDivElement>;

  protected readonly isStreaming = () =>
    this.chatService.inputState() === 'streaming' ||
    this.chatService.inputState() === 'submitted';

  protected readonly hasContent = () => {
    const msgs = this.chatService.messages();
    const last = msgs[msgs.length - 1];
    return last?.role === 'assistant' && last.content.length > 0;
  };

  constructor() {
    // Auto-scroll quando messages ou steps mudam
    effect(() => {
      this.chatService.messages();
      this.chatService.steps();
      this.scrollToBottom();
    });

    afterNextRender(() => this.scrollToBottom());
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      this.scrollEndRef?.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }
}
