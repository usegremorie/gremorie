import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import {
  BrnCommand,
  BrnCommandEmpty,
  BrnCommandGroup,
  BrnCommandInput,
  BrnCommandItem,
  BrnCommandList,
  BrnCommandSeparator,
} from '@spartan-ng/brain/command';
import { cn } from '@gremorie/ng-core';

/**
 * Command — keyboard-first command palette. Mirrors React `Command` from
 * `@gremorie/rx-overlays`.
 *
 * Use `Command` directly for inline pickers (e.g. inside a Popover for the
 * Combobox pattern); use `CommandDialog` for the canonical Cmd+K palette.
 * Group items by intent (Navigation, Actions, Recent).
 *
 * React parity:
 * - Sub-components map 1:1 to the React surface (`Command`, `CommandDialog`,
 *   `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`,
 *   `CommandItem`, `CommandShortcut`, `CommandSeparator`). `data-slot` names
 *   match and the command-* Tailwind class strings are copied verbatim.
 * - The searchable list is backed by `@spartan-ng/brain/command` directives
 *   (the load-bearing behavior — filtering, keyboard nav, selection), exactly
 *   like `ModelSelector` in `@gremorie/ng-ai`.
 *
 * DIVERGENCE — CommandItem value. `BrnCommandItem` requires a `value` input for
 * search/filtering; React's cmdk derives the value from the item's text. So
 * `CommandItem` exposes a required `value` input (and an optional `disabled`).
 *
 * DIVERGENCE — CommandDialog. React wraps `Command` in a `Dialog` overlay.
 * There is no dialog primitive in this package's scope, so `CommandDialog`
 * renders the same palette inline as a popover-style panel with an sr-only
 * title/description (like `ModelSelector`). A true modal would compose
 * `gr-dialog` from the dialog family around `<gr-command>`.
 */
@Component({
  selector: 'gr-command',
  standalone: true,
  // BrnCommand on the HOST via hostDirectives (not an internal `<div brnCommand>`)
  // so the BrnCommandToken it provides reaches the <ng-content>-projected
  // children (input/list/group/item/empty). On an internal div the projected
  // children can't see it → NG0201. Mirrors the spartan reference `hlm-command`.
  hostDirectives: [BrnCommand],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="flex h-full w-full flex-col overflow-hidden">
    <ng-content />
  </div>`,
  host: {
    'data-slot': 'command',
    '[class]': 'hostClass()',
  },
})
export class Command {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
      this.class(),
    ),
  );
}

/**
 * Inline command-palette container with an sr-only accessible title /
 * description. Divergence alias of `Command` for React `CommandDialog` parity.
 */
@Component({
  selector: 'gr-command-dialog',
  standalone: true,
  hostDirectives: [BrnCommand],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="sr-only">{{ title() }}</h2>
    <p class="sr-only">{{ description() }}</p>
    <div
      class="flex h-full w-full flex-col overflow-hidden **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
    >
      <ng-content />
    </div>
  `,
  host: {
    'data-slot': 'command-dialog',
    '[class]': 'hostClass()',
  },
})
export class CommandDialog {
  readonly title = input<string>('Command Palette');
  readonly description = input<string>('Search for a command to run...');
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      'block overflow-hidden rounded-md border bg-popover p-0 text-popover-foreground shadow-md',
      this.class(),
    ),
  );
}

@Component({
  selector: 'gr-command-input',
  standalone: true,
  imports: [BrnCommandInput],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      data-slot="command-input-wrapper"
      class="flex h-9 items-center gap-2 border-b px-3"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="size-4 shrink-0 opacity-50"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        brnCommandInput
        data-slot="command-input"
        [placeholder]="placeholder()"
        [class]="inputClass()"
      />
    </div>
  `,
  host: { 'data-slot': 'command-input', class: 'block' },
})
export class CommandInput {
  readonly placeholder = input<string>('Type a command or search...');
  readonly class = input<string>();
  protected readonly inputClass = computed(() =>
    cn(
      'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
      this.class(),
    ),
  );
}

@Component({
  selector: 'gr-command-list',
  standalone: true,
  imports: [BrnCommandList],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div brnCommandList [class]="listClass()"><ng-content /></div>`,
  host: { 'data-slot': 'command-list', class: 'block' },
})
export class CommandList {
  readonly class = input<string>();
  protected readonly listClass = computed(() =>
    cn(
      'max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto',
      this.class(),
    ),
  );
}

@Component({
  selector: 'gr-command-empty',
  standalone: true,
  imports: [BrnCommandEmpty],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // brnCommandEmpty is STRUCTURAL (injects TemplateRef, renders only when the
  // list has no visible items) — must use the `*` prefix, not a plain attribute
  // on a <div>, which raised NG0201 (No provider for TemplateRef).
  template: `<div *brnCommandEmpty class="py-6 text-center text-sm">
    <ng-content />
  </div>`,
  host: { 'data-slot': 'command-empty', class: 'block' },
})
export class CommandEmpty {}

@Component({
  selector: 'gr-command-group',
  standalone: true,
  imports: [BrnCommandGroup],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div brnCommandGroup [class]="groupClass()"><ng-content /></div>`,
  host: { 'data-slot': 'command-group', class: 'block' },
})
export class CommandGroup {
  readonly class = input<string>();
  protected readonly groupClass = computed(() =>
    cn(
      'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
      this.class(),
    ),
  );
}

@Component({
  selector: 'gr-command-separator',
  standalone: true,
  imports: [BrnCommandSeparator],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div brnCommandSeparator [class]="sepClass()"></div>`,
  host: { 'data-slot': 'command-separator', class: 'block' },
})
export class CommandSeparator {
  readonly class = input<string>();
  protected readonly sepClass = computed(() =>
    cn('-mx-1 h-px bg-border', this.class()),
  );
}

@Component({
  selector: 'gr-command-item',
  standalone: true,
  imports: [BrnCommandItem],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      brnCommandItem
      [value]="value()"
      [disabled]="disabled()"
      [class]="itemClass()"
    >
      <ng-content />
    </button>
  `,
  host: { 'data-slot': 'command-item', class: 'block' },
})
export class CommandItem {
  /** Search value (BrnCommandItem requires a value; React derives it from text). */
  readonly value = input.required<string>();
  readonly disabled = input<boolean>(false);
  readonly class = input<string>();
  protected readonly itemClass = computed(() =>
    cn(
      "relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
      this.class(),
    ),
  );
}

@Component({
  selector: 'gr-command-shortcut',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'command-shortcut',
    '[class]': 'hostClass()',
  },
})
export class CommandShortcut {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('ml-auto text-xs tracking-widest text-muted-foreground', this.class()),
  );
}
