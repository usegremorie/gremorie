import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { BrnCollapsibleContent } from '@spartan-ng/brain/collapsible';

/**
 * ReasoningContent — collapsible body that holds the reasoning text.
 *
 * React `ReasoningContent` wraps Streamdown; without that Angular peer this
 * component accepts a plain-text `text` input rendered as preserved
 * whitespace, or any projected children for custom renderers.
 */
@Component({
  selector: 'reasoning-content',
  standalone: true,
  imports: [BrnCollapsibleContent],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      brnCollapsibleContent
      class="mt-4 text-sm text-muted-foreground outline-none transition-all data-[state=closed]:hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:slide-in-from-top-2"
    >
      @if (text(); as t) {
        <p class="whitespace-pre-wrap">{{ t }}</p>
      } @else {
        <ng-content />
      }
    </div>
  `,
})
export class ReasoningContent {
  readonly text = input<string>();
}
