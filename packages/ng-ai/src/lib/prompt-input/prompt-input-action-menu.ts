import {
  CdkConnectedOverlay,
  type ConnectedPosition,
} from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  InjectionToken,
  input,
  model,
  output,
  signal,
  ViewChild,
  WritableSignal,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/ng-overlays';

import { MENU_BELOW_START } from '../overlay-positions';
import { PromptInput } from './prompt-input';

/**
 * The action menu, with the anatomy of the React edition (Radix DropdownMenu
 * under the hood there):
 *
 *   prompt-input-action-menu                 root: open state + overlay origin
 *   ├─ prompt-input-action-menu-trigger      ghost icon button (+ by default)
 *   └─ prompt-input-action-menu-content      the menu, in the CDK overlay
 *      ├─ prompt-input-action-menu-item      one action
 *      ├─ prompt-input-action-menu-switch-item  a toggle with a switch
 *      └─ prompt-input-action-add-attachments   opens the file dialog
 *
 * The menu renders in the CDK overlay (outside the component), like the React
 * portal, so an overflow-hidden ancestor (a card) never clips it.
 */
export interface PromptInputActionMenuContext {
  /** Marks every panel of this menu (root and submenus) for outside clicks. */
  readonly menuId: string;
  /** The open submenu, if any (one at a time). */
  readonly activeSub: WritableSignal<object | null>;
  readonly open: () => boolean;
  readonly origin: () => HTMLElement | null;
  setOrigin(el: HTMLElement | null): void;
  setPanel(el: HTMLElement | null): void;
  toggle(): void;
  close(): void;
}

export const PROMPT_INPUT_ACTION_MENU =
  new InjectionToken<PromptInputActionMenuContext>('PromptInputActionMenu');

const ITEM_CLASS =
  "relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-hidden select-none transition-colors hover:bg-accent focus-visible:bg-accent disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0";

let nextMenuId = 0;

@Component({
  selector: 'prompt-input-action-menu',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: PROMPT_INPUT_ACTION_MENU,
      useExisting: forwardRef(() => PromptInputActionMenu),
    },
  ],
  template: `<ng-content />`,
  host: { class: 'inline-flex', 'data-slot': 'prompt-input-action-menu' },
})
export class PromptInputActionMenu implements PromptInputActionMenuContext {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  readonly menuId = `prompt-input-action-menu-${nextMenuId++}`;
  readonly activeSub = signal<object | null>(null);
  private readonly _open = signal(false);
  private readonly _origin = signal<HTMLElement | null>(null);
  private panel: HTMLElement | null = null;

  readonly open = () => this._open();
  readonly origin = () => this._origin();

  setOrigin(el: HTMLElement | null): void {
    this._origin.set(el);
  }

  setPanel(el: HTMLElement | null): void {
    this.panel = el;
  }

  toggle(): void {
    this._open.update((v) => !v);
  }

  close(): void {
    this._open.set(false);
    this.activeSub.set(null);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this._open()) return;
    const target = event.target as Element | null;
    if (
      target &&
      !this.elementRef.nativeElement.contains(target) &&
      !this.panel?.contains(target) &&
      !target.closest?.(`[data-menu-id="${this.menuId}"]`)
    ) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this._open()) {
      this.close();
      this._origin()?.querySelector('button')?.focus();
    }
  }
}

/** The menu trigger: a ghost icon button (a plus by default) with a tooltip. */
@Component({
  selector: 'prompt-input-action-menu-trigger',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tooltip, TooltipContent, TooltipProvider, TooltipTrigger],
  template: `
    <gr-tooltip-provider>
      <gr-tooltip>
        <gr-tooltip-trigger>
          <button
            type="button"
            [class]="buttonClass()"
            [attr.aria-label]="ariaLabel()"
            aria-haspopup="menu"
            [attr.aria-expanded]="ctx.open()"
            [disabled]="isDisabled()"
            (click)="ctx.toggle()"
          >
            <ng-content>
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
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </ng-content>
          </button>
        </gr-tooltip-trigger>
        @if (tooltip()) {
          <gr-tooltip-content>{{ tooltip() }}</gr-tooltip-content>
        }
      </gr-tooltip>
    </gr-tooltip-provider>
  `,
  host: { class: 'inline-flex' },
})
export class PromptInputActionMenuTrigger {
  protected readonly ctx = inject(PROMPT_INPUT_ACTION_MENU);
  private readonly parent = inject(PromptInput, { optional: true });
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  /** Accessible name. Mirrors React `aria-label`. */
  readonly ariaLabel = input<string>('More actions');
  /** Tooltip text (shown on hover and focus). Mirrors React `tooltip`. */
  readonly tooltip = input<string | null>(null);
  readonly disabled = input<boolean>(false);
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  constructor() {
    queueMicrotask(() => this.ctx.setOrigin(this.elementRef.nativeElement));
  }

  protected isDisabled(): boolean {
    return this.disabled() || (this.parent?.disabled() ?? false);
  }

  // Same surface as prompt-input-button (ghost, icon-sm): secondary text at
  // rest, hover changes only the background.
  protected buttonClass(): string {
    return cn(
      'inline-flex size-8 shrink-0 items-center justify-center rounded-sm bg-transparent text-secondary-foreground transition-colors hover:bg-muted aria-expanded:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-input/30 dark:aria-expanded:bg-input/30',
      this.class(),
    );
  }
}

/** The menu panel: rendered in the CDK overlay, below the trigger. */
@Component({
  selector: 'prompt-input-action-menu-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkConnectedOverlay],
  template: `
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="ctx.origin()!"
      [cdkConnectedOverlayOpen]="ctx.open() && !!ctx.origin()"
      [cdkConnectedOverlayPositions]="positions"
      [cdkConnectedOverlayViewportMargin]="8"
      (attach)="onAttach()"
      (detach)="ctx.close()"
    >
      <div
        #panel
        role="menu"
        tabindex="-1"
        data-slot="prompt-input-action-menu-content"
        [attr.data-menu-id]="ctx.menuId"
        [class]="panelClass()"
        (keydown)="onKeydown($event)"
      >
        <ng-content />
      </div>
    </ng-template>
  `,
  host: { class: 'contents' },
})
export class PromptInputActionMenuContent {
  protected readonly ctx = inject(PROMPT_INPUT_ACTION_MENU);
  protected readonly positions = MENU_BELOW_START;
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  @ViewChild('panel') private panelRef?: ElementRef<HTMLElement>;

  protected panelClass(): string {
    return cn(
      'min-w-[12rem] origin-top-left overflow-hidden rounded-md border border-border bg-popover-surface p-1 text-popover-foreground shadow-md outline-none motion-safe:animate-[gremorie-pop-in_120ms_ease-out]',
      this.class(),
    );
  }

  protected onAttach(): void {
    queueMicrotask(() => {
      const panel = this.panelRef?.nativeElement ?? null;
      this.ctx.setPanel(panel);
      this.items()[0]?.focus();
    });
  }

  private items(): HTMLElement[] {
    const panel = this.panelRef?.nativeElement;
    return panel
      ? Array.from(
          panel.querySelectorAll<HTMLElement>(
            '[role=menuitem]:not([disabled]),[role=menuitemcheckbox]:not([disabled])',
          ),
        )
      : [];
  }

  /** Arrow keys move between items, Home and End jump, Tab closes. */
  protected onKeydown(event: KeyboardEvent): void {
    const items = this.items();
    const i = items.indexOf(document.activeElement as HTMLElement);
    const go = (n: number) => {
      event.preventDefault();
      items[(n + items.length) % items.length]?.focus();
    };
    if (event.key === 'ArrowDown') go(i + 1);
    else if (event.key === 'ArrowUp') go(i - 1);
    else if (event.key === 'Home') go(0);
    else if (event.key === 'End') go(items.length - 1);
    else if (event.key === 'Tab') this.ctx.close();
  }
}

/** One action in the menu. Selecting it runs `select` and closes the menu. */
@Component({
  selector: 'prompt-input-action-menu-item',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      role="menuitem"
      tabindex="-1"
      [class]="itemClass()"
      [disabled]="disabled()"
      (click)="run()"
    >
      <ng-content />
    </button>
  `,
  host: { class: 'block' },
})
export class PromptInputActionMenuItem {
  private readonly ctx = inject(PROMPT_INPUT_ACTION_MENU);
  readonly disabled = input<boolean>(false);
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');
  /** Fires when the item is chosen. Mirrors React `onSelect` (`select` is a DOM event name). */
  readonly selected = output<void>();

  protected itemClass(): string {
    return cn(ITEM_CLASS, this.class());
  }

  protected run(): void {
    this.selected.emit();
    this.ctx.close();
  }
}

/**
 * A menu row that toggles a tool on and off (e.g. Search the web), with a
 * switch on the right. The row itself is the control (`menuitemcheckbox`), so
 * the switch is drawn, not interactive; toggling keeps the menu open. Bind
 * `checked` to the same state as the inline toggle. Mirrors React
 * `PromptInputActionMenuSwitchItem`.
 */
@Component({
  selector: 'prompt-input-action-menu-switch-item',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      role="menuitemcheckbox"
      tabindex="-1"
      [attr.aria-checked]="checked()"
      [class]="itemClass()"
      [disabled]="disabled()"
      (click)="checked.set(!checked())"
    >
      <span class="flex items-center gap-2"><ng-content /></span>
      <!-- Same look as gr-switch (size sm); keep in lock-step with ng-forms. -->
      <span
        aria-hidden="true"
        data-slot="switch"
        [attr.data-state]="checked() ? 'checked' : 'unchecked'"
        class="inline-flex h-4 w-7 shrink-0 items-center rounded-full border-2 border-transparent transition-all data-[state=checked]:bg-switch-checked data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80"
      >
        <span
          [attr.data-state]="checked() ? 'checked' : 'unchecked'"
          class="pointer-events-none block size-3 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0"
        ></span>
      </span>
    </button>
  `,
  host: { class: 'block' },
})
export class PromptInputActionMenuSwitchItem {
  /** On/off. Two-way bindable; mirrors React `checked` + `onCheckedChange`. */
  readonly checked = model<boolean>(false);
  readonly disabled = input<boolean>(false);
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected itemClass(): string {
    return cn(ITEM_CLASS, 'justify-between gap-4', this.class());
  }
}

/** Opens the composer's file dialog. Mirrors React `PromptInputActionAddAttachments`. */
@Component({
  selector: 'prompt-input-action-add-attachments',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      role="menuitem"
      tabindex="-1"
      [class]="itemClass"
      (click)="fileInput.click()"
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
        <!-- Paperclip, as the inline attach button: one action, one icon. -->
        <path
          d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"
        />
      </svg>
      {{ label() }}
    </button>
    <input
      #fileInput
      type="file"
      class="hidden"
      multiple
      aria-hidden="true"
      tabindex="-1"
      [attr.accept]="accept()"
      (change)="onChange($event)"
    />
  `,
  host: { class: 'block' },
})
export class PromptInputActionAddAttachments {
  private readonly parent = inject(PromptInput, { optional: true });
  private readonly ctx = inject(PROMPT_INPUT_ACTION_MENU);
  /** Row label. Mirrors React `label`. */
  readonly label = input<string>('Add photos or files');
  protected readonly itemClass = ITEM_CLASS;

  protected accept(): string | null {
    const accept = this.parent?.acceptAttachments();
    return accept && accept.length > 0 ? accept.join(',') : null;
  }

  protected onChange(event: Event): void {
    const el = event.target as HTMLInputElement;
    if (el.files && el.files.length > 0) {
      this.parent?.addFiles(Array.from(el.files));
    }
    el.value = '';
    this.ctx.close();
  }
}

// ---------------------------------------------------------------------------
// Submenus (e.g. Mode ›, Model ›) and choice rows, for a menu that gathers the
// composer's controls (the one-row composer's "+"). Mirrors the React parts
// built on Radix DropdownMenuSub / RadioGroup / RadioItem / CheckboxItem.
// ---------------------------------------------------------------------------

export interface PromptInputActionMenuSubContext {
  readonly open: () => boolean;
  readonly origin: () => HTMLElement | null;
  setOrigin(el: HTMLElement | null): void;
  show(): void;
  hide(): void;
}

export const PROMPT_INPUT_ACTION_MENU_SUB =
  new InjectionToken<PromptInputActionMenuSubContext>(
    'PromptInputActionMenuSub',
  );

/** A submenu: holds a sub trigger and its content. One open at a time. */
@Component({
  selector: 'prompt-input-action-menu-sub',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: PROMPT_INPUT_ACTION_MENU_SUB,
      useExisting: forwardRef(() => PromptInputActionMenuSub),
    },
  ],
  template: `<ng-content />`,
  host: { class: 'block' },
})
export class PromptInputActionMenuSub implements PromptInputActionMenuSubContext {
  private readonly menu = inject(PROMPT_INPUT_ACTION_MENU);
  private readonly _origin = signal<HTMLElement | null>(null);
  readonly open = computed(
    () => this.menu.open() && this.menu.activeSub() === this,
  );
  readonly origin = () => this._origin();

  setOrigin(el: HTMLElement | null): void {
    this._origin.set(el);
  }

  show(): void {
    this.menu.activeSub.set(this);
  }

  hide(): void {
    if (this.menu.activeSub() === this) this.menu.activeSub.set(null);
  }
}

/** The row that opens a submenu: label, current value (muted), chevron. */
@Component({
  selector: 'prompt-input-action-menu-sub-trigger',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      #btn
      type="button"
      role="menuitem"
      tabindex="-1"
      aria-haspopup="menu"
      [attr.aria-expanded]="sub.open()"
      [class]="itemClass"
      (click)="sub.show()"
      (mouseenter)="sub.show()"
      (keydown.arrowright)="openWithKeyboard($event)"
      (keydown.enter)="openWithKeyboard($event)"
    >
      <ng-content />
      @if (value()) {
        <span
          class="ml-auto min-w-0 truncate whitespace-nowrap pl-4 text-muted-foreground"
          >{{ value() }}</span
        >
      }
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        [class]="value() ? 'size-4' : 'ml-auto size-4'"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </button>
  `,
  host: { class: 'block' },
})
export class PromptInputActionMenuSubTrigger {
  protected readonly sub = inject(PROMPT_INPUT_ACTION_MENU_SUB);
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  /** Current value, shown muted on the right (e.g. "Research"). Mirrors React `value`. */
  readonly value = input<string | number | null | undefined>(null);
  protected readonly itemClass = ITEM_CLASS + ' aria-expanded:bg-accent';

  constructor() {
    queueMicrotask(() => this.sub.setOrigin(this.elementRef.nativeElement));
  }

  protected openWithKeyboard(event: Event): void {
    event.preventDefault();
    this.sub.show();
    queueMicrotask(() =>
      document
        .querySelector<HTMLElement>(
          '[data-slot=prompt-input-action-menu-sub-content] [role^=menuitem]',
        )
        ?.focus(),
    );
  }
}

/** The submenu panel: CDK overlay to the right of its trigger (left if no room). */
@Component({
  selector: 'prompt-input-action-menu-sub-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkConnectedOverlay],
  template: `
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="sub.origin()!"
      [cdkConnectedOverlayOpen]="sub.open() && !!sub.origin()"
      [cdkConnectedOverlayPositions]="positions"
      [cdkConnectedOverlayViewportMargin]="8"
    >
      <div
        role="menu"
        tabindex="-1"
        data-slot="prompt-input-action-menu-sub-content"
        [attr.data-menu-id]="menu.menuId"
        class="min-w-[10rem] origin-top-left overflow-hidden rounded-md border border-border bg-popover-surface p-1 text-popover-foreground shadow-md outline-none motion-safe:animate-[gremorie-pop-in_120ms_ease-out]"
        (keydown)="onKeydown($event)"
      >
        <ng-content />
      </div>
    </ng-template>
  `,
  host: { class: 'contents' },
})
export class PromptInputActionMenuSubContent {
  protected readonly sub = inject(PROMPT_INPUT_ACTION_MENU_SUB);
  protected readonly menu = inject(PROMPT_INPUT_ACTION_MENU);
  protected readonly positions: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'top',
      offsetX: 4,
      offsetY: -5,
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'top',
      offsetX: -4,
      offsetY: -5,
    },
  ];

  /** Up/Down move, Left goes back to the parent row. */
  protected onKeydown(event: KeyboardEvent): void {
    const panel = event.currentTarget as HTMLElement;
    const items = Array.from(
      panel.querySelectorAll<HTMLElement>('[role^=menuitem]:not([disabled])'),
    );
    const i = items.indexOf(document.activeElement as HTMLElement);
    const go = (n: number) => {
      event.preventDefault();
      items[(n + items.length) % items.length]?.focus();
    };
    if (event.key === 'ArrowDown') go(i + 1);
    else if (event.key === 'ArrowUp') go(i - 1);
    else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.sub.hide();
      this.sub.origin()?.querySelector('button')?.focus();
    }
  }
}

export interface PromptInputActionMenuRadioGroupContext {
  readonly value: () => string | null;
  select(value: string): void;
}

export const PROMPT_INPUT_ACTION_MENU_RADIO_GROUP =
  new InjectionToken<PromptInputActionMenuRadioGroupContext>(
    'PromptInputActionMenuRadioGroup',
  );

/** One-of-many choice inside a (sub)menu. Two-way `[(value)]`. Mirrors React `RadioGroup`. */
@Component({
  selector: 'prompt-input-action-menu-radio-group',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: PROMPT_INPUT_ACTION_MENU_RADIO_GROUP,
      useExisting: forwardRef(() => PromptInputActionMenuRadioGroup),
    },
  ],
  template: `<ng-content />`,
  host: { role: 'group', class: 'block' },
})
export class PromptInputActionMenuRadioGroup implements PromptInputActionMenuRadioGroupContext {
  readonly selected = model<string | null>(null, { alias: 'value' });
  readonly value = () => this.selected();

  select(value: string): void {
    this.selected.set(value);
  }
}

const CHOICE_CLASS = ITEM_CLASS + ' pl-8';
const INDICATOR =
  'pointer-events-none absolute left-2 flex size-3.5 items-center justify-center';

/** A choice in a radio group; choosing it closes the menu. Mirrors React `RadioItem`. */
@Component({
  selector: 'prompt-input-action-menu-radio-item',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      role="menuitemradio"
      tabindex="-1"
      [attr.aria-checked]="checked()"
      [class]="itemClass"
      (click)="choose()"
    >
      <span [class]="indicator">
        @if (checked()) {
          <span class="size-2 rounded-full bg-current"></span>
        }
      </span>
      <ng-content />
    </button>
  `,
  host: { class: 'block' },
})
export class PromptInputActionMenuRadioItem {
  private readonly group = inject(PROMPT_INPUT_ACTION_MENU_RADIO_GROUP);
  private readonly menu = inject(PROMPT_INPUT_ACTION_MENU);
  readonly value = input.required<string>();
  protected readonly checked = computed(
    () => this.group.value() === this.value(),
  );
  protected readonly itemClass = CHOICE_CLASS;
  protected readonly indicator = INDICATOR;

  protected choose(): void {
    this.group.select(this.value());
    this.menu.close();
  }
}

/** A checkable row; toggling keeps the menu open. Mirrors React `CheckboxItem`. */
@Component({
  selector: 'prompt-input-action-menu-checkbox-item',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      role="menuitemcheckbox"
      tabindex="-1"
      [attr.aria-checked]="checked()"
      [class]="itemClass"
      (click)="checked.set(!checked())"
    >
      <span [class]="indicator">
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
    </button>
  `,
  host: { class: 'block' },
})
export class PromptInputActionMenuCheckboxItem {
  readonly checked = model<boolean>(false);
  protected readonly itemClass = CHOICE_CLASS;
  protected readonly indicator = INDICATOR;
}

/** A divider between groups of rows. Mirrors React `DropdownMenuSeparator`. */
@Component({
  selector: 'prompt-input-action-menu-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  host: { role: 'separator', class: '-mx-1 my-1 block h-px bg-border' },
})
export class PromptInputActionMenuSeparator {}
