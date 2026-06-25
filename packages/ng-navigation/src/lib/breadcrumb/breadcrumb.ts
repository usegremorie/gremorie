import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Breadcrumb — hierarchical trail. Mirrors React `Breadcrumb` from
 * `@gremorie/rx-navigation`.
 *
 * Plain semantic markup — a `<nav>` wrapping an `<ol>` of `<li>` items — kept
 * dependency-free for SSR and accessibility. Use only on **deep hierarchies**
 * (≥3 levels); flat sites pay the noise cost without a payoff.
 *
 * The current page renders as `gn-breadcrumb-page` (not a link) so the trail
 * terminates explicitly. For collapsed middle segments use
 * `gn-breadcrumb-ellipsis` paired with a Popover or DropdownMenu.
 *
 * Anatomy: `gn-breadcrumb` (nav) → `gn-breadcrumb-list` (ol) →
 * `gn-breadcrumb-item` (li) → `gn-breadcrumb-link` (a) / `gn-breadcrumb-page`
 * (current), with `gn-breadcrumb-separator` and `gn-breadcrumb-ellipsis`.
 *
 * @example
 * ```html
 * <gn-breadcrumb>
 *   <gn-breadcrumb-list>
 *     <gn-breadcrumb-item>
 *       <gn-breadcrumb-link href="/">Home</gn-breadcrumb-link>
 *     </gn-breadcrumb-item>
 *     <gn-breadcrumb-separator />
 *     <gn-breadcrumb-item>
 *       <gn-breadcrumb-page>Settings</gn-breadcrumb-page>
 *     </gn-breadcrumb-item>
 *   </gn-breadcrumb-list>
 * </gn-breadcrumb>
 * ```
 */
@Component({
  selector: 'gn-breadcrumb',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'breadcrumb',
    'aria-label': 'breadcrumb',
  },
})
export class Breadcrumb {}

/**
 * BreadcrumbList — the ordered list of segments. Mirrors React
 * `BreadcrumbList`. Renders the host as an `<ol>` (use `gn-breadcrumb-list`
 * on an `<ol>` is not needed — the host carries the list styling).
 */
@Component({
  selector: 'gn-breadcrumb-list, ol[gn-breadcrumb-list]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'breadcrumb-list',
    class:
      'text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5',
  },
})
export class BreadcrumbList {}

/**
 * BreadcrumbItem — one segment wrapper. Mirrors React `BreadcrumbItem`.
 */
@Component({
  selector: 'gn-breadcrumb-item, li[gn-breadcrumb-item]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'breadcrumb-item',
    class: 'inline-flex items-center gap-1.5',
  },
})
export class BreadcrumbItem {}

/**
 * BreadcrumbLink — a navigable ancestor segment. Mirrors React
 * `BreadcrumbLink`. The React edition supports `asChild`; in Angular project
 * an `<a>` (or any element) with the `gn-breadcrumb-link` attribute selector
 * to compose with router links.
 */
@Component({
  selector: 'gn-breadcrumb-link, a[gn-breadcrumb-link]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'breadcrumb-link',
    class: 'hover:text-foreground transition-colors',
  },
})
export class BreadcrumbLink {}

/**
 * BreadcrumbPage — the current (non-link) page. Mirrors React
 * `BreadcrumbPage`. Carries `role="link"`, `aria-disabled` and
 * `aria-current="page"` so the trail terminates explicitly.
 */
@Component({
  selector: 'gn-breadcrumb-page',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'breadcrumb-page',
    role: 'link',
    'aria-disabled': 'true',
    'aria-current': 'page',
    class: 'text-foreground font-normal',
  },
})
export class BreadcrumbPage {}

/**
 * BreadcrumbSeparator — visual divider between segments. Mirrors React
 * `BreadcrumbSeparator`. Renders a default chevron when no content is
 * projected.
 */
@Component({
  selector: 'gn-breadcrumb-separator, li[gn-breadcrumb-separator]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content>
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
    </ng-content>
  `,
  host: {
    'data-slot': 'breadcrumb-separator',
    role: 'presentation',
    'aria-hidden': 'true',
    class: '[&>svg]:size-3.5',
  },
})
export class BreadcrumbSeparator {}

/**
 * BreadcrumbEllipsis — collapsed-middle indicator. Mirrors React
 * `BreadcrumbEllipsis`. Pair with a Popover or DropdownMenu to reveal the
 * hidden segments.
 */
@Component({
  selector: 'gn-breadcrumb-ellipsis',
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
    <span class="sr-only">More</span>
  `,
  host: {
    'data-slot': 'breadcrumb-ellipsis',
    role: 'presentation',
    'aria-hidden': 'true',
    class: 'flex size-9 items-center justify-center',
  },
})
export class BreadcrumbEllipsis {}
