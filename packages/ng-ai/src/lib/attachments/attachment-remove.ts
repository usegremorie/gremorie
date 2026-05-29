import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { AttachmentItem } from './attachment-item';

/**
 * Remove button. Calls the parent {@link AttachmentItem}'s `removed`
 * output via DI — consumers can put it anywhere inside the item.
 *
 * Position-aware: absolute top-right for the `grid` variant (revealed
 * on hover), inline for `list` and `inline` variants.
 */
@Component({
  selector: 'attachment-remove',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [class]="buttonClass()"
      [attr.aria-label]="label()"
      (click)="handleClick($event)"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="size-3.5"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  `,
  host: {
    '[class]': 'hostClass()',
  },
})
export class AttachmentRemove {
  protected readonly parent = inject(AttachmentItem);

  readonly label = input<string>('Remove attachment');

  protected readonly hostClass = computed(() => {
    const variant = this.parent.resolvedVariant();
    // For grid variant the host floats absolutely; for others it sits inline.
    if (variant === 'grid') {
      return 'absolute right-1.5 top-1.5 z-10 inline-flex';
    }
    return 'inline-flex shrink-0';
  });

  protected readonly buttonClass = computed(() => {
    const variant = this.parent.resolvedVariant();
    const base =
      'inline-flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';
    if (variant === 'grid') {
      return `${base} bg-background/80 opacity-0 backdrop-blur-sm group-hover/attachment:opacity-100 focus-visible:opacity-100`;
    }
    return base;
  });

  protected handleClick(event: Event): void {
    event.stopPropagation();
    this.parent.emitRemove();
  }
}
