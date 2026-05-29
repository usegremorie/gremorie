import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Badge } from '@gremorie/ng-display';

/**
 * ChainOfThoughtSearchResults — flex-wrap container for search-result chips.
 *
 * Mirrors React `ChainOfThoughtSearchResults`.
 */
@Component({
  selector: 'chain-of-thought-search-results',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'flex flex-wrap items-center gap-2',
  },
})
export class ChainOfThoughtSearchResults {}

/**
 * ChainOfThoughtSearchResult — small badge for one search result. Mirrors
 * React `ChainOfThoughtSearchResult` (which renders a `Badge` variant).
 *
 * Dogfoods `gn-badge` (variant `secondary`) from `@gremorie/ng-display`
 * with a tighter corner radius and lighter weight to match the React
 * blueprint (which passes `gap-1 px-2 py-0.5 font-normal` to Badge).
 */
@Component({
  selector: 'chain-of-thought-search-result',
  standalone: true,
  imports: [Badge],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gn-badge variant="secondary" class="rounded-md font-normal">
      <ng-content />
    </gn-badge>
  `,
  host: {
    class: 'inline-flex',
  },
})
export class ChainOfThoughtSearchResult {}
