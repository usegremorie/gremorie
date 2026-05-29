import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';

import { CONVERSATION } from './conversation';

/**
 * ConversationScrollButton — "scroll to bottom" pill that appears only when
 * the user has scrolled up. Mirrors React `ConversationScrollButton`.
 *
 * Reads `isAtBottom` and calls `scrollToBottom()` on the parent
 * Conversation via DI.
 */
@Component({
  selector: 'conversation-scroll-button',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <button
        type="button"
        (click)="scroll()"
        class="absolute bottom-4 left-[50%] inline-flex size-9 -translate-x-1/2 items-center justify-center rounded-full border bg-background text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-label="Scroll to bottom"
      >
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
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </button>
    }
  `,
})
export class ConversationScrollButton {
  private readonly state = inject(CONVERSATION);
  protected readonly visible = computed(() => !this.state.isAtBottom());

  protected scroll(): void {
    this.state.scrollToBottom('smooth');
  }
}
