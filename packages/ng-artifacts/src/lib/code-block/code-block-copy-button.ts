import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';

import { CODE_BLOCK } from './code-block';

/**
 * CodeBlockCopyButton — copy-to-clipboard icon button.
 *
 * Mirrors React `CodeBlockCopyButton`. Reads the code from the parent
 * `<code-block>` via DI; emits `(copied)` on success, `(errored)` on
 * failure.
 */
@Component({
  selector: 'code-block-copy-button',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      data-slot="button"
      [class]="buttonClass"
      (click)="copy()"
      aria-label="Copy code"
    >
      <ng-content>
        @if (isCopied()) {
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        } @else {
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        }
      </ng-content>
    </button>
  `,
})
export class CodeBlockCopyButton {
  readonly timeout = input<number>(2000);

  readonly copied = output<void>();
  readonly errored = output<Error>();

  private readonly host = inject(CODE_BLOCK);
  protected readonly isCopied = signal(false);

  protected readonly buttonClass = cn(
    'shrink-0 inline-flex size-7 items-center justify-center rounded-md text-foreground/70 hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  );

  protected async copy(): Promise<void> {
    if (typeof window === 'undefined' || !navigator?.clipboard?.writeText) {
      this.errored.emit(new Error('Clipboard API not available'));
      return;
    }
    try {
      await navigator.clipboard.writeText(this.host.code());
      this.isCopied.set(true);
      this.copied.emit();
      setTimeout(() => this.isCopied.set(false), this.timeout());
    } catch (err) {
      this.errored.emit(err as Error);
    }
  }
}
