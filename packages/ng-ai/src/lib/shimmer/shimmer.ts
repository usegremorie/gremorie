import {
  Directive,
  computed,
  effect,
  ElementRef,
  inject,
  input,
} from '@angular/core';

/**
 * Shimmer — animated gradient sweep on a text node. Mirrors React
 * `Shimmer` (which uses motion/react).
 *
 * Attach as a directive:
 *
 * ```html
 * <span ngShimmer [shimmerDuration]="1.5">Thinking…</span>
 * ```
 *
 * Or with the boolean disabled flag (useful when reused inside a streaming
 * primitive such as Reasoning):
 *
 * ```html
 * <span ngShimmer [shimmerDisabled]="!isStreaming()">…</span>
 * ```
 *
 * Style is applied via inline CSS variables + a global keyframe rule
 * injected once per document so the directive stays standalone (no need
 * for a global stylesheet import).
 */
@Directive({
  selector: '[ngShimmer]',
  standalone: true,
  host: {
    '[class]': 'hostClass()',
    '[style.background-image]': 'backgroundImage()',
    '[style.--ng-shimmer-spread]': 'spreadPx()',
    '[style.--ng-shimmer-duration]': 'durationSec()',
    '[style.animation-play-state]': 'shimmerDisabled() ? "paused" : "running"',
  },
})
export class Shimmer {
  /** Seconds for one full sweep. Default 2 (matches rx-ai). */
  readonly shimmerDuration = input<number>(2);

  /**
   * Spread coefficient. Final spread = (text length) * spread, like rx-ai.
   */
  readonly shimmerSpread = input<number>(2);

  /** When `true`, animation pauses. */
  readonly shimmerDisabled = input<boolean>(false);

  private readonly el = inject(ElementRef<HTMLElement>);

  protected readonly hostClass = computed(
    () =>
      'ng-shimmer relative inline-block bg-clip-text text-transparent [background-repeat:no-repeat,padding-box]',
  );

  protected readonly backgroundImage = computed(
    () =>
      'linear-gradient(90deg, transparent calc(50% - var(--ng-shimmer-spread)), var(--background, #ffffff), transparent calc(50% + var(--ng-shimmer-spread))), linear-gradient(var(--muted-foreground, #71717a), var(--muted-foreground, #71717a))',
  );

  protected readonly spreadPx = computed(() => {
    const text = this.el.nativeElement.textContent ?? '';
    return `${text.length * this.shimmerSpread()}px`;
  });

  protected readonly durationSec = computed(() => `${this.shimmerDuration()}s`);

  constructor() {
    ensureKeyframesInjected();
    // Re-evaluate spreadPx when content changes (textContent is not reactive).
    effect(() => {
      // Touch inputs so effect runs on prop change.
      this.shimmerSpread();
      this.shimmerDuration();
    });
  }
}

let keyframesInjected = false;

function ensureKeyframesInjected(): void {
  if (keyframesInjected || typeof document === 'undefined') return;
  keyframesInjected = true;
  const style = document.createElement('style');
  style.setAttribute('data-ng-shimmer', '');
  style.textContent = `
    .ng-shimmer {
      background-size: 250% 100%, auto;
      animation: ng-shimmer-sweep var(--ng-shimmer-duration, 2s) linear infinite;
    }
    @keyframes ng-shimmer-sweep {
      0%   { background-position: 100% center; }
      100% { background-position: 0% center; }
    }
    @media (prefers-reduced-motion: reduce) {
      .ng-shimmer { animation: none; }
    }
  `;
  document.head.appendChild(style);
}
