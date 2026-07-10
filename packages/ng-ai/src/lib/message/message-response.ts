import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { Marked, type MarkedOptions } from 'marked';

/**
 * A module-scoped `Marked` instance rather than the global `marked` singleton:
 * the renderer override below must not leak into a consumer's own `marked`
 * usage.
 *
 * `checkbox` is overridden because GFM task lists render as
 * `<input type="checkbox">`, and `<input>` is not on Angular's HTML sanitizer
 * allowlist — the element would be dropped silently, turning `- [x] done` into
 * a bare `done`. Emitting a ballot glyph keeps the semantics of the list intact
 * through sanitization.
 */
const md = new Marked({
  gfm: true,
  breaks: false,
  renderer: {
    checkbox({ checked }) {
      return checked ? '☑ ' : '☐ ';
    },
  },
});

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
 *
 * ## Security
 *
 * `text` carries **untrusted model output**. `marked` does not sanitize — raw
 * HTML embedded in markdown passes through verbatim. The security boundary is
 * therefore Angular's own HTML sanitizer, which runs because `renderedHtml()`
 * returns a plain `string` bound to `[innerHTML]`.
 *
 * Do NOT wrap the return value in `DomSanitizer.bypassSecurityTrustHtml()`.
 * Doing so disables that boundary and reintroduces stored XSS: a model can then
 * emit `<img src=x onerror=...>` and it executes with no user interaction.
 * `message-response.spec.ts` guards this.
 *
 * The tradeoff is that raw HTML in model output is stripped rather than
 * rendered. That is intentional and matches the React edition, where Streamdown
 * escapes raw HTML by default.
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
  /**
   * Markdown source. Re-parsed on every change; streaming-friendly. Leave
   * unset and project markdown / HTML children when using a custom
   * renderer.
   */
  readonly text = input<string>();

  /**
   * Optional marked options forwarded to the parser. Defaults to
   * `{ gfm: true, breaks: false }` matching Streamdown defaults.
   *
   * `MarkedOptions` deliberately excludes `renderer`/`hooks`, so this input
   * cannot be used to bypass the sanitizer described above.
   */
  readonly markedOptions = input<MarkedOptions | undefined>(undefined);

  /** Plain HTML string — Angular sanitizes it on the `[innerHTML]` binding. */
  protected readonly renderedHtml = computed<string>(() => {
    const source = this.text() ?? '';
    if (!source) return '';

    const options: MarkedOptions = {
      gfm: true,
      breaks: false,
      ...(this.markedOptions() ?? {}),
    };

    try {
      return md.parse(source, { ...options, async: false }) as string;
    } catch (err) {
      console.warn('[ng-ai] MessageResponse markdown parse failed', err);
      return escapeHtml(source);
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
