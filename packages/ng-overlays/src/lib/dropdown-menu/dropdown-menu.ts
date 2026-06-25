import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { BrnPopover, BrnPopoverTrigger } from '@spartan-ng/brain/popover';
import { cn } from '@gremorie/ng-core';

/**
 * DropdownMenu — verb-led action menu attached to a trigger. Mirrors React
 * `DropdownMenu` from `@gremorie/rx-overlays`.
 *
 * Use for **actions** — Edit, Delete, Duplicate, Open in new tab. Distinct from
 * Select, which holds **values** (USA, Brazil, Japan). When the items read like
 * verbs, this is the right primitive.
 *
 * React parity:
 * - Every Radix sub-component is reproduced 1:1 with the same `data-slot` names
 *   and verbatim Tailwind class strings: `DropdownMenu`, `DropdownMenuPortal`,
 *   `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuGroup`,
 *   `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`,
 *   `DropdownMenuRadioItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`,
 *   `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubTrigger`,
 *   `DropdownMenuSubContent`.
 * - `DropdownMenuItem` keeps the `variant` ('default' | 'destructive') and
 *   `inset` props plus the matching `data-variant` / `data-inset` attributes.
 *
 * DIVERGENCE — behavior library. React composes Radix `DropdownMenu`.
 * `@spartan-ng/brain` ships **no** dropdown-menu / menu primitive, so the
 * Angular edition builds the menu on `BrnPopover` (CDK overlay), exactly like
 * `OpenIn` in `@gremorie/ng-ai`. The trigger renders a
 * `<button [brnPopoverTriggerFor]="content()">`; the content/items are plain
 * styled `<div>` / `<button>` elements carrying the React menu Tailwind classes
 * and `data-slot` names. Brain's popover content must live in a
 * `<ng-template brnPopoverContent>` referenced by the trigger via
 * `brnPopoverTriggerFor`; the consumer wires those two.
 *
 * DIVERGENCE — sub-menus. Brain popover does not provide nested submenu
 * behavior, so `DropdownMenuSub` / `DropdownMenuSubTrigger` /
 * `DropdownMenuSubContent` are rendered as styled placeholders that still carry
 * the correct `data-slot` names and class strings. A true nested submenu would
 * require a second popover composed by the consumer.
 */
@Component({
  selector: 'gn-dropdown-menu',
  standalone: true,
  hostDirectives: [BrnPopover],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { 'data-slot': 'dropdown-menu', class: 'contents' },
})
export class DropdownMenu {}

@Component({
  selector: 'gn-dropdown-menu-portal',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { 'data-slot': 'dropdown-menu-portal', class: 'contents' },
})
export class DropdownMenuPortal {}

@Component({
  selector: 'gn-dropdown-menu-trigger',
  standalone: true,
  imports: [BrnPopoverTrigger],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" [brnPopoverTriggerFor]="content()" [class]="class()">
      <ng-content />
    </button>
  `,
  host: { 'data-slot': 'dropdown-menu-trigger', class: 'inline-flex' },
})
export class DropdownMenuTrigger {
  /** Template ref of the `<ng-template brnPopoverContent>` to open. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly content = input.required<any>();
  readonly class = input<string>();
}

@Component({
  selector: 'gn-dropdown-menu-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'dropdown-menu-content',
    '[class]': 'hostClass()',
  },
})
export class DropdownMenuContent {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      'z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
      this.class(),
    ),
  );
}

@Component({
  selector: 'gn-dropdown-menu-group',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'dropdown-menu-group',
    class: 'contents',
    role: 'group',
  },
})
export class DropdownMenuGroup {}

@Component({
  selector: 'gn-dropdown-menu-item',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'dropdown-menu-item',
    '[attr.data-inset]': 'inset() ? "" : null',
    '[attr.data-variant]': 'variant()',
    '[class]': 'hostClass()',
  },
})
export class DropdownMenuItem {
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
  selector: 'gn-dropdown-menu-checkbox-item',
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
    'data-slot': 'dropdown-menu-checkbox-item',
    role: 'menuitemcheckbox',
    '[attr.aria-checked]': 'checked()',
    '[class]': 'hostClass()',
  },
})
export class DropdownMenuCheckboxItem {
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
  selector: 'gn-dropdown-menu-radio-group',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'dropdown-menu-radio-group',
    class: 'contents',
    role: 'radiogroup',
  },
})
export class DropdownMenuRadioGroup {}

@Component({
  selector: 'gn-dropdown-menu-radio-item',
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
    'data-slot': 'dropdown-menu-radio-item',
    role: 'menuitemradio',
    '[attr.aria-checked]': 'checked()',
    '[class]': 'hostClass()',
  },
})
export class DropdownMenuRadioItem {
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
  selector: 'gn-dropdown-menu-label',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'dropdown-menu-label',
    '[attr.data-inset]': 'inset() ? "" : null',
    '[class]': 'hostClass()',
  },
})
export class DropdownMenuLabel {
  readonly inset = input<boolean>(false);
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', this.class()),
  );
}

@Component({
  selector: 'gn-dropdown-menu-separator',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  host: {
    'data-slot': 'dropdown-menu-separator',
    role: 'separator',
    '[class]': 'hostClass()',
  },
})
export class DropdownMenuSeparator {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('-mx-1 my-1 h-px bg-border', this.class()),
  );
}

@Component({
  selector: 'gn-dropdown-menu-shortcut',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'dropdown-menu-shortcut',
    '[class]': 'hostClass()',
  },
})
export class DropdownMenuShortcut {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('ml-auto text-xs tracking-widest text-muted-foreground', this.class()),
  );
}

@Component({
  selector: 'gn-dropdown-menu-sub',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { 'data-slot': 'dropdown-menu-sub', class: 'contents' },
})
export class DropdownMenuSub {}

@Component({
  selector: 'gn-dropdown-menu-sub-trigger',
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
      class="ml-auto size-4"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  `,
  host: {
    'data-slot': 'dropdown-menu-sub-trigger',
    '[attr.data-inset]': 'inset() ? "" : null',
    '[class]': 'hostClass()',
  },
})
export class DropdownMenuSubTrigger {
  readonly inset = input<boolean>(false);
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[inset]:pl-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
      this.class(),
    ),
  );
}

@Component({
  selector: 'gn-dropdown-menu-sub-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'dropdown-menu-sub-content',
    '[class]': 'hostClass()',
  },
})
export class DropdownMenuSubContent {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      'z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
      this.class(),
    ),
  );
}
