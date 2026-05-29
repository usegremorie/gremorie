import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { marked, type MarkedOptions } from 'marked';

/**
 * MessageResponse — assistant-side response body with markdown rendering.
 *
 * Mirrors React `MessageResponse` (which wraps `Streamdown` from rx-ai).
 * Streaming-aware: accepts partial markdown each render and re-parses;
 * marked is robust to incomplete input (open code fences, half tables)
 * and degrades gracefully back to plain text on parse failure.
 *
 * Consumers can also project arbitrary children (custom renderer) instead
 * of using the `text` input.
 *
 * `marked` is a hard runtime dep of ng-ai (kept tiny and tree-shakable).
 */
@Component({
  selector: 'message-response',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (text(); as t) {
      <div [innerHTML]="renderedHtml()"></div>
    } @else {
      <ng-content />
    }
  `,
  host: {
    class:
      'size-full prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
  },
})
export class MessageResponse {
  private readonly sanitizer = inject(DomSanitizer);

  /**
   * Markdown source. Re-parsed on every change; streaming-friendly. Leave
   * unset and project markdown / HTML children when using a custom
   * renderer.
   */
  readonly text = input<string>();

  /**
   * Optional marked options forwarded to the parser. Defaults to
   * `{ gfm: true, breaks: false }` matching Streamdown defaults.
   */
  readonly markedOptions = input<MarkedOptions | undefined>(undefined);

  protected readonly renderedHtml = computed<SafeHtml>(() => {
    const source = this.text() ?? '';
    if (!source) return '';

    const options: MarkedOptions = {
      gfm: true,
      breaks: false,
      ...(this.markedOptions() ?? {}),
    };

    try {
      const html = marked.parse(source, { ...options, async: false }) as string;
      return this.sanitizer.bypassSecurityTrustHtml(html);
    } catch (err) {
      console.warn('[ng-ai] MessageResponse markdown parse failed', err);
      return this.sanitizer.bypassSecurityTrustHtml(escapeHtml(source));
    }
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
