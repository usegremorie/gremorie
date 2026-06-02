import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  InjectionToken,
  OnDestroy,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Conversation — scrollable container that auto-sticks to the bottom while
 * new messages arrive, matching React `Conversation` (which wraps the
 * `use-stick-to-bottom` library).
 *
 * Implementation notes:
 * - Uses a self-contained scroll-and-resize observer (no JS lib dep).
 * - Exposes `isAtBottom` signal + `scrollToBottom()` via DI so the
 *   `ConversationScrollButton` companion can stay decoupled.
 * - Bottom threshold of 24px matches "feels stuck" in chat UIs.
 */
export interface ConversationState {
  readonly isAtBottom: () => boolean;
  scrollToBottom(behavior?: ScrollBehavior): void;
}

export const CONVERSATION = new InjectionToken<ConversationState>(
  'ConversationState',
);

const STICK_THRESHOLD_PX = 24;

@Component({
  selector: 'conversation',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #scroller class="size-full overflow-y-auto" (scroll)="onScroll()">
      <ng-content />
    </div>
  `,
  host: {
    role: 'log',
    class: 'relative flex-1 overflow-y-hidden',
  },
  providers: [
    {
      provide: CONVERSATION,
      useExisting: forwardRef(() => Conversation),
    },
  ],
})
export class Conversation
  implements AfterViewInit, OnDestroy, ConversationState
{
  protected readonly scroller =
    viewChild.required<ElementRef<HTMLDivElement>>('scroller');

  private readonly _isAtBottom = signal(true);
  readonly isAtBottom = () => this._isAtBottom();

  private resizeObserver?: ResizeObserver;
  private mutationObserver?: MutationObserver;

  ngAfterViewInit(): void {
    const el = this.scroller().nativeElement;

    // Initial scroll to bottom.
    this.scrollToBottom('auto');

    // Auto-stick when content grows.
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        if (this._isAtBottom()) {
          this.scrollToBottom('smooth');
        }
      });
      // Observe both the scroller and its first child (the projected content).
      this.resizeObserver.observe(el);
      const child = el.firstElementChild;
      if (child) this.resizeObserver.observe(child);
    }

    // Auto-stick when new nodes are added even without size change (rare).
    if (typeof MutationObserver !== 'undefined') {
      this.mutationObserver = new MutationObserver(() => {
        if (this._isAtBottom()) {
          this.scrollToBottom('smooth');
        }
      });
      this.mutationObserver.observe(el, {
        childList: true,
        subtree: true,
      });
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
  }

  protected onScroll(): void {
    const el = this.scroller().nativeElement;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    this._isAtBottom.set(distance <= STICK_THRESHOLD_PX);
  }

  scrollToBottom(behavior: ScrollBehavior = 'smooth'): void {
    const el = this.scroller().nativeElement;
    el.scrollTo({ top: el.scrollHeight, behavior });
    this._isAtBottom.set(true);
  }
}
