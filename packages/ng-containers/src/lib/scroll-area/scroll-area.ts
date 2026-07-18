import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  OnDestroy,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { cn } from '@gremorie/ng-core';

/** Radix's thumb never shrinks below this, so neither does ours. */
const MIN_THUMB_PX = 20;

/**
 * ScrollArea — themeable overlay scroll container. Mirrors React `ScrollArea`
 * from `@gremorie/rx-containers` (Radix ScrollArea).
 *
 * The native bar is hidden and replaced by an overlay thumb that floats over the
 * content (it takes no layout space) and fades in while the pointer is over the
 * area — the same behaviour as Radix's default `type="hover"`. The thumb is a
 * `--border`-colored pill, matching the React edition's `w-2.5` bar.
 *
 * Implemented natively (signals + ResizeObserver) rather than via a third-party
 * scrollbar library: `ngx-scrollbar` has no Angular 21 release and fails to
 * initialise here (its viewport measurement stays at 0, so no bar ever renders).
 *
 * Constrain it with a fixed height/width via the host `class` so its content can
 * overflow. Anatomy parity with React: `scroll-area` host, `scroll-area-viewport`,
 * `scroll-area-scrollbar`, `scroll-area-thumb`.
 *
 * @example
 * ```html
 * <gr-scroll-area class="h-64 w-56 rounded-md border">
 *   <div class="p-4">…long content…</div>
 * </gr-scroll-area>
 * ```
 */
@Component({
  selector: 'gr-scroll-area',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #viewport
      data-slot="scroll-area-viewport"
      class="size-full overflow-auto rounded-[inherit] outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      (scroll)="onScroll()"
    >
      <ng-content />
    </div>
    @if (scrollable()) {
      <div
        data-slot="scroll-area-scrollbar"
        class="absolute inset-y-0 right-0 w-2.5 touch-none p-px opacity-0 transition-opacity duration-150 select-none group-hover:opacity-100"
      >
        <div
          data-slot="scroll-area-thumb"
          class="w-2 rounded-full bg-border"
          [style.height.px]="thumbHeight()"
          [style.transform]="'translateY(' + thumbTop() + 'px)'"
        ></div>
      </div>
    }
  `,
  host: {
    'data-slot': 'scroll-area',
    '[class]': 'hostClass()',
  },
})
export class ScrollArea implements OnDestroy {
  readonly class = input<string>();
  // `group` drives the bar's hover fade in pure CSS (group-hover), so the
  // overlay behaves like Radix's default `type="hover"` without any listener
  // or change detection in the path.
  protected readonly hostClass = computed(() =>
    cn('group relative block overflow-hidden', this.class()),
  );

  private readonly viewport =
    viewChild.required<ElementRef<HTMLElement>>('viewport');

  private readonly scrollTop = signal(0);
  private readonly viewportH = signal(0);
  private readonly contentH = signal(0);

  /** Only mount the bar when the content actually overflows (Radix does the same). */
  protected readonly scrollable = computed(
    () => this.contentH() > this.viewportH() + 1,
  );

  protected readonly thumbHeight = computed(() => {
    const vh = this.viewportH();
    const ch = this.contentH();
    if (ch <= vh) return 0;
    return Math.max(MIN_THUMB_PX, Math.round((vh / ch) * vh));
  });

  protected readonly thumbTop = computed(() => {
    const maxScroll = this.contentH() - this.viewportH();
    if (maxScroll <= 0) return 0;
    const track = this.viewportH() - this.thumbHeight();
    return Math.round((this.scrollTop() / maxScroll) * track);
  });

  private observer?: ResizeObserver;

  constructor() {
    afterNextRender(() => {
      const el = this.viewport().nativeElement;
      this.measure();
      // Re-measure when the viewport resizes or the projected content grows.
      this.observer = new ResizeObserver(() => this.measure());
      this.observer.observe(el);
      const content = el.firstElementChild;
      if (content) this.observer.observe(content);
    });
  }

  protected onScroll(): void {
    this.scrollTop.set(this.viewport().nativeElement.scrollTop);
  }

  private measure(): void {
    const el = this.viewport().nativeElement;
    this.viewportH.set(el.clientHeight);
    this.contentH.set(el.scrollHeight);
    this.scrollTop.set(el.scrollTop);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
