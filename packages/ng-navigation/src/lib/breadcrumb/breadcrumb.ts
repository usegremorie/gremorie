import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';

/**
 * Breadcrumb — hierarchical trail. Mirrors React `Breadcrumb` from
 * `@gremorie/rx-navigation`.
 *
 * Plain semantic markup — a `<nav>` wrapping an `<ol>` of `<li>` items — kept
 * dependency-free for SSR and accessibility. Use only on **deep hierarchies**
 * (≥3 levels); flat sites pay the noise cost without a payoff.
 *
 * The current page renders as `gr-breadcrumb-page` (not a link) so the trail
 * terminates explicitly. For collapsed middle segments use
 * `gr-breadcrumb-ellipsis` paired with a Popover or DropdownMenu.
 *
 * Anatomy: `gr-breadcrumb` (nav) → `gr-breadcrumb-list` (ol) →
 * `gr-breadcrumb-item` (li) → `gr-breadcrumb-link` (a) / `gr-breadcrumb-page`
 * (current), with `gr-breadcrumb-separator` and `gr-breadcrumb-ellipsis`.
 *
 * @example
 * ```html
 * <gr-breadcrumb>
 *   <gr-breadcrumb-list>
 *     <gr-breadcrumb-item>
 *       <gr-breadcrumb-link href="/">Home</gr-breadcrumb-link>
 *     </gr-breadcrumb-item>
 *     <gr-breadcrumb-separator />
 *     <gr-breadcrumb-item>
 *       <gr-breadcrumb-page>Settings</gr-breadcrumb-page>
 *     </gr-breadcrumb-item>
 *   </gr-breadcrumb-list>
 * </gr-breadcrumb>
 * ```
 */
@Component({
  selector: 'gr-breadcrumb',
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
 * `BreadcrumbList`. Renders the host as an `<ol>` (use `gr-breadcrumb-list`
 * on an `<ol>` is not needed — the host carries the list styling).
 */
@Component({
  selector: 'gr-breadcrumb-list, ol[gr-breadcrumb-list]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'breadcrumb-list',
    '[class]': 'hostClass()',
  },
})
export class BreadcrumbList {
  /** Extra classes merged over the defaults via `cn`. Mirrors React `className`. */
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      'text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5',
      this.class(),
    ),
  );
}

/**
 * BreadcrumbItem — one segment wrapper. Mirrors React `BreadcrumbItem`.
 */
@Component({
  selector: 'gr-breadcrumb-item, li[gr-breadcrumb-item]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'breadcrumb-item',
    '[class]': 'hostClass()',
  },
})
export class BreadcrumbItem {
  /** Extra classes merged over the defaults via `cn`. Mirrors React `className`. */
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('inline-flex items-center gap-1.5', this.class()),
  );
}

/**
 * BreadcrumbLink — a navigable ancestor segment. Mirrors React
 * `BreadcrumbLink`. The React edition supports `asChild`; in Angular project
 * an `<a>` (or any element) with the `gr-breadcrumb-link` attribute selector
 * to compose with router links.
 */
@Component({
  selector: 'gr-breadcrumb-link, a[gr-breadcrumb-link]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'breadcrumb-link',
    '[class]': 'hostClass()',
  },
})
export class BreadcrumbLink {
  /** Extra classes merged over the defaults via `cn`. Mirrors React `className`. */
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('hover:text-foreground transition-colors', this.class()),
  );
}

/**
 * BreadcrumbPage — the current (non-link) page. Mirrors React
 * `BreadcrumbPage`. Carries `role="link"`, `aria-disabled` and
 * `aria-current="page"` so the trail terminates explicitly.
 */
@Component({
  selector: 'gr-breadcrumb-page',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'breadcrumb-page',
    role: 'link',
    'aria-disabled': 'true',
    'aria-current': 'page',
    '[class]': 'hostClass()',
  },
})
export class BreadcrumbPage {
  /** Extra classes merged over the defaults via `cn`. Mirrors React `className`. */
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('text-foreground font-normal', this.class()),
  );
}

/**
 * BreadcrumbSeparator — visual divider between segments. Mirrors React
 * `BreadcrumbSeparator`. Renders a default chevron when no content is
 * projected.
 */
@Component({
  selector: 'gr-breadcrumb-separator, li[gr-breadcrumb-separator]',
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
    '[class]': 'hostClass()',
  },
})
export class BreadcrumbSeparator {
  /** Extra classes merged over the defaults via `cn`. Mirrors React `className`. */
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('[&>svg]:size-3.5', this.class()),
  );
}

/**
 * BreadcrumbEllipsis — collapsed-middle indicator. Mirrors React
 * `BreadcrumbEllipsis`. Pair with a Popover or DropdownMenu to reveal the
 * hidden segments.
 */
@Component({
  selector: 'gr-breadcrumb-ellipsis',
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
    '[class]': 'hostClass()',
  },
})
export class BreadcrumbEllipsis {
  /** Extra classes merged over the defaults via `cn`. Mirrors React `className`. */
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('flex size-9 items-center justify-center', this.class()),
  );
}
