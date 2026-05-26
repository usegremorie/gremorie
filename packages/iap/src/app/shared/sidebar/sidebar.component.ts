import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { BrnSeparatorImports } from '@spartan-ng/brain/separator';
import { ScrollAreaImports } from '@gremorie/ng-scroll-area';
import { IapChatService } from '../../services/iap-chat.service';
import { SupabaseService } from '../../services/supabase.service';
import type { Conversation } from '../../services/supabase.service';
import { ConversationItem } from './conversation-item.component';

interface ConversationGroup {
  label: string;
  items: Conversation[];
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

@Component({
  selector: 'iap-sidebar',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrnSeparatorImports, ConversationItem, ScrollAreaImports],
  template: `
    <aside class="flex h-full w-[280px] shrink-0 flex-col border-r border-border bg-background">
      <!-- Header: New Chat -->
      <div class="flex items-center gap-2 p-3">
        <button
          type="button"
          class="flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          (click)="newChat()"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-4 shrink-0">
            <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          Novo chat
        </button>
      </div>

      <!-- Search -->
      <div class="px-3 pb-2">
        <div class="relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Buscar conversas…"
            [value]="searchQuery()"
            (input)="onSearch($event)"
            class="w-full rounded-md border border-input bg-background py-1.5 pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background"
          />
        </div>
      </div>

      <brn-separator decorative class="block h-px bg-border" />

      <!-- Conversation list -->
      <ng-scrollbar gremorie appearance="compact" visibility="hover" class="flex-1">
        <nav class="flex flex-col gap-4 p-3" aria-label="Conversas">
          @if (supabaseService.authError(); as authErr) {
            <p class="text-xs text-destructive">Falha ao autenticar: {{ authErr }}</p>
          }

          @for (group of groupedConversations(); track group.label) {
            <div class="flex flex-col gap-0.5">
              <h2 class="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {{ group.label }}
              </h2>
              @for (conv of group.items; track conv.id) {
                <iap-conversation-item
                  [conversation]="conv"
                  [active]="chatService.conversationId() === conv.id"
                  (selected)="onConversationSelect($event)"
                />
              }
            </div>
          }

          @if (groupedConversations().length === 0) {
            <p class="px-2 text-xs text-muted-foreground">
              {{ searchQuery() ? 'Nenhuma conversa encontrada.' : 'Nenhuma conversa ainda.' }}
            </p>
          }
        </nav>
      </ng-scrollbar>
    </aside>
  `,
})
export class Sidebar {
  protected readonly chatService = inject(IapChatService);
  protected readonly supabaseService = inject(SupabaseService);

  protected readonly searchQuery = signal('');

  protected readonly groupedConversations = computed<ConversationGroup[]>(() => {
    const query = this.searchQuery().toLowerCase();
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const filtered = this.supabaseService.conversations().filter((c) =>
      query ? c.title.toLowerCase().includes(query) : true,
    );

    const groups: ConversationGroup[] = [
      { label: 'Hoje', items: [] },
      { label: 'Ontem', items: [] },
      { label: 'Últimos 7 dias', items: [] },
      { label: 'Mais antigas', items: [] },
    ];

    for (const conv of filtered) {
      const d = new Date(conv.updated_at);
      if (isSameDay(d, now)) {
        groups[0].items.push(conv);
      } else if (isSameDay(d, yesterday)) {
        groups[1].items.push(conv);
      } else if (d >= sevenDaysAgo) {
        groups[2].items.push(conv);
      } else {
        groups[3].items.push(conv);
      }
    }

    return groups.filter((g) => g.items.length > 0);
  });

  protected onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  protected newChat(): void {
    this.chatService.reset();
  }

  protected onConversationSelect(conv: Conversation): void {
    void this.chatService.loadConversation(conv.id);
  }
}
