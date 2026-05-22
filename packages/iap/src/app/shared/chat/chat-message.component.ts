import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { cn } from '@shadng/core';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import type { IapMessage } from '../../services/iap-chat.service';

@Component({
  selector: 'iap-chat-message',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="wrapperClass()">
      <div [class]="bubbleClass()">
        @if (isUser()) {
          <p class="whitespace-pre-wrap break-words text-sm leading-relaxed">{{ message().content }}</p>
        } @else {
          <div class="markdown-content" [innerHTML]="renderedHtml()"></div>
          <span aria-hidden="true" [class]="cursorClass()">▋</span>
        }
      </div>
    </div>
  `,
})
export class ChatMessage {
  private readonly sanitizer = inject(DomSanitizer);
  readonly message = input.required<IapMessage>();

  protected readonly isUser = computed(() => this.message().role === 'user');
  protected readonly isStreaming = computed(() => this.message().streaming);

  protected readonly renderedHtml = computed((): SafeHtml => {
    const raw = marked.parse(this.message().content) as string;
    const clean = DOMPurify.sanitize(raw);
    return this.sanitizer.bypassSecurityTrustHtml(clean);
  });

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
