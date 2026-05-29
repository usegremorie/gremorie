import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Suggestions — horizontal scrollable row of `<suggestion>` chips. Mirrors
 * React `Suggestions`. Hides its scrollbar visually.
 */
@Component({
  selector: 'suggestions',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex w-max flex-nowrap items-center gap-2">
      <ng-content />
    </div>
  `,
  host: {
    class:
      'w-full overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
  },
})
export class Suggestions {}
