import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { buttonVariants, cn, type ButtonSize } from '@gremorie/ng-core';

/**
 * Pagination — bookmarkable page-by-page navigation. Mirrors React
 * `Pagination` from `@gremorie/rx-navigation`.
 *
 * Plain semantic markup — a `<nav>` wrapping a list of `<a>` links styled as
 * buttons (via `buttonVariants` from `@gremorie/ng-core`). Use Pagination (vs
 * infinite scroll or load-more) when URLs need to be shareable, when stable
 * order matters, and when users need to return to a specific position.
 *
 * The disabled state on Previous / Next is consumer-driven — apply
 * `aria-disabled` and a passive class as appropriate. The primitive does not
 * auto-detect first/last.
 *
 * Anatomy: `gr-pagination` (nav) → `gr-pagination-content` (ul) →
 * `gr-pagination-item` (li) → `gr-pagination-link` (a), with
 * `gr-pagination-previous`, `gr-pagination-next` and `gr-pagination-ellipsis`.
 */
@Component({
  selector: 'gr-pagination',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    role: 'navigation',
    'aria-label': 'pagination',
    'data-slot': 'pagination',
    class: 'mx-auto flex w-full justify-center',
  },
})
export class Pagination {}

/**
 * PaginationContent — the list row of items. Mirrors React
 * `PaginationContent`.
 */
@Component({
  selector: 'gr-pagination-content, ul[gr-pagination-content]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'pagination-content',
    class: 'flex flex-row items-center gap-1',
  },
})
export class PaginationContent {}

/**
 * PaginationItem — one list item. Mirrors React `PaginationItem`.
 */
@Component({
  selector: 'gr-pagination-item, li[gr-pagination-item]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'pagination-item',
  },
})
export class PaginationItem {}

/**
 * PaginationLink — a single page link styled as a button. Mirrors React
 * `PaginationLink`. `isActive` swaps the `outline` variant in (and applies
 * `aria-current="page"`); otherwise it renders as a `ghost` button.
 */
@Component({
  selector: 'gr-pagination-link, a[gr-pagination-link]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'pagination-link',
    '[attr.aria-current]': "isActive() ? 'page' : null",
    '[attr.data-active]': 'isActive()',
    '[class]': 'computedClass()',
  },
})
export class PaginationLink {
  /** Marks the link as the current page (outline variant). Mirrors React `isActive`. */
  readonly isActive = input<boolean>(false);
  /** Button size token. Mirrors React `size` (defaults to `icon`). */
  readonly size = input<ButtonSize>('icon');

  protected readonly computedClass = computed(() =>
    cn(
      buttonVariants({
        variant: this.isActive() ? 'outline' : 'ghost',
        size: this.size(),
      }),
    ),
  );
}

/**
 * PaginationPrevious — the "Go to previous page" link. Mirrors React
 * `PaginationPrevious`.
 */
@Component({
  selector: 'gr-pagination-previous, a[gr-pagination-previous]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
    <span class="hidden sm:block">Previous</span>
  `,
  host: {
    'aria-label': 'Go to previous page',
    'data-slot': 'pagination-link',
    '[class]': 'computedClass()',
  },
})
export class PaginationPrevious {
  protected readonly computedClass = computed(() =>
    cn(
      buttonVariants({ variant: 'ghost', size: 'default' }),
      'gap-1 px-2.5 sm:pl-2.5',
    ),
  );
}

/**
 * PaginationNext — the "Go to next page" link. Mirrors React `PaginationNext`.
 */
@Component({
  selector: 'gr-pagination-next, a[gr-pagination-next]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="hidden sm:block">Next</span>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  `,
  host: {
    'aria-label': 'Go to next page',
    'data-slot': 'pagination-link',
    '[class]': 'computedClass()',
  },
})
export class PaginationNext {
  protected readonly computedClass = computed(() =>
    cn(
      buttonVariants({ variant: 'ghost', size: 'default' }),
      'gap-1 px-2.5 sm:pr-2.5',
    ),
  );
}

/**
 * PaginationEllipsis — collapsed-range indicator. Mirrors React
 * `PaginationEllipsis`.
 */
@Component({
  selector: 'gr-pagination-ellipsis',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="size-4"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
    <span class="sr-only">More pages</span>
  `,
  host: {
    'aria-hidden': 'true',
    'data-slot': 'pagination-ellipsis',
    class: 'flex size-9 items-center justify-center',
  },
})
export class PaginationEllipsis {}
