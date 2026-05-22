import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  model,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@shadng/core';
import type { IapMode } from '../../services/iap-chat.service';

interface ModeOption {
  id: IapMode;
  label: string;
  description: string;
}

const MODES: readonly ModeOption[] = [
  {
    id: 'auto',
    label: 'Auto',
    description:
      'Detecta automaticamente se a entrada é uma pergunta ou pedido de análise',
  },
  {
    id: 'ask',
    label: 'Perguntar',
    description: 'Responde diretamente como uma pergunta sobre seus dados',
  },
  {
    id: 'analyse',
    label: 'Analisar',
    description: 'Faz uma análise aprofundada dos dados',
  },
];

/**
 * Seletor de modo do IAP (Auto / Perguntar / Analisar).
 * Dropdown abre para cima — fica no rodapé do prompt input.
 * Não usa o PromptInputModelSelect compartilhado porque precisa de
 * ícone por opção, estado selecionado destacado e tooltip de descrição.
 */
@Component({
  selector: 'iap-mode-select',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [class]="triggerClass()"
      [attr.aria-haspopup]="'listbox'"
      [attr.aria-expanded]="open() ? 'true' : 'false'"
      aria-label="Selecionar modo"
      (click)="toggle()"
    >
      @switch (value()) {
        @case ('ask') {
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-4 shrink-0">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
          </svg>
        }
        @case ('analyse') {
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-4 shrink-0">
            <line x1="6" y1="20" x2="6" y2="14" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="18" y1="20" x2="18" y2="10" />
          </svg>
        }
        @default {
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="size-4 shrink-0">
            <path d="M12 2.5l1.6 4.9a3 3 0 0 0 1.9 1.9l4.9 1.6-4.9 1.6a3 3 0 0 0-1.9 1.9L12 19.3l-1.6-4.9a3 3 0 0 0-1.9-1.9L3.6 10.9l4.9-1.6a3 3 0 0 0 1.9-1.9L12 2.5z" />
          </svg>
        }
      }
      <span class="truncate">{{ selectedLabel() }}</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-3.5 shrink-0 opacity-60">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>

    @if (open()) {
      <div
        role="listbox"
        aria-label="Modos"
        class="absolute bottom-full left-0 z-50 mb-2 min-w-[12rem] origin-bottom-left rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lg motion-safe:animate-[shadng-pop-in_120ms_ease-out]"
      >
        @for (option of modes; track option.id) {
          <button
            type="button"
            role="option"
            [attr.aria-selected]="value() === option.id ? 'true' : 'false'"
            [title]="option.description"
            [class]="optionClass(option)"
            (click)="select(option.id)"
          >
            @switch (option.id) {
              @case ('ask') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-4 shrink-0">
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
                </svg>
              }
              @case ('analyse') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-4 shrink-0">
                  <line x1="6" y1="20" x2="6" y2="14" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="18" y1="20" x2="18" y2="10" />
                </svg>
              }
              @default {
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="size-4 shrink-0">
                  <path d="M12 2.5l1.6 4.9a3 3 0 0 0 1.9 1.9l4.9 1.6-4.9 1.6a3 3 0 0 0-1.9 1.9L12 19.3l-1.6-4.9a3 3 0 0 0-1.9-1.9L3.6 10.9l4.9-1.6a3 3 0 0 0 1.9-1.9L12 2.5z" />
                </svg>
              }
            }
            <span class="flex-1 truncate text-left font-medium">{{ option.label }}</span>
            @if (value() === option.id) {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-4 shrink-0">
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
export class ModeSelect {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  readonly value = model<IapMode>('auto');

  protected readonly modes = MODES;
  protected readonly open = signal(false);

  protected readonly selectedLabel = computed(
    () => MODES.find((m) => m.id === this.value())?.label ?? 'Auto',
  );

  protected readonly triggerClass = computed(() =>
    cn(
      'inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground motion-safe:transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      this.open() && 'bg-accent text-accent-foreground',
    ),
  );

  protected optionClass(option: ModeOption): string {
    return cn(
      'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors',
      this.value() === option.id
        ? 'bg-primary text-primary-foreground'
        : 'text-foreground hover:bg-accent hover:text-accent-foreground',
    );
  }

  toggle(): void {
    this.open.update((v) => !v);
  }

  close(): void {
    this.open.set(false);
  }

  select(id: IapMode): void {
    this.value.set(id);
    this.close();
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.open()) return;
    const target = event.target as Node | null;
    if (target && !this.elementRef.nativeElement.contains(target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open()) this.close();
  }
}
