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
 * ModelSelector — a command-palette model picker. Mirrors React
 * `ModelSelector` from `@gremorie/rx-ai`.
 *
 * React parity:
 * - React composes a `Dialog` whose body is a `Command` palette (input + list
 *   + groups + items, with provider logos / names / shortcuts).
 * - Sub-components map 1:1 to the React surface (`ModelSelectorTrigger`,
 *   `ModelSelectorContent`, `ModelSelectorInput`, `ModelSelectorList`,
 *   `ModelSelectorEmpty`, `ModelSelectorGroup`, `ModelSelectorItem`,
 *   `ModelSelectorShortcut`, `ModelSelectorSeparator`, `ModelSelectorLogo`,
 *   `ModelSelectorLogoGroup`, `ModelSelectorName`). `data-slot` names match.
 * - The searchable list is backed by `@spartan-ng/brain/command` directives
 *   (the load-bearing behavior — filtering, keyboard nav, selection).
 *
 * Divergence: React wraps the palette in a Radix `Dialog` overlay. Brain's
 * dialog is an overlay-service primitive that does not compose as a simple
 * inline child; to keep the compound API and a reliable template typecheck,
 * `ModelSelectorContent` renders the same palette inline as a popover-style
 * panel. Consumers needing a true modal can host `<model-selector-content>`
 * inside their own `BrnDialog`. The `ModelSelectorDialog` alias is provided for
 * API parity and renders the same inline panel.
 */
@Component({
  selector: 'model-selector',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { 'data-slot': 'model-selector', class: 'contents' },
})
export class ModelSelector {}

@Component({
  selector: 'model-selector-trigger',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { 'data-slot': 'model-selector-trigger', class: 'contents' },
})
export class ModelSelectorTrigger {}

@Component({
  selector: 'model-selector-content',
  standalone: true,
  hostDirectives: [BrnCommand],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="sr-only">{{ title() }}</h2>
    <div class="flex h-full w-full flex-col overflow-hidden">
      <ng-content />
    </div>
  `,
  host: {
    'data-slot': 'model-selector-content',
    '[class]': 'hostClass()',
  },
})
export class ModelSelectorContent {
  /** Accessible dialog title (React `title`, default "Model Selector"). */
  readonly title = input<string>('Model Selector');
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      'block overflow-hidden rounded-md border bg-popover p-0 text-popover-foreground shadow-md',
      this.class(),
    ),
  );
}

/** Alias of `ModelSelectorContent` for React `ModelSelectorDialog` parity. */
@Component({
  selector: 'model-selector-dialog',
  standalone: true,
  hostDirectives: [BrnCommand],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-full w-full flex-col overflow-hidden">
      <ng-content />
    </div>
  `,
  host: {
    'data-slot': 'model-selector-dialog',
    '[class]': 'hostClass()',
  },
})
export class ModelSelectorDialog {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      'block overflow-hidden rounded-md border bg-popover p-0 text-popover-foreground shadow-md',
      this.class(),
    ),
  );
}

@Component({
  selector: 'model-selector-input',
  standalone: true,
  imports: [BrnCommandInput],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex items-center border-b px-3"
      data-slot="command-input-wrapper"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="mr-2 size-4 shrink-0 opacity-50"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        brnCommandInput
        [placeholder]="placeholder()"
        [class]="inputClass()"
      />
    </div>
  `,
  host: { 'data-slot': 'model-selector-input', class: 'block' },
})
export class ModelSelectorInput {
  readonly placeholder = input<string>('Search models…');
  readonly class = input<string>();
  protected readonly inputClass = computed(() =>
    cn(
      'flex h-auto w-full rounded-md bg-transparent py-3.5 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
      this.class(),
    ),
  );
}

@Component({
  selector: 'model-selector-list',
  standalone: true,
  imports: [BrnCommandList],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div brnCommandList [class]="listClass()"><ng-content /></div>`,
  host: { 'data-slot': 'model-selector-list', class: 'block' },
})
export class ModelSelectorList {
  readonly class = input<string>();
  protected readonly listClass = computed(() =>
    cn('max-h-[300px] overflow-y-auto overflow-x-hidden', this.class()),
  );
}

@Component({
  selector: 'model-selector-empty',
  standalone: true,
  imports: [BrnCommandEmpty],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // brnCommandEmpty is a STRUCTURAL directive (it injects TemplateRef and
  // renders only when the list has no visible items). It must be used with the
  // `*` prefix on an ng-template — `<div brnCommandEmpty>` raised NG0201 (No
  // provider for TemplateRef). Mirrors the spartan reference usage
  // `<div *brnCommandEmpty hlmCommandEmpty>`.
  template: `<div *brnCommandEmpty [class]="emptyClass()"><ng-content /></div>`,
  host: { 'data-slot': 'model-selector-empty', class: 'block' },
})
export class ModelSelectorEmpty {
  readonly class = input<string>();
  protected readonly emptyClass = computed(() =>
    cn('py-6 text-center text-sm', this.class()),
  );
}

@Component({
  selector: 'model-selector-group',
  standalone: true,
  imports: [BrnCommandGroup],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div brnCommandGroup [class]="groupClass()"><ng-content /></div>`,
  host: { 'data-slot': 'model-selector-group', class: 'block' },
})
export class ModelSelectorGroup {
  readonly class = input<string>();
  protected readonly groupClass = computed(() =>
    cn('overflow-hidden p-1 text-foreground', this.class()),
  );
}

@Component({
  selector: 'model-selector-item',
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
  host: { 'data-slot': 'model-selector-item', class: 'block' },
})
export class ModelSelectorItem {
  /** Search value (BrnCommandItem requires a value; React derives it from text). */
  readonly value = input.required<string>();
  readonly disabled = input<boolean>(false);
  readonly class = input<string>();
  protected readonly itemClass = computed(() =>
    cn(
      'relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
      this.class(),
    ),
  );
}

@Component({
  selector: 'model-selector-shortcut',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'model-selector-shortcut',
    '[class]': 'hostClass()',
  },
})
export class ModelSelectorShortcut {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('ml-auto text-xs tracking-widest text-muted-foreground', this.class()),
  );
}

@Component({
  selector: 'model-selector-separator',
  standalone: true,
  imports: [BrnCommandSeparator],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div brnCommandSeparator [class]="sepClass()"></div>`,
  host: { 'data-slot': 'model-selector-separator', class: 'block' },
})
export class ModelSelectorSeparator {
  readonly class = input<string>();
  protected readonly sepClass = computed(() =>
    cn('-mx-1 h-px bg-border', this.class()),
  );
}

@Component({
  selector: 'model-selector-logo',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <img
      [src]="src()"
      [alt]="provider() + ' logo'"
      width="12"
      height="12"
      [class]="imgClass()"
    />
  `,
  host: { 'data-slot': 'model-selector-logo', class: 'contents' },
})
export class ModelSelectorLogo {
  /** Provider key (e.g. "anthropic"); resolves to models.dev/logos/<provider>.svg. */
  readonly provider = input.required<string>();
  readonly class = input<string>();
  protected readonly src = computed(
    () => `https://models.dev/logos/${this.provider()}.svg`,
  );
  protected readonly imgClass = computed(() =>
    cn('size-3 dark:invert', this.class()),
  );
}

@Component({
  selector: 'model-selector-logo-group',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'model-selector-logo-group',
    '[class]': 'hostClass()',
  },
})
export class ModelSelectorLogoGroup {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      '-space-x-1 flex shrink-0 items-center [&>img]:rounded-full [&>img]:bg-background [&>img]:p-px [&>img]:ring-1 dark:[&>img]:bg-foreground',
      this.class(),
    ),
  );
}

@Component({
  selector: 'model-selector-name',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'model-selector-name',
    '[class]': 'hostClass()',
  },
})
export class ModelSelectorName {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('flex-1 truncate text-left', this.class()),
  );
}
