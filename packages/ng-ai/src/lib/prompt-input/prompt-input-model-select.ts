import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { cva } from 'class-variance-authority';

import { PromptInput } from './prompt-input';
import { PromptInputModelOption } from './prompt-input.types';

const triggerVariants = cva(
  'inline-flex h-9 min-w-0 max-w-[12rem] items-center gap-2 rounded-md px-2.5 text-sm font-medium bg-transparent text-foreground motion-safe:transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      open: {
        true: 'bg-accent text-accent-foreground',
        false: '',
      },
    },
    defaultVariants: { open: false },
  },
);

const optionVariants = cva(
  'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:bg-accent focus-visible:text-accent-foreground disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      selected: {
        true: 'bg-accent text-accent-foreground',
        false: '',
      },
    },
    defaultVariants: { selected: false },
  },
);

/**
 * v0.1 implementation — minimal select.
 * v0.2+ will migrate to @spartan-ng/brain/select for full a11y/keyboard
 * (combobox ARIA pattern, typeahead, etc).
 */
@Component({
  selector: 'prompt-input-model-select',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [class]="triggerClass()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-haspopup]="'listbox'"
      [attr.aria-expanded]="open() ? 'true' : 'false'"
      [disabled]="isDisabled()"
      (click)="toggle()"
    >
      <span class="truncate">{{ selectedLabel() }}</span>
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

    @if (open()) {
      <div
        role="listbox"
        [attr.aria-label]="ariaLabel()"
        class="absolute z-50 mt-2 min-w-full origin-top-left rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md motion-safe:animate-[gremorie-pop-in_120ms_ease-out]"
        [style.top.px]="menuTopOffset"
      >
        @for (option of options(); track option.id) {
          <button
            type="button"
            role="option"
            [attr.aria-selected]="value() === option.id ? 'true' : 'false'"
            [attr.aria-disabled]="option.disabled ? 'true' : null"
            [disabled]="option.disabled"
            [class]="optionClass(option)"
            (click)="select(option)"
          >
            <span class="flex min-w-0 flex-1 flex-col items-start text-left">
              <span class="flex w-full items-center justify-between gap-2">
                <span class="truncate font-medium">{{ option.label }}</span>
                @if (option.badge) {
                  <span
                    class="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    {{ option.badge }}
                  </span>
                }
              </span>
              @if (option.description) {
                <span class="truncate text-xs text-muted-foreground">{{
                  option.description
                }}</span>
              }
            </span>
            @if (value() === option.id) {
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
                class="size-4 shrink-0 text-foreground"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            }
          </button>
        }
      </div>
    }
  `,
  host: {
    class: 'relative inline-flex',
  },
})
export class PromptInputModelSelect {
  private readonly parent = inject(PromptInput, { optional: true });
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  readonly options = input.required<readonly PromptInputModelOption[]>();
  readonly value = model<string | null>(null);
  readonly placeholder = input<string>('Choose model');
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string>('Select model');

  protected readonly open = signal(false);
  protected readonly menuTopOffset = 36;

  protected readonly selectedLabel = computed(() => {
    const id = this.value();
    if (id === null) {
      return this.placeholder();
    }
    const found = this.options().find((opt) => opt.id === id);
    return found?.label ?? this.placeholder();
  });

  protected readonly triggerClass = () =>
    triggerVariants({ open: this.open() });

  protected optionClass(option: PromptInputModelOption): string {
    return optionVariants({ selected: this.value() === option.id });
  }

  protected isDisabled(): boolean {
    return this.disabled() || (this.parent?.disabled() ?? false);
  }

  toggle(): void {
    this.open.update((v) => !v);
  }

  close(): void {
    this.open.set(false);
  }

  select(option: PromptInputModelOption): void {
    if (option.disabled) {
      return;
    }
    this.value.set(option.id);
    this.close();
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.open()) {
      return;
    }
    const target = event.target as Node | null;
    if (target && !this.elementRef.nativeElement.contains(target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open()) {
      this.close();
    }
  }
}
