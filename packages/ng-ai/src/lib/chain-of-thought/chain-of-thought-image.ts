import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';

/**
 * ChainOfThoughtImage — bounded image preview with optional caption inside a
 * chain step. Mirrors React `ChainOfThoughtImage`.
 */
@Component({
  selector: 'chain-of-thought-image',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="relative flex max-h-[22rem] items-center justify-center overflow-hidden rounded-lg bg-muted p-3"
    >
      <ng-content />
    </div>
    @if (caption(); as c) {
      <p class="text-muted-foreground text-xs">{{ c }}</p>
    }
  `,
  host: {
    class: 'mt-2 space-y-2 block',
  },
})
export class ChainOfThoughtImage {
  readonly caption = input<string>();
}
