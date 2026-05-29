import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

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
 */
@Component({
  selector: 'chain-of-thought-search-result',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class:
      'inline-flex items-center gap-1 rounded-md border border-transparent bg-secondary px-2 py-0.5 font-normal text-secondary-foreground text-xs',
  },
})
export class ChainOfThoughtSearchResult {}
