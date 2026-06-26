import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  InjectionToken,
  input,
  model,
  signal,
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
 * leading icon plus their label; the trigger reflects the selected item's label.
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

@Component({
  selector: 'prompt-input-select-trigger',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
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
        class="size-3.5 shrink-0 opacity-60"
      >
        <polyline points="6 9 12 15 18 9" />
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

  protected readonly triggerClass = computed(() =>
    cn(
      'inline-flex min-w-0 max-w-[12rem] items-center gap-2 rounded-md border border-input border-solid bg-transparent px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-expanded:bg-accent',
      this.size() === 'sm' ? 'h-8' : 'h-9',
      this.class(),
    ),
  );
}

@Component({
  selector: 'prompt-input-select-value',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="truncate">{{ display() }}</span>`,
  host: { class: 'inline-flex min-w-0 items-center gap-2' },
})
export class PromptInputSelectValue {
  private readonly ctx = inject(PROMPT_INPUT_SELECT);
  readonly placeholder = input<string>('');
  protected readonly display = computed(
    () => this.ctx.labelFor(this.ctx.value()) ?? this.placeholder(),
  );
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
        class="absolute left-0 top-9 z-50 mt-1 min-w-full origin-top-left overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md motion-safe:animate-[gremorie-pop-in_120ms_ease-out]"
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

@Component({
  selector: 'prompt-input-select-item',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      role="option"
      [attr.aria-selected]="isSelected()"
      class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:outline-none"
      (click)="select()"
    >
      <ng-content />
      @if (isSelected()) {
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          class="ml-auto size-4 shrink-0"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      }
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
  }

  select(): void {
    this.ctx.setValue(this.value());
  }
}
