import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { BrnPopover, BrnPopoverTrigger } from '@spartan-ng/brain/popover';
import { cn } from '@gremorie/ng-core';

/**
 * ContextMenu — secondary action menu invoked via right-click. Mirrors React
 * `ContextMenu` from `@gremorie/rx-overlays`.
 *
 * Right-click is a power-user accelerator — never the only path to an action.
 * Same shape as DropdownMenu (items, groups, separators, sub-menus, checkbox /
 * radio variants). Anchors to a region rather than a trigger button — wrap the
 * region in `<gn-context-menu-trigger>`.
 *
 * React parity:
 * - Every Radix sub-component is reproduced 1:1 with the same `data-slot` names
 *   and verbatim Tailwind class strings: `ContextMenu`, `ContextMenuTrigger`,
 *   `ContextMenuContent`, `ContextMenuItem`, `ContextMenuCheckboxItem`,
 *   `ContextMenuRadioItem`, `ContextMenuLabel`, `ContextMenuSeparator`,
 *   `ContextMenuShortcut`, `ContextMenuGroup`, `ContextMenuPortal`,
 *   `ContextMenuSub`, `ContextMenuSubContent`, `ContextMenuSubTrigger`,
 *   `ContextMenuRadioGroup`.
 * - `ContextMenuItem` keeps `variant` ('default' | 'destructive') and `inset`
 *   plus the matching `data-variant` / `data-inset` attributes.
 *
 * DIVERGENCE — behavior library. React composes Radix `ContextMenu`.
 * `@spartan-ng/brain` ships **no** context-menu / menu primitive, so the
 * Angular edition builds the menu on `BrnPopover` (CDK overlay), like `OpenIn`
 * and `DropdownMenu`. The content/items are styled `<div>` / `<button>`
 * elements carrying the React Tailwind classes and `data-slot` names.
 *
 * DIVERGENCE — right-click. Radix opens on right-click; brain popover opens on
 * click. `ContextMenuTrigger` wires a native `(contextmenu)` handler that
 * `preventDefault()`s the browser menu and opens the brain popover. The popover
 * still anchors to the trigger element rather than the exact pointer position
 * (CDK origin-anchored overlay); precise pointer placement is not wired.
 *
 * DIVERGENCE — sub-menus. Brain popover does not provide nested submenu
 * behavior, so `ContextMenuSub` / `ContextMenuSubTrigger` /
 * `ContextMenuSubContent` are styled placeholders that still carry the correct
 * `data-slot` names and class strings.
 */
@Component({
  selector: 'gn-context-menu',
  standalone: true,
  hostDirectives: [BrnPopover],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { 'data-slot': 'context-menu', class: 'contents' },
})
export class ContextMenu {}

@Component({
  selector: 'gn-context-menu-trigger',
  standalone: true,
  imports: [BrnPopoverTrigger],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [brnPopoverTriggerFor]="content()"
      [class]="class()"
      (contextmenu)="onContextMenu($event)"
    >
      <ng-content />
    </button>
  `,
  host: { 'data-slot': 'context-menu-trigger', class: 'block' },
})
export class ContextMenuTrigger {
  /** Template ref of the `<ng-template brnPopoverContent>` to open. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly content = input.required<any>();
  readonly class = input<string>();
  private readonly popover = inject(BrnPopover);

  protected onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.popover.open();
  }
}

@Component({
  selector: 'gn-context-menu-portal',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { 'data-slot': 'context-menu-portal', class: 'contents' },
})
export class ContextMenuPortal {}

@Component({
  selector: 'gn-context-menu-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'context-menu-content',
    '[class]': 'hostClass()',
  },
})
export class ContextMenuContent {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      'z-50 max-h-(--radix-context-menu-content-available-height) min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
      this.class(),
    ),
  );
}

@Component({
  selector: 'gn-context-menu-group',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { 'data-slot': 'context-menu-group', class: 'contents', role: 'group' },
})
export class ContextMenuGroup {}

@Component({
  selector: 'gn-context-menu-item',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'context-menu-item',
    '[attr.data-inset]': 'inset() ? "" : null',
    '[attr.data-variant]': 'variant()',
    '[class]': 'hostClass()',
  },
})
export class ContextMenuItem {
  readonly inset = input<boolean>(false);
  readonly variant = input<'default' | 'destructive'>('default');
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!",
      this.class(),
    ),
  );
}

@Component({
  selector: 'gn-context-menu-checkbox-item',
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
          aria-hidden="true"
          class="size-4"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      }
    </span>
    <ng-content />
  `,
  host: {
    'data-slot': 'context-menu-checkbox-item',
    role: 'menuitemcheckbox',
    '[attr.aria-checked]': 'checked()',
    '[class]': 'hostClass()',
  },
})
export class ContextMenuCheckboxItem {
  readonly checked = input<boolean>(false);
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      this.class(),
    ),
  );
}

@Component({
  selector: 'gn-context-menu-radio-group',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'context-menu-radio-group',
    class: 'contents',
    role: 'radiogroup',
  },
})
export class ContextMenuRadioGroup {}

@Component({
  selector: 'gn-context-menu-radio-item',
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
          aria-hidden="true"
          class="size-2 fill-current"
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      }
    </span>
    <ng-content />
  `,
  host: {
    'data-slot': 'context-menu-radio-item',
    role: 'menuitemradio',
    '[attr.aria-checked]': 'checked()',
    '[class]': 'hostClass()',
  },
})
export class ContextMenuRadioItem {
  readonly checked = input<boolean>(false);
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      this.class(),
    ),
  );
}

@Component({
  selector: 'gn-context-menu-label',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'context-menu-label',
    '[attr.data-inset]': 'inset() ? "" : null',
    '[class]': 'hostClass()',
  },
})
export class ContextMenuLabel {
  readonly inset = input<boolean>(false);
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      'px-2 py-1.5 text-sm font-medium text-foreground data-[inset]:pl-8',
      this.class(),
    ),
  );
}

@Component({
  selector: 'gn-context-menu-separator',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  host: {
    'data-slot': 'context-menu-separator',
    role: 'separator',
    '[class]': 'hostClass()',
  },
})
export class ContextMenuSeparator {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('-mx-1 my-1 h-px bg-border', this.class()),
  );
}

@Component({
  selector: 'gn-context-menu-shortcut',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'context-menu-shortcut',
    '[class]': 'hostClass()',
  },
})
export class ContextMenuShortcut {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('ml-auto text-xs tracking-widest text-muted-foreground', this.class()),
  );
}

@Component({
  selector: 'gn-context-menu-sub',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { 'data-slot': 'context-menu-sub', class: 'contents' },
})
export class ContextMenuSub {}

@Component({
  selector: 'gn-context-menu-sub-trigger',
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
      aria-hidden="true"
      class="ml-auto"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  `,
  host: {
    'data-slot': 'context-menu-sub-trigger',
    '[attr.data-inset]': 'inset() ? "" : null',
    '[class]': 'hostClass()',
  },
})
export class ContextMenuSubTrigger {
  readonly inset = input<boolean>(false);
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      "flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[inset]:pl-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
      this.class(),
    ),
  );
}

@Component({
  selector: 'gn-context-menu-sub-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'context-menu-sub-content',
    '[class]': 'hostClass()',
  },
})
export class ContextMenuSubContent {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      'z-50 min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
      this.class(),
    ),
  );
}
