import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Injectable,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { cva } from 'class-variance-authority';
import { cn } from '@gremorie/ng-core';

/**
 * Shares the single "currently-open item" value across a NavigationMenu tree
 * so triggers can toggle their panel and reflect `data-state`. The React
 * edition leans on Radix NavigationMenu's internal value; spartan brain's
 * `navigation-menu` models content as structural templates rather than the
 * element-based Viewport/Indicator anatomy this primitive mirrors, so the open
 * state is hand-rolled here to keep a faithful element API.
 */
@Injectable()
export class NavigationMenuService {
  readonly value = signal<string | undefined>(undefined);

  toggle(id: string): void {
    this.value.update((current) => (current === id ? undefined : id));
  }

  open(id: string): void {
    this.value.set(id);
  }

  close(): void {
    this.value.set(undefined);
  }

  isOpen(id: string): boolean {
    return this.value() === id;
  }
}

/**
 * NavigationMenuViewport — shared animated panel container. Mirrors React
 * `NavigationMenuViewport`. Rendered automatically by the root when
 * `viewport` is true.
 */
@Component({
  selector: 'gn-navigation-menu-viewport',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      data-slot="navigation-menu-viewport"
      class="origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]"
    ></div>
  `,
  host: {
    class: 'absolute top-full left-0 isolate z-50 flex justify-center',
  },
})
export class NavigationMenuViewport {}

const navigationMenuTriggerStyle = cva(
  'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-[color,box-shadow] outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent',
);

/**
 * NavigationMenu — marketing-site primary nav with rich panels. Mirrors React
 * `NavigationMenu` from `@gremorie/rx-navigation`, which wraps Radix
 * NavigationMenu.
 *
 * Designed for **header-level navigation with rich content panels** — the
 * Vercel/Stripe/Tailwind pattern of "Products / Solutions / Pricing" with
 * multi-column dropdowns under each trigger. For app-internal nav use Sidebar
 * or Tabs; for action menus use Menubar.
 *
 * Anatomy: `gn-navigation-menu` (root, renders a `gn-navigation-menu-viewport`
 * when `viewport` is true) → `gn-navigation-menu-list` →
 * `gn-navigation-menu-item` → `gn-navigation-menu-trigger` +
 * `gn-navigation-menu-content`, with `gn-navigation-menu-link` and
 * `gn-navigation-menu-indicator`.
 *
 * Divergence vs. React/Radix: the open/close state is driven by the
 * `NavigationMenuService` (a small Angular DI controller) rather than Radix's
 * internal machine, because spartan brain models content as structural
 * templates and would force a different element anatomy. The element API,
 * `data-slot` names, variants and classes match the React edition.
 */
@Component({
  selector: 'gn-navigation-menu',
  standalone: true,
  imports: [NavigationMenuViewport],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NavigationMenuService],
  template: `
    <ng-content />
    @if (viewport()) {
      <gn-navigation-menu-viewport />
    }
  `,
  host: {
    'data-slot': 'navigation-menu',
    '[attr.data-viewport]': 'viewport()',
    '[class]': 'computedClass()',
  },
})
export class NavigationMenu {
  /** Render the shared animated viewport panel. Mirrors React `viewport`. */
  readonly viewport = input<boolean>(true);

  protected readonly computedClass = computed(() =>
    cn(
      'group/navigation-menu relative flex max-w-max flex-1 items-center justify-center',
    ),
  );
}

/**
 * NavigationMenuList — the row of top-level items. Mirrors React
 * `NavigationMenuList`.
 */
@Component({
  selector: 'gn-navigation-menu-list, ul[gn-navigation-menu-list]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'navigation-menu-list',
    class: 'group flex flex-1 list-none items-center justify-center gap-1',
  },
})
export class NavigationMenuList {}

/**
 * NavigationMenuItem — one top-level entry (trigger + content). Mirrors React
 * `NavigationMenuItem`. Holds a stable id used to key the open state.
 */
@Component({
  selector: 'gn-navigation-menu-item, li[gn-navigation-menu-item]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'navigation-menu-item',
    class: 'relative',
  },
})
export class NavigationMenuItem {
  private static _counter = 0;
  /** Stable id shared with this item's trigger and content. */
  readonly id = `gn-navigation-menu-item-${NavigationMenuItem._counter++}`;
}

/**
 * NavigationMenuTrigger — opens this item's content panel. Mirrors React
 * `NavigationMenuTrigger` (renders the rotating chevron). Toggles the shared
 * open state and reflects `data-state`.
 */
@Component({
  selector: 'gn-navigation-menu-trigger',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      data-slot="navigation-menu-trigger"
      [attr.data-state]="state()"
      [attr.aria-expanded]="isOpen()"
      [class]="triggerClass()"
      (click)="toggle()"
    >
      <ng-content />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  `,
  host: {
    class: 'contents',
  },
})
export class NavigationMenuTrigger {
  private readonly service = inject(NavigationMenuService);
  private readonly item = inject(NavigationMenuItem);

  protected readonly isOpen = computed(
    () => this.service.value() === this.item.id,
  );
  protected readonly state = computed(() =>
    this.isOpen() ? 'open' : 'closed',
  );

  protected readonly triggerClass = computed(() =>
    cn(navigationMenuTriggerStyle(), 'group'),
  );

  protected toggle(): void {
    this.service.toggle(this.item.id);
  }
}

/**
 * NavigationMenuContent — this item's panel. Mirrors React
 * `NavigationMenuContent`. Shown only while its item is open; carries the
 * viewport-on/off layout classes.
 */
@Component({
  selector: 'gn-navigation-menu-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <ng-content />
    }
  `,
  host: {
    'data-slot': 'navigation-menu-content',
    '[attr.data-state]': 'state()',
    '[class]': 'computedClass()',
  },
})
export class NavigationMenuContent {
  private readonly service = inject(NavigationMenuService);
  private readonly item = inject(NavigationMenuItem);

  protected readonly isOpen = computed(
    () => this.service.value() === this.item.id,
  );
  protected readonly state = computed(() =>
    this.isOpen() ? 'open' : 'closed',
  );

  protected readonly computedClass = computed(() =>
    cn(
      'top-0 left-0 w-full p-2 pr-2.5 data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out md:absolute md:w-auto',
      'group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95',
    ),
  );
}

/**
 * NavigationMenuLink — a navigable entry inside a panel (or a bare top-level
 * link). Mirrors React `NavigationMenuLink`. `active` flags the current page.
 */
@Component({
  selector: 'gn-navigation-menu-link, a[gn-navigation-menu-link]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'navigation-menu-link',
    '[attr.data-active]': 'active() || null',
    '[class]': 'computedClass()',
  },
})
export class NavigationMenuLink {
  /** Marks the link as the current page. Mirrors React `active` (Radix `data-active`). */
  readonly active = input<boolean>(false);

  protected readonly computedClass = computed(() =>
    cn(
      "flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground data-[active=true]:hover:bg-accent data-[active=true]:focus:bg-accent [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
    ),
  );
}

/**
 * NavigationMenuIndicator — the little arrow that tracks the active trigger.
 * Mirrors React `NavigationMenuIndicator`.
 */
@Component({
  selector: 'gn-navigation-menu-indicator',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md"
    ></div>
  `,
  host: {
    'data-slot': 'navigation-menu-indicator',
    class:
      'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in',
  },
})
export class NavigationMenuIndicator {}

export { navigationMenuTriggerStyle };
