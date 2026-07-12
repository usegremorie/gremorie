import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Injectable,
  input,
  model,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';

/**
 * Coordinates which top-level menu is open within a single Menubar so that
 * opening one closes the others — the desktop menu-bar behavior React gets
 * from Radix Menubar. There is no spartan brain `menu` primitive, so the open
 * state is hand-rolled here to match the Radix API surface (root, menu,
 * trigger, content, items, sub-menus).
 */
@Injectable()
export class MenubarService {
  readonly openMenu = signal<string | undefined>(undefined);

  toggle(id: string): void {
    this.openMenu.update((current) => (current === id ? undefined : id));
  }

  open(id: string): void {
    this.openMenu.set(id);
  }

  close(): void {
    this.openMenu.set(undefined);
  }

  isOpen(id: string): boolean {
    return this.openMenu() === id;
  }
}

/**
 * Per-menu state shared between a `gr-menubar-menu`, its trigger and its
 * content so they resolve the same id.
 */
@Injectable()
export class MenubarMenuState {
  private static _counter = 0;
  readonly id = `gr-menubar-menu-${MenubarMenuState._counter++}`;
}

/**
 * Menubar — desktop-app-style menu bar. Mirrors React `Menubar` from
 * `@gremorie/rx-navigation`, which wraps Radix Menubar.
 *
 * Use for **classic File / Edit / View / Help bars** at the top of a window in
 * desktop-style web apps (code editors, spreadsheets, image editors). For
 * everything else — nav menus, action menus, settings — Menubar's siblings
 * (DropdownMenu or NavigationMenu) win.
 *
 * Supports nested submenus, checkbox items, radio items and keyboard
 * shortcuts via `gr-menubar-shortcut`.
 *
 * Divergence vs. React/Radix: there is no spartan brain `menu` primitive, so
 * open/close is driven by `MenubarService` (a small Angular DI controller)
 * rather than Radix's machine. The element API, `data-slot` names and classes
 * match the React edition; checkbox/radio items are uncontrolled-friendly via
 * a `checked` model.
 */
@Component({
  selector: 'gr-menubar',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MenubarService],
  template: `<ng-content />`,
  host: {
    'data-slot': 'menubar',
    class:
      'flex h-9 items-center gap-1 rounded-md border bg-background p-1 shadow-xs',
  },
})
export class Menubar {}

/**
 * MenubarMenu — one top-level menu (trigger + content). Mirrors React
 * `MenubarMenu`. Provides its own id to the trigger and content.
 */
@Component({
  selector: 'gr-menubar-menu',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MenubarMenuState],
  template: `<ng-content />`,
  host: {
    'data-slot': 'menubar-menu',
    class: 'relative',
  },
})
export class MenubarMenu {}

/**
 * MenubarTrigger — opens this menu. Mirrors React `MenubarTrigger`. Reflects
 * `data-state` and toggles the shared open state.
 */
@Component({
  selector: 'gr-menubar-trigger',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      data-slot="menubar-trigger"
      [attr.data-state]="state()"
      [class]="computedClass()"
      (click)="toggle()"
    >
      <ng-content />
    </button>
  `,
  host: {
    class: 'contents',
  },
})
export class MenubarTrigger {
  private readonly service = inject(MenubarService);
  private readonly menu = inject(MenubarMenuState);

  protected readonly state = computed(() =>
    this.service.openMenu() === this.menu.id ? 'open' : 'closed',
  );

  protected readonly computedClass = computed(() =>
    cn(
      'flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
    ),
  );

  protected toggle(): void {
    this.service.toggle(this.menu.id);
  }
}

/**
 * MenubarContent — the dropdown panel for a menu. Mirrors React
 * `MenubarContent`. Shown only while its menu is open.
 */
@Component({
  selector: 'gr-menubar-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div
        data-slot="menubar-content"
        [attr.data-state]="'open'"
        class="absolute z-50 mt-1 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
      >
        <ng-content />
      </div>
    }
  `,
  host: {
    class: 'contents',
  },
})
export class MenubarContent {
  private readonly service = inject(MenubarService);
  private readonly menu = inject(MenubarMenuState);

  protected readonly isOpen = computed(
    () => this.service.openMenu() === this.menu.id,
  );
}

/**
 * MenubarGroup — semantic grouping of items. Mirrors React `MenubarGroup`.
 */
@Component({
  selector: 'gr-menubar-group',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'menubar-group',
    role: 'group',
  },
})
export class MenubarGroup {}

/**
 * MenubarRadioGroup — groups radio items. Mirrors React `MenubarRadioGroup`.
 */
@Component({
  selector: 'gr-menubar-radio-group',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'menubar-radio-group',
    role: 'group',
  },
})
export class MenubarRadioGroup {}

/**
 * MenubarItem — a single action row. Mirrors React `MenubarItem`. Supports
 * `inset` (left padding for alignment) and a `destructive` variant.
 */
@Component({
  selector: 'gr-menubar-item',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'menubar-item',
    role: 'menuitem',
    '[attr.data-inset]': 'inset() || null',
    '[attr.data-variant]': 'variant()',
    '[class]': 'computedClass()',
  },
})
export class MenubarItem {
  /** Adds left padding so the label aligns with checkbox/radio items. Mirrors React `inset`. */
  readonly inset = input<boolean>(false);
  /** `default` or `destructive`. Mirrors React `variant`. */
  readonly variant = input<'default' | 'destructive'>('default');

  protected readonly computedClass = computed(() =>
    cn(
      "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!",
    ),
  );
}

/**
 * MenubarCheckboxItem — a toggleable item with a check indicator. Mirrors
 * React `MenubarCheckboxItem`. `checked` is a two-way model.
 */
@Component({
  selector: 'gr-menubar-checkbox-item',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center"
    >
      @if (checked()) {
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
          <path d="M20 6 9 17l-5-5" />
        </svg>
      }
    </span>
    <ng-content />
  `,
  host: {
    'data-slot': 'menubar-checkbox-item',
    role: 'menuitemcheckbox',
    '[attr.aria-checked]': 'checked()',
    '[class]': 'computedClass()',
    '(click)': 'toggle()',
  },
})
export class MenubarCheckboxItem {
  /** Whether the item is checked (two-way). Mirrors React `checked`. */
  readonly checked = model<boolean>(false);

  protected readonly computedClass = computed(() =>
    cn(
      "relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    ),
  );

  protected toggle(): void {
    this.checked.update((value) => !value);
  }
}

/**
 * MenubarRadioItem — a single-choice item with a dot indicator. Mirrors React
 * `MenubarRadioItem`.
 */
@Component({
  selector: 'gr-menubar-radio-item',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center"
    >
      @if (checked()) {
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      }
    </span>
    <ng-content />
  `,
  host: {
    'data-slot': 'menubar-radio-item',
    role: 'menuitemradio',
    '[attr.aria-checked]': 'checked()',
    '[attr.data-value]': 'value()',
    '[class]': 'computedClass()',
  },
})
export class MenubarRadioItem {
  /** This option's value. Mirrors React `value`. */
  readonly value = input<string>('');
  /** Whether this option is the selected one. */
  readonly checked = input<boolean>(false);

  protected readonly computedClass = computed(() =>
    cn(
      "relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    ),
  );
}

/**
 * MenubarLabel — a non-interactive section label. Mirrors React
 * `MenubarLabel`.
 */
@Component({
  selector: 'gr-menubar-label',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'menubar-label',
    '[attr.data-inset]': 'inset() || null',
    '[class]': 'computedClass()',
  },
})
export class MenubarLabel {
  /** Left padding to align with checkbox/radio items. Mirrors React `inset`. */
  readonly inset = input<boolean>(false);

  protected readonly computedClass = computed(() =>
    cn('px-2 py-1.5 text-sm font-medium data-[inset]:pl-8'),
  );
}

/**
 * MenubarSeparator — a thin divider between groups. Mirrors React
 * `MenubarSeparator`.
 */
@Component({
  selector: 'gr-menubar-separator',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'menubar-separator',
    role: 'separator',
    class: '-mx-1 my-1 h-px bg-border',
  },
})
export class MenubarSeparator {}

/**
 * MenubarShortcut — right-aligned keyboard hint. Mirrors React
 * `MenubarShortcut`.
 */
@Component({
  selector: 'gr-menubar-shortcut',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'menubar-shortcut',
    class: 'ml-auto text-xs tracking-widest text-muted-foreground',
  },
})
export class MenubarShortcut {}

/**
 * MenubarSub — a nested submenu wrapper. Mirrors React `MenubarSub`.
 */
@Component({
  selector: 'gr-menubar-sub',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'menubar-sub',
    class: 'relative',
    '(mouseenter)': 'open.set(true)',
    '(mouseleave)': 'open.set(false)',
  },
})
export class MenubarSub {
  /** Whether the submenu is open (hover-driven). */
  readonly open = signal<boolean>(false);
}

/**
 * MenubarSubTrigger — opens a submenu (renders a trailing chevron). Mirrors
 * React `MenubarSubTrigger`.
 */
@Component({
  selector: 'gr-menubar-sub-trigger',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content />
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="ml-auto h-4 w-4"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  `,
  host: {
    'data-slot': 'menubar-sub-trigger',
    '[attr.data-inset]': 'inset() || null',
    '[attr.data-state]': 'sub.open() ? "open" : "closed"',
    '[class]': 'computedClass()',
  },
})
export class MenubarSubTrigger {
  protected readonly sub = inject(MenubarSub);

  /** Left padding to align with checkbox/radio items. Mirrors React `inset`. */
  readonly inset = input<boolean>(false);

  protected readonly computedClass = computed(() =>
    cn(
      'flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none focus:bg-accent focus:text-accent-foreground data-[inset]:pl-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
    ),
  );
}

/**
 * MenubarSubContent — the nested submenu panel. Mirrors React
 * `MenubarSubContent`. Shown while its parent `gr-menubar-sub` is hovered.
 */
@Component({
  selector: 'gr-menubar-sub-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (sub.open()) {
      <div
        data-slot="menubar-sub-content"
        [attr.data-state]="'open'"
        class="absolute top-0 left-full z-50 min-w-[8rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
      >
        <ng-content />
      </div>
    }
  `,
  host: {
    class: 'contents',
  },
})
export class MenubarSubContent {
  protected readonly sub = inject(MenubarSub);
}
