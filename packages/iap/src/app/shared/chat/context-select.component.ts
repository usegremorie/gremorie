import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@shadng/core';
import { IapChatService } from '../../services/iap-chat.service';
import {
  SupabaseService,
  type ContextGroup,
  type ContextItem,
} from '../../services/supabase.service';

const DATE_FMT = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

function formatDate(value: string | null): string {
  if (!value) return '';
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? '' : DATE_FMT.format(parsed);
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

/**
 * Menu "Selecionar contexto" do IAP. Lista dinamicamente avaliações, PDIs,
 * pesquisas e departamentos reais do Supabase, agrupados, com busca.
 * Seleção é múltipla e mantida no IapChatService — por ora apenas visual,
 * ainda não enviada ao backend.
 */
@Component({
  selector: 'iap-context-select',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" [class]="triggerClass()" (click)="toggle()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-4 shrink-0">
        <circle cx="12" cy="12" r="4" />
        <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
      </svg>
      Selecionar contexto
      @if (selectedCount() > 0) {
        <span class="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
          {{ selectedCount() }}
        </span>
      }
    </button>

    @if (open()) {
      <div [class]="dropdownClass()">
        <!-- Busca -->
        <div class="flex items-center gap-2 border-b border-border px-3 py-2.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-4 shrink-0 text-muted-foreground">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            [value]="query()"
            (input)="onSearch($event)"
            placeholder="Busque avaliações, Pesquisas, PDIs e mais…"
            class="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        <!-- Lista -->
        <div class="max-h-[20rem] overflow-y-auto p-1.5">
          @if (loading()) {
            <p class="px-2.5 py-6 text-center text-sm text-muted-foreground">Carregando…</p>
          } @else if (filteredGroups().length === 0) {
            <p class="px-2.5 py-6 text-center text-sm text-muted-foreground">Nenhum item encontrado.</p>
          } @else {
            @for (group of filteredGroups(); track group.type) {
              <p class="px-2.5 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {{ group.label }}
              </p>
              @for (item of group.items; track item.id) {
                <button
                  type="button"
                  [attr.aria-pressed]="isSelected(item.id)"
                  [class]="optionClass(item.id)"
                  (click)="toggleItem(item)"
                >
                  @switch (group.type) {
                    @case ('pdi') {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-4 shrink-0 text-muted-foreground">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="13" y2="17" />
                      </svg>
                    }
                    @case ('survey') {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-4 shrink-0 text-muted-foreground">
                        <line x1="6" y1="20" x2="6" y2="14" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="18" y1="20" x2="18" y2="10" />
                      </svg>
                    }
                    @case ('department') {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-4 shrink-0 text-muted-foreground">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    }
                    @default {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-4 shrink-0 text-muted-foreground">
                        <rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M8 11h8M8 15h5" />
                      </svg>
                    }
                  }
                  <span class="flex min-w-0 flex-1 flex-col text-left">
                    <span class="truncate font-medium">{{ item.name }}</span>
                    @if (item.date) {
                      <span class="truncate text-xs text-muted-foreground">{{ formatDate(item.date) }}</span>
                    }
                  </span>
                  @if (isSelected(item.id)) {
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-4 shrink-0 text-primary">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  }
                </button>
              }
            }
          }
        </div>
      </div>
    }
  `,
  host: {
    class: 'relative inline-flex',
  },
})
export class ContextSelect {
  private readonly supabaseService = inject(SupabaseService);
  private readonly chatService = inject(IapChatService);
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  protected readonly open = signal(false);
  protected readonly openUp = signal(false);
  protected readonly query = signal('');
  protected readonly loading = signal(false);
  protected readonly groups = signal<ContextGroup[]>([]);

  protected readonly formatDate = formatDate;

  protected readonly dropdownClass = computed(() =>
    cn(
      'absolute left-0 z-50 w-[28rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg motion-safe:animate-[shadng-pop-in_120ms_ease-out]',
      this.openUp()
        ? 'bottom-full mb-2 origin-bottom-left'
        : 'top-full mt-2 origin-top-left',
    ),
  );

  protected readonly selectedCount = computed(
    () => this.chatService.selectedContext().length,
  );

  protected readonly filteredGroups = computed<ContextGroup[]>(() => {
    const q = normalize(this.query().trim());
    if (!q) return this.groups();
    return this.groups()
      .map((g) => ({
        ...g,
        items: g.items.filter((i) => normalize(i.name).includes(q)),
      }))
      .filter((g) => g.items.length > 0);
  });

  protected readonly triggerClass = computed(() =>
    cn(
      'inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      this.open() && 'bg-accent text-accent-foreground',
    ),
  );

  protected optionClass(id: string): string {
    return cn(
      'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors',
      this.isSelected(id)
        ? 'bg-accent text-accent-foreground'
        : 'text-foreground hover:bg-accent hover:text-accent-foreground',
    );
  }

  protected isSelected(id: string): boolean {
    return this.chatService.selectedContext().some((c) => c.id === id);
  }

  toggle(): void {
    const next = !this.open();
    if (next) {
      // Abre para cima quando não há espaço suficiente abaixo (ex: input no rodapé).
      const rect = this.elementRef.nativeElement.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const menuHeight = 420;
      this.openUp.set(spaceBelow < menuHeight && rect.top > spaceBelow);
      if (this.groups().length === 0) {
        void this.load();
      }
    }
    this.open.set(next);
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  toggleItem(item: ContextItem): void {
    this.chatService.selectedContext.update((selected) =>
      selected.some((c) => c.id === item.id)
        ? selected.filter((c) => c.id !== item.id)
        : [...selected, item],
    );
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    try {
      this.groups.set(await this.supabaseService.loadContextItems());
    } catch {
      this.groups.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.open()) return;
    const target = event.target as Node | null;
    if (target && !this.elementRef.nativeElement.contains(target)) {
      this.open.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open()) this.open.set(false);
  }
}
