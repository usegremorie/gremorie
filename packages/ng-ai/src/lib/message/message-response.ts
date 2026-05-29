import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';

/**
 * MessageResponse — assistant-side response body.
 *
 * The React equivalent (`MessageResponse`) wraps `Streamdown` for incremental
 * markdown rendering. That dependency does not have an Angular peer; until
 * one ships, this component renders projected content (consumers can plug in
 * any markdown pipe / streaming renderer they prefer) or the `text` input as
 * plain text inside the same prose container.
 */
@Component({
  selector: 'message-response',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (text(); as t) {
      <span class="whitespace-pre-wrap">{{ t }}</span>
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
   * Optional plain-text body. When set, it is rendered as a single
   * whitespace-preserving block. Leave unset and project markdown / HTML
   * children when streaming through a custom renderer.
   */
  readonly text = input<string>();
}
