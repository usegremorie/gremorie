import { NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  InjectionToken,
  input,
  model,
  signal,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';

/**
 * Shared state contract for the PromptInputSelect family, distributed via DI so
 * the trigger / value / content / item parts coordinate without prop drilling.
 */
export interface PromptInputSelectState {
  readonly value: () => string | null;
  readonly open: () => boolean;
  setValue: (value: string) => void;
  toggle: () => void;
  close: () => void;
  registerItemLabel: (value: string, label: string) => void;
  labelFor: (value: string | null) => string | null;
  registerItemIcon: (value: string, icon: TemplateRef<void> | null) => void;
  iconFor: (value: string | null) => TemplateRef<void> | null;
}

export const PROMPT_INPUT_SELECT = new InjectionToken<PromptInputSelectState>(
  'PromptInputSelectState',
);

/**
 * PromptInputSelect — generic styled select for the composer (mode + model).
 *
 * Mirrors the React `PromptInputSelect` compound (Trigger / Value / Content /
 * Item). APPROXIMATION: React builds on the brain/Radix Select; to keep `ng-ai`
 * free of the `@gremorie/ng-forms` dependency and consistent with the existing
 * lightweight `prompt-input-model-select`, this edition implements the popover,
 * outside-click and selection state inline with signals. Items may project a
 * leading icon (wrapped in an `<ng-template>`) plus their label; the trigger
 * reflects the selected item's icon AND label, exactly like Radix
 * `SelectValue` echoes the selected item's children in React.
 */
@Component({
  selector: 'prompt-input-select',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { class: 'relative inline-flex' },
  providers: [
    {
      provide: PROMPT_INPUT_SELECT,
      useExisting: forwardRef(() => PromptInputSelect),
    },
  ],
})
export class PromptInputSelect implements PromptInputSelectState {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  /** Two-way bindable selected value (mirrors React `defaultValue`/`value`). */
  readonly selected = model<string | null>(null, { alias: 'value' });

  private readonly _open = signal(false);
  private readonly labels = new Map<string, string>();
  private readonly icons = new Map<string, TemplateRef<void> | null>();
  private readonly labelVersion = signal(0);

  readonly value = () => this.selected();
  readonly open = () => this._open();

  setValue(value: string): void {
    this.selected.set(value);
    this.close();
  }

  toggle(): void {
    this._open.update((v) => !v);
  }

  close(): void {
    this._open.set(false);
  }

  registerItemLabel(value: string, label: string): void {
    this.labels.set(value, label);
    this.labelVersion.update((v) => v + 1);
  }

  labelFor(value: string | null): string | null {
    this.labelVersion();
    return value === null ? null : (this.labels.get(value) ?? null);
  }

  registerItemIcon(value: string, icon: TemplateRef<void> | null): void {
    this.icons.set(value, icon);
    this.labelVersion.update((v) => v + 1);
  }

  iconFor(value: string | null): TemplateRef<void> | null {
    this.labelVersion();
    return value === null ? null : (this.icons.get(value) ?? null);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this._open()) {
      return;
    }
    const target = event.target as Node | null;
    if (target && !this.elementRef.nativeElement.contains(target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this._open()) {
      this.close();
    }
  }
}

/**
 * Base classes of the React `SelectTrigger` (rx-forms) plus the rx-ai
 * `PromptInputSelectTrigger` overrides, applied in the same order so the
 * `cn()` merge result is identical. Keep in lock-step with
 * `packages/rx-forms/src/lib/select/select.tsx` and
 * `packages/rx-ai/src/lib/prompt-input/prompt-input.tsx`.
 */
const TRIGGER_BASE =
  "flex w-fit items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[placeholder]:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground";
const TRIGGER_PROMPT_OVERRIDES =
  'border-none bg-transparent font-medium text-muted-foreground shadow-none transition-colors hover:bg-accent hover:text-foreground aria-expanded:bg-accent aria-expanded:text-foreground';

@Component({
  selector: 'prompt-input-select-trigger',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      data-slot="select-trigger"
      [attr.data-size]="dataSize()"
      [attr.data-placeholder]="ctx.value() === null ? '' : null"
      [class]="triggerClass()"
      [attr.aria-label]="ariaLabel()"
      aria-haspopup="listbox"
      [attr.aria-expanded]="ctx.open()"
      (click)="ctx.toggle()"
    >
      <ng-content />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="size-4 opacity-50"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  `,
  host: { class: 'contents' },
})
export class PromptInputSelectTrigger {
  protected readonly ctx = inject(PROMPT_INPUT_SELECT);
  readonly ariaLabel = input<string>('');
  readonly size = input<'sm' | 'md'>('sm');
  readonly class = input<string>('');

  protected readonly dataSize = computed(() =>
    this.size() === 'sm' ? 'sm' : 'default',
  );

  protected readonly triggerClass = computed(() =>
    cn(TRIGGER_BASE, TRIGGER_PROMPT_OVERRIDES, this.class()),
  );
}

/**
 * PromptInputSelectValue — echoes the selected item (icon + label) inside the
 * trigger, like Radix `SelectValue`. The layout (flex / items-center / gap-2 /
 * line-clamp-1) comes from the trigger's `*:data-[slot=select-value]:*` rules,
 * matching React.
 */
@Component({
  selector: 'prompt-input-select-value',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  template: `
    @if (icon(); as tpl) {
      <ng-container [ngTemplateOutlet]="tpl" />
    }
    {{ display() }}
  `,
  host: { 'data-slot': 'select-value', class: 'pointer-events-none' },
})
export class PromptInputSelectValue {
  private readonly ctx = inject(PROMPT_INPUT_SELECT);
  readonly placeholder = input<string>('');
  protected readonly display = computed(
    () => this.ctx.labelFor(this.ctx.value()) ?? this.placeholder(),
  );
  protected readonly icon = computed(() => this.ctx.iconFor(this.ctx.value()));
}

@Component({
  selector: 'prompt-input-select-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (ctx.open()) {
      <div
        role="listbox"
        class="absolute left-0 top-full z-50 mt-1 w-max min-w-full origin-top-left overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md motion-safe:animate-[gremorie-pop-in_120ms_ease-out]"
      >
        <ng-content />
      </div>
    }
  `,
  host: { class: 'contents' },
})
export class PromptInputSelectContent {
  protected readonly ctx = inject(PROMPT_INPUT_SELECT);
}

/**
 * PromptInputSelectItem — one option row. Mirrors the React `SelectItem`
 * anatomy: leading icon (projected via an `<ng-template>`), label text, and a
 * trailing check indicator in an absolutely positioned `right-2` span. The
 * icon template is registered with the select root so the trigger can echo it
 * when the item is selected.
 */
@Component({
  selector: 'prompt-input-select-item',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  template: `
    <button
      type="button"
      role="option"
      data-slot="select-item"
      [attr.aria-selected]="isSelected()"
      class="relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground"
      (click)="select()"
    >
      <span
        data-slot="select-item-indicator"
        class="absolute right-2 flex size-3.5 items-center justify-center"
      >
        @if (isSelected()) {
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
      @if (icon(); as tpl) {
        <ng-container [ngTemplateOutlet]="tpl" />
      }
      <ng-content />
    </button>
  `,
  host: { class: 'block' },
})
export class PromptInputSelectItem implements AfterContentInit {
  protected readonly ctx = inject(PROMPT_INPUT_SELECT);
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  readonly value = input.required<string>();
  /** Explicit label for the trigger echo; falls back to the rendered text. */
  readonly label = input<string>('');

  /** Optional projected `<ng-template>` holding the item's leading icon. */
  protected readonly icon = contentChild(TemplateRef);

  protected readonly isSelected = computed(
    () => this.ctx.value() === this.value(),
  );

  ngAfterContentInit(): void {
    // Prefer the explicit label; otherwise read the rendered text so the trigger
    // value can echo the active item.
    const text =
      this.label() ||
      this.elementRef.nativeElement.textContent?.trim() ||
      this.value();
    this.ctx.registerItemLabel(this.value(), text);
    this.ctx.registerItemIcon(
      this.value(),
      (this.icon() as TemplateRef<void> | undefined) ?? null,
    );
  }

  select(): void {
    this.ctx.setValue(this.value());
  }
}
