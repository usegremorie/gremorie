import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DOCUMENT,
  effect,
  inject,
  Injectable,
  input,
  model,
  OnDestroy,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@gremorie/ng-core';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/ng-overlays';

const MOBILE_BREAKPOINT = 768;
const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

/**
 * Holds the collapsible state for a sidebar subtree — the Angular equivalent
 * of React's `SidebarContext`. Provided by `gn-sidebar-provider`; consumed by
 * `Sidebar`, `SidebarTrigger`, `SidebarRail` and `SidebarMenuButton`.
 *
 * Mirrors the React `useSidebar()` contract: `open`/`state`, `openMobile`,
 * `isMobile`, and `toggleSidebar()`. Persists `open` to the `sidebar_state`
 * cookie and wires the ⌘/Ctrl-B keyboard shortcut, exactly like the React
 * edition.
 */
@Injectable()
export class SidebarService implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly window = this.document.defaultView;

  readonly open = signal<boolean>(true);
  readonly openMobile = signal<boolean>(false);
  readonly isMobile = signal<boolean>(false);

  readonly state = computed<'expanded' | 'collapsed'>(() =>
    this.open() ? 'expanded' : 'collapsed',
  );

  private mql?: MediaQueryList;
  private readonly onMediaChange = () => {
    if (this.window) {
      this.isMobile.set(this.window.innerWidth < MOBILE_BREAKPOINT);
    }
  };
  private readonly onKeyDown = (event: KeyboardEvent) => {
    if (
      event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
      (event.metaKey || event.ctrlKey)
    ) {
      event.preventDefault();
      this.toggleSidebar();
    }
  };

  constructor() {
    if (this.window) {
      this.mql = this.window.matchMedia(
        `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
      );
      this.onMediaChange();
      this.mql.addEventListener('change', this.onMediaChange);
      this.window.addEventListener('keydown', this.onKeyDown);
    }
  }

  setOpen(value: boolean): void {
    this.open.set(value);
    if (this.document) {
      this.document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    }
  }

  toggleSidebar(): void {
    if (this.isMobile()) {
      this.openMobile.update((value) => !value);
    } else {
      this.setOpen(!this.open());
    }
  }

  ngOnDestroy(): void {
    this.mql?.removeEventListener('change', this.onMediaChange);
    this.window?.removeEventListener('keydown', this.onKeyDown);
  }
}

/**
 * SidebarProvider — wraps the app shell and owns the collapsible state.
 * Mirrors React `SidebarProvider`. Wrap any subtree using the sidebar in a
 * `gn-sidebar-provider` (including each Storybook story).
 *
 * `defaultOpen` seeds the uncontrolled state; `open`/`openChange` allow
 * controlled use.
 */
@Component({
  selector: 'gn-sidebar-provider',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SidebarService],
  template: `<ng-content />`,
  host: {
    'data-slot': 'sidebar-wrapper',
    '[style.--sidebar-width]': 'sidebarWidth',
    '[style.--sidebar-width-icon]': 'sidebarWidthIcon',
    class:
      'group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full',
  },
})
export class SidebarProvider {
  private readonly service = inject(SidebarService);

  protected readonly sidebarWidth = SIDEBAR_WIDTH;
  protected readonly sidebarWidthIcon = SIDEBAR_WIDTH_ICON;

  /** Initial open state (uncontrolled). Mirrors React `defaultOpen`. */
  readonly defaultOpen = input<boolean>(true);
  /** Controlled open state (two-way). Mirrors React `open` / `onOpenChange`. */
  readonly open = model<boolean | undefined>(undefined);

  constructor() {
    this.service.open.set(this.defaultOpen());
    // Forward the controlled `open` input into the service and reflect service
    // changes back out through the model, matching React's controllable hook.
    effect(() => {
      const controlled = this.open();
      if (controlled !== undefined && controlled !== this.service.open()) {
        this.service.open.set(controlled);
      }
    });
    effect(() => {
      this.open.set(this.service.open());
    });
  }
}

const sidebarMenuButtonVariants = cva(
  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        outline:
          'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]',
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

/**
 * Sidebar — composable app-shell sidebar. Mirrors React `Sidebar`. The
 * heaviest primitive in the kit, exposing 20+ subcomponents that compose into
 * header / content / footer regions with collapsible state, icon-only mode,
 * mobile off-canvas, badge slots, sub-menus, and skeleton loaders.
 *
 * Divergence vs. React: the mobile presentation is a hand-rolled off-canvas
 * overlay (the React edition reuses the `Sheet` overlay primitive, which has
 * no Angular package yet); the desktop structure, `data-*` attributes,
 * `data-slot` names and classes match the React edition.
 */
@Component({
  selector: 'gn-sidebar',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  template: `
    <!--
      The projected children are captured ONCE in a template and outlet into
      whichever branch is active. Angular projects unselected content into the
      LAST <ng-content> of a template, so declaring one <ng-content /> per
      branch left the collapsible="none" and mobile branches rendering an
      EMPTY shell (same technique as SidebarMenuButton below).
    -->
    <ng-template #content><ng-content /></ng-template>

    @if (collapsible() === 'none') {
      <div
        data-slot="sidebar"
        class="flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground"
      >
        <ng-container [ngTemplateOutlet]="content" />
      </div>
    } @else if (service.isMobile()) {
      @if (service.openMobile()) {
        <button
          type="button"
          aria-label="Close sidebar"
          class="fixed inset-0 z-50 bg-black/50"
          (click)="service.openMobile.set(false)"
        ></button>
      }
      <div
        data-sidebar="sidebar"
        data-slot="sidebar"
        data-mobile="true"
        [attr.data-state]="service.openMobile() ? 'open' : 'closed'"
        [attr.data-side]="side()"
        [style.--sidebar-width]="sidebarWidthMobile"
        [class]="mobileClass()"
      >
        <div class="flex h-full w-full flex-col">
          <ng-container [ngTemplateOutlet]="content" />
        </div>
      </div>
    } @else {
      <div
        class="group peer hidden text-sidebar-foreground md:block"
        [attr.data-state]="service.state()"
        [attr.data-collapsible]="
          service.state() === 'collapsed' ? collapsible() : ''
        "
        [attr.data-variant]="variant()"
        [attr.data-side]="side()"
        data-slot="sidebar"
      >
        <div data-slot="sidebar-gap" [class]="gapClass()"></div>
        <div data-slot="sidebar-container" [class]="containerClass()">
          <div
            data-sidebar="sidebar"
            data-slot="sidebar-inner"
            class="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm"
          >
            <ng-container [ngTemplateOutlet]="content" />
          </div>
        </div>
      </div>
    }
  `,
})
export class Sidebar {
  protected readonly service = inject(SidebarService);
  protected readonly sidebarWidthMobile = SIDEBAR_WIDTH_MOBILE;

  /** Which edge the sidebar sits on. Mirrors React `side`. */
  readonly side = input<'left' | 'right'>('left');
  /** Visual treatment. Mirrors React `variant`. */
  readonly variant = input<'sidebar' | 'floating' | 'inset'>('sidebar');
  /** Collapse behavior. Mirrors React `collapsible`. */
  readonly collapsible = input<'offcanvas' | 'icon' | 'none'>('offcanvas');

  protected readonly mobileClass = computed(() =>
    cn(
      'fixed inset-y-0 z-50 flex w-(--sidebar-width) flex-col bg-sidebar p-0 text-sidebar-foreground transition-transform duration-200 ease-linear',
      this.side() === 'left' ? 'left-0' : 'right-0',
      this.service.openMobile()
        ? 'translate-x-0'
        : this.side() === 'left'
          ? '-translate-x-full'
          : 'translate-x-full',
    ),
  );

  protected readonly gapClass = computed(() =>
    cn(
      'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
      'group-data-[collapsible=offcanvas]:w-0',
      'group-data-[side=right]:rotate-180',
      this.variant() === 'floating' || this.variant() === 'inset'
        ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
        : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
    ),
  );

  protected readonly containerClass = computed(() =>
    cn(
      'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
      this.side() === 'left'
        ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
        : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
      this.variant() === 'floating' || this.variant() === 'inset'
        ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
        : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
    ),
  );
}

/**
 * SidebarTrigger — toggles the sidebar. Mirrors React `SidebarTrigger`.
 */
@Component({
  selector: 'gn-sidebar-trigger',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      [class]="computedClass()"
      (click)="service.toggleSidebar()"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 3v18" />
      </svg>
      <span class="sr-only">Toggle Sidebar</span>
    </button>
  `,
  host: { class: 'contents' },
})
export class SidebarTrigger {
  protected readonly service = inject(SidebarService);

  protected readonly computedClass = computed(() =>
    cn(
      'inline-flex size-7 shrink-0 items-center justify-center gap-2 rounded-md bg-transparent text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [&_svg]:size-4 [&_svg]:shrink-0',
    ),
  );
}

/**
 * SidebarRail — the thin clickable rail that toggles the sidebar. Mirrors
 * React `SidebarRail`.
 */
@Component({
  selector: 'gn-sidebar-rail',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-sidebar': 'rail',
    'data-slot': 'sidebar-rail',
    'aria-label': 'Toggle Sidebar',
    tabindex: '-1',
    title: 'Toggle Sidebar',
    '(click)': 'service.toggleSidebar()',
    '[class]': 'computedClass()',
  },
})
export class SidebarRail {
  protected readonly service = inject(SidebarService);

  protected readonly computedClass = computed(() =>
    cn(
      'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex',
      'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
      '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
      'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar',
      '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
      '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
    ),
  );
}

/**
 * SidebarInset — the main content region beside the sidebar. Mirrors React
 * `SidebarInset`.
 */
@Component({
  selector: 'gn-sidebar-inset',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'sidebar-inset',
    class:
      'relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
  },
})
export class SidebarInset {}

/**
 * SidebarInput — a search input tuned for the sidebar. Mirrors React
 * `SidebarInput`. Rendered as a styled native `<input>` since there is no
 * Angular Input package yet.
 */
@Component({
  selector: 'gn-sidebar-input, input[gn-sidebar-input]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'sidebar-input',
    'data-sidebar': 'input',
    class:
      'h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
  },
})
export class SidebarInput {}

/**
 * SidebarHeader — top region of the sidebar. Mirrors React `SidebarHeader`.
 */
@Component({
  selector: 'gn-sidebar-header',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'sidebar-header',
    'data-sidebar': 'header',
    class: 'flex flex-col gap-2 p-2',
  },
})
export class SidebarHeader {}

/**
 * SidebarFooter — bottom region of the sidebar. Mirrors React `SidebarFooter`.
 */
@Component({
  selector: 'gn-sidebar-footer',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'sidebar-footer',
    'data-sidebar': 'footer',
    class: 'flex flex-col gap-2 p-2',
  },
})
export class SidebarFooter {}

/**
 * SidebarSeparator — divider styled for the sidebar. Mirrors React
 * `SidebarSeparator`.
 */
@Component({
  selector: 'gn-sidebar-separator',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  host: {
    'data-slot': 'sidebar-separator',
    'data-sidebar': 'separator',
    role: 'separator',
    class: 'mx-2 h-px w-auto shrink-0 bg-sidebar-border',
  },
})
export class SidebarSeparator {}

/**
 * SidebarContent — the scrollable middle region. Mirrors React
 * `SidebarContent`.
 */
@Component({
  selector: 'gn-sidebar-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'sidebar-content',
    'data-sidebar': 'content',
    class:
      'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
  },
})
export class SidebarContent {}

/**
 * SidebarGroup — a labelled section of the sidebar. Mirrors React
 * `SidebarGroup`.
 */
@Component({
  selector: 'gn-sidebar-group',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'sidebar-group',
    'data-sidebar': 'group',
    class: 'relative flex w-full min-w-0 flex-col p-2',
  },
})
export class SidebarGroup {}

/**
 * SidebarGroupLabel — the heading of a SidebarGroup. Mirrors React
 * `SidebarGroupLabel`.
 */
@Component({
  selector: 'gn-sidebar-group-label',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'sidebar-group-label',
    'data-sidebar': 'group-label',
    class:
      'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
  },
})
export class SidebarGroupLabel {}

/**
 * SidebarGroupAction — a top-right action for a SidebarGroup. Mirrors React
 * `SidebarGroupAction`.
 */
@Component({
  selector: 'gn-sidebar-group-action',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'sidebar-group-action',
    'data-sidebar': 'group-action',
    class:
      'absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 after:absolute after:-inset-2 md:after:hidden group-data-[collapsible=icon]:hidden',
  },
})
export class SidebarGroupAction {}

/**
 * SidebarGroupContent — body of a SidebarGroup. Mirrors React
 * `SidebarGroupContent`.
 */
@Component({
  selector: 'gn-sidebar-group-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'sidebar-group-content',
    'data-sidebar': 'group-content',
    class: 'w-full text-sm',
  },
})
export class SidebarGroupContent {}

/**
 * SidebarMenu — the list of menu items. Mirrors React `SidebarMenu`.
 */
@Component({
  selector: 'gn-sidebar-menu, ul[gn-sidebar-menu]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'sidebar-menu',
    'data-sidebar': 'menu',
    class: 'flex w-full min-w-0 flex-col gap-1',
  },
})
export class SidebarMenu {}

/**
 * SidebarMenuItem — one menu row. Mirrors React `SidebarMenuItem`.
 */
@Component({
  selector: 'gn-sidebar-menu-item, li[gn-sidebar-menu-item]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'sidebar-menu-item',
    'data-sidebar': 'menu-item',
    class: 'group/menu-item relative',
  },
})
export class SidebarMenuItem {}

/**
 * SidebarMenuButton — the clickable menu entry. Mirrors React
 * `SidebarMenuButton`. Supports `isActive`, `variant`, `size` and a `tooltip`.
 *
 * The collapsed-state `tooltip` is the styled `gn-tooltip` compound from
 * `@gremorie/ng-overlays` (side `right`, like the React edition). React keeps
 * the `TooltipContent` mounted and toggles its `hidden` attribute unless the
 * sidebar is collapsed on desktop; here the compound is instantiated under the
 * same condition (`tooltip` set, state `collapsed`, not mobile), which yields
 * the same visible behaviour. Divergence vs. React: the trigger wraps the
 * projected content (icon + label), not the host button itself, so hovering
 * bare button padding does not open the tooltip; in collapsed icon mode the
 * projected icon is the hover target.
 */
@Component({
  selector:
    'gn-sidebar-menu-button, a[gn-sidebar-menu-button], button[gn-sidebar-menu-button]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  ],
  template: `
    <ng-template #content><ng-content /></ng-template>

    @if (tooltipVisible()) {
      <gn-tooltip-provider>
        <gn-tooltip side="right">
          <gn-tooltip-trigger class="flex w-full min-w-0 items-center gap-2">
            <ng-container [ngTemplateOutlet]="content" />
          </gn-tooltip-trigger>
          <gn-tooltip-content>{{ tooltip() }}</gn-tooltip-content>
        </gn-tooltip>
      </gn-tooltip-provider>
    } @else {
      <ng-container [ngTemplateOutlet]="content" />
    }
  `,
  host: {
    'data-slot': 'sidebar-menu-button',
    'data-sidebar': 'menu-button',
    '[attr.data-size]': 'size()',
    '[attr.data-active]': 'isActive()',
    '[class]': 'computedClass()',
  },
})
export class SidebarMenuButton {
  protected readonly service = inject(SidebarService);

  /** Marks the active route. Mirrors React `isActive`. */
  readonly isActive = input<boolean>(false);
  /** Visual treatment. Mirrors React `variant`. */
  readonly variant =
    input<
      NonNullable<VariantProps<typeof sidebarMenuButtonVariants>['variant']>
    >('default');
  /** Row size. Mirrors React `size`. */
  readonly size =
    input<NonNullable<VariantProps<typeof sidebarMenuButtonVariants>['size']>>(
      'default',
    );
  /** Tooltip shown when collapsed. Mirrors React `tooltip` (string contract). */
  readonly tooltip = input<string | undefined>(undefined);

  /**
   * Mirrors React's `hidden={state !== 'collapsed' || isMobile}` on the
   * `TooltipContent`: the tooltip only surfaces when one is set and the
   * sidebar is collapsed on desktop.
   */
  protected readonly tooltipVisible = computed(
    () =>
      Boolean(this.tooltip()) &&
      this.service.state() === 'collapsed' &&
      !this.service.isMobile(),
  );

  protected readonly computedClass = computed(() =>
    cn(
      sidebarMenuButtonVariants({ variant: this.variant(), size: this.size() }),
    ),
  );
}

/**
 * SidebarMenuAction — a trailing action for a menu item. Mirrors React
 * `SidebarMenuAction`.
 */
@Component({
  selector: 'gn-sidebar-menu-action, button[gn-sidebar-menu-action]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'sidebar-menu-action',
    'data-sidebar': 'menu-action',
    '[class]': 'computedClass()',
  },
})
export class SidebarMenuAction {
  /** Reveal only on row hover/focus. Mirrors React `showOnHover`. */
  readonly showOnHover = input<boolean>(false);

  protected readonly computedClass = computed(() =>
    cn(
      'absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform peer-hover/menu-button:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
      'after:absolute after:-inset-2 md:after:hidden',
      'peer-data-[size=sm]/menu-button:top-1',
      'peer-data-[size=default]/menu-button:top-1.5',
      'peer-data-[size=lg]/menu-button:top-2.5',
      'group-data-[collapsible=icon]:hidden',
      this.showOnHover() &&
        'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground data-[state=open]:opacity-100 md:opacity-0',
    ),
  );
}

/**
 * SidebarMenuBadge — a count/badge on a menu item. Mirrors React
 * `SidebarMenuBadge`.
 */
@Component({
  selector: 'gn-sidebar-menu-badge',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'sidebar-menu-badge',
    'data-sidebar': 'menu-badge',
    class:
      'pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground peer-data-[size=sm]/menu-button:top-1 peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 group-data-[collapsible=icon]:hidden',
  },
})
export class SidebarMenuBadge {}

/**
 * SidebarMenuSkeleton — a loading placeholder row. Mirrors React
 * `SidebarMenuSkeleton`. The skeleton blocks are inlined (no Angular Skeleton
 * dependency) using the same pulsing-accent treatment.
 */
@Component({
  selector: 'gn-sidebar-menu-skeleton',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (showIcon()) {
      <div
        data-sidebar="menu-skeleton-icon"
        class="size-4 animate-pulse rounded-md bg-accent"
      ></div>
    }
    <div
      data-sidebar="menu-skeleton-text"
      class="h-4 max-w-(--skeleton-width) flex-1 animate-pulse rounded-md bg-accent"
      [style.--skeleton-width]="width"
    ></div>
  `,
  host: {
    'data-slot': 'sidebar-menu-skeleton',
    'data-sidebar': 'menu-skeleton',
    class: 'flex h-8 items-center gap-2 rounded-md px-2',
  },
})
export class SidebarMenuSkeleton {
  /** Whether to render a leading icon placeholder. Mirrors React `showIcon`. */
  readonly showIcon = input<boolean>(false);

  /** Random text width (50–90%) so stacked skeletons feel organic. */
  protected readonly width = `${Math.floor(Math.random() * 40) + 50}%`;
}

/**
 * SidebarMenuSub — a nested sub-list under a menu item. Mirrors React
 * `SidebarMenuSub`.
 */
@Component({
  selector: 'gn-sidebar-menu-sub, ul[gn-sidebar-menu-sub]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'sidebar-menu-sub',
    'data-sidebar': 'menu-sub',
    class:
      'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5 group-data-[collapsible=icon]:hidden',
  },
})
export class SidebarMenuSub {}

/**
 * SidebarMenuSubItem — one row in a SidebarMenuSub. Mirrors React
 * `SidebarMenuSubItem`.
 */
@Component({
  selector: 'gn-sidebar-menu-sub-item, li[gn-sidebar-menu-sub-item]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'sidebar-menu-sub-item',
    'data-sidebar': 'menu-sub-item',
    class: 'group/menu-sub-item relative',
  },
})
export class SidebarMenuSubItem {}

/**
 * SidebarMenuSubButton — the clickable entry inside a SidebarMenuSub. Mirrors
 * React `SidebarMenuSubButton`.
 */
@Component({
  selector: 'gn-sidebar-menu-sub-button, a[gn-sidebar-menu-sub-button]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'sidebar-menu-sub-button',
    'data-sidebar': 'menu-sub-button',
    '[attr.data-size]': 'size()',
    '[attr.data-active]': 'isActive()',
    '[class]': 'computedClass()',
  },
})
export class SidebarMenuSubButton {
  /** Row size. Mirrors React `size`. */
  readonly size = input<'sm' | 'md'>('md');
  /** Marks the active route. Mirrors React `isActive`. */
  readonly isActive = input<boolean>(false);

  protected readonly computedClass = computed(() =>
    cn(
      'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground',
      'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
      this.size() === 'sm' && 'text-xs',
      this.size() === 'md' && 'text-sm',
      'group-data-[collapsible=icon]:hidden',
    ),
  );
}

export { sidebarMenuButtonVariants };
